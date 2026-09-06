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
  ContratoLocacao,
  TipoContratoLocacao,
  StatusContratoLocacao,
  ContratoEventoHistorico,
} from '../services/financeiroRestritoService';

interface ContratoEditorModalProps {
  visible: boolean;
  onClose: () => void;
  idPermissionario: string;
  contratoParaEditar?: ContratoLocacao | null;
  onContratoSalvo: (contrato: ContratoLocacao) => void;
  userRole?: string;
  userId?: string;
  userEmail?: string;
}

const TIPOS_CONTRATO: { id: TipoContratoLocacao; label: string }[] = [
  { id: 'LOCACAO_COMERCIAL', label: 'Locação Comercial' },
  { id: 'LOCACAO_BOX', label: 'Locação Box Padrão' },
  { id: 'QUIOSQUE', label: 'Quiosque' },
  { id: 'TEMPORARIO', label: 'Temporário' },
  { id: 'CESSAO_DE_USO', label: 'Cessão de Uso' },
  { id: 'EVENTO', label: 'Evento / Feira' },
  { id: 'LOJA_ANCORA', label: 'Loja Âncora' },
  { id: 'OUTRO', label: 'Outro' },
];

const STATUS_CONTRATO: { id: StatusContratoLocacao; label: string; cor: string }[] = [
  { id: 'ATIVO', label: 'Ativo', cor: '#10b981' },
  { id: 'PLANEJADO', label: 'Planejado', cor: '#38bdf8' },
  { id: 'SUSPENSO', label: 'Suspenso', cor: '#f59e0b' },
  { id: 'EM_RENOVACAO', label: 'Em Renovação', cor: '#818cf8' },
  { id: 'ENCERRADO', label: 'Encerrado', cor: '#64748b' },
  { id: 'RESCINDIDO', label: 'Rescindido', cor: '#ef4444' },
];

export const ContratoEditorModal: React.FC<ContratoEditorModalProps> = ({
  visible,
  onClose,
  idPermissionario,
  contratoParaEditar,
  onContratoSalvo,
  userRole = 'ADMIN',
  userId = 'ADMIN-01',
  userEmail = 'diretoria@cfmall.com.br',
}) => {
  // Campos do formulário
  const [numeroContrato, setNumeroContrato] = useState('');
  const [tipoContrato, setTipoContrato] = useState<TipoContratoLocacao>('LOCACAO_COMERCIAL');
  const [status, setStatus] = useState<StatusContratoLocacao>('ATIVO');
  const [dataInicio, setDataInicio] = useState('01/09/2026');
  const [dataFim, setDataFim] = useState('31/08/2027');
  const [aluguelMinimo, setAluguelMinimo] = useState('5000');
  const [percentualFaturamento, setPercentualFaturamento] = useState('4');
  const [fundoPromocao, setFundoPromocao] = useState('500');
  const [diaVencimento, setDiaVencimento] = useState('10');
  const [espacosSelecionados, setEspacosSelecionados] = useState<string[]>([]);
  const [documentoNome, setDocumentoNome] = useState<string | undefined>(undefined);
  const [documentoUrl, setDocumentoUrl] = useState<string | undefined>(undefined);
  const [observacoes, setObservacoes] = useState('');

  // Estados de apoio e controle
  const [espacosDisponiveis, setEspacosDisponiveis] = useState<string[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'DADOS' | 'HISTORICO'>('DADOS');
  const [historicoEventos, setHistoricoEventos] = useState<ContratoEventoHistorico[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  // Carrega os dados do contrato para edição ou preenche padrões de novo contrato
  useEffect(() => {
    if (!visible) return;

    // Busca os boxes físicos disponíveis para esse permissionário
    const boxes = FinanceiroRestritoService.obterEspacosPermissionario(idPermissionario);
    setEspacosDisponiveis(boxes);

    if (contratoParaEditar) {
      setNumeroContrato(contratoParaEditar.numeroContrato || '');
      setTipoContrato(contratoParaEditar.tipoContrato || 'LOCACAO_COMERCIAL');
      setStatus(contratoParaEditar.status || 'ATIVO');
      setDataInicio(contratoParaEditar.dataInicio || '01/09/2026');
      setDataFim(contratoParaEditar.dataFim || '31/08/2027');
      setAluguelMinimo(contratoParaEditar.aluguelMinimoMensal?.toString() || '5000');
      setPercentualFaturamento(contratoParaEditar.percentualFaturamento?.toString() || '4');
      setFundoPromocao(contratoParaEditar.fundoPromocao?.toString() || '500');
      setDiaVencimento(contratoParaEditar.diaVencimento?.toString() || '10');
      setEspacosSelecionados(contratoParaEditar.espacosVinculados || []);
      setDocumentoNome(contratoParaEditar.documentoNome);
      setDocumentoUrl(contratoParaEditar.documentoUrl);
      setObservacoes(contratoParaEditar.observacoes || '');

      // Carrega histórico do contrato
      const hist = FinanceiroRestritoService.obterHistoricoContrato(
        contratoParaEditar.idContrato,
        userRole
      );
      setHistoricoEventos(hist);
    } else {
      // Novo Contrato
      setNumeroContrato('TESTE-L36-0001');
      setTipoContrato('LOCACAO_COMERCIAL');
      setStatus('ATIVO');
      setDataInicio('01/09/2026');
      setDataFim('31/08/2027');
      setAluguelMinimo('5000');
      setPercentualFaturamento('4');
      setFundoPromocao('500');
      setDiaVencimento('10');
      // Seleciona até 2 boxes por padrão se houver
      setEspacosSelecionados(boxes.slice(0, 2));
      setDocumentoNome(undefined);
      setDocumentoUrl(undefined);
      setObservacoes('');
      setHistoricoEventos([]);
    }

    setAbaAtiva('DADOS');
    setSucessoMsg(null);
  }, [visible, contratoParaEditar, idPermissionario, userRole]);

  // Alterna a seleção de um box (relação N:N)
  const toggleEspaco = (box: string) => {
    if (espacosSelecionados.includes(box)) {
      setEspacosSelecionados(espacosSelecionados.filter((b) => b !== box));
    } else {
      setEspacosSelecionados([...espacosSelecionados, box]);
    }
  };

  // Simula anexo de arquivo contratual (PDF / DOCX)
  const handleAnexarDocumento = () => {
    const nomeFicticio = `Contrato_${numeroContrato || 'L36'}_Assinado.pdf`;
    setDocumentoNome(nomeFicticio);
    setDocumentoUrl(`https://cfmall.ideiasmkt.com.br/docs/${nomeFicticio}`);
    Alert.alert(
      'Documento Anexado',
      `Arquivo "${nomeFicticio}" (PDF, 2.4 MB) vinculado ao contrato com sucesso.`
    );
  };

  // Remove vínculo do documento mantendo integridade
  const handleRemoverDocumento = () => {
    setDocumentoNome(undefined);
    setDocumentoUrl(undefined);
  };

  // Submissão do formulário de contrato
  const handleSalvar = () => {
    if (!numeroContrato.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, informe o número do contrato.');
      return;
    }

    if (espacosSelecionados.length === 0) {
      Alert.alert(
        'Seleção de Espaços',
        'Selecione pelo menos um espaço (box) para vincular ao contrato.'
      );
      return;
    }

    setSalvando(true);
    try {
      const clientRequestId = `REQ-CTR-${Date.now()}`;
      const payload: Partial<ContratoLocacao> & { numeroContrato: string } = {
        idContrato: contratoParaEditar?.idContrato,
        numeroContrato: numeroContrato.trim(),
        tipoContrato,
        status,
        dataInicio: dataInicio.trim(),
        dataFim: dataFim.trim(),
        aluguelMinimoMensal: parseFloat(aluguelMinimo) || 0,
        percentualFaturamento: parseFloat(percentualFaturamento) || 0,
        fundoPromocao: parseFloat(fundoPromocao) || 0,
        diaVencimento: parseInt(diaVencimento, 10) || 10,
        espacosVinculados: espacosSelecionados,
        documentoNome,
        documentoUrl,
        observacoes: observacoes.trim(),
      };

      const salvo = FinanceiroRestritoService.salvarContrato(
        idPermissionario,
        payload,
        userRole,
        userId,
        userEmail,
        clientRequestId
      );

      setSucessoMsg(`Contrato ${salvo.numeroContrato} gravado com sucesso!`);
      setTimeout(() => {
        onContratoSalvo(salvo);
        setSalvando(false);
      }, 700);
    } catch (error: any) {
      setSalvando(false);
      Alert.alert('Erro ao Salvar', error?.message || 'Falha na gravação do contrato.');
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
                <Ionicons name="document-text" size={20} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.modalTitle}>
                  {contratoParaEditar ? `Editar Contrato ${contratoParaEditar.numeroContrato}` : 'Novo Contrato de Locação'}
                </Text>
                <View style={styles.badgeGovRow}>
                  <Text style={styles.badgeGov}>🔒 Governança Jurídico-Financeira • Fase L3.6</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Abas: Dados do Contrato vs Histórico de Auditoria */}
          <View style={styles.abasContainer}>
            <TouchableOpacity
              style={[styles.abaBtn, abaAtiva === 'DADOS' && styles.abaBtnAtiva]}
              onPress={() => setAbaAtiva('DADOS')}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={abaAtiva === 'DADOS' ? '#38bdf8' : '#94a3b8'}
              />
              <Text style={[styles.abaBtnText, abaAtiva === 'DADOS' && styles.abaBtnTextAtiva]}>
                Termos Contratuais & Espaços
              </Text>
            </TouchableOpacity>

            {contratoParaEditar && (
              <TouchableOpacity
                style={[styles.abaBtn, abaAtiva === 'HISTORICO' && styles.abaBtnAtiva]}
                onPress={() => setAbaAtiva('HISTORICO')}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={abaAtiva === 'HISTORICO' ? '#38bdf8' : '#94a3b8'}
                />
                <Text style={[styles.abaBtnText, abaAtiva === 'HISTORICO' && styles.abaBtnTextAtiva]}>
                  Histórico & Auditoria ({historicoEventos.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Mensagem de Sucesso */}
          {sucessoMsg && (
            <View style={styles.sucessoBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              <Text style={styles.sucessoBannerText}>{sucessoMsg}</Text>
            </View>
          )}

          {/* Conteúdo Principal */}
          {abaAtiva === 'DADOS' ? (
            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
              {/* Seção 1: Identificação e Enquadramento */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>1. Identificação do Instrumento</Text>

                <View style={styles.formRow}>
                  <View style={[styles.inputGroup, { flex: 1.2 }]}>
                    <Text style={styles.inputLabel}>Número do Contrato *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={numeroContrato}
                      onChangeText={setNumeroContrato}
                      placeholder="Ex: TESTE-L36-0001"
                      placeholderTextColor="#64748b"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Status</Text>
                    <View style={styles.pillsWrap}>
                      {STATUS_CONTRATO.map((st) => (
                        <TouchableOpacity
                          key={st.id}
                          style={[
                            styles.miniPill,
                            status === st.id && { backgroundColor: st.cor, borderColor: st.cor },
                          ]}
                          onPress={() => setStatus(st.id)}
                        >
                          <Text
                            style={[
                              styles.miniPillText,
                              status === st.id && { color: '#0f172a', fontWeight: 'bold' },
                            ]}
                          >
                            {st.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tipo de Contrato</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                    {TIPOS_CONTRATO.map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={[
                          styles.tipoPill,
                          tipoContrato === t.id && styles.tipoPillAtivo,
                        ]}
                        onPress={() => setTipoContrato(t.id)}
                      >
                        <Text
                          style={[
                            styles.tipoPillText,
                            tipoContrato === t.id && styles.tipoPillTextAtivo,
                          ]}
                        >
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Seção 2: Vigência Contratual */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>2. Vigência do Contrato</Text>
                <View style={styles.formRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Data de Início (DD/MM/AAAA)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={dataInicio}
                      onChangeText={setDataInicio}
                      placeholder="01/09/2026"
                      placeholderTextColor="#64748b"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Data de Término (DD/MM/AAAA)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={dataFim}
                      onChangeText={setDataFim}
                      placeholder="31/08/2027"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                </View>
              </View>

              {/* Seção 3: Condições Comerciais & Financeiras */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>3. Condições Comerciais e Financeiras</Text>
                <View style={styles.formRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Aluguel Mínimo (R$)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={aluguelMinimo}
                      onChangeText={setAluguelMinimo}
                      keyboardType="numeric"
                      placeholder="5000"
                      placeholderTextColor="#64748b"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>% Faturamento</Text>
                    <TextInput
                      style={styles.textInput}
                      value={percentualFaturamento}
                      onChangeText={setPercentualFaturamento}
                      keyboardType="numeric"
                      placeholder="4"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Fundo de Promoção (R$)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={fundoPromocao}
                      onChangeText={setFundoPromocao}
                      keyboardType="numeric"
                      placeholder="500"
                      placeholderTextColor="#64748b"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Dia de Vencimento (1 a 31)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={diaVencimento}
                      onChangeText={setDiaVencimento}
                      keyboardType="numeric"
                      placeholder="10"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                </View>
              </View>

              {/* Seção 4: Vínculo Multi-Espaço (Relação N:N de Boxes) */}
              <View style={styles.formSection}>
                <View style={styles.sectionHeaderBetween}>
                  <Text style={styles.sectionTitle}>4. Espaços / Boxes Cobertos (Relação N:N)</Text>
                  <Text style={styles.contadorEspacos}>
                    {espacosSelecionados.length} espaço(s) selecionado(s)
                  </Text>
                </View>

                <Text style={styles.seletorDica}>
                  Toque nos boxes pertencentes ao permissionário para vincular ou desvincular do contrato.
                  A desvinculação preserva o histórico contratual no sistema.
                </Text>

                <View style={styles.boxesContainer}>
                  {espacosDisponiveis.map((b) => {
                    const selecionado = espacosSelecionados.includes(b);
                    return (
                      <TouchableOpacity
                        key={b}
                        style={[styles.boxItemCard, selecionado && styles.boxItemCardSelecionado]}
                        onPress={() => toggleEspaco(b)}
                      >
                        <Ionicons
                          name={selecionado ? 'checkbox' : 'square-outline'}
                          size={18}
                          color={selecionado ? '#38bdf8' : '#64748b'}
                        />
                        <Text style={[styles.boxItemText, selecionado && styles.boxItemTextSelecionado]}>
                          Box Nº {b}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Seção 5: Documento Anexo (PDF / DOCX) */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>5. Instrumento Contratual Digital (Anexo)</Text>

                {documentoUrl ? (
                  <View style={styles.documentoCard}>
                    <View style={styles.documentoInfo}>
                      <Ionicons name="document-attach" size={24} color="#38bdf8" />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.documentoNome}>{documentoNome || 'contrato_locacao.pdf'}</Text>
                        <Text style={styles.documentoTamanho}>Documento PDF autenticado no repositório</Text>
                      </View>
                    </View>

                    <View style={styles.documentoAcoes}>
                      <TouchableOpacity
                        style={styles.btnAcaoDoc}
                        onPress={() =>
                          Alert.alert('Abrir Documento', `Acessando arquivo seguro: ${documentoUrl}`)
                        }
                      >
                        <Ionicons name="eye-outline" size={14} color="#38bdf8" />
                        <Text style={styles.btnAcaoDocText}>Visualizar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.btnAcaoDocPerigo} onPress={handleRemoverDocumento}>
                        <Ionicons name="trash-outline" size={14} color="#ef4444" />
                        <Text style={styles.btnAcaoDocPerigoText}>Desvincular</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.btnAnexar} onPress={handleAnexarDocumento}>
                    <Ionicons name="cloud-upload-outline" size={20} color="#38bdf8" />
                    <Text style={styles.btnAnexarText}>Anexar Instrumento Contratual (PDF/DOCX)</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Seção 6: Observações */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>6. Observações & Condições Especiais</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={observacoes}
                  onChangeText={setObservacoes}
                  placeholder="Observações complementares, cláusulas de renovação ou ressalvas..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          ) : (
            /* Visualização do Histórico e Auditoria */
            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
              <View style={styles.historicoBanner}>
                <Ionicons name="shield-checkmark" size={18} color="#10b981" />
                <Text style={styles.historicoBannerText}>
                  Trilha de Auditoria Imutável do Contrato (Fase L3.6). Cada alteração gera um registro
                  histórico indelével preservando snapshots antes e depois.
                </Text>
              </View>

              {historicoEventos.length === 0 ? (
                <View style={styles.emptyHist}>
                  <Text style={styles.emptyHistText}>Nenhum evento registrado até o momento.</Text>
                </View>
              ) : (
                historicoEventos.map((evt) => (
                  <View key={evt.idEvento} style={styles.eventoCard}>
                    <View style={styles.eventoHeader}>
                      <View style={styles.eventoTipoBadge}>
                        <Text style={styles.eventoTipoText}>{evt.tipoEvento}</Text>
                      </View>
                      <Text style={styles.eventoData}>{evt.dataHora}</Text>
                    </View>

                    <Text style={styles.eventoUsuario}>
                      Por: <Text style={{ color: '#cbd5e1' }}>{evt.emailUsuario}</Text> ({evt.idUsuario})
                    </Text>

                    <View style={styles.eventoCamposRow}>
                      <Text style={styles.eventoCamposLabel}>Campos Alterados: </Text>
                      {evt.camposAlterados.map((c) => (
                        <View key={c} style={styles.campoTag}>
                          <Text style={styles.campoTagText}>{c}</Text>
                        </View>
                      ))}
                    </View>

                    {evt.observacao ? (
                      <Text style={styles.eventoObs}>"{evt.observacao}"</Text>
                    ) : null}
                  </View>
                ))
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
          )}

          {/* Rodapé com Botões de Ação */}
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
                {salvando ? 'Gravando...' : contratoParaEditar ? 'Atualizar Contrato' : 'Salvar Novo Contrato'}
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
    maxWidth: 780,
    maxHeight: '90%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  badgeGovRow: {
    marginTop: 2,
  },
  badgeGov: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  abasContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  abaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  abaBtnAtiva: {
    borderBottomColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  abaBtnText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  abaBtnTextAtiva: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  sucessoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 4,
  },
  sucessoBannerText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  contadorEspacos: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  seletorDica: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
    lineHeight: 18,
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
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniPill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },
  miniPillText: {
    fontSize: 11,
    color: '#94a3b8',
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
  boxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  boxItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  boxItemCardSelecionado: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  boxItemText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  boxItemTextSelecionado: {
    color: '#f8fafc',
    fontWeight: 'bold',
  },
  documentoCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
  },
  documentoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  documentoNome: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  documentoTamanho: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  documentoAcoes: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  btnAcaoDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  btnAcaoDocText: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '600',
  },
  btnAcaoDocPerigo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  btnAcaoDocPerigoText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  btnAnexar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#38bdf8',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 14,
  },
  btnAnexarText: {
    fontSize: 13,
    color: '#38bdf8',
    fontWeight: '600',
  },
  historicoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  historicoBannerText: {
    fontSize: 12,
    color: '#cbd5e1',
    flex: 1,
    lineHeight: 18,
  },
  emptyHist: {
    padding: 20,
    alignItems: 'center',
  },
  emptyHistText: {
    fontSize: 13,
    color: '#64748b',
  },
  eventoCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventoTipoBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  eventoTipoText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  eventoData: {
    fontSize: 11,
    color: '#94a3b8',
  },
  eventoUsuario: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  eventoCamposRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  eventoCamposLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  campoTag: {
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  campoTagText: {
    fontSize: 10,
    color: '#e2e8f0',
  },
  eventoObs: {
    fontSize: 12,
    color: '#cbd5e1',
    fontStyle: 'italic',
    marginTop: 4,
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
