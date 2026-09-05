import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';

export interface CacheMetadata {
  version: string;
  lastAuditTimestamp: string;
  availableMapsCount: number;
  recordsCount: number;
  pendingMediaCount: number;
  storageEngine: string;
  storageKey: string;
}

export interface OfflineStorageAdapter {
  getPins(): Promise<SignagePin[]>;
  savePins(items: SignagePin[]): Promise<void>;

  getOutbox(): Promise<OutboxItem[]>;
  saveOutbox(items: OutboxItem[]): Promise<void>;

  getCacheMetadata(): Promise<CacheMetadata | null>;
  saveCacheMetadata(meta: CacheMetadata): Promise<void>;

  hasProcessedEvent(clientEventId: string): Promise<boolean>;
  markProcessedEvent(clientEventId: string): Promise<void>;
}
