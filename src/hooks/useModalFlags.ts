import { useState } from 'react';

/**
 * Flags de abertura dos modais e painéis do shell (centralizados).
 * Os setters mantêm os mesmos nomes usados no shell original.
 */
export function useModalFlags() {
  // Modais e Painéis da UI-2
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [camadasOpen, setCamadasOpen] = useState<boolean>(false);
  const [showCentralCamadas, setShowCentralCamadas] = useState<boolean>(false);
  const [showSinalizacoes, setShowSinalizacoes] = useState<boolean>(true);
  const [showReferencias, setShowReferencias] = useState<boolean>(true);
  const [showCruzamentos, setShowCruzamentos] = useState<boolean>(true);
  const [showLojas, setShowLojas] = useState<boolean>(false);

  // Gerenciador de Referências
  const [gerenciadorRefOpen, setGerenciadorRefOpen] = useState<boolean>(false);

  // Fluxo de Posicionamento e Cadastro (UI-3)
  const [positioningMode, setPositioningMode] = useState<boolean>(false);
  const [localCardVisible, setLocalCardVisible] = useState<boolean>(false);
  const [formPanelVisible, setFormPanelVisible] = useState<boolean>(false);

  // Offline/Outbox (UI-4)
  const [offlineCacheOpen, setOfflineCacheOpen] = useState<boolean>(false);
  const [filaOutboxOpen, setFilaOutboxOpen] = useState<boolean>(false);

  // Galeria de Fotos S22.5 (UI-5)
  const [fotoModalOpen, setFotoModalOpen] = useState<boolean>(false);

  // Inspeção (UI-6/7)
  const [inspecaoModalOpen, setInspecaoModalOpen] = useState<boolean>(false);

  // Ações do Card de Sinalização (UI-7)
  const [historicoModalOpen, setHistoricoModalOpen] = useState<boolean>(false);
  const [pendenciasModalOpen, setPendenciasModalOpen] = useState<boolean>(false);
  const [cicloVidaModalOpen, setCicloVidaModalOpen] = useState<boolean>(false);

  // Comparador Antes e Depois & Dashboard
  const [antesDepoisOpen, setAntesDepoisOpen] = useState<boolean>(false);
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);

  // Operação em Campo & Central de Gestão
  const [centralGestaoOpen, setCentralGestaoOpen] = useState<boolean>(false);
  const [rondaExecucaoOpen, setRondaExecucaoOpen] = useState<boolean>(false);
  const [alertasOpen, setAlertasOpen] = useState<boolean>(false);
  const [agendaOpen, setAgendaOpen] = useState<boolean>(false);

  // Relatórios Executivos
  const [relatoriosOpen, setRelatoriosOpen] = useState<boolean>(false);

  // Loja 360 & Gestão de Boxes
  const [loja360Open, setLoja360Open] = useState<boolean>(false);
  const [centralGestaoLojistasOpen, setCentralGestaoLojistasOpen] = useState<boolean>(false);

  // Contratos & Financeiro Restrito
  const [financeiroModalOpen, setFinanceiroModalOpen] = useState<boolean>(false);
  const [centralFinanceiraOpen, setCentralFinanceiraOpen] = useState<boolean>(false);
  const [contratoEditorOpen, setContratoEditorOpen] = useState<boolean>(false);
  const [lancamentoEditorOpen, setLancamentoEditorOpen] = useState<boolean>(false);
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState<boolean>(false);
  const [acordoEditorOpen, setAcordoEditorOpen] = useState<boolean>(false);

  // Auditoria de Vendas
  const [auditoriaCentralOpen, setAuditoriaCentralOpen] = useState<boolean>(false);
  const [auditoriaEditorOpen, setAuditoriaEditorOpen] = useState<boolean>(false);

  // Central Analítica
  const [centralAnaliticaOpen, setCentralAnaliticaOpen] = useState<boolean>(false);

  // Central de Administração & Governança Cartográfica
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [centralCartograficaOpen, setCentralCartograficaOpen] = useState<boolean>(false);
  const [calibracaoModalOpen, setCalibracaoModalOpen] = useState<boolean>(false);
  const [areasNivel0ModalOpen, setAreasNivel0ModalOpen] = useState<boolean>(false);
  const [configuracoesCadastroOpen, setConfiguracoesCadastroOpen] = useState<boolean>(false);
  const [centralReferenciasOpen, setCentralReferenciasOpen] = useState<boolean>(false);

  // Ativos do Mall & Mídia Física
  const [ativoMallOpen, setAtivoMallOpen] = useState<boolean>(false);

  // Campanhas no Mapa
  const [campanhasCentralOpen, setCampanhasCentralOpen] = useState<boolean>(false);

  // Levantamento de Campo
  const [levantamentoModalOpen, setLevantamentoModalOpen] = useState<boolean>(false);
  const [levantamentoRegistroOpen, setLevantamentoRegistroOpen] = useState<boolean>(false);

  return {
    menuOpen, setMenuOpen,
    camadasOpen, setCamadasOpen,
    showCentralCamadas, setShowCentralCamadas,
    showSinalizacoes, setShowSinalizacoes,
    showReferencias, setShowReferencias,
    showCruzamentos, setShowCruzamentos,
    showLojas, setShowLojas,
    gerenciadorRefOpen, setGerenciadorRefOpen,
    positioningMode, setPositioningMode,
    localCardVisible, setLocalCardVisible,
    formPanelVisible, setFormPanelVisible,
    offlineCacheOpen, setOfflineCacheOpen,
    filaOutboxOpen, setFilaOutboxOpen,
    fotoModalOpen, setFotoModalOpen,
    inspecaoModalOpen, setInspecaoModalOpen,
    historicoModalOpen, setHistoricoModalOpen,
    pendenciasModalOpen, setPendenciasModalOpen,
    cicloVidaModalOpen, setCicloVidaModalOpen,
    antesDepoisOpen, setAntesDepoisOpen,
    dashboardOpen, setDashboardOpen,
    centralGestaoOpen, setCentralGestaoOpen,
    rondaExecucaoOpen, setRondaExecucaoOpen,
    alertasOpen, setAlertasOpen,
    agendaOpen, setAgendaOpen,
    relatoriosOpen, setRelatoriosOpen,
    loja360Open, setLoja360Open,
    centralGestaoLojistasOpen, setCentralGestaoLojistasOpen,
    financeiroModalOpen, setFinanceiroModalOpen,
    centralFinanceiraOpen, setCentralFinanceiraOpen,
    contratoEditorOpen, setContratoEditorOpen,
    lancamentoEditorOpen, setLancamentoEditorOpen,
    pagamentoModalOpen, setPagamentoModalOpen,
    acordoEditorOpen, setAcordoEditorOpen,
    auditoriaCentralOpen, setAuditoriaCentralOpen,
    auditoriaEditorOpen, setAuditoriaEditorOpen,
    centralAnaliticaOpen, setCentralAnaliticaOpen,
    adminModalOpen, setAdminModalOpen,
    centralCartograficaOpen, setCentralCartograficaOpen,
    calibracaoModalOpen, setCalibracaoModalOpen,
    areasNivel0ModalOpen, setAreasNivel0ModalOpen,
    configuracoesCadastroOpen, setConfiguracoesCadastroOpen,
    centralReferenciasOpen, setCentralReferenciasOpen,
    ativoMallOpen, setAtivoMallOpen,
    campanhasCentralOpen, setCampanhasCentralOpen,
    levantamentoModalOpen, setLevantamentoModalOpen,
    levantamentoRegistroOpen, setLevantamentoRegistroOpen,
  };
}
