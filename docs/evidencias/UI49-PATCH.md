# RELATÓRIO DE PATCH APLICADO — CRASH RELEASE (UI49-PATCH.md)

> **Alvo do Patch:** [`app/index.tsx`](file:///home/dns/Desenvolvimento/Sistema_Centro_Fashion/app/index.tsx)  
> **Objetivo:** Adicionar verificação segura do método `window.addEventListener` evitando `TypeError` no runtime nativo Hermes.

---

## Diff da Alteração

```diff
   // URL triggers e Listener automático para detector de rede (UI-4)
   useEffect(() => {
     const updateNetworkStatus = () => {
       if (typeof navigator !== 'undefined' && navigator.onLine === false) {
         setNetworkState('OFFLINE');
+      } else {
+        setNetworkState('ONLINE');
       }
     };
 
     updateNetworkStatus();
-    if (typeof window !== 'undefined') {
+    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
       window.addEventListener('online', () => setNetworkState('ONLINE'));
       window.addEventListener('offline', () => setNetworkState('OFFLINE'));
     }
     const interval = setInterval(updateNetworkStatus, 1500);
+
+    return () => {
+      clearInterval(interval);
+      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
+        window.removeEventListener('online', () => setNetworkState('ONLINE'));
+        window.removeEventListener('offline', () => setNetworkState('OFFLINE'));
+      }
+    };
```
