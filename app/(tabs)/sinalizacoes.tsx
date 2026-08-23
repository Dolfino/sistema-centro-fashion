import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SignageItem {
  id: string;
  code: string;
  category: string;
  sector: string;
  status: string;
}

const mockSignage: SignageItem[] = [
  { id: '1', code: 'PLC-AMAR-101', category: 'Placa Direcional', sector: 'SETOR_AMARELO', status: 'GOOD' },
  { id: '2', code: 'TOT-AZUL-204', category: 'Totem Interativo', sector: 'SETOR_AZUL', status: 'REGULAR' },
  { id: '3', code: 'SAI-VERM-309', category: 'Saída de Emergência', sector: 'SETOR_VERMELHO', status: 'BAD' },
  { id: '4', code: 'PLC-VERD-412', category: 'Placa de Sanitário', sector: 'SETOR_VERDE', status: 'GOOD' },
];

export default function SignageListScreen() {
  const [search, setSearch] = useState<string>('');

  const filtered = mockSignage.filter(
    (s) => s.code.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventário de Sinalização</Text>
        <Text style={styles.subtitle}>Catálogo de placas, totens e elementos cartográficos</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por código ou categoria..."
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Ionicons name="pricetag" size={24} color="#38BDF8" />
              <View>
                <Text style={styles.codeText}>{item.code}</Text>
                <Text style={styles.categoryText}>{item.category} • {item.sector.replace('SETOR_', '')}</Text>
              </View>
            </View>
            <View style={[styles.badge, item.status === 'GOOD' ? styles.badgeGood : item.status === 'REGULAR' ? styles.badgeReg : styles.badgeBad]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
    fontSize: 13,
    marginTop: 2,
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#FFFFFF',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeGood: {
    backgroundColor: '#065F46',
  },
  badgeReg: {
    backgroundColor: '#92400E',
  },
  badgeBad: {
    backgroundColor: '#991B1B',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
