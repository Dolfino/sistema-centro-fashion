import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FinanceiroRestritoService,
  ResumoFinanceiroPermissionario,
  SituacaoFinanceira,
  ContratoLocacao,
  LancamentoFinanceiro,
  AcordoFinanceiro,
  HistoricoFinanceiroEvento,
} from '../services/financeiroRestritoService';

interface FinanceiroRestritoModalProps {
  visible: boolean;
  idPermissionario: string | null;
  userRole?: string;
  onClose: () => void;
  onAbrirEditorContrato?: (idPermissionario: string, contrato?: ContratoLocacao | null) => void;
  onAbrirEditorLancamento?: (idPermissionario: string, lancamento?: LancamentoFinanceiro | null) => void;
  onAbrirRegistroPagamento?: (idPermissionario: string, lancamento: LancamentoFinanceiro) => void;
  onAbrirEditorAcordo?: (idPermissionario: string, acordo?: AcordoFinanceiro | null) => void;
}

export const FinanceiroRestritoModal: React.FC<FinanceiroRestritoModalProps> = ({
  visible,
  idPermissionario,
  userRole = 'ADMIN',
  onClose,
  onAbrirEditorContrato,
  onAbrirEditorLancamento,
  onAbrirRegistroPagamento,
  onAbrirEditorAcordo,
}) => {
  const [dados, setDados] = useState<ResumoFinanceiroPermissionario | null>(null);
  const [erroAcesso, setErroAcesso] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'FINANCEIRO' | 'AUDITORIA'>('FINANCEIRO');
  const [historicoFinanceiro, setHistoricoFinanceiro] = useState<HistoricoFinanceiroEvento[]>([]);

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

              {/* Seção de Contratos de Locação (Fase L3.6) */}
              <View style={styles.section}>
                <View style={styles.sectionHeaderBetween}>
                  <Text style={styles.sectionTitle}>
                    📜 Contratos de Locação Vigentes ({dados.contratos.length})
                  </Text>
                  {FinanceiroRestritoService.verificarPermissaoEdicaoContrato(userRole) && onAbrirEditorContrato && (
                    <TouchableOpacity
                      style={styles.btnNovoContrato}
                      onPress={() => onAbrirEditorContrato(dados.idPermissionario, null)}
                    >
                      <Ionicons name="add-circle-outline" size={15} color="#fff" />
                      <Text style={styles.btnNovoContratoText}>Novo Contrato</Text>
                    </TouchableOpacity>
                  )}
                </View>

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

                      {/* Ações do Contrato (Fase L3.6) */}
                      <View style={styles.contratoAcoesRow}>
                        {ctr.documentoUrl ? (
                          <TouchableOpacity
                            style={styles.btnDocContrato}
                            onPress={() =>
                              Alert.alert(
                                'Documento do Contrato',
                                `Arquivo: ${ctr.documentoNome || 'contrato.pdf'}\nRepositório seguro corporativo.`
                              )
                            }
                          >
                            <Ionicons name="document-text-outline" size={14} color="#38bdf8" />
                            <Text style={styles.btnDocContratoText}>
                              {ctr.documentoNome ? 'Abrir Documento' : 'Documento Anexo'}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.semDocBadge}>
                            <Text style={styles.semDocText}>Sem documento anexado</Text>
                          </View>
                        )}

                        {FinanceiroRestritoService.verificarPermissaoEdicaoContrato(userRole) && onAbrirEditorContrato && (
                          <TouchableOpacity
                            style={styles.btnEditarContrato}
                            onPress={() => onAbrirEditorContrato(dados.idPermissionario, ctr)}
                          >
                            <Ionicons name="create-outline" size={14} color="#f8fafc" />
                            <Text style={styles.btnEditarContratoText}>Editar Contrato</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Abas Superiores: Financeiro Ativo vs Auditoria Contábil */}
              <View style={styles.abasFinanceiras}>
                <TouchableOpacity
                  style={[styles.abaFinBtn, abaAtiva === 'FINANCEIRO' && styles.abaFinBtnAtiva]}
                  onPress={() => setAbaAtiva('FINANCEIRO')}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={15}
                    color={abaAtiva === 'FINANCEIRO' ? '#38bdf8' : '#94a3b8'}
                  />
                  <Text
                    style={[
                      styles.abaFinBtnText,
                      abaAtiva === 'FINANCEIRO' && styles.abaFinBtnTextAtiva,
                    ]}
                  >
                    Lançamentos, Cobranças & Acordos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.abaFinBtn, abaAtiva === 'AUDITORIA' && styles.abaFinBtnAtiva]}
                  onPress={() => setAbaAtiva('AUDITORIA')}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={15}
                    color={abaAtiva === 'AUDITORIA' ? '#10b981' : '#94a3b8'}
                  />
                  <Text
                    style={[
                      styles.abaFinBtnText,
                      abaAtiva === 'AUDITORIA' && styles.abaFinBtnTextAtiva,
                    ]}
                  >
                    Trilha de Auditoria ({historicoFinanceiro.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {abaAtiva === 'FINANCEIRO' ? (
                <>
                  {/* Seção de Lançamentos Recentes (Fase L3.7) */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeaderBetween}>
                      <Text style={styles.sectionTitle}>
                        💰 Lançamentos Financeiros ({dados.lancamentosRecentes.length})
                      </Text>
                      {FinanceiroRestritoService.verificarPermissaoEdicaoContrato(userRole) &&
                        onAbrirEditorLancamento && (
                          <TouchableOpacity
                            style={styles.btnNovoLancamento}
                            onPress={() => onAbrirEditorLancamento(dados.idPermissionario, null)}
                          >
                            <Ionicons name="add-circle-outline" size={14} color="#fff" />
                            <Text style={styles.btnNovoLancamentoText}>Novo Lançamento</Text>
                          </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.lancamentosList}>
                      {dados.lancamentosRecentes.length === 0 ? (
                        <View style={styles.emptyCard}>
                          <Text style={styles.emptyCardText}>Nenhum lançamento financeiro registrado.</Text>
                        </View>
                      ) : (
                        dados.lancamentosRecentes.map((lan) => (
                          <View key={lan.idLancamento} style={styles.lancamentoRowContainer}>
                            <View style={styles.lancamentoRow}>
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
                                {(lan.acrescimos || lan.descontos) && (
                                  <Text style={styles.lancamentoAjustesSub}>
                                    Ajustes: +{FinanceiroRestritoService.formatarMoeda(lan.acrescimos || 0)} / -{FinanceiroRestritoService.formatarMoeda(lan.descontos || 0)}
                                  </Text>
                                )}
                              </View>

                              <View style={styles.lancamentoValores}>
                                <Text style={styles.valorOriginalText}>
                                  Orig: {FinanceiroRestritoService.formatarMoeda(lan.valorOriginal)}
                                </Text>
                                <Text style={[styles.saldoAbertoDestaque, { color: lan.saldoAberto > 0 ? '#ef4444' : '#10b981' }]}>
                                  Saldo: {FinanceiroRestritoService.formatarMoeda(lan.saldoAberto)}
                                </Text>
                                <View
                                  style={[
                                    styles.lancamentoStatusBadge,
                                    lan.status === 'PAGO' && { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981' },
                                    lan.status === 'VENCIDO' && { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444' },
                                    lan.status === 'PARCIAL' && { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#f59e0b' },
                                    lan.status === 'VENCIDO_PARCIAL' && { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444' },
                                    lan.status === 'A_VENCER' && { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8' },
                                    lan.status === 'ABERTO' && { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#f59e0b' },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.lancamentoStatusText,
                                      lan.status === 'PAGO' && { color: '#10b981' },
                                      lan.status === 'VENCIDO' && { color: '#ef4444' },
                                      lan.status === 'PARCIAL' && { color: '#f59e0b' },
                                      lan.status === 'VENCIDO_PARCIAL' && { color: '#ef4444' },
                                      lan.status === 'A_VENCER' && { color: '#38bdf8' },
                                      lan.status === 'ABERTO' && { color: '#f59e0b' },
                                    ]}
                                  >
                                    {lan.status}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            {/* Botões de Ação por Lançamento (Fase L3.7) */}
                            {FinanceiroRestritoService.verificarPermissaoEdicaoContrato(userRole) && (
                              <View style={styles.lancamentoAcoesBar}>
                                <TouchableOpacity
                                  style={styles.btnAcaoAjustar}
                                  onPress={() => onAbrirEditorLancamento && onAbrirEditorLancamento(dados.idPermissionario, lan)}
                                >
                                  <Ionicons name="options-outline" size={13} color="#cbd5e1" />
                                  <Text style={styles.btnAcaoAjustarText}>Editar / Ajustar</Text>
                                </TouchableOpacity>

                                {lan.saldoAberto > 0 && onAbrirRegistroPagamento && (
                                  <TouchableOpacity
                                    style={styles.btnAcaoPagamento}
                                    onPress={() => onAbrirRegistroPagamento(dados.idPermissionario, lan)}
                                  >
                                    <Ionicons name="card-outline" size={13} color="#fff" />
                                    <Text style={styles.btnAcaoPagamentoText}>Registrar Pagamento</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          </View>
                        ))
                      )}
                    </View>
                  </View>

                  {/* Seção de Acordos Financeiros (Fase L3.7) */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeaderBetween}>
                      <Text style={styles.sectionTitle}>
                        🤝 Acordos Financeiros & Termos ({dados.acordos.length})
                      </Text>
                      {FinanceiroRestritoService.verificarPermissaoEdicaoContrato(userRole) &&
                        onAbrirEditorAcordo && (
                          <TouchableOpacity
                            style={styles.btnNovoAcordo}
                            onPress={() => onAbrirEditorAcordo(dados.idPermissionario, null)}
                          >
                            <Ionicons name="add-circle-outline" size={14} color="#fff" />
                            <Text style={styles.btnNovoAcordoText}>Novo Acordo</Text>
                          </TouchableOpacity>
                        )}
                    </View>

                    {dados.acordos.length === 0 ? (
                      <View style={styles.emptyCard}>
                        <Text style={styles.emptyCardText}>Nenhum termo de acordo registrado.</Text>
                      </View>
                    ) : (
                      dados.acordos.map((ac) => (
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
                          <View style={styles.acordoFooterRow}>
                            <Text style={styles.acordoResponsavel}>
                              Responsável: {ac.responsavelNegociacao} • Data: {ac.dataAcordo}
                            </Text>

                            {FinanceiroRestritoService.verificarPermissaoEdicaoContrato(userRole) &&
                              onAbrirEditorAcordo && (
                                <TouchableOpacity
                                  style={styles.btnEditarAcordo}
                                  onPress={() => onAbrirEditorAcordo(dados.idPermissionario, ac)}
                                >
                                  <Ionicons name="create-outline" size={12} color="#f8fafc" />
                                  <Text style={styles.btnEditarAcordoText}>Editar Acordo</Text>
                                </TouchableOpacity>
                              )}
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                </>
              ) : (
                /* Aba de Auditoria Financeira Imutável */
                <View style={styles.section}>
                  <View style={styles.auditoriaHeaderCard}>
                    <Ionicons name="shield-checkmark" size={18} color="#10b981" />
                    <Text style={styles.auditoriaHeaderText}>
                      Trilha de Auditoria Financeira Imutável (Fase L3.7). Todas as criações, ajustes de valor,
                      amortizações e baixas são registradas com integridade estrita e append-only.
                    </Text>
                  </View>

                  {historicoFinanceiro.length === 0 ? (
                    <View style={styles.emptyCard}>
                      <Text style={styles.emptyCardText}>Nenhum evento financeiro auditado para este titular.</Text>
                    </View>
                  ) : (
                    historicoFinanceiro.map((evt) => (
                      <View key={evt.idEvento} style={styles.auditoriaEventoCard}>
                        <View style={styles.auditoriaEventoTop}>
                          <View style={styles.auditoriaBadgeTipo}>
                            <Text style={styles.auditoriaBadgeTipoText}>{evt.tipoEvento}</Text>
                          </View>
                          <Text style={styles.auditoriaData}>{evt.dataHora}</Text>
                        </View>

                        <Text style={styles.auditoriaUsuario}>
                          Operador: <Text style={{ color: '#cbd5e1' }}>{evt.emailUsuario}</Text> ({evt.idUsuario})
                        </Text>

                        {evt.valorMovimento !== undefined && (
                          <Text style={styles.auditoriaValor}>
                            Valor Movimentado: {FinanceiroRestritoService.formatarMoeda(evt.valorMovimento)}
                          </Text>
                        )}

                        <View style={styles.auditoriaCamposRow}>
                          <Text style={styles.auditoriaCamposLabel}>Campos: </Text>
                          {evt.camposAlterados.map((c) => (
                            <View key={c} style={styles.auditoriaCampoTag}>
                              <Text style={styles.auditoriaCampoTagText}>{c}</Text>
                            </View>
                          ))}
                        </View>

                        {evt.observacao ? (
                          <Text style={styles.auditoriaObs}>"{evt.observacao}"</Text>
                        ) : null}
                      </View>
                    ))
                  )}
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
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnNovoContrato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnNovoContratoText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contratoAcoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  btnDocContrato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  btnDocContratoText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  semDocBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#0f172a',
  },
  semDocText: {
    fontSize: 10,
    color: '#64748b',
  },
  btnEditarContrato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnEditarContratoText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: 'bold',
  },
  abasFinanceiras: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 16,
    gap: 8,
  },
  abaFinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  abaFinBtnAtiva: {
    borderBottomColor: '#38bdf8',
  },
  abaFinBtnText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  abaFinBtnTextAtiva: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  btnNovoLancamento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnNovoLancamentoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  lancamentoRowContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  lancamentoAjustesSub: {
    fontSize: 10,
    color: '#f59e0b',
    marginTop: 2,
  },
  saldoAbertoDestaque: {
    fontSize: 12,
    fontWeight: '800',
  },
  lancamentoAcoesBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#131d36',
    borderTopWidth: 1,
    borderTopColor: '#24324d',
  },
  btnAcaoAjustar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  btnAcaoAjustarText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  btnAcaoPagamento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  btnAcaoPagamentoText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnNovoAcordo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#d97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnNovoAcordoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  acordoFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  btnEditarAcordo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  btnEditarAcordoText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: 'bold',
  },
  auditoriaHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  auditoriaHeaderText: {
    fontSize: 12,
    color: '#cbd5e1',
    flex: 1,
    lineHeight: 18,
  },
  auditoriaEventoCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  auditoriaEventoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  auditoriaBadgeTipo: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  auditoriaBadgeTipoText: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  auditoriaData: {
    fontSize: 11,
    color: '#94a3b8',
  },
  auditoriaUsuario: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
  },
  auditoriaValor: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
    marginBottom: 4,
  },
  auditoriaCamposRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
    marginBottom: 6,
  },
  auditoriaCamposLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  auditoriaCampoTag: {
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  auditoriaCampoTagText: {
    fontSize: 10,
    color: '#cbd5e1',
  },
  auditoriaObs: {
    fontSize: 11,
    color: '#f8fafc',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
