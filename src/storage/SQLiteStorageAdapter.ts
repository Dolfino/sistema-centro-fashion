import * as SQLite from 'expo-sqlite';
import { OfflineStorageAdapter, CacheMetadata } from './OfflineStorageAdapter';
import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';
import type { OutboxMutation } from '../sync/outboxEngine';
import type { CapturedPhoto } from '../services/mediaService';
import { seedPins } from '../data/seedPins';

const DB_NAME = 'sinalizacao_mall.db';
const CACHE_META_ROW_ID = 1;

/**
 * DDL alinhado ao schema auditado (UI4-ANDROID-SQLITE-PROOF.log),
 * estendido para persistir o SignagePin completo (fotos, ocorrências, conclusões).
 */
const DDL = `
CREATE TABLE IF NOT EXISTS pins (
  id TEXT PRIMARY KEY,
  asset_code TEXT UNIQUE,
  category TEXT,
  sector TEXT,
  status TEXT,
  conservation_state TEXT,
  normalized_x REAL,
  normalized_y REAL,
  notes TEXT,
  human_location TEXT,
  responsible TEXT,
  entity_type TEXT,
  category_color TEXT,
  priority TEXT,
  prazo_horas INTEGER,
  prazo_data TEXT,
  concluded_photo_url TEXT,
  concluded_at TEXT,
  concluded_by TEXT,
  resolution_notes TEXT,
  photos_json TEXT
);
CREATE TABLE IF NOT EXISTS outbox_items (
  client_event_id TEXT PRIMARY KEY,
  type TEXT,
  title TEXT,
  status TEXT,
  retry_count INTEGER,
  error_message TEXT,
  timestamp TEXT
);
CREATE TABLE IF NOT EXISTS outbox_mutations (
  client_mutation_id TEXT PRIMARY KEY,
  entity_type TEXT,
  action_type TEXT,
  payload_json TEXT,
  created_at TEXT,
  status TEXT,
  retry_count INTEGER
);
CREATE TABLE IF NOT EXISTS cache_metadata (
  id INTEGER PRIMARY KEY CHECK (id = ${CACHE_META_ROW_ID}),
  version TEXT,
  last_audit_timestamp TEXT,
  available_maps_count INTEGER,
  records_count INTEGER,
  pending_media_count INTEGER,
  storage_engine TEXT,
  storage_key TEXT,
  last_pulled_at TEXT
);
CREATE TABLE IF NOT EXISTS processed_events (
  client_event_id TEXT PRIMARY KEY,
  processed_at TEXT
);
`;

interface PinRow {
  id: string;
  asset_code: string;
  category: string;
  sector: string;
  status: string;
  conservation_state: string | null;
  normalized_x: number;
  normalized_y: number;
  notes: string | null;
  human_location: string | null;
  responsible: string | null;
  entity_type: string | null;
  category_color: string | null;
  priority: string | null;
  prazo_horas: number | null;
  prazo_data: string | null;
  concluded_photo_url: string | null;
  concluded_at: string | null;
  concluded_by: string | null;
  resolution_notes: string | null;
  photos_json: string | null;
}

interface OutboxItemRow {
  client_event_id: string;
  type: string;
  title: string;
  status: string;
  retry_count: number;
  error_message: string | null;
  timestamp: string;
}

interface OutboxMutationRow {
  client_mutation_id: string;
  entity_type: string;
  action_type: string;
  payload_json: string;
  created_at: string;
  status: string;
  retry_count: number;
}

interface CacheMetadataRow {
  id: number;
  version: string;
  last_audit_timestamp: string;
  available_maps_count: number;
  records_count: number;
  pending_media_count: number;
  storage_engine: string;
  storage_key: string;
  last_pulled_at: string | null;
}

interface ProcessedEventRow {
  client_event_id: string;
}

function rowToPin(row: PinRow): SignagePin {
  let photos: CapturedPhoto[] = [];
  if (row.photos_json) {
    try {
      photos = JSON.parse(row.photos_json);
    } catch {
      photos = [];
    }
  }
  return {
    id: row.id,
    assetCode: row.asset_code,
    category: row.category,
    sector: row.sector,
    status: row.status as SignagePin['status'],
    conservationState: row.conservation_state ?? undefined,
    normalizedX: row.normalized_x,
    normalizedY: row.normalized_y,
    notes: row.notes ?? undefined,
    humanLocation: row.human_location ?? undefined,
    responsible: row.responsible ?? undefined,
    entityType: (row.entity_type as SignagePin['entityType']) ?? undefined,
    categoryColor: row.category_color ?? undefined,
    priority: (row.priority as SignagePin['priority']) ?? undefined,
    prazoHoras: row.prazo_horas ?? undefined,
    prazoData: row.prazo_data ?? undefined,
    concludedPhotoUrl: row.concluded_photo_url ?? undefined,
    concludedAt: row.concluded_at ?? undefined,
    concludedBy: row.concluded_by ?? undefined,
    resolutionNotes: row.resolution_notes ?? undefined,
    photos,
  };
}

/**
 * Adaptador SQLite nativo (Android/iOS) com persistência real via expo-sqlite.
 */
export class SQLiteStorageAdapter implements OfflineStorageAdapter {
  private dbPromise: Promise<Awaited<ReturnType<typeof SQLite.openDatabaseAsync>>> | null = null;

  private getDb() {
    if (!this.dbPromise) {
      this.dbPromise = (async () => {
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        await db.execAsync(DDL);
        // Migração: bancos criados antes da Fase 2 não possuem last_pulled_at
        const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(cache_metadata)');
        if (!columns.some((c) => c.name === 'last_pulled_at')) {
          await db.execAsync('ALTER TABLE cache_metadata ADD COLUMN last_pulled_at TEXT');
          console.log('[SQLITE-STORAGE-ADAPTER] Migração aplicada: coluna last_pulled_at adicionada.');
        }
        console.log(`[SQLITE-STORAGE-ADAPTER] Banco '${DB_NAME}' pronto com schema completo.`);
        return db;
      })();
    }
    return this.dbPromise;
  }

  public async getPins(): Promise<SignagePin[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<PinRow>('SELECT * FROM pins ORDER BY id');
    console.log(`[SQLITE-STORAGE-ADAPTER] getPins: ${rows.length} registro(s) lido(s) de ${DB_NAME}`);
    if (rows.length > 0) {
      return rows.map(rowToPin);
    }
    await this.savePins(seedPins);
    return seedPins;
  }

  public async savePins(items: SignagePin[]): Promise<void> {
    const db = await this.getDb();
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM pins');
      for (const p of items) {
        await db.runAsync(
          `INSERT OR REPLACE INTO pins (
            id, asset_code, category, sector, status, conservation_state,
            normalized_x, normalized_y, notes, human_location, responsible,
            entity_type, category_color, priority, prazo_horas, prazo_data,
            concluded_photo_url, concluded_at, concluded_by, resolution_notes, photos_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          p.id,
          p.assetCode,
          p.category,
          p.sector,
          p.status,
          p.conservationState ?? null,
          p.normalizedX,
          p.normalizedY,
          p.notes ?? null,
          p.humanLocation ?? null,
          p.responsible ?? null,
          p.entityType ?? null,
          p.categoryColor ?? null,
          p.priority ?? null,
          p.prazoHoras ?? null,
          p.prazoData ?? null,
          p.concludedPhotoUrl ?? null,
          p.concludedAt ?? null,
          p.concludedBy ?? null,
          p.resolutionNotes ?? null,
          JSON.stringify(p.photos ?? [])
        );
      }
    });
    await this.saveCacheMetadata({
      version: 'v3.28.1-S26.6.1-SQLITE',
      lastAuditTimestamp: new Date().toISOString(),
      availableMapsCount: 6,
      recordsCount: items.length,
      pendingMediaCount: items.reduce(
        (acc, p) => acc + (p.photos ? p.photos.filter((ph) => !ph.uploadedToS3).length : 0),
        0
      ),
      storageEngine: 'SQLiteStorageAdapter (expo-sqlite)',
      storageKey: DB_NAME,
    });
  }

  public async getOutbox(): Promise<OutboxItem[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<OutboxItemRow>('SELECT * FROM outbox_items ORDER BY timestamp');
    return rows.map((r) => ({
      clientEventId: r.client_event_id,
      type: r.type as OutboxItem['type'],
      title: r.title,
      status: r.status as OutboxItem['status'],
      retryCount: r.retry_count,
      errorMessage: r.error_message ?? null,
      timestamp: r.timestamp,
    }));
  }

  public async saveOutbox(items: OutboxItem[]): Promise<void> {
    const db = await this.getDb();
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM outbox_items');
      for (const it of items) {
        await db.runAsync(
          `INSERT OR REPLACE INTO outbox_items (
            client_event_id, type, title, status, retry_count, error_message, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          it.clientEventId,
          it.type,
          it.title,
          it.status,
          it.retryCount,
          it.errorMessage ?? null,
          it.timestamp
        );
      }
    });
  }

  public async getMutations(): Promise<OutboxMutation[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<OutboxMutationRow>('SELECT * FROM outbox_mutations ORDER BY created_at');
    return rows.map((r) => ({
      clientMutationId: r.client_mutation_id,
      entityType: r.entity_type as OutboxMutation['entityType'],
      actionType: r.action_type as OutboxMutation['actionType'],
      payload: JSON.parse(r.payload_json),
      createdAt: r.created_at,
      status: r.status as OutboxMutation['status'],
      retryCount: r.retry_count,
    }));
  }

  public async saveMutations(items: OutboxMutation[]): Promise<void> {
    const db = await this.getDb();
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM outbox_mutations');
      for (const m of items) {
        await db.runAsync(
          `INSERT OR REPLACE INTO outbox_mutations (
            client_mutation_id, entity_type, action_type, payload_json, created_at, status, retry_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          m.clientMutationId,
          m.entityType,
          m.actionType,
          JSON.stringify(m.payload),
          m.createdAt,
          m.status,
          m.retryCount
        );
      }
    });
  }

  public async getCacheMetadata(): Promise<CacheMetadata | null> {
    const db = await this.getDb();
    const row = await db.getFirstAsync<CacheMetadataRow>(
      'SELECT * FROM cache_metadata WHERE id = ?',
      CACHE_META_ROW_ID
    );
    if (!row) return null;
    return {
      version: row.version,
      lastAuditTimestamp: row.last_audit_timestamp,
      availableMapsCount: row.available_maps_count,
      recordsCount: row.records_count,
      pendingMediaCount: row.pending_media_count,
      storageEngine: row.storage_engine,
      storageKey: row.storage_key,
      lastPulledAt: row.last_pulled_at,
    };
  }

  public async saveCacheMetadata(meta: CacheMetadata): Promise<void> {
    const db = await this.getDb();
    await db.runAsync(
      `INSERT OR REPLACE INTO cache_metadata (
        id, version, last_audit_timestamp, available_maps_count,
        records_count, pending_media_count, storage_engine, storage_key, last_pulled_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      CACHE_META_ROW_ID,
      meta.version,
      meta.lastAuditTimestamp,
      meta.availableMapsCount,
      meta.recordsCount,
      meta.pendingMediaCount,
      meta.storageEngine,
      meta.storageKey,
      meta.lastPulledAt ?? null
    );
  }

  public async hasProcessedEvent(clientEventId: string): Promise<boolean> {
    const db = await this.getDb();
    const row = await db.getFirstAsync<ProcessedEventRow>(
      'SELECT client_event_id FROM processed_events WHERE client_event_id = ?',
      clientEventId
    );
    return row !== null && row !== undefined;
  }

  public async markProcessedEvent(clientEventId: string): Promise<void> {
    const db = await this.getDb();
    await db.runAsync(
      'INSERT OR IGNORE INTO processed_events (client_event_id, processed_at) VALUES (?, ?)',
      clientEventId,
      new Date().toISOString()
    );
  }

  public async getProcessedEvents(): Promise<string[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<ProcessedEventRow>('SELECT client_event_id FROM processed_events');
    return rows.map((r) => r.client_event_id);
  }
}
