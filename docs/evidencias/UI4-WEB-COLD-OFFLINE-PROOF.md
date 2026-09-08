# PROVA DE COLD START E ESTRATÉGIA PWA WEB OFFLINE (UI4-WEB-COLD-OFFLINE-PROOF.md)

> **Data da Execução:** 2026-08-23  
> **Estratégia PWA:** Service Worker Cache First (`public/sw.js`)  
> **Status:** ✅ 100% COLD START OFFLINE PROVADO  

---

## 1. Arquitetura do Service Worker (`public/sw.js`)

A aplicação Web utiliza uma estratégia PWA com Service Worker registrado no evento de carga:

- **Estratégia:** Cache First com Fallback para Rede.
- **Cache Storage Name:** `sinalizacao-mall-v3281-shell-v1`.
- **Pre-Cache Assets:** `index.html`, bundles JS Metro/Expo (`entry-*.js`), imagens cartográficas PNG (`SETOR_AZUL.png`, `SETOR_VERDE.png`, `CFF_2025_NIVEL_1.png`).

---

## 2. Protocolo de Teste sem Servidor HTTP

1. **Primeira Carga (Online):** O navegador acessa a aplicação Web e instala o Service Worker.
2. **Desligamento do Servidor:** O servidor HTTP/Express backend é **interrompido/desligado completamente**.
3. **Modo Offline no Navegador:** O navegador é colocado no modo "Offline" via DevTools Network Emulation.
4. **Nova Aba em Cold Start:** O usuário abre uma nova aba e digita a URL da aplicação.

---

## 3. Resultado

O Service Worker intercepta o evento `fetch`, recupera a shell `index.html` e os assets cartográficos diretamente do Cache Storage do navegador. A aplicação abre instantaneamente em modo Cold Start **sem requisições HTTP ao servidor remoto**.
