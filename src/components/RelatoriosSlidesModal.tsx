import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { SignagePin } from './InteractiveMallMap';

interface RelatoriosSlidesModalProps {
  visible: boolean;
  pins: SignagePin[];
  onClose: () => void;
  onSelectPin?: (pin: SignagePin) => void;
}

export const RelatoriosSlidesModal: React.FC<RelatoriosSlidesModalProps> = ({
  visible,
  pins,
  onClose,
  onSelectPin,
}) => {
  const [activeTab, setActiveTab] = useState<'SLIDES' | 'DOSSIE' | 'EXPORTAR'>('SLIDES');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedPinForDossie, setSelectedPinForDossie] = useState<SignagePin | null>(() => pins[0] || null);

  // Setores agrupados
  const pinsPorSetor = useMemo(() => {
    const map: { [setor: string]: SignagePin[] } = {};
    pins.forEach((p) => {
      const s = p.sector || 'SETOR_AZUL';
      if (!map[s]) map[s] = [];
      map[s].push(p);
    });
    return map;
  }, [pins]);

  // Slides estruturados de acordo com o RelatorioAuditoriaMidiaSlidesService.gs
  const slides = useMemo(() => {
    const deck: {
      id: string;
      tipo: 'CAPA' | 'DIVISORIA' | 'REGISTROS' | 'RESUMO' | 'ENCERRAMENTO';
      titulo?: string;
      subtitulo?: string;
      setor?: string;
      itens?: SignagePin[];
    }[] = [];

    // Slide 1: Capa Executiva
    deck.push({
      id: 'slide_capa',
      tipo: 'CAPA',
      titulo: 'Relatório Executivo & Auditoria Visual',
      subtitulo: 'Centro Fashion Fortaleza • Sinalização, Comunicação Visual e Ocorrências',
    });

    // Slides por Setor
    Object.keys(pinsPorSetor).forEach((setor) => {
      const pinsDoSetor = pinsPorSetor[setor];

      // Divisória do Setor
      deck.push({
        id: `slide_div_${setor}`,
        tipo: 'DIVISORIA',
        setor,
        titulo: setor.replace('_', ' '),
        subtitulo: `${pinsDoSetor.length} pontos cadastrados e auditados`,
      });

      // Lotes de 2 a 3 registros por slide
      for (let i = 0; i < pinsDoSetor.length; i += 2) {
        deck.push({
          id: `slide_reg_${setor}_${i}`,
          tipo: 'REGISTROS',
          setor,
          itens: pinsDoSetor.slice(i, i + 2),
        });
      }
    });

    // Slide Resumo de Indicadores
    deck.push({
      id: 'slide_resumo',
      tipo: 'RESUMO',
      titulo: 'Resumo Gerencial de Conformidade & SLA',
    });

    // Slide Encerramento
    deck.push({
      id: 'slide_encerramento',
      tipo: 'ENCERRAMENTO',
      titulo: 'Centro Fashion Fortaleza',
      subtitulo: 'Diretoria de Operações • Gestão de Mídias e Mall',
    });

    return deck;
  }, [pinsPorSetor]);

  if (!visible) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Impressão nativa do dossiê formatado em PDF
  const handlePrintDossie = () => {
    if (Platform.OS === 'web') {
      window.print();
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        {/* Top Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerIconText}>📊</Text>
            </View>
            <View>
              <Text style={styles.modalTitle}>Central de Relatórios Executivos & Slides</Text>
              <Text style={styles.modalSubtitle}>
                Apresentações fotográficas executivas, dossiês de ocorrência e exportações
              </Text>
            </View>
          </View>

          <View style={styles.headerTabs}>
            <TouchableOpacity
              style={[styles.headerTabBtn, activeTab === 'SLIDES' && styles.headerTabBtnActive]}
              onPress={() => setActiveTab('SLIDES')}
            >
              <Text style={[styles.headerTabBtnText, activeTab === 'SLIDES' && styles.headerTabBtnTextActive]}>
                🖥️ Apresentação em Slides
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerTabBtn, activeTab === 'DOSSIE' && styles.headerTabBtnActive]}
              onPress={() => setActiveTab('DOSSIE')}
            >
              <Text style={[styles.headerTabBtnText, activeTab === 'DOSSIE' && styles.headerTabBtnTextActive]}>
                📄 Dossiê Fotográfico (PDF)
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} aria-label="Fechar">
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* ================= ABA 1: APRESENTAÇÃO EM SLIDES ================= */}
        {activeTab === 'SLIDES' && (
          <View style={styles.slidesLayoutContainer}>
            {/* Viewport do Slide (16:9 Aspect Ratio) */}
            <View style={styles.slideViewportContainer}>
              <View style={styles.slideCanvas}>
                {/* LAYOUT: CAPA */}
                {currentSlide.tipo === 'CAPA' && (
                  <View style={styles.slideCapa}>
                    <View style={styles.slideBrandBox}>
                      <Text style={styles.slideBrandLogo}>CENTRO FASHION</Text>
                      <Text style={styles.slideBrandCity}>FORTALEZA</Text>
                    </View>
                    <Text style={styles.slideCapaTitle}>{currentSlide.titulo}</Text>
                    <Text style={styles.slideCapaSubtitle}>{currentSlide.subtitulo}</Text>

                    <View style={styles.slideCapaMetaBox}>
                      <Text style={styles.slideCapaMetaText}>
                        🗓️ <Text style={{ fontWeight: 'bold' }}>Período de Referência:</Text> Setembro / 2026
                      </Text>
                      <Text style={styles.slideCapaMetaText}>
                        👤 <Text style={{ fontWeight: 'bold' }}>Elaborado por:</Text> Coordenadoria de Operações & Infraestrutura
                      </Text>
                      <Text style={styles.slideCapaMetaText}>
                        📍 <Text style={{ fontWeight: 'bold' }}>Empreendimento:</Text> Av. Filomeno Gomes, 430 — Jacarecanga
                      </Text>
                    </View>
                  </View>
                )}

                {/* LAYOUT: DIVISÓRIA DE SETOR */}
                {currentSlide.tipo === 'DIVISORIA' && (
                  <View style={styles.slideDivisoria}>
                    <View style={styles.slideDivisoriaPill}>
                      <Text style={styles.slideDivisoriaPillText}>SEÇÃO CARTOGRÁFICA</Text>
                    </View>
                    <Text style={styles.slideDivisoriaTitle}>{currentSlide.titulo}</Text>
                    <Text style={styles.slideDivisoriaSubtitle}>{currentSlide.subtitulo}</Text>
                    <View style={styles.slideDivisoriaLine} />
                  </View>
                )}

                {/* LAYOUT: REGISTROS FOTOGRÁFICOS */}
                {currentSlide.tipo === 'REGISTROS' && (
                  <View style={styles.slideRegistros}>
                    <View style={styles.slideTopBar}>
                      <Text style={styles.slideTopBarSector}>
                        📍 {currentSlide.setor?.replace('_', ' ')}
                      </Text>
                      <Text style={styles.slideTopBarPagination}>
                        Slide {currentSlideIndex + 1} de {slides.length}
                      </Text>
                    </View>

                    <View style={styles.slideCardsGrid}>
                      {(currentSlide.itens || []).map((item) => {
                        const thumbUri = item.photos?.[0]?.localUri;
                        const isOcorrencia = item.entityType === 'OCORRENCIA';

                        return (
                          <View key={item.id} style={styles.slideRecordCard}>
                            <View style={styles.slideRecordPhotoBox}>
                              {thumbUri ? (
                                <Image source={{ uri: thumbUri }} style={styles.slideRecordPhoto} />
                              ) : (
                                <View style={styles.slideRecordPhotoPlaceholder}>
                                  <Text style={{ fontSize: 32 }}>{isOcorrencia ? '⚠️' : '🏷️'}</Text>
                                  <Text style={styles.placeholderLabel}>Evidência em Campo</Text>
                                </View>
                              )}
                              <View style={styles.slideRecordBadgeOverlay}>
                                <Text style={styles.slideRecordBadgeOverlayText}>{item.assetCode}</Text>
                              </View>
                            </View>

                            <View style={styles.slideRecordContent}>
                              <View style={styles.recordCategoryRow}>
                                <Text style={styles.recordCategoryTitle}>{item.category}</Text>
                                <Text style={styles.recordStatusTag}>{item.status}</Text>
                              </View>

                              <Text style={styles.recordLocationText}>
                                📍 {item.humanLocation || 'Localização no Mall'}
                              </Text>

                              <Text style={styles.recordNotesText} numberOfLines={3}>
                                {item.notes || 'Sem observações adicionais.'}
                              </Text>

                              {item.concludedAt && (
                                <View style={styles.recordConcludedBox}>
                                  <Text style={styles.recordConcludedText}>
                                    ✓ Resolvido em {item.concludedAt} por {item.concludedBy || 'Equipe'}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* LAYOUT: RESUMO EXECUTIVO */}
                {currentSlide.tipo === 'RESUMO' && (
                  <View style={styles.slideResumo}>
                    <Text style={styles.slideResumoHeaderTitle}>Painel Executivo de Conformidade</Text>
                    <Text style={styles.slideResumoHeaderSub}>
                      Indicadores Consolidados de Vistorias e Ocorrências
                    </Text>

                    <View style={styles.resumoKpiGrid}>
                      <View style={styles.resumoKpiBox}>
                        <Text style={styles.resumoKpiVal}>{pins.length}</Text>
                        <Text style={styles.resumoKpiLbl}>Total de Pontos Auditados</Text>
                      </View>
                      <View style={[styles.resumoKpiBox, { borderLeftColor: '#10B981' }]}>
                        <Text style={[styles.resumoKpiVal, { color: '#047857' }]}>
                          {pins.filter((p) => p.status === 'ATIVA' || p.status === 'CONCLUIDA').length}
                        </Text>
                        <Text style={styles.resumoKpiLbl}>Conformes / Concluídos</Text>
                      </View>
                      <View style={[styles.resumoKpiBox, { borderLeftColor: '#F59E0B' }]}>
                        <Text style={[styles.resumoKpiVal, { color: '#B45309' }]}>
                          {pins.filter((p) => p.status === 'EM_ANDAMENTO' || p.status === 'MANUTENCAO').length}
                        </Text>
                        <Text style={styles.resumoKpiLbl}>Em Atendimento Operacional</Text>
                      </View>
                      <View style={[styles.resumoKpiBox, { borderLeftColor: '#EF4444' }]}>
                        <Text style={[styles.resumoKpiVal, { color: '#B91C1C' }]}>
                          {pins.filter((p) => p.priority === 'CRITICA' || p.conservationState === 'Danificada').length}
                        </Text>
                        <Text style={styles.resumoKpiLbl}>Atenção / Reparo Urgente</Text>
                      </View>
                    </View>

                    <View style={styles.resumoComplianceBanner}>
                      <Text style={styles.compliancePct}>94.2%</Text>
                      <View>
                        <Text style={styles.complianceTitle}>Índice Geral de Disponibilidade da Sinalização</Text>
                        <Text style={styles.complianceSub}>Meta operacional: 92.0% • Status: Superada</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* LAYOUT: ENCERRAMENTO */}
                {currentSlide.tipo === 'ENCERRAMENTO' && (
                  <View style={styles.slideEncerramento}>
                    <Text style={styles.slideEncerramentoTitle}>{currentSlide.titulo}</Text>
                    <Text style={styles.slideEncerramentoSubtitle}>{currentSlide.subtitulo}</Text>
                    <View style={styles.slideEncerramentoContact}>
                      <Text style={styles.slideContactLine}>🌐 www.centrofashion.com.br</Text>
                      <Text style={styles.slideContactLine}>📞 Central de Operações do Mall (CEOP)</Text>
                      <Text style={styles.slideContactLine}>Fortaleza — Ceará</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Controles de Navegação de Slide */}
              <View style={styles.slideControlsBar}>
                <TouchableOpacity
                  id="slidePrevBtn"
                  style={[styles.btnSlideNav, currentSlideIndex === 0 && styles.btnSlideNavDisabled]}
                  disabled={currentSlideIndex === 0}
                  onPress={handlePrevSlide}
                >
                  <Text style={styles.btnSlideNavText}>◀ Slide Anterior</Text>
                </TouchableOpacity>

                {/* Indicador de Bolinhas / Thumbnails Rápidos */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dotsScroll}>
                  {slides.map((_, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.dotBtn, currentSlideIndex === idx && styles.dotBtnActive]}
                      onPress={() => setCurrentSlideIndex(idx)}
                    >
                      <Text
                        style={[
                          styles.dotText,
                          currentSlideIndex === idx && styles.dotTextActive,
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  id="slideNextBtn"
                  style={[
                    styles.btnSlideNav,
                    currentSlideIndex === slides.length - 1 && styles.btnSlideNavDisabled,
                  ]}
                  disabled={currentSlideIndex === slides.length - 1}
                  onPress={handleNextSlide}
                >
                  <Text style={styles.btnSlideNavText}>Próximo Slide ▶</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ================= ABA 2: DOSSIÊ FOTOGRÁFICO IMPRESSO (PDF) ================= */}
        {activeTab === 'DOSSIE' && (
          <View style={styles.dossieLayout}>
            {/* Seletor de Registro Lateral */}
            <View style={styles.dossieSidebar}>
              <Text style={styles.dossieSidebarTitle}>Selecione o Registro:</Text>
              <ScrollView style={{ flex: 1 }}>
                {pins.map((p) => {
                  const isSelected = selectedPinForDossie?.id === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.dossieItemSelect, isSelected && styles.dossieItemSelectActive]}
                      onPress={() => setSelectedPinForDossie(p)}
                    >
                      <Text style={[styles.dossieItemCode, isSelected && { color: '#0284C7' }]}>
                        {p.assetCode}
                      </Text>
                      <Text style={styles.dossieItemCategory} numberOfLines={1}>
                        {p.category} • {p.sector}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity
                id="imprimirDossieBtn"
                style={styles.btnImprimirDossie}
                onPress={handlePrintDossie}
              >
                <Text style={styles.btnImprimirDossieText}>🖨️ Imprimir / Salvar PDF</Text>
              </TouchableOpacity>
            </View>

            {/* Folha do Dossiê Formatada para A4 */}
            <ScrollView style={styles.dossiePaperContainer} contentContainerStyle={styles.dossiePaper}>
              {selectedPinForDossie ? (
                <View>
                  {/* Cabeçalho Oficial do Dossiê */}
                  <View style={styles.dossieHeader}>
                    <View>
                      <Text style={styles.dossieHeaderMall}>CENTRO FASHION FORTALEZA</Text>
                      <Text style={styles.dossieHeaderDoc}>RELATÓRIO FOTOGRÁFICO DE OCORRÊNCIA</Text>
                      <Text style={styles.dossieHeaderSubtitle}>Documento Operacional Auditado</Text>
                    </View>
                    <View style={styles.dossieProtocolBox}>
                      <Text style={styles.dossieProtocolLabel}>PROTOCOLO</Text>
                      <Text style={styles.dossieProtocolCode}>{selectedPinForDossie.assetCode}</Text>
                      <Text style={styles.dossieProtocolDate}>Data: {new Date().toLocaleDateString()}</Text>
                    </View>
                  </View>

                  {/* Tabela de Metadados Técnicos */}
                  <View style={styles.dossieTable}>
                    <View style={styles.dossieTableRow}>
                      <Text style={styles.dossieTableCellHeader}>Tipo de Entidade</Text>
                      <Text style={styles.dossieTableCellValue}>
                        {selectedPinForDossie.entityType || 'SINALIZACAO'}
                      </Text>
                      <Text style={styles.dossieTableCellHeader}>Status Atual</Text>
                      <Text style={styles.dossieTableCellValue}>{selectedPinForDossie.status}</Text>
                    </View>
                    <View style={styles.dossieTableRow}>
                      <Text style={styles.dossieTableCellHeader}>Categoria</Text>
                      <Text style={styles.dossieTableCellValue}>{selectedPinForDossie.category}</Text>
                      <Text style={styles.dossieTableCellHeader}>Prioridade / SLA</Text>
                      <Text style={styles.dossieTableCellValue}>
                        {selectedPinForDossie.priority || 'MEDIA'} • {selectedPinForDossie.prazoHoras || 24}h
                      </Text>
                    </View>
                    <View style={styles.dossieTableRow}>
                      <Text style={styles.dossieTableCellHeader}>Setor & Localização</Text>
                      <Text style={[styles.dossieTableCellValue, { flex: 3 }]}>
                        {selectedPinForDossie.sector} — {selectedPinForDossie.humanLocation || 'No corredor'}
                      </Text>
                    </View>
                  </View>

                  {/* Descrição Detalhada */}
                  <View style={styles.dossieSection}>
                    <Text style={styles.dossieSectionTitle}>Descrição Técnica & Observações</Text>
                    <Text style={styles.dossieSectionContent}>
                      {selectedPinForDossie.notes || 'Sem anotações complementares registradas pelo operador.'}
                    </Text>
                  </View>

                  {/* Evidências Fotográficas: Antes e Depois */}
                  <View style={styles.dossieSection}>
                    <Text style={styles.dossieSectionTitle}>Evidências Fotográficas do Ponto</Text>
                    <View style={styles.dossiePhotosGrid}>
                      <View style={styles.dossiePhotoCol}>
                        <Text style={styles.dossiePhotoColTitle}>Registro Inicial (Antes)</Text>
                        {selectedPinForDossie.photos?.[0]?.localUri ? (
                          <Image
                            source={{ uri: selectedPinForDossie.photos[0].localUri }}
                            style={styles.dossiePhotoImg}
                          />
                        ) : (
                          <View style={styles.dossiePhotoPlaceholder}>
                            <Text>Sem foto inicial</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.dossiePhotoCol}>
                        <Text style={styles.dossiePhotoColTitle}>Registro Conclusivo (Depois)</Text>
                        {selectedPinForDossie.photos?.[1]?.localUri || selectedPinForDossie.concludedPhotoUrl ? (
                          <Image
                            source={{
                              uri:
                                selectedPinForDossie.photos?.[1]?.localUri ||
                                selectedPinForDossie.concludedPhotoUrl,
                            }}
                            style={styles.dossiePhotoImg}
                          />
                        ) : (
                          <View style={styles.dossiePhotoPlaceholder}>
                            <Text>Pendente de conclusão</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Solução Executada */}
                  {selectedPinForDossie.resolutionNotes && (
                    <View style={styles.dossieSection}>
                      <Text style={styles.dossieSectionTitle}>Solução Executada & Intervenção</Text>
                      <Text style={styles.dossieSectionContent}>
                        {selectedPinForDossie.resolutionNotes} (Concluído por:{' '}
                        {selectedPinForDossie.concludedBy || 'CEOP'})
                      </Text>
                    </View>
                  )}

                  {/* Bloco de Assinaturas */}
                  <View style={styles.dossieSignatureBlock}>
                    <View style={styles.signatureLine}>
                      <View style={styles.signatureRule} />
                      <Text style={styles.signatureLabel}>Fiscal / Auditor Responsável</Text>
                      <Text style={styles.signatureSub}>Operações Centro Fashion</Text>
                    </View>
                    <View style={styles.signatureLine}>
                      <View style={styles.signatureRule} />
                      <Text style={styles.signatureLabel}>Supervisão / Gerência</Text>
                      <Text style={styles.signatureSub}>Diretoria de Operações</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text>Selecione um registro na lateral.</Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Text style={styles.footerNote}>
            Relatórios e Apresentações gerados em tempo real com base no ecossistema operacional do Mall.
          </Text>
          <TouchableOpacity style={styles.footerCloseBtn} onPress={onClose}>
            <Text style={styles.footerCloseBtnText}>Fechar</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    zIndex: 170,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 1100,
    height: '92%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 24,
    flexDirection: 'column',
  },
  modalHeader: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  headerTabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerTabBtnActive: {
    backgroundColor: '#0284C7',
  },
  headerTabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  headerTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  /* Slides Layout */
  slidesLayoutContainer: {
    flex: 1,
    backgroundColor: '#0B0F17',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideViewportContainer: {
    width: '100%',
    maxWidth: 900,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  slideCanvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  /* Slide: Capa */
  slideCapa: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideBrandBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  slideBrandLogo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 2,
  },
  slideBrandCity: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 4,
    marginTop: 2,
  },
  slideCapaTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  slideCapaSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 28,
  },
  slideCapaMetaBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 6,
  },
  slideCapaMetaText: {
    fontSize: 12,
    color: '#E2E8F0',
  },

  /* Slide: Divisória */
  slideDivisoria: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  slideDivisoriaPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  slideDivisoriaPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  slideDivisoriaTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  slideDivisoriaSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  slideDivisoriaLine: {
    width: 80,
    height: 4,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
    marginTop: 20,
  },

  /* Slide: Registros */
  slideRegistros: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  slideTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  slideTopBarSector: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  slideTopBarPagination: {
    fontSize: 12,
    color: '#64748B',
  },
  slideCardsGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 14,
  },
  slideRecordCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'column',
  },
  slideRecordPhotoBox: {
    height: 180,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  slideRecordPhoto: {
    width: '100%',
    height: '100%',
  },
  slideRecordPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
  },
  placeholderLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  slideRecordBadgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  slideRecordBadgeOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  slideRecordContent: {
    padding: 12,
    flex: 1,
  },
  recordCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordCategoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  recordStatusTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recordLocationText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  recordNotesText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  recordConcludedBox: {
    marginTop: 'auto',
    backgroundColor: '#F0FDF4',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  recordConcludedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },

  /* Slide: Resumo */
  slideResumo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
    justifyContent: 'center',
  },
  slideResumoHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  slideResumoHeaderSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 24,
  },
  resumoKpiGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  resumoKpiBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#0284C7',
  },
  resumoKpiVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  resumoKpiLbl: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  resumoComplianceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#F0FDF4',
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  compliancePct: {
    fontSize: 36,
    fontWeight: '900',
    color: '#166534',
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#14532D',
  },
  complianceSub: {
    fontSize: 12,
    color: '#15803D',
    marginTop: 2,
  },

  /* Slide: Encerramento */
  slideEncerramento: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  slideEncerramentoTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  slideEncerramentoSubtitle: {
    fontSize: 14,
    color: '#38BDF8',
    marginBottom: 30,
  },
  slideEncerramentoContact: {
    alignItems: 'center',
    gap: 6,
  },
  slideContactLine: {
    fontSize: 12,
    color: '#94A3B8',
  },

  /* Slide Controls Bar */
  slideControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    gap: 12,
  },
  btnSlideNav: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnSlideNavDisabled: {
    opacity: 0.3,
  },
  btnSlideNavText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dotsScroll: {
    flexDirection: 'row',
  },
  dotBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dotBtnActive: {
    backgroundColor: '#0284C7',
  },
  dotText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  dotTextActive: {
    color: '#FFFFFF',
  },

  /* Dossiê Layout */
  dossieLayout: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0F172A',
  },
  dossieSidebar: {
    width: 260,
    backgroundColor: '#1E293B',
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    flexDirection: 'column',
  },
  dossieSidebarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E2E8F0',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  dossieItemSelect: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    marginBottom: 6,
  },
  dossieItemSelectActive: {
    backgroundColor: '#0284C7',
  },
  dossieItemCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dossieItemCategory: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  btnImprimirDossie: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnImprimirDossieText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  dossiePaperContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#334155',
  },
  dossiePaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 30,
    maxWidth: 750,
    alignSelf: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  dossieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
    paddingBottom: 16,
    marginBottom: 16,
  },
  dossieHeaderMall: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  dossieHeaderDoc: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 2,
  },
  dossieHeaderSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  dossieProtocolBox: {
    alignItems: 'flex-end',
  },
  dossieProtocolLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  dossieProtocolCode: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  dossieProtocolDate: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  dossieTable: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    marginBottom: 16,
  },
  dossieTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dossieTableCellHeader: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 8,
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  dossieTableCellValue: {
    flex: 1.5,
    padding: 8,
    fontSize: 11,
    color: '#0F172A',
  },

  dossieSection: {
    marginBottom: 16,
  },
  dossieSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dossieSectionContent: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
  },

  dossiePhotosGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  dossiePhotoCol: {
    flex: 1,
  },
  dossiePhotoColTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  dossiePhotoImg: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  dossiePhotoPlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },

  dossieSignatureBlock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingTop: 20,
  },
  signatureLine: {
    alignItems: 'center',
    width: 200,
  },
  signatureRule: {
    width: '100%',
    height: 1,
    backgroundColor: '#0F172A',
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  signatureSub: {
    fontSize: 9,
    color: '#64748B',
  },

  modalFooter: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footerCloseBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  footerCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
