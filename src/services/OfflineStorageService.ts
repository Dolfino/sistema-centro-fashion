import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';
import { StorageFactory } from '../storage/StorageFactory';
import { OfflineStorageAdapter, CacheMetadata } from '../storage/OfflineStorageAdapter';
import { STORAGE_KEYS } from '../storage/storageKeys';
import { seedPins } from '../data/seedPins';
import sinalizacoesProducaoRaw from '../data/sinalizacoes_producao.json';

export { STORAGE_KEYS };

export class OfflineStorageService {
  /**
   * Resolve o adaptador correto por plataforma:
   * web → WebStorageAdapter (localStorage); nativo → SQLiteStorageAdapter (expo-sqlite).
   */
  private static getAdapter(): OfflineStorageAdapter {
    return StorageFactory.getAdapter();
  }

  /**
   * Carrega os pins persistidos, enriquecidos com todo o catálogo oficial de sinalizações.
   * Na primeira execução (storage vazio) semeia com o catálogo + baseline.
   */
  public static async loadPins(): Promise<SignagePin[]> {
    const adapter = this.getAdapter();
    const prodList = (sinalizacoesProducaoRaw || []) as unknown as SignagePin[];
    try {
      const parsed = await adapter.getPins();
      if (parsed.length > 0) {
        // Identificar se faltam os pins oficiais de produção (ex: os do Setor Azul)
        const existingCodes = new Set(parsed.map((p: SignagePin) => p.assetCode || p.id));
        const missingProdPins = prodList.filter((p) => !existingCodes.has(p.assetCode) && !existingCodes.has(p.id));

        if (missingProdPins.length > 0) {
          const merged = [...parsed, ...missingProdPins];
          await this.savePins(merged);
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('[STORAGE] Erro ao ler pins do storage real:', e);
    }
    // Inicialização virgem com catálogo oficial + baseline
    const combinedBaseline: SignagePin[] = [...prodList];
    seedPins.forEach((init) => {
      if (!combinedBaseline.some((p) => p.assetCode === init.assetCode)) {
        combinedBaseline.push(init);
      }
    });
    await this.savePins(combinedBaseline);
    return combinedBaseline;
  }

  public static async savePins(pins: SignagePin[]): Promise<void> {
    try {
      await this.getAdapter().savePins(pins);
    } catch (e) {
      console.error('[STORAGE] Erro ao gravar pins no storage real:', e);
    }
  }

  /**
   * Outbox: Carrega os eventos pendentes da fila persistida
   */
  public static async loadOutbox(): Promise<OutboxItem[]> {
    try {
      const items = await this.getAdapter().getOutbox();
      return items;
    } catch (e) {
      console.warn('[STORAGE] Erro ao ler outbox do storage real:', e);
    }
    return [];
  }

  public static async saveOutbox(items: OutboxItem[]): Promise<void> {
    try {
      await this.getAdapter().saveOutbox(items);
    } catch (e) {
      console.error('[STORAGE] Erro ao gravar outbox no storage real:', e);
    }
  }

  /**
   * Eventos Processados (Idempotência)
   */
  public static async getProcessedEvents(): Promise<string[]> {
    try {
      return await this.getAdapter().getProcessedEvents();
    } catch (e) {
      console.warn('[STORAGE] Erro ao ler processed_events:', e);
    }
    return [];
  }

  public static async markEventProcessed(clientEventId: string): Promise<boolean> {
    const adapter = this.getAdapter();
    if (await adapter.hasProcessedEvent(clientEventId)) {
      // Já processado (IDEMPOTÊNCIA - Duplicado detectado!)
      return false;
    }
    await adapter.markProcessedEvent(clientEventId);
    return true; // Novo processamento válido
  }

  /**
   * Metadata do Cache Offline
   */
  public static async updateCacheMetadata(
    recordsCount: number,
    pendingMediaCount: number = 0,
    lastPulledAt?: string | null
  ): Promise<CacheMetadata> {
    const meta: CacheMetadata = {
      version: 'v3.28.1-S26.6.1',
      lastAuditTimestamp: new Date().toISOString(),
      availableMapsCount: 6,
      recordsCount,
      pendingMediaCount,
      storageEngine: 'OfflineStorageService',
      storageKey: STORAGE_KEYS.PINS,
      lastPulledAt: lastPulledAt ?? null,
    };
    try {
      await this.getAdapter().saveCacheMetadata(meta);
    } catch (e) {
      console.error('[STORAGE] Erro ao gravar metadata:', e);
    }
    return meta;
  }

  public static async getCacheMetadata(): Promise<CacheMetadata | null> {
    try {
      const meta = await this.getAdapter().getCacheMetadata();
      if (meta) return meta;
    } catch (e) {
      console.warn('[STORAGE] Erro ao ler metadata:', e);
    }
    return this.updateCacheMetadata(5, 1);
  }
}
