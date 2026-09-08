# TESTE DE CADASTRO E EDIÇÃO DE SINALIZAÇÕES (UI3-CRUD-TEST.md)

> **Data da Execução:** 2026-08-23  
> **Escopo:** Fluxo completo de Novo Registro, Cadastro e Edição (UI-3)  
> **Resultado:** 100% APROVADO  

## 1. Teste de Cadastro Completo (Novo Registro)

| Etapa do Fluxo | Ação Executada | Resultado Esperado | Status |
| :--- | :--- | :--- | :---: |
| **1. Modo Posicionamento** | Menu -> Novo registro (`#novo`) | Entra no modo crosshair com marcador provisório `#draftLayer` | ✅ PASS |
| **2. Seleção de Ponto** | Clique na planta no Ponto A (X: 35.0%, Y: 45.0%) | Marcador provisório posicionado em A | ✅ PASS |
| **3. Confirmação** | Clique em `#confirmarPonto` no `#localCard` | Abre `#formPanel` no modo `NOVO` com coordenadas confirmadas | ✅ PASS |
| **4. Preenchimento** | Preenchimento dos campos obrigatórios | Valida título, tipo, descrição, estado e responsável | ✅ PASS |
| **5. Salvar** | Clique em `#salvar` | Gera protocolo único, fecha formulário, cria o novo pin | ✅ PASS |
| **6. Exibição** | Abertura do `#sinalizacaoMapaCard` | Card exibe os dados salvos e pin azul aparece no mapa | ✅ PASS |

## 2. Teste de Edição de Ativo Existente

| Validação de Edição | Ativo Antes da Edição | Ativo Após a Edição | Status |
| :--- | :--- | :--- | :---: |
| **ID do Registro** | `1` | `1` (Preservado) | ✅ PASS |
| **Protocolo do Ativo** | `SIG-20260814-0001` | `SIG-20260814-0001` (Idêntico) | ✅ PASS |
| **Posição no Mapa** | X: 28.0%, Y: 28.0% | X: 28.0%, Y: 28.0% (Preservada) | ✅ PASS |
| **Título do Ativo** | "Placa informativa" | "Placa Direcional Editada — Auditada UI-3" | ✅ PASS (Atualizado) |
| **Contagem de Ativos** | 5 ativos | 5 ativos (Nenhum ativo duplicado) | ✅ PASS |
