import { Platform } from 'react-native';
import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';
import sinalizacoesProducaoRaw from '../data/sinalizacoes_producao.json';

export const STORAGE_KEYS = {
  PINS: 'sinalizacao_mall_pins',
  OUTBOX: 'sinalizacao_mall_outbox',
  CACHE_META: 'sinalizacao_mall_cache_metadata',
  PROCESSED_EVENTS: 'sinalizacao_mall_processed_events',
};

const initialDefaultPins: SignagePin[] = [
  {
    id: '1',
    assetCode: 'SIG-20260814-0001',
    category: 'Placa informativa',
    sector: 'SETOR_AZUL',
    status: 'ATIVA',
    conservationState: 'Boa',
    normalizedX: 0.28,
    normalizedY: 0.28,
    notes: 'Placa informativa',
    humanLocation: 'Rua General Bezerril',
    responsible: 'Davidsilva • Operações',
    photos: [
      {
        id: 'photo_101',
        fileName: 'SIG_0001_FRONTAL.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1642890,
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        localUri: 'https://images.unsplash.com/photo-1572945553229-8cb3149a46a6?w=800&auto=format&fit=crop&q=80',
        uploadedToS3: true,
        storageKey: 'photos/2026/08/SIG_0001_FRONTAL.jpg',
      },
      {
        id: 'photo_102',
        fileName: 'SIG_0001_LATERAL.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1420500,
        sha256: 'f0e1d2c3b4a59876543210987fedcba9876543210fedcba9876543210fedcba9',
        localUri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
        uploadedToS3: true,
        storageKey: 'photos/2026/08/SIG_0001_LATERAL.jpg',
      },
    ],
  },
  {
    id: '2',
    assetCode: 'SIG-20260814-0002',
    category: 'Placa informativa',
    sector: 'SETOR_AZUL',
    status: 'ATIVA',
    conservationState: 'Ótima',
    normalizedX: 0.52,
    normalizedY: 0.35,
    notes: 'Placa informativa',
    humanLocation: 'Rua São José',
    responsible: 'Davidsilva • Operações',
    photos: [
      {
        id: 'photo_201',
        fileName: 'SIG_0002_GERAL.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1890240,
        sha256: '9876543210abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        localUri: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
        uploadedToS3: false,
      },
    ],
  },
  { id: '3', assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_AZUL', status: 'INATIVA', conservationState: 'Regular', normalizedX: 0.25, normalizedY: 0.55, notes: 'Adesivo de uma amarelinha', humanLocation: 'Adesivo de uma amarelinha', responsible: 'Davidsilva • Operações', photos: [] },
  { id: '4', assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_AZUL', status: 'SUBSTITUIR', conservationState: 'Danificada', normalizedX: 0.65, normalizedY: 0.65, notes: 'Ambulatório ->', humanLocation: 'Ambulatório ->', responsible: 'Davidsilva • Operações', photos: [] },
  { id: '5', assetCode: 'SIG-20260814-0005', category: 'Totem', sector: 'SETOR_AZUL', status: 'ATIVA', conservationState: 'Boa', normalizedX: 0.22, normalizedY: 0.80, notes: 'Promoção mês dos Pais', humanLocation: 'Promoção mês dos Pais', responsible: 'Davidsilva • Operações', photos: [] },
  {
    id: '6',
    assetCode: 'OCR-20260824-0001',
    entityType: 'OCORRENCIA',
    category: 'Manutenção',
    categoryColor: '#F59E0B',
    priority: 'ALTA',
    prazoHoras: 72,
    sector: 'SETOR_AZUL',
    status: 'CONCLUIDA',
    conservationState: 'Ótima',
    normalizedX: 0.45,
    normalizedY: 0.42,
    notes: 'Luminária pendente solta no corredor B',
    humanLocation: 'Corredor B — Entre lojas 1020 e 1022',
    responsible: 'CEOP • Manutenção',
    concludedAt: '04/09/2026 16:30',
    concludedBy: 'Carlos Souza • CEOP',
    resolutionNotes: 'Fixação da carcaça e substituição do reator elétrico.',
    photos: [
      {
        id: 'foto_ant_1',
        fileName: 'OCR_ANTES.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 154000,
        sha256: 'a1b2c3d4e5f6',
        localUri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
        uploadedToS3: true,
      },
      {
        id: 'foto_dep_1',
        fileName: 'OCR_DEPOIS.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 168000,
        sha256: 'f6e5d4c3b2a1',
        localUri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        uploadedToS3: true,
      },
    ],
  },
  {
    id: '7',
    assetCode: 'OCR-20260825-0002',
    entityType: 'OCORRENCIA',
    category: 'Limpeza',
    categoryColor: '#10B981',
    priority: 'CRITICA',
    prazoHoras: 24,
    sector: 'SETOR_AZUL',
    status: 'EM_ANDAMENTO',
    conservationState: 'Regular',
    normalizedX: 0.38,
    normalizedY: 0.68,
    notes: 'Vazamento de água próximo aos sanitários',
    humanLocation: 'Sanitários Piso 1 — Bloco Central',
    responsible: 'Limpeza • Equipe Operacional',
    photos: [],
  },
];

export class OfflineStorageService {
  /**
   * Obtém a chave real de armazenamento baseada no ambiente (localStorage para Web)
   */
  private static getItem(key: string): string | null {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  }

  private static setItem(key: string, value: string): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }

  /**
   * Carrega os pins salvos no storage real, enriquecidos com todo o catálogo oficial de sinalizações.
   */
  public static loadPins(): SignagePin[] {
    const prodList = (sinalizacoesProducaoRaw || []) as unknown as SignagePin[];
    try {
      const data = this.getItem(STORAGE_KEYS.PINS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Identificar se faltam os pins oficiais de produção (ex: os 48 do Setor Azul)
          const existingCodes = new Set(parsed.map((p: SignagePin) => p.assetCode || p.id));
          const missingProdPins = prodList.filter((p) => !existingCodes.has(p.assetCode) && !existingCodes.has(p.id));

          if (missingProdPins.length > 0) {
            const merged = [...parsed, ...missingProdPins];
            this.savePins(merged);
            return merged;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[STORAGE] Erro ao ler pins do storage real:', e);
    }
    // Inicialização virgem com catálogo oficial + baseline
    const combinedBaseline: SignagePin[] = [...prodList];
    initialDefaultPins.forEach((init) => {
      if (!combinedBaseline.some((p) => p.assetCode === init.assetCode)) {
        combinedBaseline.push(init);
      }
    });
    this.savePins(combinedBaseline);
    return combinedBaseline;
  }

  public static savePins(pins: SignagePin[]): void {
    try {
      this.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
      let pendingMedia = 0;
      pins.forEach((p) => {
        if (p.photos) {
          pendingMedia += p.photos.filter((ph) => !ph.uploadedToS3).length;
        }
      });
      this.updateCacheMetadata(pins.length, pendingMedia);
    } catch (e) {
      console.error('[STORAGE] Erro ao gravar pins no storage real:', e);
    }
  }

  /**
   * Outbox: Carrega os eventos pendentes da fila persistida
   */
  public static loadOutbox(): OutboxItem[] {
    try {
      const data = this.getItem(STORAGE_KEYS.OUTBOX);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[STORAGE] Erro ao ler outbox do storage real:', e);
    }
    return [];
  }

  public static saveOutbox(items: OutboxItem[]): void {
    try {
      this.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(items));
    } catch (e) {
      console.error('[STORAGE] Erro ao gravar outbox no storage real:', e);
    }
  }

  /**
   * Eventos Processados (Idempotência)
   */
  public static getProcessedEvents(): string[] {
    try {
      const data = this.getItem(STORAGE_KEYS.PROCESSED_EVENTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('[STORAGE] Erro ao ler processed_events:', e);
    }
    return [];
  }

  public static markEventProcessed(clientEventId: string): boolean {
    const list = this.getProcessedEvents();
    if (list.includes(clientEventId)) {
      // Já processado (IDEMPOTÊNCIA - Duplicado detectado!)
      return false;
    }
    list.push(clientEventId);
    this.setItem(STORAGE_KEYS.PROCESSED_EVENTS, JSON.stringify(list));
    return true; // Novo processamento válido
  }

  /**
   * Metadata do Cache Offline
   */
  public static updateCacheMetadata(recordsCount: number, pendingMediaCount: number = 0): any {
    const meta = {
      version: 'v3.28.1-S26.6.1',
      lastAuditTimestamp: new Date().toISOString(),
      availableMapsCount: 6,
      recordsCount,
      pendingMediaCount,
      storageEngine: 'window.localStorage',
      storageKey: STORAGE_KEYS.PINS,
    };
    this.setItem(STORAGE_KEYS.CACHE_META, JSON.stringify(meta));
    return meta;
  }

  public static getCacheMetadata(): any {
    try {
      const data = this.getItem(STORAGE_KEYS.CACHE_META);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return this.updateCacheMetadata(5, 1);
  }
}
