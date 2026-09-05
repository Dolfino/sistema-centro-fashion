import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, useWindowDimensions, Image } from 'react-native';
import { SignagePin } from './InteractiveMallMap';
import { CapturedPhoto, mediaService } from '../services/mediaService';

interface InspecaoModalProps {
  visible: boolean;
  pin: SignagePin | null;
  onClose: () => void;
  onSave: (inspectionData: {
    conservationState: string;
    status: 'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
    notes?: string;
    photo?: CapturedPhoto;
  }) => void;
}

export const InspecaoModal: React.FC<InspecaoModalProps> = ({
  visible,
  pin,
  onClose,
  onSave,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const [estado, setEstado] = useState<string>('Boa');
  const [status, setStatus] = useState<'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'>('ATIVA');
  const [observacoes, setObservacoes] = useState<string>('');
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);

  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    if (pin) {
      setEstado(pin.conservationState || 'Boa');
      setStatus(pin.status || 'ATIVA');
      setObservacoes('');
      setPhoto(null);
    }
  }, [pin, visible]);

  if (!visible || !pin) return null;

  const handleEstadoChange = (novoEstado: string) => {
    setEstado(novoEstado);
    // Sugestão automática de status baseada no estado de conservação
    if (novoEstado === 'Danificada') {
      setStatus('SUBSTITUIR');
    } else if (novoEstado === 'Regular') {
      setStatus('MANUTENCAO');
    } else {
      setStatus('ATIVA');
    }
  };

  const handleAddPhotoPress = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      const simulated = mediaService.createPhotoFromData(
        `INSP_${Date.now()}.jpg`,
        'image/jpeg',
        1750000,
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
      );
      setPhoto(simulated);
    }
  };

  const handleWebFileSelected = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto = mediaService.createPhotoFromData(
        file.name,
        file.type || 'image/jpeg',
        file.size,
        dataUrl
      );
      setPhoto(newPhoto);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = () => {
    onSave({
      conservationState: estado,
      status,
      notes: observacoes,
      photo: photo || undefined,
    });
    onClose();
  };

  const webSelectStyle = {
    height: 38,
    border: '1px solid #DFE2EA',
    borderRadius: 8,
    padding: '0 10px',
    fontSize: 13,
    color: '#20233A',
    backgroundColor: '#FFFFFF',
    width: '100%',
    outline: 'none',
  };

  return (
    <View style={styles.overlay}>
      <View id="inspecaoPanel" style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho da Inspeção */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Vistoria Operacional em Campo</Text>
            <Text style={styles.title}>
              Nova Inspeção — {pin.assetCode}
            </Text>
          </View>

          <TouchableOpacity id="cancelarInspecao" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo do Ativo */}
        <View style={styles.pinSummaryBox}>
          <Text style={styles.pinSummaryTitle}>{pin.notes || pin.category}</Text>
          <Text style={styles.pinSummarySub}>
            Setor: {pin.sector} • Local: {pin.humanLocation || 'No corredor'}
          </Text>
        </View>

        <ScrollView id="formInspecao" style={styles.body} contentContainerStyle={styles.bodyContent}>
          {/* Seletor de Estado de Conservação */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Estado de Conservação Avaliado *</Text>
            {Platform.OS === 'web' ? (
              <select
                id="inspEstado"
                value={estado}
                onChange={(e) => handleEstadoChange(e.target.value)}
                style={webSelectStyle}
              >
                <option value="Ótima">Ótima — Sem avarias, legibilidade 100%</option>
                <option value="Boa">Boa — Pequeno desgaste natural</option>
                <option value="Regular">Regular — Requer manutenção ou limpeza</option>
                <option value="Danificada">Danificada — Quebrada ou ilegível (Urgente)</option>
              </select>
            ) : (
              <View style={styles.pickerFallback}>
                {['Ótima', 'Boa', 'Regular', 'Danificada'].map((est) => (
                  <TouchableOpacity
                    key={est}
                    style={[styles.pillOption, estado === est && styles.pillOptionActive]}
                    onPress={() => handleEstadoChange(est)}
                  >
                    <Text style={[styles.pillOptionText, estado === est && styles.pillOptionTextActive]}>
                      {est}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Status Operacional Proposto */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Status Operacional Proposto *</Text>
            {Platform.OS === 'web' ? (
              <select
                id="inspStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={webSelectStyle}
              >
                <option value="ATIVA">ATIVA — Em pleno funcionamento</option>
                <option value="MANUTENCAO">MANUTENCAO — Requer reparo preventivo/corretivo</option>
                <option value="SUBSTITUIR">SUBSTITUIR — Requer substituição de peça/totem</option>
                <option value="REMOVER">REMOVER — Sinalização obsoleta para descarte</option>
                <option value="INATIVA">INATIVA — Desativada temporariamente</option>
              </select>
            ) : (
              <Text style={styles.fallbackValue}>{status}</Text>
            )}
          </View>

          {/* Observações da Vistoria */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Observações da Vistoria</Text>
            <TextInput
              id="inspObservacoes"
              style={styles.textArea}
              placeholder="Descreva as condições encontradas, avarias ou recomendações..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={observacoes}
              onChangeText={setObservacoes}
            />
          </View>

          {/* Foto de Evidência de Inspeção */}
          <View style={styles.photoSection}>
            <Text style={styles.label}>Foto de Evidência da Inspeção</Text>
            {Platform.OS === 'web' && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleWebFileSelected}
              />
            )}
            <View style={styles.photoRow}>
              <TouchableOpacity
                id="inspFotoInput"
                style={styles.photoBtn}
                onPress={handleAddPhotoPress}
              >
                <Text style={styles.photoBtnText}>
                  {photo ? 'Substituir foto' : '📷 Capturar foto de evidência'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.photoSummary}>
                {photo ? '1 foto anexada' : 'Nenhuma foto anexada'}
              </Text>
            </View>

            {photo && (
              <View style={styles.photoPreviewBox}>
                <Image source={{ uri: photo.localUri }} style={styles.previewImg} />
                <View style={styles.previewMeta}>
                  <Text style={styles.previewName}>{photo.fileName}</Text>
                  <Text style={styles.previewSha}>SHA256: {photo.sha256.substring(0, 16)}...</Text>
                </View>
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => setPhoto(null)}
                >
                  <Text style={styles.removePhotoBtnText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Rodapé de Ações */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity id="salvarInspecao" style={styles.btnSave} onPress={handleSubmit}>
            <Text style={styles.btnSaveText}>Concluir e Salvar Inspeção</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 16, 30, 0.75)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 580,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  modalBoxMobile: {
    maxWidth: '100%',
    maxHeight: '96%',
    borderRadius: 8,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#11184F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00C8FF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  pinSummaryBox: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pinSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  pinSummarySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 18,
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  pickerFallback: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },
  pillOptionActive: {
    borderColor: '#11184F',
    backgroundColor: '#11184F',
  },
  pillOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  pillOptionTextActive: {
    color: '#FFFFFF',
  },
  fallbackValue: {
    fontSize: 13,
    color: '#1E293B',
    paddingVertical: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  photoSection: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    gap: 8,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photoBtn: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  photoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730A3',
  },
  photoSummary: {
    fontSize: 12,
    color: '#64748B',
  },
  photoPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginTop: 4,
  },
  previewImg: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  previewMeta: {
    flex: 1,
  },
  previewName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  previewSha: {
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    color: '#64748B',
    marginTop: 2,
  },
  removePhotoBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  btnCancel: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  btnCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  btnSave: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  btnSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
