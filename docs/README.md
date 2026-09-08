# Documentação — Sistema Centro Fashion

## Documentos ativos

| Documento | Descrição |
| :--- | :--- |
| [`ARQUITETURA.md`](ARQUITETURA.md) | Arquitetura real do sistema (frontend, backend, storage, sync, infra) — fonte de verdade do código atual |
| [`evidencias/`](evidencias/) | Evidências históricas de execução (gates UI-3/UI-4/UI-49, paridade legado→novo, inventário de telas) |

## Histórico e documentos defasados

Os documentos em `evidencias/` descrevem o estado do projeto em 2026-08/09 e **não refletem necessariamente o código atual**. Atenção especial:

- `evidencias/PARIDADE_LEGADO_NOVO_SUMMARY.md` cita rotas `app/(tabs)/inspecoes.tsx` e `dashboard.tsx` que **não existem mais** — o app foi consolidado em shell único (`app/index.tsx` + hooks em `src/hooks/`).
- `evidencias/UI4-ANDROID-SQLITE-*.log` descrevem tabelas criadas por builds antigos; a persistência SQLite real foi implementada na **Fase 1** (commits `f550b91`+).
- A sincronização descrita como "100% offline-first" nesses documentos só foi **implementada de verdade na Fase 2** (commit `7a7231b`).

## Convenções

- Evidências operacionais (logs de build, provas de execução) ficam em `evidencias/logs/` e **não são versionadas** (`.gitignore` `*.log`).
- Screenshots de prova ficam em `evidencias/screenshots/`.
- Documentação de arquitetura deve ser atualizada junto com mudanças estruturais de código.
