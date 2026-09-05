# PROVA DETERMINÍSTICA DE EDIÇÃO DE ATIVO (UI3-EDIT-PROOF.md)

> **Data da Execução:** 2026-08-23  
> **Escopo:** UI-3.1 — Validação forense da edição do ativo `SIG-20260814-0001`  
> **Status:** ✅ 100% APROVADO  

---

## 1. Auditoria de Paridade Antes e Depois da Edição

```yaml
BEFORE:
  id: "1"
  protocol: "SIG-20260814-0001"
  title: "Placa informativa"
  x: 0.28
  y: 0.28
  count: 5

AFTER:
  id: "1"
  protocol: "SIG-20260814-0001"
  title: "Placa Direcional Editada — Auditada UI-3"
  x: 0.28
  y: 0.28
  count: 5
```

---

## 2. Resultados da Validação de Integridade

| Critério de Auditoria | Valor Antes | Valor Depois | Variação Esperada | Status |
| :--- | :--- | :--- | :--- | :---: |
| **ID do Registro** | `1` | `1` | **Idêntico** | ✅ PASS |
| **Protocolo do Ativo** | `SIG-20260814-0001` | `SIG-20260814-0001` | **Idêntico** | ✅ PASS |
| **Título do Ativo (`#sigCardTitulo`)** | `Placa informativa` | `Placa Direcional Editada — Auditada UI-3` | **Atualizado com Sucesso** | ✅ PASS |
| **Coordenada X (Normalizada)** | `0.28` | `0.28` | **Preservada (Sem Deslocamento)** | ✅ PASS |
| **Coordenada Y (Normalizada)** | `0.28` | `0.28` | **Preservada (Sem Deslocamento)** | ✅ PASS |
| **Total de Ativos no Mapa** | `5` | `5` | **Idêntico (Sem Duplicação)** | ✅ PASS |

---

## 3. Teste de Re-Abertura por Clique Direto no Pin 1

1. **Fechamento do Card:** Clique no botão `×` (`#btnFecharSigCard`) remove o card da tela (`Card Closed = True`).
2. **Re-Seleção Direta:** Clique sintético no elemento `#pin-marker-1` sobre o viewport cartográfico.
3. **Resultado:** O card re-abre exibindo o título **`Placa Direcional Editada — Auditada UI-3`**.
4. **Conclusão:** O título editado foi alterado no estado do ativo (`pinsList`) e não apenas no formulário temporário.
