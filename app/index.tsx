import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, TextInput, ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { InteractiveMallMap, SignagePin } from '../src/components/InteractiveMallMap';
import { AppMenuModal } from '../src/components/AppMenuModal';
import { CamadasModal } from '../src/components/CamadasModal';
import { SinalizacaoCard } from '../src/components/SinalizacaoCard';
import { LocalCardConfirmation } from '../src/components/LocalCardConfirmation';
import { FormPanelModal } from '../src/components/FormPanelModal';
import { OfflineCacheModal } from '../src/components/OfflineCacheModal';
import { FilaOutboxModal, OutboxItem } from '../src/components/FilaOutboxModal';
import { FotoGaleriaModal } from '../src/components/FotoGaleriaModal';
import { InspecaoModal } from '../src/components/InspecaoModal';
import { HistoricoModal } from '../src/components/HistoricoModal';
import { PendenciasModal } from '../src/components/PendenciasModal';
import { CicloVidaModal } from '../src/components/CicloVidaModal';
import { AntesDepoisModal } from '../src/components/AntesDepoisModal';
import { DashboardExecutivoModal } from '../src/components/DashboardExecutivoModal';
import { CentralGestaoModal } from '../src/components/CentralGestaoModal';
import { RondaExecucaoModal } from '../src/components/RondaExecucaoModal';
import { AlertasModal } from '../src/components/AlertasModal';
import { AgendaModal } from '../src/components/AgendaModal';
import { RelatoriosSlidesModal } from '../src/components/RelatoriosSlidesModal';
import { Loja360Modal } from '../src/components/Loja360Modal';
import { FichaLoja360, Loja360Service } from '../src/services/loja360Service';
import { CatalogoProducaoService, LojaProducaoItem } from '../src/services/catalogoProducaoService';
import { CentralGestaoLojistasModal } from '../src/components/CentralGestaoLojistasModal';
import { FinanceiroRestritoModal } from '../src/components/FinanceiroRestritoModal';
import { CentralFinanceiraModal } from '../src/components/CentralFinanceiraModal';
import { ContratoEditorModal } from '../src/components/ContratoEditorModal';
import { LancamentoEditorModal } from '../src/components/LancamentoEditorModal';
import { PagamentoRegistroModal } from '../src/components/PagamentoRegistroModal';
import { AcordoEditorModal } from '../src/components/AcordoEditorModal';
import {
  ContratoLocacao,
  LancamentoFinanceiro,
  AcordoFinanceiro,
  FinanceiroRestritoService,
} from '../src/services/financeiroRestritoService';
import { AuditoriaVendasCentralModal } from '../src/components/AuditoriaVendasCentralModal';
import { AuditoriaVendasEditorModal } from '../src/components/AuditoriaVendasEditorModal';
import { RegistroAuditoriaVenda } from '../src/services/auditoriaVendasService';
import { CentralAnaliticaModal } from '../src/components/CentralAnaliticaModal';
import { AdminModal } from '../src/components/AdminModal';
import { CentralCartograficaModal, TabCartografia } from '../src/components/CentralCartograficaModal';
import { CalibracaoSetorNivelModal } from '../src/components/CalibracaoSetorNivelModal';
import { AreasOperacionaisNivel0Modal } from '../src/components/AreasOperacionaisNivel0Modal';
import { ConfiguracoesCadastroModal } from '../src/components/ConfiguracoesCadastroModal';
import { CentralReferenciasModal } from '../src/components/CentralReferenciasModal';
import {
  CartografiaService,
  CORES_PADRAO_TIPOS_REFERENCIA,
  PontoReferenciaOficial,
} from '../src/services/cartografiaService';
import { GerenciadorReferenciasModal } from '../src/components/GerenciadorReferenciasModal';
import { ReferenciaCard } from '../src/components/ReferenciaCard';
import { AtivoMallModal } from '../src/components/AtivoMallModal';
import { AtivoMidiaPonto } from '../src/services/ativoMallService';
import { CampanhaCentralModal } from '../src/components/CampanhaCentralModal';
import { CampanhaService, ParticipacaoLojaCampanha } from '../src/services/campanhaService';
import { LevantamentoModal } from '../src/components/LevantamentoModal';
import { LevantamentoRegistroModal } from '../src/components/LevantamentoRegistroModal';
import {
  PontoLevantamento,
  getPontosSessao,
  obterProximoPontoPendente,
} from '../src/services/levantamentoCampoService';
import { CapturedPhoto, mediaService } from '../src/services/mediaService';
import { LegacyTheme } from '../src/theme/legacy-theme';
import { seedPins } from '../src/data/seedPins';

const initialPins: SignagePin[] = seedPins;

const initialOutboxItems: OutboxItem[] = [
  {
    clientEventId: 'evt_20260823_001',
    type: 'NOVO_REGISTRO',
    title: 'Placa de Emergência — Ambulatório',
    status: 'PENDENTE',
    retryCount: 0,
    timestamp: '2026-08-23 18:20',
  },
  {
    clientEventId: 'evt_20260823_002',
    type: 'EDICAO_REGISTRO',
    title: 'Placa Direcional Editada — Setor Azul',
    status: 'ERRO',
    retryCount: 2,
    errorMessage: '504 Gateway Timeout — Conexão instável',
    timestamp: '2026-08-23 18:25',
  },
];

import { OfflineStorageService } from '../src/services/OfflineStorageService';
import { OutboxSyncEngine, OutboxMutation } from '../src/sync/outboxEngine';
import { StorageFactory } from '../src/storage/StorageFactory';
import { getDeviceId } from '../src/services/deviceId';
import { API_BASE_URL } from '../src/services/apiClient';

export default function LegacyMainShellScreen() {
  const [selectedMapKey, setSelectedMapKey] = useState<string>('SETOR_AZUL');

  // Inicialização com Storage Real (SQLite no nativo / localStorage na web)
  const [pinsList, setPinsList] = useState<SignagePin[]>([]);
  const [outboxItems, setOutboxItems] = useState<OutboxItem[]>([]);

  // Pin Selecionado no Mapa
  const [selectedPin, setSelectedPin] = useState<SignagePin | null>(null);

  // Hidratação assíncrona do storage (SQLite/localStorage via StorageFactory)
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        const [pins, outbox] = await Promise.all([
          OfflineStorageService.loadPins(),
          OfflineStorageService.loadOutbox(),
        ]);
        if (cancelled) return;
        setPinsList(pins);
        setOutboxItems(outbox);
        setSelectedPin((current) => current ?? pins[0] ?? null);
      } catch (e) {
        console.error('[STORAGE] Falha na hidratação inicial:', e);
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  // Outbox Sync Engine (fila de mutações persistida + sincronização real com a API)
  const syncEngineRef = useRef<OutboxSyncEngine | null>(null);
  if (!syncEngineRef.current) {
    syncEngineRef.current = new OutboxSyncEngine(`${API_BASE_URL}/sync`, StorageFactory.getAdapter());
  }
  useEffect(() => {
    void syncEngineRef.current?.init().then(() => {
      setEnginePendingCount(syncEngineRef.current?.getPendingQueue().length ?? 0);
    });
  }, []);

  // Modais e Painéis da UI-2
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [camadasOpen, setCamadasOpen] = useState<boolean>(false);
  const [showCentralCamadas, setShowCentralCamadas] = useState<boolean>(false);
  const [showSinalizacoes, setShowSinalizacoes] = useState<boolean>(true);
  const [showReferencias, setShowReferencias] = useState<boolean>(true);
  const [showCruzamentos, setShowCruzamentos] = useState<boolean>(true);
  const [showLojas, setShowLojas] = useState<boolean>(false);
  const [camadasFilters, setCamadasFilters] = useState<{
    query?: string;
    tipo?: string;
    finalidade?: string;
    responsavel?: string;
    status?: string;
    conservacao?: string;
    condicao?: string;
  }>({});

  // Pins filtrados pelas regras da Central de Camadas e busca
  const displayedPins = useMemo(() => {
    return pinsList.filter((p) => {
      if (camadasFilters.query && camadasFilters.query.trim()) {
        const q = camadasFilters.query.toLowerCase().trim();
        const match =
          p.assetCode?.toLowerCase().includes(q) ||
          (p.notes && p.notes.toLowerCase().includes(q)) ||
          (p.humanLocation && p.humanLocation.toLowerCase().includes(q)) ||
          p.category?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (camadasFilters.tipo && camadasFilters.tipo !== 'Todos') {
        if (p.category !== camadasFilters.tipo) return false;
      }
      if (camadasFilters.responsavel && camadasFilters.responsavel !== 'Todos') {
        if (p.responsible !== camadasFilters.responsavel) return false;
      }
      if (camadasFilters.status && camadasFilters.status !== 'Todos') {
        if (p.status !== camadasFilters.status) return false;
      }
      if (camadasFilters.conservacao && camadasFilters.conservacao !== 'Todos') {
        if (p.conservationState !== camadasFilters.conservacao) return false;
      }
      return true;
    });
  }, [pinsList, camadasFilters]);

  const handleCamadasFilterChange = useCallback((filters: any) => {
    setCamadasFilters((prev) => {
      if (
        prev.query === filters.query &&
        prev.tipo === filters.tipo &&
        prev.finalidade === filters.finalidade &&
        prev.responsavel === filters.responsavel &&
        prev.status === filters.status &&
        prev.conservacao === filters.conservacao &&
        prev.condicao === filters.condicao
      ) {
        return prev;
      }
      return filters;
    });
  }, []);

  const [corReferencia, setCorReferencia] = useState<string>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('sinalizacao_mall_cor_referencia') || '#38bdf8';
    }
    return '#38bdf8';
  });

  const handleUpdateCorReferencia = useCallback((novaCor: string) => {
    setCorReferencia(novaCor);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('sinalizacao_mall_cor_referencia', novaCor);
    }
  }, []);

  const [coresReferencias, setCoresReferencias] = useState<Record<string, string>>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('sinalizacao_mall_cores_tipos_referencia');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return CORES_PADRAO_TIPOS_REFERENCIA;
  });

  const handleUpdateCoresReferencias = useCallback((novasCores: Record<string, string>) => {
    setCoresReferencias(novasCores);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('sinalizacao_mall_cores_tipos_referencia', JSON.stringify(novasCores));
    }
  }, []);

  // Gestão Dinâmica de Referências Cartográficas Oficiais
  const [referenciasList, setReferenciasList] = useState<PontoReferenciaOficial[]>(() => {
    return CartografiaService.obterTodasReferenciasOficiais();
  });
  const [gerenciadorRefOpen, setGerenciadorRefOpen] = useState<boolean>(false);
  const [selectedReferencia, setSelectedReferencia] = useState<PontoReferenciaOficial | null>(null);
  const [editingReferencia, setEditingReferencia] = useState<PontoReferenciaOficial | null>(null);

  const handleSalvarReferencia = useCallback((novaRef: PontoReferenciaOficial) => {
    const atualizada = CartografiaService.salvarReferenciaOficial(novaRef);
    setReferenciasList(atualizada);
    setSelectedReferencia(novaRef);
    setFormPanelVisible(false);
    setEditingReferencia(null);
  }, []);

  const handleExcluirReferencia = useCallback((refId: string) => {
    const atualizada = CartografiaService.excluirReferenciaOficial(refId);
    setReferenciasList(atualizada);
    if (selectedReferencia?.id === refId) {
      setSelectedReferencia(null);
    }
  }, [selectedReferencia]);

  const handleRestaurarPadraoReferencias = useCallback(() => {
    const padrao = CartografiaService.restaurarReferenciasPadrao();
    setReferenciasList(padrao);
    setSelectedReferencia(null);
  }, []);

  const handleIniciarCriacaoReferencia = useCallback(() => {
    setEditingPin(null);
    setEditingReferencia(null);
    setFormMode('NOVO');
    setFormPanelVisible(true);
  }, []);

  const handleEditarReferencia = useCallback((ref: PontoReferenciaOficial) => {
    setEditingPin(null);
    setEditingReferencia(ref);
    setFormMode('EDITAR');
    setFormPanelVisible(true);
  }, []);

  const handleFocarReferenciaNoMapa = useCallback((ref: PontoReferenciaOficial) => {
    const chaveSetor = ref.idMapaSetor.replace('MAP-CFF-N1-', 'SETOR_').replace('MAP-CFF-N2-', 'SETOR_').replace('MAP-CFF-N3-', 'SETOR_');
    if (chaveSetor) {
      setSelectedMapKey(chaveSetor);
    }
    setSelectedReferencia(ref);
    setGerenciadorRefOpen(false);
  }, []);

  // Estados do Fluxo de Posicionamento e Cadastro (UI-3)
  const [positioningMode, setPositioningMode] = useState<boolean>(false);
  const [draftPin, setDraftPin] = useState<{ normalizedX: number; normalizedY: number } | null>(null);
  const [localCardVisible, setLocalCardVisible] = useState<boolean>(false);
  const [formPanelVisible, setFormPanelVisible] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'NOVO' | 'EDITAR'>('NOVO');
  const [editingPin, setEditingPin] = useState<SignagePin | null>(null);
  const [identifiedLocationText, setIdentifiedLocationText] = useState<string>('');

  // Estados de Rede e Offline/Outbox (UI-4)
  const [networkState, setNetworkState] = useState<'ONLINE' | 'DEGRADADO' | 'OFFLINE' | 'RECUPERANDO'>('ONLINE');
  const [offlineCacheOpen, setOfflineCacheOpen] = useState<boolean>(false);
  const [filaOutboxOpen, setFilaOutboxOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [enginePendingCount, setEnginePendingCount] = useState<number>(0);

  // Modal de Fotos da Galeria S22.5 (Superfície #9 - UI-5)
  const [fotoModalOpen, setFotoModalOpen] = useState<boolean>(false);
  const [fotoPin, setFotoPin] = useState<SignagePin | null>(null);

  // Usabilidade, Busca Rápida e Filtros de Ronda (UI-6)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterConservation, setFilterConservation] = useState<string>('TODOS');
  const [inspecaoModalOpen, setInspecaoModalOpen] = useState<boolean>(false);
  const [inspecaoPin, setInspecaoPin] = useState<SignagePin | null>(null);

  // Ações do Card de Sinalização (UI-7)
  const [historicoModalOpen, setHistoricoModalOpen] = useState<boolean>(false);
  const [historicoPin, setHistoricoPin] = useState<SignagePin | null>(null);

  const [pendenciasModalOpen, setPendenciasModalOpen] = useState<boolean>(false);
  const [pendenciasPin, setPendenciasPin] = useState<SignagePin | null>(null);

  const [cicloVidaModalOpen, setCicloVidaModalOpen] = useState<boolean>(false);
  const [cicloVidaPin, setCicloVidaPin] = useState<SignagePin | null>(null);

  // Comparador Antes e Depois & Dashboard Gerencial (Etapa 1)
  const [antesDepoisOpen, setAntesDepoisOpen] = useState<boolean>(false);
  const [antesDepoisPin, setAntesDepoisPin] = useState<SignagePin | null>(null);
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);

  // Operação em Campo & Central de Gestão (Etapa 2)
  const [centralGestaoOpen, setCentralGestaoOpen] = useState<boolean>(false);
  const [rondaExecucaoOpen, setRondaExecucaoOpen] = useState<boolean>(false);
  const [alertasOpen, setAlertasOpen] = useState<boolean>(false);
  const [agendaOpen, setAgendaOpen] = useState<boolean>(false);

  // Relatórios Executivos & Apresentações em Slides (Etapa 3)
  const [relatoriosOpen, setRelatoriosOpen] = useState<boolean>(false);

  // Loja 360 & Gestão de Boxes (Paridade Google Apps Script)
  const [loja360Open, setLoja360Open] = useState<boolean>(false);
  const [lojaSelecionada360, setLojaSelecionada360] = useState<FichaLoja360 | null>(null);
  const [centralGestaoLojistasOpen, setCentralGestaoLojistasOpen] = useState<boolean>(false);

  // Contratos & Financeiro Restrito (Fase L3.4, L3.5, L3.6 e L3.7)
  const [financeiroModalOpen, setFinanceiroModalOpen] = useState<boolean>(false);
  const [financeiroPermissionarioId, setFinanceiroPermissionarioId] = useState<string | null>(null);
  const [centralFinanceiraOpen, setCentralFinanceiraOpen] = useState<boolean>(false);
  const [contratoEditorOpen, setContratoEditorOpen] = useState<boolean>(false);
  const [contratoEditorPermissionarioId, setContratoEditorPermissionarioId] = useState<string | null>(null);
  const [contratoParaEditar, setContratoParaEditar] = useState<ContratoLocacao | null>(null);
  const [lancamentoEditorOpen, setLancamentoEditorOpen] = useState<boolean>(false);
  const [lancamentoParaAjustar, setLancamentoParaAjustar] = useState<LancamentoFinanceiro | null>(null);
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState<boolean>(false);
  const [lancamentoParaPagamento, setLancamentoParaPagamento] = useState<LancamentoFinanceiro | null>(null);
  const [acordoEditorOpen, setAcordoEditorOpen] = useState<boolean>(false);
  const [acordoParaEditar, setAcordoParaEditar] = useState<AcordoFinanceiro | null>(null);
  const [financeiroUpdateKey, setFinanceiroUpdateKey] = useState<number>(0);

  // Auditoria de Vendas & Faturamento (Fase L3.8)
  const [auditoriaCentralOpen, setAuditoriaCentralOpen] = useState<boolean>(false);
  const [auditoriaEditorOpen, setAuditoriaEditorOpen] = useState<boolean>(false);
  const [auditoriaParaEditar, setAuditoriaParaEditar] = useState<RegistroAuditoriaVenda | null>(null);
  const [auditoriaUpdateKey, setAuditoriaUpdateKey] = useState<number>(0);

  // Central Analítica Comercial (Fase L3.9)
  const [centralAnaliticaOpen, setCentralAnaliticaOpen] = useState<boolean>(false);

  // Central de Administração Global & Governança Cartográfica (Fase L5.0)
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [centralCartograficaOpen, setCentralCartograficaOpen] = useState<boolean>(false);
  const [calibracaoModalOpen, setCalibracaoModalOpen] = useState<boolean>(false);
  const [areasNivel0ModalOpen, setAreasNivel0ModalOpen] = useState<boolean>(false);
  const [configuracoesCadastroOpen, setConfiguracoesCadastroOpen] = useState<boolean>(false);
  const [centralReferenciasOpen, setCentralReferenciasOpen] = useState<boolean>(false);
  const [abaCartograficaInicial, setAbaCartograficaInicial] = useState<TabCartografia>('CARTOGRAFIA');

  // Ativos do Mall & Fiscalização de Mídia Física (Paridade Google Apps Script)
  const [ativoMallOpen, setAtivoMallOpen] = useState<boolean>(false);

  // Camadas Temáticas de Campanhas no Mapa (L2.3, L2.4, L2.5)
  const [campanhaAtivaId, setCampanhaAtivaId] = useState<string | null>(null);
  const [campanhasCentralOpen, setCampanhasCentralOpen] = useState<boolean>(false);

  // Modo Levantamento de Campo & Salvar e Próximo (Fase L2.6)
  const [levantamentoModalOpen, setLevantamentoModalOpen] = useState<boolean>(false);
  const [levantamentoRegistroOpen, setLevantamentoRegistroOpen] = useState<boolean>(false);
  const [pontoLevantamentoSelecionado, setPontoLevantamentoSelecionado] = useState<PontoLevantamento | null>(null);
  const [mapResetTrigger, setMapResetTrigger] = useState<number>(0);

  const campanhaAdesoesMap = campanhaAtivaId ? CampanhaService.obterMapaCoresAdesao(campanhaAtivaId) : {};
  const campanhaAtivaInfo = campanhaAtivaId ? CampanhaService.obterCampanha(campanhaAtivaId) : null;
  const metricasCampanhaAtiva = campanhaAtivaId ? CampanhaService.obterMetricasCampanha(campanhaAtivaId) : null;

  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  // URL triggers e Listener automático para detector de rede (UI-4)
  useEffect(() => {
    const updateNetworkStatus = () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setNetworkState('OFFLINE');
      } else {
        setNetworkState('ONLINE');
      }
    };

    updateNetworkStatus();

    // NetInfo funciona em web e nativo; mantém fallback window para segurança
    let unsubscribeNetInfo: (() => void) | null = null;
    if (typeof NetInfo !== 'undefined' && typeof NetInfo.addEventListener === 'function') {
      unsubscribeNetInfo = NetInfo.addEventListener((state) => {
        if (state.isConnected === false || state.isInternetReachable === false) {
          setNetworkState('OFFLINE');
        } else {
          setNetworkState('ONLINE');
        }
      });
    } else if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('online', () => setNetworkState('ONLINE'));
      window.addEventListener('offline', () => setNetworkState('OFFLINE'));
    }
    const interval = setInterval(updateNetworkStatus, 1500);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');

      if (view === 'network_online') {
        setNetworkState('ONLINE');
      } else if (view === 'network_degradado') {
        setNetworkState('DEGRADADO');
      } else if (view === 'network_offline') {
        setNetworkState('OFFLINE');
      } else if (view === 'network_recuperando') {
        setNetworkState('RECUPERANDO');
      } else if (view === 'cache_modal') {
        setOfflineCacheOpen(true);
        setFilaOutboxOpen(false);
      } else if (view === 'fila_modal' || view === 'item_erro') {
        setFilaOutboxOpen(true);
        setOfflineCacheOpen(false);
      } else if (view === 'retry_action') {
        setFilaOutboxOpen(true);
        // Trata retry
        setOutboxItems((prev) =>
          prev.map((i) => (i.clientEventId === 'evt_20260823_002' ? { ...i, status: 'PROCESSANDO', errorMessage: null } : i))
        );
      } else if (view === 'fila_zerada') {
        setFilaOutboxOpen(true);
        setOutboxItems((prev) => prev.map((i) => ({ ...i, status: 'CONCLUIDO', errorMessage: null })));
      } else if (view === 'camadas') {
        setCamadasOpen(true);
        setShowCentralCamadas(false);
      } else if (view === 'central_camadas') {
        setCamadasOpen(true);
        setShowCentralCamadas(true);
      } else if (view === 'positioning' || view === 'location_confirm') {
        setPositioningMode(true);
        setDraftPin({ normalizedX: 0.35, normalizedY: 0.45 });
        setLocalCardVisible(true);
        setSelectedPin(null);
      } else if (view === 'create_form') {
        setPositioningMode(false);
        setDraftPin({ normalizedX: 0.35, normalizedY: 0.45 });
        setFormMode('NOVO');
        setFormPanelVisible(true);
        setSelectedPin(null);
      } else if (view === 'created_card') {
        setSelectedPin(initialPins[0]);
      } else if (view === 'edit_before_ui31') {
        setSelectedPin(initialPins[0]);
        setFormPanelVisible(false);
      } else if (view === 'edit_form_ui31' || view === 'edit_form') {
        setFormMode('EDITAR');
        setEditingPin(initialPins[0]);
        setFormPanelVisible(true);
      } else if (view === 'edit_after_ui31' || view === 'after_edit') {
        const editedPin: SignagePin = {
          ...initialPins[0],
          notes: 'Placa Direcional Editada — Auditada UI-3',
          humanLocation: 'Rua General Bezerril',
        };
        setPinsList((prev) => prev.map((p) => (p.id === '1' ? editedPin : p)));
        setSelectedPin(editedPin);
        setFormPanelVisible(false);
      }
    }

    return () => {
      clearInterval(interval);
      if (unsubscribeNetInfo) unsubscribeNetInfo();
    };
  }, []);

  const mapGroups = [
    {
      label: 'Setores',
      options: [
        { key: 'SETOR_AZUL', label: 'Setor Azul • Piso 1' },
        { key: 'SETOR_VERDE', label: 'Setor Verde • Piso 1' },
        { key: 'SETOR_BRANCO', label: 'Setor Branco • Piso 2' },
        { key: 'SETOR_AMARELO', label: 'Setor Amarelo • Piso 2' },
        { key: 'SETOR_ROXO', label: 'Setor Roxo • Piso 3' },
      ],
    },
    {
      label: 'Níveis 2025',
      options: [
        { key: 'NIVEL_1', label: 'Nível 1 — Azul + Verde' },
        { key: 'NIVEL_2', label: 'Nível 2 — Amarelo + Branco' },
        { key: 'NIVEL_3', label: 'Nível 3 — Roxo + Vermelho / Estacionamento' },
        { key: 'NIVEL_0', label: 'Nível 0 — Subsolo' },
      ],
    },
  ];

  const mapsList = [
    { key: 'SETOR_AZUL', label: 'Setor Azul • Piso 1' },
    { key: 'SETOR_VERDE', label: 'Setor Verde • Piso 1' },
    { key: 'SETOR_BRANCO', label: 'Setor Branco • Piso 2' },
    { key: 'SETOR_AMARELO', label: 'Setor Amarelo • Piso 2' },
    { key: 'SETOR_ROXO', label: 'Setor Roxo • Piso 3' },
    { key: 'NIVEL_1', label: 'Nível 1 — Azul + Verde' },
    { key: 'NIVEL_2', label: 'Nível 2 — Amarelo + Branco' },
    { key: 'NIVEL_3', label: 'Nível 3 — Roxo + Vermelho / Estacionamento' },
    { key: 'NIVEL_0', label: 'Nível 0 — Subsolo' },
  ];

  const handleResetView = () => {
    setSelectedMapKey('SETOR_AZUL');
    setSelectedPin(null);
    setPositioningMode(false);
    setDraftPin(null);
    setLocalCardVisible(false);
    setMapResetTrigger((prev) => prev + 1);
  };

  const handleSelectMenuOption = (itemId: string) => {
    setMenuOpen(false);
    if (itemId === 'novo') {
      setSelectedPin(null);
      setPositioningMode(true);
      const defX = 0.35;
      const defY = 0.45;
      setDraftPin({ normalizedX: defX, normalizedY: defY });
      const loc = CartografiaService.identificarLocalizacaoNoMapa(selectedMapKey, defX, defY);
      setIdentifiedLocationText(loc.textoCompleto);
      setLocalCardVisible(true);
    } else if (itemId === 'camadasBtn') {
      setCamadasOpen(true);
      setShowCentralCamadas(false);
    } else if (itemId === 'prepararOffline' || itemId === 'offline') {
      setOfflineCacheOpen(true);
    } else if (itemId === 'filaBtn' || itemId === 'fila') {
      setFilaOutboxOpen(true);
    } else if (itemId === 'dashboardBtn' || itemId === 'dashboard') {
      setDashboardOpen(true);
    } else if (itemId === 'centralGestaoBtn' || itemId === 'central') {
      setCentralGestaoLojistasOpen(true);
    } else if (itemId === 'centralFinanceiraBtn' || itemId === 'financeiro') {
      setCentralFinanceiraOpen(true);
    } else if (itemId === 'auditoriaVendasBtn' || itemId === 'auditoria') {
      setAuditoriaCentralOpen(true);
    } else if (itemId === 'analiticaBtn' || itemId === 'analitica') {
      setCentralAnaliticaOpen(true);
    } else if (itemId === 'loja360Btn' || itemId === 'loja360') {
      setLoja360Open(true);
    } else if (itemId === 'ativoMallBtn' || itemId === 'ativoMall' || itemId === 'midia') {
      setAtivoMallOpen(true);
    } else if (itemId === 'campanhasBtn' || itemId === 'campanhas') {
      setCampanhasCentralOpen(true);
    } else if (itemId === 'levantamentoBtn' || itemId === 'levantamento') {
      setLevantamentoModalOpen(true);
    } else if (itemId === 'rondaBtn' || itemId === 'ronda') {
      setRondaExecucaoOpen(true);
    } else if (itemId === 'alertasBtnS21' || itemId === 'alertas') {
      setAlertasOpen(true);
    } else if (itemId === 'agendaBtnS19' || itemId === 'agenda') {
      setAgendaOpen(true);
    } else if (itemId === 'relatoriosBtn' || itemId === 'relatorios') {
      setRelatoriosOpen(true);
    } else if (itemId === 'adminBtnS14' || itemId === 'admin') {
      setAdminModalOpen(true);
    } else if (itemId === 'configuracoesCadastroBtn' || itemId === 'configuracoesCadastro') {
      setConfiguracoesCadastroOpen(true);
    } else if (itemId === 'calibracaoBtnS242' || itemId === 'calibrar') {
      setCalibracaoModalOpen(true);
    } else if (itemId === 'areasSubsoloBtn' || itemId === 'subsolo') {
      setAreasNivel0ModalOpen(true);
    } else if (itemId === 'areasNivel1BtnS246' || itemId === 'nivel1') {
      setAbaCartograficaInicial('AREAS_NIVEL_1');
      setCentralCartograficaOpen(true);
    } else if (itemId === 'areaVermelhaBtnS244' || itemId === 'estacionamento') {
      setAbaCartograficaInicial('ESTACIONAMENTO');
      setCentralCartograficaOpen(true);
    } else if (itemId === 'torresNucleosBtn' || itemId === 'torres') {
      setAbaCartograficaInicial('TORRES_NUCLEOS');
      setCentralCartograficaOpen(true);
    } else if (itemId === 'referenciasBtn' || itemId === 'referencias' || itemId === 'centralReferenciasBtn') {
      setCentralReferenciasOpen(true);
    } else if (itemId === 'centralCartograficaBtn' || itemId === 'cartografia') {
      setAbaCartograficaInicial('CARTOGRAFIA');
      setCentralCartograficaOpen(true);
    }
  };

  const handleContinuarLevantamentoNoMapa = (ponto: PontoLevantamento) => {
    setLevantamentoModalOpen(false);
    const foundPin = pinsList.find((pin) => pin.id === ponto.idLojaMapa || pin.humanLocation?.includes(ponto.numeroBox));
    if (foundPin) {
      setSelectedPin(foundPin);
    }
    setPontoLevantamentoSelecionado(ponto);
    setLevantamentoRegistroOpen(true);
  };

  const handleSalvarLevantamento = (pontoAtualizado: PontoLevantamento) => {
    setLevantamentoRegistroOpen(false);
    setPontoLevantamentoSelecionado(null);
  };

  const handleSalvarEProximoLevantamento = (pontoAtualizado: PontoLevantamento) => {
    const proximo = obterProximoPontoPendente(pontoAtualizado.idPonto);
    if (proximo) {
      const foundPin = pinsList.find((pin) => pin.id === proximo.idLojaMapa || pin.humanLocation?.includes(proximo.numeroBox));
      if (foundPin) {
        setSelectedPin(foundPin);
      }
      setPontoLevantamentoSelecionado(proximo);
      // O modal de registro continua aberto com o novo ponto!
    } else {
      setLevantamentoRegistroOpen(false);
      setPontoLevantamentoSelecionado(null);
      alert('🎉 Parabéns! Todos os pontos desta sessão de campo foram concluídos com sucesso!');
    }
  };

  const handleVerCampanhaNoMapa = (p: ParticipacaoLojaCampanha) => {
    setCampanhaAtivaId(p.idCampanha);
    const foundPin = pinsList.find((pin) => pin.id === p.idLojaMapa || pin.humanLocation?.includes(p.numeroBox));
    if (foundPin) {
      setSelectedPin(foundPin);
    }
  };

  const handleAbrirFicha360DaCentral = (idLojaMapa: string) => {
    setCentralGestaoLojistasOpen(false);
    const loja = Loja360Service.obterFicha(idLojaMapa);
    if (loja) {
      setLojaSelecionada360(loja);
      setLoja360Open(true);
    }
  };

  const handleVerNoMapaDaCentral = (idLojaMapa: string, numeroBox: string) => {
    setCentralGestaoLojistasOpen(false);
    const foundPin = pinsList.find((pin) => pin.id === idLojaMapa || pin.humanLocation?.includes(numeroBox));
    if (foundPin) {
      setSelectedPin(foundPin);
    }
  };

  const handleAbrirOcorrenciaDaLoja = (loja: FichaLoja360) => {
    setSelectedPin(null);
    setEditingPin(null);
    setPositioningMode(false);
    const x = loja.x || 0.35;
    const y = loja.y || 0.45;
    setDraftPin({ normalizedX: x, normalizedY: y });
    const loc = CartografiaService.identificarLocalizacaoNoMapa(selectedMapKey, x, y);
    setIdentifiedLocationText(loc.textoCompleto);
    setFormMode('NOVO');
    setFormPanelVisible(true);
  };

  const handleAbrirOcorrenciaDaMidia = (ponto: AtivoMidiaPonto) => {
    setSelectedPin(null);
    setEditingPin(null);
    setPositioningMode(false);
    const x = ponto.x || 0.35;
    const y = ponto.y || 0.45;
    setDraftPin({ normalizedX: x, normalizedY: y });
    const loc = CartografiaService.identificarLocalizacaoNoMapa(selectedMapKey, x, y);
    setIdentifiedLocationText(loc.textoCompleto);
    setFormMode('NOVO');
    setFormPanelVisible(true);
  };

  const handleCriarOcorrenciaDaRonda = (ocorrenciaData: Partial<SignagePin>) => {
    const timestamp = Date.now();
    const newPin: SignagePin = {
      id: String(timestamp),
      assetCode: ocorrenciaData.assetCode || `OCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      entityType: 'OCORRENCIA',
      category: ocorrenciaData.category || 'Operação',
      categoryColor: ocorrenciaData.categoryColor || '#DC2626',
      priority: ocorrenciaData.priority || 'ALTA',
      prazoHoras: ocorrenciaData.prazoHoras || 24,
      sector: ocorrenciaData.sector || selectedMapKey,
      status: 'EM_ANDAMENTO',
      conservationState: ocorrenciaData.conservationState || 'Danificada',
      normalizedX: ocorrenciaData.normalizedX || 0.45,
      normalizedY: ocorrenciaData.normalizedY || 0.5,
      notes: ocorrenciaData.notes || 'Ocorrência registrada em ronda',
      humanLocation: ocorrenciaData.humanLocation || 'Ponto identificado em ronda',
      responsible: ocorrenciaData.responsible || 'Fiscal de Ronda',
      photos: ocorrenciaData.photos || [],
    };

    setPinsList((prev) => {
      const nextPins = [newPin, ...prev];
      void OfflineStorageService.savePins(nextPins);
      return nextPins;
    });

    // Registra na outbox + mutação de sync
    const outboxEvent: OutboxItem = {
      clientEventId: generateClientEventId(),
      type: 'NOVO_REGISTRO',
      title: `Ocorrência da Ronda: ${newPin.assetCode} (${newPin.category})`,
      status: networkState === 'ONLINE' ? 'PROCESSANDO' : 'PENDENTE',
      retryCount: 0,
      timestamp: 'Agora',
    };

    void enqueueOutboxEvent(outboxEvent, {
      entityType: 'signage',
      actionType: 'CREATE',
      payload: {
        assetCode: newPin.assetCode,
        category: newPin.category,
        conservationState: newPin.conservationState,
        notes: newPin.notes,
        sector: newPin.sector,
        humanLocation: newPin.humanLocation,
        responsible: newPin.responsible,
        normalizedX: newPin.normalizedX,
        normalizedY: newPin.normalizedY,
      },
    });
  };

  const handleMapClick = (coords: { normalizedX: number; normalizedY: number }) => {
    if (!positioningMode) return;
    setDraftPin({ normalizedX: coords.normalizedX, normalizedY: coords.normalizedY });
    const loc = CartografiaService.identificarLocalizacaoNoMapa(selectedMapKey, coords.normalizedX, coords.normalizedY);
    setIdentifiedLocationText(loc.textoCompleto);
    setLocalCardVisible(true);
  };

  const handleConfirmLocation = () => {
    setLocalCardVisible(false);
    setPositioningMode(false);
    setFormMode('NOVO');
    setEditingPin(null);
    setFormPanelVisible(true);
  };

  const handleCancelPositioning = () => {
    setPositioningMode(false);
    setDraftPin(null);
    setIdentifiedLocationText('');
    setLocalCardVisible(false);
  };

  const handleSaveForm = (savedPinData: Partial<SignagePin>) => {
    if (formMode === 'EDITAR' && editingPin) {
      const updatedPin: SignagePin = {
        ...editingPin,
        ...savedPinData,
        id: editingPin.id,
        assetCode: editingPin.assetCode,
        photos: savedPinData.photos !== undefined ? savedPinData.photos : editingPin.photos,
      };
      setPinsList((prev) => {
        const nextPins = prev.map((p) => (p.id === editingPin.id ? updatedPin : p));
        void OfflineStorageService.savePins(nextPins);
        return nextPins;
      });
      setSelectedPin(updatedPin);

      // Adiciona evento na outbox + mutação de sync (UPDATE)
      const editEvent: OutboxItem = {
        clientEventId: generateClientEventId(),
        type: 'EDICAO_REGISTRO',
        title: updatedPin.notes || 'Edição de Sinalização',
        status: networkState === 'ONLINE' ? 'PROCESSANDO' : 'PENDENTE',
        retryCount: 0,
        timestamp: 'Agora',
      };
      void enqueueOutboxEvent(editEvent, {
        entityType: 'signage',
        actionType: 'UPDATE',
        payload: {
          assetCode: updatedPin.assetCode,
          category: updatedPin.category,
          conservationState: updatedPin.conservationState,
          notes: updatedPin.notes,
          status: updatedPin.status,
          humanLocation: updatedPin.humanLocation,
        },
      });
    } else {
      const newId = `pin_${Date.now()}`;
      const newProtocol = `SIG-20260823-000${pinsList.length + 1}`;
      const newPin: SignagePin = {
        id: newId,
        assetCode: newProtocol,
        category: savedPinData.category || 'Placa informativa',
        sector: selectedMapKey,
        status: 'ATIVA',
        conservationState: savedPinData.conservationState || 'Boa',
        normalizedX: draftPin?.normalizedX || 0.35,
        normalizedY: draftPin?.normalizedY || 0.45,
        notes: savedPinData.notes || 'Novo Registro',
        humanLocation: savedPinData.humanLocation || 'Setor Azul',
        responsible: savedPinData.responsible || 'Davidsilva • Operações',
        photos: savedPinData.photos || [],
      };
      setPinsList((prev) => {
        const nextPins = [...prev, newPin];
        void OfflineStorageService.savePins(nextPins);
        return nextPins;
      });
      setSelectedPin(newPin);

      // Adiciona na outbox + mutação de sync (CREATE)
      const outboxEvent: OutboxItem = {
        clientEventId: generateClientEventId(),
        type: 'NOVO_REGISTRO',
        title: newPin.notes || 'Novo Registro de Sinalização',
        status: networkState === 'ONLINE' ? 'PROCESSANDO' : 'PENDENTE',
        retryCount: 0,
        timestamp: 'Agora',
      };
      void enqueueOutboxEvent(outboxEvent, {
        entityType: 'signage',
        actionType: 'CREATE',
        payload: {
          assetCode: newPin.assetCode,
          category: newPin.category,
          conservationState: newPin.conservationState,
          notes: newPin.notes,
          sector: newPin.sector,
          humanLocation: newPin.humanLocation,
          responsible: newPin.responsible,
          normalizedX: newPin.normalizedX,
          normalizedY: newPin.normalizedY,
        },
      });
    }

    // Processamento de Uploads de Mídias para MinIO S3
    const pendingPhotos = (savedPinData.photos || []).filter((ph) => !ph.uploadedToS3);
    if (pendingPhotos.length > 0) {
      if (networkState === 'ONLINE') {
        pendingPhotos.forEach((ph) => {
          mediaService.uploadPhotoToMinIO(ph).then((res) => {
            if (res.success) {
              ph.uploadedToS3 = true;
              ph.storageKey = res.storageKey;
              setPinsList((currentPins) => {
                const updated = currentPins.map((p) => {
                  if (p.photos?.some((x) => x.id === ph.id)) {
                    return {
                      ...p,
                      photos: p.photos.map((x) => (x.id === ph.id ? { ...x, uploadedToS3: true, storageKey: res.storageKey } : x)),
                    };
                  }
                  return p;
                });
                void OfflineStorageService.savePins(updated);
                return updated;
              });
            }
          });
        });
      } else {
        pendingPhotos.forEach((ph) => {
          const mediaEvent: OutboxItem = {
            clientEventId: `evt_media_${ph.id}`,
            type: 'NOVO_REGISTRO',
            title: `Upload de Foto (${ph.fileName})`,
            status: 'PENDENTE',
            retryCount: 0,
            timestamp: 'Agora',
          };
          void enqueueOutboxEvent(mediaEvent, {
            entityType: 'media',
            actionType: 'CREATE',
            payload: {
              photoId: ph.id,
              fileName: ph.fileName,
              mimeType: ph.mimeType,
              sha256: ph.sha256,
            },
          });
        });
      }
    }

    setFormPanelVisible(false);
    setPositioningMode(false);
    setDraftPin(null);
  };

  /**
   * Sincronização real: envia mutações pendentes/falhas para a API e puxa o delta.
   * Atualiza o estado da fila visível conforme o resultado do push.
   */
  const handleSyncOutbox = async () => {
    const engine = syncEngineRef.current;
    if (!engine || isSyncing) return;
    setIsSyncing(true);
    try {
      const deviceId = await getDeviceId();
      const res = await engine.syncWithServer(deviceId);

      setOutboxItems((prev) => {
        const nextOutbox = prev.map((i) =>
          res.success
            ? { ...i, status: 'CONCLUIDO' as const, errorMessage: null }
            : { ...i, status: 'ERRO' as const, errorMessage: 'Falha ao sincronizar com o servidor' }
        );
        void OfflineStorageService.saveOutbox(nextOutbox);
        return nextOutbox;
      });

      if (res.success) {
        setNetworkState('ONLINE');
        // Puxa delta do servidor e atualiza o cache local
        await pullAndMergeRemoteChanges();
      }
    } catch (e: any) {
      console.error('[SYNC] Falha na sincronização:', e?.message || e);
    } finally {
      refreshEnginePending();
      setIsSyncing(false);
    }
  };

  const handleRetryItem = async (clientEventId: string) => {
    setOutboxItems((prev) => {
      const nextOutbox = prev.map((i) =>
        i.clientEventId === clientEventId
          ? { ...i, status: 'PROCESSANDO' as const, errorMessage: null, retryCount: i.retryCount + 1 }
          : i
      );
      void OfflineStorageService.saveOutbox(nextOutbox);
      return nextOutbox;
    });
    // O engine reenvia PENDING + FAILED; o retry de um item sincroniza todos os pendentes.
    const engine = syncEngineRef.current;
    if (!engine) return;
    try {
      const deviceId = await getDeviceId();
      const res = await engine.syncWithServer(deviceId);
      setOutboxItems((prev) => {
        const nextOutbox = prev.map((i) =>
          res.success
            ? { ...i, status: 'CONCLUIDO' as const, errorMessage: null }
            : i.clientEventId === clientEventId
            ? { ...i, status: 'ERRO' as const, errorMessage: 'Servidor indisponível' }
            : i
        );
        void OfflineStorageService.saveOutbox(nextOutbox);
        return nextOutbox;
      });
    } catch (e: any) {
      console.error('[SYNC] Falha no retry:', e?.message || e);
    }
    refreshEnginePending();
  };

  /**
   * Puxa alterações delta do servidor e funde no cache local de pins.
   */
  const pullAndMergeRemoteChanges = async () => {
    const engine = syncEngineRef.current;
    if (!engine) return;
    try {
      const meta = await OfflineStorageService.getCacheMetadata();
      const pull = await engine.pullFromServer(meta?.lastPulledAt ?? null);

      const remoteRows = [
        ...(pull.changes?.signage?.created || []),
        ...(pull.changes?.signage?.updated || []),
      ].filter((row: any) => !row.deleted_at);

      if (remoteRows.length === 0) {
        await OfflineStorageService.updateCacheMetadata(
          pinsList.length,
          0,
          pull.timestamp
        );
        return;
      }

      const remotePins: SignagePin[] = remoteRows.map((row: any) => ({
        id: `remote_${row.asset_code}`,
        assetCode: row.asset_code,
        category: row.category || 'Placa informativa',
        sector: 'SETOR_AZUL',
        status: row.lifecycle_status === 'INACTIVE' ? 'INATIVA' : 'ATIVA',
        conservationState: row.conservation_status || 'Boa',
        normalizedX: Number(row.normalized_x) || 0.5,
        normalizedY: Number(row.normalized_y) || 0.5,
        notes: row.notes || undefined,
        humanLocation: row.human_location_text || undefined,
      }));

      setPinsList((prev) => {
        const byCode = new Map(prev.map((p) => [p.assetCode, p]));
        remotePins.forEach((rp) => {
          const existing = byCode.get(rp.assetCode);
          if (existing) {
            byCode.set(rp.assetCode, { ...existing, ...rp, id: existing.id });
          } else {
            byCode.set(rp.assetCode, rp);
          }
        });
        const merged = Array.from(byCode.values());
        void OfflineStorageService.savePins(merged);
        void OfflineStorageService.updateCacheMetadata(merged.length, 0, pull.timestamp);
        return merged;
      });
    } catch (e: any) {
      console.warn('[SYNC] Falha ao puxar delta do servidor:', e?.message || e);
    }
  };

  /**
   * Atualiza o contador de mutações pendentes do engine (habilita "Sincronizar" na Fila).
   */
  const refreshEnginePending = useCallback(() => {
    setEnginePendingCount(syncEngineRef.current?.getPendingQueue().length ?? 0);
  }, []);

  /**
   * Gera id de evento compatível com o protocolo de sync (UUID v4 exigido pelo backend).
   */
  const generateClientEventId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  /**
   * Registra evento na fila Outbox visível + mutação no engine de sync (mesmo id).
   * Quando ONLINE, dispara a sincronização imediata e reflete o resultado no item.
   */
  const enqueueOutboxEvent = async (
    event: OutboxItem,
    mutation?: { entityType: OutboxMutation['entityType']; actionType: OutboxMutation['actionType']; payload: Record<string, any> }
  ) => {
    setOutboxItems((prev) => {
      const nextOutbox = [event, ...prev];
      void OfflineStorageService.saveOutbox(nextOutbox);
      return nextOutbox;
    });

    const engine = syncEngineRef.current;
    if (!engine) return;

    if (mutation) {
      try {
        await engine.addMutation(mutation.entityType, mutation.actionType, mutation.payload, event.clientEventId);
        refreshEnginePending();
      } catch (e: any) {
        console.error('[SYNC] Falha ao registrar mutação local:', e?.message || e);
      }
    }

    if (networkState === 'ONLINE') {
      try {
        const deviceId = await getDeviceId();
        const res = await engine.syncWithServer(deviceId);
        setOutboxItems((prev) => {
          const nextOutbox = prev.map((i) =>
            i.clientEventId === event.clientEventId
              ? {
                  ...i,
                  status: res.success ? ('CONCLUIDO' as const) : ('ERRO' as const),
                  errorMessage: res.success ? null : 'Falha ao sincronizar com o servidor',
                }
              : i
          );
          void OfflineStorageService.saveOutbox(nextOutbox);
          return nextOutbox;
        });
      } catch (e: any) {
        console.error('[SYNC] Falha na sincronização imediata:', e?.message || e);
      }
      refreshEnginePending();
    }
  };

  const handleActionClick = (actionId: string, pin: SignagePin) => {
    if (actionId === 'EDITAR') {
      setFormMode('EDITAR');
      setEditingPin(pin);
      setFormPanelVisible(true);
    } else if (actionId === 'FOTOS') {
      setFotoPin(pin);
      setFotoModalOpen(true);
    } else if (actionId === 'NOVA_INSPECAO') {
      setInspecaoPin(pin);
      setInspecaoModalOpen(true);
    } else if (actionId === 'HISTORICO') {
      setHistoricoPin(pin);
      setHistoricoModalOpen(true);
    } else if (actionId === 'PENDENCIAS') {
      setPendenciasPin(pin);
      setPendenciasModalOpen(true);
    } else if (actionId === 'CICLO_VIDA') {
      setCicloVidaPin(pin);
      setCicloVidaModalOpen(true);
    } else if (actionId === 'ANTES_DEPOIS') {
      setAntesDepoisPin(pin);
      setAntesDepoisOpen(true);
    } else if (actionId === 'LEVANTAMENTO') {
      const pontos = getPontosSessao();
      const pontoEncontrado = pontos.find((p) => p.idLojaMapa === pin.id || pin.humanLocation?.includes(p.numeroBox));
      if (pontoEncontrado) {
        setPontoLevantamentoSelecionado(pontoEncontrado);
      } else {
        setPontoLevantamentoSelecionado({
          idPonto: `PL-${pin.id}`,
          idSessao: 'SESSAO-CENSO-2026',
          idLojaMapa: pin.id,
          idEspaco: `ESP-${pin.id}`,
          numeroBox: pin.humanLocation?.replace(/\D/g, '') || pin.id,
          nomeLoja: pin.notes || 'Unidade Comercial',
          segmento: pin.category || 'Varejo',
          setor: pin.sector || 'Setor Geral',
          corredor: pin.humanLocation || 'Corredor Geral',
          ordemNoCorredor: 99,
          situacao: 'EM_OPERACAO',
          resultado: 'PENDENTE',
          percentualCompletude: 50,
          statusSync: 'SINCRONIZADO',
        });
      }
      setLevantamentoRegistroOpen(true);
    }
  };

  const handleUpdateCicloVida = (newStatus: 'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA', justificativa: string) => {
    if (!cicloVidaPin) return;

    const updatedPin: SignagePin = {
      ...cicloVidaPin,
      status: newStatus,
      notes: justificativa ? `${cicloVidaPin.notes || ''} [Transição: ${newStatus} - ${justificativa}]`.trim() : cicloVidaPin.notes,
    };

    setPinsList((prev) => {
      const nextPins = prev.map((p) => (p.id === updatedPin.id ? updatedPin : p));
      void OfflineStorageService.savePins(nextPins);
      return nextPins;
    });

    if (selectedPin?.id === updatedPin.id) {
      setSelectedPin(updatedPin);
    }

    const outboxEvent: OutboxItem = {
      clientEventId: generateClientEventId(),
      type: 'EDICAO_REGISTRO',
      title: `Ciclo de Vida: ${updatedPin.assetCode} -> ${newStatus}`,
      status: networkState === 'ONLINE' ? 'PROCESSANDO' : 'PENDENTE',
      retryCount: 0,
      timestamp: 'Agora',
    };

    void enqueueOutboxEvent(outboxEvent, {
      entityType: 'signage',
      actionType: 'UPDATE',
      payload: {
        assetCode: updatedPin.assetCode,
        status: newStatus,
        notes: updatedPin.notes,
        conservationState: updatedPin.conservationState,
      },
    });
  };

  const handleDeletePin = (pinId: string) => {
    setPinsList((prev) => {
      const nextPins = prev.filter((p) => p.id !== pinId && p.assetCode !== pinId);
      void OfflineStorageService.savePins(nextPins);
      return nextPins;
    });

    if (selectedPin?.id === pinId || selectedPin?.assetCode === pinId) {
      setSelectedPin(null);
    }
    setCicloVidaModalOpen(false);
    setCicloVidaPin(null);
    setFormPanelVisible(false);
    setEditingPin(null);

    const outboxEvent: OutboxItem = {
      clientEventId: generateClientEventId(),
      type: 'EDICAO_REGISTRO',
      title: `Desativação de Registro: ${pinId}`,
      status: networkState === 'ONLINE' ? 'PROCESSANDO' : 'PENDENTE',
      retryCount: 0,
      timestamp: 'Agora',
    };

    void enqueueOutboxEvent(outboxEvent, {
      entityType: 'signage',
      actionType: 'DELETE',
      payload: { assetCode: pinId },
    });
  };

  const handleSaveInspecao = (data: {
    conservationState: string;
    status: 'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA';
    notes?: string;
    photo?: CapturedPhoto;
  }) => {
    if (!inspecaoPin) return;

    const updatedPhotos = data.photo ? [...(inspecaoPin.photos || []), data.photo] : inspecaoPin.photos;
    const updatedPin: SignagePin = {
      ...inspecaoPin,
      conservationState: data.conservationState,
      status: data.status,
      photos: updatedPhotos,
      notes: data.notes ? `${inspecaoPin.notes || ''} [Insp: ${data.notes}]`.trim() : inspecaoPin.notes,
    };

    setPinsList((prev) => {
      const nextPins = prev.map((p) => (p.id === updatedPin.id ? updatedPin : p));
      void OfflineStorageService.savePins(nextPins);
      return nextPins;
    });

    if (selectedPin?.id === updatedPin.id) {
      setSelectedPin(updatedPin);
    }

    // Registra inspeção na Outbox + mutação de sync (inspection)
    const outboxEvent: OutboxItem = {
      clientEventId: generateClientEventId(),
      type: 'EDICAO_REGISTRO',
      title: `Inspeção: ${updatedPin.assetCode} (${data.conservationState})`,
      status: networkState === 'ONLINE' ? 'PROCESSANDO' : 'PENDENTE',
      retryCount: 0,
      timestamp: 'Agora',
    };

    void enqueueOutboxEvent(outboxEvent, {
      entityType: 'inspection',
      actionType: 'CREATE',
      payload: {
        clientInspectionId: outboxEvent.clientEventId,
        signageId: updatedPin.assetCode,
        inspectorId: updatedPin.responsible || 'system',
        conservationState: data.conservationState,
        conditionNotes: data.notes || '',
        recommendedAction: data.status === 'ATIVA' ? 'NONE' : 'REVIEW',
      },
    });

    // Upload da foto de evidência
    if (data.photo && networkState === 'ONLINE') {
      mediaService.uploadPhotoToMinIO(data.photo).then((res) => {
        if (res.success && data.photo) {
          data.photo.uploadedToS3 = true;
          data.photo.storageKey = res.storageKey;
          setPinsList((currentPins) => {
            const updated = currentPins.map((p) => {
              if (p.id === updatedPin.id && p.photos) {
                return {
                  ...p,
                  photos: p.photos.map((ph) =>
                    ph.id === data.photo?.id ? { ...ph, uploadedToS3: true, storageKey: res.storageKey } : ph
                  ),
                };
              }
              return p;
            });
            void OfflineStorageService.savePins(updated);
            return updated;
          });
        }
      });
    }
  };

  // Resultados de busca rápida de sinalizações
  const searchResults = searchTerm.trim()
    ? pinsList.filter(
        (p) =>
          p.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.humanLocation && p.humanLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Resultados de busca rápida nas 4.954 lojas reais sincronizadas
  const lojasSearchResults = searchTerm.trim().length >= 2
    ? CatalogoProducaoService.pesquisaRapida(searchTerm, 4)
    : [];

  const handleSelectSearchResult = (pin: SignagePin) => {
    setSelectedMapKey(pin.sector);
    setSelectedPin(pin);
    setSearchTerm('');
  };

  const handleSelectLojaRealSearchResult = (lojaItem: LojaProducaoItem) => {
    const ficha = Loja360Service.obterFicha(lojaItem.idLojaMapa || lojaItem.numeroBox);
    if (ficha) {
      setLojaSelecionada360(ficha);
      setLoja360Open(true);
    }
    setSearchTerm('');
  };

  const handlePhotoUploadRequest = async (photo: CapturedPhoto) => {
    if (!fotoPin) return;
    try {
      const result = await mediaService.uploadPhotoToMinIO(photo);
      if (result.success) {
        const updatedPhotos = (fotoPin.photos || []).map((ph) =>
          ph.id === photo.id ? { ...ph, uploadedToS3: true, storageKey: result.storageKey } : ph
        );
        const updatedPin = { ...fotoPin, photos: updatedPhotos };
        setFotoPin(updatedPin);
        setPinsList((prev) => {
          const nextPins = prev.map((p) => (p.id === updatedPin.id ? updatedPin : p));
          void OfflineStorageService.savePins(nextPins);
          return nextPins;
        });
        if (selectedPin?.id === updatedPin.id) {
          setSelectedPin(updatedPin);
        }
      }
    } catch (e: any) {
      console.warn('Erro ao sincronizar foto com MinIO:', e);
    }
  };

  const getNetworkBadgeStyle = () => {
    switch (networkState) {
      case 'ONLINE':
        return { bg: LegacyTheme.colors.onlineBg, text: LegacyTheme.colors.onlineText, label: 'Online' };
      case 'DEGRADADO':
        return { bg: '#FFF3E0', text: '#E08B00', label: 'Degradado' };
      case 'OFFLINE':
        return { bg: '#FFEBEE', text: '#D94841', label: 'Offline' };
      case 'RECUPERANDO':
        return { bg: '#E3F2FD', text: '#00C8FF', label: 'Recuperando…' };
    }
  };

  const netBadge = getNetworkBadgeStyle();
  const pendingQueueCount = outboxItems.filter((i) => i.status !== 'CONCLUIDO').length;

  return (
    <View style={styles.container}>
      {/* 1. Header Legado (.app-header) */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Sinalização do Mall</Text>
          <Text style={styles.headerVersion}>MVP-3.28.1-SINALIZACAO-S26.6.1</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            id="connectionBadge"
            style={[styles.connectionBadge, { backgroundColor: netBadge.bg }]}
            onPress={() => {
              // Alterna dinamicamente entre os estados de rede ao clicar na badge
              const states: ('ONLINE' | 'DEGRADADO' | 'OFFLINE' | 'RECUPERANDO')[] = [
                'ONLINE',
                'DEGRADADO',
                'OFFLINE',
                'RECUPERANDO',
              ];
              const nextIdx = (states.indexOf(networkState) + 1) % states.length;
              setNetworkState(states[nextIdx]);
            }}
          >
            <Text style={[styles.connectionBadgeText, { color: netBadge.text }]}>
              {netBadge.label}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="adminUserBadgeBtn"
            style={styles.userBadge}
            onPress={() => setAdminModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.userBadgeText} numberOfLines={1}>
              {isMobile ? 'davidsilva • ADMIN' : 'davidsilva.centrofashion • ADMIN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Main Content Layout */}
      <View style={[styles.mainLayout, isMobile && styles.mainLayoutMobile]}>
        {/* Toolbar Card (.toolbar / .map-selector-row-s22513) */}
        <View style={[styles.toolbarCard, isMobile && styles.toolbarCardMobile]}>
          {isMobile ? (
            /* Visão Mobile: Linha Superior com Dropdown + Botão Centralizar + Botão Hambúrguer */
            <View style={styles.mobileToolbarTopRow}>
              {/* Dropdown Setor Azul • Piso 1 */}
              <View style={styles.mobileSelectContainer}>
                {Platform.OS === 'web' ? (
                  <select
                    id="mapaSelect"
                    value={selectedMapKey}
                    onChange={(e) => {
                      setSelectedMapKey(e.target.value);
                      setSelectedPin(null);
                    }}
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 8,
                      paddingBottom: 8,
                      borderWidth: 1,
                      borderColor: '#DFE3ED',
                      borderRadius: 10,
                      backgroundColor: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: '600',
                      color: '#20233A',
                      height: 42,
                    }}
                  >
                    {mapGroups.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.options.map((m) => (
                          <option key={m.key} value={m.key}>
                            {m.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ) : (
                  <View style={[styles.mobileSelectFallback, { marginTop: 0, height: 42, justifyContent: 'center' }]}>
                    <Text style={styles.mobileSelectText} numberOfLines={1}>
                      {mapsList.find((m) => m.key === selectedMapKey)?.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Botão Centralizar Mapa ENTRE o dropdown e o menu (#centralizar) */}
              <TouchableOpacity
                id="centralizar"
                style={styles.btnCentralizarMobile}
                onPress={handleResetView}
                aria-label="Centralizar mapa"
              >
                <Text style={styles.btnCentralizarIcon}>⌖</Text>
              </TouchableOpacity>

              {/* Botão Menu vira botão Hambúrguer à direita (#appMenuBtnS22513) */}
              <TouchableOpacity
                id="appMenuBtnS22513"
                style={styles.btnHamburgerMobile}
                onPress={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir Menu"
              >
                <Text style={styles.btnHamburgerIcon}>☰</Text>
                {pendingQueueCount > 0 ? (
                  <View style={styles.menuBadgeFloating}>
                    <Text id="filaCount" style={styles.menuBadgeText}>
                      {pendingQueueCount}
                    </Text>
                  </View>
                ) : (
                  <Text id="filaCount" style={{ display: 'none' }}>0</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Visão Desktop: Select Tradicional */
            <View style={styles.selectWrapper}>
              <Text style={styles.selectLabel}>Mapa / visualização</Text>

              {Platform.OS === 'web' ? (
                <select
                  id="mapaSelect"
                  value={selectedMapKey}
                  onChange={(e) => {
                    setSelectedMapKey(e.target.value);
                    setSelectedPin(null);
                  }}
                  style={{
                    width: '100%',
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 9,
                    paddingBottom: 9,
                    borderWidth: 1,
                    borderColor: '#DFE3ED',
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: '600',
                    color: '#20233A',
                    marginTop: 4,
                    height: 42,
                  }}
                >
                  {mapGroups.map((g) => (
                    <optgroup key={g.label} label={g.label}>
                      {g.options.map((m) => (
                        <option key={m.key} value={m.key}>
                          {m.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <View style={styles.mobileSelectFallback}>
                  <Text style={styles.mobileSelectText} numberOfLines={1}>
                    {mapsList.find((m) => m.key === selectedMapKey)?.label}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Botões da Toolbar: módulos restantes */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={isMobile ? { width: '100%', marginTop: 4 } : undefined}
            contentContainerStyle={[
              styles.toolbarButtonGroup,
              isMobile && styles.toolbarButtonGroupMobile,
            ]}
          >
            {/* No Desktop, inclui o botão Centralizar */}
            {!isMobile && (
              <TouchableOpacity
                id="centralizar"
                style={styles.btnCentralizar}
                onPress={handleResetView}
                aria-label="Centralizar mapa"
              >
                <Text style={styles.btnCentralizarIcon}>⌖</Text>
              </TouchableOpacity>
            )}

            {/* Botão Levantamento de Campo (L2.6) */}
            <TouchableOpacity
              id="btnLevantamentoToolbar"
              style={[
                styles.btnCentralizar,
                { width: 'auto', paddingHorizontal: 10, gap: 4, flexDirection: 'row', backgroundColor: '#0284c7' },
              ]}
              onPress={() => setLevantamentoModalOpen(true)}
              aria-label="Levantamento de Campo"
            >
              <Text style={{ fontSize: 13 }}>📋</Text>
              {!isMobile && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Levantamento</Text>}
            </TouchableOpacity>

            {/* Botão Central Financeira (L3.5) */}
            <TouchableOpacity
              id="btnFinanceiroToolbar"
              style={[
                styles.btnCentralizar,
                { width: 'auto', paddingHorizontal: 10, gap: 4, flexDirection: 'row', backgroundColor: '#7f1d1d', borderColor: '#ef4444' },
              ]}
              onPress={() => setCentralFinanceiraOpen(true)}
              aria-label="Central Financeira"
            >
              <Text style={{ fontSize: 13 }}>💳</Text>
              {!isMobile && <Text style={{ color: '#fca5a5', fontSize: 12, fontWeight: '700' }}>Financeiro</Text>}
            </TouchableOpacity>

            {/* Botão Auditoria de Vendas (L3.8) */}
            <TouchableOpacity
              id="btnAuditoriaToolbar"
              style={[
                styles.btnCentralizar,
                { width: 'auto', paddingHorizontal: 10, gap: 4, flexDirection: 'row', backgroundColor: '#064e3b', borderColor: '#10b981' },
              ]}
              onPress={() => setAuditoriaCentralOpen(true)}
              aria-label="Auditoria de Vendas"
            >
              <Text style={{ fontSize: 13 }}>📈</Text>
              {!isMobile && <Text style={{ color: '#6ee7b7', fontSize: 12, fontWeight: '700' }}>Auditoria</Text>}
            </TouchableOpacity>

            {/* Botão Central Analítica (L3.9) */}
            <TouchableOpacity
              id="btnAnaliticaToolbar"
              style={[
                styles.btnCentralizar,
                { width: 'auto', paddingHorizontal: 10, gap: 4, flexDirection: 'row', backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
              ]}
              onPress={() => setCentralAnaliticaOpen(true)}
              aria-label="Central Analítica"
            >
              <Text style={{ fontSize: 13 }}>📊</Text>
              {!isMobile && <Text style={{ color: '#bfdbfe', fontSize: 12, fontWeight: '700' }}>Analítica</Text>}
            </TouchableOpacity>

            {/* Botão Dashboard Executivo BI (L4.0) */}
            <TouchableOpacity
              id="btnDashboardToolbar"
              style={[
                styles.btnCentralizar,
                { width: 'auto', paddingHorizontal: 10, gap: 4, flexDirection: 'row', backgroundColor: '#312e81', borderColor: '#6366f1' },
              ]}
              onPress={() => setDashboardOpen(true)}
              aria-label="Dashboard Executivo BI"
            >
              <Text style={{ fontSize: 13 }}>🏙️</Text>
              {!isMobile && <Text style={{ color: '#c7d2fe', fontSize: 12, fontWeight: '700' }}>BI Mall</Text>}
            </TouchableOpacity>

            {/* Botão Gerenciador de Referências Cartográficas */}
            <TouchableOpacity
              id="btnGerenciadorReferenciasToolbar"
              style={[
                styles.btnCentralizar,
                { width: 'auto', paddingHorizontal: 10, gap: 4, flexDirection: 'row', backgroundColor: '#064e3b', borderColor: '#10b981' },
              ]}
              onPress={() => setGerenciadorRefOpen(true)}
              aria-label="Gerenciador de Referências"
            >
              <Text style={{ fontSize: 13 }}>📍</Text>
              {!isMobile && <Text style={{ color: '#a7f3d0', fontSize: 12, fontWeight: '700' }}>Referências</Text>}
            </TouchableOpacity>

            {/* No Desktop, inclui o botão Menu com texto "Menu" */}
            {!isMobile && (
              <TouchableOpacity
                id="appMenuBtnS22513"
                style={styles.btnMenu}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <Text style={styles.btnMenuText}>Menu</Text>
                <View style={styles.menuBadge}>
                  <Text id="filaCount" style={styles.menuBadgeText}>
                    {pendingQueueCount}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Barra de Filtros de Ronda e Busca Rápida (UI-6) */}
        <View style={[styles.filterBarCard, isMobile && styles.filterBarCardMobile]}>
          {/* Campo de Busca Rápida (#buscaSinalizacao) */}
          <View style={styles.searchBox}>
            <Text style={styles.searchBoxIcon}>🔍</Text>
            <TextInput
              id="buscaSinalizacao"
              style={styles.searchInput}
              placeholder="Buscar por protocolo, título ou local..."
              placeholderTextColor="#94A3B8"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearSearchBtn}>
                <Text style={styles.clearSearchBtnText}>×</Text>
              </TouchableOpacity>
            )}

            {/* Dropdown de Resultados Combinados */}
            {(searchResults.length > 0 || lojasSearchResults.length > 0) && (
              <View id="buscaResultadosDropdown" style={styles.searchResultsDropdown}>
                {/* Lojas Reais do Catálogo */}
                {lojasSearchResults.map((l) => (
                  <TouchableOpacity
                    key={`loja-real-${l.idLojaMapa || l.numeroBox}`}
                    style={[styles.searchResultItem, { borderLeftWidth: 3, borderLeftColor: '#0284c7' }]}
                    onPress={() => handleSelectLojaRealSearchResult(l)}
                  >
                    <Text style={[styles.searchResultCode, { color: '#0284c7' }]}>Box {l.numeroBox}</Text>
                    <Text style={styles.searchResultTitle} numberOfLines={1}>
                      🏪 {l.nomeFantasia} • {l.segmento}
                    </Text>
                    <Text style={styles.searchResultSector}>Setor {l.setor}</Text>
                  </TouchableOpacity>
                ))}

                {/* Sinalizações */}
                {searchResults.slice(0, 4).map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectSearchResult(p)}
                  >
                    <Text style={styles.searchResultCode}>{p.assetCode}</Text>
                    <Text style={styles.searchResultTitle} numberOfLines={1}>
                      {p.notes || p.category}
                    </Text>
                    <Text style={styles.searchResultSector}>{p.sector}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Chips de Filtro por Conservação */}
          <View style={styles.rondaFiltersGroup}>
            {[
              { key: 'TODOS', label: 'Todos' },
              { key: 'LOJAS_BOXES', label: '🏪 Lojas & Boxes' },
              { key: 'ATENCAO', label: '⚠️ Atenção' },
              { key: 'MANUTENCAO', label: '🔧 Manutenção' },
              { key: 'ATIVAS', label: '✓ Ativas' },
            ].map((f) => (
              <TouchableOpacity
                key={f.key}
                id={`filtro-ronda-${f.key.toLowerCase()}`}
                style={[
                  styles.filterChip,
                  filterConservation === f.key && styles.filterChipActive,
                ]}
                onPress={() => setFilterConservation(f.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterConservation === f.key && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Viewport Principal Cartográfico (.map-card / .viewport) */}
        <View style={styles.mapCard}>
          {/* Banner Flutuante da Camada Temática de Campanha */}
          {campanhaAtivaId && campanhaAtivaInfo && (
            <View style={styles.bannerCampanhaMapa}>
              <View style={styles.bannerCampanhaInfo}>
                <View style={styles.bannerCampanhaTituloRow}>
                  <Text style={styles.bannerCampanhaIcon}>📢</Text>
                  <Text style={styles.bannerCampanhaNome}>{campanhaAtivaInfo.nome}</Text>
                  <View style={styles.badgeCampanhaAtiva}>
                    <Text style={styles.badgeCampanhaAtivaText}>Camada Ativa</Text>
                  </View>
                </View>

                {metricasCampanhaAtiva && (
                  <View style={styles.bannerCampanhaMetricas}>
                    <View style={styles.bannerMetricaItem}>
                      <View style={[styles.bannerDot, { backgroundColor: '#10b981' }]} />
                      <Text style={styles.bannerMetricaText}>
                        {metricasCampanhaAtiva.confirmadas} Confirmadas
                      </Text>
                    </View>
                    <View style={styles.bannerMetricaItem}>
                      <View style={[styles.bannerDot, { backgroundColor: '#f59e0b' }]} />
                      <Text style={styles.bannerMetricaText}>
                        {metricasCampanhaAtiva.interessadas} Interessadas
                      </Text>
                    </View>
                    <View style={styles.bannerMetricaItem}>
                      <View style={[styles.bannerDot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.bannerMetricaText}>
                        {metricasCampanhaAtiva.contatadas} Contatadas
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.bannerCampanhaAcoes}>
                <TouchableOpacity
                  style={styles.btnBannerCarteira}
                  onPress={() => setCampanhasCentralOpen(true)}
                >
                  <Text style={styles.btnBannerCarteiraText}>Carteira</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnBannerDesativar}
                  onPress={() => setCampanhaAtivaId(null)}
                >
                  <Text style={styles.btnBannerDesativarText}>✕ Desativar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <InteractiveMallMap
            selectedMapKey={selectedMapKey}
            pins={displayedPins}
            selectedPinId={selectedPin?.id}
            onSelectPin={(pin) => {
              if (!positioningMode) {
                setSelectedPin(pin);
                setSelectedReferencia(null);
              }
            }}
            filterConservation={filterConservation}
            showSinalizacoes={showSinalizacoes}
            showReferencias={showReferencias}
            showCruzamentos={showCruzamentos}
            positioningMode={positioningMode}
            draftPin={draftPin}
            campanhaAtivaId={campanhaAtivaId}
            campanhaAdesoesMap={campanhaAdesoesMap}
            resetTrigger={mapResetTrigger}
            showLojasBoxes={showLojas || filterConservation === 'LOJAS_BOXES'}
            corReferencia={corReferencia}
            coresReferencias={coresReferencias}
            referenciasCustom={referenciasList}
            onSelectReferencia={(ref) => {
              if (!positioningMode) {
                setSelectedPin(null);
                setSelectedReferencia(ref);
              }
            }}
            onSelectLoja={handleSelectLojaRealSearchResult}
            onMapClick={handleMapClick}
          />

          {/* Card da Sinalização Selecionada (#sinalizacaoMapaCard) */}
          {!positioningMode && (
            <SinalizacaoCard
              pin={selectedPin}
              onClose={() => setSelectedPin(null)}
              onActionClick={handleActionClick}
            />
          )}

          {/* Card da Referência Cartográfica Selecionada */}
          {!positioningMode && selectedReferencia && (
            <ReferenciaCard
              referencia={selectedReferencia}
              coresReferencias={coresReferencias}
              onClose={() => setSelectedReferencia(null)}
              onEditar={handleEditarReferencia}
              onExcluir={handleExcluirReferencia}
            />
          )}

          {/* Card de Confirmação da Localização (#localCard) */}
          <LocalCardConfirmation
            visible={localCardVisible}
            sectorName={mapsList.find((m) => m.key === selectedMapKey)?.label || 'Setor Azul'}
            normalizedX={draftPin?.normalizedX || 0}
            normalizedY={draftPin?.normalizedY || 0}
            localizacaoTexto={identifiedLocationText}
            onCancel={handleCancelPositioning}
            onConfirm={handleConfirmLocation}
          />
        </View>
      </View>

      {/* Modais & Painéis Contextuais */}
      <AppMenuModal
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectMenu={handleSelectMenuOption}
        contextoSetorAtual={mapsList.find((m) => m.key === selectedMapKey)?.label || 'Setor Azul • Piso 1'}
      />

      <CamadasModal
        visible={camadasOpen}
        onClose={() => setCamadasOpen(false)}
        showSinalizacoes={showSinalizacoes}
        onToggleSinalizacoes={(enabled) => setShowSinalizacoes(enabled)}
        totalPinsCount={displayedPins.filter((p) => !p.sector || p.sector === selectedMapKey).length || displayedPins.length}
        showReferencias={showReferencias}
        onToggleReferencias={(enabled) => setShowReferencias(enabled)}
        totalReferenciasCount={CartografiaService.obterReferenciasOficiais(selectedMapKey).length}
        showCruzamentos={showCruzamentos}
        onToggleCruzamentos={(enabled) => setShowCruzamentos(enabled)}
        totalCruzamentosCount={CartografiaService.obterCruzamentosOficiais(selectedMapKey).length}
        showLojas={showLojas}
        onToggleLojas={(enabled) => {
          setShowLojas(enabled);
          if (enabled) {
            setFilterConservation('LOJAS_BOXES');
          } else if (filterConservation === 'LOJAS_BOXES') {
            setFilterConservation('TODOS');
          }
        }}
        totalLojasCount={CatalogoProducaoService.buscarPorSetor(selectedMapKey).length || 1352}
        initialShowCentral={showCentralCamadas}
        campanhaAtivaId={campanhaAtivaId}
        onSelectCampanha={(id) => setCampanhaAtivaId(id)}
        onFilterChange={handleCamadasFilterChange}
        corReferencia={corReferencia}
        onUpdateCorReferencia={handleUpdateCorReferencia}
        selectedMapKey={selectedMapKey}
        coresReferencias={coresReferencias}
        onUpdateCoresReferencias={handleUpdateCoresReferencias}
      />

      <FormPanelModal
        visible={formPanelVisible}
        mode={formMode}
        initialPin={editingPin}
        initialReferencia={editingReferencia}
        confirmedSector={mapsList.find((m) => m.key === selectedMapKey)?.label || 'Setor Azul'}
        normalizedX={draftPin?.normalizedX || editingPin?.normalizedX || editingReferencia?.x || 0.35}
        normalizedY={draftPin?.normalizedY || editingPin?.normalizedY || editingReferencia?.y || 0.45}
        identifiedLocationText={identifiedLocationText}
        onClose={() => {
          setFormPanelVisible(false);
          setEditingReferencia(null);
          setEditingPin(null);
        }}
        onSave={handleSaveForm}
        onSaveReferencia={handleSalvarReferencia}
        onDeleteReferencia={handleExcluirReferencia}
        onDeletePin={handleDeletePin}
      />

      <GerenciadorReferenciasModal
        visible={gerenciadorRefOpen}
        onClose={() => setGerenciadorRefOpen(false)}
        selectedMapKey={selectedMapKey}
        referencias={referenciasList}
        coresReferencias={coresReferencias}
        onAdicionarNova={handleIniciarCriacaoReferencia}
        onEditarReferencia={handleEditarReferencia}
        onExcluirReferencia={handleExcluirReferencia}
        onFocarNoMapa={handleFocarReferenciaNoMapa}
        onRestaurarPadrao={handleRestaurarPadraoReferencias}
      />

      {/* Modais de Cache e Fila Outbox (UI-4) */}
      <OfflineCacheModal
        visible={offlineCacheOpen}
        onClose={() => setOfflineCacheOpen(false)}
        networkState={networkState}
      />

      <FilaOutboxModal
        visible={filaOutboxOpen}
        onClose={() => setFilaOutboxOpen(false)}
        items={outboxItems}
        onSyncNow={handleSyncOutbox}
        onRetryItem={handleRetryItem}
        isSyncing={isSyncing}
        hasEnginePending={enginePendingCount > 0}
      />

      {/* 9. Modal de Galeria Fotográfica (Superfície #9 - S22.5) */}
      <FotoGaleriaModal
        visible={fotoModalOpen}
        pin={fotoPin}
        onClose={() => setFotoModalOpen(false)}
        onUploadRequest={handlePhotoUploadRequest}
      />

      {/* 10. Modal de Nova Inspeção (Superfície #13 - S23) */}
      <InspecaoModal
        visible={inspecaoModalOpen}
        pin={inspecaoPin}
        onClose={() => setInspecaoModalOpen(false)}
        onSave={handleSaveInspecao}
      />

      {/* 11. Modal de Histórico (Superfície #10 - S8) */}
      <HistoricoModal
        visible={historicoModalOpen}
        pin={historicoPin}
        onClose={() => setHistoricoModalOpen(false)}
      />

      {/* 12. Modal de Pendências (Superfície #11 - S10) */}
      <PendenciasModal
        visible={pendenciasModalOpen}
        pin={pendenciasPin}
        onClose={() => setPendenciasModalOpen(false)}
      />

      {/* 13. Modal de Ciclo de Vida (Superfície #12 - S18) */}
      <CicloVidaModal
        visible={cicloVidaModalOpen}
        pin={cicloVidaPin}
        onClose={() => setCicloVidaModalOpen(false)}
        onUpdateStatus={handleUpdateCicloVida}
        onDeletePin={handleDeletePin}
      />

      {/* 14. Modal Comparador Antes & Depois (Etapa 1) */}
      <AntesDepoisModal
        visible={antesDepoisOpen}
        pin={antesDepoisPin || selectedPin}
        onClose={() => setAntesDepoisOpen(false)}
      />

      {/* 15. Modal Dashboard Executivo & Inteligência Comercial (Fase L4.0) */}
      <DashboardExecutivoModal
        visible={dashboardOpen}
        userRole="ADMIN"
        onClose={() => setDashboardOpen(false)}
        onAbrirFicha360={(idLojaMapa) => {
          setDashboardOpen(false);
          const loja = Loja360Service.obterFicha(idLojaMapa);
          if (loja) {
            setLojaSelecionada360(loja);
            setLoja360Open(true);
          }
        }}
        onVerNoMapa={(idLojaMapa, numeroBox) => {
          setDashboardOpen(false);
          const foundPin = pinsList.find((pin) => pin.id === idLojaMapa || pin.humanLocation?.includes(numeroBox));
          if (foundPin) {
            setSelectedPin(foundPin);
          }
        }}
      />

      {/* 16. Modal Central de Gestão Tabular (Etapa 2) */}
      <CentralGestaoModal
        visible={centralGestaoOpen}
        pins={pinsList}
        onClose={() => setCentralGestaoOpen(false)}
        onSelectPin={(pin) => {
          setSelectedPin(pin);
          setCentralGestaoOpen(false);
        }}
        onEditPin={(pin) => {
          setFormMode('EDITAR');
          setEditingPin(pin);
          setCentralGestaoOpen(false);
          setFormPanelVisible(true);
        }}
        onOpenPhotos={(pin) => {
          setFotoPin(pin);
          setFotoModalOpen(true);
        }}
        onOpenAntesDepois={(pin) => {
          setAntesDepoisPin(pin);
          setAntesDepoisOpen(true);
        }}
      />

      {/* 17. Modal Execução de Ronda com Checklist (Etapa 2) */}
      <RondaExecucaoModal
        visible={rondaExecucaoOpen}
        onClose={() => setRondaExecucaoOpen(false)}
        onCriarOcorrencia={handleCriarOcorrenciaDaRonda}
      />

      {/* 18. Modal Central de Alertas e SLA (Etapa 2) */}
      <AlertasModal
        visible={alertasOpen}
        pins={pinsList}
        outboxPendingCount={pendingQueueCount}
        onClose={() => setAlertasOpen(false)}
        onSelectPin={(pin) => {
          setSelectedPin(pin);
          setAlertasOpen(false);
        }}
      />

      {/* 19. Modal Agenda Operacional & Planos Preventivos (Etapa 2) */}
      <AgendaModal
        visible={agendaOpen}
        onClose={() => setAgendaOpen(false)}
        onIniciarRonda={(setor) => {
          setRondaExecucaoOpen(true);
        }}
      />

      {/* 20. Modal Relatórios Executivos & Slides (Etapa 3) */}
      <RelatoriosSlidesModal
        visible={relatoriosOpen}
        pins={pinsList}
        onClose={() => setRelatoriosOpen(false)}
        onSelectPin={(pin) => {
          setSelectedPin(pin);
          setRelatoriosOpen(false);
        }}
      />

      {/* 21. Modal Loja 360 & Boxes (Paridade Google Apps Script) */}
      <Loja360Modal
        visible={loja360Open}
        onClose={() => setLoja360Open(false)}
        lojaInicial={lojaSelecionada360}
        onAbrirOcorrenciaParaLoja={handleAbrirOcorrenciaDaLoja}
      />

      {/* 22. Modal Ativos do Mall & Fiscalização de Mídia (Paridade Google Apps Script) */}
      <AtivoMallModal
        visible={ativoMallOpen}
        onClose={() => setAtivoMallOpen(false)}
        onAbrirOcorrenciaParaMidia={handleAbrirOcorrenciaDaMidia}
      />

      {/* 23. Modal Central de Campanhas de Marketing (L2.3, L2.4, L2.5) */}
      <CampanhaCentralModal
        visible={campanhasCentralOpen}
        onClose={() => setCampanhasCentralOpen(false)}
        campanhaAtivaId={campanhaAtivaId}
        onAplicarNoMapa={(campId) => setCampanhaAtivaId(campId)}
        onVerNoMapa={handleVerCampanhaNoMapa}
      />

      {/* 24. Modal de Levantamento de Campo (Fase L2.6) */}
      <LevantamentoModal
        visible={levantamentoModalOpen}
        onClose={() => setLevantamentoModalOpen(false)}
        onContinuarNoMapa={handleContinuarLevantamentoNoMapa}
        onAbrirRegistroPonto={(ponto) => {
          setPontoLevantamentoSelecionado(ponto);
          setLevantamentoRegistroOpen(true);
        }}
      />

      {/* 25. Formulário de Registro de Levantamento & Salvar e Próximo (Fase L2.6) */}
      <LevantamentoRegistroModal
        visible={levantamentoRegistroOpen}
        ponto={pontoLevantamentoSelecionado}
        onClose={() => setLevantamentoRegistroOpen(false)}
        onSalvo={handleSalvarLevantamento}
        onSalvarEProximo={handleSalvarEProximoLevantamento}
      />

      {/* 26. Central Administrativa de Gestão de Lojistas e Permissionários (L3.0/L3.1) */}
      <CentralGestaoLojistasModal
        visible={centralGestaoLojistasOpen}
        onClose={() => setCentralGestaoLojistasOpen(false)}
        onAbrirFicha360={handleAbrirFicha360DaCentral}
        onVerNoMapa={handleVerNoMapaDaCentral}
        onAbrirFinanceiro={(idPerm) => {
          setFinanceiroPermissionarioId(idPerm);
          setFinanceiroModalOpen(true);
        }}
        userRole="ADMIN"
      />


      {/* 27. Modal de Contratos & Financeiro Restrito (Fase L3.4, L3.6 e L3.7) */}
      <FinanceiroRestritoModal
        key={`fin-modal-${financeiroPermissionarioId}-${financeiroUpdateKey}`}
        visible={financeiroModalOpen}
        idPermissionario={financeiroPermissionarioId}
        userRole="ADMIN"
        onClose={() => {
          setFinanceiroModalOpen(false);
          setFinanceiroPermissionarioId(null);
        }}
        onAbrirEditorContrato={(idPerm, contrato) => {
          setContratoEditorPermissionarioId(idPerm);
          setContratoParaEditar(contrato || null);
          setContratoEditorOpen(true);
        }}
        onAbrirEditorLancamento={(idPerm, lancamento) => {
          setFinanceiroPermissionarioId(idPerm);
          setLancamentoParaAjustar(lancamento || null);
          setLancamentoEditorOpen(true);
        }}
        onAbrirRegistroPagamento={(idPerm, lancamento) => {
          setFinanceiroPermissionarioId(idPerm);
          setLancamentoParaPagamento(lancamento);
          setPagamentoModalOpen(true);
        }}
        onAbrirEditorAcordo={(idPerm, acordo) => {
          setFinanceiroPermissionarioId(idPerm);
          setAcordoParaEditar(acordo || null);
          setAcordoEditorOpen(true);
        }}
      />

      {/* 28. Central Financeira e de Contratos (Fase L3.5) */}
      <CentralFinanceiraModal
        key={`central-fin-${financeiroUpdateKey}`}
        visible={centralFinanceiraOpen}
        onClose={() => setCentralFinanceiraOpen(false)}
        userRole="ADMIN"
        onAbrirDetalhesFinanceiros={(idPerm) => {
          setFinanceiroPermissionarioId(idPerm);
          setFinanceiroModalOpen(true);
        }}
        onAbrirGestaoPermissionario={() => {
          setCentralFinanceiraOpen(false);
          setCentralGestaoLojistasOpen(true);
        }}
        onAbrirEditorContrato={(idPerm, contrato) => {
          setContratoEditorPermissionarioId(idPerm);
          setContratoParaEditar(contrato || null);
          setContratoEditorOpen(true);
        }}
      />

      {/* 29. Editor de Contratos Multi-Espaço e Auditoria (Fase L3.6) */}
      <ContratoEditorModal
        visible={contratoEditorOpen}
        idPermissionario={contratoEditorPermissionarioId || ''}
        contratoParaEditar={contratoParaEditar}
        userRole="ADMIN"
        onClose={() => {
          setContratoEditorOpen(false);
          setContratoEditorPermissionarioId(null);
          setContratoParaEditar(null);
        }}
        onContratoSalvo={(_contratoSalvo) => {
          setContratoEditorOpen(false);
          setContratoEditorPermissionarioId(null);
          setContratoParaEditar(null);
          setFinanceiroUpdateKey((k) => k + 1);
        }}
      />

      {/* 30. Editor de Lançamentos Financeiros (Fase L3.7) */}
      <LancamentoEditorModal
        visible={lancamentoEditorOpen}
        idPermissionario={financeiroPermissionarioId || ''}
        contratosDisponiveis={
          financeiroPermissionarioId
            ? FinanceiroRestritoService.obterResumoFinanceiro(financeiroPermissionarioId).contratos
            : []
        }
        lancamentoParaAjustar={lancamentoParaAjustar}
        userRole="ADMIN"
        onClose={() => {
          setLancamentoEditorOpen(false);
          setLancamentoParaAjustar(null);
        }}
        onLancamentoSalvo={(_lanSalvo) => {
          setLancamentoEditorOpen(false);
          setLancamentoParaAjustar(null);
          setFinanceiroUpdateKey((k) => k + 1);
        }}
      />

      {/* 31. Registro de Pagamentos e Baixa (Fase L3.7) */}
      <PagamentoRegistroModal
        visible={pagamentoModalOpen}
        idPermissionario={financeiroPermissionarioId || ''}
        lancamento={lancamentoParaPagamento}
        userRole="ADMIN"
        onClose={() => {
          setPagamentoModalOpen(false);
          setLancamentoParaPagamento(null);
        }}
        onPagamentoRegistrado={(_lanAtualizado) => {
          setPagamentoModalOpen(false);
          setLancamentoParaPagamento(null);
          setFinanceiroUpdateKey((k) => k + 1);
        }}
      />

      {/* 32. Editor de Acordos Financeiros (Fase L3.7) */}
      <AcordoEditorModal
        visible={acordoEditorOpen}
        idPermissionario={financeiroPermissionarioId || ''}
        acordoParaEditar={acordoParaEditar}
        userRole="ADMIN"
        onClose={() => {
          setAcordoEditorOpen(false);
          setAcordoParaEditar(null);
        }}
        onAcordoSalvo={(_acordoSalvo) => {
          setAcordoEditorOpen(false);
          setAcordoParaEditar(null);
          setFinanceiroUpdateKey((k) => k + 1);
        }}
      />

      {/* 33. Central de Auditoria de Vendas & Faturamento (Fase L3.8) */}
      <AuditoriaVendasCentralModal
        key={`auditoria-central-${auditoriaUpdateKey}`}
        visible={auditoriaCentralOpen}
        onClose={() => setAuditoriaCentralOpen(false)}
        userRole="ADMIN"
        onAbrirEditorAuditoria={(auditoria) => {
          setAuditoriaParaEditar(auditoria || null);
          setAuditoriaEditorOpen(true);
        }}
        onAbrirFichaLoja={(idLoja) => {
          const ficha = Loja360Service.obterFicha(idLoja);
          if (ficha) {
            setLojaSelecionada360(ficha);
            setLoja360Open(true);
          }
        }}
        onAbrirFinanceiroPermissionario={(idPerm) => {
          setFinanceiroPermissionarioId(idPerm);
          setFinanceiroModalOpen(true);
        }}
      />

      {/* 34. Editor de Auditoria de Vendas (Fase L3.8) */}
      <AuditoriaVendasEditorModal
        visible={auditoriaEditorOpen}
        auditoriaParaEditar={auditoriaParaEditar}
        userRole="ADMIN"
        onClose={() => {
          setAuditoriaEditorOpen(false);
          setAuditoriaParaEditar(null);
        }}
        onAuditoriaSalva={(_salva) => {
          setAuditoriaEditorOpen(false);
          setAuditoriaParaEditar(null);
          setAuditoriaUpdateKey((k) => k + 1);
        }}
      />

      {/* 35. Central Analítica Comercial (Fase L3.9) */}
      <CentralAnaliticaModal
        visible={centralAnaliticaOpen}
        onClose={() => setCentralAnaliticaOpen(false)}
        userRole="ADMIN"
        onAbrirFichaLoja={(idLoja) => {
          const ficha = Loja360Service.obterFicha(idLoja);
          if (ficha) {
            setLojaSelecionada360(ficha);
            setLoja360Open(true);
          }
        }}
        onVerNoMapa={(setor, numeroBox, idLoja) => {
          setCentralAnaliticaOpen(false);
          // Mapear nome do setor para chave cartográfica
          let mapKey = 'SETOR_AZUL';
          const s = (setor || '').toUpperCase();
          if (s.includes('VERDE')) mapKey = 'SETOR_VERDE';
          else if (s.includes('AMARELO')) mapKey = 'SETOR_AMARELO';
          else if (s.includes('ROXO')) mapKey = 'SETOR_ROXO';
          else if (s.includes('BRANCO')) mapKey = 'SETOR_BRANCO';
          else if (s.includes('NIVEL') || s.includes('1')) mapKey = 'NIVEL_1';
          setSelectedMapKey(mapKey);

          // Localizar pin pelo número ou ID
          const pinEncontrado = pinsList.find(
            (p) => p.id === idLoja || p.humanLocation?.includes(numeroBox)
          );
          if (pinEncontrado) {
            setSelectedPin(pinEncontrado);
          }
        }}
        onAbrirPermissionario={(_idPerm) => {
          setCentralGestaoLojistasOpen(true);
        }}
        onAbrirFinanceiro={(idPerm) => {
          setFinanceiroPermissionarioId(idPerm);
          setFinanceiroModalOpen(true);
        }}
        onAbrirAuditoria={(_idLoja) => {
          setAuditoriaCentralOpen(true);
        }}
      />

      {/* 36. Central de Administração do Mall (Fase L5.0 - Superfícies #24 a #32) */}
      <AdminModal
        visible={adminModalOpen}
        userRole="ADMIN"
        onClose={() => setAdminModalOpen(false)}
      />

      {/* 37. Central Cartográfica & Governança Espacial (Fase L5.0 - Superfícies #33 a #42) */}
      <CentralCartograficaModal
        visible={centralCartograficaOpen}
        userRole="ADMIN"
        abaInicial={abaCartograficaInicial}
        onClose={() => setCentralCartograficaOpen(false)}
      />

      {/* S24.2 Calibração Setor ↔ Nível com mapas lado a lado */}
      <CalibracaoSetorNivelModal
        visible={calibracaoModalOpen}
        onClose={() => setCalibracaoModalOpen(false)}
        contextoSetor={mapsList.find((m) => m.key === selectedMapKey)?.label}
      />

      {/* S26.8-D4 Áreas operacionais do Nível 0 */}
      <AreasOperacionaisNivel0Modal
        visible={areasNivel0ModalOpen}
        onClose={() => setAreasNivel0ModalOpen(false)}
        contextoSetor={mapsList.find((m) => m.key === selectedMapKey)?.label}
      />

      {/* S26.9-C2 Configurações de cadastro */}
      <ConfiguracoesCadastroModal
        visible={configuracoesCadastroOpen}
        onClose={() => setConfiguracoesCadastroOpen(false)}
      />

      {/* S26.10-R3 Central de Referências */}
      <CentralReferenciasModal
        visible={centralReferenciasOpen}
        onClose={() => setCentralReferenciasOpen(false)}
        referencias={referenciasList}
        onSalvarReferencia={handleSalvarReferencia}
        onExcluirReferencia={handleExcluirReferencia}
        onReposicionarNoMapa={(ref) => {
          const targetKey = CartografiaService.normalizarIdMapaSetor(ref.idMapaSetor);
          setSelectedMapKey(targetKey);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LegacyTheme.colors.bg,
  },

  /* Header Styles (.app-header) */
  header: {
    height: 64,
    backgroundColor: LegacyTheme.colors.navy,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: LegacyTheme.colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
    zIndex: 50,
  },
  headerMobile: {
    height: 56,
    paddingHorizontal: 12,
  },
  headerTitleGroup: {
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerVersion: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionBadge: {
    backgroundColor: LegacyTheme.colors.onlineBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: LegacyTheme.borderRadius.pill,
  },
  connectionBadgeText: {
    color: LegacyTheme.colors.onlineText,
    fontSize: 12,
    fontWeight: '700',
  },
  userBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: LegacyTheme.borderRadius.pill,
    maxWidth: 240,
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Main Layout & Toolbar Area (.toolbar) */
  mainLayout: {
    flex: 1,
    padding: 14,
    width: '100%',
    maxWidth: 1500,
    alignSelf: 'center',
  },
  mainLayoutMobile: {
    padding: 8,
  },
  toolbarCard: {
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'nowrap',
    gap: 12,
    shadowColor: LegacyTheme.colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  toolbarCardMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  /* Barra de Filtros de Ronda e Busca Rápida (UI-6) */
  filterBarCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE3ED',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    zIndex: 100,
  },
  filterBarCardMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 8,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    position: 'relative',
  },
  searchBoxIcon: {
    fontSize: 14,
    marginRight: 6,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    height: 36,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: 'bold',
  },
  searchResultsDropdown: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 999,
  },
  searchResultItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  searchResultCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  searchResultTitle: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
  },
  searchResultSector: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  rondaFiltersGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  filterChipActive: {
    backgroundColor: '#11184F',
    borderColor: '#11184F',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  selectWrapper: {
    flex: 1,
    width: '100%',
    minWidth: 180,
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: LegacyTheme.colors.text,
  },
  mobileSelectFallback: {
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  mobileSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: LegacyTheme.colors.text,
  },
  toolbarButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbarButtonGroupMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
    width: '100%',
  },
  btnCentralizar: {
    width: 48,
    height: 42,
    minWidth: 48,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCentralizarIcon: {
    color: '#171B68',
    fontSize: 22,
    fontWeight: 'bold',
  },
  btnMenu: {
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnMenuText: {
    color: LegacyTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  menuBadge: {
    backgroundColor: LegacyTheme.colors.pink,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mobileToolbarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  mobileSelectContainer: {
    flex: 1,
  },
  btnCentralizarMobile: {
    width: 42,
    height: 42,
    minWidth: 42,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnHamburgerMobile: {
    width: 42,
    height: 42,
    minWidth: 42,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  btnHamburgerIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#171B68',
    lineHeight: 24,
  },
  menuBadgeFloating: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: LegacyTheme.colors.pink,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* Viewport Cartográfico (.map-card / .viewport) */
  mapCard: {
    flex: 1,
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 18,
    padding: 10,
    overflow: 'hidden',
    position: 'relative',
  },

  /* Banner Flutuante de Campanha Ativa sobre o Mapa */
  bannerCampanhaMapa: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    zIndex: 100,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38bdf8',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexWrap: 'wrap',
    gap: 10,
  },
  bannerCampanhaInfo: {
    flex: 1,
    minWidth: 260,
  },
  bannerCampanhaTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerCampanhaIcon: {
    fontSize: 16,
  },
  bannerCampanhaNome: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
  },
  badgeCampanhaAtiva: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  badgeCampanhaAtivaText: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '700',
  },
  bannerCampanhaMetricas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  bannerMetricaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bannerMetricaText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  bannerCampanhaAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnBannerCarteira: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnBannerCarteiraText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  btnBannerDesativar: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  btnBannerDesativarText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
