# Love Letter Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar uma página web interativa, romântica e responsiva com envelope 3D clicável que abre revelando a foto `eu e ray.jpg`, um coração pulsante com "Eu te amo" e partículas de corações flutuantes.

**Architecture:** Arquitetura estática pura (HTML5, CSS3 3D e JavaScript Vanilla com HTML5 Canvas) de alto desempenho e zero dependências externas além do Google Fonts.

**Tech Stack:** HTML5 Semântico, CSS3 (Transforms 3D, Flexbox, Keyframe Animations, CSS Variables), JavaScript ES6+ (Canvas 2D API).

## Global Constraints
- Imagem `eu e ray.jpg` preservada e referenciada diretamente da raiz.
- Animações fluidas a 60 FPS com aceleração por hardware.
- Design responsivo para celulares (iOS/Android) e telas desktop.
- Zero frameworks pesados para garantir carregamento instantâneo.

---

### Task 1: Estrutura HTML5 Semântica e Carregamento de Fontes

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `eu e ray.jpg` na raiz
- Produces: IDs e classes DOM (`#hearts-canvas`, `.envelope-wrapper`, `.envelope`, `.flap`, `.seal-btn`, `.letter-card`, `.photo-container`, `.heart-badge`, `.close-btn`)

- [ ] **Step 1: Criar o arquivo `index.html` com a estrutura completa da cartinha**
- [ ] **Step 2: Verificar a marcação HTML e referências de recursos**
- [ ] **Step 3: Commit das alterações**

```bash
git add index.html
git commit -m "feat: add semantic HTML structure for love letter"
```

---

### Task 2: Estilização Romântica, Efeitos 3D e Responsividade

**Files:**
- Create: `style.css`

**Interfaces:**
- Consumes: Elementos do DOM em `index.html`
- Produces: Variáveis de cores, animações 3D de abertura da aba, efeito polaroid para `eu e ray.jpg`, batimento cardíaco (*heartbeat*) no coração e regras responsivas para mobile/desktop.

- [ ] **Step 1: Criar o arquivo `style.css` com design system completo e animações**
- [ ] **Step 2: Validar visual e regras de mídia (@media)**
- [ ] **Step 3: Commit das alterações**

```bash
git add style.css
git commit -m "feat: add romantic CSS styling, 3D envelope and animations"
```

---

### Task 3: Lógica Interativa e Sistema de Partículas Canvas

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: `#hearts-canvas`, `.envelope-wrapper`, `.seal-btn`, `.close-btn`
- Produces: Controlador de estado `isOpen`, sistema de partículas `HeartParticle` com física de flutuação e explosão de corações ao abrir.

- [ ] **Step 1: Criar o arquivo `script.js` com controle da cartinha e animação de partículas**
- [ ] **Step 2: Validar eventos de clique e ciclo de animação do Canvas**
- [ ] **Step 3: Commit das alterações**

```bash
git add script.js
git commit -m "feat: add interactive envelope logic and floating hearts canvas"
```

---

### Task 4: Verificação Final e Testes de Experiência do Usuário

**Files:**
- Modify: `index.html` (se ajustes de polimento forem necessários)
- Modify: `style.css` (se ajustes de responsividade forem necessários)

**Interfaces:**
- Consumes: Aplicação completa (`index.html`, `style.css`, `script.js`, `eu e ray.jpg`)
- Produces: Experiência polida e funcional pronta para uso.

- [ ] **Step 1: Testar fluxo completo de abertura, exibição da foto e fechamento**
- [ ] **Step 2: Validar responsividade em viewport mobile e desktop**
- [ ] **Step 3: Commit final de refinamento**

```bash
git add .
git commit -m "polish: refine animations and responsive layout"
```
