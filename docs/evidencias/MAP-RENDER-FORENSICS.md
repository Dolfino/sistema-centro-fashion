# MAP-RENDER FORENSICS REPORT (UI-1.4)

> **Objetivo:** Registrar a prova forense definitiva de renderização do layer da planta cartográfica (`SETOR_AZUL.png`), auditando o elemento DOM real, a árvore de opacidade/camadas e os frames nos três breakpoints (Desktop, Notebook e Mobile).

---

## 🔍 Diagnóstico da Causa Raiz

1. **Relação de Carregamento & Event Loop no Web Build:**
   - Em builds estáticos Web gerados pelo Expo Metro (`npx expo export --platform web`), a imagem `SETOR_AZUL.png` (747 KB) é empacotada em `/_expo/static/assets/assets/maps/SETOR_AZUL.61e348cc8b998b237418580fa3ddd7d8.png`.
   - Nas capturas anteriores sem orçamento de tempo virtual (`--virtual-time-budget`), o navegador Headless Chrome realizava a captura instantânea de tela no frame 0, **antes que o motor de renderização da GPU concluísse a decodificação assíncrona da imagem em memória**.
   - Ao definir dimensões explícitas na tag de Image e permitir o tempo de decodificação do browser, a renderização física dos pixels do mapa (ruas, corredores azuis, números de lojas e rótulo "ST. AZUL") passou a ser **100% capturada e confirmada visualmente**.

---

## 📐 Propriedades Forenses Computadas do Elemento DOM (`#mapLayer`)

| Propriedade DOM / CSS | Valor Medido no Notebook (1366×768) | Valor Medido no Mobile (390×844) | Valor Medido no Desktop (1920×1080) |
| :--- | :--- | :--- | :--- |
| **Elemento DOM** | `div#mapLayer > img` (ou `div.r-1p0dtai`) | `div#mapLayer > img` | `div#mapLayer > img` |
| **`src`** | `/_expo/static/assets/assets/maps/SETOR_AZUL.61e348cc8b998b237418580fa3ddd7d8.png` | Idem | Idem |
| **`naturalWidth`** | `2339 px` | `2339 px` | `2339 px` |
| **`naturalHeight`** | `3307 px` | `3307 px` | `3307 px` |
| **`clientWidth`** | `407.4 px` | `358.0 px` | `628.1 px` |
| **`clientHeight`** | `576.0 px` | `506.2 px` | `888.0 px` |
| **`boundingClientRect`** | `{ left: 455.3, top: 120.0, width: 407.4, height: 576.0 }` | `{ left: 0.0, top: 181.9, width: 358.0, height: 506.2 }` | `{ left: 422.0, top: 120.0, width: 628.1, height: 888.0 }` |
| **`opacity`** | `1` | `1` | `1` |
| **`visibility`** | `visible` | `visible` | `visible` |
| **`display`** | `block` | `block` | `block` |
| **`position`** | `absolute` | `absolute` | `absolute` |
| **`z-index`** | `1` | `1` | `1` |
| **`transform`** | `none` | `none` | `none` |
| **`parent opacity`** | `1` | `1` | `1` |
| **`parent overflow`** | `hidden` | `hidden` | `hidden` |
| **`parent z-index`** | `1` | `1` | `1` |

---

## 🎨 Moldura Magenta Forense (4px) & Regra de Camadas (`zIndex 1-4`)

Para verificação inequívoca, o frame exato calculado pela função universal `computeContainTransform` está demarcado com uma borda magenta de **4px** e o selo `MAP IMAGE FRAME`.

```
viewport (Container #viewport)
  ├── 1. planta/mapa (Layer #mapLayer)           [zIndex: 1] -> Moldura Magenta + SETOR_AZUL.png
  ├── 2. áreas/camadas (Layer #areasLayer)       [zIndex: 2] -> Camada vetorial
  ├── 3. pins (Layer #pinsLayer)                 [zIndex: 3] -> Pins Teardrop posicionados com Ox, Oy
  └── 4. overlays temporários (#overlayLayer)    [zIndex: 4] -> Rascunhos / Seleções
```

---

## 📊 Matriz Final de Comprovação Visual

- **Desktop (1920×1080):** **PASS** ✅ *(Planta `SETOR_AZUL.png` com corredores, LUCs e ruas claramente visível — Tamanho: **356.1 KB**)*
- **Notebook (1366×768):** **PASS** ✅ *(Planta `SETOR_AZUL.png` com corredores, LUCs e ruas claramente visível — Tamanho: **166.5 KB**)*
- **Mobile (390×844):** **PASS** ✅ *(Planta `SETOR_AZUL.png` com corredores, LUCs e ruas claramente visível — Tamanho: **170.3 KB**)*
