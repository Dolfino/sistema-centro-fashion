import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useWindowDimensions, Platform, Alert } from 'react-native';
import { SignagePin } from './InteractiveMallMap';

interface CicloVidaModalProps {
  visible: boolean;
  pin: SignagePin | null;
  onClose: () => void;
  onUpdateStatus: (newStatus: 'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA', justificativa: string) => void;
  onDeletePin: (pinId: string) => void;
}

export const CicloVidaModal: React.FC<CicloVidaModalProps> = ({
  visible,
  pin,
  onClose,
  onUpdateStatus,
  onDeletePin,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const [novoStatus, setNovoStatus] = useState<'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA'>('MANUTENCAO');
  const [justificativa, setJustificativa] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  if (!visible || !pin) return null;

  const handleSubmit = () => {
    onUpdateStatus(novoStatus, justificativa);
    onClose();
  };

  const handleConfirmDelete = () => {
    onDeletePin(pin.id);
    setShowConfirmDelete(false);
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
      <View id="cicloVidaPanelS18" style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Ciclo de Vida & Transição Operacional (S18)</Text>
            <Text style={styles.title}>
              Ciclo de Vida — {pin.assetCode}
            </Text>
          </View>

          <TouchableOpacity id="btnFecharCicloVida" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo */}
        <View style={styles.pinSummary}>
          <Text style={styles.pinTitle}>{pin.notes || pin.category}</Text>
          <View style={styles.statusCurrentRow}>
            <Text style={styles.statusCurrentLabel}>Status Atual:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{pin.status}</Text>
            </View>
          </View>
        </View>

        {/* Formulário do Editor de Ciclo (#eventoCicloEditorS18) */}
        <ScrollView id="eventoCicloEditorS18" style={styles.body} contentContainerStyle={styles.bodyContent}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Transitar para Novo Estado Operacional *</Text>
            {Platform.OS === 'web' ? (
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value as any)}
                style={webSelectStyle}
              >
                <option value="ATIVA">ATIVA — Plena operação no mall</option>
                <option value="MANUTENCAO">MANUTENCAO — Em reparo preventivo/corretivo</option>
                <option value="SUBSTITUIR">SUBSTITUIR — Aguardando nova peça/totem</option>
                <option value="REMOVER">REMOVER — Sinalização obsoleta para retirada</option>
                <option value="INATIVA">INATIVA — Desativada temporariamente</option>
              </select>
            ) : (
              <Text style={styles.fallbackValue}>{novoStatus}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Motivo da Transição / Justificativa</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva o motivo da mudança de fase (ex: desgaste natural, avaria por cliente, substituição por nova campanha)..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={justificativa}
              onChangeText={setJustificativa}
            />
          </View>

          {/* Seção Perigosa: Exclusão do Registro S23.6 */}
          <View style={styles.dangerSection}>
            <Text style={styles.dangerTitle}>Ação Destrutiva / Descarte (S23.6)</Text>
            <Text style={styles.dangerText}>
              Ao excluir o registro, o ativo deixará de constar no inventário ativo do mapa e será arquivado no histórico de descarte.
            </Text>

            {!showConfirmDelete ? (
              <TouchableOpacity
                id="btnExcluirRegistroS236"
                style={styles.btnDelete}
                onPress={() => setShowConfirmDelete(true)}
              >
                <Text style={styles.btnDeleteText}>🗑️ Excluir / Desativar Registro Definitivamente</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.confirmDeleteBox}>
                <Text style={styles.confirmDeleteMsg}>
                  ⚠️ Tem certeza? O registro <Text style={{ fontWeight: '800' }}>{pin.assetCode}</Text> será removido do mapa imediatamente.
                </Text>
                <View style={styles.confirmDeleteRow}>
                  <TouchableOpacity
                    id="btnConfirmarExclusaoReal"
                    style={styles.btnDeleteConfirm}
                    onPress={handleConfirmDelete}
                  >
                    <Text style={styles.btnDeleteConfirmText}>🗑️ Sim, Excluir Definitivamente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnDeleteCancel}
                    onPress={() => setShowConfirmDelete(false)}
                  >
                    <Text style={styles.btnDeleteCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Rodapé */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity id="salvarCicloVida" style={styles.btnSave} onPress={handleSubmit}>
            <Text style={styles.btnSaveText}>Salvar Transição de Fase</Text>
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
  pinSummary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pinTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusCurrentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusCurrentLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statusBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
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
  dangerSection: {
    marginTop: 8,
    padding: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    gap: 8,
  },
  dangerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
    textTransform: 'uppercase',
  },
  dangerText: {
    fontSize: 11,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  btnDelete: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnDeleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  confirmDeleteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    gap: 10,
  },
  confirmDeleteMsg: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 18,
  },
  confirmDeleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  btnDeleteConfirm: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnDeleteConfirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  btnDeleteCancel: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnDeleteCancelText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: '#2563EB',
  },
  btnSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
