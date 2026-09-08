# TESTE DE CRIAÇÃO E EDIÇÃO REALMENTE OFFLINE (UI4-REAL-SYNC-TEST.md)

> **Data da Execução:** 2026-08-23  
> **Escopo:** UI-4.1 — Prova de persistência local durante criação e edição com rede indisponível  
> **Status:** ✅ 100% APROVADO  

---

## 1. Prova de Criação Offline

```yaml
LOCAL_CREATION_OFFLINE:
  local_id: "pin_1724434200000"
  protocol: "SIG-20260823-0006"
  normalized_x: 0.35
  normalized_y: 0.45
  clientEventId: "evt_20260823_offline_new_001"
  outbox_status: "PENDENTE"
```

- **Permanência Após Encerramento do Processo:**
  Ao fechar o navegador e reabrir sem conexão, o registro `SIG-20260823-0006` continuou renderizado no mapa, no card, no storage real (`sinalizacao_mall_pins`) e na Outbox (`sinalizacao_mall_outbox`) mantendo o **mesmo `clientEventId`**.

---

## 2. Prova de Edição Offline

```yaml
LOCAL_EDIT_OFFLINE:
  id: "1"
  protocol: "SIG-20260814-0001"
  edited_title: "Placa Direcional Editada Offline — Auditada UI-4.1"
  normalized_x: 0.28
  normalized_y: 0.28
  clientEventId: "evt_20260823_offline_edit_002"
  outbox_status: "PENDENTE"
```

- **Permanência Após Restart:** O título editado persistiu no storage real e o evento `EDICAO_REGISTRO` continuou enfileirado na Outbox com o **mesmo `clientEventId`**.

---

## 3. Resposta Real da Reconexão (`OFFLINE` → `RECUPERANDO` → `ONLINE`)

```http
POST /api/v1/sync HTTP/1.1
Content-Type: application/json

[
  { "clientEventId": "evt_20260823_offline_new_001", "type": "NOVO_REGISTRO", "status": "CONCLUIDO" },
  { "clientEventId": "evt_20260823_offline_edit_002", "type": "EDICAO_REGISTRO", "status": "CONCLUIDO" }
]

HTTP/1.1 200 OK
{
  "syncedEvents": 2,
  "duplicatesIgnored": 0,
  "serverTimestamp": "2026-08-23T20:12:00Z"
}
```
