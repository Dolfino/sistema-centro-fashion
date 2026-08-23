import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function MallMapScreen() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(3);
  const [selectedSector, setSelectedSector] = useState<string>('SETOR_AMARELO');

  return (
    <View style={styles.container}>
      {/* Offline Status Banner */}
      <View style={[styles.networkBanner, { backgroundColor: isOnline ? '#059669' : '#DC2626' }]}>
        <Ionicons name={isOnline ? 'wifi' : 'wifi-outline'} size={18} color="#FFFFFF" />
        <Text style={styles.bannerText}>
          {isOnline
            ? 'Conectado à VPS Centro Fashion'
            : 'Modo Offline - Dados sendo salvos localmente no dispositivo'}
        </Text>
      </View>

      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Sinalização do Mall</Text>
        <Text style={styles.subtitle}>Centro Fashion Fortaleza - Piso 1</Text>
      </View>

      {/* Sector Selector Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectorBar}>
        {['SETOR_AMARELO', 'SETOR_AZUL', 'SETOR_VERMELHO', 'SETOR_VERDE'].map((sec) => (
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

      {/* Map Interactive View Sandbox */}
      <View style={styles.mapCanvas}>
        <Ionicons name="map" size={64} color="#475569" />
        <Text style={styles.mapLabel}>Visualização de Planta Cartográfica ({selectedSector})</Text>
        <Text style={styles.mapSublabel}>PostGIS Coordinates (Point) & Outbox Offline Engine</Text>

        {/* Demo Pins on Floor Plan */}
        <View style={[styles.pin, { top: '30%', left: '45%', backgroundColor: '#F59E0B' }]}>
          <Ionicons name="pricetag" size={14} color="#FFF" />
        </View>
        <View style={[styles.pin, { top: '60%', left: '70%', backgroundColor: '#10B981' }]}>
          <Ionicons name="pricetag" size={14} color="#FFF" />
        </View>
        <View style={[styles.pin, { top: '45%', left: '25%', backgroundColor: '#EF4444' }]}>
          <Ionicons name="alert-circle" size={14} color="#FFF" />
        </View>
      </View>

      {/* Sync Status Badge Bar */}
      <View style={styles.syncFooter}>
        <View style={styles.syncInfo}>
          <Ionicons name="cloud-offline-outline" size={20} color="#F59E0B" />
          <Text style={styles.syncText}>
            {pendingSyncCount} mutações pendentes na fila Outbox
          </Text>
        </View>
        <TouchableOpacity style={styles.toggleNetBtn} onPress={() => setIsOnline(!isOnline)}>
          <Text style={styles.toggleNetText}>Simular {isOnline ? 'Offline' : 'Online'}</Text>
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
    justify: 'center',
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
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 2,
  },
  sectorBar: {
    paddingHorizontal: 16,
    maxHeight: 40,
    marginBottom: 12,
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
  mapCanvas: {
    flex: 1,
    margin: 16,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapLabel: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  mapSublabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  pin: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  syncFooter: {
    backgroundColor: '#1E293B',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  toggleNetBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleNetText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
});
