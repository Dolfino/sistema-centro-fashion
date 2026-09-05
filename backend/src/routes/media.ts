import { FastifyInstance } from 'fastify';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

export async function mediaRoutes(fastify: FastifyInstance) {
  // POST /api/v1/media/presigned-upload-url
  fastify.post('/presigned-upload-url', async (request, reply) => {
    const { filename, contentType = 'image/jpeg' } = request.body as { filename: string; contentType?: string };

    const bucketName = process.env.S3_BUCKET || 'lab-persistence';
    const key = `photos/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    try {
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return reply.send({
        uploadUrl,
        storageKey: key,
        bucket: bucketName,
        expiresInSeconds: 3600,
      });
    } catch (err: any) {
      fastify.log.error(`Erro ao gerar presigned upload URL: ${err?.message || err}`);
      return reply.status(500).send({ error: 'Erro ao gerar URL de upload MinIO S3', message: err.message });
    }
  });
}
