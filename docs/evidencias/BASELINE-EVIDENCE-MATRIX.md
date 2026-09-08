# BASELINE EVIDENCE MATRIX — SINALIZAÇÃO DO MALL (S25.6 / S26.6)

> **Fonte Única Autorizada:** Baseline oficial `sinalizacao_mall_s26_6.zip` extraída em `/tmp/sinalizacao-baseline-oficial/sinalizacao_mall_s25_6_limpa/`.

---

| # | Superfície | Evidência | Arquivo Real no ZIP | Função / ID Real Auditado | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Shell principal / Mapa** | `CONFIRMADO_NO_ZIP` | `index.html` (L12, L297-305), `styles.html` | `versao` (L12), `status` (L13), `viewport` (L297), `stage` (L298), `mapaImg` (L298) | 🟢 Auditado |
| **2** | **Menu** | `CONFIRMADO_NO_ZIP` | `index.html` (L26-L86), `scripts.html` | `appMenuBtnS22513` (L26), `appMenuS22513` (L34), `appMenuCloseS22513` (L37) | 🟢 Auditado |
| **3** | **Camadas** | `index.html` (L45, L88-L296), `PresetsCamadasService.gs` | `camadasBtn` (L45), `camadas` (L88), `toggleSinalizacoes` (L95), `gerenciarCamadasS261` (L105) | 🟢 Auditado |
| **4** | **Novo registro de sinalização** | `CONFIRMADO_NO_ZIP` | `index.html` (L42, L303), `scripts.html` | `novo` (L42), `draftLayer` (L303) *(Nome técnico "novo", domínio = Sinalização)* | 🟢 Auditado |
| **5** | **Seleção e confirmação de posição** | `CONFIRMADO_NO_ZIP` | `index.html` (L336-L341) | `localCard` (L336), `localTitulo` (L336), `localStatus` (L336), `cancelarPonto` (L339), `confirmarPonto` (L340) | 🟢 Auditado |
| **6** | **Formulário de cadastro** | `CONFIRMADO_NO_ZIP` | `index.html` (L344-L390) | `formPanel` (L344), `formRegistro` (L353), `tipo` (L357), `finalidade` (L357), `titulo` (L358), `salvar` (L390) | 🟢 Auditado |
| **7** | **Edição cadastral** | `CONFIRMADO_NO_ZIP` | `index.html` (L310, L354-L356) | `cardEditarBtnS237` (L310), `editModeS237` (L354), `editIdRegistroS237` (L355), `editProtocoloS237` (L356) | 🟢 Auditado |
| **8** | **Card da sinalização** | `CONFIRMADO_NO_ZIP` | `index.html` (L306-L334) | `sinalizacaoMapaCard` (L306), `sigCardProtocolo` (L308), `sigCardTitulo` (L308), `sigCardStatus` (L324), `sigCardEstado` (L324) | 🟢 Auditado |
| **9** | **Fotos / galeria** | `CONFIRMADO_NO_ZIP` | `index.html` (L312, L1725-L1746) | `btnFotosSigCardS225` (L312), `fotoModalS225` (L1725), `fotoImagemS225` (L1737), `fotoStageS225` (L1734) | 🟢 Auditado |
| **10** | **Histórico** | `CONFIRMADO_NO_ZIP` | `index.html` (L330, L1679-L1688) | `btnHistoricoS8` (L330), `historicoPanel` (L1679), `historicoLista` (L1688) | 🟢 Auditado |
| **11** | **Pendências** | `CONFIRMADO_NO_ZIP` | `index.html` (L330, L1600-L1609) | `btnPendenciasS10` (L330), `pendenciasPanel` (L1600), `pendenciasListaS10` (L1609) | 🟢 Auditado |
| **12** | **Ciclo de vida** | `CONFIRMADO_NO_ZIP` | `index.html` (L332, L1515-L1594), `Code.gs` | `btnCicloVidaS18` (L332), `cicloVidaPanelS18` (L1515), `btnExcluirRegistroS236` (L1531), `eventoCicloEditorS18` (L1540) | 🟢 Auditado |
| **13** | **Nova inspeção** | `CONFIRMADO_NO_ZIP` | `index.html` (L332, L1612-L1673) | `btnNovaInspecao` (L332), `inspecaoPanel` (L1612), `formInspecao` (L1621), `inspEstado` (L1623), `salvarInspecao` (L1673) | 🟢 Auditado |
| **14** | **Atualizar offline** | `CONFIRMADO_NO_ZIP` | `index.html` (L48, L1704-L1717), `OfflineService.gs` | `prepararOffline` (L48), `offlinePanel` (L1704), `executarPrepararOffline` (L1717), `OfflineService.gs` | 🟢 Auditado |
| **15** | **Verificar cache** | `CONFIRMADO_NO_ZIP` | `index.html` (L1716), `OfflineService.gs` | `verificarOffline` (L1716), `OfflineService.gs → verificarIntegridadeCache` | 🟢 Auditado |
| **16** | **Reparar cache** | `CONFIRMADO_NO_ZIP` | `index.html` (L1717), `OfflineService.gs` | `repararOffline` (L1717), `OfflineService.gs → repararCacheCorrompido` | 🟢 Auditado |
| **17** | **Fila / Outbox** | `CONFIRMADO_NO_ZIP` | `index.html` (L51, L1691-L1700), `OfflineService.gs` | `filaBtn` (L51), `filaCount` (L53), `filaPanel` (L1691), `filaLista` (L1699), `sincronizarFila` (L1700) | 🟢 Auditado |
| **18** | **Estados Online / Degradado / Offline** | `CONFIRMADO_NO_ZIP` | `index.html` (L13), `styles.html` | `status` (L13), `styles.html → .pill, .status-online, .status-offline` | 🟢 Auditado |
| **19** | **Central** | `CONFIRMADO_NO_ZIP` | `index.html` (L55), `scripts.html` | `centralGestaoBtn` (L55) | 🟢 Auditado |
| **20** | **Agenda** | `CONFIRMADO_NO_ZIP` | `index.html` (L58, L1480-L1512), `scripts.html` | `agendaBtnS19` (L58), `agendaPanelS19` (L1480), `agendaListaS19` (L1512), `reagendarResumoS191` (L1429) | 🟢 Auditado |
| **21** | **Alertas** | `CONFIRMADO_NO_ZIP` | `index.html` (L61, L1448-L1477), `scripts.html` | `alertasBtnS21` (L61), `alertasBadgeS21` (L63), `alertasPanelS21` (L1448), `alertasListaS21` (L1477) | 🟢 Auditado |
| **22** | **Dashboard** | `CONFIRMADO_NO_ZIP` | `index.html` (L65), `scripts.html` | `dashboardBtn` (L65) | 🟢 Auditado |
| **23** | **Relatórios** | `CONFIRMADO_NO_ZIP` | `index.html` (L68), `RelatorioSlidesService.gs` | `relatoriosBtn` (L68), `RelatorioSlidesService.gs → gerarRelatorioApresentacaoSlides` | 🟢 Auditado |
| **24** | **Administração** | `CONFIRMADO_NO_ZIP` | `index.html` (L80, L398-L690), `Code.gs` | `adminBtnS14` (L80), `adminPanelS14` (L398), `adminSessaoS14` (L408), `SetupService.gs` | 🟢 Auditado |
| **25** | **Usuários** | `CONFIRMADO_NO_ZIP` | `index.html` (L411, L420-L425), `Code.gs` | `tabUsuariosS14` (L411), `novoUsuarioS14` (L422), `listaUsuariosS14` (L424), `Code.gs → obterUsuarios` | 🟢 Auditado |
| **26** | **Perfis e permissões** | `CONFIRMADO_NO_ZIP` | `index.html` (L412, L427-L428), `Code.gs` | `tabPerfisS14` (L412), `listaPerfisS14` (L428), `Code.gs → validarPermissaoUsuario` | 🟢 Auditado |
| **27** | **Auditoria** | `CONFIRMADO_NO_ZIP` | `index.html` (L412, L430-L445), `Code.gs` | `tabAuditoriaS15` (L412), `auditTextoS15` (L432), `auditListaS15` (L444) | 🟢 Auditado |
| **28** | **Backup e integridade** | `CONFIRMADO_NO_ZIP` | `index.html` (L413, L446-L454), `BackupService.gs` | `tabBackupS16` (L413), `criarBackupS16` (L448), `verificarIntegridadeS16` (L449), `BackupService.gs` | 🟢 Auditado |
| **29** | **Saúde operacional** | `CONFIRMADO_NO_ZIP` | `index.html` (L414, L455-L505) | `tabSaudeS17` (L414), `executarSaudeS17` (L457), `healthOverallS17` (L461), `healthSistemaS17` (L468) | 🟢 Auditado |
| **30** | **Inventário** | `CONFIRMADO_NO_ZIP` | `index.html` (L414, L508-L513) | `tabInventarioS18` (L414), `atualizarInventarioS18` (L510), `inventarioResumoS18` (L512) | 🟢 Auditado |
| **31** | **Planos preventivos** | `CONFIRMADO_NO_ZIP` | `index.html` (L415, L514-L521) | `tabPlanosS20` (L415), `novoPlanoS20` (L516), `aplicarPlanosS20` (L517), `listaPlanosS20` (L520) | 🟢 Auditado |
| **32** | **Comunicação** | `CONFIRMADO_NO_ZIP` | `index.html` (L415, L523-L552) | `tabComunicacaoS22` (L415), `novaRegraS22` (L525), `simularEscalamentoS222` (L540), `historicoNotifS22` (L552) | 🟢 Auditado |
| **33** | **Administração → Cartografia** | `CONFIRMADO_NO_ZIP` | `index.html` (L416, L556-L690), `Cartografia2025Service.gs` | `tabCartografiaS25` (L416), `cartoOverallS25` (L569), `Cartografia2025Service.gs`, `CartografiaService.gs` | 🟢 Auditado |
| **34** | **Calibrar níveis** | `CONFIRMADO_NO_ZIP` | `index.html` (L71, L626), `Cartografia2025Service.gs` | `calibracaoBtnS242` (L71), `abrirCalibracaoAdminS25` (L626), `Cartografia2025Service.gs → calcularTransformacaoAfim` | 🟢 Auditado |
| **35** | **Delimitar estacionamento** | `CONFIRMADO_NO_ZIP` | `index.html` (L74, L638), `Cartografia2025Service.gs` | `areaVermelhaBtnS244` (L74), `abrirEstacionamentoAdminS25` (L638), `Cartografia2025Service.gs` (Setor Vermelho / Nível 3) | 🟢 Auditado |
| **36** | **Delimitar áreas do Nível 1** | `CONFIRMADO_NO_ZIP` | `index.html` (L77, L637), `Cartografia2025Service.gs` | `areasNivel1BtnS246` (L77), `abrirAreasN1AdminS25` (L637), `Cartografia2025Service.gs` (Hotel, CDM, Áreas Externas) | 🟢 Auditado |
| **37** | **Governança cartográfica** | `CONFIRMADO_NO_ZIP` | `index.html` (L564-L574), `Cartografia2025Service.gs` | `revalidarCartografiaS252` (L564), `cartoQualidadeS252` (L574) | 🟢 Auditado |
| **38** | **Histórico cartográfico / snapshots** | `CONFIRMADO_NO_ZIP` | `index.html` (L672-L687) | `snapshotCartografiaS253` (L672), `cartoHistoricoS253` (L687) | 🟢 Auditado |
| **39** | **Restauração controlada** | `CONFIRMADO_NO_ZIP` | `index.html` (L733-L770) | `restaurarCartografiaPanelS254` (L733), `executarRestauracaoS254` (L770) | 🟢 Auditado |
| **40** | **Rascunho cartográfico** | `CONFIRMADO_NO_ZIP` | `index.html` (L583, L720-L729) | `novoRascunhoS255` (L583), `cartoPublicacaoPanelS255` (L720) | 🟢 Auditado |
| **41** | **Enviar para validação** | `CONFIRMADO_NO_ZIP` | `index.html` (L590), `Cartografia2025Service.gs` | `cartoPublicacaoAcoesS255` (L590), `Cartografia2025Service.gs` | 🟢 Auditado |
| **42** | **Publicação cartográfica** | `CONFIRMADO_NO_ZIP` | `index.html` (L586-L596), `Cartografia2025Service.gs` | `cartoPublicacaoAtualS255` (L586), `Cartografia2025Service.gs → publicarCartografiaOficial` | 🟢 Auditado |
