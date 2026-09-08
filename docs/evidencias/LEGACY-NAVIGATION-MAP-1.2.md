# MAPA DE NAVEGAÇÃO COMPLETO — SINALIZAÇÃO DO MALL (LEGADO 1.2)

> **Fonte Única Autorizada:** Baseline oficial `sinalizacao_mall_s26_6.zip` extraída em `/tmp/sinalizacao-baseline-oficial/sinalizacao_mall_s25_6_limpa/`. Todas as rotas e superfícies navegam como componentes flutuantes, modais ou painéis sobre a Viewport Cartográfica principal.

---

## 1. Visão Geral da Arquitetura de Navegação da Baseline Oficial

```
Mapa Principal (Viewport Cartográfico - index.html L297-L305)
  ├── 1. Novo registro de sinalização (#novo - index.html L42)
  │     ├── Seleção e marcação de ponto no mapa (draftLayer - L303)
  │     ├── Confirmação de posição no mapa (localCard - L336-L340)
  │     └── Formulário de cadastro de sinalização (formPanel - L344-L390)
  │
  ├── 2. Menu Contextual (appMenuS22513 - index.html L26-L86)
  │     ├── Novo registro (#novo - L42)
  │     ├── Camadas (#camadasBtn - L45)
  │     ├── Atualizar offline (#prepararOffline - L48)
  │     ├── Fila (#filaBtn - L51)
  │     ├── Central / Gestão (#centralGestaoBtn - L55)
  │     ├── Agenda (#agendaBtnS19 - L58)
  │     ├── Alertas (#alertasBtnS21 - L61)
  │     ├── Dashboard (#dashboardBtn - L65)
  │     ├── Relatórios (#relatoriosBtn - L68 / RelatorioSlidesService.gs)
  │     ├── Calibrar níveis (#calibracaoBtnS242 - L71 / Cartografia2025Service.gs)
  │     ├── Delimitar estacionamento (#areaVermelhaBtnS244 - L74 / Setor Vermelho Nível 3)
  │     ├── Delimitar áreas Nível 1 (#areasNivel1BtnS246 - L77 / Hotel, CDM, Laterais)
  │     └── Administração (#adminBtnS14 - L80 / SetupService.gs)
  │
  ├── 3. Camadas e Presets (camadas - index.html L88-L296)
  │     ├── Toggles Rápidos (Sinalizações, Referências, Cruzamentos, Lojas - L95-L101)
  │     ├── Central de Camadas (#centralCamadasS261 - L111)
  │     ├── Filtros Avançados de Sinalização (#buscaCamadasS262, #filtroTipoS262 - L170-L200)
  │     ├── Simbologia e Cores (#simbologiaModoS263, #corUnicaS263 - L214-L239)
  │     ├── Visualizações Corporativas (#corpAdminCreateS266 - L250 / PresetsCamadasService.gs)
  │     └── Presets Pessoais (#nomePresetS264 - L276)
  │
  ├── 4. Interação com Sinalização (Clique no Pin - index.html L306-L334)
  │     └── Card da Sinalização (#sinalizacaoMapaCard - L306)
  │           ├── Edição cadastral (#cardEditarBtnS237 - L310)
  │           ├── Fotos / Galeria (#btnFotosSigCardS225 - L312 / fotoModalS225 - L1725)
  │           ├── Histórico (#btnHistoricoS8 - L330 / historicoPanel - L1679)
  │           ├── Pendências (#btnPendenciasS10 - L330 / pendenciasPanel - L1600)
  │           ├── Ciclo de vida (#btnCicloVidaS18 - L332 / cicloVidaPanelS18 - L1515 / Code.gs)
  │           └── Nova inspeção (#btnNovaInspecao - L332 / inspecaoPanel - L1612)
  │
  ├── 5. Offline & Cache (#offlinePanel - index.html L1704-L1717)
  │     ├── Preparar / baixar dados para cache (executarPrepararOffline - L1717 / OfflineService.gs)
  │     ├── Verificar integridade do cache (verificarOffline - L1716)
  │     └── Reparar cache corrompido (repararOffline - L1717)
  │
  ├── 6. Fila de Sincronização (#filaPanel - index.html L1691-L1700)
  │     ├── Monitor de mutações pendentes (filaLista - L1699)
  │     └── Sincronizar fila agora (sincronizarFila - L1700 / OfflineService.gs)
  │
  ├── 7. Agenda de Inspeções (#agendaPanelS19 - index.html L1480-L1512)
  │     ├── Resumo de KPIs e rotinas (agendaKpisS19 - L1489)
  │     └── Modal de reagendamento (formReagendarS191 - L1431)
  │
  ├── 8. Alertas Operacionais (#alertasPanelS21 - index.html L1448-L1477)
  │     └── Gestão de alertas por nível, status e responsável (alertasListaS21 - L1477)
  │
  └── 9. Hub de Administração (#adminPanelS14 - index.html L398-L810)
        ├── Usuários (#adminUsuariosS14 - L420 / Code.gs)
        ├── Perfis e permissões (#adminPerfisS14 - L427 / Code.gs)
        ├── Auditoria (#adminAuditoriaS15 - L430 / Code.gs)
        ├── Backup e integridade (#adminBackupS16 - L446 / BackupService.gs)
        ├── Saúde operacional (#adminSaudeS17 - L455 / SetupService.gs)
        ├── Inventário (#adminInventarioS18 - L508 / Code.gs)
        ├── Planos preventivos (#adminPlanosS20 - L514 / Code.gs)
        ├── Comunicação (#adminComunicacaoS22 - L523 / Escalamento / Automóveis)
        └── Cartografia 2025 (#adminCartografiaS25 - L556 / Cartografia2025Service.gs)
              ├── Governança Cartográfica & Quality Ring (#cartoQualidadeS252 - L574)
              ├── Calibração Afim por Pares de Pontos (#abrirCalibracaoAdminS25 - L626)
              ├── Áreas Especiais Nível 1 & Nível 3 (#abrirAreasN1AdminS25 - L637, #abrirEstacionamentoAdminS25 - L638)
              ├── Rascunhos Cartográficos (#novoRascunhoS255 - L583 / cartoPublicacaoPanelS255 - L720)
              ├── Snapshots Cartográficos (#snapshotCartografiaS253 - L672 / cartoHistoricoS253 - L687)
              ├── Restauração Controlada / Rollback (#restaurarCartografiaPanelS254 - L733)
              └── Publicação Cartográfica Oficial (#cartoPublicacaoAtualS255 - L586 / Cartografia2025Service.gs)
```

---

## 2. Tabela Comparativa de Comportamento: Legado (ZIP Oficial) vs. Nova Plataforma (React Native / K3s)

| Módulo / Requisito | Comportamento Legado (Apps Script em `sinalizacao_mall_s26_6.zip`) | Comportamento Alvo da Nova Plataforma (React Native / K3s) |
| :--- | :--- | :--- |
| **Banco de Dados** | Planilha Google Sheets (`Mapa - Sinalização do Mall.xlsx`) via Apps Script (`Code.gs`). | PostgreSQL 16 + PostGIS 3.4 com migração relacional completa. |
| **Fotos & Mídias** | Upload via navegador gravando no Google Drive (`styles.html`, `scripts.html`). | Cluster de objetos MinIO S3 com hash SHA256 e Presigned Upload URLs. |
| **Funcionamento Offline** | IndexedDB / LocalStorage gerenciado via `OfflineService.gs` e `scripts.html`. | Engine Outbox nativa no React Native alimentando SQLite local. |
| **Relatórios Executivos** | Geração automática de relatórios em **Google Apresentações / Google Slides** via `RelatorioSlidesService.gs`. | Painel KPI Web com exportador CSV/PDF integrado. |
| **Calibração de Níveis** | Cálculo de matriz de **transformação afim por pares de pontos de controle equivalentes** (`Cartografia2025Service.gs`). | Ferramenta interativa com canvas de ajuste de projeção afim. |
| **Delimitação de Áreas N1/N3** | Mapeamento de áreas especiais: Hotel, CDM, Áreas Externas (Nível 1) e Setor Vermelho / Estacionamento (Nível 3). | Editor de polígonos GeoJSON gravado diretamente na camada PostGIS. |
| **Publicação Cartográfica** | Promoção de rascunhos salvos nas abas da planilha do Google Sheets (`Cartografia2025Service.gs`). | Commit transacional no PostGIS com notificação de sync delta para os dispositivos. |
