# Fase 3.5 — Identidade do Tenant e Domínios — Relatório Final

**Status: implementação concluída, aguardando aprovação explícita para commit/push/deploy** (nos dois repositórios).

---

## 1. Resumo executivo

A Fase 3.4 tornou `organizations/{orgId}` administrável de verdade, mas nada consumia esses dados — CCBMG continuava com nome, cores, logo e favicon 100% hardcoded no HTML/CSS estático, e o campo `dominio` era texto livre sem unicidade garantida. Esta fase constrói o lado de consumo, reaproveitando integralmente a infraestrutura da 3.4: nenhum campo novo de branding foi criado.

Dois pontos mudaram o desenho antes de eu implementar, ambos verificados no código antes de decidir, não assumidos:

1. **`organizations/{orgId}` não podia mais ser aberto pra visitante anônimo** — a própria Fase 3.4 adicionou campos não-públicos (`observações` internas, `billingConfig`, `integrations`), e a regra de leitura (login + mesma organização) corretamente reflete isso. Como branding precisa aparecer antes de qualquer login, expor o documento inteiro vazaria esses campos. Resolvido com uma projeção curada (`organizations/{orgId}/public/branding`), no mesmo padrão que o próprio projeto já usa em `users/{uid}/finance/summary` — não é uma abstração nova, é o padrão existente aplicado onde a necessidade é real.
2. **A resolução de tenant por hostname genuína (Firestore, a cada carregamento de página) foi deliberadamente NÃO implementada nesta fase** — hoje cada deployment (GitHub Pages, `CNAME` único por repositório) já serve uma única organização, então a pergunta "qual orgId?" tem sempre a mesma resposta conhecida estaticamente. Uma consulta de rede no boot de toda página pública adicionaria latência e um novo modo de falha sem nenhum ganho observável, contrariando a diretriz "priorize a solução simples". O que existe: `getTenant()` agora inclui `domain: location.hostname` (síncrono, sem I/O) e `domains/{hostname}` já existe como registro de governança — a mudança de comportamento em si fica documentada como próximo passo, dependente de uma decisão de hospedagem que é maior que esta fase (ver seção 6).

## 2. Arquitetura

### `domains/{hostname}` — registro e unicidade

Coleção nova, com o hostname normalizado como ID do documento (leitura por ID, sem query, sem índice composto). Único escritor: `setOrganizationDomains` (Cloud Function, `functions/lib/domains.js` no CCBMG), gate `requirePlatformAdministrator`. Garante de verdade o que o escopo pediu — "nenhum domínio pode estar associado a mais de uma organização": antes de escrever qualquer coisa, verifica se cada hostname (principal + adicionais) já pertence a outra organização e rejeita com `already-exists` se sim. Espelha o domínio principal em `organizations/{orgId}.dominio` (campo que já existia desde antes desta fase — outras telas continuam lendo dele sem mudança). Remove do Firestore os domínios adicionais que saíram da lista num salvamento seguinte (não deixa resíduo).

Gerido pela Central de Configuração → Geral (`admin/organization-detail.html`): o campo de texto livre "Domínio" virou "Domínio principal" + uma lista de "Domínios adicionais" (adicionar/remover), chamando a Cloud Function ao clicar Salvar — mesmo padrão de auditoria por categoria estabelecido na Fase 3.4 (`org_dominio_atualizado` fica registrado via `writePlatformAuditLog`, não `logPlatformAction` client-side, porque a escrita de verdade acontece na Cloud Function).

### `organizations/{orgId}/public/branding` — a peça que faltava pra consumir com segurança

Trigger `onOrganizationWritten` (`functions/lib/organizationPublicSync.js`, `onWrite` em `organizations/{orgId}`) mantém essa projeção sincronizada automaticamente sempre que o documento pai muda — cobre tanto a Central de Configuração quanto qualquer edição legada no painel antigo do CCBMG, sem depender de nenhuma tela lembrar de sincronizar manualmente. A lógica de "o que é seguro expor" (`computePublicBrandingProjection`) fica isolada num módulo puro, testável sem Firestore, com um teste que prova explicitamente que campos sensíveis (`observações`, `billingConfig`, `integrations`) NUNCA entram na projeção, mesmo quando presentes no documento de origem.

### Consumo — `shared/core/tenant/branding.js` + `firebase.js`

`branding.js` (Portal Associativo, novo) espelha `modules.js` linha por linha no padrão: `getOrgBranding()` lê a projeção pública com cache de 10 min em `sessionStorage`; `applyBranding()` aplica favicon, `--brand`/`--brand-dark` (CSS custom properties) e marcadores `[data-tenant-name]`/`[data-tenant-logo]` (adicionados na navbar das 7 páginas públicas do CCBMG) — só sobrescrevendo o que o branding realmente tem, então o HTML/CSS estático de cada página continua sendo o fallback automático quando o branding está vazio ou indisponível (nunca quebra a página). `firebase.js` do CCBMG chama `applyBranding()` automaticamente ao ser importado, no mesmo padrão de efeito colateral já usado (e documentado como deliberadamente fora do núcleo) pelo `_initNavbarUser`.

## 3. Trade-offs e decisão mais consequente

A decisão mais importante desta fase foi **o que não fazer**: não implementar a consulta real a `domains/{hostname}` dentro de `getTenant()`. O escopo original pedia "toda resolução deve passar pelo Tenant Resolver" — e passa, no sentido em que nenhuma página lê `orgId` de uma constante solta (isso já valia desde a Fase 3.1). O que não existe ainda é o *hostname* determinando *qual organização* — porque, estruturalmente, com um deployment por organização (GitHub Pages, um `CNAME`), essa pergunta não tem ambiguidade nenhuma pra resolver em runtime. Implementar a consulta de qualquer forma teria dois efeitos negativos reais: uma leitura de rede a mais em todo boot de página pública, e um novo modo de falha (Firestore indisponível bloqueando a resolução de tenant) para um resultado que hoje é sempre o mesmo. Documentei isso no próprio código (`tenant-context.js`) e no `CLAUDE.md`, para quando a decisão de hospedagem (Firebase Hosting ou proxy) for tomada — nesse momento, a mudança é só no corpo de `getTenant()`, nenhum consumidor precisa mudar.

## 4. Arquivos modificados

**CCBMG:**
- `firestore.rules` — `domains/{hostname}` (leitura pública, escrita só Cloud Function) e `organizations/{orgId}/public/{docId}` (leitura pública, `list` sempre bloqueado, escrita só Cloud Function).
- `functions/lib/domains.js` (novo) — `createDomainsService({db, serverTimestamp})` → `setOrganizationDomains`.
- `functions/lib/organizationPublicSync.js` (novo) — `computePublicBrandingProjection` (lógica pura, testável).
- `functions/index.js` — exports `setOrganizationDomains` (callable) e `onOrganizationWritten` (trigger).
- `functions/test/domains.test.js` (novo, 6 testes), `functions/test/organization-public-sync.test.js` (novo, 5 testes), `functions/test/rules.test.js` (+7 testes), `functions/test/run-all.js` (registro dos 2 arquivos novos).
- `firebase.js` — import de `branding.js`, `applyBranding()` automático (mesmo padrão do navbar), versão do núcleo compartilhado atualizada em todos os imports (`2026.08.2` → `2026.08.4`).
- `index.html`, `events.html`, `classificados.html`, `gallery.html`, `partners.html`, `board.html`, `sobre.html` — atributos `data-tenant-logo`/`data-tenant-name` na navbar (aditivo, sem reestruturar HTML).
- `CLAUDE.md` — seção "Fase 3.5" + schema de `domains`/`organizations/{orgId}/public/branding`.

**Portal Associativo:**
- `shared/core/tenant/branding.js` (novo) — `createBrandingResolver({db, getOrgId, ...})` → `getOrgBranding`, `applyBranding`.
- `shared/core/tenant/tenant-context.js` — `getTenant()` inclui `domain: location.hostname`; comentário de arquitetura atualizado explicando o porquê de ainda não consultar `domains/{hostname}`.
- `shared/README.md`, `shared/CHANGELOG.md` (`2026.08.4`).
- `admin/organization-detail.html` — aba Geral: "Domínio principal" + lista de "Domínios adicionais" (add/remove), chamando `setOrganizationDomains` no salvar.
- `docs/roadmap/README.md` + este relatório.

## 5. Segurança

- **Validado**: `organizations/{orgId}` completo continua negado pra leitura anônima (teste de regressão explícito em `rules.test.js` — a lacuna que a projeção pública resolve não pode ser reaberta por engano). `domains`/`organizations/{orgId}/public/branding` são públicos só pro que precisam ser (índice de roteamento sem dado sensível; branding curado sem observações/billing/integrações) — `list` bloqueado em ambos onde fazia sentido evitar enumeração. Escrita client-side sempre negada nos dois — só Cloud Functions escrevem, garantindo unicidade de domínio e curadoria de branding por construção, não por convenção.
- **Achado de operação, não de segurança de dados**: verifiquei ao vivo (Chromium headless, servindo os dois repositórios localmente) que, se o `firebase.js` do CCBMG for publicado ANTES do núcleo compartilhado do Portal Associativo (`shared/core/tenant/branding.js`) estar no ar, o import estático falha (404) e o módulo inteiro de `firebase.js` deixa de executar silenciosamente — sem erro visível pro usuário, mas login, banners, botão de admin e tudo que depende de `firebase.js` param de funcionar em todas as páginas do CCBMG. Reproduzido e depois revertido com interceptação de rota simulando os dois repositórios publicados juntos — nesse cenário tudo volta a funcionar normalmente (zero erro de console, `currentOrgId` resolvido corretamente, branding aplicando o fallback estático corretamente quando não há dado ainda). **Implicação operacional pro momento do push**: publicar o Portal Associativo primeiro, confirmar que `shared/core/tenant/branding.js?v=2026.08.4` está acessível em produção, só then publicar o CCBMG.
- **Risco remanescente**: nenhuma validação de formato de domínio além do básico (contém ponto, sem espaço) — não valida se o domínio realmente aponta pra infraestrutura da plataforma (não existe verificação de DNS nesta fase, documentado como fora de escopo). Um Platform Administrator mal-intencionado ou descuidado poderia cadastrar um domínio que não controla — mesmo nível de confiança já depositado em outras ações administrativas de plataforma (ex.: `provisionOrganization`), não uma regressão.

## 6. Testes

| Suíte | Resultado |
|---|---|
| `functions/test` (emulador, Admin SDK) | **128 passed, 0 failed** (117 pré-existentes + 11 novos: 6 de `domains.test.js`, 5 de `organization-public-sync.test.js`) |
| `functions/test/rules.test.js` (Firestore Rules de verdade) | **28 passed, 0 failed** (21 pré-existentes + 7 novos — cobrindo leitura pública de `domains`/projeção de branding, `list` restrito/bloqueado, escrita sempre negada, e a regressão de segurança confirmando que `organizations/{orgId}` completo continua fechado pra anônimo) |
| `functions/test/storage-rules.test.js` (Storage Rules) | **8 passed, 0 failed** — sem mudança nesta fase, rodado como rede de segurança |
| e2e do CCBMG (Playwright, contra Firebase de produção) | **1258 passed, 86 failed** — idêntico byte a byte à baseline da Fase 3.4, mesmas 2 categorias pré-existentes (versão do Bootstrap desatualizada + checagem de dado de produção não relacionada). Zero drift, zero categoria nova, zero falha em qualquer página tocada por esta fase (as 7 páginas públicas + `organization-detail.html`) |
| Smoke test manual (Chromium headless) | 7 páginas públicas do CCBMG carregando sem erro de console, favicon/cor/nome/logo com fallback estático correto (sem dado no Firestore ainda); `organization-detail.html` com a nova UI de domínio carregando sem erro e redirecionando corretamente pro login quando não autenticado; achado de ordem de publicação (seção 5) reproduzido e confirmado corrigido quando os dois repositórios estão disponíveis juntos |

## 7. Pendências (deliberadamente fora desta fase)

- **Resolução hostname→orgId via Firestore no boot de cada página** — depende de uma decisão de hospedagem (Firebase Hosting ou proxy) ainda não tomada, gap G4 de `docs/SAAS_MULTITENANT.md` (CCBMG). `domains/{hostname}` e `getTenant().domain` já existem prontos para quando essa decisão acontecer.
- **HTTPS para múltiplos domínios** — o único domínio real hoje já tem TLS via GitHub Pages/Let's Encrypt, sem mudança necessária; um segundo domínio depende da mesma decisão de G4.
- **Verificação de propriedade de DNS** — `domains/{hostname}.status` fica fixo em `"verificado"` nesta fase; não há fluxo de pendência/verificação automática.
- **Seed de branding/domínio de `org_bonfim`** — os campos `logoUrl`/`corPrimaria`/`corSecundaria` de `organizations/org_bonfim.config` e o registro `domains/clubedocavalobonfim.com.br` precisam ser preenchidos pela própria Central de Configuração depois do deploy (a Cloud Function `setOrganizationDomains` e o trigger `onOrganizationWritten` só existem depois de publicados) — não é um código pendente, é um passo operacional de pós-deploy.
- White Label completo, editor de tema, múltiplos layouts, Landing Pages por organização, Billing da Plataforma, Marketplace, Analytics, API pública, IA — todos explicitamente fora do escopo desta fase, sem nenhum código/estrutura fabricado antecipadamente pra eles.

## 8. Reconciliação com `docs/SAAS_MULTITENANT.md` (CCBMG)

Esse documento (655 linhas, produzido numa fase de diagnóstico anterior) propõe um roadmap próprio de 9 fases (Fase 0 a 8, numeração independente da "Fase 3.x" da plataforma) para o multi-tenant real por domínio. Esta Fase 3.5 da plataforma cobre uma fatia especfica desse roadmap maior:

| Fase de `SAAS_MULTITENANT.md` | Coberto por esta fase? |
|---|---|
| Fase 0 — Hardening de isolamento (G2/G3) | Não é desta fase — G3 (Firestore Rules por organização) já foi substancialmente endereçado nas Fases 3.2/3.3 da plataforma (escrita sempre exige mesma organização); G2 (Cloud Functions administrativas em massa sem filtro de `orgId`) segue pendente, fora do escopo de identidade/domínio |
| Fase 1 — Modelo de dados de domínios | **Coberto** — `domains/{hostname}` existe, com unicidade real e gestão pela Central de Configuração |
| Fase 2 — Decisão e migração de hospedagem (G4) | **Não coberto, documentado como bloqueio explícito** — decisão de produto/infra maior que esta fase |
| Fase 3 — Resolução dinâmica de tenant no boot | **Não coberto, deliberadamente** — depende da Fase 2 daquele roadmap; `getTenant()` está pronto pra receber a mudança quando a hospedagem permitir |
| Fase 4 — Tenant Context completo + branding dinâmico | **Parcialmente coberto** — branding (logo/cores/nome/favicon) está consumido e aplicado automaticamnte; planos de mensalidade/dias de carência configuráveis por organização (G9) continuam fora, não fazem parte do escopo desta fase |
| Fase 5 — Onboarding de nova organização | Já coberto por outra frente — `provisionOrganization` (Fase 3.3 da plataforma) resolve isso independentemente da numeração de `SAAS_MULTITENANT.md` |
| Fase 6 — Site institucional | Fora de escopo, já existe (`portalassociativo.com.br`) |
| Fase 7 — Migração formal do Bonfim | Depende da Fase 3 (não coberta) — nada a fazer ainda |
| Fase 8 — Piloto com 2º tenant real | Depende de tudo acima |

---

## Publicação

Nada foi commitado, enviado ou implantado, em nenhum dos dois repositórios. Aguardando aprovação explícita, conforme instruído.

**Nota operacional para quando a publicação for aprovada** (ver seção 5): publicar primeiro o Portal Associativo, confirmar `shared/core/tenant/branding.js?v=2026.08.4` acessível em produção, só então publicar o CCBMG — evita a janela de módulo quebrado descrita acima.
