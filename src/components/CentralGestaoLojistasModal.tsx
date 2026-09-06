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
  Linking,
  Platform,
} from 'react-native';
import {
  GestaoLojistasService,
  OperacaoComercial,
  Permissionario,
  MetricasGestao,
} from '../services/gestaoLojistasService';

interface CentralGestaoLojistasModalProps {
  visible: boolean;
  onClose: () => void;
  onAbrirFicha360: (idLojaMapa: string) => void;
  onVerNoMapa: (idLojaMapa: string, numeroBox: string) => void;
}

export const CentralGestaoLojistasModal: React.FC<CentralGestaoLojistasModalProps> = ({
  visible,
  onClose,
  onAbrirFicha360,
  onVerNoMapa,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'OPERACOES' | 'PERMISSIONARIOS'>('OPERACOES');
  const [metricas, setMetricas] = useState<MetricasGestao | null>(null);
  const [operacoes, setOperacoes] = useState<OperacaoComercial[]>([]);
  const [permissionarios, setPermissionarios] = useState<Permissionario[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroSegmento, setFiltroSegmento] = useState('TODOS');
  const [apenasMultiplos, setApenasMultiplos] = useState(false);

  const carregarDados = () => {
    const m = GestaoLojistasService.obterMetricas();
    setMetricas(m);
    const ops = GestaoLojistasService.listarOperacoes({
      segmento: filtroSegmento,
      busca,
    });
    setOperacoes(ops);
    const perms = GestaoLojistasService.listarPermissionarios({
      apenasMultiplos,
      busca,
    });
    setPermissionarios(perms);
  };

  useEffect(() => {
    if (visible) {
      carregarDados();
    }
  }, [visible, abaAtiva, busca, filtroSegmento, apenasMultiplos]);

  if (!visible || !metricas) return null;

  const abrirWhatsApp = (numero: string, mensagem: string) => {
    const url = `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Corporativo */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <Text style={styles.headerBadge}>FASE L3.0 / L3.1 • GESTÃO CORPORATIVA</Text>
              <Text style={styles.headerTitle}>Central de Lojistas & Permissionários</Text>
              <Text style={styles.headerSubtitle}>
                Consolidação de operações, grupos econômicos e ocupação de múltiplos boxes
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Abas Superiores */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, abaAtiva === 'OPERACOES' && styles.tabBtnAtivo]}
              onPress={() => setAbaAtiva('OPERACOES')}
            >
              <Text style={[styles.tabBtnText, abaAtiva === 'OPERACOES' && styles.tabBtnTextAtivo]}>
                🏬 Operações & Lojas ({metricas.totalOperacoes})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, abaAtiva === 'PERMISSIONARIOS' && styles.tabBtnAtivo]}
              onPress={() => setAbaAtiva('PERMISSIONARIOS')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  abaAtiva === 'PERMISSIONARIOS' && styles.tabBtnTextAtivo,
                ]}
              >
                👤 Permissionários & Titulares ({metricas.totalPermissionarios})
              </Text>
            </TouchableOpacity>
          </View>

          {/* KPIs Analíticos */}
          <View style={styles.kpiContainer}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValor}>{metricas.totalOperacoes}</Text>
              <Text style={styles.kpiRotulo}>Operações Ativas</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValor, { color: '#38bdf8' }]}>
                {metricas.totalPermissionarios}
              </Text>
              <Text style={styles.kpiRotulo}>Titulares / Empresas</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValor, { color: '#10b981' }]}>
                {metricas.mediaPontosPorTitular}
              </Text>
              <Text style={styles.kpiRotulo}>Média Boxes/Titular</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValor, { color: '#f59e0b' }]}>
                {metricas.permissionariosMultiplosPontos}
              </Text>
              <Text style={styles.kpiRotulo}>Titulares Multi-Box</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiValor, { color: '#a855f7' }]}>
                {metricas.completudeMedia}%
              </Text>
              <Text style={styles.kpiRotulo}>Completude Média</Text>
            </View>
          </View>

          {/* Filtros e Busca */}
          <View style={styles.filterSection}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por box, marca, titular, CNPJ ou corredor..."
              placeholderTextColor="#64748b"
              value={busca}
              onChangeText={setBusca}
            />

            {abaAtiva === 'OPERACOES' ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {['TODOS', 'Moda Feminina', 'Jeanswear & Denim', 'Moda Infantil', 'Bijuterias e Bolsas', 'Moda Praia'].map(
                  (seg) => {
                    const ativo = filtroSegmento === seg;
                    return (
                      <TouchableOpacity
                        key={seg}
                        style={[styles.pillBtn, ativo && styles.pillBtnAtivo]}
                        onPress={() => setFiltroSegmento(seg)}
                      >
                        <Text style={[styles.pillBtnText, ativo && styles.pillBtnTextAtivo]}>
                          {seg === 'TODOS' ? 'Todos os Segmentos' : seg}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>
            ) : (
              <TouchableOpacity
                style={[styles.checkboxRow, apenasMultiplos && styles.checkboxRowAtivo]}
                onPress={() => setApenasMultiplos(!apenasMultiplos)}
              >
                <Text style={styles.checkboxIcon}>{apenasMultiplos ? '☑' : '☐'}</Text>
                <Text style={styles.checkboxText}>
                  Exibir apenas permissionários com múltiplos boxes (mais de 1 ponto)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Área de Conteúdo da Aba */}
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {abaAtiva === 'OPERACOES' ? (
              /* Listagem de Operações */
              <View style={styles.itemsGrid}>
                {operacoes.map((op) => (
                  <View key={op.idOperacao} style={styles.cardItem}>
                    <View style={styles.cardItemHeader}>
                      <View>
                        <View style={styles.boxTagsRow}>
                          {op.boxes.map((b) => (
                            <View key={b} style={styles.boxTag}>
                              <Text style={styles.boxTagText}>Box {b}</Text>
                            </View>
                          ))}
                          <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>● {op.status}</Text>
                          </View>
                        </View>
                        <Text style={styles.operacaoNome}>{op.nomeFantasia}</Text>
                        <Text style={styles.operacaoRazao}>{op.razaoSocial}</Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.metaRow}>
                      <Text style={styles.metaItemText}>
                        <Text style={styles.metaItemLabel}>Titular: </Text>
                        {op.nomePermissionario}
                      </Text>
                      <Text style={styles.metaItemText}>
                        <Text style={styles.metaItemLabel}>Segmento: </Text>
                        {op.segmento}
                      </Text>
                      <Text style={styles.metaItemText}>
                        <Text style={styles.metaItemLabel}>Local: </Text>
                        {op.setor} • {op.corredor}
                      </Text>
                      {op.campanhasAtivas.length > 0 && (
                        <Text style={[styles.metaItemText, { color: '#06b6d4' }]}>
                          📢 {op.campanhasAtivas.join(', ')}
                        </Text>
                      )}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={styles.btnSecondary}
                        onPress={() => onAbrirFicha360(op.idLojaMapa)}
                      >
                        <Text style={styles.btnSecondaryText}>🏬 Ficha 360°</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnSecondary}
                        onPress={() => onVerNoMapa(op.idLojaMapa, op.boxes[0])}
                      >
                        <Text style={styles.btnSecondaryText}>🗺️ Ver no Mapa</Text>
                      </TouchableOpacity>

                      {op.whatsapp && (
                        <TouchableOpacity
                          style={styles.btnWhatsApp}
                          onPress={() =>
                            abrirWhatsApp(
                              op.whatsapp,
                              `Olá, sou da administração do Centro Fashion falando sobre o Box ${op.boxes[0]} (${op.nomeFantasia}).`
                            )
                          }
                        >
                          <Text style={styles.btnWhatsAppText}>💬 WhatsApp</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              /* Listagem de Permissionários (L3.1) */
              <View style={styles.itemsGrid}>
                {permissionarios.map((perm) => (
                  <View key={perm.idPermissionario} style={styles.cardItem}>
                    <View style={styles.cardItemHeader}>
                      <View>
                        <View style={styles.permHeaderMeta}>
                          <Text style={styles.permDoc}>{perm.documento}</Text>
                          {perm.grupoEconomico && (
                            <View style={styles.grupoTag}>
                              <Text style={styles.grupoTagText}>🏢 {perm.grupoEconomico}</Text>
                            </View>
                          )}
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  perm.status === 'REGULAR'
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : 'rgba(245, 158, 11, 0.15)',
                                borderColor:
                                  perm.status === 'REGULAR' ? '#10b981' : '#f59e0b',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                { color: perm.status === 'REGULAR' ? '#10b981' : '#f59e0b' },
                              ]}
                            >
                              {perm.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.operacaoNome}>{perm.razaoSocial}</Text>
                        <Text style={styles.operacaoRazao}>
                          Responsável Legal: {perm.nomeResponsavel}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Boxes e Pontos Vinculados ao Permissionário */}
                    <View style={styles.pontosAgrupadosSection}>
                      <Text style={styles.pontosSectionTitle}>
                        Pontos Vinculados a este Titular ({perm.totalPontos} unidades):
                      </Text>
                      <View style={styles.pontosAgrupadosList}>
                        {perm.pontosOcupados.map((pt) => (
                          <View key={pt.numeroBox} style={styles.pontoOcupadoRow}>
                            <View style={styles.pontoBoxBadge}>
                              <Text style={styles.pontoBoxBadgeText}>Box {pt.numeroBox}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.pontoNomeOperacao}>{pt.nomeOperacao}</Text>
                              <Text style={styles.pontoLocal}>{pt.setor} • {pt.corredor}</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.btnVerPontoMapa}
                              onPress={() => onVerNoMapa(pt.idLojaMapa, pt.numeroBox)}
                            >
                              <Text style={styles.btnVerPontoMapaText}>📍 Mapa</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardActionsRow}>
                      <Text style={styles.contatoText}>
                        📞 {perm.telefone} • ✉️ {perm.email}
                      </Text>

                      {perm.whatsapp && (
                        <TouchableOpacity
                          style={styles.btnWhatsApp}
                          onPress={() =>
                            abrirWhatsApp(
                              perm.whatsapp,
                              `Olá ${perm.nomeResponsavel}, somos da diretoria comercial do Centro Fashion Fortaleza.`
                            )
                          }
                        >
                          <Text style={styles.btnWhatsAppText}>💬 WhatsApp Titular</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
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
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: Math.min(1040, width - 32),
    maxHeight: Math.min(820, height - 32),
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
  headerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1.2,
    marginBottom: 4,
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0b1329',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabBtnAtivo: {
    borderBottomColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  tabBtnTextAtivo: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  kpiContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    backgroundColor: '#131d36',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiValor: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 2,
  },
  kpiRotulo: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#0f172a',
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
    marginBottom: 10,
  },
  pillsScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkboxRowAtivo: {},
  checkboxIcon: {
    fontSize: 16,
    color: '#38bdf8',
  },
  checkboxText: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  scrollArea: {
    padding: 20,
  },
  itemsGrid: {
    gap: 14,
    paddingBottom: 24,
  },
  cardItem: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
  },
  cardItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  boxTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  boxTag: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  boxTagText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  statusBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  operacaoNome: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  operacaoRazao: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  metaRow: {
    gap: 4,
  },
  metaItemText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  metaItemLabel: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  btnSecondary: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnSecondaryText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '600',
  },
  btnWhatsApp: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnWhatsAppText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  permHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  permDoc: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  grupoTag: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  grupoTagText: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '700',
  },
  pontosAgrupadosSection: {
    backgroundColor: '#131d36',
    borderRadius: 10,
    padding: 12,
  },
  pontosSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  pontosAgrupadosList: {
    gap: 8,
  },
  pontoOcupadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 8,
  },
  pontoBoxBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pontoBoxBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  pontoNomeOperacao: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  pontoLocal: {
    color: '#94a3b8',
    fontSize: 11,
  },
  btnVerPontoMapa: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnVerPontoMapaText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  contatoText: {
    flex: 1,
    fontSize: 11,
    color: '#94a3b8',
  },
});
