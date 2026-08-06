# Changelog — Núcleo compartilhado

Sem build/hash automático (sem bundler, por decisão de arquitetura — ver `README.md`). Versão é manual, incrementada aqui a cada publicação relevante, e replicada na query string (`?v=`) usada pelos tenants.

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
