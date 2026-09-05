import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, Platform } from 'react-native';
import { CapturedPhoto } from '../services/mediaService';
import { SignagePin } from './InteractiveMallMap';

interface FotoGaleriaModalProps {
  visible: boolean;
  pin: SignagePin | null;
  onClose: () => void;
  onUploadRequest?: (photo: CapturedPhoto) => Promise<void>;
}

export const FotoGaleriaModal: React.FC<FotoGaleriaModalProps> = ({
  visible,
  pin,
  onClose,
  onUploadRequest,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const photos: CapturedPhoto[] = pin?.photos || [];
  const currentPhoto: CapturedPhoto | undefined = photos[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setZoomLevel(1);
  }, [pin, visible]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web' || typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (typeof window.removeEventListener === 'function') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [visible, currentIndex, photos.length]);

  if (!visible || !pin) return null;

  const handlePrev = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
      setZoomLevel(1);
    }
  };

  const handleNext = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  const handleManualSync = async () => {
    if (!currentPhoto || isUploading || currentPhoto.uploadedToS3 || !onUploadRequest) return;
    setIsUploading(true);
    try {
      await onUploadRequest(currentPhoto);
    } finally {
      setIsUploading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.overlay}>
      <View id="fotoModalS225" style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho da Galeria */}
        <View style={styles.header}>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.eyebrow}>Galeria Fotográfica (S22.5)</Text>
            <Text style={styles.title}>
              {pin.assetCode} — {pin.notes || pin.category}
            </Text>
          </View>

          <View style={styles.headerActions}>
            {photos.length > 0 && (
              <View id="fotoContadorS225" style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>
                  {currentIndex + 1} de {photos.length}
                </Text>
              </View>
            )}
            <TouchableOpacity
              id="btnFecharFotoS225"
              style={styles.closeBtn}
              onPress={onClose}
              aria-label="Fechar galeria"
            >
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Palco Principal da Foto (#fotoStageS225) */}
        <View id="fotoStageS225" style={styles.stage}>
          {photos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📷</Text>
              <Text style={styles.emptyTitle}>Nenhuma foto anexada a este ativo</Text>
              <Text style={styles.emptySubtitle}>
                Adicione fotos através da opção de edição cadastral no card ou no formulário.
              </Text>
            </View>
          ) : (
            <View style={styles.imageWrapper}>
              <Image
                id="fotoImagemS225"
                source={{ uri: currentPhoto?.localUri }}
                style={[
                  styles.image,
                  {
                    transform: [{ scale: zoomLevel }],
                  },
                ]}
                resizeMode="contain"
              />

              {/* Botões de Navegação Anterior / Próxima */}
              {photos.length > 1 && (
                <>
                  <TouchableOpacity
                    id="fotoPrevBtnS225"
                    style={[styles.navBtn, styles.navBtnLeft]}
                    onPress={handlePrev}
                    aria-label="Foto anterior"
                  >
                    <Text style={styles.navBtnText}>‹</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    id="fotoNextBtnS225"
                    style={[styles.navBtn, styles.navBtnRight]}
                    onPress={handleNext}
                    aria-label="Próxima foto"
                  >
                    <Text style={styles.navBtnText}>›</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Controles Flutuantes de Zoom */}
              <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut} aria-label="Diminuir zoom">
                  <Text style={styles.zoomBtnText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomReset} aria-label="Resetar zoom">
                  <Text style={styles.zoomBtnText}>{Math.round(zoomLevel * 100)}%</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn} aria-label="Aumentar zoom">
                  <Text style={styles.zoomBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Barra de Metadados e Status MinIO S3 */}
        {currentPhoto && (
          <View style={styles.footerMeta}>
            <View style={styles.metaRow}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Arquivo</Text>
                <Text style={styles.metaValue}>{currentPhoto.fileName}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Tamanho</Text>
                <Text style={styles.metaValue}>{formatBytes(currentPhoto.sizeBytes)}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Status Armazenamento</Text>
                <View style={styles.statusBadgeRow}>
                  <View
                    style={[
                      styles.s3Pill,
                      currentPhoto.uploadedToS3 ? styles.s3PillSuccess : styles.s3PillPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.s3PillText,
                        currentPhoto.uploadedToS3 ? styles.s3PillTextSuccess : styles.s3PillTextPending,
                      ]}
                    >
                      {currentPhoto.uploadedToS3 ? '✓ MinIO S3 Gravado' : '⏳ Fila Outbox Pendente'}
                    </Text>
                  </View>
                  {!currentPhoto.uploadedToS3 && onUploadRequest && (
                    <TouchableOpacity
                      style={styles.syncBtn}
                      onPress={handleManualSync}
                      disabled={isUploading}
                    >
                      <Text style={styles.syncBtnText}>
                        {isUploading ? 'Enviando…' : 'Enviar agora'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* SHA-256 e Storage Key */}
            <View style={styles.metaShaRow}>
              <Text style={styles.metaShaLabel}>SHA-256:</Text>
              <Text style={styles.metaShaValue}>{currentPhoto.sha256}</Text>
            </View>
            {currentPhoto.storageKey && (
              <View style={styles.metaShaRow}>
                <Text style={styles.metaShaLabel}>MinIO Key:</Text>
                <Text style={styles.metaStorageKey}>{currentPhoto.storageKey}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 16, 30, 0.85)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 900,
    height: '90%',
    maxHeight: 720,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    display: 'flex',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  modalBoxMobile: {
    maxWidth: '100%',
    height: '96%',
    maxHeight: '96%',
    borderRadius: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00C8FF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badgeCount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  badgeCountText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#E5E7EB',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  stage: {
    flex: 1,
    backgroundColor: '#090d16',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 44,
    height: 48,
    backgroundColor: 'rgba(31, 41, 55, 0.75)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  navBtnLeft: {
    left: 12,
  },
  navBtnRight: {
    right: 12,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '700',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
    overflow: 'hidden',
    zIndex: 10,
  },
  zoomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#4b5563',
  },
  zoomBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 380,
  },
  footerMeta: {
    padding: 12,
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  metaCol: {
    flex: 1,
    minWidth: 140,
  },
  metaLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  s3Pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  s3PillSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  s3PillPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  s3PillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  s3PillTextSuccess: {
    color: '#10B981',
  },
  s3PillTextPending: {
    color: '#F59E0B',
  },
  syncBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#2563EB',
    borderRadius: 6,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  metaShaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaShaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  metaShaValue: {
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    color: '#00C8FF',
  },
  metaStorageKey: {
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    color: '#A78BFA',
  },
});
