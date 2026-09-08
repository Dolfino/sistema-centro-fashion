# Arquitetura — Sistema Centro Fashion

> Última atualização: 2026-09-08 (pós-Fases 1–3). Este documento descreve o estado REAL do código.

## Visão geral

Plataforma de sinalização e operação do Mall Centro Fashion, migrada do legado
(Google Sheets + Apps Script, em `legacy_gas_code/`) para React Native/Expo + Node.js/Fastify + PostgreSQL/PostGIS.

## Frontend (Expo SDK 51 / React Native 0.74)

- **Entrada**: `app/index.tsx` (shell único `LegacyMainShellScreen`), rota expo-router `index`.
- **Padrão de UI**: painéis/modal flutuantes controlados por flags — paridade com a baseline legada
  (não usar navegação por rotas para modais; ver `evidencias/SCREEN-INVENTORY-2.2.md`).
- **Componentes**: ~47 modais em `src/components/` (CamadasModal, CentralReferenciasModal, etc.).

### Hooks (Fase 3)

| Hook | Responsabilidade |
| :--- | :--- |
| `src/hooks/useStorageData.ts` | Hidratação + persistência de pins/outbox |
| `src/hooks/useNetworkStatus.ts` | Detector de rede (NetInfo + fallback + polling) |
| `src/hooks/useSyncFlow.ts` | Engine de sync: push/pull, retry, enqueue correlacionado |
| `src/hooks/useModalFlags.ts` | 45 flags de modais/painéis |

### Storage offline (Fase 1)

- `src/storage/StorageFactory.ts` seleciona o adaptador por plataforma:
  - **Web** → `WebStorageAdapter` (localStorage)
  - **Android/iOS** → `SQLiteStorageAdapter` (expo-sqlite, `sinalizacao_mall.db`)
- `src/services/OfflineStorageService.ts` é a fachada assíncrona usada pelo app.
- Schema local: `pins`, `outbox_items`, `outbox_mutations`, `cache_metadata` (com `last_pulled_at`), `processed_events`.
- Seed único em `src/data/seedPins.ts`.

### Sincronização (Fase 2)

- `src/sync/outboxEngine.ts`: fila de mutações **persistida** (sobrevive a restart), retry de FAILED,
  `pullFromServer` com cursor `lastPulledAt`.
- `src/services/apiClient.ts`: fetch com retry/backoff exponencial, timeout e base URL por ambiente
  (prod `https://api-mall.ideiasmkt.com.br/api/v1`, dev web `localhost:3000`, emulador Android `10.0.2.2:3000`).
- `src/services/deviceId.ts`: device id persistente (async-storage).
- Fluxos de CREATE/UPDATE/DELETE de sinalização, inspeção e mídia registram mutações com
  `clientEventId` UUID correlacionado à fila visível (FilaOutboxModal).

## Backend (Fastify 4)

- `backend/src/index.ts`: CORS liberado (`*`), rotas:
  - `GET /health`
  - `GET/POST /api/v1/sync/pull|push` — delta + outbox idempotente (`outbox_sync_log`),
    push trata CREATE/UPDATE/DELETE (soft delete) de signage e inspeções
  - `GET /api/v1/signage` e `/signage/nearby` — queries geo defensivas (COALESCE geometry→lat/lng)
  - `POST /api/v1/media/presigned-upload-url` — MinIO S3
- **Config**: `DATABASE_URL` obrigatória (sem fallback hardcoded desde o commit de segurança `364f13e`).
  Template em `backend/.env.example`; `.env` é ignorado pelo Git.
- Migração pendente na VPS: `signage_positions.geometry` (ver `database/001_initial_schema.sql`, bloco DO).

## Banco de dados (PostgreSQL 16 + PostGIS 3.4)

- `database/001_initial_schema.sql`: schema + migrações idempotentes (DO blocks).
- `database/002_seed_data.sql`: dados legados.
- Tabelas-chave: `signage_assets`, `signage_positions` (geometry Point 4326 + GIST),
  `inspections`, `media_assets`, `outbox_sync_log` (idempotência do push).

## Infraestrutura e CI/CD

- `.github/workflows/build-and-push.yml`:
  1. `secret-scan` (gitleaks, histórico completo)
  2. `quality` — lint (erros bloqueiam), tsc frontend, jest, tsc backend
  3. `build-and-push` — export web + imagens GHCR (web nginx / API node)
  4. `android-apk` — `expo prebuild` + `assembleRelease`, artifact do APK
- Web: nginx com SPA fallback, gzip, cache imutável `/_expo/`, proxy `/api/` → serviço API (K3s).

## Qualidade

- **Lint**: ESLint via `expo lint` (config `expo` em `.eslintrc.js`); 0 erros, warnings tolerados.
- **Testes**: jest-expo (`npm test`) — suíte do `OutboxSyncEngine` em `src/sync/__tests__/`.
- **Typecheck**: `npx tsc --noEmit` (frontend) e `npm run build` (backend) obrigatórios.

## Requisitos de ambiente local

- Node 20, npm.
- **Android build local**: requer JDK completo (com `jlink`). O JRE do sistema não basta —
  use `~/jdk/jdk-21.0.12.1+1` (Temurin) e rode `./gradlew ... -Dorg.gradle.java.home=/home/dns/jdk/jdk-21.0.12.1+1`
  ou instale `openjdk-21-jdk` no sistema.
- Emulador sem rota NAT (10.0.2.2 inacessível): usar `adb reverse tcp:8081 tcp:8081` e apontar
  `debug_http_host` para `127.0.0.1:8081`.
- Backend local de teste: `docker run postgis/postgis:16-3.4` + `DATABASE_URL=postgresql://postgres:test@localhost:5433/platform npm run dev`.

## Pendências conhecidas

- Rotação da credencial do banco na VPS (senha antiga exposta no histórico do GitHub — ver commit `364f13e`).
- `npm audit`: 44 vulnerabilidades reportadas nas dependências (triagem pendente; não aplicar `--force` sem análise).
- ~37 warnings de lint (unused vars de scaffolds de features e exhaustive-deps).
- Migração `signage_positions.geometry` no banco da VPS ao subir o backend novo.
