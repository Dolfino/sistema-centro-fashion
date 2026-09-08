import React, { useState } from 'react';
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
  AtivoMallService,
  AtivoMidiaPonto,
  TipoEstruturaMidia,
  CondicaoFisica,
} from '../services/ativoMallService';

interface AtivoMallModalProps {
  visible: boolean;
  onClose: () => void;
  onAbrirOcorrenciaParaMidia?: (ponto: AtivoMidiaPonto) => void;
}

export const AtivoMallModal: React.FC<AtivoMallModalProps> = ({
  visible,
  onClose,
  onAbrirOcorrenciaParaMidia,
}) => {
  const [pontoSelecionado, setPontoSelecionado] = useState<AtivoMidiaPonto | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  // Estado do formulário de vistoria rápida
  const [modoVistoria, setModoVistoria] = useState(false);
  const [vistoriaCondicao, setVistoriaCondicao] = useState<CondicaoFisica>('BOA');
  const [vistoriaPresente, setVistoriaPresente] = useState(true);
  const [vistoriaObs, setVistoriaObs] = useState('');

  const metricas = AtivoMallService.obterMetricas();
  const pontos = AtivoMallService.listarPontos({
    termo: termoBusca,
    tipo: filtroTipo,
    statusAuditoria: filtroStatus,
  });

  const getTipoBadge = (tipo: TipoEstruturaMidia) => {
    switch (tipo) {
      case 'TOTEM_DIGITAL':
        return { label: 'Totem Digital', bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', icon: 'tv-outline' };
      case 'PAINEL_LED':
        return { label: 'Painel LED', bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', icon: 'tablet-landscape-outline' };
      case 'LONA_AEREA':
        return { label: 'Lona Aérea', bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', icon: 'flag-outline' };
      case 'CANCELA_ESTACIONAMENTO':
        return { label: 'Cancela', bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', icon: 'car-outline' };
      case 'ADESIVO_PISO':
        return { label: 'Adesivo de Piso', bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', icon: 'footsteps-outline' };
      default:
        return { label: tipo, bg: '#334155', text: '#94a3b8', icon: 'cube-outline' };
    }
  };

  const getStatusAuditoriaBadge = (status: string) => {
    switch (status) {
      case 'CONFORME':
        return { label: 'Conforme', bg: '#065f46', text: '#34d399', icon: 'checkmark-circle' };
      case 'ALERTA_VENCIMENTO':
        return { label: 'Vencendo', bg: '#854d0e', text: '#facc15', icon: 'time-outline' };
      case 'IRREGULAR':
        return { label: 'Irregular / Avaria', bg: '#991b1b', text: '#f87171', icon: 'alert-circle' };
      default:
        return { label: 'Pendente', bg: '#334155', text: '#94a3b8', icon: 'help-circle-outline' };
    }
  };

  const handleSalvarVistoria = () => {
    if (!pontoSelecionado) return;
    const atualizado = AtivoMallService.registrarVistoria(pontoSelecionado.id, {
      condicaoVisual: vistoriaCondicao,
      midiaPresente: vistoriaPresente,
      observacao: vistoriaObs,
    });
    setPontoSelecionado(atualizado);
    setModoVistoria(false);
    setVistoriaObs('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="tv" size={24} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {pontoSelecionado
                    ? `${pontoSelecionado.codigoPonto} • ${pontoSelecionado.nomePonto}`
                    : 'Ativos do Mall & Fiscalização de Mídia'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  Centro Fashion Fortaleza • Totens Digitais, Lonas, Painéis e Cancelas
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              {pontoSelecionado && (
                <TouchableOpacity
                  style={styles.btnVoltarLista}
                  onPress={() => {
                    setPontoSelecionado(null);
                    setModoVistoria(false);
                  }}
                >
                  <Ionicons name="arrow-back" size={16} color="#38bdf8" />
                  <Text style={styles.btnVoltarListaText}>Todos os Pontos</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cards de Métricas Rápidas (Topo) */}
          {!pontoSelecionado && (
            <View style={styles.metricasContainer}>
              <View style={styles.metricaCard}>
                <Text style={styles.metricaValor}>{metricas.total}</Text>
                <Text style={styles.metricaRotulo}>Pontos Mapeados</Text>
              </View>
              <View style={styles.metricaCard}>
                <Text style={[styles.metricaValor, { color: '#34d399' }]}>
                  {metricas.taxaConformidade}%
                </Text>
                <Text style={styles.metricaRotulo}>Conformidade</Text>
              </View>
              <View style={styles.metricaCard}>
                <Text style={[styles.metricaValor, { color: '#38bdf8' }]}>
                  {metricas.totensDigitais}
                </Text>
                <Text style={styles.metricaRotulo}>Totens Digitais</Text>
              </View>
              <View style={styles.metricaCard}>
                <Text style={[styles.metricaValor, { color: '#f87171' }]}>
                  {metricas.vencidas}
                </Text>
                <Text style={styles.metricaRotulo}>Campanhas Vencidas</Text>
              </View>
              <View style={styles.metricaCard}>
                <Text style={[styles.metricaValor, { color: '#facc15' }]}>
                  {metricas.irregulares}
                </Text>
                <Text style={styles.metricaRotulo}>Com Avaria / Reparo</Text>
              </View>
            </View>
          )}

          {/* Conteúdo: Ficha Detalhada ou Lista de Pontos */}
          {pontoSelecionado ? (
            /* Ficha Detalhada do Ponto */
            <ScrollView style={styles.detalhesScroll}>
              <View style={styles.detalhesContent}>
                {/* Cabeçalho do Ponto */}
                <View style={styles.pontoDestaqueCard}>
                  <View style={styles.pontoDestaqueHeader}>
                    <View style={styles.pontoCodRow}>
                      <View style={styles.tagCod}>
                        <Text style={styles.tagCodText}>{pontoSelecionado.codigoPonto}</Text>
                      </View>
                      <View
                        style={[
                          styles.badgeTipo,
                          { backgroundColor: getTipoBadge(pontoSelecionado.tipoEstrutura).bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeTipoText,
                            { color: getTipoBadge(pontoSelecionado.tipoEstrutura).text },
                          ]}
                        >
                          {getTipoBadge(pontoSelecionado.tipoEstrutura).label}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.badgeAuditoria,
                        {
                          backgroundColor: getStatusAuditoriaBadge(
                            pontoSelecionado.statusAuditoria
                          ).bg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeAuditoriaText,
                          {
                            color: getStatusAuditoriaBadge(
                              pontoSelecionado.statusAuditoria
                            ).text,
                          },
                        ]}
                      >
                        {getStatusAuditoriaBadge(pontoSelecionado.statusAuditoria).label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.pontoDestaqueNome}>{pontoSelecionado.nomePonto}</Text>
                  <Text style={styles.pontoDestaqueLocal}>
                    <Ionicons name="location-outline" size={14} color="#94a3b8" />{' '}
                    {pontoSelecionado.setor} • {pontoSelecionado.corredor}
                  </Text>
                  <Text style={styles.pontoDestaqueRef}>
                    Referência: {pontoSelecionado.referencia}
                  </Text>
                  <Text style={styles.pontoDestaqueDimensoes}>
                    Dimensões: {pontoSelecionado.dimensoes}
                  </Text>

                  {/* Ações Rápidas */}
                  <View style={styles.acoesContainer}>
                    <TouchableOpacity
                      style={styles.btnAcaoVistoria}
                      onPress={() => setModoVistoria(!modoVistoria)}
                    >
                      <Ionicons name="clipboard-outline" size={18} color="#fff" />
                      <Text style={styles.btnAcaoVistoriaText}>
                        {modoVistoria ? 'Cancelar Vistoria' : 'Registrar Vistoria de Campo'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnAcaoOcorrencia}
                      onPress={() => {
                        onClose();
                        if (onAbrirOcorrenciaParaMidia) {
                          onAbrirOcorrenciaParaMidia(pontoSelecionado);
                        }
                      }}
                    >
                      <Ionicons name="warning-outline" size={18} color="#fff" />
                      <Text style={styles.btnAcaoOcorrenciaText}>
                        Abrir Ocorrência para este Ativo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Painel de Registro de Vistoria (se ativo) */}
                {modoVistoria && (
                  <View style={styles.formVistoriaCard}>
                    <Text style={styles.formVistoriaTitulo}>Auditoria de Campo • Registro Rápido</Text>
                    
                    <Text style={styles.labelCampo}>Condição Visual da Mídia / Estrutura:</Text>
                    <View style={styles.botoesCondicaoRow}>
                      {(['BOA', 'REGULAR', 'DANIFICADA'] as CondicaoFisica[]).map((cond) => (
                        <TouchableOpacity
                          key={cond}
                          style={[
                            styles.btnCondicao,
                            vistoriaCondicao === cond && styles.btnCondicaoAtivo,
                          ]}
                          onPress={() => setVistoriaCondicao(cond)}
                        >
                          <Text
                            style={[
                              styles.btnCondicaoText,
                              vistoriaCondicao === cond && styles.btnCondicaoTextAtivo,
                            ]}
                          >
                            {cond}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={[styles.labelCampo, { marginTop: 12 }]}>Mídia Presente na Estrutura?</Text>
                    <View style={styles.botoesCondicaoRow}>
                      <TouchableOpacity
                        style={[
                          styles.btnCondicao,
                          vistoriaPresente && styles.btnCondicaoAtivo,
                        ]}
                        onPress={() => setVistoriaPresente(true)}
                      >
                        <Text
                          style={[
                            styles.btnCondicaoText,
                            vistoriaPresente && styles.btnCondicaoTextAtivo,
                          ]}
                        >
                          SIM (Instalada)
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.btnCondicao,
                          !vistoriaPresente && styles.btnCondicaoAtivo,
                        ]}
                        onPress={() => setVistoriaPresente(false)}
                      >
                        <Text
                          style={[
                            styles.btnCondicaoText,
                            !vistoriaPresente && styles.btnCondicaoTextAtivo,
                          ]}
                        >
                          NÃO (Vaga / Removida)
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.labelCampo, { marginTop: 12 }]}>Observações da Vistoria:</Text>
                    <TextInput
                      style={styles.inputObs}
                      placeholder="Ex: Lona com ilhós rasgado, tela apagada, sujidade no vidro..."
                      placeholderTextColor="#64748b"
                      value={vistoriaObs}
                      onChangeText={setVistoriaObs}
                      multiline
                    />

                    <TouchableOpacity
                      style={styles.btnSalvarVistoria}
                      onPress={handleSalvarVistoria}
                    >
                      <Ionicons name="checkmark-done" size={18} color="#fff" />
                      <Text style={styles.btnSalvarVistoriaText}>Confirmar e Salvar Vistoria</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Campanha Vigente */}
                <View style={styles.cardCampanha}>
                  <Text style={styles.cardTitulo}>Campanha Publicitária Atual</Text>
                  {pontoSelecionado.anunciante ? (
                    <View style={styles.campanhaInfo}>
                      <View style={styles.campanhaRow}>
                        <Text style={styles.campanhaLabel}>Anunciante:</Text>
                        <Text style={styles.campanhaValorDestaque}>
                          {pontoSelecionado.anunciante}
                        </Text>
                      </View>
                      <View style={styles.campanhaRow}>
                        <Text style={styles.campanhaLabel}>Título / Peça:</Text>
                        <Text style={styles.campanhaValor}>
                          {pontoSelecionado.tituloCampanha}
                        </Text>
                      </View>
                      <View style={styles.campanhaRow}>
                        <Text style={styles.campanhaLabel}>Período Contratado:</Text>
                        <Text style={styles.campanhaValor}>
                          {pontoSelecionado.dataInicio} até {pontoSelecionado.dataFim}
                        </Text>
                      </View>
                      <View style={styles.campanhaRow}>
                        <Text style={styles.campanhaLabel}>Status de Validade:</Text>
                        <Text
                          style={[
                            styles.campanhaValor,
                            pontoSelecionado.statusValidade === 'VENCIDA'
                              ? { color: '#f87171', fontWeight: '800' }
                              : { color: '#34d399', fontWeight: '800' },
                          ]}
                        >
                          {pontoSelecionado.statusValidade}{' '}
                          {pontoSelecionado.diasRestantes !== undefined &&
                            (pontoSelecionado.diasRestantes >= 0
                              ? `(${pontoSelecionado.diasRestantes} dias restantes)`
                              : `(expirado há ${Math.abs(pontoSelecionado.diasRestantes)} dias)`)}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.vazioCampanha}>
                      <Ionicons name="information-circle-outline" size={32} color="#64748b" />
                      <Text style={styles.vazioCampanhaTexto}>
                        Nenhuma campanha veiculando no momento. Ponto disponível para comercialização.
                      </Text>
                    </View>
                  )}
                </View>

                {/* Histórico de Vistorias */}
                <View style={styles.cardHistorico}>
                  <Text style={styles.cardTitulo}>
                    Histórico de Fiscalizações ({pontoSelecionado.historicoVistorias.length})
                  </Text>
                  {pontoSelecionado.historicoVistorias.map((v) => (
                    <View key={v.id} style={styles.historicoItem}>
                      <View style={styles.historicoItemHeader}>
                        <View style={styles.auditorRow}>
                          <Ionicons name="person-circle-outline" size={18} color="#38bdf8" />
                          <Text style={styles.historicoAuditor}>{v.auditor}</Text>
                        </View>
                        <View
                          style={[
                            styles.badgeHistorico,
                            {
                              backgroundColor:
                                v.statusCalculado === 'CONFORME' ? '#065f46' : '#991b1b',
                            },
                          ]}
                        >
                          <Text style={styles.badgeHistoricoText}>{v.statusCalculado}</Text>
                        </View>
                      </View>
                      <Text style={styles.historicoCondicao}>
                        Condição: {v.condicaoVisual} • Mídia Presente:{' '}
                        {v.midiaPresente ? 'Sim' : 'Não'}
                      </Text>
                      {v.observacao ? (
                        <Text style={styles.historicoObs}>{v.observacao}</Text>
                      ) : null}
                      <Text style={styles.historicoData}>{v.data}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          ) : (
            /* Lista e Filtros de Pontos de Mídia */
            <View style={styles.listaWrapper}>
              {/* Barra de Busca e Filtros */}
              <View style={styles.filtrosBar}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={18} color="#64748b" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por código (ex: TOT-AZ-01), nome ou anunciante..."
                    placeholderTextColor="#64748b"
                    value={termoBusca}
                    onChangeText={setTermoBusca}
                  />
                  {termoBusca ? (
                    <TouchableOpacity onPress={() => setTermoBusca('')}>
                      <Ionicons name="close-circle" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Chips de Tipo de Estrutura */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                  {[
                    { id: 'TODOS', label: 'Todos os Tipos' },
                    { id: 'TOTEM_DIGITAL', label: 'Totens Digitais' },
                    { id: 'PAINEL_LED', label: 'Painéis LED' },
                    { id: 'LONA_AEREA', label: 'Lonas Aéreas' },
                    { id: 'CANCELA_ESTACIONAMENTO', label: 'Cancelas' },
                    { id: 'ADESIVO_PISO', label: 'Adesivos Piso' },
                  ].map((chip) => (
                    <TouchableOpacity
                      key={chip.id}
                      style={[styles.chip, filtroTipo === chip.id && styles.chipAtivo]}
                      onPress={() => setFiltroTipo(chip.id)}
                    >
                      <Text style={[styles.chipText, filtroTipo === chip.id && styles.chipTextAtivo]}>
                        {chip.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Chips de Status de Auditoria */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipsScroll, { marginTop: 6 }]}>
                  {[
                    { id: 'TODOS', label: 'Todos os Status' },
                    { id: 'CONFORME', label: 'Conformes' },
                    { id: 'ALERTA_VENCIMENTO', label: 'Vencendo em breve' },
                    { id: 'IRREGULAR', label: 'Irregulares / Avarias' },
                  ].map((st) => (
                    <TouchableOpacity
                      key={st.id}
                      style={[styles.chipPequeno, filtroStatus === st.id && styles.chipPequenoAtivo]}
                      onPress={() => setFiltroStatus(st.id)}
                    >
                      <Text
                        style={[
                          styles.chipPequenoText,
                          filtroStatus === st.id && styles.chipPequenoTextAtivo,
                        ]}
                      >
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Grid de Pontos */}
              <ScrollView style={styles.pontosScroll}>
                <View style={styles.pontosGrid}>
                  {pontos.map((p) => {
                    const tipoInfo = getTipoBadge(p.tipoEstrutura);
                    const audInfo = getStatusAuditoriaBadge(p.statusAuditoria);

                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={styles.cardPonto}
                        onPress={() => setPontoSelecionado(p)}
                      >
                        <View style={styles.cardPontoHeader}>
                          <View style={styles.cardPontoCod}>
                            <Text style={styles.cardPontoCodText}>{p.codigoPonto}</Text>
                          </View>

                          <View style={[styles.cardPontoAuditoria, { backgroundColor: audInfo.bg }]}>
                            <Text style={[styles.cardPontoAuditoriaText, { color: audInfo.text }]}>
                              {audInfo.label}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.cardPontoNome} numberOfLines={1}>
                          {p.nomePonto}
                        </Text>
                        
                        <View style={[styles.cardPontoTipoTag, { backgroundColor: tipoInfo.bg }]}>
                          <Ionicons name={tipoInfo.icon as any} size={12} color={tipoInfo.text} />
                          <Text style={[styles.cardPontoTipoText, { color: tipoInfo.text }]}>
                            {tipoInfo.label} • {p.dimensoes}
                          </Text>
                        </View>

                        <Text style={styles.cardPontoLocal} numberOfLines={1}>
                          <Ionicons name="location-outline" size={12} color="#94a3b8" />{' '}
                          {p.setor} • {p.corredor}
                        </Text>

                        {/* Informação de Campanha */}
                        <View style={styles.cardPontoCampanha}>
                          <Text style={styles.cardPontoAnunciante} numberOfLines={1}>
                            {p.anunciante ? `📢 ${p.anunciante}` : '⚪ Espaço Disponível'}
                          </Text>
                          {p.dataFim ? (
                            <Text
                              style={[
                                styles.cardPontoValidade,
                                p.statusValidade === 'VENCIDA' && { color: '#f87171' },
                              ]}
                            >
                              Validade: {p.dataFim}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.cardPontoFooter}>
                          <Text style={styles.cardPontoUltimaVistoria}>
                            Vistoria: {p.ultimaVistoria ? p.ultimaVistoria.split(' ')[0] : 'Pendente'}
                          </Text>
                          <Ionicons name="chevron-forward" size={16} color="#64748b" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 980,
    height: '92%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnVoltarLista: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  btnVoltarListaText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '600',
  },
  btnClose: {
    padding: 6,
  },
  /* Métricas */
  metricasContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#131f37',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 10,
  },
  metricaCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricaValor: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  metricaRotulo: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  /* Filtros */
  listaWrapper: {
    flex: 1,
  },
  filtrosBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
    height: 42,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 13,
    marginLeft: 8,
  },
  chipsScroll: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  chipText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  chipTextAtivo: {
    color: '#fff',
    fontWeight: '700',
  },
  chipPequeno: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#243248',
  },
  chipPequenoAtivo: {
    backgroundColor: '#334155',
    borderColor: '#64748b',
  },
  chipPequenoText: {
    fontSize: 11,
    color: '#64748b',
  },
  chipPequenoTextAtivo: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  /* Grid de Pontos */
  pontosScroll: {
    flex: 1,
    padding: 16,
  },
  pontosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardPonto: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardPontoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardPontoCod: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardPontoCodText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38bdf8',
  },
  cardPontoAuditoria: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cardPontoAuditoriaText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardPontoNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  cardPontoTipoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 4,
  },
  cardPontoTipoText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardPontoLocal: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 8,
  },
  cardPontoCampanha: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
  },
  cardPontoAnunciante: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
  },
  cardPontoValidade: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  cardPontoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  cardPontoUltimaVistoria: {
    fontSize: 10,
    color: '#64748b',
  },
  /* Detalhes */
  detalhesScroll: {
    flex: 1,
  },
  detalhesContent: {
    padding: 16,
    gap: 16,
  },
  pontoDestaqueCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pontoDestaqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pontoCodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagCod: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagCodText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38bdf8',
  },
  badgeTipo: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTipoText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeAuditoria: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAuditoriaText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pontoDestaqueNome: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    marginVertical: 4,
  },
  pontoDestaqueLocal: {
    fontSize: 13,
    color: '#94a3b8',
  },
  pontoDestaqueRef: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  pontoDestaqueDimensoes: {
    fontSize: 12,
    color: '#38bdf8',
    marginTop: 4,
    fontWeight: '600',
  },
  acoesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  btnAcaoVistoria: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnAcaoVistoriaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  btnAcaoOcorrencia: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#b91c1c',
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnAcaoOcorrenciaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  /* Form Vistoria */
  formVistoriaCard: {
    backgroundColor: '#131f37',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  formVistoriaTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: 10,
  },
  labelCampo: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 6,
  },
  botoesCondicaoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnCondicao: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnCondicaoAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  btnCondicaoText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  btnCondicaoTextAtivo: {
    color: '#fff',
    fontWeight: '800',
  },
  inputObs: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 10,
    color: '#f8fafc',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  btnSalvarVistoria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  btnSalvarVistoriaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  /* Card Campanha */
  cardCampanha: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  campanhaInfo: {
    gap: 8,
  },
  campanhaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#243248',
  },
  campanhaLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  campanhaValor: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  campanhaValorDestaque: {
    fontSize: 13,
    color: '#38bdf8',
    fontWeight: '800',
  },
  vazioCampanha: {
    alignItems: 'center',
    padding: 20,
  },
  vazioCampanhaTexto: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  /* Card Histórico */
  cardHistorico: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historicoItem: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#243248',
  },
  historicoItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auditorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historicoAuditor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
  },
  badgeHistorico: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeHistoricoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  historicoCondicao: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  historicoObs: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 2,
    fontStyle: 'italic',
  },
  historicoData: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 6,
  },
});
