import React, { useState, useEffect } from 'react';
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
  DashboardExecutivoService,
  DadosDashboardExecutivo,
  FiltrosDashboardExecutivo,
} from '../services/dashboardExecutivoService';

interface DashboardExecutivoModalProps {
  visible: boolean;
  userRole?: string;
  onClose: () => void;
  onAbrirFicha360: (idLojaMapa: string) => void;
  onVerNoMapa: (idLojaMapa: string, numeroBox: string) => void;
}

type TabExecutiva = 'TODOS' | 'SETORES' | 'MIX' | 'FINANCEIRO' | 'RISCOS';

export const DashboardExecutivoModal: React.FC<DashboardExecutivoModalProps> = ({
  visible,
  userRole = 'ADMIN',
  onClose,
  onAbrirFicha360,
  onVerNoMapa,
}) => {
  const [dados, setDados] = useState<DadosDashboardExecutivo | null>(null);
  const [filtroSetor, setFiltroSetor] = useState<string>('TODOS');
  const [filtroSegmento, setFiltroSegmento] = useState<string>('TODOS');
  const [abaAtiva, setAbaAtiva] = useState<TabExecutiva>('TODOS');
  const [mensagemExportacao, setMensagemExportacao] = useState<string | null>(null);

  const carregarDados = () => {
    const filtros: FiltrosDashboardExecutivo = {
      setor: filtroSetor,
      segmento: filtroSegmento,
    };
    const d = DashboardExecutivoService.obterDadosDashboard(userRole, filtros);
    setDados(d);
  };

  useEffect(() => {
    if (visible) {
      carregarDados();
    }
  }, [visible, userRole, filtroSetor, filtroSegmento]);

  if (!visible || !dados) return null;

  const temFiltroAtivo = filtroSetor !== 'TODOS' || filtroSegmento !== 'TODOS';

  const handleLimparFiltros = () => {
    setFiltroSetor('TODOS');
    setFiltroSegmento('TODOS');
  };

  const handleExportarCSV = () => {
    try {
      const csv = DashboardExecutivoService.exportarRelatorioExecutivoCSV(userRole, {
        setor: filtroSetor,
        segmento: filtroSegmento,
      });

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_executivo_bi_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setMensagemExportacao('Relatório executivo exportado com sucesso em .CSV!');
      setTimeout(() => setMensagemExportacao(null), 4000);
    } catch {
      setMensagemExportacao('Erro ao exportar o relatório.');
      setTimeout(() => setMensagemExportacao(null), 3000);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay} id="dashboardExecutivoModal">
        <View style={styles.container}>
          {/* Header Executivo */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.badgeRow}>
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>FASE L4.0 • DASHBOARD EXECUTIVO & BI</Text>
                </View>
                <Text style={styles.dataGeracaoText}>Apuração: {dados.dataGeracao}</Text>
              </View>
              <Text style={styles.headerTitle}>Dashboard Executivo & Inteligência Comercial</Text>
              <Text style={styles.headerSubtitle}>
                Consolidação macrogencial de ocupação, vacância, mix, finanças e riscos do Centro Fashion Fortaleza
              </Text>
            </View>

            <View style={styles.headerActionGroup}>
              <TouchableOpacity
                id="btnExportarCsvExecutivo"
                style={styles.btnExportar}
                onPress={handleExportarCSV}
                accessibilityLabel="Exportar Relatório CSV"
              >
                <Text style={styles.btnExportarIcon}>📥</Text>
                <Text style={styles.btnExportarText}>Exportar CSV</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Alerta temporário de exportação */}
          {mensagemExportacao && (
            <View style={styles.alertSuccess}>
              <Text style={styles.alertSuccessText}>✓ {mensagemExportacao}</Text>
            </View>
          )}

          {/* Barra de Filtros Globais Dinâmicos (L4.1) */}
          <View style={styles.filtrosBar}>
            <View style={styles.filtrosRow}>
              <Text style={styles.filtrosLabel}>Filtrar Setor:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {['TODOS', 'Setor Azul', 'Setor Verde', 'Setor Amarelo', 'Setor Branco', 'Setor Roxo'].map(
                  (setor) => {
                    const ativo = filtroSetor === setor;
                    return (
                      <TouchableOpacity
                        key={setor}
                        style={[styles.filtroPill, ativo && styles.filtroPillAtivo]}
                        onPress={() => setFiltroSetor(setor)}
                      >
                        <Text style={[styles.filtroPillText, ativo && styles.filtroPillTextAtivo]}>
                          {setor === 'TODOS' ? 'Todos os Setores' : setor}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>
            </View>

            <View style={[styles.filtrosRow, { marginTop: 8 }]}>
              <Text style={styles.filtrosLabel}>Segmento:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {[
                  'TODOS',
                  'Moda Feminina',
                  'Jeanswear & Denim',
                  'Moda Masculina',
                  'Moda Infantil',
                  'Bijuterias & Acessórios',
                  'Moda Praia & Fitness',
                  'Calçados & Bolsas',
                ].map((seg) => {
                  const ativo = filtroSegmento === seg;
                  return (
                    <TouchableOpacity
                      key={seg}
                      style={[styles.filtroPill, ativo && styles.filtroPillAtivo]}
                      onPress={() => setFiltroSegmento(seg)}
                    >
                      <Text style={[styles.filtroPillText, ativo && styles.filtroPillTextAtivo]}>
                        {seg === 'TODOS' ? 'Todos os Segmentos' : seg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {temFiltroAtivo && (
                <TouchableOpacity style={styles.btnLimparFiltros} onPress={handleLimparFiltros}>
                  <Text style={styles.btnLimparFiltrosText}>✕ Limpar</Text>
                </TouchableOpacity>
              )}
            </View>

            {temFiltroAtivo && (
              <View style={styles.recorteAtivoBar}>
                <Text style={styles.recorteAtivoText}>
                  🎯 <Text style={{ fontWeight: 'bold' }}>Recorte Ativo:</Text>{' '}
                  {filtroSetor !== 'TODOS' ? filtroSetor : 'Todos os Setores'} •{' '}
                  {filtroSegmento !== 'TODOS' ? filtroSegmento : 'Todos os Segmentos'}
                </Text>
              </View>
            )}
          </View>

          {/* Abas de Navegação Temática do BI */}
          <View style={styles.tabsNavRow}>
            {[
              { key: 'TODOS', label: '📊 Visão Executiva' },
              { key: 'SETORES', label: '🏢 Setores & Ocupação' },
              { key: 'MIX', label: '👗 Mix Comercial' },
              { key: 'FINANCEIRO', label: '💰 Finanças & Fiscal (RBAC)' },
              { key: 'RISCOS', label: '🚨 Matriz de Riscos' },
            ].map((tab) => {
              const ativa = abaAtiva === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabNavBtn, ativa && styles.tabNavBtnAtiva]}
                  onPress={() => setAbaAtiva(tab.key as TabExecutiva)}
                >
                  <Text style={[styles.tabNavBtnText, ativa && styles.tabNavBtnTextAtiva]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* 1. Resumo Executivo - KPIs Principais (Visível na aba TODOS ou em qualquer aba no topo) */}
            {(abaAtiva === 'TODOS' || abaAtiva === 'SETORES') && (
              <View style={styles.kpiGrid}>
                <View style={[styles.kpiCard, { borderColor: '#3b82f6' }]}>
                  <Text style={[styles.kpiValor, { color: '#38bdf8' }]}>
                    {dados.resumoKPIs.taxaOcupacao}%
                  </Text>
                  <Text style={styles.kpiRotulo}>Taxa de Ocupação</Text>
                  <Text style={styles.kpiSub}>
                    {dados.resumoKPIs.totalOperacoes.toLocaleString('pt-BR')} de {dados.resumoKPIs.espacosAtuais.toLocaleString('pt-BR')} boxes
                  </Text>
                </View>

                <View style={[styles.kpiCard, { borderColor: '#10b981' }]}>
                  <Text style={[styles.kpiValor, { color: '#10b981' }]}>
                    {dados.resumoKPIs.completudeMedia}%
                  </Text>
                  <Text style={styles.kpiRotulo}>Completude Média</Text>
                  <Text style={styles.kpiSub}>
                    {dados.resumoKPIs.operacoesConcluidas.toLocaleString('pt-BR')} 100% concluídas
                  </Text>
                </View>

                <View style={[styles.kpiCard, { borderColor: '#f59e0b' }]}>
                  <Text style={[styles.kpiValor, { color: '#f59e0b' }]}>
                    {dados.resumoKPIs.operacoesComCampanha.toLocaleString('pt-BR')}
                  </Text>
                  <Text style={styles.kpiRotulo}>Em Campanhas</Text>
                  <Text style={styles.kpiSub}>Aderiram a promoções vigentes</Text>
                </View>

                <View style={[styles.kpiCard, { borderColor: '#a855f7' }]}>
                  <Text style={[styles.kpiValor, { color: '#a855f7' }]}>
                    {dados.resumoKPIs.visitadasUltimos30Dias.toLocaleString('pt-BR')}
                  </Text>
                  <Text style={styles.kpiRotulo}>Visitadas em 30d</Text>
                  <Text style={styles.kpiSub}>Censo presencial recente</Text>
                </View>
              </View>
            )}

            {/* 2. Bloco Restrito de Diretoria (Contratos, Finanças e Auditoria Fiscal) */}
            {dados.blocoRestrito && (abaAtiva === 'TODOS' || abaAtiva === 'FINANCEIRO') && (
              <View style={styles.blocoRestritoContainer}>
                <View style={styles.blocoRestritoHeader}>
                  <View style={styles.securityTag}>
                    <Text style={styles.securityTagText}>🔒 ACESSO RESTRITO • DIRETORIA, AUDITORIA & FINANCEIRO</Text>
                  </View>
                  <Text style={styles.blocoRestritoTitle}>Governança Financeira & Auditoria Fiscal de Vendas</Text>
                </View>

                <View style={styles.blocoRestritoGrid}>
                  <View style={styles.blocoRestritoItem}>
                    <Text style={styles.blocoRestritoRotulo}>Faturamento Auditado</Text>
                    <Text style={[styles.blocoRestritoValor, { color: '#38bdf8' }]}>
                      {DashboardExecutivoService.formatarMoeda(dados.blocoRestrito.faturamentoAuditadoTotal)}
                    </Text>
                    <Text style={styles.blocoRestritoSub}>
                      Declarado: {DashboardExecutivoService.formatarMoeda(dados.blocoRestrito.faturamentoDeclaradoTotal)}
                    </Text>
                  </View>

                  <View style={styles.blocoRestritoItem}>
                    <Text style={styles.blocoRestritoRotulo}>Aluguel Referência</Text>
                    <Text style={[styles.blocoRestritoValor, { color: '#10b981' }]}>
                      {DashboardExecutivoService.formatarMoeda(dados.blocoRestrito.aluguelReferenciaTotal)}
                    </Text>
                    <Text style={styles.blocoRestritoSub}>Base percentual vs mínimo</Text>
                  </View>

                  <View style={styles.blocoRestritoItem}>
                    <Text style={styles.blocoRestritoRotulo}>Taxa de Adimplência</Text>
                    <Text style={[styles.blocoRestritoValor, { color: '#10b981' }]}>
                      {dados.blocoRestrito.taxaAdimplencia}%
                    </Text>
                    <Text style={styles.blocoRestritoSub}>
                      {dados.blocoRestrito.permissionariosInadimplentes} em atraso
                    </Text>
                  </View>

                  <View style={styles.blocoRestritoItem}>
                    <Text style={styles.blocoRestritoRotulo}>Saldo Total Vencido</Text>
                    <Text style={[styles.blocoRestritoValor, { color: '#ef4444' }]}>
                      {DashboardExecutivoService.formatarMoeda(dados.blocoRestrito.saldoTotalVencido)}
                    </Text>
                    <Text style={styles.blocoRestritoSub}>
                      {dados.blocoRestrito.auditoriasComDivergencia} auditorias divergentes
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* 3. Duas Colunas: Mix por Segmento & Cobertura por Setor */}
            {(abaAtiva === 'TODOS' || abaAtiva === 'MIX' || abaAtiva === 'SETORES') && (
              <View style={styles.twoColRow}>
                {/* Coluna 1: Mix Comercial */}
                {(abaAtiva === 'TODOS' || abaAtiva === 'MIX') && (
                  <View style={styles.colCard}>
                    <Text style={styles.sectionTitle}>👗 Mix Comercial por Segmento</Text>
                    <View style={styles.segmentosList}>
                      {dados.mixSegmentos.map((item) => (
                        <View key={item.segmento} style={styles.segmentoRow}>
                          <View style={styles.segmentoLabelRow}>
                            <Text style={styles.segmentoNome}>{item.segmento}</Text>
                            <Text style={styles.segmentoQtd}>
                              {item.quantidadeLojas.toLocaleString('pt-BR')} ({item.percentual}%)
                            </Text>
                          </View>
                          <View style={styles.barTrack}>
                            <View
                              style={[
                                styles.barFill,
                                { width: `${item.percentual * 2.5}%`, backgroundColor: item.corHex },
                              ]}
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Coluna 2: Cobertura por Setor */}
                {(abaAtiva === 'TODOS' || abaAtiva === 'SETORES') && (
                  <View style={styles.colCard}>
                    <Text style={styles.sectionTitle}>📍 Cobertura e Ocupação por Setor</Text>
                    <View style={styles.setoresList}>
                      {dados.coberturaSetores.map((setor) => (
                        <View key={setor.setorNome} style={styles.setorRow}>
                          <View style={styles.setorTopRow}>
                            <View style={styles.setorIdentificacao}>
                              <View style={[styles.setorDot, { backgroundColor: setor.corHex }]} />
                              <Text style={styles.setorNome}>{setor.setorNome}</Text>
                              <Text style={styles.setorPiso}>• {setor.piso}</Text>
                            </View>
                            <Text style={styles.setorCompletudeText}>
                              {setor.taxaOcupacao}% ocupado
                            </Text>
                          </View>
                          <View style={styles.barTrack}>
                            <View
                              style={[
                                styles.barFill,
                                { width: `${setor.taxaOcupacao}%`, backgroundColor: setor.corHex },
                              ]}
                            />
                          </View>
                          <Text style={styles.setorSubInfo}>
                            {setor.operacoesAtivas} ativas • {setor.espacosVagos} vagos ({setor.totalEspacos} boxes)
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* 4. Recência das Visitas & Governança Cadastral */}
            {(abaAtiva === 'TODOS' || abaAtiva === 'SETORES') && (
              <View style={styles.twoColRow}>
                <View style={styles.colCard}>
                  <Text style={styles.sectionTitle}>⏱️ Recência das Visitas de Campo</Text>
                  <View style={styles.recenciaGrid}>
                    <View style={styles.recenciaItem}>
                      <Text style={[styles.recenciaValor, { color: '#10b981' }]}>
                        {dados.recenciaVisitas.ate7Dias}
                      </Text>
                      <Text style={styles.recenciaRotulo}>Até 7 dias</Text>
                    </View>
                    <View style={styles.recenciaItem}>
                      <Text style={[styles.recenciaValor, { color: '#38bdf8' }]}>
                        {dados.recenciaVisitas.de8A30Dias}
                      </Text>
                      <Text style={styles.recenciaRotulo}>8 a 30 dias</Text>
                    </View>
                    <View style={styles.recenciaItem}>
                      <Text style={[styles.recenciaValor, { color: '#f59e0b' }]}>
                        {dados.recenciaVisitas.de31A90Dias}
                      </Text>
                      <Text style={styles.recenciaRotulo}>31 a 90 dias</Text>
                    </View>
                    <View style={styles.recenciaItem}>
                      <Text style={[styles.recenciaValor, { color: '#ef4444' }]}>
                        {dados.recenciaVisitas.maisDe90Dias}
                      </Text>
                      <Text style={styles.recenciaRotulo}>+90 dias</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.colCard}>
                  <Text style={styles.sectionTitle}>🛡️ Qualidade da Base & Pendências</Text>
                  <View style={styles.governancaList}>
                    <View style={styles.governancaRow}>
                      <Text style={styles.governancaTexto}>Lojas sem nenhum contato cadastrado</Text>
                      <Text style={[styles.governancaQtd, { color: '#ef4444' }]}>
                        {dados.qualidadeGovernanca.semContato}
                      </Text>
                    </View>
                    <View style={styles.governancaRow}>
                      <Text style={styles.governancaTexto}>Sem catálogo de produtos / mix comercial</Text>
                      <Text style={[styles.governancaQtd, { color: '#f59e0b' }]}>
                        {dados.qualidadeGovernanca.semProdutoMix}
                      </Text>
                    </View>
                    <View style={styles.governancaRow}>
                      <Text style={styles.governancaTexto}>Sem participação em campanhas</Text>
                      <Text style={styles.governancaQtd}>
                        {dados.qualidadeGovernanca.semCampanhaAtiva}
                      </Text>
                    </View>
                    <View style={styles.governancaRow}>
                      <Text style={styles.governancaTexto}>Sem vistoria presencial nos últimos 30 dias</Text>
                      <Text style={[styles.governancaQtd, { color: '#f59e0b' }]}>
                        {dados.qualidadeGovernanca.semVisitaRecente}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* 5. Prioridades Executivas / Matriz de Riscos (Gestão por Exceção) */}
            {(abaAtiva === 'TODOS' || abaAtiva === 'RISCOS') && (
              <View style={styles.prioridadesSection}>
                <View style={styles.prioridadesHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.sectionTitle}>🚨 Matriz de Risco Operacional • Gestão por Exceção</Text>
                    <View style={styles.matrizBadge}>
                      <Text style={styles.matrizBadgeText}>{dados.prioridadesExecutivas.length} Casos Críticos</Text>
                    </View>
                  </View>
                  <Text style={styles.prioridadesSub}>
                    Operações com maior concentração de alertas fiscais, financeiros ou cadastrais no recorte
                  </Text>
                </View>

                <View style={styles.prioridadesGrid}>
                  {dados.prioridadesExecutivas.map((item) => {
                    const isCritico = item.grauRisco === 'CRITICO';
                    const isAlto = item.grauRisco === 'ALTO';
                    const badgeColor = isCritico ? '#ef4444' : isAlto ? '#f59e0b' : '#38bdf8';

                    return (
                      <View key={item.idOperacao} style={styles.prioridadeCard}>
                        <View style={styles.prioridadeTop}>
                          <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Text style={styles.prioridadeBox}>Box {item.numeroBox}</Text>
                              <View style={[styles.grauBadge, { borderColor: badgeColor }]}>
                                <Text style={[styles.grauBadgeText, { color: badgeColor }]}>
                                  RISCO {item.grauRisco}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.prioridadeNome}>{item.nomeFantasia}</Text>
                            <Text style={styles.prioridadeLocal}>
                              {item.razaoSocial} • {item.setor} • {item.segmento}
                            </Text>
                          </View>
                          <View style={styles.sinaisBadge}>
                            <Text style={styles.sinaisBadgeText}>{item.totalSinaisAtencao} alertas</Text>
                          </View>
                        </View>

                        <View style={styles.sinaisList}>
                          {item.sinais.map((s, idx) => (
                            <View key={idx} style={styles.sinalRow}>
                              <Text style={styles.sinalDot}>⚠️</Text>
                              <Text style={styles.sinalText}>{s}</Text>
                            </View>
                          ))}
                        </View>

                        <View style={styles.prioridadeActionsRow}>
                          <TouchableOpacity
                            style={styles.btnAcaoPrioridade}
                            onPress={() => onAbrirFicha360(item.idLojaMapa)}
                          >
                            <Text style={styles.btnAcaoPrioridadeText}>🏬 Ficha 360°</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.btnAcaoMapa}
                            onPress={() => onVerNoMapa(item.idLojaMapa, item.numeroBox)}
                          >
                            <Text style={styles.btnAcaoMapaText}>🗺️ Ver no Mapa</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>
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
    width: Math.min(1120, width - 24),
    maxHeight: Math.min(860, height - 24),
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
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
  headerActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnExportar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  btnExportarIcon: {
    fontSize: 14,
  },
  btnExportarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1,
  },
  dataGeracaoText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  headerTitle: {
    fontSize: 20,
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
  alertSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  alertSuccessText: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '700',
  },
  filtrosBar: {
    backgroundColor: '#131d36',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  filtrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filtrosLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    minWidth: 80,
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  filtroPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filtroPillAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  filtroPillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  filtroPillTextAtivo: {
    color: '#ffffff',
    fontWeight: '800',
  },
  btnLimparFiltros: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 6,
  },
  btnLimparFiltrosText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  recorteAtivoBar: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)',
  },
  recorteAtivoText: {
    fontSize: 11,
    color: '#38bdf8',
  },
  tabsNavRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  tabNavBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabNavBtnAtiva: {
    borderBottomColor: '#38bdf8',
  },
  tabNavBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  tabNavBtnTextAtiva: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  scrollArea: {
    padding: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  kpiValor: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  kpiRotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
  },
  kpiSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  blocoRestritoContainer: {
    backgroundColor: '#131d36',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  blocoRestritoHeader: {
    marginBottom: 12,
  },
  securityTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ef4444',
    marginBottom: 4,
  },
  securityTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#f87171',
  },
  blocoRestritoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
  },
  blocoRestritoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  blocoRestritoItem: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  blocoRestritoRotulo: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 2,
  },
  blocoRestritoValor: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  blocoRestritoSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  twoColRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  colCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 12,
  },
  segmentosList: {
    gap: 10,
  },
  segmentoRow: {
    gap: 4,
  },
  segmentoLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentoNome: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  segmentoQtd: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  setoresList: {
    gap: 12,
  },
  setorRow: {
    gap: 4,
  },
  setorTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setorIdentificacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  setorNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  setorPiso: {
    fontSize: 11,
    color: '#94a3b8',
  },
  setorCompletudeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
  },
  setorSubInfo: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  recenciaGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  recenciaItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  recenciaValor: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  recenciaRotulo: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
  governancaList: {
    gap: 8,
  },
  governancaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  governancaTexto: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  governancaQtd: {
    fontSize: 12,
    fontWeight: '800',
    color: '#cbd5e1',
  },
  prioridadesSection: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  prioridadesHeader: {
    marginBottom: 14,
  },
  matrizBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  matrizBadgeText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '800',
  },
  prioridadesSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  prioridadesGrid: {
    gap: 12,
  },
  prioridadeCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  prioridadeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  prioridadeBox: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38bdf8',
  },
  grauBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  grauBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  prioridadeNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 2,
  },
  prioridadeLocal: {
    fontSize: 11,
    color: '#94a3b8',
  },
  sinaisBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  sinaisBadgeText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  sinaisList: {
    gap: 4,
    marginBottom: 12,
  },
  sinalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sinalDot: {
    fontSize: 11,
  },
  sinalText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  prioridadeActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btnAcaoPrioridade: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAcaoPrioridadeText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '600',
  },
  btnAcaoMapa: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAcaoMapaText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
