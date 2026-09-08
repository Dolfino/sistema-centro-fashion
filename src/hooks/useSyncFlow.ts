import { useState, useEffect, useRef, useCallback } from 'react';
import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';
import { OutboxSyncEngine, OutboxMutation } from '../sync/outboxEngine';
import { StorageFactory } from '../storage/StorageFactory';
import { getDeviceId } from '../services/deviceId';
import { API_BASE_URL } from '../services/apiClient';
import { OfflineStorageService } from '../services/OfflineStorageService';
import type { NetworkState } from './useNetworkStatus';

interface UseSyncFlowDeps {
  networkState: NetworkState;
  setNetworkState: (state: NetworkState) => void;
  pinsList: SignagePin[];
  setPinsList: React.Dispatch<React.SetStateAction<SignagePin[]>>;
  setOutboxItems: React.Dispatch<React.SetStateAction<OutboxItem[]>>;
}

export interface SyncMutationInput {
  entityType: OutboxMutation['entityType'];
  actionType: OutboxMutation['actionType'];
  payload: Record<string, any>;
}

/**
 * Camada de sincronização real (Fase 2): Outbox Sync Engine persistido,
 * push de mutações, pull de delta com merge no cache e fila visível correlacionada.
 */
export function useSyncFlow({ networkState, setNetworkState, pinsList, setPinsList, setOutboxItems }: UseSyncFlowDeps) {
  const syncEngineRef = useRef<OutboxSyncEngine | null>(null);
  if (!syncEngineRef.current) {
    syncEngineRef.current = new OutboxSyncEngine(`${API_BASE_URL}/sync`, StorageFactory.getAdapter());
  }

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [enginePendingCount, setEnginePendingCount] = useState<number>(0);

  useEffect(() => {
    void syncEngineRef.current?.init().then(() => {
      setEnginePendingCount(syncEngineRef.current?.getPendingQueue().length ?? 0);
    });
  }, []);

  const refreshEnginePending = useCallback(() => {
    setEnginePendingCount(syncEngineRef.current?.getPendingQueue().length ?? 0);
  }, []);

  const generateClientEventId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  /**
   * Puxa alterações delta do servidor e funde no cache local de pins.
   */
  const pullAndMergeRemoteChanges = async () => {
    const engine = syncEngineRef.current;
    if (!engine) return;
    try {
      const meta = await OfflineStorageService.getCacheMetadata();
      const pull = await engine.pullFromServer(meta?.lastPulledAt ?? null);

      const remoteRows = [
        ...(pull.changes?.signage?.created || []),
        ...(pull.changes?.signage?.updated || []),
      ].filter((row: any) => !row.deleted_at);

      if (remoteRows.length === 0) {
        await OfflineStorageService.updateCacheMetadata(pinsList.length, 0, pull.timestamp);
        return;
      }

      const remotePins: SignagePin[] = remoteRows.map((row: any) => ({
        id: `remote_${row.asset_code}`,
        assetCode: row.asset_code,
        category: row.category || 'Placa informativa',
        sector: 'SETOR_AZUL',
        status: row.lifecycle_status === 'INACTIVE' ? 'INATIVA' : 'ATIVA',
        conservationState: row.conservation_status || 'Boa',
        normalizedX: Number(row.normalized_x) || 0.5,
        normalizedY: Number(row.normalized_y) || 0.5,
        notes: row.notes || undefined,
        humanLocation: row.human_location_text || undefined,
      }));

      setPinsList((prev) => {
        const byCode = new Map(prev.map((p) => [p.assetCode, p]));
        remotePins.forEach((rp) => {
          const existing = byCode.get(rp.assetCode);
          if (existing) {
            byCode.set(rp.assetCode, { ...existing, ...rp, id: existing.id });
          } else {
            byCode.set(rp.assetCode, rp);
          }
        });
        const merged = Array.from(byCode.values());
        void OfflineStorageService.savePins(merged);
        void OfflineStorageService.updateCacheMetadata(merged.length, 0, pull.timestamp);
        return merged;
      });
    } catch (e: any) {
      console.warn('[SYNC] Falha ao puxar delta do servidor:', e?.message || e);
    }
  };

  /**
   * Sincronização real: envia mutações pendentes/falhas para a API e puxa o delta.
   * Atualiza o estado da fila visível conforme o resultado do push.
   */
  const handleSyncOutbox = async () => {
    const engine = syncEngineRef.current;
    if (!engine || isSyncing) return;
    setIsSyncing(true);
    try {
      const deviceId = await getDeviceId();
      const res = await engine.syncWithServer(deviceId);

      setOutboxItems((prev) => {
        const nextOutbox = prev.map((i) =>
          res.success
            ? { ...i, status: 'CONCLUIDO' as const, errorMessage: null }
            : { ...i, status: 'ERRO' as const, errorMessage: 'Falha ao sincronizar com o servidor' }
        );
        void OfflineStorageService.saveOutbox(nextOutbox);
        return nextOutbox;
      });

      if (res.success) {
        setNetworkState('ONLINE');
        // Puxa delta do servidor e atualiza o cache local
        await pullAndMergeRemoteChanges();
      }
    } catch (e: any) {
      console.error('[SYNC] Falha na sincronização:', e?.message || e);
    } finally {
      refreshEnginePending();
      setIsSyncing(false);
    }
  };

  const handleRetryItem = async (clientEventId: string) => {
    setOutboxItems((prev) => {
      const nextOutbox = prev.map((i) =>
        i.clientEventId === clientEventId
          ? { ...i, status: 'PROCESSANDO' as const, errorMessage: null, retryCount: i.retryCount + 1 }
          : i
      );
      void OfflineStorageService.saveOutbox(nextOutbox);
      return nextOutbox;
    });
    // O engine reenvia PENDING + FAILED; o retry de um item sincroniza todos os pendentes.
    const engine = syncEngineRef.current;
    if (!engine) return;
    try {
      const deviceId = await getDeviceId();
      const res = await engine.syncWithServer(deviceId);
      setOutboxItems((prev) => {
        const nextOutbox = prev.map((i) =>
          res.success
            ? { ...i, status: 'CONCLUIDO' as const, errorMessage: null }
            : i.clientEventId === clientEventId
            ? { ...i, status: 'ERRO' as const, errorMessage: 'Servidor indisponível' }
            : i
        );
        void OfflineStorageService.saveOutbox(nextOutbox);
        return nextOutbox;
      });
    } catch (e: any) {
      console.error('[SYNC] Falha no retry:', e?.message || e);
    }
    refreshEnginePending();
  };

  /**
   * Registra evento na fila Outbox visível + mutação no engine de sync (mesmo id).
   * Quando ONLINE, dispara a sincronização imediata e reflete o resultado no item.
   */
  const enqueueOutboxEvent = async (event: OutboxItem, mutation?: SyncMutationInput) => {
    setOutboxItems((prev) => {
      const nextOutbox = [event, ...prev];
      void OfflineStorageService.saveOutbox(nextOutbox);
      return nextOutbox;
    });

    const engine = syncEngineRef.current;
    if (!engine) return;

    if (mutation) {
      try {
        await engine.addMutation(mutation.entityType, mutation.actionType, mutation.payload, event.clientEventId);
        refreshEnginePending();
      } catch (e: any) {
        console.error('[SYNC] Falha ao registrar mutação local:', e?.message || e);
      }
    }

    if (networkState === 'ONLINE') {
      try {
        const deviceId = await getDeviceId();
        const res = await engine.syncWithServer(deviceId);
        setOutboxItems((prev) => {
          const nextOutbox = prev.map((i) =>
            i.clientEventId === event.clientEventId
              ? {
                  ...i,
                  status: res.success ? ('CONCLUIDO' as const) : ('ERRO' as const),
                  errorMessage: res.success ? null : 'Falha ao sincronizar com o servidor',
                }
              : i
          );
          void OfflineStorageService.saveOutbox(nextOutbox);
          return nextOutbox;
        });
      } catch (e: any) {
        console.error('[SYNC] Falha na sincronização imediata:', e?.message || e);
      }
      refreshEnginePending();
    }
  };

  return {
    syncEngineRef,
    isSyncing,
    enginePendingCount,
    refreshEnginePending,
    generateClientEventId,
    handleSyncOutbox,
    handleRetryItem,
    enqueueOutboxEvent,
    pullAndMergeRemoteChanges,
  };
}
