import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReportingService } from '../../src/services/reportingService';

const reportingService = new ReportingService();

const samplePins = [
  { assetCode: 'SIG-20260814-0001', category: 'Placa informativa', sector: 'SETOR_AZUL', conservationStatus: 'GOOD', normalizedX: 0.35, normalizedY: 0.25 },
  { assetCode: 'SIG-20260814-0002', category: 'Placa informativa', sector: 'SETOR_AZUL', conservationStatus: 'GOOD', normalizedX: 0.65, normalizedY: 0.30 },
  { assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_VERDE', conservationStatus: 'REGULAR', normalizedX: 0.20, normalizedY: 0.70 },
  { assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_VERMELHO', conservationStatus: 'BAD', normalizedX: 0.75, normalizedY: 0.75 },
  { assetCode: 'SIG-20260814-0005', category: 'Totem Interativo', sector: 'SETOR_AMARELO', conservationStatus: 'GOOD', normalizedX: 0.50, normalizedY: 0.50 },
  { assetCode: 'SIG-20260814-0006', category: 'Placa informativa', sector: 'SETOR_AZUL', conservationStatus: 'CRITICAL', normalizedX: 0.40, normalizedY: 0.60 },
];

export default function DashboardScreen() {
  const summary = reportingService.generateSummaryReport(samplePins);

  const handleExportCSV = () => {
    const csvContent = reportingService.exportInventoryCSV(samplePins);
    Alert.alert(
      'Relatório Exportado (CSV)',
      `Gerado arquivo CSV com ${samplePins.length} registros de sinalização.\n\nConteúdo:\n${csvContent.substring(0, 180)}...`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Painel de Gestão & Auditoria</Text>
        <Text style={styles.subtitle}>Métricas consolidadas do Parque de Sinalização do Mall</Text>

        {/* KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Ionicons name="pricetags" size={24} color="#38BDF8" />
            <Text style={styles.kpiValue}>{summary.totalAssets}</Text>
            <Text style={styles.kpiLabel}>Total de Ativos</Text>
          </View>

          <View style={styles.kpiCard}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.kpiValue}>{summary.goodPercentage}%</Text>
            <Text style={styles.kpiLabel}>Em Bom Estado</Text>
          </View>

          <View style={styles.kpiCard}>
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
            <Text style={styles.kpiValue}>{summary.pendingActionsCount}</Text>
            <Text style={styles.kpiLabel}>Manutenções Urgentes</Text>
          </View>

          <View style={styles.kpiCard}>
            <Ionicons name="cloud-done" size={24} color="#A855F7" />
            <Text style={styles.kpiValue}>100%</Text>
            <Text style={styles.kpiLabel}>Sincronizado VPS</Text>
          </View>
        </View>

        {/* Sector Distribution List */}
        <Text style={styles.sectionTitle}>Distribuição por Setor</Text>
        <View style={styles.sectorList}>
          {Object.entries(summary.sectorDistribution).map(([sec, count]) => (
            <View key={sec} style={styles.sectorRow}>
              <View style={styles.sectorInfo}>
                <View style={[styles.sectorDot, { backgroundColor: sec.includes('AZUL') ? '#1D4ED8' : sec.includes('VERDE') ? '#16A34A' : sec.includes('AMARELO') ? '#EAB308' : '#DC2626' }]} />
                <Text style={styles.sectorName}>{sec.replace('SETOR_', '')}</Text>
              </View>
              <Text style={styles.sectorCount}>{count} placas</Text>
            </View>
          ))}
        </View>

        {/* Action Button: Export CSV */}
        <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV}>
          <Ionicons name="download-outline" size={20} color="#0F172A" />
          <Text style={styles.exportBtnText}>Exportar Relatório em CSV</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
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
    marginBottom: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  kpiValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  kpiLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectorList: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    marginBottom: 24,
  },
  sectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sectorName: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  sectorCount: {
    color: '#94A3B8',
    fontSize: 13,
  },
  exportBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 8,
    marginBottom: 30,
  },
  exportBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
