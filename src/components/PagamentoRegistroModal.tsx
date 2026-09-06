import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FinanceiroRestritoService,
  LancamentoFinanceiro,
} from '../services/financeiroRestritoService';

interface PagamentoRegistroModalProps {
  visible: boolean;
  onClose: () => void;
  idPermissionario: string;
  lancamento: LancamentoFinanceiro | null;
  onPagamentoRegistrado: (lancamentoAtualizado: LancamentoFinanceiro) => void;
  userRole?: string;
  userId?: string;
  userEmail?: string;
}

export const PagamentoRegistroModal: React.FC<PagamentoRegistroModalProps> = ({
  visible,
  onClose,
  idPermissionario,
  lancamento,
  onPagamentoRegistrado,
  userRole = 'ADMIN',
  userId = 'ADMIN-01',
  userEmail = 'financeiro@cfmall.com.br',
}) => {
  const [valorPagamento, setValorPagamento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!visible || !lancamento) return;

    const hoje = new Date().toLocaleDateString('pt-BR');
    setDataPagamento(hoje);
    // Sugere por padrão o saldo aberto total
    setValorPagamento(lancamento.saldoAberto.toString());
    setObservacao('Liquidação registrada via tesouraria/sistema.');
  }, [visible, lancamento]);

  if (!visible || !lancamento) return null;

  const numPagamento = parseFloat(valorPagamento) || 0;
  const saldoRestante = Math.max(0, lancamento.saldoAberto - numPagamento);
  const isQuitacaoTotal = numPagamento >= lancamento.saldoAberto;

  const handleQuitarTotal = () => {
    setValorPagamento(lancamento.saldoAberto.toString());
  };

  const handleConfirmarPagamento = () => {
    if (numPagamento <= 0) {
      Alert.alert('Valor Inválido', 'O valor do pagamento deve ser superior a zero.');
      return;
    }

    if (numPagamento > lancamento.saldoAberto) {
      Alert.alert(
        'Valor Excede o Saldo',
        `O pagamento informado (${FinanceiroRestritoService.formatarMoeda(
          numPagamento
        )}) é maior que o saldo em aberto (${FinanceiroRestritoService.formatarMoeda(
          lancamento.saldoAberto
        )}).`
      );
      return;
    }

    if (!observacao.trim()) {
      Alert.alert('Observação Obrigatória', 'Informe o comprovante ou observação do pagamento.');
      return;
    }

    setSalvando(true);
    try {
      const clientRequestId = `REQ-PAG-${Date.now()}`;
      const atualizado = FinanceiroRestritoService.registrarPagamento(
        idPermissionario,
        lancamento.idLancamento,
        numPagamento,
        observacao.trim(),
        dataPagamento.trim(),
        userRole,
        userId,
        userEmail,
        clientRequestId
      );

      setSalvando(false);
      onPagamentoRegistrado(atualizado);
      onClose();
    } catch (err: any) {
      setSalvando(false);
      Alert.alert('Erro ao Registrar Pagamento', err?.message || 'Falha ao processar baixa.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBox}>
                <Ionicons name="card-outline" size={20} color="#10b981" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Registrar Pagamento / Baixa</Text>
                <Text style={styles.badgeGov}>🔒 Operação Auditada • Fase L3.7</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Resumo do Lançamento */}
          <View style={styles.cardResumo}>
            <View style={styles.resumoTop}>
              <Text style={styles.competenciaBadge}>{lancamento.competencia}</Text>
              <Text style={styles.resumoDescricao}>{lancamento.descricao}</Text>
            </View>

            <View style={styles.valoresGrid}>
              <View style={styles.valorItem}>
                <Text style={styles.valorLabel}>Original</Text>
                <Text style={styles.valorTexto}>
                  {FinanceiroRestritoService.formatarMoeda(lancamento.valorOriginal)}
                </Text>
              </View>

              <View style={styles.valorItem}>
                <Text style={styles.valorLabel}>Já Amortizado</Text>
                <Text style={[styles.valorTexto, { color: '#10b981' }]}>
                  {FinanceiroRestritoService.formatarMoeda(lancamento.valorPago)}
                </Text>
              </View>

              <View style={styles.valorItem}>
                <Text style={styles.valorLabel}>Saldo Atual Aberto</Text>
                <Text style={[styles.valorTexto, { color: '#ef4444', fontWeight: '800' }]}>
                  {FinanceiroRestritoService.formatarMoeda(lancamento.saldoAberto)}
                </Text>
              </View>
            </View>
          </View>

          {/* Formulário de Baixa */}
          <View style={styles.formArea}>
            <View style={styles.inputHeaderRow}>
              <Text style={styles.inputLabel}>Valor a Pagar (R$) *</Text>
              <TouchableOpacity style={styles.btnQuitarTotal} onPress={handleQuitarTotal}>
                <Ionicons name="flash-outline" size={13} color="#38bdf8" />
                <Text style={styles.btnQuitarTotalText}>Quitar Total</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInputGrande}
              value={valorPagamento}
              onChangeText={setValorPagamento}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#64748b"
            />

            {/* Simulação do Saldo Pós-Pagamento */}
            <View style={styles.posPagamentoBox}>
              <View>
                <Text style={styles.posLabel}>Tipo de Baixa Resultante</Text>
                <Text
                  style={[
                    styles.posTipoBadge,
                    { color: isQuitacaoTotal ? '#10b981' : '#f59e0b' },
                  ]}
                >
                  {isQuitacaoTotal ? '● BAIXA TOTAL (Liquidação)' : '● AMORTIZAÇÃO PARCIAL'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.posLabel}>Saldo Remanescente</Text>
                <Text style={styles.posSaldoTexto}>
                  {FinanceiroRestritoService.formatarMoeda(saldoRestante)}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data do Pagamento (DD/MM/AAAA)</Text>
              <TextInput
                style={styles.textInput}
                value={dataPagamento}
                onChangeText={setDataPagamento}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Observação / Comprovante / Meio de Pagamento *</Text>
              <TextInput
                style={styles.textInput}
                value={observacao}
                onChangeText={setObservacao}
                placeholder="Ex: Pagamento confirmado via PIX / Depósito ref. boleto"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          {/* Rodapé */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose} disabled={salvando}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnConfirmar, salvando && { opacity: 0.6 }]}
              onPress={handleConfirmarPagamento}
              disabled={salvando}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={styles.btnConfirmarText}>
                {salvando ? 'Processando...' : isQuitacaoTotal ? 'Confirmar Baixa Total' : 'Confirmar Amortização'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 580,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  badgeGov: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  cardResumo: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resumoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  competenciaBadge: {
    backgroundColor: '#0284c7',
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  resumoDescricao: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
  },
  valoresGrid: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  valorItem: {
    flex: 1,
    alignItems: 'center',
  },
  valorLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 2,
  },
  valorTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
  },
  formArea: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 6,
  },
  btnQuitarTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  btnQuitarTotalText: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  textInputGrande: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  posPagamentoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131d36',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  posLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  posTipoBadge: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  posSaldoTexto: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 13,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  btnCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  btnCancelarText: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  btnConfirmar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#10b981',
  },
  btnConfirmarText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
