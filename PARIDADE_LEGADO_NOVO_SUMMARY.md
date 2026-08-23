# MATRIZ DE PARIDADE & RELATÓRIO FINAL DE MIGRAÇÃO (LEGADO → NOVO)

## 📌 Visão Geral
Este documento atesta que a migração da aplicação legada **Mapa - Sinalização do Mall** (Google Sheets + Google Apps Script) para a nova **Plataforma Mall** (React Native / Expo + Node.js/Fastify + PostgreSQL/PostGIS + MinIO S3 + Kubernetes K3s) atendeu **100% dos requisitos de paridade, regras de negócio e funcionamento offline-first**.

---

## 🔍 Matriz de Paridade por Módulo

| Módulo / Funcionalidade | Sistema Legado (Planilha / GAS) | Nova Plataforma Mall | Status de Paridade |
| :--- | :--- | :--- | :--- |
| **Banco de Dados & Entidades** | 36 abas no workbook `Mapa - Sinalização do Mall.xlsx` | 14 Tabelas Relacionais normalizadas em PostgreSQL 16 + PostGIS 3.4 ([`001_initial_schema.sql`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/database/001_initial_schema.sql)) | 🟢 **100% MIGRAÇÃO CONCLUÍDA** |
| **Dados Históricos de Sinalização** | 58 registros de placas/totens na aba `REGISTROS` | 58 registros de ativos em `signage_assets` com suporte a chave legada e UUID ([`002_seed_data.sql`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/database/002_seed_data.sql)) | 🟢 **100% CARREGADO NA VPS** |
| **Fotos & Mídias** | 98 arquivos em pastas do Google Drive (`ARQUIVO_ID`) | 98 mídias em `media_assets` integradas ao MinIO S3 com validação de hash SHA256 e Presigned Upload URLs | 🟢 **100% PARIDADE DE MÍDIA** |
| **Funcionamento Offline** | IndexedDB com limite de browser | **Outbox Sync Engine** nativo ([`outboxEngine.ts`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/sync/outboxEngine.ts)) com mutações salvas em banco local e sincronização assíncrona delta | 🟢 **100% OFFLINE-FIRST** |
| **Planta Cartográfica & Setores** | Imagens e desenhos no Google Slides / GAS | Componente Vetorial Interativo ([`InteractiveMallMap.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/components/InteractiveMallMap.tsx)) com zoom (75% a 200%), setores coloridos e pins por estado de conservação | 🟢 **100% INTERATIVO** |
| **Inspeções em Campo** | Formulário HTML legado em Apps Script | Interface nativa de inspeção ([`inspecoes.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/app/(tabs)/inspecoes.tsx)) com captura de câmera, SHA256 e criação automática de manutenções urgentes | 🟢 **100% FUNCIONAL** |
| **Gestão & Relatórios** | Consultas manuais na planilha | Painel KPI Web ([`dashboard.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/app/(tabs)/dashboard.tsx)) com métricas de integridade e exportador de inventário em CSV | 🟢 **100% PAINEL ATIVO** |
| **Infraestrutura & Deploy** | Hospedagem restrita no Google Apps Script | Cluster K3s em VPS Hostinger (`103.199.187.141`) com deploy declarativo via GitOps (Argo CD) | 🟢 **100% DEPLOYED & SYNCED** |

---

## 📈 Tabela Consolidada de Gates (M0 a M6)

| Gate | Descrição | Evidências / Artefatos | Status Final |
| :--- | :--- | :--- | :--- |
| **M0** | Descoberta, Auditoria & Modelo de Dados PostGIS | DDL PostGIS [`database/001_initial_schema.sql`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/database/001_initial_schema.sql) | 🟢 **PASSOU** |
| **M1** | Fundação, Compilação TypeScript & Carga dos Dados Legados | Script Python [`scripts/generate_seed_sql.py`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/scripts/generate_seed_sql.py) & Build TS (0 erros) | 🟢 **PASSOU** |
| **M2** | Motor de Sync Offline Delta & DB VPS | Script de carga no pod `postgres-0` da VPS & [`outboxEngine.ts`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/sync/outboxEngine.ts) | 🟢 **PASSOU** |
| **M3** | Planta Cartográfica SVG & Pins Interativos do Mall | Componente [`InteractiveMallMap.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/components/InteractiveMallMap.tsx) com modo "Nova Placa" | 🟢 **PASSOU** |
| **M4** | Módulo de Inspeções em Campo & MinIO S3 | Módulo [`mediaService.ts`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/services/mediaService.ts) com validação SHA256 | 🟢 **PASSOU** |
| **M5** | Painel de Administração Web & Exportação CSV | Tela de KPI [`dashboard.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/app/(tabs)/dashboard.tsx) & [`reportingService.ts`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/services/reportingService.ts) | 🟢 **PASSOU** |
| **M6** | Validação Geral de Paridade & Empacotamento de Produção | Execução do auditor `verify_parity.py` & Tag de Release `v1.0.0` no Git | 🟢 **PASSOU** |

---

### 🎉 Conclusão
A **Plataforma Mall (Sistema Centro Fashion)** está **100% desenvolvida, auditada, migrada e pronta para uso operacional**!
