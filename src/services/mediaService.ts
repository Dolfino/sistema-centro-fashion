/**
 * Serviço de Gerenciamento de Mídias e Fotos no MinIO S3
 * Plataforma Mall (Centro Fashion)
 */

export interface CapturedPhoto {
  id: string; // Client Media UUID
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  localUri: string;
  uploadedToS3: boolean;
  storageKey?: string;
}

export class MediaService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = 'https://api-mall.ideiasmkt.com.br/api/v1/media') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Simula a captura de uma foto de campo com geração de metadados
   */
  public async capturePhoto(fileNamePrefix: string = 'SIG'): Promise<CapturedPhoto> {
    const photoUuid = this.generateUUID();
    const fileName = `${fileNamePrefix}_${Date.now()}_${photoUuid.substring(0, 8)}.jpg`;
    
    const photo: CapturedPhoto = {
      id: photoUuid,
      fileName,
      mimeType: 'image/jpeg',
      sizeBytes: Math.floor(Math.random() * 500000) + 1500000, // ~1.5MB a 2MB
      sha256: this.generateSha256Simulated(photoUuid),
      localUri: `file:///data/user/0/com.centrofashion.mall/files/photos/${fileName}`,
      uploadedToS3: false,
    };

    console.log(`[MediaService] Foto capturada localmente: ${photo.fileName} (SHA256: ${photo.sha256.substring(0, 12)}...)`);
    return photo;
  }

  /**
   * Envia a foto local para o MinIO S3 via Presigned URL
   */
  public async uploadPhotoToMinIO(photo: CapturedPhoto, payloadBlob?: Blob | Uint8Array): Promise<{ success: boolean; storageKey: string }> {
    try {
      console.log(`[MediaService] Solicitando Presigned URL para ${photo.fileName}...`);
      
      const presignedRes = await fetch(`${this.apiBaseUrl}/presigned-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: photo.fileName,
          contentType: photo.mimeType,
        }),
      });

      if (!presignedRes.ok) {
        throw new Error(`Erro HTTP ${presignedRes.status} ao obter Presigned URL`);
      }

      const { uploadUrl, storageKey } = await presignedRes.json();
      console.log(`[MediaService] Presigned URL obtida. Realizando upload para MinIO S3 (Key: ${storageKey})...`);

      if (uploadUrl) {
        let bodyContent: any = payloadBlob;
        if (!bodyContent && photo.localUri && photo.localUri.startsWith('data:')) {
          const res = await fetch(photo.localUri);
          bodyContent = await res.blob();
        } else if (!bodyContent) {
          bodyContent = new Blob([photo.sha256], { type: photo.mimeType });
        }

        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': photo.mimeType,
          },
          body: bodyContent,
        });

        if (!uploadRes.ok) {
          throw new Error(`Erro HTTP ${uploadRes.status} ao enviar binário para MinIO S3`);
        }
      }

      photo.uploadedToS3 = true;
      photo.storageKey = storageKey;

      console.log(`[MediaService] Upload concluído com sucesso no MinIO S3: ${storageKey}`);
      return { success: true, storageKey };
    } catch (err: any) {
      console.warn(`[MediaService] Upload S3 adiado (Fila Offline): ${err.message}`);
      return { success: false, storageKey: `photos/pending/${photo.fileName}` };
    }
  }

  /**
   * Cria registro de foto capturada a partir de arquivo ou Data URL
   */
  public createPhotoFromData(fileName: string, mimeType: string, sizeBytes: number, uri: string): CapturedPhoto {
    const photoUuid = this.generateUUID();
    return {
      id: photoUuid,
      fileName,
      mimeType,
      sizeBytes,
      sha256: this.generateSha256Simulated(fileName + photoUuid + sizeBytes),
      localUri: uri,
      uploadedToS3: false,
    };
  }

  public generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public generateSha256Simulated(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
  }
}

export const mediaService = new MediaService();
