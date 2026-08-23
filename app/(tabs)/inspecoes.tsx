import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OutboxSyncEngine } from '../../src/sync/outboxEngine';
import { MediaService, CapturedPhoto } from '../../src/services/mediaService';

const outbox = new OutboxSyncEngine();
const mediaService = new MediaService();

export default function FieldInspectionScreen() {
  const [assetCode, setAssetCode] = useState<string>('SIG-20260814-0001');
  const [conservationState, setConservationState] = useState<'GOOD' | 'REGULAR' | 'BAD' | 'CRITICAL'>('GOOD');
  const [notes, setNotes] = useState<string>('');
  const [recommendedAction, setRecommendedAction] = useState<string>('NONE');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const handleTakePhoto = async () => {
    setIsCapturing(true);
    const photo = await mediaService.capturePhoto(assetCode);
    setCapturedPhoto(photo);
    setIsCapturing(false);

    Alert.alert(
      'Foto Capturada!',
      `Arquivo: ${photo.fileName}\nSHA256: ${photo.sha256.substring(0, 16)}...\nTamanho: ${(photo.sizeBytes / 1024 / 1024).toFixed(2)} MB`,
      [{ text: 'OK' }]
    );
  };

  const handleSaveOffline = async () => {
    const inspectionPayload = {
      assetCode,
      conservationState,
      notes,
      recommendedAction,
      photo: capturedPhoto ? {
        id: capturedPhoto.id,
        fileName: capturedPhoto.fileName,
        sha256: capturedPhoto.sha256,
        sizeBytes: capturedPhoto.sizeBytes,
      } : null,
      inspectorId: 'davidsilva.centrofashion@gmail.com',
      inspectedAt: new Date().toISOString(),
    };

    // Registrar mutação no Outbox Engine
    const mutation = await outbox.addMutation('inspection', 'CREATE', inspectionPayload);

    // Se o estado for danificado/crítico, criar ação pendente automática
    if (conservationState === 'BAD' || conservationState === 'CRITICAL') {
      await outbox.addMutation('pending_action', 'CREATE', {
        title: `Manutenção urgente em ${assetCode}`,
        priority: conservationState === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        description: `Inspeção identificou estado ${conservationState}. Ação recomendada: ${recommendedAction}`,
        signageCode: assetCode,
      });
    }

    setPendingCount(outbox.getPendingQueue().length);

    Alert.alert(
      'Inspeção Salva (Offline Outbox)',
      `Registro gravado localmente com UUID ${mutation.clientMutationId.substring(0, 8)}... e vinculado à mídia S3.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setNotes('');
            setCapturedPhoto(null);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nova Inspeção de Campo</Text>
        <Text style={styles.subtitle}>Registro de integridade, foto e outbox sync</Text>

        {/* Pending Queue Counter */}
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Ionicons name="cloud-offline-outline" size={16} color="#FDE68A" />
            <Text style={styles.pendingText}>{pendingCount} registros salvos localmente aguardando envio</Text>
          </View>
        )}

        {/* Asset Code Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Código do Ativo / Placa</Text>
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
            { key: 'CRITICAL', label: 'Crítico', color: '#B91C1C' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.stateChip,
                conservationState === item.key && { backgroundColor: item.color, borderColor: item.color },
              ]}
              onPress={() => setConservationState(item.key as any)}
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

        {/* Photo Upload & Preview Card */}
        <Text style={styles.label}>Fotografia de Registro (MinIO S3 / EXIF)</Text>
        <TouchableOpacity
          style={[styles.photoBox, capturedPhoto && styles.photoBoxSuccess]}
          onPress={handleTakePhoto}
          disabled={isCapturing}
        >
          <Ionicons
            name={capturedPhoto ? 'checkmark-circle' : 'camera'}
            size={32}
            color={capturedPhoto ? '#10B981' : '#38BDF8'}
          />
          <Text style={styles.photoText}>
            {isCapturing
              ? 'Processando captura...'
              : capturedPhoto
              ? `Foto OK: ${capturedPhoto.fileName}`
              : 'Toque para capturar foto de campo com a câmera'}
          </Text>
        </TouchableOpacity>

        {capturedPhoto && (
          <View style={styles.photoMetadataCard}>
            <View style={styles.metaRow}>
              <Ionicons name="document-attach-outline" size={16} color="#38BDF8" />
              <Text style={styles.metaText}>{capturedPhoto.fileName}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#10B981" />
              <Text style={styles.metaHash}>SHA256: {capturedPhoto.sha256}</Text>
            </View>
          </View>
        )}

        {/* Action Recommended */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ação Recomendada</Text>
          <View style={styles.actionContainer}>
            {['NONE', 'CLEAN', 'REPAIR', 'REPLACE', 'MOVE'].map((act) => (
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
            placeholder="Detalhes adicionais sobre avarias ou necessidade de reposição..."
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveOffline}>
          <Ionicons name="save-outline" size={20} color="#0F172A" />
          <Text style={styles.saveBtnText}>Finalizar e Salvar Inspeção (Outbox)</Text>
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
    gap: 6,
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
    fontSize: 12,
  },
  photoBox: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justify: 'center',
    gap: 8,
    marginBottom: 10,
  },
  photoBoxSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B22',
  },
  photoText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
  photoMetadataCard: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  metaHash: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'monospace',
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
