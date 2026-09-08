import { OfflineStorageAdapter, CacheMetadata } from './OfflineStorageAdapter';
import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';
import type { OutboxMutation } from '../sync/outboxEngine';
import { STORAGE_KEYS } from './storageKeys';
import { seedPins } from '../data/seedPins';

export class WebStorageAdapter implements OfflineStorageAdapter {
  private getItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  }

  private setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }

  public async getPins(): Promise<SignagePin[]> {
    try {
      const data = this.getItem(STORAGE_KEYS.PINS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[WEB-STORAGE-ADAPTER] Erro ao ler pins:', e);
    }
    await this.savePins(seedPins);
    return seedPins;
  }

  public async savePins(items: SignagePin[]): Promise<void> {
    try {
      this.setItem(STORAGE_KEYS.PINS, JSON.stringify(items));
      await this.saveCacheMetadata({
        version: 'v3.28.1-S26.6.1',
        lastAuditTimestamp: new Date().toISOString(),
        availableMapsCount: 6,
        recordsCount: items.length,
        pendingMediaCount: 0,
        storageEngine: 'WebStorageAdapter (localStorage)',
        storageKey: STORAGE_KEYS.PINS,
      });
    } catch (e) {
      console.error('[WEB-STORAGE-ADAPTER] Erro ao gravar pins:', e);
    }
  }

  public async getOutbox(): Promise<OutboxItem[]> {
    try {
      const data = this.getItem(STORAGE_KEYS.OUTBOX);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[WEB-STORAGE-ADAPTER] Erro ao ler outbox:', e);
    }
    return [];
  }

  public async saveOutbox(items: OutboxItem[]): Promise<void> {
    try {
      this.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(items));
    } catch (e) {
      console.error('[WEB-STORAGE-ADAPTER] Erro ao gravar outbox:', e);
    }
  }

  public async getMutations(): Promise<OutboxMutation[]> {
    try {
      const data = this.getItem(STORAGE_KEYS.MUTATIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[WEB-STORAGE-ADAPTER] Erro ao ler mutations:', e);
    }
    return [];
  }

  public async saveMutations(items: OutboxMutation[]): Promise<void> {
    try {
      this.setItem(STORAGE_KEYS.MUTATIONS, JSON.stringify(items));
    } catch (e) {
      console.error('[WEB-STORAGE-ADAPTER] Erro ao gravar mutations:', e);
    }
  }

  public async getCacheMetadata(): Promise<CacheMetadata | null> {
    try {
      const data = this.getItem(STORAGE_KEYS.CACHE_META);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  }

  public async saveCacheMetadata(meta: CacheMetadata): Promise<void> {
    try {
      this.setItem(STORAGE_KEYS.CACHE_META, JSON.stringify(meta));
    } catch (e) {}
  }

  public async hasProcessedEvent(clientEventId: string): Promise<boolean> {
    const list = await this.getProcessedEvents();
    return list.includes(clientEventId);
  }

  public async markProcessedEvent(clientEventId: string): Promise<void> {
    const list = await this.getProcessedEvents();
    if (!list.includes(clientEventId)) {
      list.push(clientEventId);
      this.setItem(STORAGE_KEYS.PROCESSED_EVENTS, JSON.stringify(list));
    }
  }

  public async getProcessedEvents(): Promise<string[]> {
    try {
      const data = this.getItem(STORAGE_KEYS.PROCESSED_EVENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[WEB-STORAGE-ADAPTER] Erro ao ler processed_events:', e);
    }
    return [];
  }
}
