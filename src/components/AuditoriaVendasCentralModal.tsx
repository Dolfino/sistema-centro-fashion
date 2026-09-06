import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AuditoriaVendasService,
  RegistroAuditoriaVenda,
  KPIsAuditoriaVendas,
  FiltrosAuditoriaVendas,
  StatusAuditoriaVenda,
  HistoricoAuditoriaVenda,
} from '../services/auditoriaVendasService';

interface AuditoriaVendasCentralModalProps {
  visible: boolean;
  onClose: () => void;
  userRole?: string;
  onAbrirEditorAuditoria: (auditoria?: RegistroAuditoriaVenda | null) => void;
  onAbrirFichaLoja?: (idLoja: string) => void;
  onAbrirFinanceiroPermissionario?: (idPermissionario: string) => void;
}

export const AuditoriaVendasCentralModal: React.FC<AuditoriaVendasCentralModalProps> = ({
  visible,
  onClose,
  userRole = 'ADMIN',
  onAbrirEditorAuditoria,
  onAbrirFichaLoja,
  onAbrirFinanceiroPermissionario,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroCompetencia, setFiltroCompetencia] = useState<string>('TODAS');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroDivergencia, setFiltroDivergencia] = useState<'TODAS' | 'APENAS_DIVERGENTES' | 'CONFORMES'>('TODAS');
  const [ordenacao, setOrdenacao] = useState<'MAIOR_DIFERENCA' | 'MAIOR_FATURAMENTO' | 'NOME_LOJA' | 'MAIS_RECENTE'>('MAIOR_DIFERENCA');

  const [auditorias, setAuditorias] = useState<RegistroAuditoriaVenda[]>([]);
  const [kpis, setKpis] = useState<KPIsAuditoriaVendas | null>(null);
  const [competencias, setCompetencias] = useState<string[]>([]);
  const [historicoModalAuditoria, setHistoricoModalAuditoria] = useState<RegistroAuditoriaVenda | null>(null);
  const [historicoEventos, setHistoricoEventos] = useState<HistoricoAuditoriaVenda[]>([]);

  const temAcesso = AuditoriaVendasService.verificarPermissaoLeitura(userRole);
  const podeEditar = AuditoriaVendasService.verificarPermissaoEscrita(userRole);

  useEffect(() => {
    if (visible && temAcesso) {
      carregarDados();
    }
  }, [visible, busca, filtroCompetencia, filtroStatus, filtroDivergencia, ordenacao, temAcesso]);

  const carregarDados = () => {
    try {
      const filtros: FiltrosAuditoriaVendas = {
        busca: busca.trim(),
        competencia: filtroCompetencia,
        status: filtroStatus,
        divergencia: filtroDivergencia,
        ordenacao,
      };
      const lista = AuditoriaVendasService.obterCarteiraAuditorias(filtros, userRole);
      const metrics = AuditoriaVendasService.obterKPIs(userRole);
      const comps = AuditoriaVendasService.obterCompetenciasDisponiveis();

      setAuditorias(lista);
      setKpis(metrics);
      setCompetencias(comps);
    } catch (e) {
      console.error('Erro ao carregar auditorias de vendas:', e);
    }
  };

  const limparFiltros = () => {
    setBusca('');
    setFiltroCompetencia('TODAS');
    setFiltroStatus('TODOS');
    setFiltroDivergencia('TODAS');
    setOrdenacao('MAIOR_DIFERENCA');
  };

  const handleAbrirHistorico = (item: RegistroAuditoriaVenda) => {
    try {
      const hist = AuditoriaVendasService.obterHistoricoAuditoria(item.idAuditoriaVenda, userRole);
      setHistoricoEventos(hist);
      setHistoricoModalAuditoria(item);
    } catch (e) {
      console.error('Erro ao abrir histórico de auditoria:', e);
    }
  };

  const getBadgeStatus = (status: StatusAuditoriaVenda) => {
    switch (status) {
      case 'DIVERGENTE':
        return { bg: '#7f1d1d', text: '#fca5a5', border: '#ef4444', label: 'DIVERGENTE' };
      case 'CONFORME':
        return { bg: '#064e3b', text: '#6ee7b7', border: '#10b981', label: 'CONFORME' };
      case 'PENDENTE':
        return { bg: '#78350f', text: '#fde68a', border: '#f59e0b', label: 'PENDENTE' };
      case 'EM_ANALISE':
        return { bg: '#1e3a8a', text: '#93c5fd', border: '#3b82f6', label: 'EM ANÁLISE' };
      case 'CONTESTADA':
        return { bg: '#581c87', text: '#d8b4fe', border: '#a855f7', label: 'CONTESTADA' };
      case 'CONCLUIDA':
        return { bg: '#1e293b', text: '#cbd5e1', border: '#475569', label: 'CONCLUÍDA' };
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
              O módulo de Auditoria de Vendas e Faturamento requer credenciais executivas (ADMIN,
              FINANCEIRO ou AUDITORIA). Seu perfil atual ({userRole}) não possui permissão de leitura
              para dados fiscais e faturamentos.
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
                <Ionicons name="trending-up" size={24} color="#38bdf8" />
                <Text style={styles.headerTitle}>Auditoria de Vendas & Faturamento</Text>
                <View style={styles.badgeFase}>
                  <Text style={styles.badgeFaseTexto}>FASE L3.8 • GOVERNANÇA FISCAL</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>
                Aferição presencial de faturamento, conciliação fiscal e apuração de aluguel percentual
              </Text>
            </View>

            <View style={styles.headerActions}>
              {podeEditar && (
                <TouchableOpacity
                  style={styles.btnNovaAuditoria}
                  onPress={() => onAbrirEditorAuditoria(null)}
                >
                  <Ionicons name="add-circle" size={18} color="#fff" />
                  <Text style={styles.btnNovaAuditoriaTexto}>+ Nova Auditoria</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cards de KPIs */}
          {kpis && (
            <View style={styles.kpiContainer}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiRotulo}>Auditorias</Text>
                <Text style={styles.kpiValor}>{kpis.totalAuditorias}</Text>
                <Text style={styles.kpiSub}>Registros ativos</Text>
              </View>

              <View style={[styles.kpiCard, styles.kpiCardDivergente]}>
                <Text style={[styles.kpiRotulo, styles.kpiTextoDivergente]}>Divergentes</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoDivergente]}>
                  {kpis.totalDivergentes}
                </Text>
                <Text style={styles.kpiSub}>Diferença apurada</Text>
              </View>

              <View style={[styles.kpiCard, styles.kpiCardConforme]}>
                <Text style={[styles.kpiRotulo, styles.kpiTextoConforme]}>Conformes</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoConforme]}>
                  {kpis.totalConformes}
                </Text>
                <Text style={styles.kpiSub}>Aprovadas</Text>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiRotulo}>Faturamento Declarado</Text>
                <Text style={styles.kpiValor}>
                  {AuditoriaVendasService.formatarMoeda(kpis.faturamentoDeclaradoTotal)}
                </Text>
                <Text style={styles.kpiSub}>Lojistas</Text>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiRotulo}>Faturamento Auditado</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoAuditado]}>
                  {AuditoriaVendasService.formatarMoeda(kpis.faturamentoAuditadoTotal)}
                </Text>
                <Text style={styles.kpiSub}>Apuração fiscal</Text>
              </View>

              <View style={[styles.kpiCard, styles.kpiCardDiferenca]}>
                <Text style={[styles.kpiRotulo, styles.kpiTextoDivergente]}>Diferença Total</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoDivergente]}>
                  {AuditoriaVendasService.formatarMoeda(kpis.diferencaTotalValor)}
                </Text>
                <Text style={styles.kpiSub}>Auditado - Declarado</Text>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiRotulo}>Ref. Aluguel</Text>
                <Text style={[styles.kpiValor, styles.kpiTextoReferencia]}>
                  {AuditoriaVendasService.formatarMoeda(kpis.aluguelReferenciaTotal)}
                </Text>
                <Text style={styles.kpiSub}>Variável vs Mínimo</Text>
              </View>
            </View>
          )}

          {/* Barra de Filtros e Pesquisa */}
          <View style={styles.filterBar}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por loja, espaço/LUC, permissionário ou contrato..."
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
              {/* Filtro Competência */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Competência:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      filtroCompetencia === 'TODAS' && styles.filterPillActive,
                    ]}
                    onPress={() => setFiltroCompetencia('TODAS')}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        filtroCompetencia === 'TODAS' && styles.filterPillTextActive,
                      ]}
                    >
                      Todas
                    </Text>
                  </TouchableOpacity>
                  {competencias.map((comp) => (
                    <TouchableOpacity
                      key={comp}
                      style={[
                        styles.filterPill,
                        filtroCompetencia === comp && styles.filterPillActive,
                      ]}
                      onPress={() => setFiltroCompetencia(comp)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          filtroCompetencia === comp && styles.filterPillTextActive,
                        ]}
                      >
                        {comp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Filtro Status */}
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Status:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['TODOS', 'DIVERGENTE', 'CONFORME', 'PENDENTE', 'EM_ANALISE'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.filterPill,
                        filtroStatus === st && styles.filterPillActive,
                      ]}
                      onPress={() => setFiltroStatus(st)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          filtroStatus === st && styles.filterPillTextActive,
                        ]}
                      >
                        {st === 'TODOS' ? 'Todos' : st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Limpar Filtros */}
              {(busca.length > 0 ||
                filtroCompetencia !== 'TODAS' ||
                filtroStatus !== 'TODOS' ||
                filtroDivergencia !== 'TODAS') && (
                <TouchableOpacity style={styles.btnLimparFiltros} onPress={limparFiltros}>
                  <Ionicons name="refresh" size={14} color="#38bdf8" />
                  <Text style={styles.btnLimparFiltrosTexto}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Listagem de Auditorias */}
          <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
            {auditorias.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#475569" />
                <Text style={styles.emptyTitle}>Nenhuma auditoria encontrada</Text>
                <Text style={styles.emptyDesc}>
                  Nenhum registro corresponde aos filtros selecionados. Tente ajustar os parâmetros.
                </Text>
              </View>
            ) : (
              auditorias.map((item) => {
                const badge = getBadgeStatus(item.status);
                const isDivergente = item.status === 'DIVERGENTE';
                const temEvidencia = Boolean(item.documentoUrl || item.documentoNome);

                return (
                  <View
                    key={item.idAuditoriaVenda}
                    style={[
                      styles.card,
                      isDivergente && styles.cardDivergenteBorda,
                    ]}
                  >
                    {/* Cabeçalho do Card */}
                    <View style={styles.cardHeader}>
                      <View style={styles.cardIdentificacao}>
                        <View style={styles.lojaLinha}>
                          <Text style={styles.lojaNome}>{item.nomeLoja}</Text>
                          <View style={styles.boxTag}>
                            <Text style={styles.boxTagText}>Espaço Nº {item.numeroEspaco}</Text>
                          </View>
                          <View style={styles.setorTag}>
                            <Text style={styles.setorTagText}>{item.setorEspaco}</Text>
                          </View>
                        </View>
                        <Text style={styles.permissionarioSub}>
                          Titular: {item.nomePermissionario} • Contrato: {item.idContrato}
                        </Text>
                      </View>

                      <View style={styles.cardBadges}>
                        <View style={styles.competenciaTag}>
                          <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
                          <Text style={styles.competenciaTagText}>Comp: {item.competencia}</Text>
                        </View>
                        <View
                          style={[
                            styles.badgeStatus,
                            { backgroundColor: badge.bg, borderColor: badge.border },
                          ]}
                        >
                          <Text style={[styles.badgeStatusText, { color: badge.text }]}>
                            {badge.label}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Grade de Valores e Comparação */}
                    <View style={styles.cardValoresGrid}>
                      <View style={styles.valorColuna}>
                        <Text style={styles.valorRotulo}>Declarado</Text>
                        <Text style={styles.valorNumero}>
                          {AuditoriaVendasService.formatarMoeda(item.faturamentoDeclarado)}
                        </Text>
                      </View>

                      <View style={styles.valorColuna}>
                        <Text style={styles.valorRotulo}>Auditado</Text>
                        <Text style={[styles.valorNumero, styles.valorDestaqueAuditado]}>
                          {AuditoriaVendasService.formatarMoeda(item.faturamentoAuditado)}
                        </Text>
                      </View>

                      <View style={styles.valorColuna}>
                        <Text style={styles.valorRotulo}>Diferença (R$)</Text>
                        <Text
                          style={[
                            styles.valorNumero,
                            item.diferencaValor > 0 && styles.valorCritico,
                          ]}
                        >
                          {AuditoriaVendasService.formatarMoeda(item.diferencaValor)}
                        </Text>
                      </View>

                      <View style={styles.valorColuna}>
                        <Text style={styles.valorRotulo}>Diferença (%)</Text>
                        <Text
                          style={[
                            styles.valorNumero,
                            item.diferencaPercentual > 0 && styles.valorCritico,
                          ]}
                        >
                          {item.diferencaPercentual > 0 ? `+${item.diferencaPercentual}%` : `${item.diferencaPercentual}%`}
                        </Text>
                      </View>

                      <View style={styles.valorColuna}>
                        <Text style={styles.valorRotulo}>% Contratual</Text>
                        <Text style={styles.valorNumero}>{item.percentualContratual}%</Text>
                      </View>

                      <View style={styles.valorColuna}>
                        <Text style={styles.valorRotulo}>Aluguel Mínimo</Text>
                        <Text style={styles.valorNumero}>
                          {AuditoriaVendasService.formatarMoeda(item.aluguelMinimoReferencia)}
                        </Text>
                      </View>

                      <View style={styles.valorColuna}>
                        <Text style={styles.valorRotulo}>Variável Calc.</Text>
                        <Text style={styles.valorNumero}>
                          {AuditoriaVendasService.formatarMoeda(item.aluguelVariavelCalculado)}
                        </Text>
                      </View>

                      <View style={[styles.valorColuna, styles.colunaReferencia]}>
                        <Text style={styles.valorRotulo}>Aluguel Referência</Text>
                        <Text style={styles.valorReferenciaFinal}>
                          {AuditoriaVendasService.formatarMoeda(item.aluguelReferencia)}
                        </Text>
                      </View>
                    </View>

                    {/* Observação / Evidência */}
                    <View style={styles.cardInfoSecundaria}>
                      {temEvidencia ? (
                        <View style={styles.evidenciaContainer}>
                          <Ionicons name="document-attach" size={14} color="#38bdf8" />
                          <Text style={styles.evidenciaNome}>
                            Evidência: {item.documentoNome || 'Comprovante Fiscal Anexado'}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.evidenciaContainer}>
                          <Ionicons name="alert-circle-outline" size={14} color="#94a3b8" />
                          <Text style={styles.semEvidencia}>Sem documento comprobatório anexado</Text>
                        </View>
                      )}

                      {item.observacao ? (
                        <Text style={styles.observacaoTexto} numberOfLines={1}>
                          💬 {item.observacao}
                        </Text>
                      ) : null}
                    </View>

                    {/* Rodapé e Ações */}
                    <View style={styles.cardFooter}>
                      <View style={styles.auditadoPorInfo}>
                        <Ionicons name="shield-checkmark-outline" size={13} color="#94a3b8" />
                        <Text style={styles.auditadoPorTexto}>
                          Auditado por: {item.auditadoPor} em {new Date(item.auditadoEm).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>

                      <View style={styles.cardAcoes}>
                        {onAbrirFichaLoja && (
                          <TouchableOpacity
                            style={styles.btnAcaoSecundaria}
                            onPress={() => onAbrirFichaLoja(item.idLoja)}
                          >
                            <Ionicons name="storefront-outline" size={14} color="#94a3b8" />
                            <Text style={styles.btnAcaoSecundariaTexto}>Loja 360°</Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={styles.btnAcaoSecundaria}
                          onPress={() => handleAbrirHistorico(item)}
                        >
                          <Ionicons name="time-outline" size={14} color="#94a3b8" />
                          <Text style={styles.btnAcaoSecundariaTexto}>Histórico</Text>
                        </TouchableOpacity>

                        {podeEditar && (
                          <TouchableOpacity
                            style={styles.btnAcaoEditar}
                            onPress={() => onAbrirEditorAuditoria(item)}
                          >
                            <Ionicons name="pencil" size={14} color="#fff" />
                            <Text style={styles.btnAcaoEditarTexto}>Editar / Auditar</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Modal de Histórico de Auditoria */}
          {historicoModalAuditoria && (
            <Modal visible transparent animationType="fade">
              <View style={styles.subModalOverlay}>
                <View style={styles.subModalContainer}>
                  <View style={styles.subModalHeader}>
                    <View>
                      <Text style={styles.subModalTitulo}>Trilha de Auditoria Imutável</Text>
                      <Text style={styles.subModalSubtitulo}>
                        {historicoModalAuditoria.nomeLoja} • Espaço {historicoModalAuditoria.numeroEspaco} (
                        {historicoModalAuditoria.competencia})
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setHistoricoModalAuditoria(null)}>
                      <Ionicons name="close" size={22} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.subModalCorpo}>
                    {historicoEventos.length === 0 ? (
                      <Text style={styles.semEventos}>Nenhum evento registrado nesta trilha.</Text>
                    ) : (
                      historicoEventos.map((evt) => (
                        <View key={evt.idEvento} style={styles.eventoCard}>
                          <View style={styles.eventoHead}>
                            <Text style={styles.eventoTipo}>{evt.tipoEvento}</Text>
                            <Text style={styles.eventoData}>
                              {new Date(evt.dataHora).toLocaleString('pt-BR')}
                            </Text>
                          </View>
                          <Text style={styles.eventoUsuario}>
                            Operador: {evt.usuarioId} ({evt.usuarioEmail})
                          </Text>
                          <Text style={styles.eventoDetalhes}>{evt.detalhes}</Text>
                          {evt.justificativa ? (
                            <View style={styles.eventoJustificativaBox}>
                              <Text style={styles.eventoJustificativaTitulo}>Justificativa:</Text>
                              <Text style={styles.eventoJustificativaTexto}>{evt.justificativa}</Text>
                            </View>
                          ) : null}
                        </View>
                      ))
                    )}
                  </ScrollView>

                  <View style={styles.subModalFooter}>
                    <TouchableOpacity
                      style={styles.btnSubModalFechar}
                      onPress={() => setHistoricoModalAuditoria(null)}
                    >
                      <Text style={styles.btnSubModalFecharTexto}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
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
    maxWidth: 1200,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnNovaAuditoria: {
    backgroundColor: '#0284c7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnNovaAuditoriaTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btnClose: {
    padding: 6,
  },
  kpiContainer: {
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
    minWidth: 130,
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiCardDivergente: {
    borderColor: '#ef4444',
    backgroundColor: '#450a0a',
  },
  kpiCardConforme: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  kpiCardDiferenca: {
    borderColor: '#f59e0b',
    backgroundColor: '#451a03',
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
  kpiTextoDivergente: {
    color: '#fca5a5',
  },
  kpiTextoConforme: {
    color: '#6ee7b7',
  },
  kpiTextoAuditado: {
    color: '#38bdf8',
  },
  kpiTextoReferencia: {
    color: '#a78bfa',
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
    gap: 12,
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
  cardDivergenteBorda: {
    borderColor: '#ef4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIdentificacao: {
    flex: 1,
  },
  lojaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  lojaNome: {
    fontSize: 16,
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
  permissionarioSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  cardBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  competenciaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  competenciaTagText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  badgeStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardValoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  valorColuna: {
    flex: 1,
    minWidth: 110,
  },
  colunaReferencia: {
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    paddingLeft: 12,
  },
  valorRotulo: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 2,
    fontWeight: '600',
  },
  valorNumero: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  valorDestaqueAuditado: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  valorCritico: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  valorReferenciaFinal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a78bfa',
  },
  cardInfoSecundaria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  evidenciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evidenciaNome: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '500',
  },
  semEvidencia: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  observacaoTexto: {
    fontSize: 12,
    color: '#94a3b8',
    maxWidth: 400,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    flexWrap: 'wrap',
    gap: 10,
  },
  auditadoPorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  auditadoPorTexto: {
    fontSize: 11,
    color: '#64748b',
  },
  cardAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnAcaoSecundaria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAcaoSecundariaTexto: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  btnAcaoEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAcaoEditarTexto: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subModalContainer: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '80%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
    overflow: 'hidden',
  },
  subModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    backgroundColor: '#0f172a',
  },
  subModalTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subModalSubtitulo: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  subModalCorpo: {
    padding: 16,
  },
  semEventos: {
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 20,
  },
  eventoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  eventoHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventoTipo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  eventoData: {
    fontSize: 11,
    color: '#64748b',
  },
  eventoUsuario: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 6,
  },
  eventoDetalhes: {
    fontSize: 12,
    color: '#e2e8f0',
    lineHeight: 18,
  },
  eventoJustificativaBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  eventoJustificativaTitulo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 2,
  },
  eventoJustificativaTexto: {
    fontSize: 11,
    color: '#fef3c7',
  },
  subModalFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'flex-end',
    backgroundColor: '#0f172a',
  },
  btnSubModalFechar: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnSubModalFecharTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
