import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AuditoriaVendasService,
  RegistroAuditoriaVenda,
  StatusAuditoriaVenda,
  OrigemDadoAuditoria,
} from '../services/auditoriaVendasService';

interface AuditoriaVendasEditorModalProps {
  visible: boolean;
  onClose: () => void;
  auditoriaParaEditar?: RegistroAuditoriaVenda | null;
  onAuditoriaSalva: (auditoria: RegistroAuditoriaVenda) => void;
  userRole?: string;
  userId?: string;
  userEmail?: string;
}

const ORIGENS_DADO: { id: OrigemDadoAuditoria; label: string }[] = [
  { id: 'AUDITORIA_PRESENCIAL', label: 'Auditoria Presencial / Aferição' },
  { id: 'DECLARACAO_PORTAL', label: 'Declaração Portal do Lojista' },
  { id: 'INTEGRACAO_FISCAL', label: 'Integração Fiscal / SPED / NFC-e' },
  { id: 'AFERICAO_AMOSTRAL', label: 'Aferição por Amostragem / Fita' },
  { id: 'OUTRO', label: 'Outro Método' },
];

const STATUS_OPCOES: { id: StatusAuditoriaVenda; label: string }[] = [
  { id: 'DIVERGENTE', label: 'Divergente' },
  { id: 'CONFORME', label: 'Conforme' },
  { id: 'PENDENTE', label: 'Pendente' },
  { id: 'EM_ANALISE', label: 'Em Análise' },
  { id: 'CONTESTADA', label: 'Contestada' },
  { id: 'CONCLUIDA', label: 'Concluída' },
];

export const AuditoriaVendasEditorModal: React.FC<AuditoriaVendasEditorModalProps> = ({
  visible,
  onClose,
  auditoriaParaEditar,
  onAuditoriaSalva,
  userRole = 'ADMIN',
  userId = 'AUDITOR-01',
  userEmail = 'auditoria@cfmall.com.br',
}) => {
  const isEdicao = Boolean(auditoriaParaEditar);

  // Campos do formulário
  const [nomeLoja, setNomeLoja] = useState('');
  const [idLoja, setIdLoja] = useState('');
  const [numeroEspaco, setNumeroEspaco] = useState('');
  const [setorEspaco, setSetorEspaco] = useState('Setor Azul');
  const [nomePermissionario, setNomePermissionario] = useState('');
  const [idPermissionario, setIdPermissionario] = useState('');
  const [idContrato, setIdContrato] = useState('');
  const [competencia, setCompetencia] = useState('2026-08');
  const [faturamentoDeclarado, setFaturamentoDeclarado] = useState('120000');
  const [faturamentoAuditado, setFaturamentoAuditado] = useState('135000');
  const [percentualContratual, setPercentualContratual] = useState('4.0');
  const [aluguelMinimo, setAluguelMinimo] = useState('5500');
  const [origemDado, setOrigemDado] = useState<OrigemDadoAuditoria>('AUDITORIA_PRESENCIAL');
  const [statusManual, setStatusManual] = useState<StatusAuditoriaVenda | null>(null);
  const [documentoNome, setDocumentoNome] = useState('');
  const [observacao, setObservacao] = useState('');
  const [justificativa, setJustificativa] = useState('');

  const [erroMsg, setErroMsg] = useState('');

  // Carregar dados na abertura
  useEffect(() => {
    if (visible) {
      setErroMsg('');
      if (auditoriaParaEditar) {
        setNomeLoja(auditoriaParaEditar.nomeLoja);
        setIdLoja(auditoriaParaEditar.idLoja);
        setNumeroEspaco(auditoriaParaEditar.numeroEspaco);
        setSetorEspaco(auditoriaParaEditar.setorEspaco);
        setNomePermissionario(auditoriaParaEditar.nomePermissionario);
        setIdPermissionario(auditoriaParaEditar.idPermissionario);
        setIdContrato(auditoriaParaEditar.idContrato);
        setCompetencia(auditoriaParaEditar.competencia);
        setFaturamentoDeclarado(String(auditoriaParaEditar.faturamentoDeclarado));
        setFaturamentoAuditado(String(auditoriaParaEditar.faturamentoAuditado));
        setPercentualContratual(String(auditoriaParaEditar.percentualContratual));
        setAluguelMinimo(String(auditoriaParaEditar.aluguelMinimoReferencia));
        setOrigemDado(auditoriaParaEditar.origemDado);
        setStatusManual(auditoriaParaEditar.status);
        setDocumentoNome(auditoriaParaEditar.documentoNome || '');
        setObservacao(auditoriaParaEditar.observacao || '');
        setJustificativa('');
      } else {
        // Nova Auditoria padrão
        setNomeLoja('Aurora Concept');
        setIdLoja('SEBRAE-0024');
        setNumeroEspaco('1106');
        setSetorEspaco('Setor Azul');
        setNomePermissionario('Comercial Aurora 0024');
        setIdPermissionario('PERM-0024');
        setIdContrato('TESTE-L36-0001');
        setCompetencia('2026-08');
        setFaturamentoDeclarado('120000');
        setFaturamentoAuditado('135000');
        setPercentualContratual('4.0');
        setAluguelMinimo('5500');
        setOrigemDado('AUDITORIA_PRESENCIAL');
        setStatusManual(null);
        setDocumentoNome('fita_resumo_1106_202608.pdf');
        setObservacao('Aferição presencial de cupons fiscais e fita detalhe.');
        setJustificativa('');
      }
    }
  }, [visible, auditoriaParaEditar]);

  // Cálculo de Preview em tempo real
  const decVal = parseFloat(faturamentoDeclarado) || 0;
  const audVal = parseFloat(faturamentoAuditado) || 0;
  const percVal = parseFloat(percentualContratual) || 0;
  const minVal = parseFloat(aluguelMinimo) || 0;

  const preview = AuditoriaVendasService.calcularPreview(decVal, audVal, percVal, minVal);
  const statusExibido = statusManual || preview.statusSugerido;

  const handleSalvar = () => {
    setErroMsg('');

    if (!nomeLoja.trim()) {
      setErroMsg('O nome da loja/operação é obrigatório.');
      return;
    }
    if (!numeroEspaco.trim()) {
      setErroMsg('O número do espaço/LUC é obrigatório.');
      return;
    }
    if (!competencia.trim()) {
      setErroMsg('A competência (YYYY-MM) é obrigatória.');
      return;
    }
    if (isNaN(decVal) || decVal < 0) {
      setErroMsg('Informe um faturamento declarado válido.');
      return;
    }
    if (isNaN(audVal) || audVal < 0) {
      setErroMsg('Informe um faturamento auditado válido.');
      return;
    }

    if (isEdicao && !justificativa.trim()) {
      setErroMsg('A justificativa da alteração é obrigatória para a trilha de auditoria.');
      return;
    }

    try {
      const salvo = AuditoriaVendasService.salvarAuditoria(
        {
          idAuditoriaVenda: auditoriaParaEditar?.idAuditoriaVenda,
          idLoja: idLoja || `LOJA-${numeroEspaco}`,
          nomeLoja: nomeLoja.trim(),
          idEspaco: `ESP-${numeroEspaco}`,
          numeroEspaco: numeroEspaco.trim(),
          setorEspaco,
          idPermissionario: idPermissionario || 'PERM-0024',
          nomePermissionario: nomePermissionario.trim() || 'Permissionário Padrão',
          idContrato: idContrato.trim() || 'TESTE-L36-0001',
          competencia: competencia.trim(),
          faturamentoDeclarado: decVal,
          faturamentoAuditado: audVal,
          percentualContratual: percVal,
          aluguelMinimoReferencia: minVal,
          origemDado,
          status: statusExibido,
          documentoNome: documentoNome.trim(),
          documentoUrl: documentoNome.trim()
            ? `https://storage.cfmall.com.br/auditorias/${documentoNome.trim()}`
            : undefined,
          observacao: observacao.trim(),
          justificativa: justificativa.trim(),
        },
        userRole,
        userId,
        userEmail
      );

      onAuditoriaSalva(salvo);
      onClose();
    } catch (e: any) {
      console.error('Erro ao salvar auditoria de venda:', e);
      setErroMsg(e.message || 'Falha ao salvar auditoria.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View>
              <View style={styles.headerTitleRow}>
                <Ionicons name="calculator-outline" size={20} color="#38bdf8" />
                <Text style={styles.headerTitle}>
                  {isEdicao ? 'Editar Auditoria de Vendas' : 'Nova Auditoria de Vendas'}
                </Text>
                <View style={styles.badgeFase}>
                  <Text style={styles.badgeFaseTexto}>FASE L3.8 • APURAÇÃO FISCAL</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>
                Preencha os dados declarados e apurados para cálculo de divergência e aluguel percentual
              </Text>
            </View>

            <TouchableOpacity style={styles.btnClose} onPress={onClose}>
              <Ionicons name="close" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Erro */}
          {erroMsg.length > 0 && (
            <View style={styles.erroBox}>
              <Ionicons name="alert-circle" size={18} color="#fca5a5" />
              <Text style={styles.erroTexto}>{erroMsg}</Text>
            </View>
          )}

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {/* Seção 1: Identificação do Ponto */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>1. Identificação do Ponto & Contrato</Text>
              <View style={styles.gridDuplo}>
                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Nome da Loja / Operação *</Text>
                  <TextInput
                    style={styles.input}
                    value={nomeLoja}
                    onChangeText={setNomeLoja}
                    placeholder="Ex: Aurora Concept"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Espaço / LUC (Nº) *</Text>
                  <TextInput
                    style={styles.input}
                    value={numeroEspaco}
                    onChangeText={setNumeroEspaco}
                    placeholder="Ex: 1106"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>

              <View style={styles.gridDuplo}>
                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Setor do Mall</Text>
                  <TextInput
                    style={styles.input}
                    value={setorEspaco}
                    onChangeText={setSetorEspaco}
                    placeholder="Ex: Setor Azul"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Contrato Vigente</Text>
                  <TextInput
                    style={styles.input}
                    value={idContrato}
                    onChangeText={setIdContrato}
                    placeholder="Ex: TESTE-L36-0001"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>

              <View style={styles.gridDuplo}>
                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Permissionário Titular</Text>
                  <TextInput
                    style={styles.input}
                    value={nomePermissionario}
                    onChangeText={setNomePermissionario}
                    placeholder="Ex: Comercial Aurora 0024"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Competência (YYYY-MM) *</Text>
                  <TextInput
                    style={styles.input}
                    value={competencia}
                    onChangeText={setCompetencia}
                    placeholder="Ex: 2026-08"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>
            </View>

            {/* Seção 2: Faturamentos & Valores */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>2. Faturamento & Apuração Contratual</Text>

              <View style={styles.gridDuplo}>
                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Faturamento Declarado (R$) *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={faturamentoDeclarado}
                    onChangeText={setFaturamentoDeclarado}
                    placeholder="Ex: 120000"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Faturamento Auditado / Aferido (R$) *</Text>
                  <TextInput
                    style={[styles.input, styles.inputDestaque]}
                    keyboardType="numeric"
                    value={faturamentoAuditado}
                    onChangeText={setFaturamentoAuditado}
                    placeholder="Ex: 135000"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>

              <View style={styles.gridDuplo}>
                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Percentual Contratual (% Faturamento)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={percentualContratual}
                    onChangeText={setPercentualContratual}
                    placeholder="Ex: 4.0"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>Aluguel Mínimo Contratual (R$)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={aluguelMinimo}
                    onChangeText={setAluguelMinimo}
                    placeholder="Ex: 5500"
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>

              {/* Painel de Apuração Instantânea */}
              <View style={styles.painelApuracao}>
                <View style={styles.apuracaoTituloRow}>
                  <Ionicons name="analytics" size={16} color="#38bdf8" />
                  <Text style={styles.apuracaoTitulo}>Apuração Automática em Tempo Real</Text>
                </View>

                <View style={styles.apuracaoGrid}>
                  <View style={styles.apuracaoItem}>
                    <Text style={styles.apuracaoLabel}>Diferença (R$)</Text>
                    <Text
                      style={[
                        styles.apuracaoValor,
                        preview.diferencaValor > 0 && styles.valorCritico,
                      ]}
                    >
                      {AuditoriaVendasService.formatarMoeda(preview.diferencaValor)}
                    </Text>
                  </View>

                  <View style={styles.apuracaoItem}>
                    <Text style={styles.apuracaoLabel}>Diferença (%)</Text>
                    <Text
                      style={[
                        styles.apuracaoValor,
                        preview.diferencaPercentual > 0 && styles.valorCritico,
                      ]}
                    >
                      {preview.diferencaPercentual > 0
                        ? `+${preview.diferencaPercentual}%`
                        : `${preview.diferencaPercentual}%`}
                    </Text>
                  </View>

                  <View style={styles.apuracaoItem}>
                    <Text style={styles.apuracaoLabel}>Variável Calculado</Text>
                    <Text style={styles.apuracaoValor}>
                      {AuditoriaVendasService.formatarMoeda(preview.aluguelVariavelCalculado)}
                    </Text>
                  </View>

                  <View style={[styles.apuracaoItem, styles.apuracaoItemDestaque]}>
                    <Text style={styles.apuracaoLabel}>Aluguel de Referência</Text>
                    <Text style={styles.apuracaoValorReferencia}>
                      {AuditoriaVendasService.formatarMoeda(preview.aluguelReferencia)}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusSugeridoRow}>
                  <Text style={styles.statusSugeridoLabel}>Status Apurado:</Text>
                  <View
                    style={[
                      styles.badgeStatusPequena,
                      preview.statusSugerido === 'DIVERGENTE'
                        ? styles.badgeDivergente
                        : styles.badgeConforme,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeStatusTexto,
                        preview.statusSugerido === 'DIVERGENTE'
                          ? styles.badgeTextoDivergente
                          : styles.badgeTextoConforme,
                      ]}
                    >
                      {preview.statusSugerido}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Seção 3: Metadados & Evidências */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>3. Origem do Dado, Evidências & Status</Text>

              <View style={styles.campoItem}>
                <Text style={styles.campoLabel}>Origem do Dado da Auditoria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {ORIGENS_DADO.map((org) => (
                    <TouchableOpacity
                      key={org.id}
                      style={[
                        styles.opcaoPill,
                        origemDado === org.id && styles.opcaoPillActive,
                      ]}
                      onPress={() => setOrigemDado(org.id)}
                    >
                      <Text
                        style={[
                          styles.opcaoPillText,
                          origemDado === org.id && styles.opcaoPillTextActive,
                        ]}
                      >
                        {org.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.campoItem}>
                <Text style={styles.campoLabel}>Status da Auditoria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {STATUS_OPCOES.map((st) => (
                    <TouchableOpacity
                      key={st.id}
                      style={[
                        styles.opcaoPill,
                        statusExibido === st.id && styles.opcaoPillActive,
                      ]}
                      onPress={() => setStatusManual(st.id)}
                    >
                      <Text
                        style={[
                          styles.opcaoPillText,
                          statusExibido === st.id && styles.opcaoPillTextActive,
                        ]}
                      >
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.campoItem}>
                <Text style={styles.campoLabel}>Evidência / Comprovante Anexado (Nome do Arquivo)</Text>
                <TextInput
                  style={styles.input}
                  value={documentoNome}
                  onChangeText={setDocumentoNome}
                  placeholder="Ex: fita_resumo_1106_202608.pdf ou cupom_fiscal.jpg"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={styles.campoItem}>
                <Text style={styles.campoLabel}>Observações Gerais</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  multiline
                  numberOfLines={2}
                  value={observacao}
                  onChangeText={setObservacao}
                  placeholder="Observações complementares sobre a auditoria..."
                  placeholderTextColor="#64748b"
                />
              </View>

              {isEdicao && (
                <View style={styles.campoItem}>
                  <Text style={styles.campoLabel}>
                    Justificativa da Alteração * (Obrigatório para Auditoria Imutável)
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textarea, styles.inputJustificativa]}
                    multiline
                    numberOfLines={2}
                    value={justificativa}
                    onChangeText={setJustificativa}
                    placeholder="Informe o motivo da alteração de valores ou status..."
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            </View>
          </ScrollView>

          {/* Rodapé de Ações */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
              <Text style={styles.btnCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
              <Ionicons name="save" size={16} color="#fff" />
              <Text style={styles.btnSalvarTexto}>
                {isEdicao ? 'Salvar Alterações' : 'Cadastrar Auditoria'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 750,
    maxHeight: '92%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  badgeFase: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeFaseTexto: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#bfdbfe',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  btnClose: {
    padding: 6,
  },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7f1d1d',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  erroTexto: {
    color: '#fee2e2',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    gap: 20,
  },
  secao: {
    gap: 12,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#38bdf8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridDuplo: {
    flexDirection: 'row',
    gap: 12,
  },
  campoItem: {
    flex: 1,
    gap: 6,
  },
  campoLabel: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f8fafc',
    fontSize: 13,
  },
  inputDestaque: {
    borderColor: '#38bdf8',
    backgroundColor: '#0c2340',
  },
  textarea: {
    height: 60,
    textAlignVertical: 'top',
  },
  inputJustificativa: {
    borderColor: '#f59e0b',
    backgroundColor: '#291e0a',
  },
  painelApuracao: {
    backgroundColor: '#0b1120',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3a8a',
    padding: 14,
    gap: 12,
    marginTop: 6,
  },
  apuracaoTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apuracaoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  apuracaoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  apuracaoItem: {
    flex: 1,
    minWidth: 100,
  },
  apuracaoItemDestaque: {
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    paddingLeft: 10,
  },
  apuracaoLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 2,
  },
  apuracaoValor: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  apuracaoValorReferencia: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#a78bfa',
  },
  valorCritico: {
    color: '#ef4444',
  },
  statusSugeridoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  statusSugeridoLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  badgeStatusPequena: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeDivergente: {
    backgroundColor: '#7f1d1d',
  },
  badgeConforme: {
    backgroundColor: '#064e3b',
  },
  badgeStatusTexto: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTextoDivergente: {
    color: '#fca5a5',
  },
  badgeTextoConforme: {
    color: '#6ee7b7',
  },
  opcaoPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  opcaoPillActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  opcaoPillText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  opcaoPillTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111827',
  },
  btnCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnCancelarTexto: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  btnSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnSalvarTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
