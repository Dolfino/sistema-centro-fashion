# TESTE DE FILA DE SINCRONIZAÇÃO E OUTBOX (UI4-OUTBOX-TEST.md)

> **Data da Execução:** 2026-08-23  
> **Escopo:** Gate UI-4 — Controle de Outbox, Event IDs, Retry e Idempotência  
> **Status:** ✅ 100% APROVADO  

---

## 1. Matriz de Ciclo de Vida da Outbox (`#filaPanel`)

| Etapa da Fila | Idempotency Key (`clientEventId`) | Status do Item | Tentativas | Ação Executada | Status da Fila |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **1. Item Enfileirado** | `evt_20260823_001` | `PENDENTE` | 0 | Criação offline protegida | 2 itens pendentes |
| **2. Falha de Conexão** | `evt_20260823_002` | `ERRO` | 2 | Exibe "504 Gateway Timeout" | Opção de Retry ativa |
| **3. Execução de Retry** | `evt_20260823_002` | `PROCESSANDO` | 3 | Clique em `#retryItemBtn` | Re-tentativa em andamento |
| **4. Sincronização** | `evt_20260823_001` / `002` | `CONCLUIDO` | 3 | Clique em `#sincronizarFila` | Fila Zerada (0 pendentes) |

---

## 2. Garantias de Idempotência e Zero Duplicidade

- **Idempotency Key:** Cada evento recebe um `clientEventId` imutável (`evt_TIMESTAMP_RANDOM`).
- **Prevenção de Duplicidade:** Re-tentativas de sync enviam a mesma `clientEventId`, garantindo que o backend não crie duplicatas em retries de timeout.
