# Fase 3.1 — Novo Painel Master — Relatório Final

**Status: implementação concluída, aguardando aprovação explícita para commit/push/deploy** (conforme instrução — nada foi publicado).

---

## 1. Resumo executivo

O Painel Master — a ferramenta que administra a plataforma inteira — deixou de existir como 5 páginas HTML dentro do repositório do CCBMG (com identidade visual, textos e dados de exemplo do próprio clube) e passou a existir como um produto novo, dentro do **Portal Associativo**, em `admin/`. Não foi uma migração de páginas: a navegação foi redesenhada (7 áreas em vez de 4, "Organização" virou uma entidade com página própria e abas em vez de estar espalhada em telas de topo), o catálogo de módulos e o catálogo de planos deixaram de ser constantes JavaScript duplicadas e viraram dado real no Firestore, e todo KPI do dashboard é computado a partir de dados reais — nenhum número hardcoded.

O painel antigo do CCBMG **continua no ar, inalterado**, funcionando em paralelo. Nada neste repositório ou no CCBMG foi publicado.

## 2. Nova arquitetura

- **Onde vive:** `portal-associativo/admin/` — diretório novo, paralelo a `pages/` (site público) e `shared/` (núcleo). 8 páginas HTML + `admin/assets/` (3 scripts JS locais desta aplicação).
- **Autenticação:** `admin/assets/admin-auth.js` chama `initTenantFirebase()` do núcleo compartilhado diretamente, com a config do projeto `clubecavalobonfim` (mesmo projeto Firebase do CCBMG — decisão de arquitetura já tomada antes desta fase, não nova). Não usa o contrato `tenant.config.js`/`getTenant()`: esse contrato pressupõe "1 site = 1 organização fixa", e o Painel Master administra todas as organizações — usá-lo teria sido forçar um encaixe errado.
- **Ponto único de autorização:** toda página chama `requirePlatformAccess()`, definida uma vez em `admin-auth.js`. Quando a Fase 3.2 trocar "role === master" por um lookup real em `platformAdmins/{uid}` (separação Platform Admin × Organization Master), existe exatamente **um lugar** para mudar — nenhuma das 8 páginas precisa saber como a autorização é resolvida por dentro.
- **Navegação:** `admin/assets/admin-nav.js` monta a sidebar + topbar mobile via injeção de DOM (`renderAdminNav({active})`), chamado uma vez por página.
- **Sem build step:** mesmo padrão dos dois repositórios — HTML servido direto pelo GitHub Pages, ES Modules puros, sem bundler.

## 3. Mapa de navegação

```
Login (sem nav)
├─ Dashboard      → KPIs reais da plataforma
├─ Organizações    → lista (busca + paginação) + detalhe (abas: Dados · Módulos · Assinatura · Configurações)
├─ Planos           → CRUD real de systemPlans (substituiu PLAN_MODULES hardcoded)
├─ Assinaturas       → visão cross-org de organizationSubscriptions (edição vive na aba da organização)
├─ Módulos            → visão cross-org de uso, catálogo descoberto a partir do dado, não de constante
├─ Auditoria           → systemLogs completo, paginado e filtrável
└─ Configurações        → systemConfig/global (identidade da plataforma, e-mails de notificação)
```

Ficaram fora desta fase (por decisão explícita do escopo, não esquecimento): "Usuários" (gestão de operadores internos — Fase 3.2), "Branding"/"White Label" como telas de topo (Fase 3.4/3.5 — só os campos foram reservados dentro de Configurações da organização), "Sistema" separado (o pouco que existe cabe dentro de Configurações).

## 4. Componentes criados

Todos em `shared/` (versão `2026.08.3` do `CHANGELOG.md`) — genéricos, não específicos do Painel Master, qualquer tenant herda:

| Arquivo | O que é |
|---|---|
| `shared/utils/list-controls.js` | `createListController({data, pageSize, searchFields})` — paginação e busca client-side, puro (sem Firebase/DOM), testado isoladamente antes de integrar. |
| `shared/components/pagination.css` | `.ds-pagination`/`.ds-pagination-btn`/`.ds-pagination-info` — companheiro visual de `list-controls.js`. |
| `shared/components/toast.css` | `.ds-toast-container`/`.ds-toast` (+ variantes success/warning/danger) — usa o token `--z-toast`, que existia desde a fundação do Portal Associativo sem nenhum componente que o consumisse. |
| `shared/components/sidebar.css` (ampliado) | `.ds-admin-topbar`/`.ds-admin-topbar-toggle` — o botão que efetivamente abre a sidebar em mobile. **Antes desta fase, nenhuma tela administrativa de nenhum tenant tinha esse botão** — a sidebar simplesmente desaparecia em telas estreitas sem forma de reabrir. Corrigido no núcleo, não só no Painel Master: qualquer tela futura que use `.ds-sidebar` herda o botão. |

E, específico deste app (não genérico o bastante para `shared/`, fica em `admin/assets/`):

| Arquivo | O que é |
|---|---|
| `admin/assets/admin-auth.js` | Inicialização de Firebase + `requirePlatformAccess()` + `logPlatformAction()`. |
| `admin/assets/admin-nav.js` | Monta sidebar/topbar, liga toggle mobile e logout. |
| `admin/assets/pagination-ui.js` | Renderização DOM (prev/next + "X de Y") por cima de `list-controls.js` — fica fora de `shared/` porque é só marcação de `<button>`, não mecanismo. |

## 5. Componentes reaproveitados

- `shared/core/auth/{firebase-init,roles,session}.js` e `shared/core/tenant/audit.js` — mecanismo inteiro do núcleo, sem alteração de contrato.
- `shared/components/{kpi-card,data-table,modal}.css` e `shared/layouts/admin-shell.css` — já existiam prontos desde a Fase 0, nunca tinham tido um consumidor real além da PoC.
- Bootstrap 5.3.3 (já vendorizado) para tabs e modais — decisão explícita de **não** criar um componente de tabs novo; `admin_associados.html` do CCBMG já prova que `nav-tabs` resolve bem esse caso.
- Lógica de negócio (cálculo de MRR/ARR, detecção de plano a partir de módulos marcados, padrão "suspender = soft delete") — reaproveitada do painel antigo, só religada a dado real em vez de constante.

## 6. Código legado — o que foi descartado (na reconstrução, não removido do CCBMG ainda)

Nenhum arquivo do CCBMG foi apagado nesta fase — os 5 originais continuam no ar. O que foi **descartado no desenho do novo painel** (não replicado):

- `MODULE_NAMES`/`MODULES_ALL`/`PLAN_MODULES` hardcoded e duplicados (com ordens diferentes!) entre `admin_master.html` e `admin_master_associacoes.html` → viraram dado real (`organizations.modules`, `systemPlans`).
- `organizationSubscriptions.orgId` como texto livre digitado à mão, sem `<select>`, sem integridade referencial → doc ID agora é o próprio `orgId` (relação 1:1 com `organizations/{orgId}`).
- Botões "Executar Seed de Dados" e "Executar Migração orgId" (ferramentas de uso único da migração do CCBMG para multi-tenant, uma delas com `"org_bonfim"` hardcoded no texto de confirmação) → não têm equivalente na nova tela de Configurações; documentado ali mesmo o porquê.
- KPI "Lotes Publicados" no dashboard (módulo de leilão, vertical específico do CCBMG) → fora do dashboard genérico da plataforma.
- CSS de sidebar/KPI duplicado inline em cada uma das 4 páginas antigas → 1 shell + 1 script de montagem (`admin-nav.js`).
- 4 telas de topo separadas para a mesma organização → 1 lista + 1 página de detalhe com abas (padrão Stripe/Firebase Console/Vercel: a entidade tem uma página, não fragmentos espalhados).

A remoção efetiva dos 5 arquivos do CCBMG fica para uma aprovação de limpeza **separada**, depois do novo painel validado em produção — conforme a própria estratégia pedida ("eliminar código legado somente quando a nova versão estiver validada").

## 7. Melhorias de UX

- **Mobile deixa de ser inutilizável.** O painel antigo não tinha nenhum jeito de reabrir a sidebar em telas estreitas (ela só desaparecia). O novo tem topbar + botão de menu, testado estruturalmente (screenshots + verificação de estado do DOM antes/depois do clique).
- **Busca e paginação** em Organizações, Assinaturas e Auditoria — nenhuma lista antes tinha isso; carregava tudo de uma vez. Prev/next em vez de lista de números de página, para escalar a milhares de organizações sem virar uma barra de botões.
- **Página de organização unificada** em vez de fragmentada — editar dados, módulos, assinatura e configurações de uma organização acontece em um único lugar, com abas, em vez de navegar entre 4 telas.
- **Auditoria com filtro por organização e texto livre**, carregamento incremental (200 por vez) em vez do `limit(20)` fixo sem filtro nenhum de antes.
- **Nenhum número inventado no dashboard** — quando um dado não existe de verdade (erros críticos, saúde da plataforma), a tela diz isso explicitamente em vez de mostrar um placeholder.

## 8. Resultados dos testes

- **Navegação completa, 3 viewports (1440×900 desktop, 834×1112 tablet, 390×844 mobile):** as 9 páginas (login + 8 autenticadas) carregadas via servidor estático local e headless Chromium (Playwright). **Zero erros de console em qualquer página/viewport** — confirma que todos os imports de módulo (inclusive os locais para `shared/core/...`) resolvem corretamente. As 8 páginas autenticadas redirecionam corretamente para `login.html` sem sessão (comportamento correto e esperado de `requirePlatformAccess()` — nenhuma tela do painel vaza para quem não está logado).
- **Mecânica da sidebar/topbar mobile, isolada:** desktop mostra sidebar fixa e esconde a topbar; mobile mostra a topbar e a sidebar off-canvas (`x: -220px`); clique no botão de menu adiciona `.is-open` e o overlay aparece; clique no overlay fecha de novo. Todos os 6 checks passaram, zero erros JS.
- **`functions/test` (emulador Firestore+Auth, 73 testes):** `73 passed, 0 failed`. Esperado — nada em `functions/` foi tocado nesta fase; rodado mesmo assim como rede de segurança.
- **Suíte e2e do CCBMG (`npm run test:e2e`, Playwright):** `1258 passed, 86 failed` (3,5min). As 86 falhas são **100% das duas categorias já pré-existentes e documentadas na Fase 2C** — nenhuma categoria nova: 4 em `04-migration-data.spec.js` (2 checagens contra dado real de produção do Firestore × 2 projetos de browser) e 82 em `05-design-system-regression.spec.js` (string de versão do Bootstrap desatualizada, 41 páginas × 2 projetos). Zero falhas em qualquer outro arquivo de spec — em particular, zero em `08-asaas-firebase-integration.spec.js`/`11-central-financeira-asaas.spec.js` (os 2 arquivos que a Fase 2C precisou corrigir por causa do refactor de Cloud Functions). A baseline da Fase 2C registrava 85 falhas/1259 passed; a diferença de 1 teste aqui é esperada e não é uma regressão desta fase — `04-migration-data.spec.js` lê dado real de produção, então uma pequena variação de contagem entre execuções em momentos diferentes é normal, e nenhum arquivo do CCBMG foi tocado nesta fase (confirmado via `git status` antes de rodar). O total de testes (1344) é idêntico ao da baseline.
- **O que não foi possível testar sem credenciais reais de master:** o fluxo autenticado completo (login de verdade, criar/editar/suspender uma organização de teste, criar/editar um plano, conferir os KPIs contra dado real do Firestore) depende de uma conta master real — não fabriquei nem simulei login contra o projeto de produção. Este é o smoke test manual que o plano já previa como responsabilidade do dono do produto antes da aprovação final.

## 9. Riscos remanescentes

- **Smoke test autenticado ainda não executado** (ver item acima) — recomendo fazer esse passo antes de aprovar a publicação, não depois.
- **Maior superfície de UI construída de uma vez** neste repositório até agora (8 páginas novas, ~2.300 linhas). Mitigado por reaproveitar mecanismo já testado (`shared/core`) e por manter o painel antigo no ar em paralelo — comparação lado a lado é possível a qualquer momento, sem downtime.
- **Migração de `organizationSubscriptions`** (doc ID solto → doc ID = orgId) ainda não tem um script de backfill escrito — hoje só existe 1 documento em produção (o do próprio CCBMG). Antes de apontar o painel novo para produção de verdade, esse único documento precisa ser recriado com o novo ID (ou o painel vai mostrar "nenhuma assinatura registrada" para o CCBMG até isso ser feito). Baixo risco (1 documento), mas não deve ser esquecido no checklist de publicação.
- **Catálogo de módulos "descoberto por dado"** significa que uma organização nova, sem nenhum módulo ainda, não vê nenhum checkbox pré-populado na aba Módulos — precisa digitar as chaves manualmente na primeira vez (ou copiar de uma organização existente). Aceitável para hoje (1 tenant), mas vale revisitar quando a Fase 3.3 (provisionamento automático) definir um conjunto padrão por plano.

## 10. Recomendações para a Fase 3.2

- O ponto de entrada para a separação Platform Admin × Organization Master já está isolado: `requirePlatformAccess()` em `admin-auth.js` é o único lugar que decide "quem entra". Trocar a checagem de `role === "master"` para um lookup em uma coleção `platformAdmins/{uid}` (ou equivalente) não deveria exigir tocar em nenhuma das 8 páginas.
- Quando "Usuários" (gestão de operadores internos da Serafim Technologies) virar uma tela real, ela se encaixa naturalmente como um 8º item de navegação — a estrutura de `admin-nav.js` já suporta isso sem refatoração.
- O Billing Provider (Fases 2B/2C) já tem `registerBillingProvider()` extensível — quando a Fase 3.7 (billing da própria plataforma) chegar, a aba "Assinatura" da organização e a tela de Planos já têm o lugar certo para crescer (hoje é só estrutura administrativa, sem cobrança automática).

---

## Publicação

Nada foi commitado, enviado ou implantado. Aguardando aprovação explícita, conforme instruído.
