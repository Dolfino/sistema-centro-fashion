/**
 * Outbox Sync Engine para a Plataforma Mall (Centro Fashion)
 * Arquitetura Offline-First com idêntica garantia de mutação local e envio assíncrono.
 */

export interface OutboxMutation {
  clientMutationId: string; // UUID v4 gerado no cliente
  entityType: 'signage' | 'inspection' | 'media';
  actionType: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, any>;
  createdAt: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
}

export class OutboxSyncEngine {
  private queue: OutboxMutation[] = [];
  private isSyncing: boolean = false;
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = 'https://api-mall.ideiasmkt.com.br/api/v1/sync') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Grava a mutação localmente (Garantia Offline)
   */
  public async addMutation(
    entityType: 'signage' | 'inspection' | 'media',
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    payload: Record<string, any>
  ): Promise<OutboxMutation> {
    const mutation: OutboxMutation = {
      clientMutationId: this.generateUUID(),
      entityType,
      actionType,
      payload,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      retryCount: 0,
    };

    this.queue.push(mutation);
    console.log(`[OutboxEngine] Mutação registrada offline (ID: ${mutation.clientMutationId})`);
    return mutation;
  }

  /**
   * Executa a sincronização delta com a VPS
   */
  public async syncWithServer(deviceId: string): Promise<{ success: boolean; syncedCount: number }> {
    if (this.isSyncing) {
      console.log('[OutboxEngine] Sincronização já em andamento...');
      return { success: false, syncedCount: 0 };
    }

    const pending = this.queue.filter((m) => m.status === 'PENDING');
    if (pending.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    this.isSyncing = true;
    console.log(`[OutboxEngine] Enviando ${pending.length} mutações para ${this.apiBaseUrl}/push...`);

    try {
      const response = await fetch(`${this.apiBaseUrl}/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          mutations: pending,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
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

      console.log(`[OutboxEngine] Sincronização concluída com sucesso! (${syncedCount} itens sincronizados)`);
      this.isSyncing = false;
      return { success: true, syncedCount };
    } catch (err: any) {
      console.error('[OutboxEngine] Falha ao sincronizar com servidor VPS:', err.message);
      this.isSyncing = false;
      return { success: false, syncedCount: 0 };
    }
  }

  public getPendingQueue(): OutboxMutation[] {
    return this.queue.filter((m) => m.status === 'PENDING');
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
