import { OutboxSyncEngine, OutboxMutation } from '../outboxEngine';
import { OfflineStorageAdapter, CacheMetadata } from '../../storage/OfflineStorageAdapter';

/**
 * Adaptador fake em memória para testar o engine sem storage real.
 */
class FakeAdapter implements OfflineStorageAdapter {
  pins: any[] = [];
  outbox: any[] = [];
  mutations: OutboxMutation[] = [];
  meta: CacheMetadata | null = null;
  processed: string[] = [];

  async getPins() { return this.pins; }
  async savePins(items: any[]) { this.pins = items; }
  async getOutbox() { return this.outbox; }
  async saveOutbox(items: any[]) { this.outbox = items; }
  async getMutations() { return this.mutations; }
  async saveMutations(items: OutboxMutation[]) { this.mutations = [...items]; }
  async getCacheMetadata() { return this.meta; }
  async saveCacheMetadata(meta: CacheMetadata) { this.meta = meta; }
  async hasProcessedEvent(id: string) { return this.processed.includes(id); }
  async markProcessedEvent(id: string) { this.processed.push(id); }
  async getProcessedEvents() { return this.processed; }
}

const baseMutation = {
  entityType: 'signage' as const,
  actionType: 'CREATE' as const,
  payload: { assetCode: 'SIG-TEST-001', category: 'Totem', notes: 'teste' },
};

describe('OutboxSyncEngine', () => {
  let adapter: FakeAdapter;
  let engine: OutboxSyncEngine;

  beforeEach(() => {
    adapter = new FakeAdapter();
    engine = new OutboxSyncEngine('https://api.test/api/v1/sync', adapter);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('addMutation registra PENDING e persiste no adapter', async () => {
    const mut = await engine.addMutation('signage', 'CREATE', { assetCode: 'X' });
    expect(mut.status).toBe('PENDING');
    expect(mut.retryCount).toBe(0);
    expect(mut.clientMutationId).toMatch(/^[0-9a-f-]{36}$/);
    expect(adapter.mutations).toHaveLength(1);
    expect(adapter.mutations[0].clientMutationId).toBe(mut.clientMutationId);
  });

  test('addMutation aceita clientMutationId correlacionado', async () => {
    const id = '123e4567-e89b-42d3-a456-426614174000';
    const mut = await engine.addMutation('signage', 'UPDATE', { assetCode: 'X' }, id);
    expect(mut.clientMutationId).toBe(id);
  });

  test('init hidrata a fila persistida (sobrevive a restart)', async () => {
    adapter.mutations = [
      { ...baseMutation, clientMutationId: 'uuid-1', createdAt: new Date().toISOString(), status: 'PENDING', retryCount: 1 },
    ];
    const fresh = new OutboxSyncEngine('https://api.test/api/v1/sync', adapter);
    await fresh.init();
    expect(fresh.getPendingQueue()).toHaveLength(1);
    expect(fresh.getQueue()[0].clientMutationId).toBe('uuid-1');
  });

  test('sync com sucesso marca SYNCED, persiste e retorna contagem', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({
        success: true,
        results: [{ clientMutationId: 'uuid-1', status: 'SUCCESS' }],
      }),
    });
    await engine.addMutation('signage', 'CREATE', { assetCode: 'X' }, 'uuid-1');
    const res = await engine.syncWithServer('device-1');
    expect(res.success).toBe(true);
    expect(res.syncedCount).toBe(1);
    expect(engine.getQueue()[0].status).toBe('SYNCED');
    expect(adapter.mutations[0].status).toBe('SYNCED');
  });

  test('sync com falha marca FAILED, incrementa retryCount e persiste', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network down'));
    await engine.addMutation('signage', 'CREATE', { assetCode: 'X' }, 'uuid-1');
    const res = await engine.syncWithServer('device-1');
    expect(res.success).toBe(false);
    const m = engine.getQueue()[0];
    expect(m.status).toBe('FAILED');
    expect(m.retryCount).toBe(1);
    expect(adapter.mutations[0].retryCount).toBe(1);
  });

  test('sync reenvia itens FAILED (retry automático)', async () => {
    // apiClient faz 2 retries internos: são necessárias 3 falhas para o engine registrar FAILED
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('network down'))
      .mockRejectedValueOnce(new Error('network down'))
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, results: [{ clientMutationId: 'uuid-1', status: 'SUCCESS' }] }),
      });
    await engine.addMutation('signage', 'CREATE', { assetCode: 'X' }, 'uuid-1');
    const fail = await engine.syncWithServer('device-1');
    expect(fail.success).toBe(false);
    expect(engine.getQueue()[0].status).toBe('FAILED');
    const ok = await engine.syncWithServer('device-1');
    expect(ok.success).toBe(true);
    expect(ok.syncedCount).toBe(1);
    expect(engine.getQueue()[0].status).toBe('SYNCED');
    expect(engine.getQueue()[0].retryCount).toBe(1);
  });

  test('sync concorrente é bloqueado (isSyncing)', async () => {
    let resolveFetch: (v: any) => void;
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise((resolve) => { resolveFetch = resolve; })
    );
    await engine.addMutation('signage', 'CREATE', { assetCode: 'X' }, 'uuid-1');
    const first = engine.syncWithServer('device-1');
    const second = await engine.syncWithServer('device-1');
    expect(second.success).toBe(false);
    resolveFetch!({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, results: [] }),
    });
    await first;
  });

  test('pullFromServer usa cursor lastPulledAt', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ timestamp: '2026-09-08T00:00:00Z', changes: { signage: { created: [], updated: [], deleted: [] }, inspections: { created: [], updated: [], deleted: [] } } }),
    });
    await engine.pullFromServer('2026-09-07T00:00:00Z');
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('lastPulledAt=2026-09-07T00%3A00%3A00Z');
  });
});
