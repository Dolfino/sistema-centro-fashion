# TESTE DE INTERRUPÇÃO E RETOMADA DE SINCRONIZAÇÃO (UI4-SYNC-INTERRUPTION-TEST.md)

> **Data da Execução:** 2026-08-23  
> **Escopo:** UI-4.1 — Interrupção de rede com múltiplos itens na Outbox  
> **Status:** ✅ 100% APROVADO  

---

## 1. Sequência da Sincronização Interrompida

- **Outbox Inicial (3 Eventos):**
  - Evento 1: `evt_101` (`NOVO_REGISTRO`)
  - Evento 2: `evt_102` (`EDICAO_REGISTRO`)
  - Evento 3: `evt_103` (`NOVO_REGISTRO`)

1. **Início da Sincronização:** `evt_101` é processado e atualizado para `CONCLUIDO`.
2. **Queda de Rede Durante `evt_102`:** A conexão cai abruptamente. `evt_102` assume o status `ERRO` e `evt_103` permanece `PENDENTE`.

---

## 2. Validação dos Estados Após Interrupção

| Idempotency Key (`clientEventId`) | Estado Antes da Queda | Estado Durante a Queda | Estado Após Reconectar | Comportamento de Retomada |
| :--- | :--- | :--- | :--- | :---: |
| **`evt_101`** | `PENDENTE` | `CONCLUIDO` | `CONCLUIDO` | **Não é re-enviado** |
| **`evt_102`** | `PENDENTE` | `ERRO` | `CONCLUIDO` | **Retomado e sincronizado** |
| **`evt_103`** | `PENDENTE` | `PENDENTE` | `CONCLUIDO` | **Retomado e sincronizado** |

---

## 3. Conclusão da Resiliência de Fila

- NENHUM item concluído voltou para pendente.
- NENHUM item pendente desapareceu ou foi corrompido.
- Ao reconectar, a fila drenou exatamente os itens restantes até atingir **0 pendentes**.
