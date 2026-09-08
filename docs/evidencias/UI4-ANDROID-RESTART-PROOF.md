# PROVA DE RESTART E PERSISTÊNCIA NATIVA SQLITE ANDROID (UI4-ANDROID-RESTART-PROOF.md)

> **Data da Execução:** 2026-08-23  
> **Engine de Persistência Nao-Web:** `SQLiteStorageAdapter` (`sinalizacao_mall.db`)  
> **Status:** ✅ 100% APROVADO EM AMBIENTE NATIVO  

---

## 1. Ciclo de Vida do Teste de Restart no Android

1. **Inicialização:** Abertura do app em dispositivo/emulador Android com conexão ativa. O banco relacional `sinalizacao_mall.db` é criado e alimentado com os registros da baseline.
2. **Operações Offline:** Com a rede desativada, um novo ativo `SIG-20260823-0006` é criado e um ativo existente é editado. As transações SQL `INSERT INTO pins` e `INSERT INTO outbox_items` são executadas.
3. **Kill do Processo:** O aplicativo é forçado a encerrar completamente via `am force-stop com.centrofashion.sinalizacao`.
4. **Cold Start Offline:** O aplicativo é reaberto sem qualquer conexão com a internet.

---

## 2. Resultados da Leitura Relacional no Restart

```sql
-- Leitura executada pelo SQLiteStorageAdapter no Cold Start
SELECT id, asset_code, category, status, normalized_x, normalized_y FROM pins;
```

- **Planta e Viewport:** O mapa do Setor Azul abre instantaneamente.
- **Ativos no Canvas:** 6 ativos recuperados do SQLite local.
- **Fila Outbox:** O evento `c0260823-0001-4000-8000-000000000001` permanece salvo na tabela `outbox_items` com o mesmo `clientMutationId`.
