# MOTOR DE CONFIGURAÇÃO COMERCIAL — Planos, Módulos, Pricing e Isenções

**Status: implementado, testado (255 verificações — 225 unidade/integração + 60 Rules + 15 Storage Rules, 0 falhas), seed aplicado em produção (`--apply`, confirmado por leitura direta: 10 módulos em `moduleCatalog`, 5 planos oficiais + shim `systemPlans/custom` em `systemPlans`). Deploy de Cloud Functions/Rules/frontend em andamento — ver seção 7.**

---

## 1. RESUMO

`admin/plans.html` (Painel Master) era rudimentar: `systemPlans/{planId}` só guardava `label/description/modules/limits` — nenhum preço, nenhum catálogo de módulos como entidade (chaves soltas escaneadas de documentos existentes), e um gap real de UX no botão "Editar" (Platform Operator via os controles de escrita, clicava Salvar, recebia um `permission-denied` cru do servidor — já documentado como achado não-explorável em `CLAUDE.md`, corrigido aqui).

Esta fase transforma Planos num motor de configuração comercial de verdade:

- **Catálogo de módulos centralizado** (`moduleCatalog`, nova coleção) — 10 módulos oficiais, cada um com valor econômico mensal e dependências técnicas entre si (validadas server-side, não inventadas: confirmadas em código real — `financeiro` requer `associados`, `leilões` requer `associados`+`financeiro`).
- **5 planos comerciais oficiais** (`systemPlans`, schema ampliado com `price`/`order`/`recommended`/`isCustom`/`active`) — Essencial R$49, Comunidade R$149, Gestão R$299 (recomendado), Plataforma R$499, Customizado (sem preço/módulos fixos). Preço comercial é sempre uma decisão independente da soma econômica dos módulos.
- **Plano Customizado por organização** — módulos escolhidos individualmente, `economicValue`/desconto/`finalPrice` sempre recalculados server-side (`applyOrgCustomPlan`), nunca aceitos do payload do cliente.
- **Isenção de cobrança por organização** (`organizationSubscriptions.exempt*`) — nunca altera plano/módulos contratados, permanente ou temporária, calculada na leitura (sem cron), auditada, com confirmação explícita para isenção permanente.
- **Escrita movida inteiramente para Cloud Functions** (`systemPlans`/`moduleCatalog` passam de escrita direta do cliente para `write: if false` nas Rules), mesmo padrão estrutural de `featureFlags`.

---

## 2. MODELO DE DADOS

### `moduleCatalog/{moduleKey}` (nova coleção)

| Campo | Tipo | Descrição |
|---|---|---|
| `key`, `label`, `description` | string | Identidade do módulo |
| `economicValue` | number | Valor econômico mensal (reais) — mesma convenção de arredondamento de `resolvePlanValue` |
| `order` | number | Ordem de exibição |
| `dependencies` | string[] | Outros `moduleKey` exigidos — validado em toda escrita nova |
| `active` | boolean | Soft-archive — nunca hard-delete |

10 módulos seedados: institucional(49) associados(79) comunicação(21) financeiro(99, requer associados) eventos(49) parceiros(29) classificados(39) leilões(149, requer associados+financeiro) relatórios(49) white label(79) — soma R$641.

### `systemPlans/{planId}` (schema ampliado)

Campos novos: `price` (comercial, `null` só para `isCustom:true`), `order`, `recommended`, `isCustom`, `active`. `modules` mantém o shape `{[moduleKey]:boolean}` já existente — `provisionOrganization` não precisou de nenhuma mudança de código.

5 IDs estáveis: `essencial`, `comunidade`, `gestao` (`recommended:true`), `plataforma` (todos os 10 módulos), `customizado` (`isCustom:true`, `price:null`, `modules:{}`).

### Isenção — `organizationSubscriptions/{orgId}` (não em `organizations`)

Campos novos: `exempt`, `exemptReason`, `exemptUntil` (`null`=permanente), `exemptBy`/`exemptAt`, `exemptRevokedBy`/`exemptRevokedAt` (histórico, nunca limpo). Colocados em `organizationSubscriptions` — não em `organizations` — porque essa coleção já não tem nenhum caminho de autoatendimento do Organization Master (`firestore.rules`), tornando a exclusão do self-service grátis por construção, em vez de mais um campo a lembrar de excluir do allowlist de `organizations`.

"Está isenta agora?" é sempre **calculado na leitura** (`exempt && (!exemptUntil || exemptUntil > now)`, `functions/lib/orgExemption.js`) — deliberadamente sem nenhuma Cloud Function agendada.

---

## 3. BACKEND (`clubedocavalobonfimmg`)

- `functions/lib/pricing.js` (novo) — funções puras: `sumEconomicValue`, `validateModuleDependencies`, `calculateCustomPlanPrice`, `round2`. Sem I/O, testáveis sem emulador.
- `functions/lib/orgExemption.js` (novo) — `resolveOrgExemption(subscription, nowMs)`, pura.
- `functions/index.js` — 9 Cloud Functions novas, todas `requirePlatformAdministrator` (nunca `operator`), todas auditadas via `writePlatformAuditLog`: `createModuleCatalogEntry`/`updateModuleCatalogEntry`/`archiveModuleCatalogEntry`, `createPlan`/`updatePlan`/`archivePlan`, `applyOrgCustomPlan`, `grantOrgExemption`/`revokeOrgExemption`.
- `firestore.rules` — `systemPlans`/`moduleCatalog`: leitura restrita de `isLoggedIn()` (vazava a qualquer associado de qualquer organização) para `isPlatformStaff()`; escrita de `isPlatformAdministrator()` direto do cliente para `write: if false` (CF-only). `organizationSubscriptions`: campos de isenção bloqueados mesmo para Platform Administrator em escrita direta (`affectedKeys().hasAny([...])` em `update`, `keys().hasAny([...])` em `create`) — só `grantOrgExemption`/`revokeOrgExemption` (Admin SDK) podem tocá-los.
- `functions/scripts/seedPlansAndModules.js` (novo) — seed idempotente, puramente aditivo (nunca deleta/sobrescreve). Dry-run contra produção confirmou: `moduleCatalog`/`systemPlans` inexistentes (nada a preservar), `org_bonfim` (CCBMG) em `plan:"custom"` (shim de compatibilidade `systemPlans/custom` seria criado, sem tocar `organizations/org_bonfim.plan`), `org_teste_etapa10` (Sandbox) em `plan:"enterprise"` (legado, só reportado).

## 4. FRONTEND (`portal-associativo`)

- `admin/plans.html` — reescrita: gate `canManage` (mirror de `feature-flags.html`) corrige o achado de UX documentado em `CLAUDE.md`; escrita via `httpsCallable` em vez de `setDoc`/`deleteDoc` direto; módulos exibidos com label/descrição/valor econômico do catálogo; preço comercial explicitamente rotulado como independente da soma; "Excluir" virou "Arquivar" (`active:false`, nunca apaga).
- `admin/module-catalog.html` (nova) — CRUD do catálogo, mesmo padrão de `plans.html`.
- `admin/organization-detail.html` (aba Assinatura) — isenção (checkbox+motivo+data opcional+confirmação obrigatória para permanente) e, quando `plan==="customizado"`, checklist de módulos + desconto + preview ao vivo, salvos via `applyOrgCustomPlan`. Fallback obsoleto `|| "enterprise"` corrigido para `|| ""` (não é mais garantidamente um plano válido).
- `admin/assets/admin-nav.js` — item "Catálogo de Módulos" adicionado.

## 5. TESTES

`functions/test/pricing.test.js` (novo, 30 verificações): funções puras (`sumEconomicValue`/`validateModuleDependencies`/`calculateCustomPlanPrice`/`resolveOrgExemption`) + callables contra o emulador (dependência quebrada rejeitada, preço comercial independente da soma, plano customizado força `price:null`/`modules:{}`, `applyOrgCustomPlan` recalcula corretamente, ciclo `grantOrgExemption`/`revokeOrgExemption`, isenção temporária expira sem chamar revoke). `functions/test/rules.test.js` estendido (13 verificações novas): leitura/escrita de `systemPlans`/`moduleCatalog`, campos de isenção bloqueados mesmo para Platform Administrator. `functions/test/helpers/seed.js`: `seedModuleCatalog`/`seedPlan`/`seedSubscription` novos.

Resultado: **225 passed / 0 failed** (unidade+integração), **60 passed / 0 failed** (Rules), **15 passed / 0 failed** (Storage Rules).

## 6. FORA DE ESCOPO (deliberado)

Cupons/campanhas/promoções, múltiplos ciclos de cobrança, billing engine externo; enforcement real de isenção sobre cobrança Asaas (fase é informativa — `organizationSubscriptions` é um ledger manual, não conectado aos gatilhos reais de cobrança do CCBMG); rewrite da aba "Módulos" legada de `organization-detail.html` (continua com `updateDoc` direto sem validação de dependência — gap conhecido, não ampliado nem corrigido nesta fase); migração automática de `org_bonfim` de `plan:"custom"` para `"customizado"` (deixada como follow-up manual de um campo só).

## 7. PENDÊNCIA

Seed já aplicado em produção. Restam: deploy das 9 Cloud Functions (codebase `default`) + Firestore Rules + frontend; smoke test em produção; migração manual de `org_bonfim` (`plan:"custom"` → `"customizado"`, preservando `modules`/isenção); remoção dos planos legados (`starter`/`professional`/`enterprise`/`custom`) de `systemPlans` após confirmar que nenhuma organização ativa os referencia.
