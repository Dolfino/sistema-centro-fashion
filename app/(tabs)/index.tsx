import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InteractiveMallMap, SignagePin } from '../../src/components/InteractiveMallMap';

// Sample real pins mapped to legacy sectors
const initialPins: SignagePin[] = [
  { id: '1', assetCode: 'SIG-20260814-0001', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'ATIVA', normalizedX: 0.38, normalizedY: 0.28, humanLocation: 'Corredor Central - Setor Azul' },
  { id: '2', assetCode: 'SIG-20260814-0002', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'MANUTENCAO', normalizedX: 0.62, normalizedY: 0.35, humanLocation: 'Rua São José - Box 1020' },
  { id: '3', assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_VERDE', status: 'ATIVA', normalizedX: 0.30, normalizedY: 0.65, humanLocation: 'Entrada Setor Verde' },
  { id: '4', assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_AMARELO', status: 'SUBSTITUIR', normalizedX: 0.70, normalizedY: 0.70, humanLocation: 'Saída de Emergência - Setor Amarelo' },
  { id: '5', assetCode: 'SIG-20260814-0005', category: 'Totem Interativo', sector: 'SETOR_ROXO', status: 'ATIVA', normalizedX: 0.45, normalizedY: 0.50, humanLocation: 'Praça de Alimentação - Setor Roxo' },
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
      `A placa ${newCode} foi gravada na coordenada X: ${(normX * 100).toFixed(1)}%, Y: ${(normY * 100).toFixed(1)}% e sincronizada.`,
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
            <View style={styles.connDot} />
            <Text style={styles.connText}>Conectado (VPS K3s) • 200 ms</Text>
          </View>
        </View>

        <View style={styles.userPill}>
          <Text style={styles.userText}>davidsilva.centrofashion • ADMIN</Text>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.mainScroll}>
        <View style={styles.mainContent}>
          {/* Authentic Toolbar Card */}
          <View style={styles.toolbarCard}>
            <View style={styles.selectGroup}>
              <Text style={styles.selectLabel}>Mapa / Visualização</Text>
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
            </View>

            <View style={styles.actionGroup}>
              <TouchableOpacity
                style={styles.btnPrimaryRosa}
                onPress={() => Alert.alert('Nova Sinalização', 'Clique em "+ Posicionar Placa" no mapa para escolher o local exato.')}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.btnPrimaryRosaText}>Nova Placa</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnMenu}>
                <Ionicons name="menu-outline" size={20} color="#101228" />
                <Text style={styles.btnMenuText}>Menu</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Interactive Mall Map Stage */}
          <InteractiveMallMap
            selectedMapKey={selectedMapKey}
            pins={pinsList}
            onAddPinAtLocation={handleAddPinAtLocation}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  header: {
    height: 68,
    backgroundColor: '#171B68', // Azul Legado
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
    fontSize: 20,
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  connText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  userPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainScroll: {
    flex: 1,
  },
  mainContent: {
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
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  selectGroup: {
    flex: 1,
    minWidth: 260,
  },
  selectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101228',
    marginBottom: 6,
  },
  selectorScroll: {
    flexDirection: 'row',
  },
  mapChip: {
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
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
    gap: 8,
  },
  btnPrimaryRosa: {
    backgroundColor: '#F50087', // Rosa Legado
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPrimaryRosaText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btnMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
});
