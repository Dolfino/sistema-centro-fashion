import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';
import type { OutboxMutation } from '../sync/outboxEngine';

export interface CacheMetadata {
  version: string;
  lastAuditTimestamp: string;
  availableMapsCount: number;
  recordsCount: number;
  pendingMediaCount: number;
  storageEngine: string;
  storageKey: string;
  /** Cursor do último pull de sincronização (ISO timestamp). */
  lastPulledAt?: string | null;
}

export interface OfflineStorageAdapter {
  getPins(): Promise<SignagePin[]>;
  savePins(items: SignagePin[]): Promise<void>;

  getOutbox(): Promise<OutboxItem[]>;
  saveOutbox(items: OutboxItem[]): Promise<void>;

  /** Mutations do Outbox Sync Engine (persistência da fila de sync). */
  getMutations(): Promise<OutboxMutation[]>;
  saveMutations(items: OutboxMutation[]): Promise<void>;

  getCacheMetadata(): Promise<CacheMetadata | null>;
  saveCacheMetadata(meta: CacheMetadata): Promise<void>;

  hasProcessedEvent(clientEventId: string): Promise<boolean>;
  markProcessedEvent(clientEventId: string): Promise<void>;
  getProcessedEvents(): Promise<string[]>;
}
