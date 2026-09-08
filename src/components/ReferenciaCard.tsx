import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import {
  PontoReferenciaOficial,
  CartografiaService,
  NOMES_PADRAO_TIPOS_REFERENCIA,
} from '../services/cartografiaService';

interface ReferenciaCardProps {
  referencia: PontoReferenciaOficial | null;
  coresReferencias?: Record<string, string>;
  onClose: () => void;
  onEditar: (ref: PontoReferenciaOficial) => void;
  onExcluir: (id: string) => void;
}

export const ReferenciaCard: React.FC<ReferenciaCardProps> = ({
  referencia,
  coresReferencias,
  onClose,
  onEditar,
  onExcluir,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  useEffect(() => {
    if (!referencia || Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [referencia, onClose]);

  if (!referencia) return null;

  const tipoKey = (referencia.tipo || 'OUTRO').toUpperCase();
  const corTipo = CartografiaService.obterCorTipoReferencia(tipoKey, coresReferencias);
  const nomeTipo = NOMES_PADRAO_TIPOS_REFERENCIA[tipoKey] || tipoKey;

  return (
    <View id="referenciaMapaCard" style={[styles.card, isMobile && styles.cardMobile]}>
      {/* Cabeçalho */}
      <View style={styles.cardHead}>
        <View style={styles.headMeta}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <View style={[styles.badgeTipo, { backgroundColor: `${corTipo}20`, borderColor: corTipo }]}>
              <View style={[styles.badgeTipoDot, { backgroundColor: corTipo }]} />
              <Text style={[styles.badgeTipoText, { color: corTipo }]}>{nomeTipo}</Text>
            </View>
            <Text style={styles.idText}>{referencia.id}</Text>
          </View>
          <Text id="refCardTitulo" style={styles.titleText}>
            {referencia.nome}
          </Text>
        </View>

        <TouchableOpacity
          id="fecharRefCardBtn"
          style={styles.closeBtn}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeBtnText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Corpo */}
      <View style={styles.cardBody}>
        {/* Marcador Cartográfico Oficial com Miolo na Cor do Tipo */}
        <View style={styles.markerDisplayRow}>
          <View style={styles.refMarkerOuter}>
            <View style={[styles.refMarkerInner, { backgroundColor: corTipo }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.markerDisplayText}>Ponto de Referência Cartográfica Oficial</Text>
            <Text style={styles.markerSubText}>
              Status: <Text style={{ fontWeight: '700', color: '#059669' }}>{referencia.status || 'VALIDADO'}</Text>
              {referencia.subtipo ? ` • Subtipo: ${referencia.subtipo}` : ''}
            </Text>
          </View>
        </View>

        {referencia.descricao ? (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Descrição:</Text>
            <Text style={styles.metaValue}>{referencia.descricao}</Text>
          </View>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Coordenadas Espaciais:</Text>
          <Text style={styles.metaValue}>
            X: {(referencia.x * 100).toFixed(2)}% | Y: {(referencia.y * 100).toFixed(2)}%
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Visibilidade:</Text>
          <Text style={[styles.metaValue, { color: referencia.ativo !== false ? '#059669' : '#dc2626' }]}>
            {referencia.ativo !== false ? '● Ativo no Mapa' : '○ Oculto'}
          </Text>
        </View>
      </View>

      {/* Botões de Ação do Card */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          id="btnExcluirRefCard"
          style={styles.btnExcluir}
          onPress={() => {
            if (
              typeof window !== 'undefined' &&
              window.confirm &&
              !window.confirm(`Excluir permanentemente a referência "${referencia.nome}"?`)
            ) {
              return;
            }
            onExcluir(referencia.id);
            onClose();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.btnExcluirText}>🗑️ Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="btnEditarRefCard"
          style={styles.btnEditar}
          onPress={() => {
            onEditar(referencia);
            onClose();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.btnEditarText}>✏️ Editar Referência</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 74,
    right: 20,
    width: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 90,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardMobile: {
    width: '92%',
    right: '4%',
    left: '4%',
    top: 60,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headMeta: {
    flex: 1,
    paddingRight: 8,
  },
  idText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '600',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  markerDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  refMarkerOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10144D',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  refMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  markerDisplayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  markerSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  badgeTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  badgeTipoDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  badgeTipoText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'column',
    gap: 1,
  },
  metaLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 12.5,
    color: '#334155',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  btnExcluir: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  btnExcluirText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  btnEditar: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  btnEditarText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
