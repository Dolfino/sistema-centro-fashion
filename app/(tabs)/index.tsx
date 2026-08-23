import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InteractiveMallMap, SignagePin } from '../../src/components/InteractiveMallMap';

// Sample real pins mapped to legacy sectors
const initialPins: SignagePin[] = [
  { id: '1', assetCode: 'SIG-20260814-0001', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'ATIVA', normalizedX: 0.28, normalizedY: 0.28, humanLocation: 'Corredor Central - Setor Azul' },
  { id: '2', assetCode: 'SIG-20260814-0002', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'MANUTENCAO', normalizedX: 0.52, normalizedY: 0.35, humanLocation: 'Rua São José - Box 1020' },
  { id: '3', assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_AZUL', status: 'ATIVA', normalizedX: 0.25, normalizedY: 0.55, humanLocation: 'Entrada Setor Azul' },
  { id: '4', assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_AZUL', status: 'SUBSTITUIR', normalizedX: 0.65, normalizedY: 0.65, humanLocation: 'Saída de Emergência - Setor Azul' },
  { id: '5', assetCode: 'SIG-20260814-0005', category: 'Totem Interativo', sector: 'SETOR_AZUL', status: 'ATIVA', normalizedX: 0.22, normalizedY: 0.80, humanLocation: 'Praça de Alimentação' },
];

export default function MallMapScreen() {
  const [selectedMapKey, setSelectedMapKey] = useState<string>('SETOR_AZUL');
  const [pinsList, setPinsList] = useState<SignagePin[]>(initialPins);

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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Sinalização do Mall</Text>
          <Text style={styles.headerSub}>MVP-3.28.1-SINALIZACAO-S26.6.1</Text>
        </View>

        <View style={styles.headerCenter}>
          <View style={styles.connPill}>
            <Text style={styles.connText}>Conectado (VPS K3s) • 200 ms</Text>
          </View>
        </View>

        <View style={styles.userPill}>
          <Text style={styles.userText}>davidsilva.centrofashion • ADMIN</Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Authentic Toolbar Card */}
        <View style={styles.toolbarCard}>
          <View style={styles.selectGroup}>
            <Text style={styles.selectLabel}>Mapa / Visualização</Text>
            
            {/* Native Web Select / Chip Dropdown */}
            {Platform.OS === 'web' ? (
              <select
                value={selectedMapKey}
                onChange={(e) => setSelectedMapKey(e.target.value)}
                style={{
                  minWidth: '280px',
                  padding: '10px 14px',
                  border: '1px solid #DFE2EA',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
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
              onPress={() => Alert.alert('Nova Sinalização', 'Clique em "+ Posicionar Placa" para escolher a coordenada no mapa.')}
            >
              <Text style={styles.btnIconPlusText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnMenu}>
              <Ionicons name="menu-outline" size={18} color="#101228" />
              <Text style={styles.btnMenuText}>Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive Mall Map Stage Container */}
        <View style={styles.stageFrame}>
          <InteractiveMallMap
            selectedMapKey={selectedMapKey}
            pins={pinsList}
            onAddPinAtLocation={handleAddPinAtLocation}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  header: {
    height: 64,
    backgroundColor: '#171B68',
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
  },
  headerLeft: {
    justify: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 1,
  },
  headerCenter: {
    alignItems: 'center',
  },
  connPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  userPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    padding: 16,
    maxWidth: 1500,
    alignSelf: 'center',
    width: '100%',
  },
  toolbarCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
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
    gap: 8,
  },
  btnIconPlus: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justify: 'center',
  },
  btnIconPlusText: {
    color: '#171B68',
    fontWeight: 'bold',
    fontSize: 20,
  },
  btnMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnMenuText: {
    color: '#101228',
    fontWeight: '700',
    fontSize: 13,
  },
  stageFrame: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
