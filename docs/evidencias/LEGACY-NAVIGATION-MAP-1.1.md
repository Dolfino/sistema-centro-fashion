# MAPA DE NAVEGAÇÃO COMPLETO — SINALIZAÇÃO DO MALL (LEGADO 1.1)

> **Diretriz de Fidelidade:** Este mapa reflete exclusivamente o fluxo de navegação contextual validado da aplicação legada **Sinalização do Mall** (HTML5 / Google Apps Script), separando os comportamentos do legado dos comportamentos-alvo da nova plataforma React Native / Expo.

---

## 1. Arquitetura de Navegação do Legado (Single-Page Canvas + Dialogs)

```
Mapa Principal (Viewport Cartográfico - index.html L152-L177)
  ├── 1. Novo registro de sinalização
  │     ├── Modo de seleção de ponto no mapa (crosshair / marcador provisório)
  │     ├── Confirmação de posição (#mapaInspecaoCard - index.html L163-L177)
  │     └── Formulário de cadastro (#modalForm / #modalOcorrencia - index.html L584-L628)
  │
  ├── 2. Menu Contextual (Toolbar - index.html L18-L46)
  │     ├── Novo registro (#btnNova - L22)
  │     ├── Centralizar (#btnReset - L23)
  │     ├── Camadas (#btnCamadas - L25)
  │     ├── Atualizar offline (#btnRecarregar - L15)
  │     ├── Fila de sincronização (#btnFila - L14)
  │     ├── Central (#btnLista / AtendimentoService.gs)
  │     ├── Agenda (ChecklistService.gs)
  │     ├── Alertas (NotificacaoService.gs)
  │     ├── Dashboard / Painel Gerencial (#btnDashboard - L41)
  │     ├── Relatórios (RelatorioService.gs / Google Apresentações)
  │     ├── Calibrar níveis (PlantaService.gs - Pares de pontos & Transformação Afim)
  │     ├── Delimitar estacionamento (CorredorAdminServiceMVP12.gs - Setor Vermelho / Estacionamento no Nível 3)
  │     ├── Delimitar áreas do Nível 1 (Hotel, Central de Distribuição, Área Externa, Laterais Azul/Verde, Frente, Hotel/CDM)
  │     └── Administração (#btnAdmin - L44 / AdminService.gs)
  │
  ├── 3. Camadas do Mapa (#menuCamadas - index.html L26-L40)
  │     ├── Toggle Referências (#toggleReferencias - L28)
  │     ├── Toggle Cruzamentos (#toggleCruzamentos - L29)
  │     ├── Toggle Corredores (#toggleCorredores - L30)
  │     └── Gestão cartográfica (#btnCentralCartografica - L34)
  │
  ├── 4. Interação com Sinalização (Clique no Pin do Mapa)
  │     └── Card da Sinalização (#ocorrenciaMapaCard - index.html L178-L194)
  │           ├── Fotos / Galeria (#fotoPreviews - L626 / FotoService.gs)
  │           ├── Histórico (HistoricoService.gs)
  │           ├── Pendências (ChecklistService.gs)
  │           ├── Edição cadastral (Formulário pré-preenchido)
  │           ├── Nova inspeção (#modalChecklist - L789 / checklists.html)
  │           └── Ciclo de vida (Code.gs - Alteração de status / Baixa)
  │
  ├── 5. Cache Offline & Atualizações
  │     ├── Baixar / atualizar dados em IndexedDB / LocalStorage
  │     ├── Verificar integridade do cache local
  │     └── Reparar cache (purga e reconstituição)
  │
  ├── 6. Fila de Sincronização (#modalFila - index.html L798-L805)
  │     ├── Inspeção da lista de mutações pendentes
  │     ├── Status das fotos pendentes de upload (Google Drive no legado)
  │     └── Forçar sincronização imediata
  │
  └── 7. Central de Administração (#modalAdmin - index.html L780-L787)
        ├── Usuários (UsuarioService.gs)
        ├── Perfis e permissões (AuthService.gs / SecurityService.gs)
        ├── Auditoria (LogService.gs)
        ├── Backup e integridade (BackupService.gs)
        ├── Saúde operacional (DiagnosticoMVP12.gs)
        ├── Inventário (MapaRepository.gs)
        ├── Planos preventivos (ChecklistService.gs)
        ├── Comunicação (NotificacaoService.gs)
        └── Cartografia (#modalCentralCartografica - index.html L632-L760)
              ├── Governança cartográfica (Saúde Ring Score - L726)
              ├── Histórico cartográfico / Snapshots (MVP13_1_2_Diagnostico_Backend.gs)
              ├── Restauração controlada (Rollback de versão)
              ├── Rascunho cartográfico (#marcadorProvisorio - L174)
              ├── Enviar para validação (MVP13_2_ValidacaoAssistida_Backend.gs)
              └── Publicação cartográfica (Gravação em abas de planilha no legado → PostgreSQL/K3s no alvo)
```

---

## 2. Separação Estrita de Comportamento: Legado vs. Nova Plataforma

| Funcionalidade | Comportamento no Sistema Legado (Apps Script) | Comportamento Alvo na Nova Plataforma (React Native / K3s) |
| :--- | :--- | :--- |
| **Armazenamento de Dados** | Planilhas do Google Sheets (`Mapa - Sinalização do Mall.xlsx`) via Google Apps Script. | Banco relacional PostgreSQL 16 + PostGIS 3.4 com migração dos 58+ ativos. |
| **Armazenamento de Fotos** | Pastas do Google Drive via `DriveService.gs`. | Cluster de objetos MinIO S3 com hash SHA256 e Presigned Upload URLs. |
| **Cache & Offline** | IndexedDB / LocalStorage no navegador web para HTML e JSON. | Outbox Sync Engine nativo com SQLite local e sincronização assíncrona delta. |
| **Relatórios Executivos** | Geração automática de relatórios em **Google Apresentações / Google Slides** (`RelatorioService.gs`). | Painel Web interativo com exportação em CSV/PDF de inventários. |
| **Calibração de Níveis** | Matriz de transformação afim baseada em pares de pontos de controle equivalentes (`PlantaService.gs`). | Canvas vetorial interativo com ajuste continuo de parâmetros de projeção. |
| **Publicação Cartográfica** | Gravação de geometrias e nós nas abas cartográficas da planilha do Google Sheets. | Commit transacional no PostgreSQL PostGIS com invalidação de cache via API. |
