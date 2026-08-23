import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { syncRoutes } from './routes/sync';
import { signageRoutes } from './routes/signage';
import { mediaRoutes } from './routes/media';

dotenv.config();

const fastify = Fastify({
  logger: true
});

// Registrar CORS
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Health check endpoint
fastify.get('/health', async () => {
  return {
    status: 'ok',
    service: 'sistema-centro-fashion-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
});

// Registrar Rotas da Aplicação
fastify.register(syncRoutes, { prefix: '/api/v1/sync' });
fastify.register(signageRoutes, { prefix: '/api/v1/signage' });
fastify.register(mediaRoutes, { prefix: '/api/v1/media' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    fastify.log.info(`Servidor rodando em http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
