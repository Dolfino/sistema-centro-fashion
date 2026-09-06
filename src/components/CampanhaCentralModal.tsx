import React, { useState } from 'react';
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
  CampanhaService,
  CampanhaMarketing,
  ParticipacaoLojaCampanha,
  StatusAdesaoCampanha,
  CORES_STATUS_CAMPANHA,
} from '../services/campanhaService';

interface CampanhaCentralModalProps {
  visible: boolean;
  onClose: () => void;
  campanhaAtivaId?: string | null;
  onAplicarNoMapa: (campanhaId: string) => void;
  onVerNoMapa: (participacao: ParticipacaoLojaCampanha) => void;
}

export const CampanhaCentralModal: React.FC<CampanhaCentralModalProps> = ({
  visible,
  onClose,
  campanhaAtivaId,
  onAplicarNoMapa,
  onVerNoMapa,
}) => {
  const campanhas = CampanhaService.listarCampanhas();
  const [campanhaSelecionadaId, setCampanhaSelecionadaId] = useState<string>(
    campanhaAtivaId || campanhas[0]?.id || 'CAMP-001'
  );
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [termoBusca, setTermoBusca] = useState<string>('');

  const campanhaAtual = CampanhaService.obterCampanha(campanhaSelecionadaId) || campanhas[0];
  const metricas = CampanhaService.obterMetricasCampanha(campanhaAtual.id);
  const participacoes = CampanhaService.listarParticipacoes(campanhaAtual.id, {
    status: filtroStatus,
    termo: termoBusca,
  });

  const handleMudarStatus = (
    participacao: ParticipacaoLojaCampanha,
    novoStatus: StatusAdesaoCampanha
  ) => {
    CampanhaService.atualizarStatusAdesao(campanhaAtual.id, participacao.idLojaMapa, novoStatus);
    // Força re-render
    setCampanhaSelecionadaId(campanhaAtual.id);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="megaphone" size={24} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Central de Campanhas de Marketing</Text>
                <Text style={styles.headerSubtitle}>
                  Centro Fashion Fortaleza • Adesão Comercial e Camadas Temáticas
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btnClose} onPress={onClose}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Seletor de Campanha */}
          <View style={styles.seletorCampanhasBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsCampanhas}>
              {campanhas.map((camp) => {
                const isSelected = camp.id === campanhaAtual.id;
                return (
                  <TouchableOpacity
                    key={camp.id}
                    style={[styles.campanhaTab, isSelected && styles.campanhaTabAtiva]}
                    onPress={() => setCampanhaSelecionadaId(camp.id)}
                  >
                    <Text style={[styles.campanhaTabText, isSelected && styles.campanhaTabTextAtiva]}>
                      {camp.nome}
                    </Text>
                    {camp.status === 'ATIVA' && (
                      <View style={styles.badgeAtiva}>
                        <Text style={styles.badgeAtivaText}>Ativa</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Destaque e Ação de Aplicar no Mapa */}
          <View style={styles.destaqueCampanhaCard}>
            <View style={styles.destaqueInfo}>
              <Text style={styles.destaqueNome}>{campanhaAtual.nome}</Text>
              <Text style={styles.destaquePeriodo}>
                Período: {campanhaAtual.dataInicio} até {campanhaAtual.dataFim} • Meta: {campanhaAtual.metaLojas} lojas
              </Text>
              <Text style={styles.destaqueDesc}>{campanhaAtual.descricao}</Text>
            </View>

            <TouchableOpacity
              style={styles.btnAplicarMapa}
              onPress={() => {
                onAplicarNoMapa(campanhaAtual.id);
                onClose();
              }}
            >
              <Ionicons name="color-palette-outline" size={20} color="#fff" />
              <Text style={styles.btnAplicarMapaText}>Colorir Mapa por esta Campanha</Text>
            </TouchableOpacity>
          </View>

          {/* Indicadores de Adesão */}
          <View style={styles.metricasRow}>
            <View style={styles.metricaCard}>
              <Text style={[styles.metricaNum, { color: '#38bdf8' }]}>{metricas.total}</Text>
              <Text style={styles.metricaLabel}>Lojas na Carteira</Text>
            </View>

            <View style={styles.metricaCard}>
              <Text style={[styles.metricaNum, { color: '#10b981' }]}>{metricas.confirmadas}</Text>
              <Text style={styles.metricaLabel}>Confirmadas</Text>
            </View>

            <View style={styles.metricaCard}>
              <Text style={[styles.metricaNum, { color: '#f59e0b' }]}>{metricas.interessadas}</Text>
              <Text style={styles.metricaLabel}>Interessadas</Text>
            </View>

            <View style={styles.metricaCard}>
              <Text style={[styles.metricaNum, { color: '#3b82f6' }]}>{metricas.contatadas}</Text>
              <Text style={styles.metricaLabel}>Contatadas</Text>
            </View>

            <View style={styles.metricaCard}>
              <Text style={[styles.metricaNum, { color: '#ef4444' }]}>{metricas.naoParticipara}</Text>
              <Text style={styles.metricaLabel}>Recusadas</Text>
            </View>
          </View>

          {/* Barra de Filtros e Busca */}
          <View style={styles.filtrosBar}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por box (ex: 1176), nome da loja ou segmento..."
                placeholderTextColor="#64748b"
                value={termoBusca}
                onChangeText={setTermoBusca}
              />
              {termoBusca ? (
                <TouchableOpacity onPress={() => setTermoBusca('')}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusChipsRow}>
              {[
                { id: 'TODOS', label: 'Todos os Status' },
                { id: 'CONFIRMADA', label: 'Confirmadas' },
                { id: 'INTERESSADA', label: 'Interessadas' },
                { id: 'CONTATADA', label: 'Contatadas' },
                { id: 'NAO_PARTICIPARA', label: 'Recusadas' },
              ].map((st) => (
                <TouchableOpacity
                  key={st.id}
                  style={[styles.statusChip, filtroStatus === st.id && styles.statusChipAtivo]}
                  onPress={() => setFiltroStatus(st.id)}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      filtroStatus === st.id && styles.statusChipTextAtivo,
                    ]}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Lista de Lojas Participantes */}
          <ScrollView style={styles.listaScroll}>
            <View style={styles.listaGrid}>
              {participacoes.map((p) => {
                const infoCor = CORES_STATUS_CAMPANHA[p.status] || CORES_STATUS_CAMPANHA.NAO_CONTATADA;

                return (
                  <View key={p.idParticipacao} style={styles.cardLoja}>
                    <View style={styles.cardLojaHeader}>
                      <View style={styles.boxTag}>
                        <Text style={styles.boxTagText}>Box {p.numeroBox}</Text>
                      </View>

                      <View style={[styles.statusBadge, { backgroundColor: infoCor.bg }]}>
                        <View
                          style={[styles.statusDot, { backgroundColor: infoCor.markerColor }]}
                        />
                        <Text style={[styles.statusBadgeText, { color: infoCor.text }]}>
                          {infoCor.label}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.lojaNome} numberOfLines={1}>
                      {p.nomeLoja}
                    </Text>
                    <Text style={styles.lojaSegmento}>
                      {p.segmento} • {p.setor} • {p.corredor}
                    </Text>

                    {p.observacao && (
                      <Text style={styles.lojaObs} numberOfLines={2}>
                        "{p.observacao}"
                      </Text>
                    )}

                    <View style={styles.cardLojaFooter}>
                      <View style={styles.ofertasCount}>
                        <Ionicons name="pricetag-outline" size={14} color="#38bdf8" />
                        <Text style={styles.ofertasText}>
                          {p.produtosOfertasCount > 0
                            ? `${p.produtosOfertasCount} ofertas cadastradas`
                            : 'Sem ofertas cadastradas'}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.btnVerMapa}
                        onPress={() => {
                          onVerNoMapa(p);
                          onClose();
                        }}
                      >
                        <Ionicons name="navigate-outline" size={15} color="#38bdf8" />
                        <Text style={styles.btnVerMapaText}>Ver no Mapa</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Botões Rápidos de Alterar Status */}
                    <View style={styles.acoesStatusRow}>
                      <Text style={styles.acoesStatusLabel}>Mudar Status:</Text>
                      {(['CONFIRMADA', 'INTERESSADA', 'NAO_PARTICIPARA'] as StatusAdesaoCampanha[]).map(
                        (st) => {
                          const isCurrent = p.status === st;
                          const stInfo = CORES_STATUS_CAMPANHA[st];
                          return (
                            <TouchableOpacity
                              key={st}
                              style={[
                                styles.btnStatusPequeno,
                                isCurrent && { backgroundColor: stInfo.bg, borderColor: stInfo.markerColor },
                              ]}
                              onPress={() => handleMudarStatus(p, st)}
                            >
                              <Text
                                style={[
                                  styles.btnStatusPequenoText,
                                  isCurrent && { color: stInfo.text, fontWeight: '700' },
                                ]}
                              >
                                {st === 'CONFIRMADA'
                                  ? 'Confirmar'
                                  : st === 'INTERESSADA'
                                  ? 'Interessada'
                                  : 'Recusar'}
                              </Text>
                            </TouchableOpacity>
                          );
                        }
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 980,
    height: '92%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  btnClose: {
    padding: 6,
  },
  /* Seletor Campanhas */
  seletorCampanhasBar: {
    backgroundColor: '#131f37',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipsCampanhas: {
    flexDirection: 'row',
  },
  campanhaTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  campanhaTabAtiva: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  campanhaTabText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  campanhaTabTextAtiva: {
    color: '#fff',
    fontWeight: '700',
  },
  badgeAtiva: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAtivaText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  /* Destaque e Ação de Colorir */
  destaqueCampanhaCard: {
    backgroundColor: '#1e293b',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  destaqueInfo: {
    flex: 1,
    minWidth: 280,
  },
  destaqueNome: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  destaquePeriodo: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '600',
    marginVertical: 2,
  },
  destaqueDesc: {
    fontSize: 12,
    color: '#94a3b8',
  },
  btnAplicarMapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnAplicarMapaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  /* Métricas */
  metricasRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  metricaCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricaNum: {
    fontSize: 16,
    fontWeight: '800',
  },
  metricaLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  /* Filtros */
  filtrosBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
    height: 40,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 13,
    marginLeft: 8,
  },
  statusChipsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusChipAtivo: {
    backgroundColor: '#334155',
    borderColor: '#38bdf8',
  },
  statusChipText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  statusChipTextAtivo: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  /* Lista de Lojas */
  listaScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listaGrid: {
    gap: 10,
    paddingBottom: 20,
  },
  cardLoja: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLojaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  boxTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38bdf8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lojaNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 6,
  },
  lojaSegmento: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  lojaObs: {
    fontSize: 12,
    color: '#cbd5e1',
    fontStyle: 'italic',
    marginTop: 6,
  },
  cardLojaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  ofertasCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ofertasText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  btnVerMapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  btnVerMapaText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  acoesStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#243248',
  },
  acoesStatusLabel: {
    fontSize: 11,
    color: '#64748b',
    marginRight: 4,
  },
  btnStatusPequeno: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnStatusPequenoText: {
    fontSize: 10,
    color: '#94a3b8',
  },
});
