# TESTE DE OPERAÇÃO OFFLINE E ESTADOS DE REDE (UI4-OFFLINE-TEST.md)

> **Data da Execução:** 2026-08-23  
> **Escopo:** Gate UI-4 — Validação dos 4 estados de rede e resiliência offline  
> **Status:** ✅ 100% APROVADO  

---

## 1. Matriz de Estados de Rede Audita no Cabeçalho

| Estado de Rede | Cor da Badge | Texto Exibido | Operabilidade da UI | Status |
| :--- | :--- | :--- | :--- | :---: |
| **ONLINE** | `#12823B` (Verde) | `Online` | 100% Funcional com Sync Direta | ✅ PASS |
| **DEGRADADO** | `#E08B00` (Amarelo) | `Degradado` | Operação Local com Enfileiramento Protegido | ✅ PASS |
| **OFFLINE** | `#D94841` (Vermelho) | `Offline` | 100% Funcional Offline (Mapa, Cadastro e Edição) | ✅ PASS |
| **RECUPERANDO** | `#00C8FF` (Azul) | `Recuperando…` | Drenagem Automática da Outbox sem Travamento | ✅ PASS |

---

## 2. Teste de Resiliência e Persistência Offline

1. **Abertura Online & Carga de Cache:** As 6 plantas cartográficas e registros locais são carregados no armazenamento do dispositivo (IndexedDB / LocalStorage).
2. **Desconexão de Rede (`OFFLINE`):** A badge do cabeçalho altera para `Offline` vermelho. O viewport cartográfico continua 100% funcional.
3. **Criação e Edição Offline:** Registros criados ou editados no modo offline geram eventos com `clientEventId` único e são enfileirados na Outbox local.
4. **Reativação de Rede (`ONLINE`):** Ao re-conectar, os itens da Outbox são sincronizados com o servidor sem gerar duplicação de ativos.
