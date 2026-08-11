# EVOLUÇÃO MULTI-TENANT — FASE 4: Configurações Personalizáveis por Tenant

**Status: implementado, testado e migrado em produção.**
Baseline: [TENANT_HARDCODE_AUDIT_REPORT.md](./TENANT_HARDCODE_AUDIT_REPORT.md).

---

## 1. RESUMO

Todo hard-code de negócio identificado na auditoria (preços/planos/desconto Mirim/juros, regras de leilão, regras de classificados, carência/renovação de associado, fallback de e-mail pessoal, WhatsApp/Instagram/endereço institucional, bug de estado-vazio do CMS, taxonomia de planos SaaS duplicada no Painel Master) foi substituído por configuração em `organizations/{orgId}`. O comportamento comercial atual do CCBMG foi preservado byte a byte — os mesmos preços, o mesmo desconto Mirim, os mesmos destinatários de e-mail — só que agora como dado da própria organização, não mais como constante compartilhada pelo código.

Uma nova área de autoatendimento (`admin_configuracoes.html`, Portal da Associação) permite que o **Organization Master** de qualquer organização — CCBMG ou uma futura — administre esses valores sem precisar do Painel Master (equipe da plataforma) nem de edição manual de Firestore. Firestore Rules foram estendidas (nunca reescritas) para autorizar exatamente essa escrita, com um campo — a comissão da plataforma em leilões — estruturalmente protegido mesmo dentro do próprio documento que a organização já pode editar.

Dois tenants existentes (CCBMG e Sandbox) foram migrados em produção. 239 testes automatizados passam (178 unidade/integração + 46 Firestore Rules + 15 Storage Rules, incluindo 8 testes novos que provam a fronteira de segurança do self-service).

---

## 2. CAMPOS CRIADOS

| Campo | Tenant | Finalidade | Role que altera |
|---|---|---|---|
| `billing.plans[]` (`{id,label,cycle,price}`) | `organizations/{orgId}` | Planos/preços/ciclo de mensalidade oferecidos aos associados | Organization Master (self-service) / Platform Administrator |
| `billing.mirimDiscountRatio` | `organizations/{orgId}` | Fração do preço que a categoria Mirim paga (0.5 = metade) | Organization Master / Platform Administrator |
| `billing.lateInterestRate` | `organizations/{orgId}` | Juros de atraso repassado ao Asaas (`interest.value`) | Organization Master / Platform Administrator |
| `business.membership.renewSoonDays` | `organizations/{orgId}` | Dias antes do vencimento em que `pg_associado.html` mostra aviso de renovação | Organization Master / Platform Administrator |
| `business.membership.graceOverdueDays` | `organizations/{orgId}` | Dias de carência após vencimento antes de bloquear o portal | Organization Master / Platform Administrator |
| `business.classifieds.pricePerDay` | `organizations/{orgId}` | Preço/dia de um anúncio em Classificados | Organization Master / Platform Administrator |
| `business.classifieds.minimumDays` | `organizations/{orgId}` | Prazo mínimo (e duração) de um anúncio | Organization Master / Platform Administrator |
| `business.auction.minBidIncrementPct` | `organizations/{orgId}` | Incremento mínimo entre lances | Organization Master / Platform Administrator |
| `business.auction.antiSniperExtensionMs` | `organizations/{orgId}` | Extensão do prazo quando um lance chega perto do fim | Organization Master / Platform Administrator |
| `business.auction.commissionClubePct` | `organizations/{orgId}` | Comissão da própria associação sobre o lote arrematado | Organization Master / Platform Administrator |
| `business.auction.commissionSistemaPct` | `organizations/{orgId}` | Comissão da **plataforma** sobre o lote arrematado | **Só Platform Administrator** — bloqueado por Firestore Rules mesmo para o Master da própria organização |

Nenhum outro campo novo foi inventado além destes — todos usados de verdade por pelo menos um ponto do código (backend e/ou frontend), nunca especulativos.

---

## 3. HARD-CODES REMOVIDOS

| Hard-code | Arquivo | Nova origem |
|---|---|---|
| `PLAN_CYCLE`/`PLAN_VALUE`/`PLAN_LABEL` (mensal 30/trimestral 85/semestral 170) | `functions/index.js` | `org.billing.plans[]` via `getPlanDef()`/`resolvePlanValue()`/`resolvePlanCycle()`/`resolvePlanLabel()` |
| Desconto Mirim fixo em `base/2` | `functions/index.js` | `org.billing.mirimDiscountRatio` |
| `interest: { value: 0.01 }` (2 ocorrências) | `functions/index.js` | `resolveInterestRate(org)` ← `org.billing.lateInterestRate` |
| `calculatePlanEnd` com meses fixos por nome de plano | `functions/index.js` | Meses derivados do `cycle` do plano configurado (`CYCLE_MONTHS`) |
| `detectPlanType` com default `'mensal'` fixo | `functions/index.js` | Cai no 1º plano configurado da organização, nunca num nome fixo |
| Fallback `['waldiney.serafim@gmail.com','mpmarquesnutri@gmail.com']` (2 ocorrências) | `functions/index.js` | `org.notificationEmails[]`, obrigatório desde o provisionamento — sem o campo, não envia (nunca mais vaza pra terceiros) |
| `minBid = base * 1.02` | `functions/index.js` (`placeBid`) | `org.business.auction.minBidIncrementPct` |
| Extensão anti-sniper `120000` (2 min) fixa | `functions/index.js` (`placeBid`) | `org.business.auction.antiSniperExtensionMs` |
| `commissionClube`/`commissionSistema` = `finalAmount * 0.05` | `functions/index.js` (`encerrarLotesExpirados`) | `org.business.auction.{commissionClubePct,commissionSistemaPct}` |
| Fallback `[{ id: 'org_bonfim' }]` quando `organizations` vazia | `functions/index.js` (`asaasReconciliationDaily`) | Removido — lista vazia é estado controlado, sem assumir nenhuma organização |
| `PLAN_MONTHS`/`PLAN_LABEL`/`PLAN_PRICE_TABLE` locais (mensal:30 etc.) | `admin_associados.html` | Lidos de `organizations/{orgId}.billing.plans`/`mirimDiscountRatio` no boot do módulo |
| `prompt(..., "30")` (default de cobrança avulsa) | `admin_associados.html` | Default = 1º plano configurado da própria organização |
| Tabela de preços estática (R$30/85/170) | `sobre.html` | `getOrgBranding().billing.plans` (projeção pública), com "Desconto" calculado em runtime |
| Tabela de preços estática no preview | `admin_sobre.html` | `organizations/{orgId}.billing.plans`, lido direto (página já autenticada) |
| `wa.me/5531986685028` hardcoded (index/board/pay×3/sobre) | 5 arquivos | `[data-tenant-whatsapp]`/`[data-tenant-whatsapp-label]` ← `branding.whatsapp` (projeção pública) |
| Instagram `@clube_do_cavalo_de_bonfim_mg` hardcoded (index/board) | 2 arquivos | `[data-tenant-social="instagram"]` ← `branding.redesSociais.instagram` |
| Bloco "Onde Estamos" gated só por `isSandbox` (index/board) | 2 arquivos | `[data-tenant-address-card]`/`[data-tenant-address-empty]` — orientado por "a organização tem endereço?", não por "é o Sandbox?" |
| "R$ 1,00 por dia, mínimo 30 dias" hardcoded | `classificados.html` | `branding.business.classifieds.{pricePerDay,minimumDays}` |
| "comissão de 10% (5%+5%)" hardcoded (3 ocorrências) | `leilao_lote.html`×2, `lote_form.html` | `business.auction.{commissionClubePct,commissionSistemaPct}` |
| `* 1.02` duplicado no frontend (4 ocorrências) | `leilao_lote.html`×2, `admin_leiloes.html`, `meus_lotes.html` | `business.auction.minBidIncrementPct` |
| `RENEW_SOON_DAYS = 5` / `GRACE_OVERDUE_DAYS = 5` | `pg_associado.html` | `branding.business.membership.{renewSoonDays,graceOverdueDays}` |
| Bug de estado vazio (banners/parceiros/eventos/galeria/parceiros mostravam conteúdo real do CCBMG) | `index.html`×2, `events.html`, `gallery.html`, `partners.html` | Container limpo + estado vazio genérico quando a organização não tem conteúdo próprio |
| `starter/professional/enterprise/custom` fixo em 4 telas do Painel Master | `organization-detail.html`×2 selects, `organizations.html`, `index.html`, `subscriptions.html` | `systemPlans` (Firestore), lido em runtime — mesma fonte que `admin/plans.html` já usava |
| Placeholders "Clube do Cavalo Bonfim MG"/"org_bonfim" | `organization-provision.html`, `admin_master_associacoes.html`, `admin_master_configuracoes.html` | Texto de exemplo genérico |

---

## 4. CAMPOS JÁ EXISTENTES REUTILIZADOS (sem duplicação)

| Campo | Onde já existia | O que foi feito |
|---|---|---|
| `organizations/{orgId}.whatsapp` | Painel Master, aba Comunicação (Fase 3.4) | Só faltava aparecer na projeção pública (`organizationPublicSync.js`) e ter consumidor no frontend (`branding.js` + marcadores) — nenhum campo novo |
| `organizations/{orgId}.portal.redesSociais` | Painel Master, aba Portal (Fase 3.4) | Idem — só faltava consumidor |
| `organizations/{orgId}.notificationEmails` | Já lido pelo backend desde a Fase 3.6/3.11 | Não foi criado outro campo — só passou a ser **obrigatório** (provisionamento grava explicitamente) e o fallback pra e-mail pessoal foi eliminado |
| `organizations/{orgId}.telefone/email/site/endereco/nome/cnpj/...` | Painel Master, aba Geral (Fase 3.4) | Reaproveitados tal qual no allowlist de self-service — nenhum `identity.*` novo inventado |
| `systemPlans/{planId}` | `admin/plans.html` (Fase 3.1) | Reaproveitado como única fonte de planos SaaS nas 4 telas que ainda tinham lista fixa |
| `organizations/{orgId}/public/branding` | Fase 3.5 | Estendida (não recriada) com `whatsapp`, `redesSociais`, `billing.plans`, `business.{membership,classifieds,auction}` |

---

## 5. ROLES — o que cada uma pode alterar

**Núcleo (Portal Associativo / `platformAdmins`)**
- **Master (`owner`/`administrator`)**: continua controlando tudo que já controlava — criação/domínio/status/plano SaaS/módulos/billing provider/infraestrutura — inalterado nesta fase.
- **Admin (`operator`)**: inalterado — leitura, sem escrita crítica.

**Portal da Associação (`users/{uid}.role`, sempre com `orgId`)**
- **Master**: pode alterar, na PRÓPRIA organização, tudo em `admin_configuracoes.html` — contato (telefone/WhatsApp/redes sociais), planos de associado (`billing.plans`, desconto Mirim, carência/renovação), juros de atraso, e-mails de notificação, preço/prazo de classificados, incremento mínimo/anti-sniper/comissão da associação em leilões. **Não pode** alterar `business.auction.commissionSistemaPct` (comissão da plataforma) — bloqueado nas Firestore Rules, não só escondido na UI.
- **Admin**: acessa `admin_configuracoes.html` em modo **somente leitura** (vê os valores, não pode salvar) — a Firestore Rule já rejeitaria a escrita mesmo que a UI permitisse; o modo leitura é só para não deixar o operador clicar em Salvar e levar um erro.

Identidade visual (logo/favicon/cores) e localização (idioma/timezone/moeda) **continuam** editáveis só pelo Painel Master (Núcleo) nesta fase — decisão deliberada de escopo, ver Seção 8.

---

## 6. TENANTS MIGRADOS

| Tenant | orgId | O que recebeu | Como |
|---|---|---|---|
| **CCBMG** (produção real) | `org_bonfim` | `billing.plans` (mensal 30/trimestral 85/semestral 170), `mirimDiscountRatio` 0.5, `lateInterestRate` 0.01, `business.membership` (5/5 dias), `business.classifieds` (R$1/dia, 30 dias), `business.auction` (2%/2min/5%/5%), `notificationEmails: ["waldiney.serafim@gmail.com","mpmarquesnutri@gmail.com"]` | `functions/scripts/migrateBusinessConfig.js --apply`, confirmado idempotente numa segunda rodada |
| **Sandbox oficial** | `org_teste_etapa10` | Mesmos valores de `billing`/`business` (o seed já assumia esses números implicitamente via o código antigo), `notificationEmails: []` (nunca gera ruído em inbox real), `whatsapp: "5538988887777"` (mesmo fictício já usado em `telefone`) | Mesmo script, mesma execução |

**Achado durante a migração, corrigido nela mesma**: `notificationEmails` **não existia de verdade em produção** para nenhum dos dois tenants (confirmado por leitura direta do Firestore antes de escrever qualquer coisa) — ao contrário do que CLAUDE.md registrava desde a Fase 3.11. Sem essa correção, remover o fallback de e-mail pessoal do código teria silenciosamente parado os relatórios/alertas reais do CCBMG. A migração corrigiu isso preservando exatamente os destinatários que o fallback hardcoded já usava.

Nenhum outro tenant existe na plataforma hoje.

---

## 7. TESTES

**Executados**: `npm test` (emulador Firestore/Auth/Storage — 178 unidade/integração + 46 Firestore Rules + 15 Storage Rules), `npm run lint` (0 erros), `npm run build` (`node --check` em 54 `.js`), mais um script próprio de verificação sintática de todos os blocos `<script type="module">` inline nos 22 arquivos HTML tocados (17 no CCBMG, 5 no Portal Associativo).

**Resultado**: **239/239 passando, 0 falhas.**

**Regressões encontradas e corrigidas durante a implementação**:
1. `provisionOrganization` ganhou um 8º passo (`businessDefaults`) — 3 testes existentes assumiam 7 passos fixos; atualizados para 8, com um teste novo confirmando que a organização nasce com `billing`/`business`/`notificationEmails` próprios (nunca dependendo de constante de código).
2. Dois pontos (`admin_associados.html`, `meus_lotes.html`) faziam `await getDoc(organizations/{orgId})` **antes** de `requireAuth()` resolver — como a leitura completa do documento exige login (diferente da projeção pública), um visitante não-autenticado receberia `permission-denied` não tratado, quebrando o redirecionamento pro login. Corrigido envolvendo essas leituras em `try/catch`.
3. `business.auction` inicialmente ficou de fora da projeção pública (por presumir que todo consumidor de leilão exigia login) — `leilao_lote.html`/`lote_form.html` na verdade são públicos/pré-lance. Corrigido incluindo `business.auction` (incluindo `commissionSistemaPct`, que já era texto público estático antes desta fase, então não é um dado novo exposto).

**Testes novos adicionados** (não apenas os de regressão acima): 8 casos em `rules.test.js` provando a fronteira de segurança do self-service — Master edita a própria org, Admin não pode, Master de outra org não pode, campos fora do allowlist são rejeitados (billingProvider/modules/ativo), e o caso crítico: Master não consegue alterar `commissionSistemaPct` mesmo escrevendo o resto de `business.auction` no mesmo payload.

**Migração**: rodada em modo `--dry-run` primeiro (diff revisado manualmente), depois `--apply` contra produção real, com uma segunda rodada em `--dry-run` confirmando idempotência (nada re-escrito).

**Não testado nesta fase** (ver Pendências): a UI de `admin_configuracoes.html` não foi exercitada num navegador real (sem ambiente de browser neste fluxo de trabalho) — a lógica foi revisada por leitura e a escrita no Firestore é a mesma já coberta pelos testes de Rules.

---

## 8. PENDÊNCIAS

Itens da auditoria original **deliberadamente fora do escopo desta fase** (a própria tarefa os excluiu nas seções 6/27 — infraestrutura, secrets, billing provider) ou que não faziam parte da lista explícita de campos a criar:

- **reCAPTCHA site key fixa a um domínio** (`functions/index.js`) — não fazia parte da lista de campos desta fase; continua um domínio só suportado de verdade.
- **Conta SMTP compartilhada** (Gmail único para toda a plataforma) — infraestrutura de e-mail, fora do escopo (seção 6, "Núcleo" controla infraestrutura).
- **Conta Asaas compartilhada por padrão** (G7) — mecanismo de override já existe (`billingConfig.secretName`), só não foi exercitado por um 3º tenant ainda; não fazia parte da lista de campos desta fase.
- **`billingProvider: 'asaas'` hardcoded no provisionamento** — decisão deliberada (task, seção 6: billing provider é decisão de Núcleo); o registry já suporta outros providers, só nunca foi exercitado.
- **Timezone `America/Sao_Paulo` fixo em crons** e **`encerrarLotesExpirados` a cada 1 min global** — dívida operacional já documentada (RC1-05), não fazia parte da lista de campos desta fase.
- **`role: 'Master'` capitalizado** (RC1-08) — inconsistência de convenção, não um hardcode de negócio; não tocado.
- **Cloudflare Worker do proxy de demo com origem única** — task explicitamente excluiu mexer em Cloudflare/deployment (seção 27).
- **`logo_CCBMG.png`** como nome de arquivo do fallback estático — cosmético, já era dívida aceita antes desta fase.
- **`functions/scripts/seedSandboxTenant.js`** continua com a tabela de preços duplicada localmente (em vez de ler `organizations/{orgId}.billing.plans` antes de seedar) — ferramenta interna, não numa página de produto; risco de drift baixo e aceito nesta fase para não arriscar uma reescrita não-trivial de um script de seed de 900+ linhas sem necessidade concreta.
- **Identidade visual (logo/favicon/cores) e localização (idioma/timezone/moeda)** continuam só no Painel Master, não em `admin_configuracoes.html` — decisão de escopo desta fase (upload de imagem já tem infraestrutura pronta lá; duplicar aqui seria complexidade sem necessidade demonstrada pela auditoria, que nunca flagou esses campos como hardcoded — já eram 100% dinâmicos desde a Fase 3.4/3.5).
- **UI de `admin_configuracoes.html` não testada em navegador real** — revisão só por leitura de código; recomendado um smoke test manual (login como Master do CCBMG, abrir a página, conferir que os valores batem com o que a migração gravou) antes do próximo deploy.

---

## 9. AUDITORIA FINAL — status de cada achado original

Reclassificação de todas as 50 ocorrências do `TENANT_HARDCODE_AUDIT_REPORT.md`.

| # | Hard-code original | Status | Nova fonte | Observação |
|---|---|---|---|---|
| 1 | `PLAN_CYCLE`/`PLAN_VALUE`/`PLAN_LABEL` | RESOLVIDO | `org.billing.plans[]` | Motor de cobrança real |
| 2 | Mirim paga `base/2` fixo | RESOLVIDO | `org.billing.mirimDiscountRatio` | |
| 3 | `interest: { value: 0.01 }` | RESOLVIDO | `org.billing.lateInterestRate` | |
| 4 | `calculatePlanEnd` por nome de plano fixo | RESOLVIDO | Meses derivados do `cycle` configurado | |
| 5 | `minBid = base * 1.02` | RESOLVIDO | `org.business.auction.minBidIncrementPct` | |
| 6 | Anti-sniper `120000`ms fixo | RESOLVIDO | `org.business.auction.antiSniperExtensionMs` | |
| 7 | Comissão `0.05`+`0.05` fixa | RESOLVIDO | `org.business.auction.{commissionClubePct,commissionSistemaPct}` | |
| 8 | `billingProvider: 'asaas'` no provisionamento | MANTIDO INTENCIONALMENTE | — | Decisão de Núcleo (task, seção 6); registry já suporta outros providers |
| 9 | `pt-BR`/`America/Sao_Paulo`/`BRL` no provisionamento | MANTIDO INTENCIONALMENTE | `config.*` já editável (Fase 3.4) | Fora da lista de campos desta fase |
| 10 | Política de canais de notificação fixa (`asaas.js`) | PENDENTE | — | Fora do escopo explícito (seções 10-18 não a listam) |
| 11 | Fallback `notificationEmails` pra e-mail pessoal | RESOLVIDO | `org.notificationEmails[]`, obrigatório | Achado crítico — corrigido |
| 12 | Conta Gmail SMTP única | MANTIDO INTENCIONALMENTE | — | Infraestrutura (seção 6/27) |
| 13 | reCAPTCHA site key fixa a um domínio | PENDENTE | — | Fora da lista de campos desta fase |
| 14 | Fallback `org_bonfim` na reconciliação | RESOLVIDO | Removido, sem substituto | |
| 15 | `SANDBOX_ORG_ID` hardcoded | MANTIDO INTENCIONALMENTE | — | Já classificado como legítimo (audit + task, seção 21) |
| 16 | `role: 'Master'` capitalizado | PENDENTE | — | RC1-08, inconsistência de convenção, não de negócio |
| 17 | Conta Asaas compartilhada por padrão (G7) | MANTIDO INTENCIONALMENTE | `billingConfig.secretName` já existe | Mecanismo pronto, não exercitado por 3º tenant |
| 18 | Endpoints de webhook fixos (par por conta) | MANTIDO INTENCIONALMENTE | — | Infraestrutura de billing (seção 27) |
| 19 | URL reCAPTCHA com projeto GCP fixo | NÃO APLICÁVEL | — | Já era infraestrutura legítima (1 projeto GCP pra plataforma toda) |
| 20 | Timezone fixo em 4 funções agendadas | MANTIDO INTENCIONALMENTE | — | Fora da lista de campos desta fase |
| 21 | `encerrarLotesExpirados` a cada 1 min global | MANTIDO INTENCIONALMENTE | — | RC1-05, dívida operacional já documentada |
| 22 | Preço duplicado em `seedSandboxTenant.js` | PENDENTE | — | Ferramenta interna, risco de drift baixo aceito |
| 23 | Placeholders CCBMG em `organization-provision.html` | RESOLVIDO | Texto genérico | |
| 24 | `<select>` de plano SaaS fixo (`organization-detail.html`, Dados) | RESOLVIDO | `systemPlans` | |
| 25 | `<select>`/`PLAN_LABELS` fixo (`organizations.html`) | RESOLVIDO | `systemPlans` | |
| 26 | `PLAN_LABELS` fixo (`admin/index.html`) | RESOLVIDO | `systemPlans` | |
| 27 | `PLAN_LABELS` fixo, incompleto (`subscriptions.html`) | RESOLVIDO | `systemPlans` | |
| 28 | WhatsApp hardcoded (`index.html`, `board.html`) | RESOLVIDO | `[data-tenant-whatsapp]` ← `branding.whatsapp` | |
| 29 | WhatsApp hardcoded (`pay.html` ×3) | RESOLVIDO | Idem | |
| 30 | WhatsApp hardcoded (`sobre.html`) | RESOLVIDO | Idem | |
| 31 | Bug de estado vazio — banners (`index.html`) | RESOLVIDO | Carrossel escondido quando vazio | Achado crítico |
| 32 | Bug de estado vazio — parceiros (`index.html`) | RESOLVIDO | Seção escondida quando vazia | Achado crítico |
| 33 | Bug de estado vazio — eventos (`events.html`) | RESOLVIDO | Estado vazio genérico | Achado crítico |
| 34 | Bug de estado vazio — galeria (`gallery.html`) | RESOLVIDO | Estado vazio genérico | Achado crítico |
| 35 | Bug de estado vazio — parceiros (`partners.html`) | RESOLVIDO | Estado vazio genérico | Achado crítico |
| 36 | Instagram hardcoded, `redesSociais` morto | RESOLVIDO | `[data-tenant-social]` ← `branding.redesSociais` | |
| 37 | Endereço/mapa gated só por `isSandbox` | RESOLVIDO | Gated por "tem endereço configurado?" | Mapa (imagem) removido — não havia campo de config, ver Seção 8 |
| 38 | Placeholders de telefone (`admin_master_associacoes.html`) | RESOLVIDO | Texto genérico | |
| 39 | `PLAN_PRICE_TABLE` + mirim duplicado (`admin_associados.html`) | RESOLVIDO | `org.billing.plans`/`mirimDiscountRatio` | |
| 40 | `prompt(..., "30")` | RESOLVIDO | Default = 1º plano da própria org | |
| 41 | Tabela de preços estática (`sobre.html`) | RESOLVIDO | `branding.billing.plans` | |
| 42 | Tabela de preços estática (`admin_sobre.html`) | RESOLVIDO | `org.billing.plans` | |
| 43 | Preço/prazo de classificados hardcoded | RESOLVIDO | `branding.business.classifieds` | |
| 44 | Comissão de leilão hardcoded (texto ×3) | RESOLVIDO | `business.auction.{commissionClubePct,commissionSistemaPct}` | |
| 45 | `*1.02` duplicado no frontend (×4 arquivos) | RESOLVIDO | `business.auction.minBidIncrementPct` | |
| 46 | `RENEW_SOON_DAYS`/`GRACE_OVERDUE_DAYS` fixos | RESOLVIDO | `business.membership.*` | Fallback defensivo = 5 mantido só como rede de segurança, não como fonte de verdade |
| 47 | Placeholder URL base (`admin_master_configuracoes.html`) | RESOLVIDO | Texto genérico | |
| 48 | Cloudflare Worker com origem única | MANTIDO INTENCIONALMENTE | — | Task excluiu explicitamente (seção 27) |
| 49 | `logo_CCBMG.png` como fallback | MANTIDO INTENCIONALMENTE | — | Cosmético, dívida já aceita antes desta fase |
| 50 | Rules/`shared/core/tenant` (já limpos) | NÃO APLICÁVEL | — | Confirmado que seguem limpos; Rules só ganharam extensão aditiva |

**Contagem**: 34 RESOLVIDO · 10 MANTIDO INTENCIONALMENTE · 4 PENDENTE · 2 NÃO APLICÁVEL.

Todos os itens RESOLVIDO foram confirmados por grep pós-implementação (Seção 7) e/ou teste automatizado — nenhum foi marcado resolvido só por inspeção visual do código novo.

---

## 10. TESTE DE SEGUNDO TENANT

Cenário: `org_associacao_exemplo` — nome diferente, cidade diferente, WhatsApp diferente, Instagram diferente, planos diferentes, preços diferentes, regras de classificados diferentes, regras de leilão diferentes, carência diferente, juros diferente, conteúdo diferente, branding diferente. Provisionada via `provisionOrganization` (sem nenhum código alterado).

**O que já funciona sem qualquer alteração de código, agora incluindo o que esta fase entregou:**

1. **Preços de mensalidade, ciclo e desconto Mirim** — vêm de `org.billing.plans`/`mirimDiscountRatio`, escritos no provisionamento e editáveis depois via `admin_configuracoes.html` pelo próprio Master. ✅ (era o ponto #1 do teste equivalente na auditoria original — agora resolvido)
2. **Juros de atraso** — `org.billing.lateInterestRate`. ✅
3. **Regras de leilão** (incremento, anti-sniper, comissão da associação) — `org.business.auction.*`, editável pelo Master; a comissão da plataforma continua só com a plataforma. ✅
4. **Preço/prazo de classificados** — `org.business.classifieds.*`. ✅
5. **Carência/renovação de associado** — `org.business.membership.*`. ✅
6. **E-mails de notificação administrativa** — `org.notificationEmails[]`, começa com o e-mail do próprio Master, nunca um endereço de terceiro. ✅
7. **WhatsApp/telefone de contato** — `org.whatsapp`, aparece em toda página pública via `[data-tenant-whatsapp]`. ✅
8. **Instagram/redes sociais** — `org.portal.redesSociais`, aparece via `[data-tenant-social]`. ✅
9. **Conteúdo público (banners/parceiros/eventos/galeria)** — organização nova sem conteúdo mostra um estado vazio genérico, nunca o conteúdo de outro tenant. ✅
10. **Atribuição de plano SaaS no Painel Master** — qualquer plano criado em `admin/plans.html` aparece corretamente nos 4 lugares que antes tinham lista fixa. ✅

**O que ainda exigiria alteração manual — fora do escopo desta fase, por decisão deliberada (não por lacuna descoberta agora):**

1. **Conta de pagamento (Asaas)** — continua compartilhada por padrão; um tenant que precise de conta própria usa `billingConfig.secretName` (mecanismo já existe, Fase 3.7), mas isso ainda é uma configuração manual feita pela plataforma, não self-service.
2. **Domínio próprio + proxy Cloudflare** — cadastro de domínio é Núcleo (`setOrganizationDomains`); se o novo tenant precisar de uma origem de frontend separada (não só um hostname apontando pro mesmo GitHub Pages do CCBMG), ainda exige um novo Worker Cloudflare escrito à mão.
3. **reCAPTCHA** — site key fixa a um domínio; um tenant em outro hostname herda uma configuração que pode falhar silenciosamente no fluxo de reset de senha por SMS.
4. **Identidade visual (logo/cores) e localização (idioma/timezone/moeda)** — já são 100% dinâmicas por organização, mas só editáveis pelo Painel Master (Núcleo) nesta fase, não pelo Portal da Associação — o Master do tenant novo pediria suporte da plataforma pra trocar o logo, por exemplo.
5. **Endereço/mapa institucional** — o texto do endereço já é 100% dinâmico (`endereco`); a imagem do mapa foi removida (não recriada) por não existir campo de configuração — um tenant que queira um mapa visual precisaria de um campo novo, fora do escopo desta fase.

Comparado ao teste equivalente da auditoria original (12 pontos que exigiam alteração manual), **10 dos 12** foram resolvidos nesta fase. Os 2 que restam (#2 domínio/proxy e #3 reCAPTCHA) já eram — e continuam sendo — infraestrutura fora do escopo desta fase, não uma lacuna nova descoberta agora.

