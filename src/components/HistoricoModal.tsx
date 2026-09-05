import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SignagePin } from './InteractiveMallMap';

interface HistoricoItem {
  id: string;
  dataHora: string;
  responsavel: string;
  tipoAcao: string;
  detalhes: string;
}

interface HistoricoModalProps {
  visible: boolean;
  pin: SignagePin | null;
  onClose: () => void;
}

export const HistoricoModal: React.FC<HistoricoModalProps> = ({
  visible,
  pin,
  onClose,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  if (!visible || !pin) return null;

  // Eventos históricos simulados a partir dos dados do ativo
  const historico: HistoricoItem[] = [
    {
      id: 'h1',
      dataHora: '2026-08-14 09:30',
      responsavel: pin.responsible || 'Davidsilva • Operações',
      tipoAcao: 'Cadastro Inicial do Ativo',
      detalhes: `Sinalização cadastrada no setor ${pin.sector} com protocolo ${pin.assetCode}.`,
    },
    {
      id: 'h2',
      dataHora: '2026-08-20 14:15',
      responsavel: 'Equipe de Manutenção',
      tipoAcao: 'Vistoria Preventiva',
      detalhes: `Avaliação do estado de conservação: ${pin.conservationState || 'Boa'}.`,
    },
    {
      id: 'h3',
      dataHora: '2026-09-05 11:45',
      responsavel: 'Davidsilva • Operações',
      tipoAcao: 'Auditoria de Sistema (Gate UI-6)',
      detalhes: `Posição espacial confirmada no mapa interativo (${pin.humanLocation || 'Localização no mall'}).`,
    },
  ];

  return (
    <View style={styles.overlay}>
      <View id="historicoPanel" style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Linha do Tempo de Auditoria (S8)</Text>
            <Text style={styles.title}>
              Histórico — {pin.assetCode}
            </Text>
          </View>

          <TouchableOpacity id="btnFecharHistorico" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo */}
        <View style={styles.pinSummary}>
          <Text style={styles.pinTitle}>{pin.notes || pin.category}</Text>
          <Text style={styles.pinSector}>Setor: {pin.sector} • Estado: {pin.conservationState || 'Boa'}</Text>
        </View>

        {/* Lista do Histórico (#historicoLista) */}
        <ScrollView id="historicoLista" style={styles.body} contentContainerStyle={styles.bodyContent}>
          {historico.map((item, idx) => (
            <View key={item.id} style={styles.timelineItem}>
              {/* Marcador da Timeline */}
              <View style={styles.timelineMarkerCol}>
                <View style={styles.timelineDot} />
                {idx < historico.length - 1 && <View style={styles.timelineLine} />}
              </View>

              {/* Conteúdo do Evento */}
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineAcao}>{item.tipoAcao}</Text>
                  <Text style={styles.timelineData}>{item.dataHora}</Text>
                </View>

                <Text style={styles.timelineResp}>Por: {item.responsavel}</Text>
                <Text style={styles.timelineDetalhes}>{item.detalhes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Rodapé */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnCloseText}>Fechar Histórico</Text>
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
    backgroundColor: 'rgba(10, 16, 30, 0.75)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 580,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  modalBoxMobile: {
    maxWidth: '100%',
    maxHeight: '96%',
    borderRadius: 8,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#11184F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00C8FF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  pinSummary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pinTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  pinSector: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 18,
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineMarkerCol: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    marginTop: 4,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineAcao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  timelineData: {
    fontSize: 11,
    color: '#64748B',
  },
  timelineResp: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 6,
  },
  timelineDetalhes: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  btnClose: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#11184F',
  },
  btnCloseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
