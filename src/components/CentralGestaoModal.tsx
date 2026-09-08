import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { SignagePin } from './InteractiveMallMap';

interface CentralGestaoModalProps {
  visible: boolean;
  pins: SignagePin[];
  onClose: () => void;
  onSelectPin: (pin: SignagePin) => void;
  onEditPin: (pin: SignagePin) => void;
  onOpenPhotos: (pin: SignagePin) => void;
  onOpenAntesDepois: (pin: SignagePin) => void;
  onUpdateStatus?: (pinId: string, newStatus: string) => void;
}

export const CentralGestaoModal: React.FC<CentralGestaoModalProps> = ({
  visible,
  pins,
  onClose,
  onSelectPin,
  onEditPin,
  onOpenPhotos,
  onOpenAntesDepois,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'TODOS' | 'SINALIZACAO' | 'OCORRENCIA'>('TODOS');
  const [filterSector, setFilterSector] = useState<string>('TODOS');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [filterPriority, setFilterPriority] = useState<string>('TODOS');

  // Filtragem combinada
  const filteredPins = useMemo(() => {
    return pins.filter((p) => {
      // Busca textual
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches =
          p.assetCode.toLowerCase().includes(term) ||
          (p.notes && p.notes.toLowerCase().includes(term)) ||
          (p.humanLocation && p.humanLocation.toLowerCase().includes(term)) ||
          p.category.toLowerCase().includes(term) ||
          p.sector.toLowerCase().includes(term);
        if (!matches) return false;
      }

      // Tipo de entidade
      if (filterType === 'SINALIZACAO' && p.entityType === 'OCORRENCIA') return false;
      if (filterType === 'OCORRENCIA' && p.entityType !== 'OCORRENCIA') return false;

      // Setor
      if (filterSector !== 'TODOS' && p.sector !== filterSector) return false;

      // Status
      if (filterStatus !== 'TODOS' && p.status !== filterStatus) return false;

      // Prioridade
      if (filterPriority !== 'TODOS' && (p.priority || 'MEDIA') !== filterPriority) return false;

      return true;
    });
  }, [pins, searchTerm, filterType, filterSector, filterStatus, filterPriority]);

  // Estatísticas rápidas
  const stats = useMemo(() => {
    const total = pins.length;
    const ocorrencias = pins.filter((p) => p.entityType === 'OCORRENCIA').length;
    const sinalizacoes = total - ocorrencias;
    const emAtendimento = pins.filter((p) => p.status === 'EM_ANDAMENTO' || p.status === 'MANUTENCAO').length;
    const concluidos = pins.filter((p) => p.status === 'CONCLUIDA' || p.status === 'INATIVA').length;
    const criticas = pins.filter((p) => p.priority === 'CRITICA' || p.conservationState === 'Danificada').length;
    return { total, ocorrencias, sinalizacoes, emAtendimento, concluidos, criticas };
  }, [pins]);

  if (!visible) return null;

  // Exportar para CSV (Compatível com RelatorioExportacaoService.gs)
  const handleExportCSV = () => {
    if (Platform.OS !== 'web') return;

    const headers = [
      'ID',
      'CODIGO',
      'TIPO',
      'CATEGORIA',
      'SETOR',
      'STATUS',
      'CONSERVACAO',
      'PRIORIDADE',
      'LOCALIZACAO',
      'DESCRICAO',
      'PRAZO_HORAS',
      'CRIADO_EM',
    ];

    const rows = filteredPins.map((p) => [
      p.id,
      `"${p.assetCode}"`,
      p.entityType || 'SINALIZACAO',
      `"${p.category}"`,
      `"${p.sector}"`,
      p.status,
      `"${p.conservationState}"`,
      p.priority || 'MEDIA',
      `"${p.humanLocation || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`,
      p.prazoHoras || '',
      new Date().toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CentroFashion_Registros_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ATIVA':
      case 'CONCLUIDA':
        return { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' };
      case 'EM_ANDAMENTO':
      case 'MANUTENCAO':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
      case 'SUBSTITUIR':
      case 'REMOVER':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
    }
  };

  const getPriorityBadgeStyle = (priority?: string) => {
    switch (priority) {
      case 'CRITICA':
        return { bg: '#7F1D1D', text: '#FEF2F2' };
      case 'ALTA':
        return { bg: '#DC2626', text: '#FFFFFF' };
      case 'MEDIA':
        return { bg: '#F59E0B', text: '#FFFFFF' };
      case 'BAIXA':
        return { bg: '#10B981', text: '#FFFFFF' };
      default:
        return { bg: '#64748B', text: '#FFFFFF' };
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        {/* Top Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerIconText}>◎</Text>
            </View>
            <View>
              <Text style={styles.modalTitle}>Central de Gestão & Registros Operacionais</Text>
              <Text style={styles.modalSubtitle}>
                Visão tabular consolidada • Sinalizações, Ocorrências, Prazos de SLA e Ações Rápidas
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              id="exportarCsvBtn"
              style={styles.exportButton}
              onPress={handleExportCSV}
            >
              <Text style={styles.exportButtonText}>📥 Exportar Planilha (CSV)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              id="centralGestaoCloseBtn"
              style={styles.closeBtn}
              onPress={onClose}
              aria-label="Fechar"
            >
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick KPI Stats Header */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{stats.total}</Text>
            <Text style={styles.kpiLabel}>Total Cadastrado</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: '#3B82F6' }]}>
            <Text style={[styles.kpiValue, { color: '#1D4ED8' }]}>{stats.sinalizacoes}</Text>
            <Text style={styles.kpiLabel}>Sinalizações</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: '#F59E0B' }]}>
            <Text style={[styles.kpiValue, { color: '#B45309' }]}>{stats.ocorrencias}</Text>
            <Text style={styles.kpiLabel}>Ocorrências</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: '#F97316' }]}>
            <Text style={[styles.kpiValue, { color: '#C2410C' }]}>{stats.emAtendimento}</Text>
            <Text style={styles.kpiLabel}>Em Atendimento</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: '#10B981' }]}>
            <Text style={[styles.kpiValue, { color: '#047857' }]}>{stats.concluidos}</Text>
            <Text style={styles.kpiLabel}>Concluídos</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: '#EF4444' }]}>
            <Text style={[styles.kpiValue, { color: '#B91C1C' }]}>{stats.criticas}</Text>
            <Text style={styles.kpiLabel}>Críticos / Atenção</Text>
          </View>
        </View>

        {/* Filter Controls Bar */}
        <View style={styles.filterControlsBar}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              id="centralGestaoSearchInput"
              style={styles.searchInput}
              placeholder="Buscar por protocolo, categoria, localização, notas..."
              placeholderTextColor="#94A3B8"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearSearchBtn}>
                <Text style={styles.clearSearchBtnText}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsScroll}>
            {/* Tipo */}
            <View style={styles.filterButtonGroup}>
              <Text style={styles.filterGroupLabel}>Tipo:</Text>
              {(['TODOS', 'SINALIZACAO', 'OCORRENCIA'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.pillBtn, filterType === t && styles.pillBtnActive]}
                  onPress={() => setFilterType(t)}
                >
                  <Text style={[styles.pillBtnText, filterType === t && styles.pillBtnTextActive]}>
                    {t === 'TODOS' ? 'Todos' : t === 'SINALIZACAO' ? '🏷️ Sinalização' : '⚠️ Ocorrência'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Setor */}
            <View style={styles.filterButtonGroup}>
              <Text style={styles.filterGroupLabel}>Setor:</Text>
              {[
                { key: 'TODOS', label: 'Todos' },
                { key: 'SETOR_AZUL', label: 'Azul' },
                { key: 'SETOR_AMARELO', label: 'Amarelo' },
                { key: 'SETOR_VERDE', label: 'Verde' },
                { key: 'SETOR_VERMELHO', label: 'Vermelho' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.pillBtn, filterSector === s.key && styles.pillBtnActive]}
                  onPress={() => setFilterSector(s.key)}
                >
                  <Text style={[styles.pillBtnText, filterSector === s.key && styles.pillBtnTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status */}
            <View style={styles.filterButtonGroup}>
              <Text style={styles.filterGroupLabel}>Status:</Text>
              {[
                { key: 'TODOS', label: 'Todos' },
                { key: 'ATIVA', label: 'Ativa' },
                { key: 'EM_ANDAMENTO', label: 'Em Andamento' },
                { key: 'MANUTENCAO', label: 'Manutenção' },
                { key: 'CONCLUIDA', label: 'Concluída' },
              ].map((st) => (
                <TouchableOpacity
                  key={st.key}
                  style={[styles.pillBtn, filterStatus === st.key && styles.pillBtnActive]}
                  onPress={() => setFilterStatus(st.key)}
                >
                  <Text style={[styles.pillBtnText, filterStatus === st.key && styles.pillBtnTextActive]}>
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Table Content */}
        <View style={styles.tableCard}>
          {/* Table Header Row */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.thText, { width: 70 }]}>Foto</Text>
            <Text style={[styles.thText, { width: 140 }]}>Código / Tipo</Text>
            <Text style={[styles.thText, { flex: 1.2 }]}>Categoria & Detalhes</Text>
            <Text style={[styles.thText, { width: 150 }]}>Localização</Text>
            <Text style={[styles.thText, { width: 120 }]}>Status / SLA</Text>
            <Text style={[styles.thText, { width: 180, textAlign: 'center' }]}>Ações Rápidas</Text>
          </View>

          {/* Table Body */}
          <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={true}>
            {filteredPins.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>Nenhum registro encontrado</Text>
                <Text style={styles.emptySubtitle}>Tente ajustar os filtros ou termos da pesquisa acima.</Text>
              </View>
            ) : (
              filteredPins.map((item, index) => {
                const statusStyle = getStatusBadgeStyle(item.status);
                const priorityStyle = getPriorityBadgeStyle(item.priority);
                const thumbUri = item.photos?.[0]?.localUri;
                const isOcorrencia = item.entityType === 'OCORRENCIA';

                return (
                  <View
                    key={item.id}
                    id={`registro-row-${item.id}`}
                    style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
                  >
                    {/* Foto / Miniatura */}
                    <View style={{ width: 70, justifyContent: 'center' }}>
                      {thumbUri ? (
                        <TouchableOpacity onPress={() => onOpenPhotos(item)}>
                          <Image source={{ uri: thumbUri }} style={styles.thumbnail} />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.thumbnailPlaceholder}>
                          <Text style={styles.thumbnailPlaceholderText}>
                            {isOcorrencia ? '⚠️' : '🏷️'}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Código & Tipo */}
                    <View style={{ width: 140, justifyContent: 'center' }}>
                      <Text style={styles.rowAssetCode}>{item.assetCode}</Text>
                      <View style={styles.entityTypeBadge}>
                        <Text style={styles.entityTypeText}>
                          {isOcorrencia ? 'OCORRÊNCIA' : 'SINALIZAÇÃO'}
                        </Text>
                      </View>
                      {item.priority && (
                        <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
                          <Text style={[styles.priorityBadgeText, { color: priorityStyle.text }]}>
                            {item.priority}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Categoria & Detalhes */}
                    <View style={{ flex: 1.2, justifyContent: 'center', paddingRight: 10 }}>
                      <View style={styles.categoryRow}>
                        {item.categoryColor && (
                          <View
                            style={[styles.categoryDot, { backgroundColor: item.categoryColor }]}
                          />
                        )}
                        <Text style={styles.rowCategory}>{item.category}</Text>
                      </View>
                      <Text style={styles.rowNotes} numberOfLines={2}>
                        {item.notes || 'Sem observações adicionais.'}
                      </Text>
                      {item.responsible && (
                        <Text style={styles.rowResponsible} numberOfLines={1}>
                          👤 {item.responsible}
                        </Text>
                      )}
                    </View>

                    {/* Localização */}
                    <View style={{ width: 150, justifyContent: 'center' }}>
                      <Text style={styles.rowSector}>{item.sector}</Text>
                      <Text style={styles.rowLocation} numberOfLines={2}>
                        {item.humanLocation || `X: ${(item.normalizedX * 100).toFixed(1)}% | Y: ${(item.normalizedY * 100).toFixed(1)}%`}
                      </Text>
                    </View>

                    {/* Status & SLA */}
                    <View style={{ width: 120, justifyContent: 'center' }}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: statusStyle.bg,
                            borderColor: statusStyle.border,
                          },
                        ]}
                      >
                        <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                          {item.status}
                        </Text>
                      </View>
                      {item.prazoHoras && (
                        <Text style={styles.rowSla}>
                          ⏱️ SLA: {item.prazoHoras}h
                        </Text>
                      )}
                    </View>

                    {/* Ações Rápidas */}
                    <View style={styles.actionsCell}>
                      <TouchableOpacity
                        style={styles.actionBtnMap}
                        onPress={() => {
                          onSelectPin(item);
                          onClose();
                        }}
                        aria-label="Ver no mapa"
                      >
                        <Text style={styles.actionBtnMapText}>📍 Ver no Mapa</Text>
                      </TouchableOpacity>

                      <View style={styles.secondaryActionsRow}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => onEditPin(item)}
                          aria-label="Editar"
                        >
                          <Text style={styles.actionIconText}>✏️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => onOpenPhotos(item)}
                          aria-label="Fotos"
                        >
                          <Text style={styles.actionIconText}>📸</Text>
                        </TouchableOpacity>

                        {(item.concludedPhotoUrl || (item.photos && item.photos.length >= 2)) && (
                          <TouchableOpacity
                            style={[styles.actionIconBtn, { backgroundColor: '#EDE9FE' }]}
                            onPress={() => onOpenAntesDepois(item)}
                            aria-label="Antes e Depois"
                          >
                            <Text style={styles.actionIconText}>🔄</Text>
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

        {/* Footer Bar */}
        <View style={styles.modalFooter}>
          <Text style={styles.footerInfoText}>
            Exibindo <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{filteredPins.length}</Text> de {pins.length} registros cadastrados no sistema.
          </Text>
          <TouchableOpacity style={styles.footerCloseBtn} onPress={onClose}>
            <Text style={styles.footerCloseBtnText}>Fechar Central</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    zIndex: 160,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 1200,
    height: '92%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 20,
    flexDirection: 'column',
  },
  modalHeader: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 22,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 22,
  },

  /* KPI Row */
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#64748B',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },

  /* Filter Controls Bar */
  filterControlsBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchBtnText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  filterPillsScroll: {
    flexDirection: 'row',
  },
  filterButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    gap: 6,
  },
  filterGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginRight: 4,
  },
  pillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  pillBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  pillBtnTextActive: {
    color: '#FFFFFF',
  },

  /* Table Card */
  tableCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },

  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  thumbnailPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 20,
  },

  rowAssetCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  entityTypeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  entityTypeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  priorityBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rowCategory: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  rowNotes: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  rowResponsible: {
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 2,
  },

  rowSector: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  rowLocation: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rowSla: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 3,
  },

  actionsCell: {
    width: 180,
    alignItems: 'center',
    gap: 6,
  },
  actionBtnMap: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  actionBtnMapText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 14,
  },

  emptyContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  /* Modal Footer */
  modalFooter: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfoText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerCloseBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  footerCloseBtnText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
});
