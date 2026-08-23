import { FastifyInstance } from 'fastify';
import { pool } from '../db/postgres';
import { z } from 'zod';

const pushSchema = z.object({
  deviceId: z.string(),
  mutations: z.array(
    z.object({
      clientMutationId: z.string().uuid(),
      entityType: z.string(), // 'signage', 'inspection', 'media'
      actionType: z.enum(['CREATE', 'UPDATE', 'DELETE']),
      payload: z.record(z.any()),
      createdAt: z.string()
    })
  )
});

export async function syncRoutes(fastify: FastifyInstance) {
  // GET /api/v1/sync/pull - Baixar alterações delta desde o último cursor
  fastify.get('/pull', async (request, reply) => {
    const { lastPulledAt } = request.query as { lastPulledAt?: string };
    const sinceDate = lastPulledAt ? new Date(lastPulledAt) : new Date(0);

    const client = await pool.connect();
    try {
      const signageRes = await client.query(
        `SELECT sa.*, sp.normalized_x, sp.normalized_y, ST_AsGeoJSON(sp.geometry) as geometry
         FROM signage_assets sa
         LEFT JOIN signage_positions sp ON sa.id = sp.signage_id
         WHERE sa.updated_at > $1`,
        [sinceDate]
      );

      const inspectionsRes = await client.query(
        `SELECT * FROM inspections WHERE created_at > $1`,
        [sinceDate]
      );

      return reply.send({
        timestamp: new Date().toISOString(),
        changes: {
          signage: {
            created: signageRes.rows,
            updated: [],
            deleted: []
          },
          inspections: {
            created: inspectionsRes.rows,
            updated: [],
            deleted: []
          }
        }
      });
    } finally {
      client.release();
    }
  });

  // POST /api/v1/sync/push - Receber fila de mutações offline (Outbox Pattern)
  fastify.post('/push', async (request, reply) => {
    const parseResult = pushSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Payload de sincronização inválido', details: parseResult.error });
    }

    const { deviceId, mutations } = parseResult.data;
    const client = await pool.connect();

    const results = [];

    try {
      await client.query('BEGIN');

      for (const mut of mutations) {
        // Verificar se a mutação já foi processada (Idempotência)
        const checkDuplicate = await client.query(
          'SELECT id FROM outbox_sync_log WHERE client_mutation_id = $1',
          [mut.clientMutationId]
        );

        if (checkDuplicate.rowCount && checkDuplicate.rowCount > 0) {
          results.push({ clientMutationId: mut.clientMutationId, status: 'SKIPPED_ALREADY_PROCESSED' });
          continue;
        }

        if (mut.entityType === 'inspection') {
          await client.query(
            `INSERT INTO inspections (
              client_inspection_id, signage_id, inspector_id, conservation_state, condition_notes,
              recommended_action, device_id, idempotency_key
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (idempotency_key) DO NOTHING`,
            [
              mut.payload.clientInspectionId || mut.clientMutationId,
              mut.payload.signageId,
              mut.payload.inspectorId,
              mut.payload.conservationState || 'GOOD',
              mut.payload.conditionNotes || '',
              mut.payload.recommendedAction || 'NONE',
              deviceId,
              mut.clientMutationId
            ]
          );
        }

        // Registrar no log de auditoria Outbox
        await client.query(
          `INSERT INTO outbox_sync_log (device_id, client_mutation_id, entity_type, action_type, payload, status)
           VALUES ($1, $2, $3, $4, $5, 'SYNCED')`,
          [deviceId, mut.clientMutationId, mut.entityType, mut.actionType, mut.payload]
        );

        results.push({ clientMutationId: mut.clientMutationId, status: 'SUCCESS' });
      }

      await client.query('COMMIT');
      return reply.send({ success: true, results, syncedAt: new Date().toISOString() });
    } catch (err: any) {
      await client.query('ROLLBACK');
      fastify.log.error('Erro na sincronização push:', err);
      return reply.status(500).send({ error: 'Erro ao processar sincronização', message: err.message });
    } finally {
      client.release();
    }
  });
}
