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
  CentralAnaliticaService,
  CardAnaliticoOperacao,
  KPIsCentralAnalitica,
  FiltrosCentralAnalitica,
  SinalAtencaoOperacao,
} from '../services/centralAnaliticaService';
import { FinanceiroRestritoService } from '../services/financeiroRestritoService';

interface CentralAnaliticaModalProps {
  visible: boolean;
  onClose: () => void;
  userRole?: string;
  onAbrirFichaLoja: (idLoja: string) => void;
  onVerNoMapa: (setor: string, numeroBox: string, idLoja: string) => void;
  onAbrirPermissionario?: (idPermissionario: string) => void;
  onAbrirFinanceiro?: (idPermissionario: string) => void;
  onAbrirAuditoria?: (idLoja: string) => void;
}

export const CentralAnaliticaModal: React.FC<CentralAnaliticaModalProps> = ({
  visible,
  onClose,
  userRole = 'ADMIN',
  onAbrirFichaLoja,
  onVerNoMapa,
  onAbrirPermissionario,
  onAbrirFinanceiro,
  onAbrirAuditoria,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroSegmento, setFiltroSegmento] = useState('TODOS');
  const [filtroSinalAtencao, setFiltroSinalAtencao] = useState('TODOS');
  const [filtroSituacaoFinanceira, setFiltroSituacaoFinanceira] = useState('TODOS');
  const [filtroStatusAuditoria, setFiltroStatusAuditoria] = useState('TODAS');
  const [ordenacao, setOrdenacao] = useState<
    | 'MAIS_SINAIS_ATENCAO'
    | 'MENOR_COMPLETUDE'
    | 'NOME'
    | 'VISITA_MAIS_ANTIGA'
    | 'MAIOR_SALDO_VENCIDO'
    | 'MAIOR_DIVERGENCIA_AUDITADA'
  >('MAIS_SINAIS_ATENCAO');

  const [carteira, setCarteira] = useState<CardAnaliticoOperacao[]>([]);
  const [kpis, setKpis] = useState<KPIsCentralAnalitica | null>(null);
  const [segmentos, setSegmentos] = useState<string[]>([]);

  const temAcesso = CentralAnaliticaService.verificarPermissaoLeitura(userRole);
  const temAcessoFinanceiro = CentralAnaliticaService.verificarPermissaoFinanceiro(userRole);
  const temAcessoAuditoria = CentralAnaliticaService.verificarPermissaoAuditoria(userRole);

  useEffect(() => {
    if (visible && temAcesso) {
      carregarDados();
    }
  }, [
    visible,
    busca,
    filtroSegmento,
    filtroSinalAtencao,
    filtroSituacaoFinanceira,
    filtroStatusAuditoria,
    ordenacao,
    temAcesso,
  ]);

  const carregarDados = () => {
    try {
      const filtros: FiltrosCentralAnalitica = {
        busca: busca.trim(),
        segmento: filtroSegmento,
        sinalAtencao: filtroSinalAtencao,
        situacaoFinanceira: filtroSituacaoFinanceira,
        statusAuditoria: filtroStatusAuditoria,
        ordenacao,
      };

      const lista = CentralAnaliticaService.obterCarteiraAnalitica(filtros, userRole);
      const metrics = CentralAnaliticaService.obterKPIs(userRole);
      const segs = CentralAnaliticaService.obterSegmentosDisponiveis();

      setCarteira(lista);
      setKpis(metrics);
      setSegmentos(segs);
    } catch (e) {
      console.error('Erro ao carregar dados da Central Analítica:', e);
    }
  };

  const limparFiltros = () => {
    setBusca('');
    setFiltroSegmento('TODOS');
    setFiltroSinalAtencao('TODOS');
    setFiltroSituacaoFinanceira('TODOS');
    setFiltroStatusAuditoria('TODAS');
    setOrdenacao('MAIS_SINAIS_ATENCAO');
  };

  const getBadgeSinal = (sinal: SinalAtencaoOperacao) => {
    switch (sinal) {
      case 'CADASTRO_PENDENTE':
        return { label: 'Cadastro Pendente', bg: '#451a03', text: '#fde68a', border: '#d97706' };
      case 'SEM_CONTATO':
        return { label: 'Sem Contato', bg: '#3b0764', text: '#e9d5ff', border: '#a855f7' };
      case 'SEM_PRODUTO':
        return { label: 'Sem Vitrine', bg: '#172554', text: '#bfdbfe', border: '#3b82f6' };
      case 'SEM_CAMPANHA':
        return { label: 'Sem Campanha', bg: '#334155', text: '#cbd5e1', border: '#64748b' };
      case 'SEM_VISITA_30D':
        return { label: 'Sem Visita >30d', bg: '#374151', text: '#f3f4f6', border: '#9ca3af' };
      case 'SEM_CONTRATO':
        return { label: 'Sem Contrato', bg: '#4c0519', text: '#fecdd3', border: '#f43f5e' };
      case 'INADIMPLENTE':
        return { label: 'Inadimplente', bg: '#7f1d1d', text: '#fca5a5', border: '#ef4444' };
      case 'AUDITORIA_DIVERGENTE':
        return { label: 'Auditoria Divergente', bg: '#7f1d1d', text: '#fca5a5', border: '#ef4444' };
    }
  };

  if (!temAcesso) {
    return (
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.container, styles.containerBloqueado]}>
            <Ionicons name="shield-outline" size={56} color="#ef4444" />
            <Text style={styles.tituloBloqueado}>Acesso Restrito</Text>
            <Text style={styles.textoBloqueado}>
              A Central Analítica Comercial requer privilégios gerenciais ou corporativos (ADMIN,
              GESTAO, MARKETING, FINANCEIRO ou AUDITORIA). Seu perfil atual ({userRole}) não possui
              permissão de acesso a este hub.
            </Text>
            <TouchableOpacity style={styles.btnFecharBloqueado} onPress={onClose}>
              <Text style={styles.btnFecharBloqueadoTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View style={styles.headerTitleRow}>
                <Ionicons name="analytics" size={24} color="#38bdf8" />
                <Text style={styles.headerTitle}>Central Analítica Comercial</Text>
                <View style={styles.badgeFase}>
                  <Text style={styles.badgeFaseTexto}>FASE L3.9 • INTELIGÊNCIA COMERCIAL</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>
                Consolidação federada 360°: cadastro, vitrine, campanhas, visitas, contratos e auditoria
              </Text>
            </View>

            <TouchableOpacity style={styles.btnClose} onPress={onClose}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* KPIs Adaptativos */}
          {kpis && (
            <View style={styles.kpisContainer}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiRotulo}>Operações</Text>
                <Text style={styles.kpiValor}>{kpis.totalOperacoes}</Text>
                <Text style={styles.kpiSub}>Lojas no mall</Text>
              </View>

              <View style={[styles.kpiCard, styles.kpiCardVerde]}>
                <Text style={[styles.kpiRotulo, styles.kpiTextoVerde]}>Cad. Concluídos</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoVerde]}>
                  {kpis.cadastroConcluidoTotal}
                </Text>
                <Text style={styles.kpiSub}>≥ 80% completude</Text>
              </View>

              <View style={[styles.kpiCard, styles.kpiCardAlerta]}>
                <Text style={[styles.kpiRotulo, styles.kpiTextoAmarelo]}>Cad. Pendentes</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoAmarelo]}>
                  {kpis.cadastroPendenteTotal}
                </Text>
                <Text style={styles.kpiSub}>Requer atenção</Text>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiRotulo}>Com Campanha</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoAzul]}>
                  {kpis.comCampanhaTotal}
                </Text>
                <Text style={styles.kpiSub}>Adesões ativas</Text>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiRotulo}>Visitas Recentes</Text>
                <Text style={styles.kpiValor}>{kpis.visitadasUltimos30Dias}</Text>
                <Text style={styles.kpiSub}>Últimos 30 dias</Text>
              </View>

              {/* KPIs Financeiros Condicionais */}
              {kpis.temAcessoFinanceiro && (
                <>
                  <View style={[styles.kpiCard, styles.kpiCardCritico]}>
                    <Text style={[styles.kpiRotulo, styles.kpiTextoVermelho]}>Inadimplentes</Text>
                    <Text style={[styles.kpiValor, styles.kpiTextoVermelho]}>
                      {kpis.inadimplentesTotal || 0}
                    </Text>
                    <Text style={styles.kpiSub}>Com débito vencido</Text>
                  </View>

                  <View style={[styles.kpiCard, styles.kpiCardCritico]}>
                    <Text style={[styles.kpiRotulo, styles.kpiTextoVermelho]}>Saldo Vencido</Text>
                    <Text style={[styles.kpiValor, styles.kpiTextoVermelho]}>
                      {FinanceiroRestritoService.formatarMoeda(kpis.saldoVencidoTotal || 0)}
                    </Text>
                    <Text style={styles.kpiSub}>Em cobrança</Text>
                  </View>
                </>
              )}

              {/* KPIs de Auditoria Fiscal Condicionais */}
              {kpis.temAcessoAuditoria && (
                <>
                  <View style={[styles.kpiCard, styles.kpiCardRoxo]}>
                    <Text style={[styles.kpiRotulo, styles.kpiTextoRoxo]}>Auditorias Diverg.</Text>
                    <Text style={[styles.kpiValor, styles.kpiTextoRoxo]}>
                      {kpis.auditoriasDivergentesTotal || 0}
                    </Text>
                    <Text style={styles.kpiSub}>Diferença apurada</Text>
                  </View>

                  <View style={[styles.kpiCard, styles.kpiCardRoxo]}>
                    <Text style={[styles.kpiRotulo, styles.kpiTextoRoxo]}>Divergência Total</Text>
                    <Text style={[styles.kpiValor, styles.kpiTextoRoxo]}>
                      {FinanceiroRestritoService.formatarMoeda(kpis.divergenciaAbsolutaTotal || 0)}
                    </Text>
                    <Text style={styles.kpiSub}>Apuração fiscal</Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* Barra de Filtros e Busca */}
          <View style={styles.filterBar}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por loja, espaço/LUC, titular, segmento ou contrato..."
                placeholderTextColor="#64748b"
                value={busca}
                onChangeText={setBusca}
              />
              {busca.length > 0 && (
                <TouchableOpacity onPress={() => setBusca('')}>
                  <Ionicons name="close-circle" size={16} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.filtersGroup}>
              {/* Sinais de Atenção */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Sinais de Atenção:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {[
                    { id: 'TODOS', label: 'Todos' },
                    { id: 'CADASTRO_PENDENTE', label: 'Cadastro Pendente' },
                    { id: 'SEM_CONTATO', label: 'Sem Contato' },
                    { id: 'SEM_PRODUTO', label: 'Sem Produto' },
                    { id: 'SEM_CAMPANHA', label: 'Sem Campanha' },
                    ...(temAcessoFinanceiro
                      ? [{ id: 'INADIMPLENTE', label: 'Inadimplente' }]
                      : []),
                    ...(temAcessoAuditoria
                      ? [{ id: 'AUDITORIA_DIVERGENTE', label: 'Auditoria Divergente' }]
                      : []),
                  ].map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.filterPill,
                        filtroSinalAtencao === s.id && styles.filterPillActive,
                      ]}
                      onPress={() => setFiltroSinalAtencao(s.id)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          filtroSinalAtencao === s.id && styles.filterPillTextActive,
                        ]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Segmento */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Segmento:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      filtroSegmento === 'TODOS' && styles.filterPillActive,
                    ]}
                    onPress={() => setFiltroSegmento('TODOS')}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        filtroSegmento === 'TODOS' && styles.filterPillTextActive,
                      ]}
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>
                  {segmentos.map((seg) => (
                    <TouchableOpacity
                      key={seg}
                      style={[
                        styles.filterPill,
                        filtroSegmento === seg && styles.filterPillActive,
                      ]}
                      onPress={() => setFiltroSegmento(seg)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          filtroSegmento === seg && styles.filterPillTextActive,
                        ]}
                      >
                        {seg}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Limpar */}
              {(busca.length > 0 ||
                filtroSegmento !== 'TODOS' ||
                filtroSinalAtencao !== 'TODOS' ||
                filtroSituacaoFinanceira !== 'TODOS' ||
                filtroStatusAuditoria !== 'TODAS') && (
                <TouchableOpacity style={styles.btnLimparFiltros} onPress={limparFiltros}>
                  <Ionicons name="refresh" size={14} color="#38bdf8" />
                  <Text style={styles.btnLimparFiltrosTexto}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Listagem de Cards Analíticos */}
          <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
            {carteira.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#475569" />
                <Text style={styles.emptyTitle}>Nenhuma operação encontrada</Text>
                <Text style={styles.emptyDesc}>
                  Ajuste os termos de busca ou filtros selecionados para exibir resultados.
                </Text>
              </View>
            ) : (
              carteira.map((item) => {
                const isConcluido = item.statusCadastro === 'CONCLUIDO';

                return (
                  <View key={item.idLoja} style={styles.card}>
                    {/* Cabeçalho do Card */}
                    <View style={styles.cardHead}>
                      <View style={styles.lojaInfo}>
                        <View style={styles.lojaTituloLinha}>
                          <Text style={styles.lojaNome}>{item.nomeLoja}</Text>
                          <View style={styles.boxTag}>
                            <Text style={styles.boxTagText}>Nº {item.numeroEspaco}</Text>
                          </View>
                          <View style={styles.setorTag}>
                            <Text style={styles.setorTagText}>{item.setorEspaco}</Text>
                          </View>
                          <View style={styles.segmentoTag}>
                            <Text style={styles.segmentoTagText}>{item.segmento}</Text>
                          </View>
                        </View>
                        {item.nomePermissionario && (
                          <Text style={styles.permissionarioSub}>
                            Titular: {item.nomePermissionario}
                            {item.idContrato ? ` • Contrato: ${item.idContrato}` : ''}
                          </Text>
                        )}
                      </View>

                      {/* Barra de Completude Cadastral */}
                      <View style={styles.completudeBox}>
                        <View style={styles.completudeLabelRow}>
                          <Text style={styles.completudeRotulo}>Completude</Text>
                          <Text
                            style={[
                              styles.completudeValor,
                              isConcluido ? styles.textoVerde : styles.textoAmarelo,
                            ]}
                          >
                            {item.completudeCadastro}%
                          </Text>
                        </View>
                        <View style={styles.progressBarBg}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${item.completudeCadastro}%`,
                                backgroundColor: isConcluido ? '#10b981' : '#f59e0b',
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Sinais de Atenção */}
                    {item.sinaisAtencao.length > 0 && (
                      <View style={styles.sinaisContainer}>
                        <Text style={styles.sinaisTitulo}>SINAIS DE ATENÇÃO:</Text>
                        <View style={styles.sinaisLista}>
                          {item.sinaisAtencao.map((sinal) => {
                            const badge = getBadgeSinal(sinal);
                            return (
                              <View
                                key={sinal}
                                style={[
                                  styles.sinalBadge,
                                  { backgroundColor: badge.bg, borderColor: badge.border },
                                ]}
                              >
                                <Text style={[styles.sinalBadgeText, { color: badge.text }]}>
                                  ⚠ {badge.label}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {/* Grade de Indicadores Federados */}
                    <View style={styles.indicadoresGrid}>
                      <View style={styles.indItem}>
                        <Ionicons name="call-outline" size={14} color="#94a3b8" />
                        <Text style={styles.indRotulo}>Contatos:</Text>
                        <Text style={styles.indValor}>{item.totalContatos}</Text>
                      </View>

                      <View style={styles.indItem}>
                        <Ionicons name="shirt-outline" size={14} color="#94a3b8" />
                        <Text style={styles.indRotulo}>Vitrine:</Text>
                        <Text style={styles.indValor}>{item.totalProdutos} produtos</Text>
                      </View>

                      <View style={styles.indItem}>
                        <Ionicons name="megaphone-outline" size={14} color="#94a3b8" />
                        <Text style={styles.indRotulo}>Campanhas:</Text>
                        <Text style={styles.indValor}>{item.totalCampanhas} ativas</Text>
                      </View>

                      <View style={styles.indItem}>
                        <Ionicons name="clipboard-outline" size={14} color="#94a3b8" />
                        <Text style={styles.indRotulo}>Última Visita:</Text>
                        <Text style={styles.indValor}>{item.ultimaVisitaData || 'N/A'}</Text>
                      </View>

                      {/* Bloco Financeiro Restrito */}
                      {temAcessoFinanceiro && item.situacaoFinanceira && (
                        <View style={styles.indItem}>
                          <Ionicons name="card-outline" size={14} color="#f59e0b" />
                          <Text style={styles.indRotulo}>Situação Fin.:</Text>
                          <Text
                            style={[
                              styles.indValor,
                              item.situacaoFinanceira === 'INADIMPLENTE'
                                ? styles.textoVermelho
                                : styles.textoVerde,
                            ]}
                          >
                            {item.situacaoFinanceira}
                            {item.saldoTotalVencido && item.saldoTotalVencido > 0
                              ? ` (${FinanceiroRestritoService.formatarMoeda(item.saldoTotalVencido)})`
                              : ''}
                          </Text>
                        </View>
                      )}

                      {/* Bloco Fiscal de Auditoria Restrito */}
                      {temAcessoAuditoria && item.temAuditoriaVenda && (
                        <View style={styles.indItem}>
                          <Ionicons name="trending-up-outline" size={14} color="#a78bfa" />
                          <Text style={styles.indRotulo}>Auditoria ({item.auditoriaCompetencia}):</Text>
                          <Text
                            style={[
                              styles.indValor,
                              item.auditoriaStatus === 'DIVERGENTE'
                                ? styles.textoVermelho
                                : styles.textoVerde,
                            ]}
                          >
                            {item.auditoriaStatus}
                            {item.diferencaValor && item.diferencaValor > 0
                              ? ` (+${FinanceiroRestritoService.formatarMoeda(item.diferencaValor)})`
                              : ''}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Rodapé: Navegação Cruzada Deep-Link */}
                    <View style={styles.cardFooter}>
                      <View style={styles.navegacaoGrupo}>
                        <TouchableOpacity
                          style={styles.btnNavegacao}
                          onPress={() => onAbrirFichaLoja(item.idLoja)}
                        >
                          <Ionicons name="storefront-outline" size={14} color="#38bdf8" />
                          <Text style={styles.btnNavegacaoTexto}>Ficha 360°</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btnNavegacao}
                          onPress={() => onVerNoMapa(item.setorEspaco, item.numeroEspaco, item.idLoja)}
                        >
                          <Ionicons name="map-outline" size={14} color="#38bdf8" />
                          <Text style={styles.btnNavegacaoTexto}>Ver no Mapa</Text>
                        </TouchableOpacity>

                        {item.idPermissionario && onAbrirPermissionario && (
                          <TouchableOpacity
                            style={styles.btnNavegacao}
                            onPress={() => onAbrirPermissionario(item.idPermissionario!)}
                          >
                            <Ionicons name="business-outline" size={14} color="#94a3b8" />
                            <Text style={styles.btnNavegacaoTexto}>Permissionário</Text>
                          </TouchableOpacity>
                        )}

                        {temAcessoFinanceiro && item.idPermissionario && onAbrirFinanceiro && (
                          <TouchableOpacity
                            style={[styles.btnNavegacao, styles.btnNavFinanceiro]}
                            onPress={() => onAbrirFinanceiro(item.idPermissionario!)}
                          >
                            <Ionicons name="lock-closed" size={13} color="#fca5a5" />
                            <Text style={styles.btnNavFinanceiroTexto}>Financeiro</Text>
                          </TouchableOpacity>
                        )}

                        {temAcessoAuditoria && onAbrirAuditoria && (
                          <TouchableOpacity
                            style={[styles.btnNavegacao, styles.btnNavAuditoria]}
                            onPress={() => onAbrirAuditoria(item.idLoja)}
                          >
                            <Ionicons name="receipt-outline" size={13} color="#d8b4fe" />
                            <Text style={styles.btnNavAuditoriaTexto}>Auditoria</Text>
                          </TouchableOpacity>
                        )}
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
    maxWidth: 1250,
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
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
  },
  tituloBloqueado: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 16,
    marginBottom: 12,
  },
  textoBloqueado: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  btnFecharBloqueado: {
    backgroundColor: '#334155',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnFecharBloqueadoTexto: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  badgeFase: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  badgeFaseTexto: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#bfdbfe',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  btnClose: {
    padding: 6,
  },
  kpisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
    backgroundColor: '#0b1120',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  kpiCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiCardVerde: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  kpiCardAlerta: {
    borderColor: '#f59e0b',
    backgroundColor: '#451a03',
  },
  kpiCardCritico: {
    borderColor: '#ef4444',
    backgroundColor: '#450a0a',
  },
  kpiCardRoxo: {
    borderColor: '#a855f7',
    backgroundColor: '#3b0764',
  },
  kpiRotulo: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
  },
  kpiValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  kpiSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  kpiTextoVerde: {
    color: '#6ee7b7',
  },
  kpiTextoAmarelo: {
    color: '#fde68a',
  },
  kpiTextoVermelho: {
    color: '#fca5a5',
  },
  kpiTextoAzul: {
    color: '#38bdf8',
  },
  kpiTextoRoxo: {
    color: '#d8b4fe',
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 13,
  },
  filtersGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  filterPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 6,
  },
  filterPillActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  filterPillText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnLimparFiltros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnLimparFiltrosTexto: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
    gap: 12,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  lojaInfo: {
    flex: 1,
  },
  lojaTituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  lojaNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  boxTag: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  boxTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  setorTag: {
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  setorTagText: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  segmentoTag: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  segmentoTagText: {
    fontSize: 11,
    color: '#bfdbfe',
  },
  permissionarioSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  completudeBox: {
    minWidth: 120,
    alignItems: 'flex-end',
  },
  completudeLabelRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  completudeRotulo: {
    fontSize: 11,
    color: '#94a3b8',
  },
  completudeValor: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBg: {
    width: 110,
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sinaisContainer: {
    backgroundColor: '#0b1120',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 6,
  },
  sinaisTitulo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  sinaisLista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sinalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  sinalBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  indicadoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  indItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indRotulo: {
    fontSize: 12,
    color: '#94a3b8',
  },
  indValor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f8fafc',
  },
  textoVerde: {
    color: '#10b981',
  },
  textoAmarelo: {
    color: '#f59e0b',
  },
  textoVermelho: {
    color: '#ef4444',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  navegacaoGrupo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btnNavegacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnNavegacaoTexto: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '600',
  },
  btnNavFinanceiro: {
    backgroundColor: '#450a0a',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  btnNavFinanceiroTexto: {
    fontSize: 12,
    color: '#fca5a5',
    fontWeight: 'bold',
  },
  btnNavAuditoria: {
    backgroundColor: '#3b0764',
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  btnNavAuditoriaTexto: {
    fontSize: 12,
    color: '#d8b4fe',
    fontWeight: 'bold',
  },
});
