/**
 * Outbox Sync Engine para a Plataforma Mall (Centro Fashion)
 * Arquitetura Offline-First com idêntica garantia de mutação local e envio assíncrono.
 *
 * A fila de mutações agora é PERSISTIDA no adaptador de storage ativo
 * (localStorage na web / SQLite no nativo), sobrevivendo a restart do app.
 */

import type { OfflineStorageAdapter } from '../storage/OfflineStorageAdapter';
import { apiFetch } from '../services/apiClient';

export interface OutboxMutation {
  clientMutationId: string; // UUID v4 gerado no cliente
  entityType: 'signage' | 'inspection' | 'media';
  actionType: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, any>;
  createdAt: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
}

export interface SyncPushResponse {
  success: boolean;
  results?: { clientMutationId: string; status: string }[];
  syncedAt?: string;
  error?: string;
}

export interface SyncPullResponse {
  timestamp: string;
  changes: {
    signage: {
      created: Record<string, any>[];
      updated: Record<string, any>[];
      deleted: Record<string, any>[];
    };
    inspections: {
      created: Record<string, any>[];
      updated: Record<string, any>[];
      deleted: Record<string, any>[];
    };
  };
}

export class OutboxSyncEngine {
  private queue: OutboxMutation[] = [];
  private isSyncing: boolean = false;
  private apiBaseUrl: string;
  private adapter: OfflineStorageAdapter | null = null;
  private hydrated: boolean = false;

  constructor(
    apiBaseUrl: string = 'https://api-mall.ideiasmkt.com.br/api/v1/sync',
    adapter?: OfflineStorageAdapter
  ) {
    this.apiBaseUrl = apiBaseUrl;
    this.adapter = adapter ?? null;
  }

  /**
   * Hidrata a fila a partir do storage persistido (chamar uma vez na inicialização).
   */
  public async init(): Promise<void> {
    if (this.hydrated) return;
    if (!this.adapter) {
      this.hydrated = true;
      return;
    }
    try {
      const stored = await this.adapter.getMutations();
      this.queue = Array.isArray(stored) ? stored : [];
      console.log(`[OutboxEngine] Fila hidratada do storage: ${this.queue.length} mutação(ões).`);
    } catch (e: any) {
      console.error('[OutboxEngine] Falha ao hidratar fila do storage:', e.message);
      this.queue = [];
    }
    this.hydrated = true;
  }

  private async persist(): Promise<void> {
    if (!this.adapter) return;
    try {
      await this.adapter.saveMutations(this.queue);
    } catch (e: any) {
      console.error('[OutboxEngine] Falha ao persistir fila no storage:', e.message);
    }
  }

  /**
   * Grava a mutação localmente (Garantia Offline) e persiste imediatamente.
   * clientMutationId opcional: permite correlacionar com o evento visível na fila Outbox da UI.
   */
  public async addMutation(
    entityType: 'signage' | 'inspection' | 'media',
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    payload: Record<string, any>,
    clientMutationId?: string
  ): Promise<OutboxMutation> {
    const mutation: OutboxMutation = {
      clientMutationId: clientMutationId || this.generateUUID(),
      entityType,
      actionType,
      payload,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      retryCount: 0,
    };

    this.queue.push(mutation);
    await this.persist();
    console.log(`[OutboxEngine] Mutação registrada offline (ID: ${mutation.clientMutationId})`);
    return mutation;
  }

  /**
   * Executa a sincronização delta com a VPS.
   * Envia mutações PENDING e FAILED (retry automático com backoff do apiClient).
   */
  public async syncWithServer(deviceId: string): Promise<{ success: boolean; syncedCount: number }> {
    if (this.isSyncing) {
      console.log('[OutboxEngine] Sincronização já em andamento...');
      return { success: false, syncedCount: 0 };
    }

    const pending = this.queue.filter((m) => m.status === 'PENDING' || m.status === 'FAILED');
    if (pending.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    this.isSyncing = true;
    console.log(`[OutboxEngine] Enviando ${pending.length} mutações para ${this.apiBaseUrl}/push...`);

    try {
      const data = await apiFetch<SyncPushResponse>(`${this.apiBaseUrl}/push`, {
        method: 'POST',
        body: {
          deviceId,
          mutations: pending.map((m) => ({
            clientMutationId: m.clientMutationId,
            entityType: m.entityType,
            actionType: m.actionType,
            payload: m.payload,
            createdAt: m.createdAt,
          })),
        },
      });

      let syncedCount = 0;

      if (data.results && Array.isArray(data.results)) {
        for (const res of data.results) {
          const item = this.queue.find((m) => m.clientMutationId === res.clientMutationId);
          if (item) {
            item.status = 'SYNCED';
            syncedCount++;
          }
        }
      }

      await this.persist();
      console.log(`[OutboxEngine] Sincronização concluída com sucesso! (${syncedCount} itens sincronizados)`);
      this.isSyncing = false;
      return { success: true, syncedCount };
    } catch (err: any) {
      console.error('[OutboxEngine] Falha ao sincronizar com servidor VPS:', err.message);
      pending.forEach((m) => {
        m.status = 'FAILED';
        m.retryCount += 1;
      });
      await this.persist();
      this.isSyncing = false;
      return { success: false, syncedCount: 0 };
    }
  }

  /**
   * Puxa alterações delta do servidor desde lastPulledAt (cursor opcional).
   */
  public async pullFromServer(lastPulledAt?: string | null): Promise<SyncPullResponse> {
    const query = lastPulledAt ? `?lastPulledAt=${encodeURIComponent(lastPulledAt)}` : '';
    console.log(`[OutboxEngine] Puxando delta de ${this.apiBaseUrl}/pull${query}...`);
    return apiFetch<SyncPullResponse>(`${this.apiBaseUrl}/pull${query}`, { method: 'GET' });
  }

  public getPendingQueue(): OutboxMutation[] {
    return this.queue.filter((m) => m.status === 'PENDING');
  }

  public getQueue(): OutboxMutation[] {
    return [...this.queue];
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
