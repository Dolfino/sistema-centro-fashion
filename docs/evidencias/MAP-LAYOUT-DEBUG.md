# MAP-LAYOUT DEBUG & TRANSFORM INSTRUMENTATION (UI-1.3)

> **Objetivo:** Registrar o rastreamento da função universal `computeContainTransform` em todos os três breakpoints solicitados (Desktop, Notebook e Mobile) para assegurar o enquadramento de contain sem colapso ou ocultação de camada.

---

## 📐 Função Única de Transformação (`computeContainTransform`)

```typescript
export function computeContainTransform(
  viewportWidth: number,
  viewportHeight: number,
  naturalWidth: number,
  naturalHeight: number
) {
  const safeVw = viewportWidth > 0 ? viewportWidth : 800;
  const safeVh = viewportHeight > 0 ? viewportHeight : 600;

  const scale = Math.min(safeVw / naturalWidth, safeVh / naturalHeight);
  const renderedWidth = naturalWidth * scale;
  const renderedHeight = naturalHeight * scale;
  const offsetX = (safeVw - renderedWidth) / 2;
  const offsetY = (safeVh - renderedHeight) / 2;

  return { scale, renderedWidth, renderedHeight, offsetX, offsetY };
}
```

---

## 📊 Medições Rastradas por Breakpoint (`[MAP-LAYOUT]`)

### 1. Desktop (1920 × 1080 px)
```json
{
  "viewport": { "width": 1472, "height": 888 },
  "natural": { "width": 2339, "height": 3307 },
  "scale": 0.268521,
  "rendered": { "width": 628.1, "height": 888.0 },
  "offset": { "x": 422.0, "y": 0.0 },
  "imageFrame": { "left": 422.0, "top": 0.0, "width": 628.1, "height": 888.0 }
}
```
- **Status de Renderização:** PASS (Planta `SETOR_AZUL.png` totalmente visível com letterbox lateral).

---

### 2. Notebook (1366 × 768 px)
```json
{
  "viewport": { "width": 1318, "height": 576 },
  "natural": { "width": 2339, "height": 3307 },
  "scale": 0.174176,
  "rendered": { "width": 407.4, "height": 576.0 },
  "offset": { "x": 455.3, "y": 0.0 },
  "imageFrame": { "left": 455.3, "top": 0.0, "width": 407.4, "height": 576.0 }
}
```
- **Status de Renderização:** PASS (Planta `SETOR_AZUL.png` totalmente visível ajustada ao viewport de 576px de altura).

---

### 3. Mobile (390 × 844 px)
```json
{
  "viewport": { "width": 358, "height": 694 },
  "natural": { "width": 2339, "height": 3307 },
  "scale": 0.153057,
  "rendered": { "width": 358.0, "height": 506.2 },
  "offset": { "x": 0.0, "y": 93.9 },
  "imageFrame": { "left": 0.0, "top": 93.9, "width": 358.0, "height": 506.2 }
}
```
- **Status de Renderização:** PASS (Planta `SETOR_AZUL.png` totalmente visível com letterbox vertical de 93.9px no topo e base).

---

## 🥞 Matriz de Composição de Camadas (zIndex 1-4)

- `zIndex: 1` — **#mapLayer** (Renderiza `SETOR_AZUL.png` com a exata bounding box de `imageFrame`)
- `zIndex: 2` — **#areasLayer** (Camada vetorial de áreas lógicas)
- `zIndex: 3` — **#pinsLayer** (Camada de Teardrop Pins com $P_x = O_x + N_x \cdot R_w$ e $P_y = O_y + N_y \cdot R_h$)
- `zIndex: 4` — **#overlayLayer** (Camada de marcação temporária)
