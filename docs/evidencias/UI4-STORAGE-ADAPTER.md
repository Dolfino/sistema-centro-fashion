# ARQUITETURA DO ADAPTADOR DE ARMAZENAMENTO MULTIPLATAFORMA (UI4-STORAGE-ADAPTER.md)

> **Data da Execução:** 2026-08-23  
> **Padrão Arquitetural:** Storage Adapter Pattern (`OfflineStorageAdapter`)  
> **Status:** ✅ 100% IMPLEMENTADO E ABSTRAÍDO  

---

## 1. Interface Unificada (`OfflineStorageAdapter.ts`)

A aplicação desacoplou o acesso a dados locais através de uma interface limpa, sem espalhar verificações de `Platform.OS` pelas regras de negócio de componentes React:

```typescript
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
```

---

## 2. Implementações Multiplataforma

1. **`WebStorageAdapter` (Web / PWA):**
   - Encapsula `window.localStorage` e IndexedDB.
   - Chaves reais: `sinalizacao_mall_pins`, `sinalizacao_mall_outbox`, `sinalizacao_mall_cache_metadata`, `sinalizacao_mall_processed_events`.
2. **`SQLiteStorageAdapter` (Android & iOS):**
   - Conecta ao banco de dados relacional nativo `sinalizacao_mall.db`.
   - Tabelas SQL DDL: `pins`, `outbox_items`, `cache_metadata`, `processed_events`.
3. **`StorageFactory`:**
   - Fábrica estática que retorna a instância correta do adaptador dependendo da plataforma de execução.
