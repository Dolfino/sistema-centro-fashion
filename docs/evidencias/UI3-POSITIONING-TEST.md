# TESTE DE TRANSFORMADA CARTOGRÁFICA E POSICIONAMENTO (UI3-POSITIONING-TEST.md)

> **Data da Execução:** 2026-08-23  
> **Motor de Transformação:** `computeContainTransform(vw, vh, nw, nh)` compartilhada  
> **Resultado:** 100% APROVADO  

## 1. Matriz de Precisão Geométrica (3 Pontos Distintos)

| Ponto de Teste | Pointer Viewport (X, Y) | Coordenada Normalizada (X, Y) | Posição Renderizada Final | Erro de Reprojeção | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Ponto A (Corredor Bezerril)** | `X: 498.9px, Y: 182.0px` | `X: 0.2800, Y: 0.2800` | `X: 498.9px, Y: 182.0px` | `0.00 px` | ✅ PASS |
| **Ponto B (Cruzamento São José)** | `X: 609.2px, Y: 227.5px` | `X: 0.5200, Y: 0.3500` | `X: 609.2px, Y: 227.5px` | `0.00 px` | ✅ PASS |
| **Ponto C (Ambulatório)** | `X: 669.0px, Y: 422.5px` | `X: 0.6500, Y: 0.6500` | `X: 669.0px, Y: 422.5px` | `0.00 px` | ✅ PASS |

## 2. Teste de Rejeição de Letterbox (Fora da Planta)

- **Clique de Teste (Margem Esquerda do Viewport):** Pointer X=50px, Y=50px (offsetX da planta = 370.15px).
- **Cálculo da Coordenada:** X_norm = `-0.6964`, Y_norm = `0.0769`.
- **Validação de Limites (`0 <= X <= 1` e `0 <= Y <= 1`):** `isValid = False`.
- **Resultado:** ✅ **Clique rejeitado com sucesso**. Nenhuma coordenada ou pin criado na área cinza do letterbox.

## 3. Teste de Cancelamento e Reposicionamento

- **Cancelamento:** Clicar em Cancelar no `#localCard` oculta o marcador provisório `#draftLayer` e zera a tentativa sem criar novo ativo no sistema.
- **Reposicionamento:** Ao clicar em outro ponto do mapa antes da confirmação, a coordenada do marcador provisório é atualizada instantaneamente sem duplicar o ativo.
