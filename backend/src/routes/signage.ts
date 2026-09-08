import { FastifyInstance } from 'fastify';
import { pool } from '../db/postgres';

/**
 * Rotas de sinalização sem dependência de PostGIS:
 * posicionamento baseado em lat/lng com cálculo de distância haversine.
 * (A coluna opcional `geometry` é usada apenas se a extensão PostGIS existir.)
 */

const HAVERSINE_METERS = `
  6371000 * 2 * asin(sqrt(
    power(sin(radians((sp.lat - $2::float) / 2)), 2) +
    cos(radians($2::float)) * cos(radians(sp.lat)) *
    power(sin(radians((sp.lng - $1::float) / 2)), 2)
  ))`;

export async function signageRoutes(fastify: FastifyInstance) {
  // GET /api/v1/signage - Listar todas as sinalizações
  fastify.get('/', async (request, reply) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT sa.*, sp.normalized_x, sp.normalized_y, sp.lat, sp.lng, sp.human_location_text
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

  // GET /api/v1/signage/nearby - Buscar sinalizações em um raio (haversine, sem PostGIS)
  fastify.get('/nearby', async (request, reply) => {
    const { lat, lng, radiusMeters = 50 } = request.query as { lat?: string; lng?: string; radiusMeters?: string };

    if (!lat || !lng) {
      return reply.status(400).send({ error: 'Parâmetros lat e lng são obrigatórios' });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT sa.*, sp.normalized_x, sp.normalized_y, sp.lat, sp.lng,
                (${HAVERSINE_METERS}) as distance_meters
         FROM signage_assets sa
         JOIN signage_positions sp ON sa.id = sp.signage_id
         WHERE sa.deleted_at IS NULL
           AND sp.lat IS NOT NULL AND sp.lng IS NOT NULL
           AND (${HAVERSINE_METERS}) <= $3::float
         ORDER BY distance_meters ASC`,
        [Number(lng), Number(lat), Number(radiusMeters)]
      );

      return reply.send({ count: result.rowCount, data: result.rows });
    } finally {
      client.release();
    }
  });
}
