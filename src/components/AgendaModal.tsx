import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface RotinaPreventiva {
  id: string;
  titulo: string;
  frequencia: 'DIARIA' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL';
  horarioPrevisto: string;
  setor: string;
  responsavel: string;
  statusHoje: 'CONCLUIDA' | 'EM_ANDAMENTO' | 'PENDENTE';
  descricao: string;
}

const ROTINAS_AGENDA: RotinaPreventiva[] = [
  {
    id: 'ROT_01',
    titulo: 'Ronda Matinal de Abertura & Sinalização',
    frequencia: 'DIARIA',
    horarioPrevisto: '08:00 — 09:30',
    setor: 'Todos os Setores',
    responsavel: 'Equipe de Operações Mall',
    statusHoje: 'CONCLUIDA',
    descricao: 'Verificação de portas de acesso, totens de wayfinding e iluminação das galerias antes da abertura dos boxes.',
  },
  {
    id: 'ROT_02',
    titulo: 'Auditoria de Higienização & Sanitários',
    frequencia: 'DIARIA',
    horarioPrevisto: 'A cada 2 horas (Próxima: 16:00)',
    setor: 'Setor Azul & Setor Amarelo',
    responsavel: 'Fiscal de Limpeza',
    statusHoje: 'EM_ANDAMENTO',
    descricao: 'Controle de reposição de insumos, verificação de odores e inspeção de válvulas hidráulicas.',
  },
  {
    id: 'ROT_03',
    titulo: 'Vistoria Preventiva de Extintores & Iluminação de Emergência',
    frequencia: 'SEMANAL',
    horarioPrevisto: 'Toda Terça-feira (14:00)',
    setor: 'Setor Vermelho (Estacionamento)',
    responsavel: 'Brigada de Incêndio',
    statusHoje: 'PENDENTE',
    descricao: 'Checagem de lacres, validade das cargas de pó químico/CO2 e teste de acendimento automático das luminárias.',
  },
  {
    id: 'ROT_04',
    titulo: 'Inspeção de Mídias Publicitárias & Teste de Painéis de LED',
    frequencia: 'QUINZENAL',
    horarioPrevisto: 'Dias 05 e 20 de cada mês',
    setor: 'Praça Central & Corredores',
    responsavel: 'Marketing / Comunicação',
    statusHoje: 'PENDENTE',
    descricao: 'Auditoria de conformidade das peças anunciadas, telas digitais e placas suspensas das esquinas.',
  },
  {
    id: 'ROT_05',
    titulo: 'Auditoria Geral de Rotas de Fuga & Portas Corta-Fogo',
    frequencia: 'MENSAL',
    horarioPrevisto: 'Última Sexta-feira do Mês',
    setor: 'Todos os Setores (Subsolo ao Piso 3)',
    responsavel: 'Engenharia de Segurança',
    statusHoje: 'PENDENTE',
    descricao: 'Garantia de desobstrução total dos acessos de emergência, teste de maçanetas antipânico e sinalização fotoluminescente.',
  },
];

interface AgendaModalProps {
  visible: boolean;
  onClose: () => void;
  onIniciarRonda: (setor: string) => void;
}

export const AgendaModal: React.FC<AgendaModalProps> = ({
  visible,
  onClose,
  onIniciarRonda,
}) => {
  if (!visible) return null;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'CONCLUIDA':
        return { bg: '#DCFCE7', text: '#166534', label: '✓ Concluída Hoje' };
      case 'EM_ANDAMENTO':
        return { bg: '#FEF3C7', text: '#92400E', label: '⏳ Em Andamento' };
      default:
        return { bg: '#F1F5F9', text: '#475569', label: '○ Agendada' };
    }
  };

  const getFrequenciaColor = (freq: string) => {
    switch (freq) {
      case 'DIARIA':
        return '#0284C7';
      case 'SEMANAL':
        return '#7C3AED';
      case 'QUINZENAL':
        return '#D97706';
      default:
        return '#475569';
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.modalTitle}>Agenda Operacional & Planos Preventivos</Text>
              <Text style={styles.modalSubtitle}>
                Cronograma de rondas rotineiras, auditorias periódicas e manutenção preventiva
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} aria-label="Fechar">
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Rotinas List */}
        <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContainer}>
          <Text style={styles.sectionTitle}>Rotinas Programadas para o Empreendimento</Text>

          {ROTINAS_AGENDA.map((rotina) => {
            const statusStyle = getStatusBadgeStyle(rotina.statusHoje);
            const freqColor = getFrequenciaColor(rotina.frequencia);

            return (
              <View key={rotina.id} style={styles.rotinaCard}>
                <View style={styles.rotinaHeader}>
                  <View style={styles.rotinaTitleRow}>
                    <View style={[styles.freqBadge, { backgroundColor: freqColor }]}>
                      <Text style={styles.freqBadgeText}>{rotina.frequencia}</Text>
                    </View>
                    <Text style={styles.rotinaTitulo}>{rotina.titulo}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.rotinaDesc}>{rotina.descricao}</Text>

                <View style={styles.rotinaMetaRow}>
                  <Text style={styles.metaItem}>🕒 {rotina.horarioPrevisto}</Text>
                  <Text style={styles.metaItem}>📍 {rotina.setor}</Text>
                  <Text style={styles.metaItem}>👤 {rotina.responsavel}</Text>
                </View>

                <View style={styles.rotinaActionsRow}>
                  <TouchableOpacity
                    style={styles.btnIniciarRotina}
                    onPress={() => {
                      onIniciarRonda(rotina.setor);
                      onClose();
                    }}
                  >
                    <Text style={styles.btnIniciarRotinaText}>▶ Executar Vistoria Agora</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Text style={styles.footerNote}>
            Planos preventivos evitam sinistros e garantem 100% de disponibilidade visual e estrutural.
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
    maxWidth: 820,
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

  bodyScroll: {
    flex: 1,
  },
  bodyContainer: {
    padding: 18,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  rotinaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rotinaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rotinaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  freqBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freqBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  rotinaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rotinaDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  rotinaMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 12,
  },
  metaItem: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  rotinaActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnIniciarRotina: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnIniciarRotinaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
