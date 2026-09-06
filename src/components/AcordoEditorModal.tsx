import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FinanceiroRestritoService,
  AcordoFinanceiro,
  TipoAcordoFinanceiro,
  StatusAcordoFinanceiro,
} from '../services/financeiroRestritoService';

interface AcordoEditorModalProps {
  visible: boolean;
  onClose: () => void;
  idPermissionario: string;
  acordoParaEditar?: AcordoFinanceiro | null;
  onAcordoSalvo: (acordo: AcordoFinanceiro) => void;
  userRole?: string;
  userId?: string;
  userEmail?: string;
}

const TIPOS_ACORDO: { id: TipoAcordoFinanceiro; label: string }[] = [
  { id: 'PARCELAMENTO', label: 'Parcelamento' },
  { id: 'RENEGOCIACAO', label: 'Renegociação' },
  { id: 'DESCONTO', label: 'Desconto Pontual' },
  { id: 'CONFISSAO_DIVIDA', label: 'Confissão de Dívida' },
  { id: 'OUTRO', label: 'Outro' },
];

const STATUS_ACORDO: { id: StatusAcordoFinanceiro; label: string; cor: string }[] = [
  { id: 'ATIVO', label: 'Ativo', cor: '#10b981' },
  { id: 'EM_ANDAMENTO', label: 'Em Andamento', cor: '#f59e0b' },
  { id: 'QUITADO', label: 'Quitado', cor: '#38bdf8' },
  { id: 'ENCERRADO', label: 'Encerrado', cor: '#64748b' },
  { id: 'CANCELADO', label: 'Cancelado', cor: '#ef4444' },
];

export const AcordoEditorModal: React.FC<AcordoEditorModalProps> = ({
  visible,
  onClose,
  idPermissionario,
  acordoParaEditar,
  onAcordoSalvo,
  userRole = 'ADMIN',
  userId = 'ADMIN-01',
  userEmail = 'financeiro@cfmall.com.br',
}) => {
  const [tipo, setTipo] = useState<TipoAcordoFinanceiro>('PARCELAMENTO');
  const [dataAcordo, setDataAcordo] = useState('');
  const [valorOriginal, setValorOriginal] = useState('7000');
  const [valorNegociado, setValorNegociado] = useState('6300');
  const [quantidadeParcelas, setQuantidadeParcelas] = useState('3');
  const [parcelasPagas, setParcelasPagas] = useState('0');
  const [status, setStatus] = useState<StatusAcordoFinanceiro>('ATIVO');
  const [responsavelNegociacao, setResponsavelNegociacao] = useState('Gerência Financeira');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (acordoParaEditar) {
      setTipo(acordoParaEditar.tipo);
      setDataAcordo(acordoParaEditar.dataAcordo || '20/08/2026');
      setValorOriginal(acordoParaEditar.valorOriginal?.toString() || '0');
      setValorNegociado(acordoParaEditar.valorNegociado?.toString() || '0');
      setQuantidadeParcelas(acordoParaEditar.quantidadeParcelas?.toString() || '1');
      setParcelasPagas(acordoParaEditar.parcelasPagas?.toString() || '0');
      setStatus(acordoParaEditar.status);
      setResponsavelNegociacao(acordoParaEditar.responsavelNegociacao || 'Gerência Financeira');
      setObservacao(acordoParaEditar.observacao || '');
    } else {
      // Valores padrão do Gate L3.7
      const hoje = new Date().toLocaleDateString('pt-BR');
      setTipo('PARCELAMENTO');
      setDataAcordo(hoje);
      setValorOriginal('7000');
      setValorNegociado('6300');
      setQuantidadeParcelas('3');
      setParcelasPagas('0');
      setStatus('ATIVO');
      setResponsavelNegociacao('Gerência Financeira');
      setObservacao('Acordo formal de parcelamento de títulos.');
    }
  }, [visible, acordoParaEditar]);

  const numOriginal = parseFloat(valorOriginal) || 0;
  const numNegociado = parseFloat(valorNegociado) || 0;
  const numParcelas = parseInt(quantidadeParcelas, 10) || 1;
  const valorParcela = numParcelas > 0 ? numNegociado / numParcelas : 0;

  const handleSalvar = () => {
    if (numNegociado <= 0) {
      Alert.alert('Valor Inválido', 'O valor negociado deve ser maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      const clientRequestId = `REQ-ACD-${Date.now()}`;
      const salvo = FinanceiroRestritoService.salvarAcordo(
        idPermissionario,
        {
          idAcordo: acordoParaEditar?.idAcordo,
          tipo,
          dataAcordo: dataAcordo.trim(),
          valorOriginal: numOriginal,
          valorNegociado: numNegociado,
          quantidadeParcelas: numParcelas,
          parcelasPagas: parseInt(parcelasPagas, 10) || 0,
          status,
          responsavelNegociacao: responsavelNegociacao.trim(),
          observacao: observacao.trim(),
        },
        userRole,
        userId,
        userEmail,
        clientRequestId
      );

      setSalvando(false);
      onAcordoSalvo(salvo);
      onClose();
    } catch (err: any) {
      setSalvando(false);
      Alert.alert('Erro ao Salvar Acordo', err?.message || 'Falha na gravação.');
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBox}>
                <Ionicons name="hand-left-outline" size={20} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.modalTitle}>
                  {acordoParaEditar ? `Editar Acordo ${acordoParaEditar.idAcordo}` : 'Novo Acordo Financeiro'}
                </Text>
                <Text style={styles.badgeGov}>🔒 Instrumento Jurídico • Trilha de Auditoria L3.7</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Tipo de Acordo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Negociação</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {TIPOS_ACORDO.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.tipoPill,
                      tipo === t.id && styles.tipoPillAtivo,
                    ]}
                    onPress={() => setTipo(t.id)}
                  >
                    <Text
                      style={[
                        styles.tipoPillText,
                        tipo === t.id && styles.tipoPillTextAtivo,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Status do Acordo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusWrap}>
                {STATUS_ACORDO.map((st) => (
                  <TouchableOpacity
                    key={st.id}
                    style={[
                      styles.statusPill,
                      status === st.id && { backgroundColor: st.cor, borderColor: st.cor },
                    ]}
                    onPress={() => setStatus(st.id)}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        status === st.id && { color: '#0f172a', fontWeight: 'bold' },
                      ]}
                    >
                      {st.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Linha de Valores: Original e Negociado */}
            <View style={styles.formRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Valor Original da Dívida (R$)</Text>
                <TextInput
                  style={styles.textInput}
                  value={valorOriginal}
                  onChangeText={setValorOriginal}
                  keyboardType="numeric"
                  placeholder="7000"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Valor Negociado (R$) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={valorNegociado}
                  onChangeText={setValorNegociado}
                  keyboardType="numeric"
                  placeholder="6300"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* Parcelas e Simulação */}
            <View style={styles.parcelasBox}>
              <View style={styles.formRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Quantidade de Parcelas</Text>
                  <TextInput
                    style={styles.textInput}
                    value={quantidadeParcelas}
                    onChangeText={setQuantidadeParcelas}
                    keyboardType="numeric"
                    placeholder="3"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Data do Acordo (DD/MM/AAAA)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={dataAcordo}
                    onChangeText={setDataAcordo}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>

              <View style={styles.simulacaoParcelas}>
                <Text style={styles.simulacaoLabel}>Simulação da Parcela:</Text>
                <Text style={styles.simulacaoValor}>
                  {numParcelas}x de {FinanceiroRestritoService.formatarMoeda(valorParcela)}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Responsável pela Negociação</Text>
              <TextInput
                style={styles.textInput}
                value={responsavelNegociacao}
                onChangeText={setResponsavelNegociacao}
                placeholder="Ex: Gerência Financeira • Dr. Roberto"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Observações e Cláusulas do Termo</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={observacao}
                onChangeText={setObservacao}
                placeholder="Detalhes sobre a negociação, descontos concedidos ou condições de quitação..."
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose} disabled={salvando}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSalvar, salvando && { opacity: 0.6 }]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              <Ionicons name="save-outline" size={16} color="#fff" />
              <Text style={styles.btnSalvarText}>
                {salvando ? 'Gravando...' : acordoParaEditar ? 'Atualizar Acordo' : 'Cadastrar Acordo'}
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
    maxWidth: 620,
    maxHeight: '90%',
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
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
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '500',
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  tipoPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    marginRight: 8,
  },
  tipoPillAtivo: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  tipoPillText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  tipoPillTextAtivo: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  statusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },
  statusPillText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
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
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  parcelasBox: {
    backgroundColor: '#131d36',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 12,
    marginBottom: 14,
  },
  simulacaoParcelas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  simulacaoLabel: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  simulacaoValor: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f59e0b',
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
  btnSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#d97706',
  },
  btnSalvarText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
