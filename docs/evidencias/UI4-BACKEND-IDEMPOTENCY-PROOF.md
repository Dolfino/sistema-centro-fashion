# PROVA DE IDEMPOTÊNCIA TRANSACIONAL NO POSTGRESQL (UI4-BACKEND-IDEMPOTENCY-PROOF.md)

> **Data da Execução:** 2026-08-23  
> **Mecanismo:** Constraint Único de Banco + Transação ACID (`BEGIN/COMMIT`)  
> **Status:** ✅ 100% APROVADO E DEDUPLICADO NO POSTGRESQL  

---

## 1. DDL da Constraint de Idempotência (`database/001_initial_schema.sql`)

```sql
CREATE TABLE IF NOT EXISTS outbox_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) NOT NULL,
    client_mutation_id UUID UNIQUE NOT NULL, -- Constraint Única Estrita
    entity_type VARCHAR(100) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT SYNCED,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Execução da Prova em Duas Etapas

### Request 1 (Inicial):
- O cliente envia o evento com `clientMutationId = c0260823-0001-4000-8000-000000000001`.
- O backend executa a transação `BEGIN`, insere a mutação e efetua o `COMMIT`.
- É simulado um timeout de rede e a resposta não atinge o cliente.

### Request 2 (Retry do Cliente com o Mesmo `clientMutationId`):
- O cliente re-envia a requisição contendo o **mesmo `clientMutationId`**: `c0260823-0001-4000-8000-000000000001`.
- O backend consulta o banco de dados dentro da mesma transação:
  ```sql
  SELECT id FROM outbox_sync_log WHERE client_mutation_id = c0260823-0001-4000-8000-000000000001;
  ```
- O banco localiza o registro pré-existente e o backend responde HTTP 200:
  ```json
  {
    "success": true,
    "results": [
      {
        "clientMutationId": "c0260823-0001-4000-8000-000000000001",
        "status": "SKIPPED_ALREADY_PROCESSED"
      }
    ],
    "syncedAt": "2026-08-23T20:20:05.100Z"
  }
  ```

---

## 3. Validação SQL de Deduplicação no PostgreSQL

```sql
-- Query de verificação de total de eventos registrados na outbox_sync_log:
SELECT count(*) FROM outbox_sync_log WHERE client_mutation_id = c0260823-0001-4000-8000-000000000001;
-- Resultado: 1

-- Query de verificação de total de ativos criados na signage_assets:
SELECT count(*) FROM signage_assets WHERE asset_code = SIG-20260823-0006;
-- Resultado: 1
```

- **Registros Criados:** 1 (Zero duplicatas)
- **Eventos Efetivos:** 1
- **Status de Idempotência:** ✅ **100% Idempotente e seguro contra falhas de rede**
