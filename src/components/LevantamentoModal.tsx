import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  getSessaoAtiva,
  getPontosSessao,
  obterProximoPontoPendente,
  PontoLevantamento,
  SessaoLevantamento,
  ResultadoCadastro,
  RESULTADOS_CONFIG,
  getFilaOutboxCount,
  sincronizarFilaOffline,
} from '../services/levantamentoCampoService';

interface LevantamentoModalProps {
  visible: boolean;
  onClose: () => void;
  onContinuarNoMapa: (ponto: PontoLevantamento) => void;
  onAbrirRegistroPonto: (ponto: PontoLevantamento) => void;
}

export const LevantamentoModal: React.FC<LevantamentoModalProps> = ({
  visible,
  onClose,
  onContinuarNoMapa,
  onAbrirRegistroPonto,
}) => {
  const [sessao, setSessao] = useState<SessaoLevantamento | null>(null);
  const [pontos, setPontos] = useState<PontoLevantamento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<ResultadoCadastro | 'TODOS'>('TODOS');
  const [busca, setBusca] = useState('');
  const [filaCount, setFilaCount] = useState(0);

  const carregarDados = () => {
    const s = getSessaoAtiva();
    setSessao(s);
    const pts = getPontosSessao({
      resultado: filtroStatus === 'TODOS' ? undefined : filtroStatus,
      termoBusca: busca,
    });
    setPontos(pts);
    setFilaCount(getFilaOutboxCount());
  };

  useEffect(() => {
    if (visible) {
      carregarDados();
    }
  }, [visible, filtroStatus, busca]);

  if (!visible || !sessao) return null;

  const handleContinuar = () => {
    const proximo = obterProximoPontoPendente();
    if (proximo) {
      onContinuarNoMapa(proximo);
    } else {
      alert('Todos os pontos desta sessão já foram atendidos!');
    }
  };

  const handleSincronizar = () => {
    const res = sincronizarFilaOffline();
    setFilaCount(0);
    alert(`${res.sincronizados} registros sincronizados com sucesso!`);
    carregarDados();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerBadge}>FASE L2.6 • CENSO OPERACIONAL</Text>
              <Text style={styles.headerTitle}>📋 Levantamento de Campo</Text>
              <Text style={styles.headerSubtitle}>
                {sessao.titulo} • {sessao.setorAlvo}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Barra de Progresso Geral */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progresso da Rota</Text>
                <Text style={styles.progressPercentage}>
                  {sessao.indicadores.percentualProgresso}% Concluído
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(100, Math.max(5, sessao.indicadores.percentualProgresso))}%` },
                  ]}
                />
              </View>
              <View style={styles.progressMeta}>
                <Text style={styles.progressMetaText}>
                  Completude Média Cadastral: <Text style={{ color: '#06b6d4', fontWeight: 'bold' }}>{sessao.indicadores.completudeMedia}%</Text>
                </Text>
                {filaCount > 0 && (
                  <View style={styles.filaBadge}>
                    <Text style={styles.filaBadgeText}>⚡ Fila Offline: {filaCount}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Ações Primárias de Campo */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleContinuar}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryActionIcon}>🗺️</Text>
                <View>
                  <Text style={styles.primaryActionTitle}>Continuar no Mapa</Text>
                  <Text style={styles.primaryActionSubtitle}>
                    Ir direto para o próximo box pendente da rota
                  </Text>
                </View>
              </TouchableOpacity>

              {filaCount > 0 && (
                <TouchableOpacity
                  style={styles.secondaryActionBtn}
                  onPress={handleSincronizar}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryActionText}>🔄 Sincronizar Fila ({filaCount})</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Grade de Indicadores Rápidos */}
            <View style={styles.kpiGrid}>
              <View style={[styles.kpiCard, { borderColor: '#334155' }]}>
                <Text style={styles.kpiValue}>{sessao.indicadores.totalPrevisto}</Text>
                <Text style={styles.kpiLabel}>Total Previsto</Text>
              </View>

              <View style={[styles.kpiCard, { borderColor: '#10b981' }]}>
                <Text style={[styles.kpiValue, { color: '#10b981' }]}>
                  {sessao.indicadores.concluidos}
                </Text>
                <Text style={styles.kpiLabel}>Concluídos</Text>
              </View>

              <View style={[styles.kpiCard, { borderColor: '#f59e0b' }]}>
                <Text style={[styles.kpiValue, { color: '#f59e0b' }]}>
                  {sessao.indicadores.incompletos}
                </Text>
                <Text style={styles.kpiLabel}>Incompletos</Text>
              </View>

              <View style={[styles.kpiCard, { borderColor: '#cbd5e1' }]}>
                <Text style={[styles.kpiValue, { color: '#cbd5e1' }]}>
                  {sessao.indicadores.pendentes}
                </Text>
                <Text style={styles.kpiLabel}>Pendentes</Text>
              </View>

              <View style={[styles.kpiCard, { borderColor: '#8b5cf6' }]}>
                <Text style={[styles.kpiValue, { color: '#8b5cf6' }]}>
                  {sessao.indicadores.fechados}
                </Text>
                <Text style={styles.kpiLabel}>Fechados/Vagos</Text>
              </View>
            </View>

            {/* Barra de Filtros e Busca */}
            <View style={styles.filterSection}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por box, loja ou corredor..."
                placeholderTextColor="#64748b"
                value={busca}
                onChangeText={setBusca}
              />

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {(['TODOS', 'PENDENTE', 'CONCLUIDO', 'INCOMPLETO', 'REVISAR', 'RECUSOU', 'FECHADO'] as const).map(
                  (st) => {
                    const ativo = filtroStatus === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        style={[styles.pillBtn, ativo && styles.pillBtnAtivo]}
                        onPress={() => setFiltroStatus(st)}
                      >
                        <Text style={[styles.pillBtnText, ativo && styles.pillBtnTextAtivo]}>
                          {st === 'TODOS' ? 'Todos' : RESULTADOS_CONFIG[st].label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>
            </View>

            {/* Listagem de Pontos da Rota */}
            <View style={styles.listaContainer}>
              <Text style={styles.listaTitle}>
                Pontos Cadastrados ({pontos.length})
              </Text>

              {pontos.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Nenhum ponto encontrado para os filtros.</Text>
                </View>
              ) : (
                pontos.map((p) => {
                  const conf = RESULTADOS_CONFIG[p.resultado];
                  return (
                    <View key={p.idPonto} style={styles.pontoRow}>
                      <View style={styles.pontoInfo}>
                        <View style={styles.pontoHeaderRow}>
                          <Text style={styles.pontoNumero}>Box {p.numeroBox}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: conf.bg, borderColor: conf.cor }]}>
                            <Text style={[styles.statusBadgeText, { color: conf.cor }]}>
                              {conf.icon} {conf.label}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.pontoNomeLoja}>{p.nomeLoja}</Text>
                        <Text style={styles.pontoDetalhes}>
                          {p.corredor} • {p.segmento}
                        </Text>
                        <View style={styles.completudeBarTrack}>
                          <View
                            style={[
                              styles.completudeBarFill,
                              { width: `${p.percentualCompletude}%`, backgroundColor: conf.cor },
                            ]}
                          />
                        </View>
                        <Text style={styles.completudeText}>
                          Completude Cadastral: {p.percentualCompletude}%
                        </Text>
                      </View>

                      <View style={styles.pontoActions}>
                        <TouchableOpacity
                          style={styles.pontoActionBtn}
                          onPress={() => onAbrirRegistroPonto(p)}
                        >
                          <Text style={styles.pontoActionBtnText}>✍️ Registrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.pontoMapaBtn}
                          onPress={() => onContinuarNoMapa(p)}
                        >
                          <Text style={styles.pontoMapaBtnText}>📍 No Mapa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: Math.min(840, width - 32),
    maxHeight: Math.min(780, height - 40),
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#06b6d4',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 13,
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
  progressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: '800',
    color: '#10b981',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#0f172a',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 5,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  progressMetaText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  filaBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  filaBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  actionsRow: {
    marginBottom: 18,
    gap: 10,
  },
  primaryActionBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryActionIcon: {
    fontSize: 24,
  },
  primaryActionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  primaryActionSubtitle: {
    fontSize: 12,
    color: '#e0f2fe',
    marginTop: 2,
  },
  secondaryActionBtn: {
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillBtnAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  pillBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  pillBtnTextAtivo: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listaContainer: {
    marginBottom: 24,
  },
  listaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  emptyStateText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  pontoRow: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  pontoInfo: {
    flex: 1,
  },
  pontoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  pontoNumero: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38bdf8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pontoNomeLoja: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 2,
  },
  pontoDetalhes: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  completudeBarTrack: {
    height: 4,
    backgroundColor: '#0f172a',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  completudeBarFill: {
    height: '100%',
  },
  completudeText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  pontoActions: {
    gap: 8,
  },
  pontoActionBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  pontoActionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  pontoMapaBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  pontoMapaBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
