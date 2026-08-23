import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OutboxSyncEngine } from '../../src/sync/outboxEngine';

const outbox = new OutboxSyncEngine();

export default function FieldInspectionScreen() {
  const [assetCode, setAssetCode] = useState<string>('SIG-20260814-0001');
  const [conservationState, setConservationState] = useState<string>('GOOD');
  const [notes, setNotes] = useState<string>('');
  const [recommendedAction, setRecommendedAction] = useState<string>('NONE');
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const handleSaveOffline = async () => {
    const mutation = await outbox.addMutation('inspection', 'CREATE', {
      assetCode,
      conservationState,
      notes,
      recommendedAction,
      hasPhoto,
      inspectorId: 'davidsilva.centrofashion@gmail.com',
    });

    setPendingCount(outbox.getPendingQueue().length);

    Alert.alert(
      'Salvo Localmente (Offline)',
      `A inspeção (${assetCode}) foi gravada no banco local com UUID ${mutation.clientMutationId.substring(0, 8)}... e adicionada à fila Outbox.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nova Inspeção de Campo</Text>
        <Text style={styles.subtitle}>Registro offline instantâneo com outbox sync engine</Text>

        {/* Pending Queue Counter */}
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Ionicons name="cloud-offline-outline" size={16} color="#F59E0B" />
            <Text style={styles.pendingText}>{pendingCount} mutações salvas localmente aguardando envio</Text>
          </View>
        )}

        {/* Asset Code Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Código do Ativo / Placa Legada</Text>
          <TextInput
            style={styles.input}
            value={assetCode}
            onChangeText={setAssetCode}
            placeholder="Ex: SIG-20260814-0001"
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Conservation State Selection */}
        <Text style={styles.label}>Estado de Conservação</Text>
        <View style={styles.stateContainer}>
          {[
            { key: 'GOOD', label: 'Bom', color: '#10B981' },
            { key: 'REGULAR', label: 'Regular', color: '#F59E0B' },
            { key: 'BAD', label: 'Danificado', color: '#EF4444' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.stateChip,
                conservationState === item.key && { backgroundColor: item.color, borderColor: item.color },
              ]}
              onPress={() => setConservationState(item.key)}
            >
              <Text
                style={[
                  styles.stateText,
                  conservationState === item.key && { color: '#FFFFFF', fontWeight: 'bold' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Photo Upload Sandbox */}
        <Text style={styles.label}>Fotografia de Registro (MinIO S3)</Text>
        <TouchableOpacity
          style={[styles.photoBox, hasPhoto && styles.photoBoxSuccess]}
          onPress={() => setHasPhoto(!hasPhoto)}
        >
          <Ionicons name={hasPhoto ? 'checkmark-circle' : 'camera'} size={32} color={hasPhoto ? '#10B981' : '#38BDF8'} />
          <Text style={styles.photoText}>
            {hasPhoto ? 'Foto capturada e salva no armazenamento local' : 'Toque para capturar foto de campo'}
          </Text>
        </TouchableOpacity>

        {/* Action Recommended */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ação Recomendada</Text>
          <View style={styles.actionContainer}>
            {['NONE', 'CLEAN', 'REPAIR', 'REPLACE'].map((act) => (
              <TouchableOpacity
                key={act}
                style={[styles.actionChip, recommendedAction === act && styles.actionChipActive]}
                onPress={() => setRecommendedAction(act)}
              >
                <Text style={[styles.actionText, recommendedAction === act && styles.actionTextActive]}>
                  {act}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Observações de Campo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholder="Detalhes de conservação ou substituição..."
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveOffline}>
          <Ionicons name="save-outline" size={20} color="#0F172A" />
          <Text style={styles.saveBtnText}>Salvar Inspeção Offline (Outbox Engine)</Text>
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
    marginBottom: 16,
  },
  pendingBadge: {
    backgroundColor: '#78350F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  pendingText: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  stateContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  stateChip: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  stateText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  photoBox: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justify: 'center',
    gap: 8,
    marginBottom: 16,
  },
  photoBoxSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  photoText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  actionText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  actionTextActive: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  saveBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
