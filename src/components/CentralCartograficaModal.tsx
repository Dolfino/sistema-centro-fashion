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
  CartografiaService,
  PontoReferenciaCartografico,
  CruzamentoCartografico,
  CorredorCartografico,
  ParCalibracaoNivel,
  AreaEspecialCartografica,
  DiagnosticoRingScore,
  SnapshotCartografico,
} from '../services/cartografiaService';

interface CentralCartograficaModalProps {
  visible: boolean;
  userRole?: string;
  abaInicial?: 'CARTOGRAFIA' | 'CALIBRACAO' | 'AREAS_SUBSOLO' | 'AREAS_NIVEL_1' | 'ESTACIONAMENTO' | 'TORRES_NUCLEOS' | 'SNAPSHOTS';
  onClose: () => void;
  onSelecionarPontoMapa?: (x: number, y: number) => void;
}

export type TabCartografia =
  | 'CARTOGRAFIA'
  | 'CALIBRACAO'
  | 'AREAS_SUBSOLO'
  | 'AREAS_NIVEL_1'
  | 'ESTACIONAMENTO'
  | 'TORRES_NUCLEOS'
  | 'SNAPSHOTS';

export const CentralCartograficaModal: React.FC<CentralCartograficaModalProps> = ({
  visible,
  userRole = 'ADMIN',
  abaInicial = 'CARTOGRAFIA',
  onClose,
  onSelecionarPontoMapa,
}) => {
  const [tabAtiva, setTabAtiva] = useState<TabCartografia>(abaInicial);
  const [referencias, setReferencias] = useState<PontoReferenciaCartografico[]>([]);
  const [cruzamentos, setCruzamentos] = useState<CruzamentoCartografico[]>([]);
  const [corredores, setCorredores] = useState<CorredorCartografico[]>([]);
  const [calibracoes, setCalibracoes] = useState<ParCalibracaoNivel[]>([]);
  const [areasEspeciais, setAreasEspeciais] = useState<AreaEspecialCartografica[]>([]);
  const [ringScore, setRingScore] = useState<DiagnosticoRingScore | null>(null);
  const [snapshots, setSnapshots] = useState<SnapshotCartografico[]>([]);

  const [descricaoPublicacao, setDescricaoPublicacao] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const carregarDados = () => {
    setReferencias(CartografiaService.obterReferencias());
    setCruzamentos(CartografiaService.obterCruzamentos());
    setCorredores(CartografiaService.obterCorredores());
    setCalibracoes(CartografiaService.obterParesCalibracao());
    setAreasEspeciais(CartografiaService.obterAreasEspeciais());
    setRingScore(CartografiaService.obterDiagnosticoRingScore());
    setSnapshots(CartografiaService.obterSnapshots());
  };

  useEffect(() => {
    if (visible) {
      setTabAtiva(abaInicial);
      carregarDados();
    }
  }, [visible, abaInicial]);

  if (!visible) return null;

  const handleRestaurar = (idSnapshot: string) => {
    const res = CartografiaService.restaurarSnapshot(idSnapshot);
    setFeedbackMsg(res.mensagem);
    carregarDados();
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handlePublicarNovaVersao = () => {
    if (!descricaoPublicacao.trim()) {
      alert('Informe a justificativa/descrição da publicação cartográfica.');
      return;
    }
    const snap = CartografiaService.publicarVersao(descricaoPublicacao);
    setDescricaoPublicacao('');
    carregarDados();
    setFeedbackMsg(`Versão ${snap.versao} publicada oficialmente no PostgreSQL/PostGIS!`);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay} id="modalCentralCartografica">
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.badgeRow}>
                <View style={styles.badgeCarto}>
                  <Text style={styles.badgeCartoText}>FASE L5.0 • GESTÃO CARTOGRÁFICA & TOPOLOGIA</Text>
                </View>
                {ringScore && (
                  <View style={styles.ringScorePill}>
                    <Text style={styles.ringScorePillText}>
                      Topologia Ring Score: {ringScore.ringScoreGeral}% ({ringScore.statusSaude})
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.headerTitle}>Central Cartográfica & Calibração Espacial</Text>
              <Text style={styles.headerSub}>
                Controle de referências, nós viários, calibração afim, áreas especiais e publicação no PostGIS
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Feedback */}
          {feedbackMsg && (
            <View style={styles.feedbackBar}>
              <Text style={styles.feedbackText}>✓ {feedbackMsg}</Text>
            </View>
          )}

          {/* Abas */}
          <View style={styles.tabsBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { key: 'CARTOGRAFIA', label: '◈ Nós & Corredores (#33)' },
                { key: 'CALIBRACAO', label: '✦ Calibração dos níveis' },
                { key: 'AREAS_SUBSOLO', label: '⌗ Áreas do Subsolo' },
                { key: 'AREAS_NIVEL_1', label: '🏢 Áreas do Nível 1' },
                { key: 'ESTACIONAMENTO', label: '▱ Estacionamento / Nível 3' },
                { key: 'TORRES_NUCLEOS', label: '⇅ Torres / Núcleos verticais' },
                { key: 'SNAPSHOTS', label: '📜 Snapshots & Publicação' },
              ].map((tab) => {
                const ativa = tabAtiva === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.tabBtn, ativa && styles.tabBtnAtiva]}
                    onPress={() => setTabAtiva(tab.key as TabCartografia)}
                  >
                    <Text style={[styles.tabBtnText, ativa && styles.tabBtnTextAtiva]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* ABA 1: NÓS E CORREDORES */}
            {tabAtiva === 'CARTOGRAFIA' && (
              <View>
                {/* Resumo Ring Score */}
                {ringScore && (
                  <View style={styles.cardRingScore}>
                    <View style={styles.ringLeft}>
                      <Text style={styles.ringScoreGrande}>{ringScore.ringScoreGeral}%</Text>
                      <Text style={styles.ringScoreRotulo}>Conformidade Topológica</Text>
                    </View>
                    <View style={styles.ringRight}>
                      <Text style={styles.ringMetrica}>
                        • {ringScore.totalReferencias} Nós de Referência ({ringScore.referenciasValidadas} validados)
                      </Text>
                      <Text style={styles.ringMetrica}>
                        • {ringScore.totalCruzamentos} Cruzamentos ({ringScore.cruzamentosDesconectados} desconexões)
                      </Text>
                      <Text style={styles.ringMetrica}>
                        • {ringScore.totalCorredores} Corredores principais cadastrados
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={styles.sectionTitle}>Pontos de Referência Cartográfica</Text>
                <View style={styles.gridCards}>
                  {referencias.map((ref) => (
                    <View key={ref.id} style={styles.cardRef}>
                      <View style={styles.cardRefTop}>
                        <Text style={styles.refCodigo}>{ref.codigo}</Text>
                        <View style={styles.refBadge}>
                          <Text style={styles.refBadgeText}>{ref.statusValidacao}</Text>
                        </View>
                      </View>
                      <Text style={styles.refDesc}>{ref.descricao}</Text>
                      <Text style={styles.refCoord}>
                        {ref.setor} • {ref.piso} • Coordenadas: [X: {ref.x}, Y: {ref.y}]
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Corredores e Malha de Circulação</Text>
                <View style={styles.corredoresList}>
                  {corredores.map((cor) => (
                    <View key={cor.id} style={styles.cardCorredor}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.corredorNome}>{cor.nome}</Text>
                        <Text style={styles.corredorSub}>
                          {cor.setor} • {cor.piso} • {cor.extensaoMetros}m extensão • Largura média: {cor.larguraMediaMetros}m
                        </Text>
                      </View>
                      <View style={styles.corredorLojasBadge}>
                        <Text style={styles.corredorLojasText}>{cor.totalLojasAcesso} Lojas</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA 2: CALIBRAÇÃO DE NÍVEIS (TRANSFORMAÇÃO AFIM) */}
            {tabAtiva === 'CALIBRACAO' && (
              <View>
                <Text style={styles.sectionTitle}>Matriz de Calibração Afim & Alinhamento de Plantas</Text>
                <Text style={styles.sectionSubtitle}>
                  Transformação projetiva baseada em pares de pontos de controle entre a planta arquitetônica legada e coordenadas espaciais georreferenciadas
                </Text>

                <View style={styles.calibracaoCard}>
                  <View style={styles.calibracaoHeader}>
                    <Text style={styles.calibracaoTitle}>Pares de Pontos de Controle Equivalentes</Text>
                    <Text style={styles.calibracaoStatus}>Status: Matriz Convergida (RMS: 0.83px)</Text>
                  </View>

                  <View style={styles.tabelaCalibracao}>
                    <View style={styles.tabelaCalHeader}>
                      <Text style={[styles.thCal, { flex: 2 }]}>Ponto de Controle</Text>
                      <Text style={styles.thCal}>Planta Legada [X, Y]</Text>
                      <Text style={styles.thCal}>Geometria Real [X, Y]</Text>
                      <Text style={styles.thCal}>Erro Residual</Text>
                    </View>
                    {calibracoes.map((cal) => (
                      <View key={cal.id} style={styles.tabelaCalRow}>
                        <Text style={[styles.tdCal, { flex: 2, fontWeight: '700', color: '#f8fafc' }]}>
                          {cal.nomePonto}
                        </Text>
                        <Text style={styles.tdCal}>[{cal.xPlantaLegada}, {cal.yPlantaLegada}]</Text>
                        <Text style={styles.tdCal}>[{cal.xGeometriaReal}, {cal.yGeometriaReal}]</Text>
                        <Text style={[styles.tdCal, { color: '#10b981', fontWeight: '800' }]}>
                          ±{cal.erroResidualPx} px
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* ABA 3: ESTACIONAMENTO NÍVEL 3 (SETOR VERMELHO) */}
            {tabAtiva === 'ESTACIONAMENTO' && (
              <View>
                <Text style={styles.sectionTitle}>Delimitação de Estacionamento • Setor Vermelho (Nível 3)</Text>
                <Text style={styles.sectionSubtitle}>
                  Controle da área perimetral especial do estacionamento superior, baias e acessos no Nível 3
                </Text>

                <View style={styles.areaEspecialCard}>
                  <View style={styles.areaEspecialHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.corDot, { backgroundColor: '#dc2626' }]} />
                      <Text style={styles.areaEspecialNome}>Setor Vermelho / Estacionamento Superior (Nível 3)</Text>
                    </View>
                    <View style={styles.badgeAtivo}>
                      <Text style={styles.badgeAtivoText}>ATIVO</Text>
                    </View>
                  </View>

                  <View style={styles.areaEspecialMetrics}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>850</Text>
                      <Text style={styles.metricLabel}>Vagas de Veículos</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>14.500 m²</Text>
                      <Text style={styles.metricLabel}>Área Total Estimada</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>4 Pontos</Text>
                      <Text style={styles.metricLabel}>Vértices do Polígono</Text>
                    </View>
                  </View>

                  <View style={styles.poligonoCoordsBox}>
                    <Text style={styles.poligonoCoordsTitle}>Coordenadas do Polígono Espacial (GeoJSON):</Text>
                    <Text style={styles.poligonoCoordsText}>
                      POLYGON(((0.05 0.05), (0.95 0.05), (0.95 0.95), (0.05 0.95), (0.05 0.05)))
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* ABA 4: ÁREAS DO NÍVEL 1 */}
            {tabAtiva === 'AREAS_NIVEL_1' && (
              <View>
                <Text style={styles.sectionTitle}>Delimitação de Áreas Especiais do Nível 1</Text>
                <Text style={styles.sectionSubtitle}>
                  Zonas estruturais validadas: Hotel Transamérica, Central de Distribuição (CDM) e Áreas Externas
                </Text>

                <View style={styles.gridCards}>
                  {areasEspeciais.map((area) => (
                    <View key={area.id} style={styles.cardArea}>
                      <View style={styles.cardAreaHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={[styles.corDot, { backgroundColor: area.setorCor }]} />
                          <Text style={styles.areaNome}>{area.nomeArea}</Text>
                        </View>
                        <Text style={styles.areaTipo}>{area.tipo}</Text>
                      </View>
                      <Text style={styles.areaMetragem}>Área estimada: {area.areaEstimadaM2.toLocaleString('pt-BR')} m²</Text>
                      <View style={styles.poligonoMiniBox}>
                        <Text style={styles.poligonoMiniText}>
                          {area.poligonoPontos.length} vértices poligonais delimitados no PostGIS
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA: ÁREAS DO SUBSOLO (NÍVEL 0) */}
            {tabAtiva === 'AREAS_SUBSOLO' && (
              <View>
                <Text style={styles.sectionTitle}>Áreas do Subsolo (Nível 0)</Text>
                <Text style={styles.sectionSubtitle}>
                  Estacionamento, circulação, acessos operacionais e área externa do Nível 0
                </Text>

                <View style={styles.areaEspecialCard}>
                  <View style={styles.areaEspecialHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.corDot, { backgroundColor: '#6366f1' }]} />
                      <Text style={styles.areaEspecialNome}>Subsolo • Circulação, Doca e Logística (Nível 0)</Text>
                    </View>
                    <View style={styles.badgeAtivo}>
                      <Text style={styles.badgeAtivoText}>OPERACIONAL</Text>
                    </View>
                  </View>

                  <View style={styles.areaEspecialMetrics}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>420</Text>
                      <Text style={styles.metricLabel}>Vagas de Carro / Vans</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>32 Baias</Text>
                      <Text style={styles.metricLabel}>Ônibus de Excursão</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>18.200 m²</Text>
                      <Text style={styles.metricLabel}>Área Total Estimada</Text>
                    </View>
                  </View>

                  <View style={styles.poligonoCoordsBox}>
                    <Text style={styles.poligonoCoordsTitle}>Polígonos & Acessos de Circulação do Subsolo:</Text>
                    <Text style={styles.poligonoCoordsText}>
                      POLYGON(((0.02 0.08), (0.98 0.08), (0.98 0.94), (0.02 0.94), (0.02 0.08))) • Acesso Rampa Sul / Acesso Docas
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* ABA: TORRES E NÚCLEOS VERTICAIS */}
            {tabAtiva === 'TORRES_NUCLEOS' && (
              <View>
                <Text style={styles.sectionTitle}>Torres / Núcleos Verticais</Text>
                <Text style={styles.sectionSubtitle}>
                  Identidades físicas e polígonos verticais independentes em N0, N1, N2 e N3
                </Text>

                <View style={styles.gridCards}>
                  {[
                    { id: 'TORRE-1', nome: 'Torre 1 — Praça Principal', cor: '#3b82f6', pisos: 'N0, N1, N2, N3', elevadores: 4 },
                    { id: 'TORRE-2', nome: 'Torre 2 — Caixa Eletrônico / Roxo', cor: '#8b5cf6', pisos: 'N0, N1, N2, N3', elevadores: 3 },
                    { id: 'TORRE-3', nome: 'Torre 3 — Estacionamento / Amarelo', cor: '#f59e0b', pisos: 'N1, N2, N3', elevadores: 2 },
                    { id: 'TORRE-4', nome: 'Torre 4 — Hotel & Acesso Rápido', cor: '#10b981', pisos: 'N0, N1, N2', elevadores: 3 },
                    { id: 'TORRE-5', nome: 'Torre 5 — Logística & CDM', cor: '#ec4899', pisos: 'N0, N1, N2, N3', elevadores: 2 },
                  ].map((torre) => (
                    <View key={torre.id} style={styles.cardArea}>
                      <View style={styles.cardAreaHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={[styles.corDot, { backgroundColor: torre.cor }]} />
                          <Text style={styles.areaNome}>{torre.nome}</Text>
                        </View>
                        <Text style={styles.areaTipo}>{torre.id}</Text>
                      </View>
                      <Text style={styles.areaMetragem}>Conexão vertical: {torre.pisos}</Text>
                      <View style={styles.poligonoMiniBox}>
                        <Text style={styles.poligonoMiniText}>
                          {torre.elevadores} elevadores / escadas rolantes integrados com georreferência
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA 5: SNAPSHOTS E PUBLICAÇÃO */}
            {tabAtiva === 'SNAPSHOTS' && (
              <View>
                {/* Form Publicar */}
                <View style={styles.formPublicarCard}>
                  <Text style={styles.formPublicarTitle}>Publicar Nova Versão Cartográfica Transacional</Text>
                  <Text style={styles.formPublicarSub}>
                    Gera commit no banco PostgreSQL PostGIS e propaga invalidação de cache para todos os terminais
                  </Text>
                  <TextInput
                    style={styles.textInputDesc}
                    placeholder="Descreva as alterações executadas nesta versão (ex: Inclusão de novas baias...)"
                    placeholderTextColor="#64748b"
                    value={descricaoPublicacao}
                    onChangeText={setDescricaoPublicacao}
                  />
                  <TouchableOpacity style={styles.btnPublicarVersao} onPress={handlePublicarNovaVersao}>
                    <Text style={styles.btnPublicarVersaoText}>🚀 Publicar Versão no PostGIS</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Histórico de Snapshots & Restauração Controlada</Text>
                <View style={styles.snapshotsList}>
                  {snapshots.map((snap) => (
                    <View key={snap.id} style={styles.cardSnapshot}>
                      <View style={styles.snapLeft}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={styles.snapVersao}>{snap.versao}</Text>
                          <View
                            style={[
                              styles.badgeSnapStatus,
                              { borderColor: snap.status === 'PUBLICADO' ? '#10b981' : '#64748b' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeSnapText,
                                { color: snap.status === 'PUBLICADO' ? '#10b981' : '#94a3b8' },
                              ]}
                            >
                              {snap.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.snapDesc}>{snap.descricao}</Text>
                        <Text style={styles.snapAutor}>Por {snap.autor} em {snap.timestamp}</Text>
                      </View>

                      <View style={styles.snapRight}>
                        <Text style={styles.snapRing}>Ring Score: {snap.ringScoreNaPublicacao}%</Text>
                        <Text style={styles.snapGeom}>{snap.totalGeometrias} geometrias</Text>
                        {snap.status !== 'PUBLICADO' && (
                          <TouchableOpacity
                            style={styles.btnRollback}
                            onPress={() => handleRestaurar(snap.id)}
                          >
                            <Text style={styles.btnRollbackText}>↺ Restaurar Rollback</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  badgeCarto: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  badgeCartoText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1,
  },
  ringScorePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  ringScorePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6ee7b7',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  headerSub: {
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
  feedbackBar: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  feedbackText: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '700',
  },
  tabsBar: {
    backgroundColor: '#131d36',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingHorizontal: 16,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnAtiva: {
    borderBottomColor: '#38bdf8',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  tabBtnTextAtiva: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  scrollArea: {
    padding: 20,
  },
  cardRingScore: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  ringLeft: {
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    paddingRight: 20,
  },
  ringScoreGrande: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10b981',
  },
  ringScoreRotulo: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  ringRight: {
    flex: 1,
    gap: 4,
  },
  ringMetrica: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardRef: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardRefTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  refCodigo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38bdf8',
  },
  refBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  refBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
  },
  refDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f8fafc',
  },
  refCoord: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
  corredoresList: {
    gap: 8,
  },
  cardCorredor: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  corredorNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  corredorSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  corredorLojasBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  corredorLojasText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
  },
  calibracaoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  calibracaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calibracaoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
  },
  calibracaoStatus: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
  },
  tabelaCalibracao: {
    gap: 8,
  },
  tabelaCalHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  thCal: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabelaCalRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
  },
  tdCal: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
  },
  areaEspecialCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  areaEspecialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  corDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  areaEspecialNome: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
  },
  badgeAtivo: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  badgeAtivoText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fca5a5',
  },
  areaEspecialMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38bdf8',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  poligonoCoordsBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  poligonoCoordsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 4,
  },
  poligonoCoordsText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#cbd5e1',
  },
  cardArea: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardAreaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  areaNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  areaTipo: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
  },
  areaMetragem: {
    fontSize: 12,
    color: '#38bdf8',
    marginBottom: 8,
  },
  poligonoMiniBox: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  poligonoMiniText: {
    fontSize: 11,
    color: '#64748b',
  },
  formPublicarCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  formPublicarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38bdf8',
  },
  formPublicarSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    marginBottom: 12,
  },
  textInputDesc: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  btnPublicarVersao: {
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPublicarVersaoText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  snapshotsList: {
    gap: 12,
  },
  cardSnapshot: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snapLeft: {
    flex: 1,
    gap: 4,
  },
  snapVersao: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38bdf8',
  },
  badgeSnapStatus: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeSnapText: {
    fontSize: 9,
    fontWeight: '800',
  },
  snapDesc: {
    fontSize: 12,
    color: '#f8fafc',
  },
  snapAutor: {
    fontSize: 11,
    color: '#64748b',
  },
  snapRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  snapRing: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  snapGeom: {
    fontSize: 11,
    color: '#94a3b8',
  },
  btnRollback: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  btnRollbackText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '700',
  },
});
