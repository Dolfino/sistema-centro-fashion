# RELATÓRIO DE DIAGNÓSTICO DE RUNTIME E PROVA DE RENDERIZAÇÃO (RUNTIME-DIAGNOSTIC.md)

> **Data:** 2026-08-23  
> **Escopo:** Gate UI-2.1 — Correção da causa raiz da página branca, prova funcional do DOM e validação automatizada de screenshots.

---

## 1. Diagnóstico Forense da Causa Raiz (Página Branca)

### 🚨 Causa Raiz Identificada
A página branca exibida nos screenshots anteriores **não foi causada por falha de tempo ou falta de montagem da rota**, mas sim por **dois erros fatais de exceção de Javascript (Uncaught TypeErrors)** que quebraram a árvore de renderização do React DOM em tempo de montagem:

1. **`TypeError: Image.resolveAssetSource is not a function`**
   - **Origem:** [`src/components/InteractiveMallMap.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/components/InteractiveMallMap.tsx)
   - **Detalhe:** A chamada a `Image.resolveAssetSource()` foi invocada na exportação Web (`react-native-web`), onde a classe `Image` não expõe a função utilitária nativa do React Native. O React estourou exceção antes de montar o DOM do mapa.
   - **Correção:** Remoção completa do `Image.resolveAssetSource()`, mantendo o componente `<Image source={mapSource} style={styles.floorPlanImage} resizeMode="contain" />` puro.

2. **`TypeError: Failed to set an indexed property [0] on 'CSSStyleDeclaration': Indexed property setter is not supported`**
   - **Origem:** [`src/components/SinalizacaoCard.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/components/SinalizacaoCard.tsx) e [`src/components/InteractiveMallMap.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/src/components/InteractiveMallMap.tsx)
   - **Detalhe:** A tag HTML nativa `<aside style={[styles.card, isMobile && styles.cardMobile]}>` recebeu um array de estilos `[...]` em vez de um objeto JS plano `{...}` ou um componente `<View>`. Ao injetar estilos no DOM, o React DOM iterou sobre os índices inteiros `0, 1, 2` invocando `element.style[0] = ...`, o que é estritamente proibido pela especificação W3C `CSSStyleDeclaration`.
   - **Correção:** Substituição da tag `<aside>` por `<View>`, que trata arrays de estilos no React Native Web nativamente sem gerar `TypeError`.

---

## 2. Validação da Montagem Real do React no DOM

Após as correções, a aplicação foi auditada via Chrome DevTools Protocol (`Runtime.evaluate`):

```json
{
  "errors": [],
  "innerHTMLLength": 10083,
  "hasRoot": true,
  "hasTitle": true,
  "textSnippet": "Sinalização do Mall\nMVP-3.28.1-SINALIZACAO-S26.6.1\nOnline\ndavidsilva.centrofashion • ADMIN\nMapa / visualização\nSetor Azul • Piso 1\n..."
}
```

- **Console Errors:** 0
- **Tamanho do DOM do Body:** 10.083 caracteres
- **Elemento `#root`:** Presente e hidratado
- **Texto "Sinalização do Mall":** Presente e visível no DOM

---

## 3. Engine de Validação Automática de Whiteness (Screenshots Validados)

Conforme a Regra 3 do UI-2.1, nenhuma captura foi aceita por `exit code 0`. Todos os PNGs foram submetidos ao algoritmo de análise percentual de pixels brancos (`RGB > 240, 240, 240`). Qualquer imagem com `whiteness > 98%` é automaticamente rejeitada como `INVALID_SCREENSHOT`.

### Matriz de Validação das Capturas Exigidas

| Arquivo de Captura | Resolução / Alvo | Selector de Espera | Tamanho | % Pixels Brancos | Status de Validação |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`desktop_shell_ui21.png`** | 1920×1080 (Shell) | `"Sinalização do Mall"` | 331,590 bytes | 46.48% | ✅ `VALID_SCREENSHOT` |
| **`notebook_shell_ui21.png`** | 1366×768 (Shell) | `"Sinalização do Mall"` | 209,883 bytes | 29.74% | ✅ `VALID_SCREENSHOT` |
| **`mobile_shell_ui21.png`** | 390×844 (Shell) | `"Sinalização do Mall"` | 160,775 bytes | 49.46% | ✅ `VALID_SCREENSHOT` |
| **`menu_open_ui21.png`** | 1366×768 (Menu) | `#appMenuS22513` | 227,507 bytes | 18.92% | ✅ `VALID_SCREENSHOT` |
| **`camadas_open_ui21.png`** | 1366×768 (Camadas) | `#camadas` | 227,744 bytes | 6.81% | ✅ `VALID_SCREENSHOT` |
| **`card_sinalizacao_ui21.png`** | 1366×768 (Card) | `#sinalizacaoMapaCard` | 235,682 bytes | 36.97% | ✅ `VALID_SCREENSHOT` |

---

## 4. Prova Funcional dos Componentes Contextuais

### A. Controle do Menu (`#appMenuS22513`)
1. **Abertura pelo Botão Menu:** `#appMenuBtnS22513` abre o modal com a lista completa dos 13 itens.
2. **Fechamento pelo Botão `×`:** `#appMenuCloseS22513` remove o menu do DOM.
3. **Fechamento pelo Clique no Backdrop:** `#appMenuBackdropS22513` encerra o menu ao clicar fora.
4. **Fechamento pela Tecla `ESC`:** Tecla `Escape` fecha o popover no Web/Desktop.
5. **Preservação do Mapa:** O zoom, pan e coordenadas do viewport permanecem inalterados.

### B. Controle de Camadas (`#camadas`)
1. **Sinalizações ON:** Exibe 5 pins interativos posicionados sobre a planta do Setor Azul.
2. **Sinalizações OFF:** Oculta 100% dos pins do canvas.
3. **Sinalizações ON (Reativação):** Os mesmos 5 pins retornam para as exatas coordenadas originais.

---

## 5. Resumo das Correções

- **Bugs Encontrados:** 2 exceções fatais no React DOM Web (`Image.resolveAssetSource` e `style array on HTML element`).
- **Bugs Corrigidos:** 2 correções de compatibilidade universal com React Native Web.
- **Evidências:** 6 screenshots visualmente comprovados (`< 50% white`) + relatórios automatizados CDP.
