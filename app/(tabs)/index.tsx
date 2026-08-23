import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Modal, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InteractiveMallMap, SignagePin } from '../../src/components/InteractiveMallMap';
import { useRouter } from 'expo-router';

const initialPins: SignagePin[] = [
  { id: '1', assetCode: 'SIG-20260814-0001', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'ATIVA', normalizedX: 0.28, normalizedY: 0.28, humanLocation: 'Corredor Central - Setor Azul' },
  { id: '2', assetCode: 'SIG-20260814-0002', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'MANUTENCAO', normalizedX: 0.52, normalizedY: 0.35, humanLocation: 'Rua São José - Box 1020' },
  { id: '3', assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_AZUL', status: 'ATIVA', normalizedX: 0.25, normalizedY: 0.55, humanLocation: 'Entrada Setor Azul' },
  { id: '4', assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_AZUL', status: 'SUBSTITUIR', normalizedX: 0.65, normalizedY: 0.65, humanLocation: 'Saída de Emergência - Setor Azul' },
  { id: '5', assetCode: 'SIG-20260814-0005', category: 'Totem Interativo', sector: 'SETOR_AZUL', status: 'ATIVA', normalizedX: 0.22, normalizedY: 0.80, humanLocation: 'Praça de Alimentação' },
];

export default function MallMapScreen() {
  const router = useRouter();
  const [selectedMapKey, setSelectedMapKey] = useState<string>('SETOR_AZUL');
  const [pinsList, setPinsList] = useState<SignagePin[]>(initialPins);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  
  // Layer toggles
  const [showSignage, setShowSignage] = useState<boolean>(true);
  const [showReferences, setShowReferences] = useState<boolean>(true);
  const [showIntersections, setShowIntersections] = useState<boolean>(true);
  const [showShops, setShowShops] = useState<boolean>(true);

  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const mapsList = [
    { key: 'SETOR_AZUL', label: 'Setor Azul • Piso 1' },
    { key: 'SETOR_VERDE', label: 'Setor Verde • Piso 1' },
    { key: 'SETOR_AMARELO', label: 'Setor Amarelo • Piso 1' },
    { key: 'SETOR_ROXO', label: 'Setor Roxo • Piso 1' },
    { key: 'SETOR_BRANCO', label: 'Setor Branco • Piso 1' },
    { key: 'NIVEL_1', label: 'Visão Geral • Nível 1' },
  ];

  const handleAddPinAtLocation = (normX: number, normY: number) => {
    const newCode = `SIG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(pinsList.length + 1).padStart(4, '0')}`;

    const newPin: SignagePin = {
      id: String(Date.now()),
      assetCode: newCode,
      category: 'Placa Nova',
      sector: selectedMapKey,
      status: 'ATIVA',
      normalizedX: normX,
      normalizedY: normY,
      humanLocation: `Coordenada ${selectedMapKey}`,
    };

    setPinsList((prev) => [...prev, newPin]);
    Alert.alert(
      'Sinalização Cadastrada!',
      `A placa ${newCode} foi posicionada em X: ${(normX * 100).toFixed(1)}%, Y: ${(normY * 100).toFixed(1)}% e sincronizada.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Authentic Navy Header */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Sinalização do Mall</Text>
          <Text style={styles.headerSub}>MVP-3.28.1-SINALIZACAO-S26.6.1</Text>
        </View>

        {!isMobile && (
          <View style={styles.headerCenter}>
            <View style={styles.connPill}>
              <Text style={styles.connText}>Conectado (VPS K3s) • 200 ms</Text>
            </View>
          </View>
        )}

        <View style={styles.userPill}>
          <Text style={styles.userText}>
            {isMobile ? 'davidsilva • ADMIN' : 'davidsilva.centrofashion • ADMIN'}
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
        {/* Authentic Toolbar Card */}
        <View style={[styles.toolbarCard, isMobile && styles.toolbarCardMobile]}>
          <View style={styles.selectGroup}>
            <Text style={styles.selectLabel}>Mapa / Visualização</Text>
            
            {/* Native Web Select / Chip Dropdown */}
            {Platform.OS === 'web' ? (
              <select
                value={selectedMapKey}
                onChange={(e) => setSelectedMapKey(e.target.value)}
                style={{
                  width: '100%',
                  minWidth: isMobile ? '100%' : '260px',
                  padding: '9px 12px',
                  border: '1px solid #DFE2EA',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#101228',
                  outline: 'none',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                {mapsList.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
                {mapsList.map((m) => (
                  <TouchableOpacity
                    key={m.key}
                    style={[styles.mapChip, selectedMapKey === m.key && styles.mapChipActive]}
                    onPress={() => setSelectedMapKey(m.key)}
                  >
                    <Text style={[styles.mapChipText, selectedMapKey === m.key && styles.mapChipTextActive]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.btnIconPlus}
              onPress={() => Alert.alert('Novo Registro', 'Escolha a posição exata no mapa para cadastrar uma nova sinalização.')}
            >
              <Text style={styles.btnIconPlusText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnMenu} onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu-outline" size={16} color="#101228" />
              <Text style={styles.btnMenuText}>Menu</Text>
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive Mall Map Stage Container */}
        <View style={styles.stageFrame}>
          <InteractiveMallMap
            selectedMapKey={selectedMapKey}
            pins={showSignage ? pinsList : []}
            onAddPinAtLocation={handleAddPinAtLocation}
          />
        </View>
      </View>

      {/* Authentic Legacy App Menu Drawer Modal */}
      <Modal visible={isMenuOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.menuModalBackdrop} activeOpacity={1} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menuModalContainer}>
            <View style={styles.menuModalHead}>
              <Text style={styles.menuModalTitle}>Menu do Sistema</Text>
              <TouchableOpacity style={styles.menuCloseBtn} onPress={() => setIsMenuOpen(false)}>
                <Ionicons name="close" size={20} color="#101228" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.menuGrid}>
              <TouchableOpacity
                style={[styles.menuGridItem, styles.menuGridItemPrimary]}
                onPress={() => {
                  setIsMenuOpen(false);
                  Alert.alert('Novo Registro', 'Clique em "+ Posicionar Placa" no mapa.');
                }}
              >
                <Text style={styles.menuItemIcon}>＋</Text>
                <Text style={[styles.menuItemLabel, { color: '#FFFFFF' }]}>Novo registro</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuGridItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  setIsLayersOpen(true);
                }}
              >
                <Text style={styles.menuItemIcon}>▱</Text>
                <Text style={styles.menuItemLabel}>Camadas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuGridItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  Alert.alert('Atualização Offline', 'Banco local atualizado com sucesso! (100% Sincronizado)');
                }}
              >
                <Text style={styles.menuItemIcon}>↓</Text>
                <Text style={styles.menuItemLabel}>Atualizar offline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuGridItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push('/sync');
                }}
              >
                <Text style={styles.menuItemIcon}>⇅</Text>
                <Text style={styles.menuItemLabel}>Fila Sync (0)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuGridItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push('/sinalizacoes');
                }}
              >
                <Text style={styles.menuItemIcon}>◎</Text>
                <Text style={styles.menuItemLabel}>Central Inventário</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuGridItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push('/inspecoes');
                }}
              >
                <Text style={styles.menuItemIcon}>□</Text>
                <Text style={styles.menuItemLabel}>Agenda Inspeções</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuGridItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push('/dashboard');
                }}
              >
                <Text style={styles.menuItemIcon}>▦</Text>
                <Text style={styles.menuItemLabel}>Dashboard & KPI</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuGridItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push('/dashboard');
                }}
              >
                <Text style={styles.menuItemIcon}>≡</Text>
                <Text style={styles.menuItemLabel}>Relatórios CSV</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Layers Modal */}
      <Modal visible={isLayersOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.menuModalBackdrop} activeOpacity={1} onPress={() => setIsLayersOpen(false)}>
          <View style={styles.layersModalContainer}>
            <View style={styles.menuModalHead}>
              <Text style={styles.menuModalTitle}>Camadas do Mapa</Text>
              <TouchableOpacity style={styles.menuCloseBtn} onPress={() => setIsLayersOpen(false)}>
                <Ionicons name="close" size={20} color="#101228" />
              </TouchableOpacity>
            </View>

            <View style={styles.layersList}>
              <TouchableOpacity
                style={styles.layerRow}
                onPress={() => setShowSignage(!showSignage)}
              >
                <Ionicons name={showSignage ? "checkbox" : "square-outline"} size={22} color={showSignage ? "#171B68" : "#676A7A"} />
                <Text style={styles.layerRowText}>Sinalizações ({pinsList.length})</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.layerRow}
                onPress={() => setShowReferences(!showReferences)}
              >
                <Ionicons name={showReferences ? "checkbox" : "square-outline"} size={22} color={showReferences ? "#171B68" : "#676A7A"} />
                <Text style={styles.layerRowText}>Pontos de Referência</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.layerRow}
                onPress={() => setShowIntersections(!showIntersections)}
              >
                <Ionicons name={showIntersections ? "checkbox" : "square-outline"} size={22} color={showIntersections ? "#171B68" : "#676A7A"} />
                <Text style={styles.layerRowText}>Cruzamentos de Corredores</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.layerRow}
                onPress={() => setShowShops(!showShops)}
              >
                <Ionicons name={showShops ? "checkbox" : "square-outline"} size={22} color={showShops ? "#171B68" : "#676A7A"} />
                <Text style={styles.layerRowText}>Boxes & Lojas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  header: {
    height: 60,
    backgroundColor: '#171B68',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
  },
  headerMobile: {
    paddingHorizontal: 12,
    height: 56,
  },
  headerLeft: {
    justify: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 1,
  },
  headerCenter: {
    alignItems: 'center',
  },
  connPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  connText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  userPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    padding: 12,
    maxWidth: 1500,
    alignSelf: 'center',
    width: '100%',
  },
  mainContentMobile: {
    padding: 8,
  },
  toolbarCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  toolbarCardMobile: {
    borderRadius: 12,
    padding: 8,
  },
  selectGroup: {
    flex: 1,
  },
  selectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101228',
  },
  selectorScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  mapChip: {
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  mapChipActive: {
    backgroundColor: '#171B68',
    borderColor: '#171B68',
  },
  mapChipText: {
    color: '#101228',
    fontSize: 12,
    fontWeight: '600',
  },
  mapChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnIconPlus: {
    backgroundColor: '#F50087',
    borderWidth: 1,
    borderColor: '#F50087',
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justify: 'center',
  },
  btnIconPlusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  btnMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  btnMenuText: {
    color: '#101228',
    fontWeight: '700',
    fontSize: 12,
  },
  menuBadge: {
    backgroundColor: '#F50087',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justify: 'center',
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stageFrame: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 18, 40, 0.4)',
    alignItems: 'center',
    justify: 'center',
    padding: 16,
  },
  menuModalContainer: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE2EA',
  },
  layersModalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE2EA',
  },
  menuModalHead: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101228',
  },
  menuCloseBtn: {
    backgroundColor: '#F4F5F8',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justify: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  menuGridItem: {
    width: '48%',
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuGridItemPrimary: {
    backgroundColor: '#F50087',
    borderColor: '#F50087',
  },
  menuItemIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171B68',
  },
  menuItemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#101228',
  },
  layersList: {
    gap: 12,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F4F5F8',
    borderRadius: 10,
  },
  layerRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101228',
  },
});
