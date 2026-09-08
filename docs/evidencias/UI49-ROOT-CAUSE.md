# DIAGNÓSTICO DE CAUSA RAIZ — CRASH RELEASE (UI49-ROOT-CAUSE.md)

> **Data:** 2026-08-23  
> **Processo Auditado:** `com.centrofashion.sinalizacao` (PID: 7806)  
> **Classificação da Falha:** `ReactNativeJS Exception`  

---

## 1. Evidência Extraída do Logcat (`UI49-RELEASE-CRASH-FOCUSED.log`)

```text
08-23 21:59:59.938  7806  7838 E AndroidRuntime: FATAL EXCEPTION: mqt_native_modules
08-23 21:59:59.938  7806  7838 E AndroidRuntime: Process: com.centrofashion.sinalizacao, PID: 7806
08-23 21:59:59.938  7806  7838 E AndroidRuntime: com.facebook.react.common.JavascriptException: TypeError: undefined is not a function
08-23 21:59:59.938  7806  7838 E AndroidRuntime: 
08-23 21:59:59.938  7806  7838 E AndroidRuntime: This error is located at:
08-23 21:59:59.938  7806  7838 E AndroidRuntime:     in LegacyMainShellScreen
```

---

## 2. Análise do Mecanismo de Falha

1. No runtime nativo Android (engine Hermes/JSC), o objeto global `window` existe parcialmente, porém `window.addEventListener` **não é uma função** (`undefined`).
2. O hook `useEffect` recém-adicionado em `app/index.tsx` invocava diretamente `window.addEventListener('online', ...)`.
3. Ao tentar invocar `undefined(...)` na montagem do componente `LegacyMainShellScreen`, o motor Hermes lançou um `TypeError: undefined is not a function` não capturado, acionando o `ExceptionsManagerModule` da React Native e forçando o encerramento do processo nativo via `SIG: 9`.

---

## 3. Estado do Processo
- **PID Inicial:** 7806
- **PID Pós-Lançamento:** Nulo (Dead/Killed via SIG 9)
