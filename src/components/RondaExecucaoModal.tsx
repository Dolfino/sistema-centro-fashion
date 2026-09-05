import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { SignagePin } from './InteractiveMallMap';
import { CapturedPhoto, mediaService } from '../services/mediaService';

interface ChecklistItemModel {
  id: string;
  pergunta: string;
  categoria: string;
  obrigatorio: boolean;
}

interface ChecklistTemplate {
  id: string;
  nome: string;
  descricao: string;
  setorSugerido: string;
  itens: ChecklistItemModel[];
}

const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'CHK_MALL_SINALIZACAO',
    nome: 'Checklist Diário do Mall & Sinalização',
    descricao: 'Auditoria visual de sinalização, iluminação e rotas de evacuação do mall.',
    setorSugerido: 'TODOS',
    itens: [
      {
        id: 'ITM_01',
        pergunta: 'Placas direcionais e totens de wayfinding estão visíveis, limpos e sem danos?',
        categoria: 'Comunicação Visual',
        obrigatorio: true,
      },
      {
        id: 'ITM_02',
        pergunta: 'Sinalização de rotas de fuga e saídas de emergência perfeitamente desobstruídas?',
        categoria: 'Segurança',
        obrigatorio: true,
      },
      {
        id: 'ITM_03',
        pergunta: 'Extintores e hidrantes com lacre intacto, manômetro no verde e livre acesso?',
        categoria: 'Segurança',
        obrigatorio: true,
      },
      {
        id: 'ITM_04',
        pergunta: 'Iluminação geral dos corredores e praças 100% operacional (sem lâmpadas piscando)?',
        categoria: 'Iluminação',
        obrigatorio: true,
      },
      {
        id: 'ITM_05',
        pergunta: 'Pisos e corredores sem poças d’água, rachaduras perigosas ou desníveis?',
        categoria: 'Manutenção',
        obrigatorio: true,
      },
      {
        id: 'ITM_06',
        pergunta: 'Sanitários limpos, abastecidos com papel/sabonete e sem vazamentos hidráulicos?',
        categoria: 'Limpeza',
        obrigatorio: true,
      },
      {
        id: 'ITM_07',
        pergunta: 'Portas corta-fogo fechadas e barras antipânico destravadas para passagem?',
        categoria: 'Segurança',
        obrigatorio: true,
      },
      {
        id: 'ITM_08',
        pergunta: 'Lixeiras operacionais, não transbordando e com sacos adequados?',
        categoria: 'Limpeza',
        obrigatorio: false,
      },
      {
        id: 'ITM_09',
        pergunta: 'Painéis publicitários e mídias visuais sem avarias ou películas descolando?',
        categoria: 'Comunicação Visual',
        obrigatorio: false,
      },
      {
        id: 'ITM_10',
        pergunta: 'Temperatura do ar condicionado e ventilação em nível confortável no setor?',
        categoria: 'Infraestrutura',
        obrigatorio: false,
      },
    ],
  },
  {
    id: 'CHK_VISTORIA_SEGURANCA',
    nome: 'Vistoria de Infraestrutura & Segurança Operacional',
    descricao: 'Inspeção focada em segurança patrimonial, hidrantes, portas e acessos.',
    setorSugerido: 'TODOS',
    itens: [
      {
        id: 'ITM_SEC_01',
        pergunta: 'Câmeras de CFTV e sensores de alarme sem obstrução física?',
        categoria: 'Segurança',
        obrigatorio: true,
      },
      {
        id: 'ITM_SEC_02',
        pergunta: 'Portões de docas e saídas de emergência funcionando normalmente?',
        categoria: 'Segurança',
        obrigatorio: true,
      },
      {
        id: 'ITM_SEC_03',
        pergunta: 'Quadro elétrico fechado com cadeado e sinalizado com perigo de choque?',
        categoria: 'Manutenção',
        obrigatorio: true,
      },
      {
        id: 'ITM_SEC_04',
        pergunta: 'Luzes de emergência ativando corretamente no teste?',
        categoria: 'Segurança',
        obrigatorio: true,
      },
    ],
  },
  {
    id: 'CHK_HIGIENE_SANITARIOS',
    nome: 'Auditoria de Higienização & Sanitários',
    descricao: 'Inspeção rápida de higiene e abastecimento nos blocos sanitários.',
    setorSugerido: 'SETOR_AZUL',
    itens: [
      {
        id: 'ITM_LIM_01',
        pergunta: 'Sanitários masculinos, femininos e PCD higienizados?',
        categoria: 'Limpeza',
        obrigatorio: true,
      },
      {
        id: 'ITM_LIM_02',
        pergunta: 'Dispensadores de sabão e toalheiros abastecidos?',
        categoria: 'Limpeza',
        obrigatorio: true,
      },
      {
        id: 'ITM_LIM_03',
        pergunta: 'Torneiras e descargas sem vazamento contínuo?',
        categoria: 'Manutenção',
        obrigatorio: true,
      },
    ],
  },
];

interface ItemResposta {
  idItem: string;
  resposta: 'CONFORME' | 'NAO_CONFORME' | 'NA' | '';
  observacao: string;
  foto?: CapturedPhoto;
  gerouOcorrencia?: boolean;
}

interface RondaExecucaoModalProps {
  visible: boolean;
  onClose: () => void;
  onCriarOcorrencia: (ocorrenciaData: Partial<SignagePin>) => void;
  currentUser?: string;
}

export const RondaExecucaoModal: React.FC<RondaExecucaoModalProps> = ({
  visible,
  onClose,
  onCriarOcorrencia,
  currentUser = 'David Silva — Coordenador Operacional',
}) => {
  const [fase, setFase] = useState<'CONFIGURACAO' | 'EXECUCAO' | 'RESUMO'>('CONFIGURACAO');

  // Configuração da Ronda
  const [auditorNome, setAuditorNome] = useState(currentUser);
  const [setorSelecionado, setSetorSelecionado] = useState('SETOR_AZUL');
  const [modeloSelecionado, setModeloSelecionado] = useState<ChecklistTemplate>(CHECKLIST_TEMPLATES[0]);

  // Execução da Ronda
  const [codigoRonda, setCodigoRonda] = useState('');
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [respostas, setRespostas] = useState<{ [idItem: string]: ItemResposta }>({});
  const [observacaoGeral, setObservacaoGeral] = useState('');

  // Resumo Final
  const [resumoFinal, setResumoFinal] = useState<{
    total: number;
    conforme: number;
    naoConforme: number;
    na: number;
    conformidadePct: number;
  } | null>(null);

  if (!visible) return null;

  // Iniciar Ronda
  const handleIniciarRonda = () => {
    const timestamp = new Date();
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const codigo = `RDA-${timestamp.toISOString().slice(0, 10).replace(/-/g, '')}-${randCode}`;

    setCodigoRonda(codigo);
    setHoraInicio(timestamp);

    const initRespostas: { [idItem: string]: ItemResposta } = {};
    modeloSelecionado.itens.forEach((item) => {
      initRespostas[item.id] = {
        idItem: item.id,
        resposta: '',
        observacao: '',
      };
    });
    setRespostas(initRespostas);
    setFase('EXECUCAO');
  };

  const handleSetResposta = (
    idItem: string,
    valor: 'CONFORME' | 'NAO_CONFORME' | 'NA'
  ) => {
    setRespostas((prev) => ({
      ...prev,
      [idItem]: {
        ...prev[idItem],
        resposta: valor,
      },
    }));
  };

  const handleSetObservacaoItem = (idItem: string, obs: string) => {
    setRespostas((prev) => ({
      ...prev,
      [idItem]: {
        ...prev[idItem],
        observacao: obs,
      },
    }));
  };

  // Auto-gerar Ocorrência operacional baseada em item Não Conforme
  const handleGerarOcorrenciaAutomatica = (item: ChecklistItemModel) => {
    const resp = respostas[item.id];
    const timestamp = new Date();
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const idOcr = `OCR-${timestamp.toISOString().slice(0, 10).replace(/-/g, '')}-${randCode}`;

    const novaOcorrencia: Partial<SignagePin> = {
      assetCode: idOcr,
      entityType: 'OCORRENCIA',
      category: item.categoria,
      categoryColor:
        item.categoria === 'Manutenção'
          ? '#F59E0B'
          : item.categoria === 'Segurança'
          ? '#DC2626'
          : item.categoria === 'Limpeza'
          ? '#10B981'
          : '#0284C7',
      priority: item.categoria === 'Segurança' ? 'ALTA' : 'MEDIA',
      prazoHoras: item.categoria === 'Segurança' ? 2 : 24,
      sector: setorSelecionado,
      status: 'EM_ANDAMENTO',
      conservationState: 'Danificada',
      notes: `[Gerado na Ronda ${codigoRonda}] Item: ${item.pergunta}. Obs: ${resp.observacao || 'Identificado na ronda'}`,
      humanLocation: `Identificado durante ronda no ${setorSelecionado}`,
      responsible: auditorNome,
      normalizedX: 0.45 + (Math.random() * 0.1 - 0.05),
      normalizedY: 0.5 + (Math.random() * 0.1 - 0.05),
    };

    onCriarOcorrencia(novaOcorrencia);

    setRespostas((prev) => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        gerouOcorrencia: true,
      },
    }));

    if (Platform.OS === 'web') {
      window.alert(`✅ Ocorrência operacional ${idOcr} registrada e vinculada a este item com sucesso!`);
    } else {
      Alert.alert('Sucesso', `Ocorrência ${idOcr} registrada com sucesso!`);
    }
  };

  // Finalizar Ronda
  const handleFinalizarRonda = () => {
    // Validar se todos os obrigatórios foram respondidos
    const itensObrigatorios = modeloSelecionado.itens.filter((i) => i.obrigatorio);
    const pendentes = itensObrigatorios.filter(
      (i) => !respostas[i.id] || !respostas[i.id].resposta
    );

    if (pendentes.length > 0) {
      const msg = `Existem ${pendentes.length} item(ns) obrigatório(s) não respondido(s). Por favor responda a todos antes de finalizar.`;
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Atenção', msg);
      return;
    }

    const total = modeloSelecionado.itens.length;
    let conforme = 0;
    let naoConforme = 0;
    let na = 0;

    Object.values(respostas).forEach((r) => {
      if (r.resposta === 'CONFORME') conforme++;
      else if (r.resposta === 'NAO_CONFORME') naoConforme++;
      else if (r.resposta === 'NA') na++;
    });

    const avaliaveis = conforme + naoConforme;
    const conformidadePct = avaliaveis > 0 ? Math.round((conforme / avaliaveis) * 100) : 100;

    setResumoFinal({
      total,
      conforme,
      naoConforme,
      na,
      conformidadePct,
    });

    setFase('RESUMO');
  };

  const handleConcluirTudo = () => {
    setFase('CONFIGURACAO');
    onClose();
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        {/* Top Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerIconText}>📋</Text>
            </View>
            <View>
              <Text style={styles.modalTitle}>Ronda Operacional & Checklist de Auditoria</Text>
              <Text style={styles.modalSubtitle}>
                {fase === 'CONFIGURACAO' && 'Configuração e Início de Nova Vistoria de Campo'}
                {fase === 'EXECUCAO' && `${codigoRonda} • Auditor: ${auditorNome} • Setor: ${setorSelecionado}`}
                {fase === 'RESUMO' && `Ata de Encerramento • Ronda ${codigoRonda}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} aria-label="Fechar">
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* ================= FASE 1: CONFIGURAÇÃO ================= */}
        {fase === 'CONFIGURACAO' && (
          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.configContainer}>
            <View style={styles.configCard}>
              <Text style={styles.sectionHeading}>1. Responsável & Localização</Text>

              <Text style={styles.inputLabel}>Auditor / Operador de Campo:</Text>
              <TextInput
                style={styles.textInput}
                value={auditorNome}
                onChangeText={setAuditorNome}
                placeholder="Nome do Auditor"
              />

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Setor / Área da Ronda:</Text>
              <View style={styles.pillGrid}>
                {[
                  { key: 'SETOR_AZUL', label: 'Setor Azul (Piso 1)' },
                  { key: 'SETOR_AMARELO', label: 'Setor Amarelo (Piso 1)' },
                  { key: 'SETOR_VERDE', label: 'Setor Verde (Piso 1)' },
                  { key: 'SETOR_VERMELHO', label: 'Setor Vermelho (Piso 1)' },
                  { key: 'TODOS', label: 'Mall Completo (Todos os Setores)' },
                ].map((s) => (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.sectorPill, setorSelecionado === s.key && styles.sectorPillActive]}
                    onPress={() => setSetorSelecionado(s.key)}
                  >
                    <Text
                      style={[
                        styles.sectorPillText,
                        setorSelecionado === s.key && styles.sectorPillTextActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.configCard}>
              <Text style={styles.sectionHeading}>2. Selecionar Modelo de Checklist</Text>
              {CHECKLIST_TEMPLATES.map((tmpl) => {
                const isSelected = modeloSelecionado.id === tmpl.id;
                return (
                  <TouchableOpacity
                    key={tmpl.id}
                    style={[styles.templateCard, isSelected && styles.templateCardActive]}
                    onPress={() => setModeloSelecionado(tmpl)}
                  >
                    <View style={styles.templateHeader}>
                      <Text style={[styles.templateTitle, isSelected && styles.templateTitleActive]}>
                        {tmpl.nome}
                      </Text>
                      <View style={styles.templateBadge}>
                        <Text style={styles.templateBadgeText}>{tmpl.itens.length} itens</Text>
                      </View>
                    </View>
                    <Text style={styles.templateDesc}>{tmpl.descricao}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              id="iniciarRondaBtn"
              style={styles.btnIniciar}
              onPress={handleIniciarRonda}
            >
              <Text style={styles.btnIniciarText}>▶ Iniciar Ronda Operacional de Campo</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ================= FASE 2: EXECUÇÃO ================= */}
        {fase === 'EXECUCAO' && (
          <View style={{ flex: 1 }}>
            {/* Barra de Progresso */}
            <View style={styles.progressContainer}>
              <View style={styles.progressInfoRow}>
                <Text style={styles.progressInfoText}>
                  Itens Auditados: {Object.values(respostas).filter((r) => r.resposta).length} de{' '}
                  {modeloSelecionado.itens.length}
                </Text>
                <Text style={styles.progressPctText}>
                  {Math.round(
                    (Object.values(respostas).filter((r) => r.resposta).length /
                      modeloSelecionado.itens.length) *
                      100
                  )}
                  % Concluído
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.round(
                        (Object.values(respostas).filter((r) => r.resposta).length /
                          modeloSelecionado.itens.length) *
                          100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Lista de Itens do Checklist */}
            <ScrollView style={styles.bodyScroll} contentContainerStyle={{ padding: 18, gap: 14 }}>
              {modeloSelecionado.itens.map((item, index) => {
                const resp = respostas[item.id] || { resposta: '', observacao: '' };
                const isNaoConforme = resp.resposta === 'NAO_CONFORME';

                return (
                  <View
                    key={item.id}
                    id={`chk-item-${item.id}`}
                    style={[
                      styles.itemCard,
                      isNaoConforme && styles.itemCardNaoConforme,
                      resp.resposta === 'CONFORME' && styles.itemCardConforme,
                    ]}
                  >
                    <View style={styles.itemHeader}>
                      <View style={styles.itemIndexBox}>
                        <Text style={styles.itemIndexText}>{index + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemPergunta}>{item.pergunta}</Text>
                        <View style={styles.itemMetaRow}>
                          <Text style={styles.itemCategoria}>🏷️ {item.categoria}</Text>
                          {item.obrigatorio && (
                            <Text style={styles.itemObrigatorio}>* Obrigatório</Text>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Resposta Buttons */}
                    <View style={styles.respostaButtonsRow}>
                      <TouchableOpacity
                        style={[
                          styles.btnResp,
                          resp.resposta === 'CONFORME' && styles.btnRespConformeActive,
                        ]}
                        onPress={() => handleSetResposta(item.id, 'CONFORME')}
                      >
                        <Text
                          style={[
                            styles.btnRespText,
                            resp.resposta === 'CONFORME' && styles.btnRespTextActive,
                          ]}
                        >
                          ✓ Conforme
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.btnResp,
                          resp.resposta === 'NAO_CONFORME' && styles.btnRespNaoConformeActive,
                        ]}
                        onPress={() => handleSetResposta(item.id, 'NAO_CONFORME')}
                      >
                        <Text
                          style={[
                            styles.btnRespText,
                            resp.resposta === 'NAO_CONFORME' && styles.btnRespTextActive,
                          ]}
                        >
                          ✗ Não Conforme
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.btnResp,
                          resp.resposta === 'NA' && styles.btnRespNaActive,
                        ]}
                        onPress={() => handleSetResposta(item.id, 'NA')}
                      >
                        <Text
                          style={[
                            styles.btnRespText,
                            resp.resposta === 'NA' && styles.btnRespTextActive,
                          ]}
                        >
                          - N/A
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Se Não Conforme: Detalhes e Geração de Ocorrência Automática */}
                    {isNaoConforme && (
                      <View style={styles.naoConformeBox}>
                        <Text style={styles.naoConformeTitle}>
                          ⚠️ Registrar Não Conformidade & Ocorrência
                        </Text>
                        <TextInput
                          style={styles.obsInput}
                          placeholder="Descreva o problema encontrado em campo..."
                          placeholderTextColor="#94A3B8"
                          value={resp.observacao}
                          onChangeText={(t) => handleSetObservacaoItem(item.id, t)}
                        />

                        <View style={styles.naoConformeActions}>
                          <TouchableOpacity
                            style={[
                              styles.btnGerarOcr,
                              resp.gerouOcorrencia && styles.btnGerarOcrDone,
                            ]}
                            disabled={resp.gerouOcorrencia}
                            onPress={() => handleGerarOcorrenciaAutomatica(item)}
                          >
                            <Text style={styles.btnGerarOcrText}>
                              {resp.gerouOcorrencia
                                ? '✓ Ocorrência Operacional Vinculada'
                                : '⚠️ Gerar Ocorrência no Mapa (OCR-)'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Observação Geral */}
              <View style={styles.itemCard}>
                <Text style={styles.inputLabel}>Observações Gerais do Fechamento da Ronda:</Text>
                <TextInput
                  style={[styles.textInput, { height: 60, marginTop: 8 }]}
                  multiline
                  placeholder="Comentários adicionais sobre o fluxo, clima, equipes..."
                  placeholderTextColor="#94A3B8"
                  value={observacaoGeral}
                  onChangeText={setObservacaoGeral}
                />
              </View>
            </ScrollView>

            {/* Footer de Encerramento */}
            <View style={styles.footerBar}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setFase('CONFIGURACAO')}
              >
                <Text style={styles.btnCancelarText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                id="finalizarRondaBtn"
                style={styles.btnFinalizar}
                onPress={handleFinalizarRonda}
              >
                <Text style={styles.btnFinalizarText}>✓ Finalizar Ronda e Gerar Ata</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= FASE 3: RESUMO FINAL ================= */}
        {fase === 'RESUMO' && resumoFinal && (
          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.resumoContainer}>
            <View style={styles.resumoBadgeHeader}>
              <Text style={styles.resumoCheckIcon}>✓</Text>
              <Text style={styles.resumoTitle}>Ronda Finalizada com Sucesso!</Text>
              <Text style={styles.resumoSubtitle}>
                Código: <Text style={{ fontWeight: 'bold' }}>{codigoRonda}</Text> • Setor:{' '}
                {setorSelecionado}
              </Text>
            </View>

            {/* Scorecard de Conformidade */}
            <View style={styles.scorecardRow}>
              <View style={styles.scoreCard}>
                <Text style={[styles.scoreValue, { color: '#047857' }]}>
                  {resumoFinal.conformidadePct}%
                </Text>
                <Text style={styles.scoreLabel}>Índice de Conformidade</Text>
              </View>
              <View style={styles.scoreCard}>
                <Text style={[styles.scoreValue, { color: '#166534' }]}>
                  {resumoFinal.conforme}
                </Text>
                <Text style={styles.scoreLabel}>Conformes</Text>
              </View>
              <View style={styles.scoreCard}>
                <Text style={[styles.scoreValue, { color: '#B91C1C' }]}>
                  {resumoFinal.naoConforme}
                </Text>
                <Text style={styles.scoreLabel}>Não Conformes</Text>
              </View>
              <View style={styles.scoreCard}>
                <Text style={[styles.scoreValue, { color: '#64748B' }]}>{resumoFinal.na}</Text>
                <Text style={styles.scoreLabel}>Não Aplicáveis</Text>
              </View>
            </View>

            <View style={styles.configCard}>
              <Text style={styles.sectionHeading}>Resumo Operacional da Ata</Text>
              <Text style={styles.resumoDetailLine}>
                • <Text style={{ fontWeight: 'bold' }}>Auditor:</Text> {auditorNome}
              </Text>
              <Text style={styles.resumoDetailLine}>
                • <Text style={{ fontWeight: 'bold' }}>Modelo:</Text> {modeloSelecionado.nome}
              </Text>
              <Text style={styles.resumoDetailLine}>
                • <Text style={{ fontWeight: 'bold' }}>Início:</Text>{' '}
                {horaInicio?.toLocaleTimeString() || ''} •{' '}
                <Text style={{ fontWeight: 'bold' }}>Encerramento:</Text>{' '}
                {new Date().toLocaleTimeString()}
              </Text>
              {observacaoGeral ? (
                <Text style={styles.resumoDetailLine}>
                  • <Text style={{ fontWeight: 'bold' }}>Observações:</Text> {observacaoGeral}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity style={styles.btnIniciar} onPress={handleConcluirTudo}>
              <Text style={styles.btnIniciarText}>Concluir e Retornar ao Mapa</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    zIndex: 160,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 900,
    height: '90%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 20,
    flexDirection: 'column',
  },
  modalHeader: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 20,
    color: '#38BDF8',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  bodyScroll: {
    flex: 1,
  },
  configContainer: {
    padding: 20,
    gap: 16,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  textInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    fontSize: 13,
    color: '#0F172A',
    marginTop: 6,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  sectorPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sectorPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  sectorPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  sectorPillTextActive: {
    color: '#FFFFFF',
  },

  templateCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  templateCardActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  templateTitleActive: {
    color: '#0284C7',
  },
  templateBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  templateBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  templateDesc: {
    fontSize: 12,
    color: '#64748B',
  },

  btnIniciar: {
    backgroundColor: '#0284C7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnIniciarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Execução */
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressInfoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  progressPctText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
  },

  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemCardConforme: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  itemCardNaoConforme: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  itemHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  itemIndexBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  itemPergunta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  itemCategoria: {
    fontSize: 11,
    color: '#64748B',
  },
  itemObrigatorio: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },

  respostaButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  btnResp: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  btnRespConformeActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  btnRespNaoConformeActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  btnRespNaActive: {
    backgroundColor: '#64748B',
    borderColor: '#64748B',
  },
  btnRespText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  btnRespTextActive: {
    color: '#FFFFFF',
  },

  naoConformeBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  naoConformeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 6,
  },
  obsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    fontSize: 12,
    color: '#0F172A',
  },
  naoConformeActions: {
    marginTop: 8,
  },
  btnGerarOcr: {
    backgroundColor: '#DC2626',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  btnGerarOcrDone: {
    backgroundColor: '#047857',
  },
  btnGerarOcrText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  footerBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  btnCancelarText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  btnFinalizar: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  btnFinalizarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  /* Resumo */
  resumoContainer: {
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  resumoBadgeHeader: {
    alignItems: 'center',
    gap: 6,
  },
  resumoCheckIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCFCE7',
    color: '#166534',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 60,
  },
  resumoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  resumoSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  scorecardRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  resumoDetailLine: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
  },
});
