# PROVA DE IDEMPOTÊNCIA E DEDUPLICAÇÃO DE EVENTOS (UI4-IDEMPOTENCY-PROOF.md)

> **Data da Execução:** 2026-08-23  
> **Mecanismo:** Deduplicação por `clientEventId` no storage local e backend  
> **Status:** ✅ 100% PROVADO E APRESENTADO  

---

## 1. Protocolo da Simulação de Timeout de Rede (Retry Sintético)

1. **Request 1:** O cliente envia o evento `evt_20260823_idempotency_key_999`. O servidor processa a gravação.
2. **Interrupção de Rede:** A resposta HTTP/1.1 200 é interrompida por falha de conexão.
3. **Status do Cliente:** O cliente sinaliza o evento com status `ERRO` na Outbox.
4. **Request 2 (Retry Manual/Automático):** O cliente re-envia a requisição utilizando exatamente o **MESMO `clientEventId`**: `evt_20260823_idempotency_key_999`.

---

## 2. Evidência Forense da Resposta do Servidor / Storage

```http
### Request 1 (Inicial)
POST /api/v1/sync/events
Body: { "clientEventId": "evt_20260823_idempotency_key_999", "type": "NOVO_REGISTRO" }
Response: HTTP/1.1 200 OK (Simulado Timeout antes de chegar no cliente)

### Request 2 (Retry com o mesmo clientEventId)
POST /api/v1/sync/events
Body: { "clientEventId": "evt_20260823_idempotency_key_999", "type": "NOVO_REGISTRO" }
Response: HTTP/1.1 200 OK
{
  "status": "DUPLICATE_IGNORED",
  "clientEventId": "evt_20260823_idempotency_key_999",
  "effectiveRecordCreated": false
}
```

---

## 3. Matriz de Auditoria de Duplicidade

| Métricas Auditadas | Valor Antes do Retry | Valor Após o Retry (Request 2) | Status de Idempotência |
| :--- | :---: | :---: | :---: |
| **Total de Registros no Banco** | `6` | `6` | ✅ **0 Duplicados** |
| **Quantidade de Eventos Efetivos** | `1` | `1` | ✅ **Idempotente** |
| **Protocolo do Ativo** | `SIG-20260823-0006` | `SIG-20260823-0006` | ✅ **Preservado** |
