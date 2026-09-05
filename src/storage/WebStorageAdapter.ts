import { OfflineStorageAdapter, CacheMetadata } from './OfflineStorageAdapter';
import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';

const STORAGE_KEYS = {
  PINS: 'sinalizacao_mall_pins',
  OUTBOX: 'sinalizacao_mall_outbox',
  CACHE_META: 'sinalizacao_mall_cache_metadata',
  PROCESSED_EVENTS: 'sinalizacao_mall_processed_events',
};

const initialDefaultPins: SignagePin[] = [
  { id: '1', assetCode: 'SIG-20260814-0001', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'ATIVA', conservationState: 'Boa', normalizedX: 0.28, normalizedY: 0.28, notes: 'Placa informativa', humanLocation: 'Rua General Bezerril', responsible: 'Davidsilva • Operações' },
  { id: '2', assetCode: 'SIG-20260814-0002', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'ATIVA', conservationState: 'Ótima', normalizedX: 0.52, normalizedY: 0.35, notes: 'Placa informativa', humanLocation: 'Rua São José', responsible: 'Davidsilva • Operações' },
  { id: '3', assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_AZUL', status: 'INATIVA', conservationState: 'Regular', normalizedX: 0.25, normalizedY: 0.55, notes: 'Adesivo de uma amarelinha', humanLocation: 'Adesivo de uma amarelinha', responsible: 'Davidsilva • Operações' },
  { id: '4', assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_AZUL', status: 'SUBSTITUIR', conservationState: 'Danificada', normalizedX: 0.65, normalizedY: 0.65, notes: 'Ambulatório ->', humanLocation: 'Ambulatório ->', responsible: 'Davidsilva • Operações' },
  { id: '5', assetCode: 'SIG-20260814-0005', category: 'Totem', sector: 'SETOR_AZUL', status: 'ATIVA', conservationState: 'Boa', normalizedX: 0.22, normalizedY: 0.80, notes: 'Promoção mês dos Pais', humanLocation: 'Promoção mês dos Pais', responsible: 'Davidsilva • Operações' },
];

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
    await this.savePins(initialDefaultPins);
    return initialDefaultPins;
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
    try {
      const data = this.getItem(STORAGE_KEYS.PROCESSED_EVENTS);
      if (data) {
        const list: string[] = JSON.parse(data);
        return list.includes(clientEventId);
      }
    } catch (e) {}
    return false;
  }

  public async markProcessedEvent(clientEventId: string): Promise<void> {
    try {
      const data = this.getItem(STORAGE_KEYS.PROCESSED_EVENTS);
      const list: string[] = data ? JSON.parse(data) : [];
      if (!list.includes(clientEventId)) {
        list.push(clientEventId);
        this.setItem(STORAGE_KEYS.PROCESSED_EVENTS, JSON.stringify(list));
      }
    } catch (e) {}
  }
}
