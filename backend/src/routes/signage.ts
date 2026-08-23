import { FastifyInstance } from 'fastify';
import { pool } from '../db/postgres';

export async function signageRoutes(fastify: FastifyInstance) {
  // GET /api/v1/signage - Listar todas as sinalizações
  fastify.get('/', async (request, reply) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT sa.*, sp.normalized_x, sp.normalized_y, 
                ST_X(sp.geometry::geometry) as lng, ST_Y(sp.geometry::geometry) as lat
         FROM signage_assets sa
         LEFT JOIN signage_positions sp ON sa.id = sp.signage_id
         WHERE sa.deleted_at IS NULL
         ORDER BY sa.created_at DESC`
      );
      return reply.send({ count: result.rowCount, data: result.rows });
    } finally {
      client.release();
    }
  });

  // GET /api/v1/signage/nearby - Buscar sinalizações em um raio espacial (PostGIS)
  fastify.get('/nearby', async (request, reply) => {
    const { lat, lng, radiusMeters = 50 } = request.query as { lat?: string; lng?: string; radiusMeters?: string };

    if (!lat || !lng) {
      return reply.status(400).send({ error: 'Parâmetros lat e lng são obrigatórios' });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT sa.*, sp.normalized_x, sp.normalized_y,
                ST_Distance(sp.geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_meters
         FROM signage_assets sa
         JOIN signage_positions sp ON sa.id = sp.signage_id
         WHERE ST_DWithin(sp.geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
         ORDER BY distance_meters ASC`,
        [Number(lng), Number(lat), Number(radiusMeters)]
      );

      return reply.send({ count: result.rowCount, data: result.rows });
    } finally {
      client.release();
    }
  });
}
