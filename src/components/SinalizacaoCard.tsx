import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { SignagePin } from './InteractiveMallMap';

interface SinalizacaoCardProps {
  pin: SignagePin | null;
  onClose: () => void;
  onActionClick: (actionId: string, pin: SignagePin) => void;
}

export const SinalizacaoCard: React.FC<SinalizacaoCardProps> = ({
  pin,
  onClose,
  onActionClick,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  useEffect(() => {
    if (!pin || Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, onClose]);

  if (!pin) return null;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return { backgroundColor: '#12823b', color: '#FFFFFF' };
      case 'MANUTENCAO':
        return { backgroundColor: '#e08b00', color: '#FFFFFF' };
      case 'SUBSTITUIR':
      case 'REMOVER':
        return { backgroundColor: '#d94841', color: '#FFFFFF' };
      default:
        return { backgroundColor: '#68717d', color: '#FFFFFF' };
    }
  };

  const statusStyle = getStatusBadgeStyle(pin.status);
  const photoCount = pin.photos ? pin.photos.length : (pin.id === '1' ? 2 : pin.id === '2' ? 1 : 0);

  return (
    <View id="sinalizacaoMapaCard" style={[styles.card, isMobile && styles.cardMobile]}>
      {/* Cabeçalho do Card da Sinalização Fiel à Baseline S26.6 */}
      <View style={styles.cardHead}>
        <View style={styles.headMeta}>
          <Text id="sigCardProtocolo" style={styles.protocolText}>
            {pin.assetCode || 'Sinalização'}
          </Text>
          <Text id="sigCardTitulo" style={styles.titleText}>
            {pin.notes || pin.category || 'Registro de Sinalização'}
          </Text>
        </View>

        <View style={styles.headActions}>
          {/* Botão Editar (Lápis ✎) */}
          <TouchableOpacity
            id="cardEditarBtnS237"
            style={styles.editBtn}
            onPress={() => onActionClick('EDITAR', pin)}
            aria-label="Editar cadastro"
          >
            <Text style={styles.editBtnIcon}>✎</Text>
          </TouchableOpacity>

          {/* Botão Fotos da Baseline (#btnFotosSigCardS225) */}
          <TouchableOpacity
            id="btnFotosSigCardS225"
            style={styles.photoBtn}
            onPress={() => onActionClick('FOTOS', pin)}
            aria-label="Ver fotos"
          >
            <Text style={styles.photoBtnIcon}>📷</Text>
            <View id="sigCardFotoCountS225" style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>{photoCount}</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Fechar (×) */}
          <TouchableOpacity
            id="btnFecharSigCard"
            style={styles.closeBtn}
            onPress={onClose}
            aria-label="Fechar"
          >
            <Text style={styles.closeBtnIcon}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Badges Status, Prioridade & Conservação */}
      <View style={styles.badgesRow}>
        <View style={[styles.sigBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text id="sigCardStatus" style={styles.sigBadgeText}>
            {pin.status}
          </Text>
        </View>

        {pin.categoryColor && (
          <View style={[styles.sigBadge, { backgroundColor: pin.categoryColor }]}>
            <Text style={styles.sigBadgeText}>{pin.category}</Text>
          </View>
        )}

        {pin.priority && (
          <View style={[styles.sigBadge, { backgroundColor: pin.priority === 'CRITICA' ? '#DC2626' : pin.priority === 'ALTA' ? '#EA580C' : '#4B5563' }]}>
            <Text style={styles.sigBadgeText}>{pin.priority}</Text>
          </View>
        )}

        <View style={styles.sigBadgeLight}>
          <Text id="sigCardEstado" style={styles.sigBadgeLightText}>
            {pin.conservationState || 'Boa'}
          </Text>
        </View>
      </View>

      {/* Linhas Descritivas Fies ao Legado */}
      <Text id="sigCardTipo" style={styles.lineText}>
        <Text style={styles.lineLabel}>Tipo / Categoria: </Text>
        {pin.category}
      </Text>

      <Text id="sigCardLocal" style={styles.lineText}>
        <Text style={styles.lineLabel}>Local: </Text>
        {pin.humanLocation || pin.sector}
      </Text>

      <Text id="sigCardResponsavel" style={styles.lineText}>
        <Text style={styles.lineLabel}>Responsável: </Text>
        {pin.responsible || 'Davidsilva • Operações'}
      </Text>

      {/* Botão Destaque: Comparador Antes & Depois */}
      <TouchableOpacity
        id="btnCompararAntesDepois"
        style={styles.btnAntesDepois}
        onPress={() => onActionClick('ANTES_DEPOIS', pin)}
      >
        <Text style={styles.btnAntesDepoisText}>🔄 Comparador Antes & Depois</Text>
      </TouchableOpacity>

      {/* Ações do Card */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          id="btnHistoricoS8"
          style={styles.btnSecondary}
          onPress={() => onActionClick('HISTORICO', pin)}
        >
          <Text style={styles.btnSecondaryText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="btnPendenciasS10"
          style={styles.btnSecondary}
          onPress={() => onActionClick('PENDENCIAS', pin)}
        >
          <Text style={styles.btnSecondaryText}>Pendências</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="btnCicloVidaS18"
          style={styles.btnSecondary}
          onPress={() => onActionClick('CICLO_VIDA', pin)}
        >
          <Text style={styles.btnSecondaryText}>Ciclo de vida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="btnLevantamentoCampoCard"
          style={[styles.btnPrimary, { backgroundColor: '#0284c7' }]}
          onPress={() => onActionClick('LEVANTAMENTO', pin)}
        >
          <Text style={styles.btnPrimaryText}>✍️ Vistoria de Campo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="btnNovaInspecao"
          style={styles.btnPrimary}
          onPress={() => onActionClick('NOVA_INSPECAO', pin)}
        >
          <Text style={styles.btnPrimaryText}>Nova inspeção</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    zIndex: 120,
    width: 380,
    maxWidth: '92%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 36,
    elevation: 8,
  },
  cardMobile: {
    left: 12,
    right: 12,
    bottom: 12,
    width: 'auto',
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headMeta: {
    flex: 1,
  },
  protocolText: {
    fontSize: 12,
    color: '#6C7280',
    fontWeight: '600',
  },
  titleText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#171B68',
    marginTop: 2,
  },
  headActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnIcon: {
    fontSize: 16,
    color: '#171B68',
    fontWeight: 'bold',
  },
  photoBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F5F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DFE2EA',
  },
  photoBtnIcon: {
    fontSize: 16,
  },
  photoBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F50087',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  photoBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#676A7A',
    marginTop: -2,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  sigBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sigBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sigBadgeLight: {
    backgroundColor: '#EEF0F5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sigBadgeLightText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#202536',
  },
  lineText: {
    fontSize: 13,
    color: '#3D4350',
    marginVertical: 3,
  },
  lineLabel: {
    fontWeight: 'bold',
    color: '#171B68',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#20233A',
  },
  btnPrimary: {
    backgroundColor: '#F50087',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnAntesDepois: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnAntesDepoisText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
});
