import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FinanceiroRestritoService,
  ItemCarteiraFinanceira,
  KPIsCentralFinanceira,
  FiltrosCarteiraFinanceira,
  SituacaoFinanceira,
} from '../services/financeiroRestritoService';

interface CentralFinanceiraModalProps {
  visible: boolean;
  onClose: () => void;
  userRole?: string;
  onAbrirDetalhesFinanceiros: (idPermissionario: string) => void;
  onAbrirGestaoPermissionario?: (idPermissionario: string) => void;
}

export const CentralFinanceiraModal: React.FC<CentralFinanceiraModalProps> = ({
  visible,
  onClose,
  userRole = 'ADMIN',
  onAbrirDetalhesFinanceiros,
  onAbrirGestaoPermissionario,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('TODOS');
  const [filtroContrato, setFiltroContrato] = useState<string>('TODOS');
  const [filtroAcordo, setFiltroAcordo] = useState<string>('TODOS');
  const [ordenacao, setOrdenacao] = useState<
    'MAIOR_SALDO_ABERTO' | 'MAIOR_ATRASO' | 'VENCIMENTO_CONTRATO' | 'NOME'
  >('MAIOR_SALDO_ABERTO');

  const [carteira, setCarteira] = useState<ItemCarteiraFinanceira[]>([]);
  const [kpis, setKpis] = useState<KPIsCentralFinanceira | null>(null);

  const temAcesso = FinanceiroRestritoService.verificarPermissaoLeitura(userRole);

  useEffect(() => {
    if (visible && temAcesso) {
      carregarDados();
    }
  }, [visible, busca, filtroSituacao, filtroContrato, filtroAcordo, ordenacao, temAcesso]);

  const carregarDados = () => {
    try {
      const filtros: FiltrosCarteiraFinanceira = {
        busca: busca.trim(),
        situacao: filtroSituacao,
        contrato: filtroContrato,
        acordo: filtroAcordo,
        ordenacao,
      };
      const lista = FinanceiroRestritoService.obterCarteiraGlobal(filtros, userRole);
      const metrics = FinanceiroRestritoService.obterKPIsCarteira(userRole);
      setCarteira(lista);
      setKpis(metrics);
    } catch (e) {
      console.error('Erro ao carregar dados da Central Financeira:', e);
    }
  };

  const limparFiltros = () => {
    setBusca('');
    setFiltroSituacao('TODOS');
    setFiltroContrato('TODOS');
    setFiltroAcordo('TODOS');
    setOrdenacao('MAIOR_SALDO_ABERTO');
  };

  const getBadgeSituacao = (situacao: SituacaoFinanceira) => {
    switch (situacao) {
      case 'INADIMPLENTE':
        return { bg: '#7f1d1d', text: '#fca5a5', border: '#ef4444', label: 'INADIMPLENTE' };
      case 'PENDENTE':
        return { bg: '#78350f', text: '#fde68a', border: '#f59e0b', label: 'PENDENTE' };
      case 'ADIMPLENTE':
        return { bg: '#064e3b', text: '#6ee7b7', border: '#10b981', label: 'ADIMPLENTE' };
      case 'SEM_LANCAMENTOS':
        return { bg: '#334155', text: '#94a3b8', border: '#64748b', label: 'SEM LANÇAMENTOS' };
    }
  };

  if (!temAcesso) {
    return (
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.container, styles.containerBloqueado]}>
            <View style={styles.bloqueioBox}>
              <Ionicons name="lock-closed" size={56} color="#ef4444" />
              <Text style={styles.bloqueioTitulo}>Acesso Restrito • Governança Financeira</Text>
              <Text style={styles.bloqueioSubtitulo}>
                A Central Financeira e de Contratos contém dados confidenciais de faturamento e inadimplência. Seu perfil atual ({userRole}) não possui autorização executiva.
              </Text>
              <TouchableOpacity style={styles.btnFecharBloqueio} onPress={onClose}>
                <Text style={styles.btnFecharBloqueioText}>Voltar ao Sistema</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Superior */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="wallet-outline" size={26} color="#38bdf8" />
              </View>
              <View>
                <View style={styles.titleBadgeRow}>
                  <Text style={styles.headerTag}>FINANCEIRO • CARTEIRA RESTRITA</Text>
                  <View style={styles.badgeZeroCache}>
                    <Ionicons name="shield-checkmark" size={11} color="#10b981" />
                    <Text style={styles.badgeZeroCacheText}>Zero-Cache • Online</Text>
                  </View>
                </View>
                <Text style={styles.headerTitle}>Central Financeira e de Contratos</Text>
                <Text style={styles.headerSubtitle}>
                  Controle analítico de inadimplência, instrumentos de locação e carteira global
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btnClose} onPress={onClose}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* KPIs da Carteira */}
          {kpis && (
            <View style={styles.kpisGrid}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValor}>{kpis.totalPermissionarios}</Text>
                <Text style={styles.kpiLabel}>Permissionários</Text>
              </View>
              <View style={[styles.kpiCard, styles.kpiCardAlerta]}>
                <Text style={[styles.kpiValor, styles.kpiValorInadimplente]}>
                  {kpis.totalInadimplentes}
                </Text>
                <Text style={styles.kpiLabel}>Inadimplentes</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValor}>
                  {FinanceiroRestritoService.formatarMoeda(kpis.saldoTotalAberto)}
                </Text>
                <Text style={styles.kpiLabel}>Saldo em Aberto</Text>
              </View>
              <View style={[styles.kpiCard, styles.kpiCardVencido]}>
                <Text style={[styles.kpiValor, styles.kpiValorVencido]}>
                  {FinanceiroRestritoService.formatarMoeda(kpis.saldoTotalVencido)}
                </Text>
                <Text style={styles.kpiLabel}>Saldo Vencido</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValor}>{kpis.contratosAtivos}</Text>
                <Text style={styles.kpiLabel}>Contratos Ativos</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiValor, styles.kpiValorAtencao]}>
                  {kpis.contratosVencem90Dias}
                </Text>
                <Text style={styles.kpiLabel}>Vencem em 90d</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiValor, styles.kpiValorAcordo]}>
                  {kpis.acordosAtivos}
                </Text>
                <Text style={styles.kpiLabel}>Acordos Ativos</Text>
              </View>
            </View>
          )}

          {/* Barra de Filtros e Busca Multi-Índice */}
          <View style={styles.filtrosWrapper}>
            <View style={styles.buscaRow}>
              <View style={styles.buscaInputBox}>
                <Ionicons name="search" size={18} color="#64748b" />
                <TextInput
                  style={styles.buscaInput}
                  placeholder="Pesquisar por titular, CNPJ, contrato, box..."
                  placeholderTextColor="#64748b"
                  value={busca}
                  onChangeText={setBusca}
                />
                {busca ? (
                  <TouchableOpacity onPress={() => setBusca('')}>
                    <Ionicons name="close-circle" size={16} color="#94a3b8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity style={styles.btnLimparFiltros} onPress={limparFiltros}>
                <Ionicons name="refresh-outline" size={14} color="#94a3b8" />
                <Text style={styles.btnLimparFiltrosText}>Limpar</Text>
              </TouchableOpacity>
            </View>

            {/* Linha de Pills de Filtros */}
            <View style={styles.pillsCategorias}>
              {/* Situação */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                <Text style={styles.pillsLabel}>Situação:</Text>
                {[
                  { id: 'TODOS', label: 'Todos' },
                  { id: 'INADIMPLENTE', label: 'Inadimplentes' },
                  { id: 'PENDENTE', label: 'Pendentes' },
                  { id: 'ADIMPLENTE', label: 'Adimplentes' },
                  { id: 'SEM_LANCAMENTOS', label: 'Sem Lançamentos' },
                ].map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.pillBtn, filtroSituacao === s.id && styles.pillBtnAtivo]}
                    onPress={() => setFiltroSituacao(s.id)}
                  >
                    <Text
                      style={[styles.pillBtnText, filtroSituacao === s.id && styles.pillBtnTextAtivo]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.divisorPill} />

                {/* Contratos */}
                <Text style={styles.pillsLabel}>Contratos:</Text>
                {[
                  { id: 'TODOS', label: 'Todos' },
                  { id: 'ATIVO', label: 'Com Contrato' },
                  { id: 'VENCE_90D', label: 'Vence em 90d' },
                  { id: 'SEM_CONTRATO', label: 'Sem Contrato' },
                ].map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.pillBtn, filtroContrato === c.id && styles.pillBtnAtivo]}
                    onPress={() => setFiltroContrato(c.id)}
                  >
                    <Text
                      style={[styles.pillBtnText, filtroContrato === c.id && styles.pillBtnTextAtivo]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.divisorPill} />

                {/* Ordenação */}
                <Text style={styles.pillsLabel}>Ordenar por:</Text>
                {[
                  { id: 'MAIOR_SALDO_ABERTO', label: 'Maior Saldo Aberto' },
                  { id: 'MAIOR_ATRASO', label: 'Maior Atraso' },
                  { id: 'NOME', label: 'Nome' },
                ].map((o) => (
                  <TouchableOpacity
                    key={o.id}
                    style={[styles.pillBtn, ordenacao === o.id && styles.pillBtnAtivo]}
                    onPress={() => setOrdenacao(o.id as any)}
                  >
                    <Text
                      style={[styles.pillBtnText, ordenacao === o.id && styles.pillBtnTextAtivo]}
                    >
                      {o.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Lista de Permissionários na Carteira */}
          <ScrollView style={styles.listaScroll}>
            {carteira.length === 0 ? (
              <View style={styles.vazioBox}>
                <Ionicons name="file-tray-outline" size={48} color="#64748b" />
                <Text style={styles.vazioTitulo}>Nenhum registro localizado</Text>
                <Text style={styles.vazioSubtitulo}>
                  Nenhum permissionário atende aos critérios da pesquisa ou dos filtros selecionados.
                </Text>
              </View>
            ) : (
              carteira.map((item) => {
                const badge = getBadgeSituacao(item.situacao);
                return (
                  <View key={item.idPermissionario} style={styles.carteiraCard}>
                    {/* Linha Superior: Titular, Documento e Badge */}
                    <View style={styles.cardHeader}>
                      <View style={styles.titularInfo}>
                        <View style={styles.titularNomeRow}>
                          <Text style={styles.titularRazaoSocial}>{item.razaoSocial}</Text>
                          {item.nomeFantasia && (
                            <Text style={styles.titularNomeFantasia}>({item.nomeFantasia})</Text>
                          )}
                        </View>
                        <View style={styles.titularMetaRow}>
                          <Text style={styles.titularDoc}>CNPJ: {item.documento}</Text>
                          {item.grupoEconomico && (
                            <Text style={styles.titularGrupo}>• {item.grupoEconomico}</Text>
                          )}
                          {item.numeroPrincipalContrato && (
                            <Text style={styles.titularContrato}>
                              • Contrato: {item.numeroPrincipalContrato}
                            </Text>
                          )}
                        </View>
                      </View>

                      <View
                        style={[
                          styles.badgeSituacao,
                          { backgroundColor: badge.bg, borderColor: badge.border },
                        ]}
                      >
                        <Text style={[styles.badgeSituacaoText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Linha de Indicadores Financeiros */}
                    <View style={styles.cardIndicadores}>
                      <View style={styles.indicadorItem}>
                        <Text style={styles.indicadorRotulo}>Saldo em Aberto</Text>
                        <Text style={styles.indicadorValorAberto}>
                          {FinanceiroRestritoService.formatarMoeda(item.saldoTotalAberto)}
                        </Text>
                      </View>

                      <View style={styles.indicadorItem}>
                        <Text style={styles.indicadorRotulo}>Saldo Vencido</Text>
                        <Text
                          style={[
                            styles.indicadorValorVencido,
                            item.saldoTotalVencido > 0 && styles.valorCritico,
                          ]}
                        >
                          {FinanceiroRestritoService.formatarMoeda(item.saldoTotalVencido)}
                        </Text>
                      </View>

                      <View style={styles.indicadorItem}>
                        <Text style={styles.indicadorRotulo}>Lanç. Vencidos</Text>
                        <Text style={styles.indicadorValor}>
                          {item.quantidadeLancamentosVencidos}
                        </Text>
                      </View>

                      <View style={styles.indicadorItem}>
                        <Text style={styles.indicadorRotulo}>Maior Atraso</Text>
                        <Text
                          style={[
                            styles.indicadorValor,
                            item.maiorAtrasoDias > 0 && styles.valorCritico,
                          ]}
                        >
                          {item.maiorAtrasoDias > 0 ? `${item.maiorAtrasoDias} dias` : 'Em dia'}
                        </Text>
                      </View>

                      <View style={styles.indicadorItem}>
                        <Text style={styles.indicadorRotulo}>Contratos Ativos</Text>
                        <Text style={styles.indicadorValor}>{item.contratosAtivos}</Text>
                      </View>

                      <View style={styles.indicadorItem}>
                        <Text style={styles.indicadorRotulo}>Acordos Ativos</Text>
                        <Text
                          style={[
                            styles.indicadorValor,
                            item.acordosAtivos > 0 && styles.valorAcordo,
                          ]}
                        >
                          {item.acordosAtivos}
                        </Text>
                      </View>
                    </View>

                    {/* Rodapé do Card: Boxes Ocupados e Botões de Ação */}
                    <View style={styles.cardFooter}>
                      <View style={styles.boxesOcupados}>
                        <Ionicons name="storefront-outline" size={14} color="#94a3b8" />
                        <Text style={styles.boxesOcupadosLabel}>Espaços Vinculados:</Text>
                        {item.boxes.map((b) => (
                          <View key={b} style={styles.boxTag}>
                            <Text style={styles.boxTagText}>Nº {b}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.cardAcoes}>
                        {onAbrirGestaoPermissionario && (
                          <TouchableOpacity
                            style={styles.btnAcaoGestao}
                            onPress={() => onAbrirGestaoPermissionario(item.idPermissionario)}
                          >
                            <Ionicons name="business-outline" size={14} color="#38bdf8" />
                            <Text style={styles.btnAcaoGestaoText}>Permissionário 360°</Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={styles.btnAcaoFinanceiro}
                          onPress={() => onAbrirDetalhesFinanceiros(item.idPermissionario)}
                        >
                          <Ionicons name="lock-closed" size={14} color="#fff" />
                          <Text style={styles.btnAcaoFinanceiroText}>Abrir Financeiro</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 1100,
    height: '92%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  containerBloqueado: {
    maxWidth: 500,
    height: 'auto',
    padding: 24,
  },
  bloqueioBox: {
    alignItems: 'center',
    padding: 20,
  },
  bloqueioTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  bloqueioSubtitulo: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  btnFecharBloqueio: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnFecharBloqueioText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 0.8,
  },
  badgeZeroCache: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeZeroCacheText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34d399',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 1,
  },
  btnClose: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#0f172a',
  },
  kpisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 14,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  kpiCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiCardAlerta: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  kpiCardVencido: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  kpiValor: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  kpiValorInadimplente: {
    color: '#ef4444',
  },
  kpiValorVencido: {
    color: '#f87171',
  },
  kpiValorAtencao: {
    color: '#f59e0b',
  },
  kpiValorAcordo: {
    color: '#10b981',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  filtrosWrapper: {
    padding: 14,
    backgroundColor: '#131d31',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  buscaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  buscaInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  buscaInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 13,
  },
  btnLimparFiltros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnLimparFiltrosText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  pillsCategorias: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  pillsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    alignSelf: 'center',
    marginRight: 6,
  },
  pillBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillBtnAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  pillBtnText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  pillBtnTextAtivo: {
    color: '#fff',
    fontWeight: '700',
  },
  divisorPill: {
    width: 1,
    height: 16,
    backgroundColor: '#334155',
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  listaScroll: {
    flex: 1,
    padding: 14,
  },
  vazioBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  vazioTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#cbd5e1',
    marginTop: 12,
  },
  vazioSubtitulo: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  carteiraCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titularInfo: {
    flex: 1,
  },
  titularNomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  titularRazaoSocial: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  titularNomeFantasia: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38bdf8',
  },
  titularMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
    flexWrap: 'wrap',
  },
  titularDoc: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  titularGrupo: {
    fontSize: 11,
    color: '#64748b',
  },
  titularContrato: {
    fontSize: 11,
    color: '#94a3b8',
  },
  badgeSituacao: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeSituacaoText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardIndicadores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  indicadorItem: {
    flex: 1,
    minWidth: 110,
  },
  indicadorRotulo: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  indicadorValor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 1,
  },
  indicadorValorAberto: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 1,
  },
  indicadorValorVencido: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94a3b8',
    marginTop: 1,
  },
  valorCritico: {
    color: '#ef4444',
  },
  valorAcordo: {
    color: '#10b981',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  boxesOcupados: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  boxesOcupadosLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  boxTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  boxTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
  },
  cardAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnAcaoGestao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  btnAcaoGestaoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
  },
  btnAcaoFinanceiro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAcaoFinanceiroText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});
