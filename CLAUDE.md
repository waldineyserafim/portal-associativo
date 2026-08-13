# Portal Associativo — Claude Code Context

## Organização
**Portal Associativo** — plataforma SaaS multi-tenant da Serafim Technologies.
Site: https://portalassociativo.com.br
Repositório: este (`portal-associativo`)
Firebase Project: `clubecavalobonfim` (compartilhado com o repositório `clubedocavalobonfimmg` — ver "Onde as coisas moram" abaixo)

> Este arquivo é o correspondente, para a plataforma, do `CLAUDE.md` do repositório `clubedocavalobonfimmg` — documenta arquitetura e estado atual do que este repositório constrói. Escrito em agosto de 2026, consolidando o que antes só existia narrado fase-a-fase no `CLAUDE.md` do CCBMG (Fases 3.2–3.12) e nos relatórios de `docs/roadmap/`.

## Onde as coisas moram (para não confundir os dois repositórios)

Existe **um único** projeto Firebase para toda a plataforma. O código está fisicamente dividido assim:

| O quê | Onde mora |
|---|---|
| Backend: Cloud Functions (`functions/index.js` + `functions/lib/*.js`), `firestore.rules`, `storage.rules`, scripts de seed/migração | Repositório `clubedocavalobonfimmg` (mesmo que hospede também o frontend do tenant CCBMG) |
| Frontend do Painel Master (`admin/*.html`, gestão cross-tenant pela equipe da plataforma) | **Este repositório** |
| Núcleo de frontend compartilhado (`shared/`), consumido cross-origin por qualquer tenant | **Este repositório** |
| Site institucional/marketing da plataforma (`index.html`, `pages/*.html`) | **Este repositório** |
| Frontend do tenant CCBMG (`index.html`, `pg_associado.html`, `admin.html` etc. daquele produto) | Repositório `clubedocavalobonfimmg` |
| Cloudflare Worker de proxy do domínio de demonstração | Este repositório (`cloudflare-worker-demo-proxy/`) |

Ou seja: "plataforma" aqui não significa "só este repositório" — significa o conjunto de mecanismos multi-tenant (provisionamento, papéis de plataforma, domínios, feature flags, configuração por organização), cujo código roda em ambos. Este arquivo documenta esses mecanismos do ponto de vista de produto/arquitetura; o `CLAUDE.md` do CCBMG documenta a implementação Cloud Functions/Firestore linha a linha (porque o código físico está lá) e os fatos específicos do tenant CCBMG.

Para o histórico de como cada peça foi construída, fase a fase, ver `docs/roadmap/` (índice em `docs/roadmap/README.md`) — este arquivo descreve só o **estado atual**, não o changelog.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend (marketing + Painel Master) | HTML5 + CSS3 + Bootstrap 5.3 + JavaScript Vanilla (ES Modules), sem build step |
| Hospedagem | GitHub Pages (domínio próprio via CNAME, DNS/proxy no Cloudflare) |
| Auth (Painel Master) | Firebase Authentication, `platformAdmins/{uid}` como plano de identidade |
| Banco | Firestore (projeto compartilhado com o CCBMG) |
| Backend | Cloud Functions (Node.js 22) — código no repositório `clubedocavalobonfimmg` |
| Núcleo compartilhado | `shared/` — consumido cross-origin por qualquer tenant via `import` de URL absoluta |
| Segredos | Google Secret Manager (mesmo projeto) |

---

## Estrutura deste repositório

- `index.html`, `pages/*.html` — site institucional (marketing, planos, funcionalidades, contato, demonstração) — ver `pages/README.md`
- `admin/*.html` — **Painel Master** (autenticado, equipe da plataforma) — ver seção própria abaixo
- `shared/` — núcleo compartilhado (auth/Firebase, resolução de tenant, módulos, branding, feature flags, auditoria, componentes visuais) — contrato completo em `shared/README.md`, changelog em `shared/CHANGELOG.md`
- `cloudflare-worker-demo-proxy/` — Worker de proxy reverso que serve o tenant Sandbox em `demo.portalassociativo.com.br` (ver "Tenant Resolver" abaixo)
- `assets/images/` — banco de imagens curadas do site institucional (cada subpasta com seu próprio `README.md` de critério de uso)
- `docs/` — documentação técnica e de produto deste repositório (ver estrutura ao final deste arquivo)

---

## Modelo Multi-Tenant — estado atual

### Papéis (dois planos de identidade genuinamente separados)

**Plataforma** (`platformAdmins/{uid}`, equipe da Serafim Technologies, **nunca** tem `orgId`):
| Papel | Pode |
|---|---|
| `owner` | Tudo que `administrator` pode + gerenciar outros `administrator`/`owner` + ações irreversíveis |
| `administrator` | Criar/editar organizações, gerenciar planos, gerenciar `operator` (não `administrator`/`owner`), auditoria global |
| `operator` | Somente leitura nas telas de plataforma — zero escrita |

**Organização** (`users/{uid}.role`, sempre com `orgId`, nunca cruza tenant):
| Papel | Pode |
|---|---|
| `master` (Organization Master) | Tudo que `admin` pode + alterar o papel de qualquer membro da equipe administrativa da própria org (único papel que pode) + autoatendimento de configuração (`admin_configuracoes.html`, Fase 4) |
| `admin` (Organization Administrator) | Operação plena do dia a dia (associados, conteúdo, financeiro, moderação) — **não** pode alterar papel de ninguém nem escrever configuração de negócio |
| `operador` (Organization Operator) | Tarefas pontuais (ex.: check-in de evento) |
| `Admin View` (Organization Viewer) | Somente leitura nas telas administrativas |
| `associado`/`participanteLeilao` | Base de membros comum, não é equipe administrativa |

Autorização resolvida por `requirePlatformAccess({ requiredRole })` (`admin/assets/admin-auth.js`, este repositório, para telas de plataforma) e `requireAuth({ requiredRole })` (`firebase.js`, repositório do CCBMG, para telas de organização). Firestore Rules são a autoridade real (nunca confiar só na UI) — helpers `isPlatformStaff()`/`isPlatformAdministrator()`/`isPlatformOwner()` e `isOrgMaster(orgId)`/`isOrgAdmin(orgId)`/`isOrgViewer(orgId)` em `firestore.rules`.

### Firestore — coleções de plataforma (schema físico completo em `clubedocavalobonfimmg/CLAUDE.md`)

- `organizations/{orgId}` — o tenant. Provisionamento, configuração (Geral/Localização/Identidade Visual/Financeiro/Comunicação/Portal/Integrações/Segurança — 8 categorias em `admin/organization-detail.html`), billing, `business.*` (Fase 4), flags `isSandbox`/`environment`.
- `platformAdmins/{uid}` — equipe da plataforma. Escrita só via Cloud Functions (`createPlatformAdmin`/`setPlatformAdminStatus`/`setPlatformAdminRole`/`deletePlatformAdmin`), auditadas em `systemLogs`.
- `provisioningRuns/{runId}` — auditoria por etapa de `provisionOrganization` (a única forma oficial de criar um tenant novo — nunca `setDoc` direto).
- `domains/{hostname}` — índice hostname→orgId, único escritor `setOrganizationDomains`, leitura pública (precisa resolver antes de qualquer login).
- `organizations/{orgId}/public/branding` — projeção pública curada (nome, logo, cores, contato institucional, `isSandbox`), mantida por trigger, nunca escrita direta.
- `featureFlags/{flagKey}` — kill-switch/rollout por organização, leitura direta restrita à equipe de plataforma; cliente só via callable `resolveFeatureFlags`.
- `moduleCatalog/{moduleKey}` — fonte central de verdade dos módulos comerciais (label, descrição, valor econômico mensal, dependências entre módulos), editável em `admin/module-catalog.html`. `systemPlans`/`organizations` só referenciam módulos por chave, nunca duplicam metadado.
- `systemPlans/{planId}` — os 5 planos comerciais oficiais (Essencial/Comunidade/Gestão/Plataforma/Customizado): `price` (comercial, independente da soma econômica dos módulos), `modules` (map de chaves do `moduleCatalog`), `recommended`, `isCustom`, `active`. Editável em `admin/plans.html`, escrita só via Cloud Function (`createPlan`/`updatePlan`/`archivePlan`).
- `systemConfig/global` — configuração global da plataforma, editável em `admin/settings.html`.
- `systemLogs` — auditoria (toda mutação relevante de plataforma), consultável em `admin/audit.html`.
- `leads` — funil comercial (leads com `proximaAcao` agendada, atribuíveis a `platformAdmins`), gerido em `admin/leads.html`/`admin/lead-detail.html`.

### Painel Master (`admin/*.html`, este repositório)

| Página | Função |
|---|---|
| `login.html` | Login da equipe de plataforma |
| `index.html` | Dashboard (KPIs reais, sem número hardcoded) |
| `organizations.html` | Lista de organizações |
| `organization-provision.html` | Assistente de provisionamento (progresso ao vivo via `onSnapshot` sobre `provisioningRuns`) |
| `organization-detail.html` | Detalhe de uma organização — abas Dados, Central de Configuração (8 categorias), Equipe, Domínios |
| `domains.html` | Visão global de todos os domínios cadastrados (cross-organização), busca, criar/promover/remover |
| `plans.html` | CRUD dos 5 planos comerciais oficiais (`systemPlans`) — preço, módulos, destaque, plano Customizado |
| `module-catalog.html` | CRUD do catálogo de módulos (`moduleCatalog`) — valor econômico, dependências |
| `subscriptions.html` | Assinaturas SaaS das organizações |
| `modules.html` | Catálogo de módulos habilitáveis |
| `feature-flags.html` | CRUD de `featureFlags`, status/rollout/overrides por organização |
| `platform-operators.html` | CRUD da equipe de plataforma (`platformAdmins`) |
| `audit.html` | Trilha de auditoria (`systemLogs`) |
| `leads.html` / `lead-detail.html` | Funil comercial |
| `settings.html` | Configuração global (`systemConfig/global`) |

### Tenant Resolver (por hostname, sem fallback)

Cada página do tenant CCBMG resolve sua organização em runtime a partir do hostname que a serviu, via `shared/core/tenant/tenant-context.js` (`getTenant({db})`, este repositório) consultando `domains/{location.hostname}`:

- Hostname cadastrado → `orgId` resolvido, app roda normal.
- Hostname **não** cadastrado → `TenantNotFoundError` → `renderTenantNotFoundPage()` (página amigável, execução interrompida) — **sem fallback nenhum** para nenhum `orgId` estático, nem para o CCBMG. `tenant.config.js` (repositório do CCBMG) não declara mais `orgId`, só a config do SDK do Firebase.

Hoje dois hostnames resolvem organizações reais: `clubedocavalobonfim.com.br` → `org_bonfim` (origem real, GitHub Pages) e `demo.portalassociativo.com.br` → `org_teste_etapa10` (tenant Sandbox), este último servido por um **Cloudflare Worker de proxy reverso** (`cloudflare-worker-demo-proxy/`, neste repositório) que busca o conteúdo de `clubedocavalobonfim.com.br` e devolve verbatim — sem segundo frontend, `location.hostname` no navegador continua sendo o domínio de demonstração.

Adicionar um domínio novo para uma organização (cliente com domínio próprio, por exemplo) não exige mudança de código: `setOrganizationDomains` (Cloud Function) + registrar o Custom Domain no mesmo Worker (se for um hostname físico novo) + Painel Master → Domínios.

### White Label

`organizations/{orgId}/public/branding` (favicon, cores `--brand`/`--brand-dark`, nome/logo, contato institucional) é aplicado automaticamente por `shared/core/tenant/branding.js` a qualquer página que importe `firebase.js` — via atributos `[data-tenant-name]`/`[data-tenant-logo]`/`[data-tenant-email]`/`[data-tenant-address]`/`[data-tenant-whatsapp]`/`[data-tenant-social="..."]`, `<title>`/meta description dinâmicos (`data-page-title`/`data-desc-template`), e `[data-hide-if-sandbox]` para blocos estáticos sem equivalente de CMS ainda. Campo ausente = HTML/CSS estático da página continua valendo (fallback gracioso por construção). Identificação de tenant de demonstração é **sempre** por `organizations/{orgId}.isSandbox === true`, nunca por nome ou `orgId` hardcoded.

### Feature Flags

`featureFlags/{flagKey}` — `status` (`off`/`on`/`rollout` com bucket determinístico por `orgId`) + `overrides` por organização (sempre vence) + `environments` (filtra por `organizations/{orgId}.environment`). **Fail-closed** para flag desconhecida/arquivada (diferente do fail-open de módulos/branding — flag nova e não configurada nunca vaza). Cliente nunca lê a coleção direto (vazaria `overrides` de outras organizações) — só via callable `resolveFeatureFlags`, que devolve o mapa já resolvido para uma organização. Cache: 20s no servidor (`CACHE_TTL_MS`, é o SLA real de propagação de um kill-switch — cada instância de Cloud Function tem seu próprio cache de processo), 1 min no cliente (`shared/core/tenant/features.js`).

### Planos, Módulos e Isenção de Cobrança (motor de configuração comercial)

Modelo comercial oficial: 5 planos (`systemPlans`) — Essencial R$49, Comunidade R$149, Gestão R$299 (`recommended:true`), Plataforma R$499, e Customizado (`isCustom:true`, sem preço/módulos fixos no template). O preço comercial de um plano público é sempre uma **decisão de pricing independente** da soma do `economicValue` dos módulos que ele inclui (ex.: Gestão soma R$297 em módulos mas custa R$299 comercialmente — não é inconsistência, é intencional).

`moduleCatalog/{moduleKey}` é a fonte central de verdade de cada módulo (10 hoje: institucional/associados/comunicação/financeiro/eventos/parceiros/classificados/leilões/relatórios/white label). Um módulo pode declarar `dependencies` (outros `moduleKey` que precisam estar selecionados junto) — hoje: `financeiro` requer `associados` (cobrança é sempre de um associado); `leilões` requer `associados`+`financeiro` (lance é de um membro da organização, arremate gera cobrança via o provider de billing da organização — ver `gerarCobrancaLeilao`/`placeBid`, repositório do CCBMG). Dependência é validada server-side (`functions/lib/pricing.js`, `validateModuleDependencies`) em toda escrita nova via `createPlan`/`updatePlan`/`applyOrgCustomPlan` — nunca reescaneia/muta retroativamente módulos já habilitados por uma organização antes desta fase.

**Plano Customizado**: o Master seleciona módulos por organização (não no template do plano) — `applyOrgCustomPlan` (Cloud Function) recalcula sempre server-side `economicValue`/`desconto`/`finalPrice` (`functions/lib/pricing.js`, `calculateCustomPlanPrice`) e nunca aceita um preço final vindo do payload do cliente; o preview no Painel Master é só réplica da mesma aritmética em JS, para UX, nunca fonte de verdade. Resultado gravado em `organizationSubscriptions/{orgId}.customPlan` e espelhado em `organizations/{orgId}.modules`.

**Isenção de cobrança** é característica da **assinatura** de uma organização, nunca do plano — nunca altera `organizations.plan`/`modules` (a organização mantém exatamente os módulos do plano contratado). Campos em `organizationSubscriptions/{orgId}` (não em `organizations` — essa coleção já não tem nenhum caminho de autoatendimento do Organization Master, então a exclusão é grátis por construção, sem allowlist pra manter): `exempt`, `exemptReason`, `exemptUntil` (`null` = permanente), `exemptBy`/`exemptAt`, e `exemptRevokedBy`/`exemptRevokedAt` (histórico, nunca limpo na revogação). "Está isenta agora?" é sempre **calculado na leitura** (`exempt && (!exemptUntil || exemptUntil > now)`, `functions/lib/orgExemption.js`) — deliberadamente sem nenhuma Cloud Function agendada para "expirar" isenção. Concessão/revogação só via `grantOrgExemption`/`revokeOrgExemption` (Cloud Function, `requirePlatformAdministrator`, auditadas) — Firestore Rules bloqueiam esses campos mesmo em escrita direta de um Platform Administrator legítimo (`organizationSubscriptions`, ver `firestore.rules`). Escopo desta fase é informativo (badge no Painel Master, exclusão de MRR/ARR) — não há enforcement de billing real ainda (`organizationSubscriptions` é um ledger manual, não conectado aos gatilhos reais de cobrança do CCBMG).

`systemPlans`/`moduleCatalog` seguem o mesmo padrão estrutural de `featureFlags`: leitura restrita a `isPlatformStaff()`, escrita sempre via Cloud Function (`write: if false` nas Rules) — nunca `setDoc`/`deleteDoc` direto do cliente. Nenhum documento é apagado ao "excluir" — `archivePlan`/`archiveModuleCatalogEntry` só marcam `active:false` (mesma filosofia de `ativo:false` já usada no resto da base).

### Tenant Sandbox oficial

`org_teste_etapa10` ("Clube dos Associados") é o ambiente permanente de QA/demo/homologação da plataforma inteira — **nunca dados reais**. Identificado só por `organizations/org_teste_etapa10.isSandbox === true` (nunca por nome). Conta Asaas própria (sandbox, webhook dedicado `asaasSandboxWebhook`), seed reaproveitável (`functions/scripts/seedSandboxTenant.js`, repositório do CCBMG), servido publicamente em `demo.portalassociativo.com.br` via o Worker de proxy descrito acima.

---

## Glossário da Plataforma

| Termo | Significado |
|---|---|
| **Tenant / Organização** | Um cliente da plataforma, isolado por `orgId`. Documento em `organizations/{orgId}`. |
| **Organization Master/Admin/Operator/Viewer** | Papéis de equipe administrativa **dentro de uma organização** (`users/{uid}.role`), sempre com `orgId`, nunca cruzam tenant. |
| **Platform Owner/Administrator/Operator** | Papéis da equipe da Serafim Technologies (`platformAdmins/{uid}`), nunca têm `orgId` — plano de identidade separado. |
| **Módulo** | Funcionalidade habilitável por organização (`organizations/{orgId}.modules`), copiada do plano no provisionamento. |
| **Tenant Resolver** | Mecanismo que decide qual `orgId` uma página serve, a partir do hostname que a serviu (`domains/{hostname}`). |
| **White Label** | Aplicação automática de identidade visual/contato de cada organização (branding, favicon, textos) via projeção pública curada. |
| **Feature Flag** | Kill-switch/rollout gradual de uma funcionalidade, independente de deploy, por organização. |
| **Sandbox oficial** | O único tenant de demonstração/QA da plataforma (`org_teste_etapa10`), nunca dados reais. |
| **Provisionamento** | Criação idempotente e auditada de um tenant novo (`provisionOrganization`) — organização + Master + módulos + billing + branding + CMS mínimo. |

Termos específicos de negócio do tenant CCBMG (Associado, Associado Mirim, Anuidade, Lote, Arrematação etc.) ficam em `clubedocavalobonfimmg/docs/GLOSSARY.md` — não pertencem à plataforma como produto.

---

## Segurança — pendências conhecidas

Auditoria de prontidão comercial completa (isolamento cross-tenant, escalada de privilégio, billing, backup, alertas): `docs/roadmap/AUDITORIA_FINAL_RC1_REPORT.md` — resultado GO WITH CONDITIONS, achados P2/P3 aceitos como dívida técnica (forja de `systemLogs`, cobertura parcial de `functions.logger` nos alertas, conta Asaas compartilhada entre tenants, ausência de resolução hostname→orgId em tempo real — este último já resolvido pelas Fases 3.9/3.10, ver `docs/roadmap/`).

**Achado da reorganização de documentação de agosto de 2026 — CORRIGIDO** na redesign do motor de Planos/Módulos/Pricing (mesmo mês): `admin/plans.html` chamava `requirePlatformAccess()` sem restringir `requiredRole`, então qualquer papel de plataforma (inclusive `operator`, que deveria ser só leitura) via os controles de criar/editar/excluir plano na UI — nunca foi uma falha explorável (a Rule já exigia `isPlatformAdministrator()`), só uma inconsistência de UX. Corrigido junto com o resto da fase: `plans.html`/`module-catalog.html` agora espelham o gate `canManage` (`myRole === "administrator" || myRole === "owner"`) já usado por `feature-flags.html`, e a escrita de `systemPlans`/`moduleCatalog` passou de `isPlatformAdministrator()` direto do cliente para `write: if false` (Cloud Function-only) — reforço estrutural, não só cosmético.

---

## Regras de Desenvolvimento

1. Sem build step — HTML/CSS/JS vanilla, servido estático via GitHub Pages.
2. `?v=` como cache-busting manual em todo import do núcleo compartilhado (`shared/`) — o Cloudflare em frente a `portalassociativo.com.br` cacheia por até 4h; esquecer o bump é a causa mais comum de "corrigi mas não mudou nada" nesta plataforma.
3. Nunca duplicar no núcleo compartilhado (`shared/`) vocabulário de papel de um tenant específico, efeito colateral automático disparado só por importar, schema de negócio de um tenant, ou caminho de redirecionamento hardcoded — ver `shared/README.md`, "O que nunca vai para o núcleo".
4. Firestore Rules são a autoridade real de autorização — nunca confiar só em esconder um botão na UI (ver achado de `plans.html` acima).
5. Antes de documentar uma decisão nova aqui, avaliar se é mecanismo de plataforma (fica neste arquivo/`docs/`) ou fato específico de um tenant (fica no repositório daquele tenant).

---

## Estrutura da documentação deste repositório

```
docs/
├── README.md            — índice
├── architecture/         — decisões de arquitetura técnica
├── brand-system/         — Brand & Design System, Direção Criativa, Identidade Visual, Arquitetura de Experiência
├── design-system/        — onde vivem os tokens/componentes CSS
├── copywriting/ marketing/ seo/ ui/ ux/  — estado do site institucional por disciplina
├── glossary/             — glossário de termos da plataforma
└── roadmap/              — histórico fase a fase (site institucional + plataforma SaaS), índice em roadmap/README.md
```

Para o roadmap completo e o histórico de decisões por fase, ver `docs/roadmap/README.md`. Este `CLAUDE.md` é o estado atual; os relatórios de `docs/roadmap/` são o registro histórico de como se chegou até aqui.
