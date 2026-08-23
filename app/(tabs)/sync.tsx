import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OutboxItem {
  id: string;
  entityType: string;
  action: string;
  timestamp: string;
  status: 'PENDING' | 'SYNCED';
}

const mockOutbox: OutboxItem[] = [
  { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', entityType: 'Inspection', action: 'CREATE', timestamp: '2026-08-23 12:05:10', status: 'PENDING' },
  { id: '2c8d7bde-ccfd-4c3e-a86e-bc9efccd5cfe', entityType: 'MediaPhoto', action: 'UPLOAD', timestamp: '2026-08-23 12:05:12', status: 'PENDING' },
  { id: '3d9e8cef-ddfe-5d4f-b97f-cd0fgdde6def', entityType: 'SignagePosition', action: 'UPDATE', timestamp: '2026-08-23 11:45:00', status: 'SYNCED' },
];

export default function SyncScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fila de Sincronização (Outbox)</Text>
        <Text style={styles.subtitle}>Mutações locais salvas no dispositivo aguardando conexão</Text>
      </View>

      <TouchableOpacity style={styles.syncNowBtn}>
        <Ionicons name="sync" size={18} color="#FFFFFF" />
        <Text style={styles.syncNowText}>Forçar Sincronização com VPS</Text>
      </TouchableOpacity>

      <FlatList
        data={mockOutbox}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.tagGroup}>
                <Text style={styles.actionTag}>{item.action}</Text>
                <Text style={styles.entityName}>{item.entityType}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'SYNCED' ? styles.statusSynced : styles.statusPending]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.uuidText}>UUID: {item.id}</Text>
            <Text style={styles.timeText}>{item.timestamp}</Text>
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
  },
  syncNowBtn: {
    backgroundColor: '#059669',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncNowText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionTag: {
    backgroundColor: '#334155',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  entityName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#92400E',
  },
  statusSynced: {
    backgroundColor: '#065F46',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  uuidText: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
});
