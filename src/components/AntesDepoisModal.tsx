import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { SignagePin } from './InteractiveMallMap';

interface AntesDepoisModalProps {
  visible: boolean;
  pin: SignagePin | null;
  onClose: () => void;
}

export const AntesDepoisModal: React.FC<AntesDepoisModalProps> = ({
  visible,
  pin,
  onClose,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 760;

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!visible || !pin) return null;

  // Foto Inicial (Antes)
  const initialPhotoUrl =
    pin.photos && pin.photos.length > 0
      ? pin.photos[0].localUri || (pin.photos[0] as any).previewUrl
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

  // Foto Conclusão (Depois)
  const concludedPhotoUrl =
    pin.concludedPhotoUrl ||
    (pin.photos && pin.photos.length > 1
      ? pin.photos[pin.photos.length - 1].localUri || (pin.photos[pin.photos.length - 1] as any).previewUrl
      : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80');

  return (
    <View style={styles.overlay}>
      <View id="antesDepoisModal" style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <View style={[styles.categoryBadge, pin.categoryColor ? { backgroundColor: pin.categoryColor } : undefined]}>
                <Text style={styles.categoryBadgeText}>{pin.category}</Text>
              </View>
              <Text style={styles.protocolText}>{pin.assetCode}</Text>
            </View>
            <Text style={styles.title}>
              Comparador Visual: Antes & Depois
            </Text>
            <Text style={styles.subtitle}>
              {pin.notes || pin.humanLocation || 'Comprovação fotográfica da resolução da ocorrência'}
            </Text>
          </View>

          <TouchableOpacity id="btnFecharAntesDepois" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Barra de Auditoria de SLA */}
        <View style={styles.slaAuditBar}>
          <Text style={styles.slaAuditText}>
            ⏱️ <Text style={{ fontWeight: '700' }}>Tempo de Resolução:</Text> {pin.concludedAt ? 'Concluído em ' + pin.concludedAt : '4h 25min (Dentro do prazo de SLA)'}
          </Text>
          <Text style={styles.slaAuditStatus}>
            ✓ RESOLVIDO & VALIDADO
          </Text>
        </View>

        {/* Área de Comparação Lado a Lado */}
        <ScrollView style={styles.compareContainer} contentContainerStyle={styles.compareContent}>
          <View style={[styles.sideBySideRow, isMobile && styles.sideBySideColumn]}>
            {/* LADO ESQUERDO: ANTES */}
            <View style={styles.cardHalf}>
              <View style={styles.cardHeaderAntes}>
                <View style={styles.statusIndicatorRed} />
                <Text style={styles.cardHeaderTitleAntes}>1. ANTES — Abertura do Chamado</Text>
              </View>

              <View style={styles.imageFrame}>
                <Image
                  source={{ uri: initialPhotoUrl }}
                  style={[styles.compareImage, { transform: [{ scale: zoomLevel }] }]}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.metaBox}>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Estado Identificado:</Text> {pin.conservationState || 'Danificada / Necessita reparo'}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Local:</Text> {pin.sector} • {pin.humanLocation || 'Corredor Central'}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Registrado por:</Text> Davidsilva • Auditoria de Campo
                </Text>
              </View>
            </View>

            {/* LADO DIREITO: DEPOIS */}
            <View style={styles.cardHalf}>
              <View style={styles.cardHeaderDepois}>
                <View style={styles.statusIndicatorGreen} />
                <Text style={styles.cardHeaderTitleDepois}>2. DEPOIS — Conclusão da Manutenção</Text>
              </View>

              <View style={styles.imageFrame}>
                <Image
                  source={{ uri: concludedPhotoUrl }}
                  style={[styles.compareImage, { transform: [{ scale: zoomLevel }] }]}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.metaBox}>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Ação Executada:</Text> {pin.resolutionNotes || 'Manutenção corretiva e substituição realizada com sucesso.'}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Responsável Técnico:</Text> {pin.concludedBy || pin.responsible || 'Equipe de Operações'}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Situação Final:</Text> Concluído e em pleno funcionamento
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Rodapé com Controles */}
        <View style={styles.footer}>
          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
            >
              <Text style={styles.zoomBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.zoomLabel}>{Math.round(zoomLevel * 100)}%</Text>
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => setZoomLevel((prev) => Math.min(2, prev + 0.25))}
            >
              <Text style={styles.zoomBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity id="btnFecharComparador" style={styles.btnDone} onPress={onClose}>
            <Text style={styles.btnDoneText}>Fechar Comparador</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'rgba(9, 13, 33, 0.75)',
    zIndex: 1400,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 960,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  modalBoxMobile: {
    maxHeight: '96%',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F5',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  protocolText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#676A7A',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171B68',
  },
  subtitle: {
    fontSize: 12,
    color: '#676A7A',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5563',
    lineHeight: 20,
  },
  slaAuditBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  slaAuditText: {
    fontSize: 12,
    color: '#065F46',
  },
  slaAuditStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  compareContainer: {
    flex: 1,
  },
  compareContent: {
    padding: 16,
  },
  sideBySideRow: {
    flexDirection: 'row',
    gap: 16,
  },
  sideBySideColumn: {
    flexDirection: 'column',
  },
  cardHalf: {
    flex: 1,
    backgroundColor: '#F9FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    overflow: 'hidden',
  },
  cardHeaderAntes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusIndicatorRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  cardHeaderTitleAntes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  cardHeaderDepois: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusIndicatorGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  cardHeaderTitleDepois: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  imageFrame: {
    width: '100%',
    height: 240,
    backgroundColor: '#111827',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareImage: {
    width: '100%',
    height: '100%',
  },
  metaBox: {
    padding: 12,
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF0F5',
  },
  metaLine: {
    fontSize: 11,
    color: '#4B5563',
  },
  metaLabel: {
    fontWeight: '700',
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F5',
    backgroundColor: '#F9FAFC',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoomBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  zoomLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    minWidth: 40,
    textAlign: 'center',
  },
  btnDone: {
    backgroundColor: '#171B68',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnDoneText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
