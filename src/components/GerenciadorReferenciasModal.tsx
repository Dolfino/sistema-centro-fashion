import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  PontoReferenciaOficial,
  CartografiaService,
  CORES_PADRAO_TIPOS_REFERENCIA,
  NOMES_PADRAO_TIPOS_REFERENCIA,
} from '../services/cartografiaService';

interface GerenciadorReferenciasModalProps {
  visible: boolean;
  onClose: () => void;
  selectedMapKey: string;
  referencias: PontoReferenciaOficial[];
  coresReferencias?: Record<string, string>;
  onAdicionarNova: () => void;
  onEditarReferencia: (ref: PontoReferenciaOficial) => void;
  onExcluirReferencia: (id: string) => void;
  onFocarNoMapa?: (ref: PontoReferenciaOficial) => void;
  onRestaurarPadrao?: () => void;
}

export const GerenciadorReferenciasModal: React.FC<GerenciadorReferenciasModalProps> = ({
  visible,
  onClose,
  selectedMapKey,
  referencias,
  coresReferencias,
  onAdicionarNova,
  onEditarReferencia,
  onExcluirReferencia,
  onFocarNoMapa,
  onRestaurarPadrao,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;

  const [busca, setBusca] = useState<string>('');
  const [filtroSetor, setFiltroSetor] = useState<string>(selectedMapKey || 'TODOS');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');

  // Mapeamento amigável de setores
  const NOMES_SETORES: Record<string, string> = {
    'MAP-CFF-N1-AZUL': 'Setor Azul',
    SETOR_AZUL: 'Setor Azul',
    'MAP-CFF-N1-VERDE': 'Setor Verde',
    SETOR_VERDE: 'Setor Verde',
    'MAP-CFF-N2-AMARELO': 'Setor Amarelo',
    SETOR_AMARELO: 'Setor Amarelo',
    'MAP-CFF-N3-ROXO': 'Setor Roxo',
    SETOR_ROXO: 'Setor Roxo',
    'MAP-CFF-N2-BRANCO': 'Setor Branco',
    SETOR_BRANCO: 'Setor Branco',
    'PLA-CFF-N1-2025': 'Nível 1 (Azul + Verde)',
    NIVEL_1: 'Nível 1 (Azul + Verde)',
    'PLA-CFF-N2-2025': 'Nível 2 (Amarelo + Branco)',
    NIVEL_2: 'Nível 2 (Amarelo + Branco)',
    'PLA-CFF-N3-2025': 'Nível 3 (Roxo + Vermelho)',
    NIVEL_3: 'Nível 3 (Roxo + Vermelho)',
    'PLA-CFF-N0-2025': 'Nível 0 (Subsolo)',
    NIVEL_0: 'Nível 0 (Subsolo)',
  };

  const listaFiltrada = useMemo(() => {
    return referencias.filter((ref) => {
      // Filtro de busca
      if (busca.trim()) {
        const termo = busca.toLowerCase().trim();
        const matchNome = (ref.nome || '').toLowerCase().includes(termo);
        const matchDesc = (ref.descricao || '').toLowerCase().includes(termo);
        const matchSubtipo = (ref.subtipo || '').toLowerCase().includes(termo);
        if (!matchNome && !matchDesc && !matchSubtipo) return false;
      }

      // Filtro de setor
      if (filtroSetor !== 'TODOS') {
        const targetId = CartografiaService.normalizarIdMapaSetor(filtroSetor);
        if (ref.idMapaSetor !== targetId && ref.idMapaSetor !== filtroSetor) return false;
      }

      // Filtro de tipo
      if (filtroTipo !== 'TODOS') {
        const t = (ref.tipo || 'OUTRO').toUpperCase();
        if (t !== filtroTipo) return false;
      }

      return true;
    });
  }, [referencias, busca, filtroSetor, filtroTipo]);

  // Contadores por tipo no total
  const estatisticasTipos = useMemo(() => {
    const map: Record<string, number> = {};
    referencias.forEach((r) => {
      const t = (r.tipo || 'OUTRO').toUpperCase();
      map[t] = (map[t] || 0) + 1;
    });
    return map;
  }, [referencias]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <View style={styles.badgeOficial}>
                <Text style={styles.badgeOficialText}>Superfície #33 • Cartografia Oficial</Text>
              </View>
              <Text style={{ fontSize: 11, color: '#64748b' }}>
                {referencias.length} referências ativas
              </Text>
            </View>
            <Text style={styles.title}>📍 Gestão de Referências Cartográficas</Text>
            <Text style={styles.subtitle}>
              Adicione, edite, exclua e configure pontos notáveis de orientação espacial no mall
            </Text>
          </View>
          <TouchableOpacity id="fecharGerenciadorRef" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Barra de estatísticas resumidas com pílulas temáticas */}
        <View style={styles.statsBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
            {Object.entries(NOMES_PADRAO_TIPOS_REFERENCIA).map(([tipoKey, nomeLabel]) => {
              const count = estatisticasTipos[tipoKey] || 0;
              const cor = CartografiaService.obterCorTipoReferencia(tipoKey, coresReferencias);
              const isSelected = filtroTipo === tipoKey;

              return (
                <TouchableOpacity
                  key={tipoKey}
                  style={[
                    styles.pillTipo,
                    isSelected && { borderColor: cor, backgroundColor: '#f8fafc', elevation: 2 },
                  ]}
                  onPress={() => setFiltroTipo(isSelected ? 'TODOS' : tipoKey)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.pillDot, { backgroundColor: cor }]} />
                  <Text style={[styles.pillText, isSelected && { fontWeight: '700', color: '#0f172a' }]}>
                    {nomeLabel}
                  </Text>
                  <View style={[styles.pillBadge, { backgroundColor: cor }]}>
                    <Text style={styles.pillBadgeText}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Barra de Filtros, Busca e Botão + Nova Referência */}
        <View style={styles.controlsRow}>
          <View style={styles.searchBox}>
            <Text style={{ fontSize: 14, marginRight: 6 }}>🔍</Text>
            <TextInput
              id="buscaReferenciaInput"
              style={styles.searchInput}
              placeholder="Buscar referência por nome, tipo ou corredor..."
              placeholderTextColor="#94a3b8"
              value={busca}
              onChangeText={setBusca}
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={() => setBusca('')} style={{ padding: 4 }}>
                <Text style={{ fontSize: 13, color: '#94a3b8' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {Platform.OS === 'web' && (
            <select
              id="filtroSetorRefSelect"
              value={filtroSetor}
              onChange={(e) => setFiltroSetor(e.target.value)}
              style={webSelectCompactStyle}
            >
              <option value="TODOS">Todos os setores</option>
              <optgroup label="Setores">
                <option value="SETOR_AZUL">Setor Azul (Piso 1)</option>
                <option value="SETOR_VERDE">Setor Verde (Piso 1)</option>
                <option value="SETOR_BRANCO">Setor Branco (Piso 2)</option>
                <option value="SETOR_AMARELO">Setor Amarelo (Piso 2)</option>
                <option value="SETOR_ROXO">Setor Roxo (Piso 3)</option>
              </optgroup>
              <optgroup label="Níveis 2025">
                <option value="NIVEL_1">Nível 1 — Azul + Verde</option>
                <option value="NIVEL_2">Nível 2 — Amarelo + Branco</option>
                <option value="NIVEL_3">Nível 3 — Roxo + Vermelho / Estacionamento</option>
                <option value="NIVEL_0">Nível 0 — Subsolo</option>
              </optgroup>
            </select>
          )}

          <TouchableOpacity
            id="btnNovaReferenciaModal"
            style={styles.btnNovaRef}
            onPress={() => {
              onClose();
              onAdicionarNova();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.btnNovaRefText}>+ Nova Referência</Text>
          </TouchableOpacity>

          {onRestaurarPadrao && (
            <TouchableOpacity
              id="btnRestaurarPadraoRef"
              style={styles.btnRestaurarPadrao}
              onPress={() => {
                if (
                  typeof window !== 'undefined' &&
                  window.confirm &&
                  !window.confirm('Restaurar todas as referências para os dados de fábrica?')
                ) {
                  return;
                }
                onRestaurarPadrao();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnRestaurarPadraoText}>Restaurar padrão</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista / Tabela com as Referências */}
        <ScrollView style={styles.listArea} contentContainerStyle={{ paddingBottom: 20 }}>
          {listaFiltrada.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📍</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>
                Nenhuma referência encontrada
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b', marginTop: 4, textAlign: 'center' }}>
                {busca
                  ? 'Nenhum ponto corresponde aos termos da pesquisa.'
                  : 'Nenhum ponto cadastrado para os filtros selecionados.'}
              </Text>
              <TouchableOpacity
                style={[styles.btnNovaRef, { marginTop: 14 }]}
                onPress={() => {
                  onClose();
                  onAdicionarNova();
                }}
              >
                <Text style={styles.btnNovaRefText}>+ Adicionar Ponto de Referência</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {listaFiltrada.map((ref) => {
                const tipoKey = (ref.tipo || 'OUTRO').toUpperCase();
                const cor = CartografiaService.obterCorTipoReferencia(tipoKey, coresReferencias);
                const nomeTipo = NOMES_PADRAO_TIPOS_REFERENCIA[tipoKey] || tipoKey;
                const nomeSetor = NOMES_SETORES[ref.idMapaSetor] || ref.idMapaSetor;

                return (
                  <View key={ref.id} id={`item-ref-${ref.id}`} style={styles.refCard}>
                    {/* Ícone cartográfico oficial com a cor real do tipo */}
                    <View style={styles.refMarkerBox}>
                      <View style={styles.refMarkerOuter}>
                        <View style={[styles.refMarkerInner, { backgroundColor: cor }]} />
                      </View>
                    </View>

                    {/* Informações centrais */}
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <Text style={styles.refNome}>{ref.nome}</Text>
                        <View style={[styles.badgeTipo, { backgroundColor: `${cor}20`, borderColor: cor }]}>
                          <View style={[styles.badgeTipoDot, { backgroundColor: cor }]} />
                          <Text style={[styles.badgeTipoText, { color: cor }]}>{nomeTipo}</Text>
                        </View>
                        {ref.subtipo && (
                          <View style={styles.badgeSubtipo}>
                            <Text style={styles.badgeSubtipoText}>{ref.subtipo}</Text>
                          </View>
                        )}
                        <View
                          style={[
                            styles.badgeStatus,
                            ref.status === 'VALIDADO' ? styles.badgeStatusVal : styles.badgeStatusSug,
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeStatusText,
                              ref.status === 'VALIDADO' ? { color: '#059669' } : { color: '#d97706' },
                            ]}
                          >
                            {ref.status || 'VALIDADO'}
                          </Text>
                        </View>
                      </View>

                      {ref.descricao ? (
                        <Text style={styles.refDesc} numberOfLines={2}>
                          {ref.descricao}
                        </Text>
                      ) : null}

                      <Text style={styles.refLocalizacao}>
                        {nomeSetor} • Coordenadas: X: {(ref.x * 100).toFixed(1)}% | Y: {(ref.y * 100).toFixed(1)}%
                      </Text>
                    </View>

                    {/* Ações Rápidas: Focar, Editar, Excluir */}
                    <View style={styles.actionsCol}>
                      {onFocarNoMapa && (
                        <TouchableOpacity
                          id={`btn-focar-${ref.id}`}
                          style={styles.actionBtnFocar}
                          onPress={() => onFocarNoMapa(ref)}
                          accessibilityLabel="Focar no mapa"
                        >
                          <Text style={styles.actionBtnText}>🎯 Mapa</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        id={`btn-editar-${ref.id}`}
                        style={styles.actionBtnEditar}
                        onPress={() => onEditarReferencia(ref)}
                        accessibilityLabel="Editar ponto"
                      >
                        <Text style={styles.actionBtnText}>✏️ Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        id={`btn-excluir-${ref.id}`}
                        style={styles.actionBtnExcluir}
                        onPress={() => {
                          if (
                            typeof window !== 'undefined' &&
                            window.confirm &&
                            !window.confirm(`Excluir permanentemente a referência "${ref.nome}"?`)
                          ) {
                            return;
                          }
                          onExcluirReferencia(ref.id);
                        }}
                        accessibilityLabel="Excluir referência"
                      >
                        <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 12, color: '#64748b' }}>
            Mostrando {listaFiltrada.length} de {referencias.length} referências
          </Text>
          <TouchableOpacity style={styles.btnFecharRodape} onPress={onClose}>
            <Text style={styles.btnFecharRodapeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const webSelectCompactStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '13px',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  outline: 'none',
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    zIndex: 400,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: 920,
    maxWidth: '96%',
    maxHeight: '92%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalBoxMobile: {
    width: '100%',
    maxHeight: '98%',
    borderRadius: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  badgeOficial: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeOficialText: {
    color: '#1e40af',
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#64748b',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  closeBtnText: {
    fontSize: 18,
    color: '#64748b',
    lineHeight: 20,
    fontWeight: '600',
  },
  statsBar: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pillTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  pillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  pillBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10,
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    outlineStyle: 'none',
  } as any,
  btnNovaRef: {
    backgroundColor: '#e11d48',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  btnNovaRefText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  btnRestaurarPadrao: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnRestaurarPadraoText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  listArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  refMarkerBox: {
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refMarkerOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10144d',
    borderColor: '#ffffff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  refMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  refNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  badgeTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  badgeTipoDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  badgeTipoText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  badgeSubtipo: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeSubtipoText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  badgeStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeStatusVal: {
    backgroundColor: '#ecfdf5',
  },
  badgeStatusSug: {
    backgroundColor: '#fffbeb',
  },
  badgeStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  refDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 3,
  },
  refLocalizacao: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 3,
    fontWeight: '500',
  },
  actionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnFocar: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionBtnEditar: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  actionBtnExcluir: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  btnFecharRodape: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
  },
  btnFecharRodapeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
});
