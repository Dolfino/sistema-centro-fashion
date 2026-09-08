import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SignagePin } from './InteractiveMallMap';

export interface AlertaOperacional {
  id: string;
  tipo: 'SLA_CRITICO' | 'DANIFICADA' | 'RONDA_PENDENTE' | 'SYNC_OUTBOX';
  titulo: string;
  descricao: string;
  setor: string;
  gravidade: 'CRITICA' | 'ALTA' | 'MEDIA' | 'INFO';
  timestamp: string;
  pinAssociado?: SignagePin;
  reconhecido?: boolean;
}

interface AlertasModalProps {
  visible: boolean;
  pins: SignagePin[];
  outboxPendingCount?: number;
  onClose: () => void;
  onSelectPin: (pin: SignagePin) => void;
}

export const AlertasModal: React.FC<AlertasModalProps> = ({
  visible,
  pins,
  outboxPendingCount = 0,
  onClose,
  onSelectPin,
}) => {
  const [activeTab, setActiveTab] = useState<'TODOS' | 'CRITICOS' | 'SLA' | 'RONDAS'>('TODOS');
  const [reconhecidos, setReconhecidos] = useState<{ [id: string]: boolean }>({});

  // Gera alertas dinâmicos baseados nos dados reais do sistema
  const alertas = useMemo<AlertaOperacional[]>(() => {
    const list: AlertaOperacional[] = [];

    // 1. Alertas de Ocorrências Críticas / SLA
    pins
      .filter((p) => p.priority === 'CRITICA' || p.prazoHoras === 2)
      .forEach((p) => {
        list.push({
          id: `alt_sla_${p.id}`,
          tipo: 'SLA_CRITICO',
          titulo: `SLA Crítico: ${p.assetCode} (${p.category})`,
          descricao: `Prazo de atendimento urgente (${p.prazoHoras || 2}h). Local: ${p.humanLocation || p.sector}. Notas: ${p.notes || ''}`,
          setor: p.sector,
          gravidade: 'CRITICA',
          timestamp: 'Há 15 min',
          pinAssociado: p,
        });
      });

    // 2. Alertas de Sinalizações Danificadas
    pins
      .filter((p) => p.conservationState === 'Danificada')
      .forEach((p) => {
        list.push({
          id: `alt_dan_${p.id}`,
          tipo: 'DANIFICADA',
          titulo: `Sinalização Avariada: ${p.assetCode}`,
          descricao: `Estrutura com avaria física requerendo substituição ou reparo no ${p.sector}.`,
          setor: p.sector,
          gravidade: 'ALTA',
          timestamp: 'Há 45 min',
          pinAssociado: p,
        });
      });

    // 3. Alertas de Ronda Pendente
    list.push({
      id: 'alt_ronda_amarelo',
      tipo: 'RONDA_PENDENTE',
      titulo: 'Ronda Diária Pendente: Setor Amarelo',
      descricao: 'A vistoria diária de segurança e iluminação do Setor Amarelo ainda não foi realizada hoje.',
      setor: 'SETOR_AMARELO',
      gravidade: 'MEDIA',
      timestamp: 'Hoje às 08:00',
    });

    list.push({
      id: 'alt_ronda_verde',
      tipo: 'RONDA_PENDENTE',
      titulo: 'Auditoria de Mídias Pendente: Setor Verde',
      descricao: 'Última auditoria de totens publicitários realizada há mais de 7 dias.',
      setor: 'SETOR_VERDE',
      gravidade: 'INFO',
      timestamp: 'Há 2 dias',
    });

    // 4. Alerta de Sincronização Outbox
    if (outboxPendingCount > 0) {
      list.push({
        id: 'alt_outbox_pending',
        tipo: 'SYNC_OUTBOX',
        titulo: 'Itens na Fila Outbox aguardando sincronização',
        descricao: `Existem ${outboxPendingCount} evento(s) pendente(s) de sincronização no dispositivo.`,
        setor: 'SISTEMA',
        gravidade: 'MEDIA',
        timestamp: 'Agora',
      });
    }

    return list;
  }, [pins, outboxPendingCount]);

  if (!visible) return null;

  const filteredAlertas = alertas.filter((a) => {
    if (reconhecidos[a.id]) return false;
    if (activeTab === 'CRITICOS') return a.gravidade === 'CRITICA' || a.gravidade === 'ALTA';
    if (activeTab === 'SLA') return a.tipo === 'SLA_CRITICO';
    if (activeTab === 'RONDAS') return a.tipo === 'RONDA_PENDENTE';
    return true;
  });

  const handleReconhecer = (id: string) => {
    setReconhecidos((prev) => ({ ...prev, [id]: true }));
  };

  const getGravidadeStyle = (gravidade: string) => {
    switch (gravidade) {
      case 'CRITICA':
        return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B', badge: '#B91C1C' };
      case 'ALTA':
        return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', badge: '#D97706' };
      case 'MEDIA':
        return { bg: '#E0F2FE', border: '#0284C7', text: '#075985', badge: '#0284C7' };
      default:
        return { bg: '#F1F5F9', border: '#94A3B8', text: '#334155', badge: '#64748B' };
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerIconText}>🔔</Text>
            </View>
            <View>
              <Text style={styles.modalTitle}>Central de Alertas & Notificações SLA</Text>
              <Text style={styles.modalSubtitle}>
                Monitoramento proativo de ocorrências críticas, prazos operacionais e rondas
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} aria-label="Fechar">
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabsRow}>
          {[
            { key: 'TODOS', label: `Todos (${filteredAlertas.length})` },
            { key: 'CRITICOS', label: '🚨 Críticos & Urgentes' },
            { key: 'SLA', label: '⏱️ Prazos de SLA' },
            { key: 'RONDAS', label: '📋 Rondas Pendentes' },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
              onPress={() => setActiveTab(t.key as any)}
            >
              <Text style={[styles.tabBtnText, activeTab === t.key && styles.tabBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alertas List */}
        <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContainer}>
          {filteredAlertas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>✓</Text>
              <Text style={styles.emptyTitle}>Nenhum alerta pendente!</Text>
              <Text style={styles.emptySubtitle}>
                Todas as ocorrências e rondas do mall estão em conformidade neste momento.
              </Text>
            </View>
          ) : (
            filteredAlertas.map((a) => {
              const gravStyle = getGravidadeStyle(a.gravidade);

              return (
                <View
                  key={a.id}
                  style={[
                    styles.alertaCard,
                    { backgroundColor: gravStyle.bg, borderLeftColor: gravStyle.border },
                  ]}
                >
                  <View style={styles.alertaCardHeader}>
                    <View style={styles.alertaTitleRow}>
                      <View
                        style={[styles.gravidadeBadge, { backgroundColor: gravStyle.badge }]}
                      >
                        <Text style={styles.gravidadeBadgeText}>{a.gravidade}</Text>
                      </View>
                      <Text style={[styles.alertaTitle, { color: gravStyle.text }]}>
                        {a.titulo}
                      </Text>
                    </View>
                    <Text style={styles.alertaTimestamp}>{a.timestamp}</Text>
                  </View>

                  <Text style={styles.alertaDesc}>{a.descricao}</Text>

                  <View style={styles.alertaCardFooter}>
                    <Text style={styles.alertaSetorTag}>📍 {a.setor}</Text>

                    <View style={styles.alertaActionsGroup}>
                      {a.pinAssociado && (
                        <TouchableOpacity
                          style={styles.btnVerMapa}
                          onPress={() => {
                            onSelectPin(a.pinAssociado!);
                            onClose();
                          }}
                        >
                          <Text style={styles.btnVerMapaText}>Ver no Mapa</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.btnReconhecer}
                        onPress={() => handleReconhecer(a.id)}
                      >
                        <Text style={styles.btnReconhecerText}>Reconhecer</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Text style={styles.footerNote}>
            Alertas são atualizados em tempo real com base no monitoramento do SLA e vistorias.
          </Text>
          <TouchableOpacity style={styles.footerCloseBtn} onPress={onClose}>
            <Text style={styles.footerCloseBtnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    zIndex: 160,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 780,
    maxHeight: '85%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 20,
    flexDirection: 'column',
  },
  modalHeader: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: {
    backgroundColor: '#0284C7',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },

  listScroll: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  alertaCard: {
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alertaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  gravidadeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gravidadeBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  alertaTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  alertaTimestamp: {
    fontSize: 11,
    color: '#64748B',
  },
  alertaDesc: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  alertaCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  alertaSetorTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  alertaActionsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  btnVerMapa: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  btnVerMapaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  btnReconhecer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  btnReconhecerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    color: '#166534',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },

  modalFooter: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  footerCloseBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  footerCloseBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
});
