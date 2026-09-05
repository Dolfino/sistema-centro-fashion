import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, ScrollView, Platform } from 'react-native';

interface CamadasModalProps {
  visible: boolean;
  onClose: () => void;
  showSinalizacoes: boolean;
  onToggleSinalizacoes: (enabled: boolean) => void;
  totalPinsCount: number;
  initialShowCentral?: boolean;
}

export const CamadasModal: React.FC<CamadasModalProps> = ({
  visible,
  onClose,
  showSinalizacoes,
  onToggleSinalizacoes,
  totalPinsCount,
  initialShowCentral = false,
}) => {
  const [showCentralCamadas, setShowCentralCamadas] = useState<boolean>(initialShowCentral);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (visible && initialShowCentral) {
      setShowCentralCamadas(true);
    }
  }, [visible, initialShowCentral]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCentralCamadas) {
          setShowCentralCamadas(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, showCentralCamadas, onClose]);

  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (showCentralCamadas) {
            setShowCentralCamadas(false);
          } else {
            onClose();
          }
        }}
      >
        <View id="centralCamadasBackdropS261" style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {!showCentralCamadas ? (
        <View id="camadas" style={styles.layersBox}>
          <View style={styles.layersHead}>
            <Text style={styles.layersTitle}>Camadas</Text>
            <TouchableOpacity
              id="fecharCamadasS22516"
              style={styles.closeBtn}
              onPress={onClose}
              aria-label="Fechar camadas"
            >
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.layersList}>
            <TouchableOpacity
              id="toggleSinalizacoes"
              style={styles.layerRow}
              activeOpacity={0.8}
              onPress={() => onToggleSinalizacoes(!showSinalizacoes)}
            >
              <View style={[styles.checkbox, showSinalizacoes && styles.checkboxChecked]}>
                {showSinalizacoes && <Text style={styles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={styles.layerLabel}>Sinalizações</Text>
              <View style={styles.layerBadge}>
                <Text style={styles.layerBadgeText}>{totalPinsCount}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.layerRowDisabled}>
              <View style={[styles.checkbox, styles.checkboxChecked]} />
              <Text style={styles.layerLabel}>Referências</Text>
              <View style={styles.layerBadgeMuted}>
                <Text style={styles.layerBadgeText}>0</Text>
              </View>
            </View>

            <View style={styles.layerRowDisabled}>
              <View style={[styles.checkbox, styles.checkboxChecked]} />
              <Text style={styles.layerLabel}>Cruzamentos</Text>
              <View style={styles.layerBadgeMuted}>
                <Text style={styles.layerBadgeText}>0</Text>
              </View>
            </View>

            <View style={styles.layerRowDisabled}>
              <View style={[styles.checkbox, styles.checkboxChecked]} />
              <Text style={styles.layerLabel}>Lojas</Text>
              <View style={styles.layerBadgeMuted}>
                <Text style={styles.layerBadgeText}>0</Text>
              </View>
            </View>
          </View>

          <View style={styles.layersFooter}>
            <TouchableOpacity
              id="gerenciarCamadasS261"
              style={styles.manageBtn}
              onPress={() => setShowCentralCamadas(true)}
            >
              <Text style={styles.manageBtnText}>Gerenciar camadas</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View id="centralCamadasS261" style={styles.centerBox}>
          <View style={styles.centerHead}>
            <View>
              <Text style={styles.centerVersionTag}>S26.6</Text>
              <Text style={styles.centerTitle}>Central de Camadas</Text>
              <Text style={styles.centerSubtitle}>
                Visibilidade, pesquisa, filtros, simbologia e presets
              </Text>
            </View>
            <TouchableOpacity
              id="fecharCentralCamadasS261"
              style={styles.closeBtn}
              onPress={() => setShowCentralCamadas(false)}
            >
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.centerBody} contentContainerStyle={styles.centerBodyContent}>
            {/* Seção 1: Visibilidade */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <View>
                  <Text style={styles.sectionTitle}>Visibilidade</Text>
                  <Text style={styles.sectionDesc}>Escolha o que deve aparecer no mapa.</Text>
                </View>
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>
                    {showSinalizacoes ? '4 ativas' : '3 ativas'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                id="toggleCentralSinalizacoes"
                style={styles.centerRow}
                onPress={() => onToggleSinalizacoes(!showSinalizacoes)}
              >
                <View style={[styles.checkbox, showSinalizacoes && styles.checkboxChecked]}>
                  {showSinalizacoes && <Text style={styles.checkboxCheckmark}>✓</Text>}
                </View>
                <Text style={styles.dotIconSig}>●</Text>
                <View style={styles.centerRowMeta}>
                  <Text style={styles.centerRowTitle}>Sinalizações</Text>
                  <Text style={styles.centerRowDesc}>Ativos SIG posicionados no mapa</Text>
                </View>
                <Text style={styles.centerRowCount}>{totalPinsCount}</Text>
              </TouchableOpacity>
            </View>

            {/* Seção 2: Pesquisar sinalizações */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Pesquisar sinalizações</Text>
              <Text style={styles.sectionDesc}>
                Busca local nos dados já carregados, inclusive offline.
              </Text>
              <View style={styles.searchWrap}>
                <TextInput
                  id="buscaCamadasS262"
                  style={styles.searchInput}
                  placeholder="Protocolo, título, rua, loja, responsável…"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Seção 3: Filtros de sinalizações */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Filtros de sinalizações</Text>
              <Text style={styles.sectionDesc}>Combine critérios para reduzir os pins exibidos.</Text>
              <View style={styles.filterGrid}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Status</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="filtroStatusS262"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#DFE2EA',
                        fontSize: 13,
                      }}
                    >
                      <option value="">Todos</option>
                      <option value="ATIVA">Ativa</option>
                      <option value="MANUTENCAO">Manutenção</option>
                      <option value="SUBSTITUIR">Substituir</option>
                    </select>
                  ) : (
                    <Text style={styles.filterFallbackText}>Todos</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Seção 4: Simbologia e Cores */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Aparência e Simbologia</Text>
              <Text style={styles.sectionDesc}>
                Personalize as cores dos marcadores no mapa localmente.
              </Text>
              <View style={styles.symbolGrid}>
                <View style={styles.symbolBadgeGreen}>
                  <Text style={styles.symbolText}>Ativa (#12823B)</Text>
                </View>
                <View style={styles.symbolBadgeOrange}>
                  <Text style={styles.symbolText}>Manutenção (#E08B00)</Text>
                </View>
                <View style={styles.symbolBadgeRed}>
                  <Text style={styles.symbolText}>Substituir (#D94841)</Text>
                </View>
              </View>
            </View>

            {/* Seção 5: Visualizações Corporativas & Presets Pessoais */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <View>
                  <Text style={styles.sectionTitle}>Visualizações Corporativas & Presets</Text>
                  <Text style={styles.sectionDesc}>Presets publicados pela Administração ou privados.</Text>
                </View>
                <View style={styles.corpBadge}>
                  <Text style={styles.corpBadgeText}>S26.6 Corporativo</Text>
                </View>
              </View>
              <Text style={styles.presetNoteText}>
                Padrão por perfil tem precedência sobre padrão global e é aplicado automaticamente.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.centerFooter}>
            <TouchableOpacity
              id="restaurarCamadasPadraoS261"
              style={styles.btnSecondary}
              onPress={() => onToggleSinalizacoes(true)}
            >
              <Text style={styles.btnSecondaryText}>Restaurar padrão</Text>
            </TouchableOpacity>

            <TouchableOpacity
              id="verMapaS261"
              style={styles.btnPrimary}
              onPress={() => setShowCentralCamadas(false)}
            >
              <Text style={styles.btnPrimaryText}>Ver mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 18, 40, 0.45)',
  },
  layersBox: {
    position: 'absolute',
    top: 130,
    left: 20,
    width: 280,
    maxWidth: '90%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
    zIndex: 210,
  },
  layersHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
    marginBottom: 10,
  },
  layersTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#171B68',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#676A7A',
    marginTop: -2,
  },
  layersList: {
    gap: 8,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  layerRowDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    opacity: 0.6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CFD4DF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#171B68',
    borderColor: '#171B68',
  },
  checkboxCheckmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: -2,
  },
  layerLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#20233A',
  },
  layerBadge: {
    backgroundColor: '#171B68',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  layerBadgeMuted: {
    backgroundColor: '#E8EBF2',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  layerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  layersFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
  },
  manageBtn: {
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  manageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171B68',
  },
  centerBox: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    width: 680,
    maxWidth: '92%',
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 220,
  },
  centerHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
  },
  centerVersionTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F50087',
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171B68',
  },
  centerSubtitle: {
    fontSize: 12,
    color: '#676A7A',
    marginTop: 2,
  },
  centerBody: {
    maxHeight: 520,
    marginVertical: 12,
  },
  centerBodyContent: {
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    borderRadius: 12,
    padding: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#171B68',
  },
  sectionDesc: {
    fontSize: 12,
    color: '#676A7A',
    marginBottom: 10,
  },
  activePill: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#171B68',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE2EA',
  },
  dotIconSig: {
    fontSize: 16,
    color: '#12823b',
  },
  centerRowMeta: {
    flex: 1,
  },
  centerRowTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#20233A',
  },
  centerRowDesc: {
    fontSize: 11,
    color: '#676A7A',
  },
  centerRowCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#171B68',
  },
  searchWrap: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchInput: {
    fontSize: 13,
    color: '#20233A',
    height: 34,
  },
  filterGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#20233A',
    marginBottom: 4,
  },
  filterFallbackText: {
    fontSize: 13,
    color: '#676A7A',
  },
  symbolGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  symbolBadgeGreen: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symbolBadgeOrange: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symbolBadgeRed: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symbolText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#20233A',
  },
  corpBadge: {
    backgroundColor: '#F50087',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  corpBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  presetNoteText: {
    fontSize: 11,
    color: '#676A7A',
    lineHeight: 16,
  },
  centerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#20233A',
  },
  btnPrimary: {
    backgroundColor: '#F50087',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
