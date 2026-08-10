# Changelog — Núcleo compartilhado

Sem build/hash automático (sem bundler, por decisão de arquitetura — ver `README.md`). Versão é manual, incrementada aqui a cada publicação relevante, e replicada na query string (`?v=`) usada pelos tenants.

## 2026.08.3 — Fase 3.1: componentes de lista para o novo Painel Master

**Adicionado:**
- `utils/list-controls.js` — `createListController({data, pageSize, searchFields})`: paginação e busca client-side, puro (sem Firebase/DOM). Primeiro consumidor é o novo Painel Master (Portal Associativo, `admin/`), mas nenhuma coleção/regra de tenant aparece aqui — qualquer página com uma lista grande pode usar (ex.: `admin_associados.html` do CCBMG, que hoje carrega tudo sem paginar).
- `components/pagination.css` — `.ds-pagination`/`.ds-pagination-btn`/`.ds-pagination-info`, companheiro de `list-controls.js`.
- `components/toast.css` — `.ds-toast-container`/`.ds-toast` (+ `.is-success`/`.is-warning`/`.is-danger`). Usa o token `--z-toast`, que já existia em `variables.css` do Portal Associativo desde a fundação do projeto sem nenhum componente que o consumisse.
- `components/sidebar.css` — `.ds-admin-topbar`/`.ds-admin-topbar-toggle`/`.ds-admin-topbar-brand`: o botão que abre a sidebar em telas estreitas. O off-canvas (`.ds-sidebar.is-open`) já existia desde a Fase 0, mas nenhum consumidor fornecia um jeito de acioná-lo — na prática, toda tela que usava `.ds-sidebar` ficava sem navegação nenhuma no mobile. Aditivo: quem já usa `.ds-sidebar` sem a topbar continua exatamente como estava.

Nenhuma mudança em componentes/utils existentes nesta versão — só adição.

## 2026.08.2 — Fase 1: firebase.js do CCBMG passa a consumir o núcleo de verdade

(A versão `2026.08.1` existiu por poucos minutos e foi pulada: o próprio deploy foi checado com uma requisição prematura, antes do build do GitHub Pages terminar, e o Cloudflare cacheou essa resposta antiga por até 4h sob aquela query string exata. Conteúdo idêntico ao descrito abaixo, só sob uma URL nova para evitar servir a versão cacheada por engano.)

3 correções de compatibilidade encontradas ao ligar o `firebase.js` real do CCBMG (não mais só a PoC isolada) ao núcleo — sem elas, o refactor quebraria login de admin/master em produção.

**Corrigido:**
- `core/auth/session.js` — `requireAuth({requiredRole})` agora aceita `string | string[]` (checagem por inclusão, cada item passado por `mapRole`), reproduzindo o comportamento real do `firebase.js` do CCBMG (17 de suas 21 páginas com `requireAuth` passam `requiredRole` como array).
- `utils/images.js` — `createImageUploader(...)`'s `uploadImageFile` agora aceita `autoCompress` (alias de `compress`) e repassa `maxWidth`/`maxHeight`/`targetKB` para `compressImage()` quando informados — antes esses valores eram silenciosamente ignorados.

**Sem mudança de comportamento, só documentação:** `tenant-context.js` já previa `branding?: object` no shape de retorno desde a Fase 0; nenhum tenant usa ainda.

## 2026.08.0 — Fase 0: primeira publicação

Criação do núcleo compartilhado, extraído do `firebase.js` do CCBMG (649 linhas, monolítico) separando mecanismo genérico de regra de negócio específica do clube.

**Adicionado:**
- `core/auth/firebase-init.js` — `initTenantFirebase(firebaseConfig)`
- `core/auth/roles.js` — `createRoleResolver(rules, fallbackRole)`
- `core/auth/session.js` — `createAuthSession({...})` → `requireAuth`, `doLogout`, `getCurrentRole`, `fetchRoleByUid`
- `core/tenant/tenant-context.js` — `getTenant()` (assíncrona desde já; lê `window.__TENANT_CONFIG__` hoje, consulta multi-tenant real numa fase futura sem quebrar consumidores)
- `core/tenant/modules.js` — `createModuleGate({...})` → `checkModuleEnabled`, `applyModuleVisibility` (varre `[data-module]` da própria página, não recebe lista fixa)
- `core/tenant/audit.js` — `createAuditLogger({...})` → `logAction`
- `utils/strings.js` — `onlyDigits`
- `utils/images.js` — `compressImage`, `createImageUploader(storage)`
- `components/{sidebar,kpi-card,data-table,modal}.css` + `index.css`
- `layouts/admin-shell.css`

**Não migrado nesta versão** (segue no `firebase.js` de cada tenant, específico de negócio): `cpfToEmail`, vocabulário de papéis, `getUserStatus` (inadimplência), `doSignupWithProfile`/`doSignupParticipanteLeilao`, `addMemberService`/`addMemberProduct`, `setupAdminButton`.
