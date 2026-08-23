import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InteractiveMallMap, SignagePin } from '../../src/components/InteractiveMallMap';

// Pins migrados do banco de dados legado da planilha
const initialPins: SignagePin[] = [
  { id: '1', assetCode: 'SIG-20260814-0001', category: 'Placa informativa', sector: 'SETOR_AZUL', conservationStatus: 'GOOD', normalizedX: 0.35, normalizedY: 0.25, notes: 'Rua General Bezerril' },
  { id: '2', assetCode: 'SIG-20260814-0002', category: 'Placa informativa', sector: 'SETOR_AZUL', conservationStatus: 'GOOD', normalizedX: 0.65, normalizedY: 0.30, notes: 'Rua São José' },
  { id: '3', assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_VERDE', conservationStatus: 'REGULAR', normalizedX: 0.20, normalizedY: 0.70, notes: 'Adesivo de piso de sinalização' },
  { id: '4', assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_VERMELHO', conservationStatus: 'BAD', normalizedX: 0.75, normalizedY: 0.75, notes: 'Ambulatório -> Necessita manutenção' },
  { id: '5', assetCode: 'SIG-20260814-0005', category: 'Totem Interativo', sector: 'SETOR_AMARELO', conservationStatus: 'GOOD', normalizedX: 0.50, normalizedY: 0.50, notes: 'Totem de Entrada Principal' },
];

export default function MallMapScreen() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedSector, setSelectedSector] = useState<string>('TODOS');
  const [pinsList, setPinsList] = useState<SignagePin[]>(initialPins);

  const handleAddPinAtLocation = (normX: number, normY: number) => {
    const newCode = `SIG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(pinsList.length + 1).padStart(4, '0')}`;
    
    const newPin: SignagePin = {
      id: String(Date.now()),
      assetCode: newCode,
      category: 'Placa Nova',
      sector: selectedSector === 'TODOS' ? 'SETOR_AZUL' : selectedSector,
      conservationStatus: 'GOOD',
      normalizedX: normX,
      normalizedY: normY,
      notes: 'Placa adicionada via mapa interativo em campo (Outbox Offline)',
    };

    setPinsList((prev) => [...prev, newPin]);
    Alert.alert(
      'Placa Adicionada!',
      `A placa ${newCode} foi posicionada em X: ${(normX * 100).toFixed(0)}%, Y: ${(normY * 100).toFixed(0)}% e salva no banco local.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Offline Status Banner */}
      <View style={[styles.networkBanner, { backgroundColor: isOnline ? '#059669' : '#DC2626' }]}>
        <Ionicons name={isOnline ? 'wifi' : 'wifi-outline'} size={16} color="#FFFFFF" />
        <Text style={styles.bannerText}>
          {isOnline
            ? 'Conectado à VPS Centro Fashion (Sincronizado)'
            : 'Modo Offline - Coordenadas salvas no banco local'}
        </Text>
      </View>

      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.title}>Planta Cartográfica do Mall</Text>
        <Text style={styles.subtitle}>Centro Fashion Fortaleza - Piso 1 (Nível 1)</Text>
      </View>

      {/* Sector Filter Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectorBar}>
        {['TODOS', 'SETOR_AZUL', 'SETOR_VERDE', 'SETOR_AMARELO', 'SETOR_VERMELHO'].map((sec) => (
          <TouchableOpacity
            key={sec}
            style={[styles.sectorChip, selectedSector === sec && styles.sectorChipActive]}
            onPress={() => setSelectedSector(sec)}
          >
            <Text style={[styles.sectorText, selectedSector === sec && styles.sectorTextActive]}>
              {sec.replace('SETOR_', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Interactive Cartographic Map Component */}
      <InteractiveMallMap
        selectedSector={selectedSector}
        pins={pinsList}
        onAddPinAtLocation={handleAddPinAtLocation}
      />

      {/* Map Legend Footer */}
      <View style={styles.legendFooter}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Bom ({pinsList.filter(p => p.conservationStatus === 'GOOD').length})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Regular ({pinsList.filter(p => p.conservationStatus === 'REGULAR').length})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>Danificado ({pinsList.filter(p => p.conservationStatus === 'BAD' || p.conservationStatus === 'CRITICAL').length})</Text>
        </View>
        <TouchableOpacity style={styles.netToggle} onPress={() => setIsOnline(!isOnline)}>
          <Text style={styles.netToggleText}>{isOnline ? 'Simular Offline' : 'Simular Online'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  networkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  sectorBar: {
    paddingHorizontal: 16,
    maxHeight: 40,
    marginVertical: 8,
  },
  sectorChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectorChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  sectorText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  sectorTextActive: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  legendFooter: {
    backgroundColor: '#1E293B',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  netToggle: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  netToggleText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
});
