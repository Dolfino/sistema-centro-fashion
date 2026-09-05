import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useWindowDimensions } from 'react-native';
import { SignagePin } from './InteractiveMallMap';

export interface PendenciaItem {
  id: string;
  pinId: string;
  descricao: string;
  status: 'PENDENTE' | 'RESOLVIDA';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  dataCriacao: string;
}

interface PendenciasModalProps {
  visible: boolean;
  pin: SignagePin | null;
  onClose: () => void;
}

export const PendenciasModal: React.FC<PendenciasModalProps> = ({
  visible,
  pin,
  onClose,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const [novaDescricao, setNovaDescricao] = useState<string>('');
  const [pendencias, setPendencias] = useState<PendenciaItem[]>([
    {
      id: 'p1',
      pinId: '1',
      descricao: 'Verificar alinhamento da fixação na parede',
      status: 'PENDENTE',
      prioridade: 'MEDIA',
      dataCriacao: '2026-08-25',
    },
    {
      id: 'p2',
      pinId: '1',
      descricao: 'Limpeza periódica de poeira da superfície de acrílico',
      status: 'RESOLVIDA',
      prioridade: 'BAIXA',
      dataCriacao: '2026-08-18',
    },
    {
      id: 'p3',
      pinId: '4',
      descricao: 'Substituir placa danificada na quina inferior',
      status: 'PENDENTE',
      prioridade: 'ALTA',
      dataCriacao: '2026-09-05',
    },
  ]);

  if (!visible || !pin) return null;

  const pinPendencias = pendencias.filter((p) => p.pinId === pin.id || p.pinId === '1');

  const handleToggleStatus = (id: string) => {
    setPendencias((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'PENDENTE' ? 'RESOLVIDA' : 'PENDENTE',
            }
          : item
      )
    );
  };

  const handleAddPendencia = () => {
    if (!novaDescricao.trim()) return;

    const newItem: PendenciaItem = {
      id: `p_${Date.now()}`,
      pinId: pin.id,
      descricao: novaDescricao.trim(),
      status: 'PENDENTE',
      prioridade: 'MEDIA',
      dataCriacao: new Date().toISOString().split('T')[0],
    };

    setPendencias((prev) => [newItem, ...prev]);
    setNovaDescricao('');
  };

  return (
    <View style={styles.overlay}>
      <View id="pendenciasPanel" style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Gestão Operacional de Pendências (S10)</Text>
            <Text style={styles.title}>
              Pendências — {pin.assetCode}
            </Text>
          </View>

          <TouchableOpacity id="btnFecharPendencias" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo */}
        <View style={styles.pinSummary}>
          <Text style={styles.pinTitle}>{pin.notes || pin.category}</Text>
          <Text style={styles.pinSector}>
            {pinPendencias.filter((p) => p.status === 'PENDENTE').length} pendência(s) em aberto
          </Text>
        </View>

        {/* Campo para Nova Pendência */}
        <View style={styles.addSection}>
          <TextInput
            id="novaPendenciaInput"
            style={styles.input}
            placeholder="Descreva uma nova ação corretiva ou preventiva..."
            placeholderTextColor="#94A3B8"
            value={novaDescricao}
            onChangeText={setNovaDescricao}
          />
          <TouchableOpacity
            id="btnAdicionarPendencia"
            style={styles.btnAdd}
            onPress={handleAddPendencia}
          >
            <Text style={styles.btnAddText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Pendências (#pendenciasListaS10) */}
        <ScrollView id="pendenciasListaS10" style={styles.body} contentContainerStyle={styles.bodyContent}>
          {pinPendencias.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Nenhuma pendência cadastrada para esta sinalização.</Text>
            </View>
          ) : (
            pinPendencias.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, item.status === 'RESOLVIDA' && styles.itemCardResolved]}
                onPress={() => handleToggleStatus(item.id)}
                activeOpacity={0.7}
              >
                {/* Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    item.status === 'RESOLVIDA' && styles.checkboxChecked,
                  ]}
                >
                  {item.status === 'RESOLVIDA' && <Text style={styles.checkmark}>✓</Text>}
                </View>

                {/* Descrição e Metadados */}
                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemDesc,
                      item.status === 'RESOLVIDA' && styles.itemDescResolved,
                    ]}
                  >
                    {item.descricao}
                  </Text>
                  <View style={styles.itemMetaRow}>
                    <Text style={styles.itemDate}>Criada em: {item.dataCriacao}</Text>
                    <View
                      style={[
                        styles.prioPill,
                        item.prioridade === 'ALTA'
                          ? styles.prioHigh
                          : item.prioridade === 'MEDIA'
                          ? styles.prioMed
                          : styles.prioLow,
                      ]}
                    >
                      <Text style={styles.prioText}>{item.prioridade}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Rodapé */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnCloseText}>Concluir</Text>
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
  pinSector: {
    fontSize: 12,
    color: '#E08B00',
    fontWeight: '600',
    marginTop: 2,
  },
  addSection: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  btnAdd: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    gap: 10,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 12,
  },
  itemCardResolved: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.75,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemDesc: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  itemDescResolved: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  prioPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prioHigh: {
    backgroundColor: '#FEE2E2',
  },
  prioMed: {
    backgroundColor: '#FEF3C7',
  },
  prioLow: {
    backgroundColor: '#E0F2FE',
  },
  prioText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  btnClose: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#11184F',
  },
  btnCloseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
