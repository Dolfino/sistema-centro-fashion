# MAPA DE NAVEGAÇÃO COMPLETO — SINALIZAÇÃO DO MALL (LEGADO)

> **Regra de Ouro:** Todas as superfícies operacionais, administrativas e cartográficas navegam como **paineis contextuais, modais flutuantes e gavetas sobre a Shell Principal do Mapa**, sem destruir ou desmontar a viewport do mapa central.

---

## 1. Visão Geral da Arquitetura de Navegação

```
Mapa Principal (Shell Base / Viewport Cartográfica)
  ├── 1. Novo registro de sinalização
  │     ├── Seleção de ponto no mapa (Crosshair / Drag Pin)
  │     ├── Confirmação de posição (Card Flutuante Inferior)
  │     └── Formulário de cadastro de sinalização (Modal Overlay)
  │
  ├── 2. Menu Contextual (Painel Flutuante)
  │     ├── Novo registro
  │     ├── Camadas
  │     ├── Atualizar offline
  │     ├── Fila
  │     ├── Central
  │     ├── Agenda
  │     ├── Alertas
  │     ├── Dashboard
  │     ├── Relatórios
  │     ├── Calibrar níveis
  │     ├── Delimitar estacionamento
  │     ├── Delimitar áreas Nível 1
  │     └── Administração
  │
  ├── 3. Camadas (Painel Flutuante do Mapa)
  │     ├── Toggle Referências
  │     ├── Toggle Cruzamentos
  │     ├── Toggle Corredores
  │     └── Gestão cartográfica (Atalho Admin)
  │
  ├── 4. Interação com Sinalização (Clique no Pin do Mapa)
  │     └── Card da Sinalização (Popover / Bottom Sheet)
  │           ├── Ver fotos / Galeria (Lightbox Modal)
  │           ├── Histórico de alterações (Timeline)
  │           ├── Pendências operacionais (Lista / Ações)
  │           ├── Edição cadastral (Modal Form)
  │           ├── Nova inspeção em campo (Modal Checklist)
  │           └── Ciclo de vida (Modal Governança / Baixa / Exclusão)
  │
  ├── 5. Atualizar Offline & Cache
  │     ├── Sincronizar catálogo e plantas SVG
  │     ├── Verificar integridade do cache
  │     └── Reparar cache local
  │
  ├── 6. Fila de Sincronização (Outbox Monitor)
  │     ├── Inspeção visual da fila de mutações
  │     ├── Status do envio de fotos (MinIO S3)
  │     └── Forçar sincronização agora
  │
  ├── 7. Central Operacional
  │     └── Gestão de solicitações de sinalização dos setores
  │
  ├── 8. Agenda
  │     └── Cronograma de inspeções periódicas programadas
  │
  ├── 9. Alertas
  │     └── Notificações de expiração de validade e avarias
  │
  ├── 10. Dashboard (Painel Gerencial)
  │     ├── KPIs de integridade das sinalizações
  │     ├── Gráficos de estado de conservação por setor
  │     └── Relatório sintético de inspeções
  │
  ├── 11. Relatórios
  │     └── Exportação do inventário completo (CSV / PDF)
  │
  ├── 12. Calibrar Níveis (Ferramenta Cartográfica)
  │     └── Ajuste de escala (pixels por metro) e alinhamento dos Níveis 0 a 3
  │
  ├── 13. Delimitar Estacionamento (Ferramenta Cartográfica)
  │     └── Edição vetorial de polígonos das áreas externas e vagas
  │
  ├── 14. Delimitar Áreas Nível 1 (Ferramenta Cartográfica)
  │     └── Edição vetorial de corredores comerciais e blocos
  │
  └── 15. Administração do Sistema (Modal Wide / Multi-abas)
        ├── Usuários (Cadastro, Perfis, PINs)
        ├── Perfis e permissões (Matriz RBAC)
        ├── Auditoria (Logs de alteração de ativos)
        ├── Backup e integridade (Sanidade DB + MinIO S3)
        ├── Saúde operacional (Métricas de latência e Outbox)
        ├── Inventário completo (Tabela global de sinalizações)
        ├── Planos preventivos (Regras de rotina de campo)
        ├── Comunicação (Avisos para equipe de campo)
        └── Cartografia (Central de Governança Espacial)
              ├── Governança cartográfica (Saúde Ring Score)
              ├── Histórico cartográfico / Snapshots (Versões da Planta)
              ├── Restauração controlada (Rollback de versão)
              ├── Rascunho cartográfico (Modo de edição segura)
              ├── Enviar para validação (Check de consistência)
              └── Publicação cartográfica (Promoção para Produção)
```

---

## 2. Detalhamento dos Subfluxos Chave

### A. Subfluxo: Cadastro de Nova Sinalização
1. Usuário clica em **Novo registro** (Toolbar ou Menu).
2. O cursor muda para modo de marcação espacial no mapa.
3. Ao clicar no local da planta, abre o **Card Flutuante Inferior** com coordenadas calculadas e endereço do setor.
4. Usuário clica em **Confirmar local**.
5. Abre o **Formulário de Cadastro (Modal Overlay)** com 20+ campos (Tipo, Finalidade, Título, Material, Dimensões, Estado de Conservação, Fotos).
6. Usuário clica em **Salvar**.
7. O modal fecha e um novo **Pin de Sinalização** surge instantaneamente no mapa. Se offline, entra na Fila Outbox.

### B. Subfluxo: Nova Inspeção de Sinalização
1. Inspetor clica em um **Pin de Sinalização** ativo no mapa.
2. Abre o **Card da Sinalização**.
3. Clica no botão **Nova inspeção**.
4. Abre o **Modal de Inspeção (Checklist)** com campos de estado de conservação atualizado, notas técnicas e acionamento de câmera nativa.
5. Clica em **Salvar inspeção**.
6. O status de conservação da sinalização é atualizado, a foto é gravada e a mutação é enfileirada no Outbox Engine.

### C. Subfluxo: Governança e Publicação Cartográfica
1. Administrador acessa **Administração → Cartografia** ou **Menu → Delimitar Áreas**.
2. O editor vetorial entra em modo **Rascunho Cartográfico**.
3. Ajustes de coordenadas de corredores, cruzamentos e referências são realizados.
4. O usuário executa **Enviar para validação**, disparando o diagnóstico de consistência cartográfica (Ring Score).
5. Se aprovado, aciona **Publicação Cartográfica**, gerando um novo **Snapshot** no histórico e atualizando a versão oficial da planta no cluster e nos dispositivos offline.
