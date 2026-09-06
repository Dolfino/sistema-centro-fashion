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
  LancamentoFinanceiro,
  TipoCobrancaFinanceira,
  ContratoLocacao,
} from '../services/financeiroRestritoService';

interface LancamentoEditorModalProps {
  visible: boolean;
  onClose: () => void;
  idPermissionario: string;
  contratosDisponiveis: ContratoLocacao[];
  lancamentoParaAjustar?: LancamentoFinanceiro | null;
  onLancamentoSalvo: (lancamento: LancamentoFinanceiro) => void;
  userRole?: string;
  userId?: string;
  userEmail?: string;
}

const TIPOS_COBRANCA: { id: TipoCobrancaFinanceira; label: string }[] = [
  { id: 'ALUGUEL_MINIMO', label: 'Aluguel Mínimo' },
  { id: 'FUNDO_PROMOCAO', label: 'Fundo Promoção' },
  { id: 'CONDOMINIO', label: 'Condomínio' },
  { id: 'ENERGIA', label: 'Energia Elétrica' },
  { id: 'TAXA_OPERACIONAL', label: 'Taxa Operacional' },
  { id: 'MULTA', label: 'Multa' },
  { id: 'ENCARGOS', label: 'Encargos / Juros' },
  { id: 'OUTRO', label: 'Outro' },
];

export const LancamentoEditorModal: React.FC<LancamentoEditorModalProps> = ({
  visible,
  onClose,
  idPermissionario,
  contratosDisponiveis,
  lancamentoParaAjustar,
  onLancamentoSalvo,
  userRole = 'ADMIN',
  userId = 'ADMIN-01',
  userEmail = 'financeiro@cfmall.com.br',
}) => {
  const [idContrato, setIdContrato] = useState<string>('');
  const [competencia, setCompetencia] = useState('09/2026');
  const [tipoCobranca, setTipoCobranca] = useState<TipoCobrancaFinanceira>('ALUGUEL_MINIMO');
  const [descricao, setDescricao] = useState('');
  const [dataEmissao, setDataEmissao] = useState('01/09/2026');
  const [dataVencimento, setDataVencimento] = useState('10/09/2026');
  const [valorOriginal, setValorOriginal] = useState('5500');
  const [acrescimos, setAcrescimos] = useState('0');
  const [descontos, setDescontos] = useState('0');
  const [justificativaAjuste, setJustificativaAjuste] = useState('');
  const [salvando, setSalvando] = useState(false);

  const isModoAjuste = !!lancamentoParaAjustar;

  useEffect(() => {
    if (!visible) return;

    if (lancamentoParaAjustar) {
      setIdContrato(lancamentoParaAjustar.idContrato || '');
      setCompetencia(lancamentoParaAjustar.competencia || '09/2026');
      setTipoCobranca(lancamentoParaAjustar.tipoCobranca || 'ALUGUEL_MINIMO');
      setDescricao(lancamentoParaAjustar.descricao || '');
      setDataEmissao(lancamentoParaAjustar.dataEmissao || '01/09/2026');
      setDataVencimento(lancamentoParaAjustar.dataVencimento || '10/09/2026');
      setValorOriginal(lancamentoParaAjustar.valorOriginal?.toString() || '0');
      setAcrescimos(lancamentoParaAjustar.acrescimos?.toString() || '0');
      setDescontos(lancamentoParaAjustar.descontos?.toString() || '0');
      setJustificativaAjuste(lancamentoParaAjustar.justificativaAjuste || '');
    } else {
      // Novo lançamento padrão do Gate L3.7
      const contratoPadrao = contratosDisponiveis[0]?.numeroContrato || 'TESTE-L36-0001';
      setIdContrato(contratoPadrao);
      setCompetencia('09/2026');
      setTipoCobranca('ALUGUEL_MINIMO');
      setDescricao('Aluguel mínimo setembro/2026 - teste L3.7');
      setDataEmissao('01/09/2026');
      setDataVencimento('10/09/2026');
      setValorOriginal('5500');
      setAcrescimos('0');
      setDescontos('0');
      setJustificativaAjuste('');
    }
  }, [visible, lancamentoParaAjustar, contratosDisponiveis]);

  // Cálculo dinâmico do saldo
  const numOriginal = parseFloat(valorOriginal) || 0;
  const numAcrescimos = parseFloat(acrescimos) || 0;
  const numDescontos = parseFloat(descontos) || 0;
  const numValorPago = lancamentoParaAjustar?.valorPago || 0;
  const saldoCalculado = Math.max(0, numOriginal + numAcrescimos - numDescontos - numValorPago);

  const handleSalvar = () => {
    if (!descricao.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, informe a descrição do lançamento.');
      return;
    }

    if (numOriginal <= 0) {
      Alert.alert('Valor Inválido', 'O valor original do lançamento deve ser maior que zero.');
      return;
    }

    if (isModoAjuste && !justificativaAjuste.trim()) {
      Alert.alert('Justificativa Obrigatória', 'Informe o motivo/justificativa para o ajuste financeiro.');
      return;
    }

    setSalvando(true);
    try {
      const clientRequestId = `REQ-LAN-${Date.now()}`;

      if (isModoAjuste && lancamentoParaAjustar) {
        const atualizado = FinanceiroRestritoService.ajustarLancamento(
          idPermissionario,
          lancamentoParaAjustar.idLancamento,
          {
            valorOriginal: numOriginal,
            acrescimos: numAcrescimos,
            descontos: numDescontos,
            descricao: descricao.trim(),
            dataVencimento: dataVencimento.trim(),
          },
          justificativaAjuste.trim(),
          userRole,
          userId,
          userEmail,
          clientRequestId
        );
        onLancamentoSalvo(atualizado);
      } else {
        const novo = FinanceiroRestritoService.criarLancamento(
          idPermissionario,
          {
            idContrato,
            competencia: competencia.trim(),
            tipoCobranca,
            descricao: descricao.trim(),
            dataEmissao: dataEmissao.trim(),
            dataVencimento: dataVencimento.trim(),
            valorOriginal: numOriginal,
            acrescimos: numAcrescimos,
            descontos: numDescontos,
          },
          userRole,
          userId,
          userEmail,
          clientRequestId
        );
        onLancamentoSalvo(novo);
      }

      setSalvando(false);
      onClose();
    } catch (err: any) {
      setSalvando(false);
      Alert.alert('Erro ao Gravar', err?.message || 'Falha ao salvar lançamento financeiro.');
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Topo do Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBox}>
                <Ionicons
                  name={isModoAjuste ? 'options-outline' : 'add-circle-outline'}
                  size={20}
                  color="#38bdf8"
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>
                  {isModoAjuste
                    ? `Ajustar Lançamento ${lancamentoParaAjustar?.idLancamento}`
                    : 'Novo Lançamento Financeiro'}
                </Text>
                <Text style={styles.badgeGov}>🔒 Operação Controlada • Trilha de Auditoria L3.7</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Seletor de Contrato e Competência */}
            <View style={styles.formRow}>
              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={styles.inputLabel}>Contrato Relacionado</Text>
                <TextInput
                  style={styles.textInput}
                  value={idContrato}
                  onChangeText={setIdContrato}
                  placeholder="Número do contrato (ex: TESTE-L36-0001)"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 0.8 }]}>
                <Text style={styles.inputLabel}>Competência (MM/AAAA) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={competencia}
                  onChangeText={setCompetencia}
                  placeholder="09/2026"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* Tipo de Cobrança */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Cobrança</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {TIPOS_COBRANCA.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.tipoPill,
                      tipoCobranca === t.id && styles.tipoPillAtivo,
                    ]}
                    onPress={() => setTipoCobranca(t.id)}
                  >
                    <Text
                      style={[
                        styles.tipoPillText,
                        tipoCobranca === t.id && styles.tipoPillTextAtivo,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição da Cobrança *</Text>
              <TextInput
                style={styles.textInput}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Ex: Aluguel mínimo setembro/2026 - teste L3.7"
                placeholderTextColor="#64748b"
              />
            </View>

            {/* Datas de Emissão e Vencimento */}
            <View style={styles.formRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Data de Emissão (DD/MM/AAAA)</Text>
                <TextInput
                  style={styles.textInput}
                  value={dataEmissao}
                  onChangeText={setDataEmissao}
                  placeholder="01/09/2026"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Data de Vencimento (DD/MM/AAAA) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={dataVencimento}
                  onChangeText={setDataVencimento}
                  placeholder="10/09/2026"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            {/* Composição Financeira: Original, Acréscimos, Descontos */}
            <View style={styles.valoresBox}>
              <Text style={styles.valoresBoxTitle}>Composição e Ajustes Financeiros</Text>

              <View style={styles.formRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Valor Original (R$) *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={valorOriginal}
                    onChangeText={setValorOriginal}
                    keyboardType="numeric"
                    placeholder="5500"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Acréscimos (R$)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={acrescimos}
                    onChangeText={setAcrescimos}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Descontos (R$)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={descontos}
                    onChangeText={setDescontos}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>

              {/* Box de Saldo Calculado */}
              <View style={styles.saldoCalculadoRow}>
                <View>
                  <Text style={styles.saldoCalculadoLabel}>Saldo Aberto Resultante</Text>
                  {isModoAjuste && numValorPago > 0 && (
                    <Text style={styles.valorPagoAviso}>
                      (Já amortizado: {FinanceiroRestritoService.formatarMoeda(numValorPago)})
                    </Text>
                  )}
                </View>
                <Text style={styles.saldoCalculadoValor}>
                  {FinanceiroRestritoService.formatarMoeda(saldoCalculado)}
                </Text>
              </View>
            </View>

            {/* Justificativa Obrigatória para Ajustes */}
            {isModoAjuste && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: '#f59e0b', fontWeight: 'bold' }]}>
                  Justificativa do Ajuste (Obrigatória para Auditoria) *
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={justificativaAjuste}
                  onChangeText={setJustificativaAjuste}
                  placeholder="Informe a fundamentação contratual, acordo comercial ou despacho para esta alteração..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Rodapé de Ações */}
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
                {salvando ? 'Gravando...' : isModoAjuste ? 'Salvar Ajuste' : 'Criar Lançamento'}
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
    maxWidth: 680,
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
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
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
    color: '#38bdf8',
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
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  tipoPillText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  tipoPillTextAtivo: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  valoresBox: {
    backgroundColor: '#131d36',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    marginBottom: 16,
  },
  valoresBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  saldoCalculadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    marginTop: 4,
  },
  saldoCalculadoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  valorPagoAviso: {
    fontSize: 11,
    color: '#94a3b8',
  },
  saldoCalculadoValor: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38bdf8',
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
    backgroundColor: '#0284c7',
  },
  btnSalvarText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
