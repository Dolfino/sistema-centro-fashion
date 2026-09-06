import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  FinanceiroRestritoService,
  ResumoFinanceiroPermissionario,
  SituacaoFinanceira,
} from '../services/financeiroRestritoService';

interface FinanceiroRestritoModalProps {
  visible: boolean;
  idPermissionario: string | null;
  userRole?: string;
  onClose: () => void;
}

export const FinanceiroRestritoModal: React.FC<FinanceiroRestritoModalProps> = ({
  visible,
  idPermissionario,
  userRole = 'ADMIN',
  onClose,
}) => {
  const [dados, setDados] = useState<ResumoFinanceiroPermissionario | null>(null);
  const [erroAcesso, setErroAcesso] = useState<string | null>(null);

  useEffect(() => {
    if (visible && idPermissionario) {
      try {
        setErroAcesso(null);
        const resumo = FinanceiroRestritoService.obterResumoFinanceiro(idPermissionario, userRole);
        setDados(resumo);
      } catch (err: any) {
        setErroAcesso(err.message || 'Acesso restrito negado');
      }
    }
  }, [visible, idPermissionario, userRole]);

  if (!visible) return null;

  const getSituacaoBadge = (sit?: SituacaoFinanceira) => {
    switch (sit) {
      case 'ADIMPLENTE':
        return { label: 'Adimplente', cor: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: '✅' };
      case 'INADIMPLENTE':
        return { label: 'Inadimplente', cor: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '⚠️' };
      case 'PENDENTE':
        return { label: 'Aguardando Pagamento', cor: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '⏳' };
      default:
        return { label: 'Sem Lançamentos', cor: '#64748b', bg: 'rgba(100, 116, 139, 0.15)', icon: 'ℹ️' };
    }
  };

  const badge = getSituacaoBadge(dados?.situacao);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header de Segurança */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.securityBadge}>
                <Text style={styles.securityBadgeText}>🔒 ACESSO RESTRITO • DADOS CONFIDENCIAIS</Text>
              </View>
              <Text style={styles.headerTitle}>Contratos & Posição Financeira</Text>
              <Text style={styles.headerSubtitle}>
                {dados?.razaoSocial || 'Auditoria Corporativa'} • {dados?.documento}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {erroAcesso ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>🚫</Text>
              <Text style={styles.errorTitle}>Acesso Não Autorizado</Text>
              <Text style={styles.errorMessage}>{erroAcesso}</Text>
              <TouchableOpacity style={styles.errorBtn} onPress={onClose}>
                <Text style={styles.errorBtnText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          ) : !dados ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando dados financeiros seguros...</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
              {/* Card de Situação de Adimplência e Indicadores */}
              <View style={styles.situacaoCard}>
                <View style={styles.situacaoTopRow}>
                  <View>
                    <Text style={styles.cardLabel}>Status de Pagamento do Titular</Text>
                    <View style={[styles.situacaoBadge, { backgroundColor: badge.bg, borderColor: badge.cor }]}>
                      <Text style={[styles.situacaoBadgeText, { color: badge.cor }]}>
                        {badge.icon} {badge.label}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.cardLabel}>Último Pagamento Realizado</Text>
                    <Text style={styles.ultimoPagamentoText}>{dados.dataUltimoPagamento}</Text>
                  </View>
                </View>

                <View style={styles.kpiGrid}>
                  <View style={styles.kpiItem}>
                    <Text style={styles.kpiRotulo}>Saldo Total em Aberto</Text>
                    <Text style={styles.kpiValor}>
                      {FinanceiroRestritoService.formatarMoeda(dados.saldoTotalAberto)}
                    </Text>
                  </View>
                  <View style={styles.kpiItem}>
                    <Text style={styles.kpiRotulo}>Saldo Vencido</Text>
                    <Text style={[styles.kpiValor, { color: dados.saldoTotalVencido > 0 ? '#ef4444' : '#10b981' }]}>
                      {FinanceiroRestritoService.formatarMoeda(dados.saldoTotalVencido)}
                    </Text>
                  </View>
                  <View style={styles.kpiItem}>
                    <Text style={styles.kpiRotulo}>Lançamentos Vencidos</Text>
                    <Text style={[styles.kpiValor, { color: dados.quantidadeLancamentosVencidos > 0 ? '#ef4444' : '#cbd5e1' }]}>
                      {dados.quantidadeLancamentosVencidos} un.
                    </Text>
                  </View>
                  <View style={styles.kpiItem}>
                    <Text style={styles.kpiRotulo}>Maior Atraso</Text>
                    <Text style={[styles.kpiValor, { color: dados.maiorAtrasoDias > 0 ? '#f59e0b' : '#cbd5e1' }]}>
                      {dados.maiorAtrasoDias} dias
                    </Text>
                  </View>
                </View>
              </View>

              {/* Seção de Contratos de Locação */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📜 Contratos de Locação Vigentes ({dados.contratos.length})</Text>
                {dados.contratos.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyCardText}>Nenhum contrato ativo registrado.</Text>
                  </View>
                ) : (
                  dados.contratos.map((ctr) => (
                    <View key={ctr.idContrato} style={styles.contratoCard}>
                      <View style={styles.contratoHeader}>
                        <View>
                          <Text style={styles.contratoNumero}>{ctr.numeroContrato}</Text>
                          <Text style={styles.contratoTipo}>
                            {ctr.tipoContrato} • Vigência: {ctr.dataInicio} até {ctr.dataFim}
                          </Text>
                        </View>
                        <View style={styles.contratoStatusBadge}>
                          <Text style={styles.contratoStatusText}>● {ctr.status}</Text>
                        </View>
                      </View>

                      <View style={styles.contratoGrid}>
                        <View style={styles.contratoCol}>
                          <Text style={styles.contratoMiniLabel}>Aluguel Mínimo:</Text>
                          <Text style={styles.contratoMiniValue}>
                            {FinanceiroRestritoService.formatarMoeda(ctr.aluguelMinimoMensal)}/mês
                          </Text>
                        </View>
                        <View style={styles.contratoCol}>
                          <Text style={styles.contratoMiniLabel}>% Faturamento:</Text>
                          <Text style={styles.contratoMiniValue}>{ctr.percentualFaturamento}%</Text>
                        </View>
                        <View style={styles.contratoCol}>
                          <Text style={styles.contratoMiniLabel}>Fundo Promoção:</Text>
                          <Text style={styles.contratoMiniValue}>
                            {FinanceiroRestritoService.formatarMoeda(ctr.fundoPromocao)}
                          </Text>
                        </View>
                        <View style={styles.contratoCol}>
                          <Text style={styles.contratoMiniLabel}>Dia Vencimento:</Text>
                          <Text style={styles.contratoMiniValue}>Todo dia {ctr.diaVencimento}</Text>
                        </View>
                      </View>

                      <View style={styles.contratoBoxesRow}>
                        <Text style={styles.contratoMiniLabel}>Boxes Cobertos: </Text>
                        {ctr.espacosVinculados.map((b) => (
                          <View key={b} style={styles.boxTagSmall}>
                            <Text style={styles.boxTagSmallText}>Box {b}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Seção de Lançamentos Recentes */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💰 Lançamentos Recentes & Cobranças</Text>
                <View style={styles.lancamentosList}>
                  {dados.lancamentosRecentes.map((lan) => (
                    <View key={lan.idLancamento} style={styles.lancamentoRow}>
                      <View style={styles.lancamentoInfo}>
                        <View style={styles.lancamentoMetaRow}>
                          <Text style={styles.competenciaBadge}>{lan.competencia}</Text>
                          <Text style={styles.lancamentoDescricao}>{lan.descricao}</Text>
                        </View>
                        <Text style={styles.lancamentoVencimento}>
                          Vencimento: {lan.dataVencimento}
                          {lan.diasAtraso > 0 && (
                            <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>
                              {' '}• Atraso de {lan.diasAtraso} dias
                            </Text>
                          )}
                        </Text>
                      </View>

                      <View style={styles.lancamentoValores}>
                        <Text style={styles.valorOriginalText}>
                          {FinanceiroRestritoService.formatarMoeda(lan.valorOriginal)}
                        </Text>
                        <View
                          style={[
                            styles.lancamentoStatusBadge,
                            lan.status === 'PAGO' && { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981' },
                            lan.status === 'VENCIDO' && { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444' },
                            lan.status === 'ABERTO' && { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#f59e0b' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.lancamentoStatusText,
                              lan.status === 'PAGO' && { color: '#10b981' },
                              lan.status === 'VENCIDO' && { color: '#ef4444' },
                              lan.status === 'ABERTO' && { color: '#f59e0b' },
                            ]}
                          >
                            {lan.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Seção de Acordos e Termos de Confissão */}
              {dados.acordos.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🤝 Acordos Financeiros & Renegociações</Text>
                  {dados.acordos.map((ac) => (
                    <View key={ac.idAcordo} style={styles.acordoCard}>
                      <View style={styles.acordoTopRow}>
                        <Text style={styles.acordoTipo}>{ac.tipo}</Text>
                        <Text style={styles.acordoStatus}>{ac.status}</Text>
                      </View>
                      <Text style={styles.acordoDescricao}>
                        Valor original de {FinanceiroRestritoService.formatarMoeda(ac.valorOriginal)} negociado por{' '}
                        <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                          {FinanceiroRestritoService.formatarMoeda(ac.valorNegociado)}
                        </Text>{' '}
                        em {ac.quantidadeParcelas} parcelas.
                      </Text>
                      <Text style={styles.acordoResponsavel}>
                        Responsável: {ac.responsavelNegociacao} • Data: {ac.dataAcordo}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: Math.min(840, width - 24),
    maxHeight: Math.min(760, height - 32),
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleGroup: {
    flex: 1,
  },
  securityBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ef4444',
    marginBottom: 4,
  },
  securityBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollArea: {
    padding: 20,
  },
  situacaoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  situacaoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
  },
  situacaoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  situacaoBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  ultimoPagamentoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
  },
  kpiGrid: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  kpiRotulo: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 2,
  },
  kpiValor: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyCardText: {
    color: '#64748b',
    fontSize: 13,
  },
  contratoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
    marginBottom: 10,
  },
  contratoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contratoNumero: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38bdf8',
  },
  contratoTipo: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  contratoStatusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  contratoStatusText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  contratoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#131d36',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  contratoCol: {
    minWidth: 130,
  },
  contratoMiniLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  contratoMiniValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
  },
  contratoBoxesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boxTagSmall: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  boxTagSmallText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  lancamentosList: {
    gap: 8,
  },
  lancamentoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  lancamentoInfo: {
    flex: 1,
  },
  lancamentoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  competenciaBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lancamentoDescricao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  lancamentoVencimento: {
    fontSize: 11,
    color: '#94a3b8',
  },
  lancamentoValores: {
    alignItems: 'flex-end',
    gap: 4,
  },
  valorOriginalText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
  },
  lancamentoStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  lancamentoStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  acordoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  acordoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  acordoTipo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38bdf8',
  },
  acordoStatus: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
  },
  acordoDescricao: {
    fontSize: 12,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  acordoResponsavel: {
    fontSize: 11,
    color: '#64748b',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ef4444',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 18,
  },
  errorBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorBtnText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
