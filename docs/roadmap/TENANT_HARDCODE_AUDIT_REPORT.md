# TENANT-HARDCODE AUDIT

**Escopo:** `clubedocavalobonfimmg` (frontend + Cloud Functions) e `portal-associativo` (Painel Master, núcleo compartilhado, Security Rules, Cloudflare Worker).
**Método:** auditoria estática de código (read-only, nenhum arquivo alterado), 4 varreduras sistemáticas paralelas — Cloud Functions, frontend público/associado, Firestore/Storage Rules + núcleo compartilhado, Painel Master + scripts de seed — seguidas de consolidação e reclassificação manual.
**Data:** 2026-08-11.

---

## 1. VEREDITO EXECUTIVO

| Métrica | Valor |
|---|---|
| Ocorrências investigadas (total) | ~50 |
| Tenant-specific confirmadas (categorias A+B) | 37 |
| — Críticas | 3 |
| — Altas | 13 |
| — Médias | 10 |
| — Baixas | 9 |
| — Legítimo temporário (categoria B) | 2 |
| Falsos positivos / já dinâmico (categorias C/D/E) | ~13 |
| % da arquitetura preparada para multi-tenant (estimativa) | **~70–75%** |

**A plataforma está realmente preparada para receber um segundo tenant sem alteração de código? NÃO.**

A camada de **infraestrutura de tenant** — identidade visual, domínio, resolução de organização por hostname, módulos, feature flags, Firestore/Storage Rules — está genuinamente pronta: zero hardcode tenant-específico foi encontrado em `firestore.rules`, `storage.rules`, `firestore.indexes.json`, `tenant.config.js`, `firebase.js` ou nos 8 arquivos de `shared/core/tenant`+`auth`. Essa é a maior parte do trabalho das Fases 3.2–3.11 e ela se sustenta sob auditoria.

O que **não** está pronto é a camada de **negócio**: o motor de cobrança (`functions/index.js`) tem os planos, preços, ciclo, desconto Mirim e taxa de juros de uma associação equestre específica (CCBMG) **compilados como constantes de módulo**, compartilhados por toda a plataforma — qualquer organização nova herda automaticamente os preços R$30/85/170 sem nenhum campo em `organizations/{orgId}` para sobrescrevê-los. Isso não é um detalhe cosmético: é o núcleo do produto (cobrança recorrente) rodando hoje como se só existisse um cliente.

Dois achados são de severidade crítica e merecem atenção antes de qualquer segundo tenant real (não-sandbox) entrar em produção:
1. **Vazamento de conteúdo entre tenants por design de "estado vazio" incorreto** — 4 páginas públicas do CCBMG mostram fotos, eventos e parceiros reais do CCBMG para qualquer organização nova sem CMS próprio ainda populado (achado F/#26).
2. **Fallback de e-mail de notificação para endereços pessoais** — qualquer organização que esqueça de configurar `notificationEmails` roteia cobranças/PII de associados para dois Gmails pessoais fixos no código (achado #11).
3. **Motor de preços/planos hardcoded** — toda cobrança de toda organização usa a tabela de preços do CCBMG (achado #1).

Nenhum desses três impede o *funcionamento técnico* de um segundo tenant (ele não vai quebrar/crashar) — mas todos os três produzem **comportamento de produto e/ou de segurança incorreto** para qualquer organização que não seja o CCBMG.

---

## 2. INVENTÁRIO COMPLETO

| # | Arquivo | Linha | Campo/Valor | Tipo | Tenant específico? | Severidade | Motivo |
|---|---------|------:|-------------|------|---------------------|------------|--------|
| 1 | `functions/index.js` | 763-765 | `PLAN_CYCLE`/`PLAN_VALUE`/`PLAN_LABEL` (mensal 30/trimestral 85/semestral 170) | Constante de módulo | Sim (A) | **Crítico** | Motor de cobrança real (Asaas) usa preços do CCBMG para toda organização; sem campo em `organizations/{orgId}` para sobrescrever |
| 2 | `functions/index.js` | 769-772 | `resolvePlanValue` — Mirim paga metade | Regra de negócio | Sim (A) | Alto | Desconto de 50% para categoria "mirim" fixo no código, não configurável por org |
| 3 | `functions/index.js` | 727, 865 | `interest: { value: 0.01 }` | Constante | Sim (A) | Médio | Taxa de juros de atraso de 1% igual para todas as assinaturas de todas as orgs |
| 4 | `functions/index.js` | 512-516 | `calculatePlanEnd` (mapa ciclo→meses) | Regra de negócio | Sim (A) | Alto | Acoplado à mesma vocabulário fixo de `PLAN_VALUE`; plano com nome diferente cai silenciosamente no default de 1 mês |
| 5 | `functions/index.js` | 1971 | `minBid = base * 1.02` | Constante | Sim (A) | Médio | Incremento mínimo de lance em leilão fixo em 2% para toda organização |
| 6 | `functions/index.js` | 1980-1981 | Extensão anti-sniper de 120000ms (2 min) | Constante | Sim (A) | Médio | Janela anti-sniper igual para todos os leilões de todas as orgs |
| 7 | `functions/index.js` | 2027-2028 | `commissionClube`/`commissionSistema` = 5%+5% | Regra de negócio | Sim (A) | Alto | Split de comissão de leilão fixo; um clube com acordo comercial diferente não pode configurar |
| 8 | `functions/lib/provisioning.js` | 180-185 | `billingProvider: 'asaas'` gravado no passo `billing` | Default de provisionamento | Sim (A) | Alto | Toda organização nova é acoplada ao Asaas sem opção — `lib/billing/index.js` já é um registry genérico, mas nunca é exercitado com outro provider |
| 9 | `functions/lib/provisioning.js` | 187-194 | `config: { idioma: 'pt-BR', timezone: 'America/Sao_Paulo', moeda: 'BRL' }` | Default de provisionamento | Sim (A) | Médio | Tenant fora do Brasil nasce com locale errado, exige correção manual pós-criação |
| 10 | `functions/lib/billing/asaas.js` | 308-348 | `notificationsSync` — WhatsApp+SMS on, e-mail/ligação off | Regra de negócio | Sim (A) | Médio | Comentário no próprio código chama de "padrão institucional" — é a política do CCBMG aplicada a todo cliente Asaas de toda organização |
| 11 | `functions/index.js` | 293-296, 1230-1232 | fallback `['waldiney.serafim@gmail.com','mpmarquesnutri@gmail.com']` | Fallback hardcoded | Sim (A) | **Crítico** | Qualquer org sem `notificationEmails` configurado envia PII de associados (cobrança, cancelamento, reset de senha) para 2 e-mails pessoais fixos |
| 12 | `functions/index.js` | 188-189, 1218-1219, 2438-2439 | Conta Gmail SMTP única (`email-user`/`email-password`) | Configuração de integração | Sim (A) | Médio | Toda organização compartilha a mesma conta/reputação de envio de e-mail, sem override por org (diferente de billing, que já suporta secret por org) |
| 13 | `functions/index.js` | 1756-1757 | `RECAPTCHA_SITE_KEY` fixa, escopada a `clubedocavalobonfim.com.br` | Configuração de integração | Sim (A) | Alto | `startPasswordReset` roda para toda organização; tenant servido por outro hostname (ex.: domínio de cliente futuro) provavelmente falha a verificação |
| 14 | `functions/index.js` | 1558-1561 | fallback `[{ id: 'org_bonfim' }]` em `asaasReconciliationDaily` | Identificador fixo | Sim (A) | Baixo | Caminho morto hoje (RC1-04, já documentado); mas assume CCBMG como "org default" se `organizations` já estiver vazio |
| 15 | `functions/lib/sandboxBranding.js` | 18 | `SANDBOX_ORG_ID = 'org_teste_etapa10'` | Identificador fixo | Sim (B) | — | Legítimo: utilitário deliberadamente escopado a UM tenant de demonstração, com guarda dupla (`isSandbox===true`) |
| 16 | `functions/lib/provisioning.js` | 143 | `role: 'Master'` (capitalizado) | Inconsistência | Sim (A) | Baixo | Já documentado como RC1-08; drift de convenção (`master` minúsculo é o padrão no resto do sistema) |
| 17 | `functions/index.js` | 19-33 | `ASAAS_SECRET`/`ASAAS_WEBHOOK_TOKEN` apontando pra conta única | Configuração de integração | Sim (A) | Alto | Já documentado como G7; toda org sem `billingConfig.secretName` próprio compartilha a mesma conta comercial Asaas |
| 18 | `functions/index.js` | 1599, 1670 | Endpoints de webhook fixos (`asaasWebhook`/`asaasSandboxWebhook`) | Configuração de integração | Sim (A) | Alto | Um 3º tenant com conta Asaas própria exigiria um 3º par endpoint+secret hardcoded no código, não uma configuração |
| 19 | `functions/index.js` | 1767 | URL da API reCAPTCHA com `projects/clubecavalobonfim` | Infra | Não (C) | — | Projeto GCP único e compartilhado é decisão arquitetural válida — mas ver #13 |
| 20 | `functions/index.js` | 174, 183, 1556, 2305 | `.timeZone('America/Sao_Paulo')` em 4 funções agendadas | Constante | Sim (A) | Médio | Todo cron roda no fuso do Brasil para toda organização; tenant fora do Brasil recebe relatórios/gatilhos em horário errado |
| 21 | `functions/index.js` | 2003 | `encerrarLotesExpirados` a cada 1 min, escaneando globalmente | Regra operacional | Sim (A) | Baixo | Já documentado como RC1-05; risco de escala, não de correção, se leilões crescerem entre tenants |
| 22 | `functions/scripts/seedSandboxTenant.js` | 515, 560 | Tabela de preços duplicada (`{mensal:30,trimestral:85,semestral:170}`) | Duplicação | Sim (A) | Baixo | Ferramenta só-sandbox; risco de drift se pricing virar configurável e o script não for atualizado junto |
| 23 | `portal-associativo/admin/organization-provision.html` | 47, 51 | `placeholder="Ex: Clube do Cavalo Bonfim MG"` / `placeholder="org_bonfim"` | Texto de exemplo | Sim (A) | Baixo | CLAUDE.md (Fase 3.11) afirma que este arquivo já foi genericizado — **divergência entre documentação e código**; cosmético (campo nasce vazio) |
| 24 | `admin/organization-detail.html` | 76-81, 134-138 | `<select>` estático `starter/professional/enterprise[/custom]` | Taxonomia fixa | Sim (A) | Alto | `admin/plans.html` já é um editor de planos genérico (`systemPlans`), mas estas duas telas não o consultam — um 5º plano criado via `plans.html` não pode ser atribuído a nenhuma organização/assinatura pela UI |
| 25 | `admin/organizations.html` | 44-50, 81 | filtro `<select>` + `PLAN_LABELS` estático | Taxonomia fixa | Sim (A) | Alto | Mesmo problema de #24 — rótulo cai para o id cru se o plano não estiver no mapa fixo |
| 26 | `admin/index.html` | 152 | `PLAN_LABELS` duplicado | Taxonomia fixa | Sim (A) | Alto | Mesma duplicação, terceiro lugar |
| 27 | `admin/subscriptions.html` | 92, 167 | `PLAN_LABELS` (3 valores, sem `custom`) | Taxonomia fixa | Sim (A) | Alto | Quarto lugar com a mesma duplicação, ainda mais incompleto |
| 28 | `index.html`, `board.html` | 253 / 176 | `wa.me/5531986685028` sem marcador `data-tenant-*` | Hardcode de branding | Sim (A) | Alto | Único canal de suporte/contato do site; `branding.js` já expõe `telefone` na projeção pública mas nunca é lido nem existe `[data-tenant-phone]` |
| 29 | `pay.html` | 86, 129, 138 | 3× `wa.me/5531986685028` | Hardcode de branding | Sim (A) | Alto | Página de pagamento — associado de outro tenant tentaria contato via WhatsApp do CCBMG |
| 30 | `sobre.html` | 206 | `wa.me/5531986685028?text=...Clube%20do%20Cavalo.` | Hardcode de branding | Sim (A) | Alto | Mesmo problema, com texto de mensagem também específico |
| 31 | `index.html` | 375-380 | `cms_banners` — `if (!banners.length) return;` | Bug de estado vazio | Sim (A) | **Crítico** | Não limpa o carrossel estático (`banner4.png` etc.) quando a org não tem banners próprios — herda visualmente conteúdo do CCBMG |
| 32 | `index.html` | 399-407 | `cms_partners` — mesmo padrão | Bug de estado vazio | Sim (A) | **Crítico** | Mostra os 6 parceiros reais do CCBMG (nomes/logos) para qualquer org sem parceiros cadastrados |
| 33 | `events.html` | 234-240 | `cms_events` — mesmo padrão | Bug de estado vazio | Sim (A) | **Crítico** | Mostra o evento real "Inauguração do Clube do Cavalo Bonfim-MG" |
| 34 | `gallery.html` | 156-165 | `cms_gallery` — mesmo padrão | Bug de estado vazio | Sim (A) | **Crítico** | Mostra 4 fotos históricas reais do CCBMG com legendas nominais |
| 35 | `partners.html` | 82-105, 146-147 | `partners` — mesmo padrão | Bug de estado vazio | Sim (A) | **Crítico** | Mesmos 7 parceiros reais do CCBMG |
| 36 | `index.html`, `board.html` | 245 / 168 | link Instagram `@clube_do_cavalo_de_bonfim_mg` fixo | Hardcode de branding | Sim (A) | Médio | `organizations/{orgId}.portal.redesSociais` existe desde Fase 3.4 e é administrável no Painel Master, mas nenhum HTML/JS o lê — config morta |
| 37 | `index.html`, `board.html` | 260-276 / 182-198 | Endereço físico + mapa reais, gate só por `isSandbox` | Hardcode de branding | Sim (A) | Alto | Um 2º tenant de **produção** (não-sandbox) continua vendo o endereço do CCBMG — o mecanismo distingue "demo vs. não", não "este tenant vs. outro" |
| 38 | `admin_master_associacoes.html` | 110, 114 | `placeholder="(31) 98668-5028"` / `placeholder="5531986685028"` | Texto de exemplo | Sim (A) | Baixo | Escapou da limpeza de placeholders da Fase 3.11 (que era baseada em busca por nome, não por número de telefone) |
| 39 | `admin_associados.html` | 627, 1316 | `PLAN_PRICE_TABLE` + divisão por 2 p/ mirim (duplicado do backend) | Duplicação de regra | Sim (A) | Alto | Estimativa de valor no dashboard admin usa preços do CCBMG hardcoded; drift garantido se #1 virar configurável e isso não acompanhar |
| 40 | `admin_associados.html` | 1204 | `prompt(..., "30")` — default de cobrança avulsa | Hardcode de valor | Sim (A) | Médio | Sugere R$30 (mensalidade do CCBMG) independente do plano real do associado |
| 41 | `sobre.html` | 186, 192, 198 | Tabela pública de preços R$30/85/170 | Texto estático | Sim (A) | Alto | Página institucional pública sem nenhuma interpolação — não há campo de config para isso |
| 42 | `admin_sobre.html` | 114-116 | Mesma tabela de preços, no preview do editor | Texto estático | Sim (A) | Médio | Preview do CMS mostra preços que não vêm do CMS |
| 43 | `classificados.html` | 248 | "R$ 1,00 por dia, mínimo 30 dias" | Texto estático | Sim (A) | Médio | Regra de negócio de classificados sem nenhum campo em `organizations/{orgId}` correspondente |
| 44 | `leilao_lote.html`, `lote_form.html` | 140/205, 185 | "comissão de 10% (5%+5%)" | Texto estático | Sim (A) | Alto | Reflete corretamente o cálculo real do backend (#7) — mas ambos são hardcoded, nenhum dos dois é configurável por organização |
| 45 | `leilao_lote.html`, `admin_leiloes.html`, `meus_lotes.html`, `lote_form.html` | 400-401/503-504, 465, 253, 186 | `*1.02` (incremento mínimo 2%) | Duplicação | Sim (A) | Médio | Duplica #5 no frontend em 3 lugares — mesmo risco de drift |
| 46 | `pg_associado.html` | 372-373 | `RENEW_SOON_DAYS = 5` / `GRACE_OVERDUE_DAYS = 5` | Regra de negócio | Sim (A) | Alto | Decide quando avisar renovação e quando **bloquear acesso ao portal** por inadimplência — igual para toda organização |
| 47 | `admin_master_configuracoes.html` | 55 | placeholder "URL Base" = `https://clubedocavalobonfim.com.br` | Texto de exemplo | Sim (A) | Baixo | Inconsistente com o placeholder vizinho ("Nome da Plataforma" já genérico) |
| 48 | `cloudflare-worker-demo-proxy/worker.js` | 15 | `const ORIGIN = "https://clubedocavalobonfim.com.br"` | Hardcode de infra | Sim (B) | — | Legítimo para ESTE Worker (proxy do tenant Sandbox); mas é uma restrição arquitetural real: só escala pra tenants que aceitam compartilhar a mesma origem GitHub Pages, não documentado explicitamente como limite em CLAUDE.md Fase 3.9 |
| 49 | `assets/img/logo_CCBMG.png` | (41 páginas) | Nome de arquivo do fallback estático de logo/favicon | Cosmético | Sim (A) | Baixo | Já documentado como dívida aceita (Fase 3.11); sobrescrito em runtime quando a org tem `logoUrl` |
| 50 | `firestore.rules`, `storage.rules`, `firestore.indexes.json`, `tenant.config.js`, `firebase.js`, `shared/core/tenant/*.js`, `shared/core/auth/*.js` | — | — | — | Não (E) | — | Zero hardcode tenant-específico encontrado — totalmente dinâmico, ver Seção 5 |

---

## 3. AGRUPAMENTO POR CATEGORIA

**Identidade/Branding:** #28, #29, #30, #36, #37, #38, #49
**Dados cadastrais:** nenhum achado novo — CNPJ/endereço/e-mail via CMS já corretos (ver Seção 5); exceção parcial em #37 (endereço só gated por sandbox)
**Dados financeiros:** #1, #2, #3, #4, #39, #40, #41, #42, #43
**Regras de negócio:** #5, #6, #7, #10, #44, #45, #46
**Módulos:** nenhum achado — `organizations/{orgId}.modules` + `modules.js` confirmados 100% dinâmicos
**Comunicação:** #11, #12, #13
**Integrações:** #8, #17, #18, #19
**Firestore:** #14 (fallback), demais confirmados limpos (Seção 5)
**Storage:** nenhum achado — `storage.rules` limpo
**Cloud Functions:** #1–#22 (a maioria dos achados críticos/altos está aqui)
**Security Rules:** nenhum achado — ver Seção 5
**Frontend:** #28–#47
**Backend:** #1–#22
**Configuração (Painel Master):** #23, #24, #25, #26, #27, #47
**Outros:** #9, #16, #20, #21, #48

---

## 4. CAMPOS QUE DEVEM EXISTIR NO TENANT

Lista consolidada, derivada apenas do que a auditoria encontrou em uso real (nenhum campo inventado):

```text
organizations/{orgId}

# Já existe (confirmado dinâmico — ver Seção 5), citado aqui só como referência de padrão:
#   identity.nome, identity.nomeCurto, identity.cnpj, identity.endereco,
#   identity.telefone, identity.email, identity.site
#   branding.logoUrl, branding.faviconUrl, branding.corPrimaria, branding.corSecundaria
#   config.idioma, config.timezone, config.moeda
#   portal.redesSociais.{facebook,instagram,youtube}   <- existe mas NÃO é lido em lugar nenhum (achado #36)
#   modules.*
#   billingProvider, billingEnvironment, billingConfig.secretName, billingConfig.publicParams

# NOVOS — a auditoria encontrou uso real sem nenhum campo correspondente:

billing.plans[]                        # substitui PLAN_CYCLE/PLAN_VALUE/PLAN_LABEL hardcoded (#1)
  .id, .label, .cycle (MONTHLY|QUARTERLY|SEMIANNUALLY|...), .price

billing.mirimDiscountRatio             # hoje fixo em 0.5 (#2)
billing.lateInterestRate               # hoje fixo em 0.01 (#3)

business.classifieds.pricePerDay       # hoje "R$ 1,00" hardcoded em texto (#43)
business.classifieds.minimumDays       # hoje "30 dias" hardcoded em texto (#43)

business.auction.minBidIncrementPct    # hoje 2% hardcoded em 5 lugares (#5, #45)
business.auction.antiSniperExtensionMs # hoje 120000 hardcoded (#6)
business.auction.commissionClubePct    # hoje 5% hardcoded (#7, #44)
business.auction.commissionSistemaPct  # hoje 5% hardcoded (#7, #44)

business.membership.renewSoonDays      # hoje RENEW_SOON_DAYS=5 hardcoded (#46)
business.membership.graceOverdueDays   # hoje GRACE_OVERDUE_DAYS=5 hardcoded (#46)

notificationEmails[]                   # já existe o CAMPO (confirmado em código),
                                        # o problema é o FALLBACK hardcoded quando ausente (#11)

communication.notificationChannels     # hoje "padrão institucional" fixo em asaas.js (#10)
  .whatsapp, .sms, .email, .phoneCall  # (booleans)

communication.emailSenderOverride      # secretName próprio p/ SMTP, mesmo padrão já usado por billingConfig.secretName (#12)

security.recaptchaSiteKey              # hoje RECAPTCHA_SITE_KEY fixa a um domínio (#13)
```

**Não recomendado mover para `organizations/{orgId}`:** credenciais/secrets (Asaas API key, Gmail password, reCAPTCHA server-side verification) — esses continuam no Secret Manager, referenciados por nome/path a partir do documento da organização (padrão já usado por `billingConfig.secretName`, replicar para e-mail e reCAPTCHA).

---

## 5. CAMPOS JÁ DINÂMICOS

| Campo | Origem | Dinâmico? | Observação |
|---|---|---|---|
| `firestore.rules` (todo o arquivo) | Cloud Firestore | Sim | Zero literal de orgId; tudo via `userOrgId()`/`canOperateOrg()`/`isPlatformStaff()` |
| `storage.rules` (todo o arquivo) | Cloud Storage | Sim | `callerOrgId()`/`isOwnOrg()` via leitura cross-service, genérico |
| `firestore.indexes.json` | Firestore | Sim | Todos os 27 índices compostos são por campo (`orgId` ASC + outros), nenhum por valor literal |
| `tenant.config.js` | CCBMG repo | Sim | Não declara `orgId` desde a Fase 3.10; só config do SDK do Firebase (compartilhado por design) |
| `currentOrgId` (`firebase.js`) | Resolução por hostname | Sim | `await getTenant({db})` consulta `domains/{location.hostname}`, sem fallback estático |
| `organizations/{orgId}/public/branding.{nome,logoUrl,faviconUrl,corPrimaria,corSecundaria,email,endereco,isSandbox}` | Trigger `onOrganizationWritten` | Sim | Aplicado via `[data-tenant-*]` em 41 páginas |
| `organizations/{orgId}.modules` | Firestore | Sim | `modules.js` escaneia `[data-module]` no DOM, sem lista fixa |
| `featureFlags/{flagKey}` | Callable `resolveFeatureFlags` | Sim | Resolução por org via override/rollout/environment, fail-closed |
| `domains/{hostname}` → `orgId` | Firestore | Sim | Único mecanismo de resolução, sem fallback |
| `systemPlans/{planId}` | Firestore | Sim (parcial) | `admin/plans.html` e o `<select>` de `organization-provision.html` consomem dinamicamente — **mas** `organization-detail.html`/`organizations.html`/`index.html`/`subscriptions.html` não (achados #24–#27) |
| `billingConfig.secretName` | Firestore → Secret Manager | Sim | Já implementado e exercitado de verdade pelo tenant Sandbox (Fase 3.7) — é o padrão que #12/#13 deveriam replicar |
| CNPJ/endereço/registro (`sobre.html`) | `cms_about` | Sim | Overwrite por campo, sem fallback estático residual |
| Diretoria (`board.html`) | `cms_board` | Sim | Container vazio `<div id="cmsBoardDynamic">`, sem fallback residual |
| URLs absolutas em fluxos interativos (reset de senha, comprovante, compartilhamento de lote) | `location.origin` | Sim | Corrigido na Fase 3.11, confirmado ainda correto |

---

## 6. CASOS MAIS CRÍTICOS

### Caso 1 — Motor de preços/planos é uma constante de módulo compartilhada

**Problema:** `PLAN_CYCLE`, `PLAN_VALUE`, `PLAN_LABEL` e `resolvePlanValue()` definem preços e ciclos de mensalidade para **toda a plataforma**, não por organização.
**Arquivo:** `functions/index.js`
**Linha:** 763-772 (uso em 717, 724, 796, 862-863, 1127, 1135)
**Por que quebra o multi-tenancy:** `onNewAssociadoCriado`/`onAssociadoAtualizado` (os triggers que criam assinaturas reais no Asaas) chamam essas funções sem nenhuma consulta a `organizations/{orgId}`. Um segundo tenant com valores de mensalidade diferentes cobra o valor errado de seus associados — dinheiro real, não cosmético.
**Impacto:** Crítico — bloqueia comercialmente (não tecnicamente) qualquer segundo tenant real com plano de preços distinto do CCBMG.
**Solução arquitetural recomendada:** `organizations/{orgId}.billing.plans[]` (id/label/cycle/price), lido por `resolvePlanValue`/`calculatePlanEnd`/`detectPlanType` no lugar das constantes atuais; fallback para os valores do CCBMG apenas enquanto a migração de dados não cobrir todas as orgs existentes.

### Caso 2 — Fallback de notificação para e-mails pessoais

**Problema:** Quando `organizations/{orgId}.notificationEmails` está ausente, o sistema envia dados de cobrança/PII de associados para dois endereços Gmail pessoais fixos no código.
**Arquivo:** `functions/index.js`
**Linha:** 293-296, 1230-1232
**Por que quebra o multi-tenancy:** Não é um bug de funcionamento — é um vazamento estrutural. Qualquer organização nova que não configure explicitamente `notificationEmails` (o que é fácil de esquecer, já que não há validação obrigando o preenchimento no provisionamento) envia PII de seus próprios associados para os e-mails pessoais dos operadores do CCBMG.
**Impacto:** Crítico (segurança/privacidade, não só produto) — ver Seção 7.
**Solução arquitetural recomendada:** Tornar `notificationEmails` obrigatório no fluxo de `provisionOrganization` (falhar o passo se ausente, em vez de deixar cair num fallback global), ou trocar o fallback por "não enviar e logar erro" em vez de "enviar para terceiros".

### Caso 3 — Estado vazio de CMS não limpa o conteúdo estático do CCBMG

**Problema:** 5 páginas públicas (`index.html` ×2 seções, `events.html`, `gallery.html`, `partners.html`) só sobrescrevem o container de conteúdo dinâmico **quando a consulta ao Firestore retorna resultados**; quando a organização não tem nenhum documento na coleção CMS correspondente, o HTML estático (que contém fotos, nomes de parceiros e texto de evento reais do CCBMG) permanece visível.
**Arquivo:** `index.html:375-380,399-407`, `events.html:234-240`, `gallery.html:156-165`, `partners.html:82-105,146-147`
**Por que quebra o multi-tenancy:** Isso só não foi percebido até agora porque o único tenant de teste (Sandbox) foi deliberadamente populado com dados fictícios de CMS (Fase 3.11) — mascarando o bug. Qualquer organização de produção real recém-provisionada, antes de um admin cadastrar seu próprio conteúdo, exibe publicamente as fotos históricas, nomes de parceiros comerciais e texto institucional reais do CCBMG.
**Impacto:** Crítico — vazamento de conteúdo/identidade entre tenants, com exposição pública (não requer login) e risco reputacional real (nomes de empresas parceiras do CCBMG aparecendo como se fossem parceiras de outro clube).
**Solução arquitetural recomendada:** Em cada um dos 5 pontos, trocar `if (!resultados.length) return;` por um `else` que limpe o container (mesmo padrão já usado corretamente em `board.html` e `sobre.html`), com uma mensagem de estado vazio genérica opcional.

### Caso 4 — Taxonomia de planos duplicada e desalinhada com o editor dinâmico

**Problema:** `admin/plans.html` é um editor de planos genuinamente dinâmico (`systemPlans/{planId}`), mas 4 outras telas do Painel Master (`organization-detail.html` ×2, `organizations.html` ×2, `index.html`, `subscriptions.html`) mantêm uma lista fixa `starter/professional/enterprise[/custom]`.
**Arquivo:** ver achados #24-#27
**Por que quebra o multi-tenancy:** Um plano novo criado através do mecanismo oficial (`plans.html`) fica inacessível pela UI — não pode ser atribuído a nenhuma organização (`organization-detail.html`) nem aparece corretamente rotulado em listagens (`organizations.html`, `index.html`, `subscriptions.html`).
**Impacto:** Alto — não afeta o CCBMG hoje (que usa os planos originais), mas invalida a promessa de "criar organização sem alterar código" no exato momento em que um operador tenta usar o próprio mecanismo que a Fase 3.1 construiu para isso.
**Solução arquitetural recomendada:** As 4 telas devem popular seus `<select>`/labels a partir de `systemPlans` em vez de listas estáticas — mesmo padrão já usado em `organization-provision.html`.

---

## 7. RISCOS DE SEGURANÇA

| Risco | Achado | Severidade | Detalhe |
|---|---|---|---|
| Vazamento de PII de associados para terceiros | #11 | Crítico | Fallback de notificação para e-mails pessoais quando `notificationEmails` não está configurado — dados de cobrança/cancelamento de associados de qualquer organização podem ser enviados para contas Gmail que não pertencem àquela organização |
| Vazamento de conteúdo/identidade entre tenants (exposição pública) | #31-#35 | Crítico | Fotos, parceiros e eventos reais do CCBMG expostos publicamente (sem login) em qualquer organização nova sem CMS próprio |
| Conta de pagamento compartilhada entre tenants | #17 | Alto (já documentado como G7) | Sem `billingConfig.secretName` próprio, disputas/chargebacks de um tenant afetam a reputação da conta Asaas de todos os outros |
| Verificação anti-bot escopada a um único domínio | #13 | Alto | reCAPTCHA Enterprise site key vinculada só a `clubedocavalobonfim.com.br`; tenant em outro hostname pode ter o fluxo de reset de senha por SMS falhando silenciosamente ou sem proteção anti-automação de fato |
| Conta SMTP compartilhada | #12 | Médio | Um tenant com alto volume de envio pode degradar a entregabilidade de e-mail de todos os outros (mesma conta Gmail) |

Nenhum achado desta auditoria indica **bypass de isolamento de dados no Firestore/Storage** (rules e queries seguem corretamente escopadas por `orgId`, confirmado na Seção 5) — os riscos acima são todos de **acoplamento de infraestrutura compartilhada**, não de vazamento direto de documento entre tenants via Firestore/Storage Rules.

---

## 8. RISCOS DE PRODUTO

| Cenário | Achado | Ocorre hoje se... |
|---|---|---|
| Visitante vê nome/fotos/parceiros de outro clube | #31-#35 | Organização nova sem CMS populado ainda |
| Associado tenta contato via WhatsApp e cai no número do CCBMG | #28-#30 | Sempre, para qualquer tenant que não seja o CCBMG |
| Associado vê endereço físico/mapa do CCBMG na própria organização | #37 | Organização de produção (não-sandbox) sem seu próprio bloco de endereço |
| Cobrança usa valor de mensalidade errado | #1, #39-#42 | Organização com plano de preços diferente de mensal R$30/trimestral R$85/semestral R$170 |
| Regra de inadimplência/carência errada | #46 | Organização que precisa de um prazo de carência diferente de 5 dias |
| Comissão de leilão errada | #7, #44 | Organização com acordo de comissão diferente de 5%+5% |
| Link para redes sociais aponta para o Instagram do CCBMG | #36 | Sempre — o campo configurável existe mas nunca é lido |
| Plano criado no Painel Master não pode ser usado | #24-#27 | Sempre que um operador cria um plano novo fora dos 3-4 nomes fixos |

---

## 9. ARQUITETURA ALVO

| Grupo de hardcode | Onde deveria ficar |
|---|---|
| Preços/planos (#1, #2, #4, #39-#42) | `organizations/{orgId}.billing.plans[]` — específico da organização |
| Taxa de juros (#3) | `organizations/{orgId}.billing.lateInterestRate` — específico, com default de plataforma se ausente |
| Regras de leilão (#5, #6, #7, #44, #45) | `organizations/{orgId}.business.auction.*` — específico (só relevante para orgs com módulo de leilão ativo) |
| Regras de classificados (#43) | `organizations/{orgId}.business.classifieds.*` — específico |
| Carência/renovação (#46) | `organizations/{orgId}.business.membership.*` — específico |
| WhatsApp/telefone de contato (#28-#30) | Já existe em `public/branding.telefone` — falta só o consumidor (`branding.js` + `[data-tenant-phone]`) |
| Redes sociais (#36) | Já existe em `organizations/{orgId}.portal.redesSociais` — falta só o consumidor |
| Notificação de e-mail (#11, #12) | Campo `notificationEmails` já existe (torná-lo obrigatório no provisionamento); credencial SMTP própria via `communication.emailSenderOverride` → Secret Manager, mesmo padrão de `billingConfig.secretName` |
| reCAPTCHA (#13) | `organizations/{orgId}.security.recaptchaSiteKey` (chave pública, não é secret) + verificação server-side continua usando IAM, sem mudança |
| Provider de billing no provisionamento (#8) | Tornar `provisionOrganization` aceitar `billingProvider` como parâmetro de entrada, com "asaas" como default explícito, não implícito |
| Locale/timezone no provisionamento (#9) | Idem — parâmetro de entrada com default, não gravação incondicional |
| Taxonomia de planos no Painel Master (#24-#27) | Nenhum campo novo — consumir `systemPlans` já existente, eliminar as listas estáticas |
| CMS empty-state (#31-#35) | Nenhum campo novo — correção de lógica de renderização |
| Endereço/mapa gated por sandbox (#37) | Mover para o mesmo padrão de `cms_about`/`cms_board` (campo de organização, não gate binário sandbox/não-sandbox) |
| Conta Asaas compartilhada (#17, #18) | Já existe o mecanismo (`billingConfig.secretName`) — pendência é operacional (criar conta+webhook por tenant que precisar), não arquitetural |
| Cloudflare Worker de proxy (#48) | Aceitável como está para tenants que compartilham o deployment GitHub Pages do CCBMG; documentar explicitamente que um tenant com origem própria exige um novo Worker (ou evoluir para lookup hostname→origem dentro do mesmo Worker, se essa necessidade surgir) |

---

## 10. PLANO DE CORREÇÃO

### Fase 1 — Crítico
| Problema | Arquivos afetados | Dependências | Solução | Risco da mudança |
|---|---|---|---|---|
| Fallback de notificação para e-mails pessoais (#11) | `functions/index.js` (293-296, 1230-1232) | Nenhuma | Tornar `notificationEmails` obrigatório em `provisionOrganization`; trocar fallback por "log + não enviar" | Baixo — CCBMG já tem o array configurado explicitamente (Fase 3.11), não regressiona |
| CMS empty-state vazando conteúdo do CCBMG (#31-#35) | `index.html`, `events.html`, `gallery.html`, `partners.html` | Nenhuma | Limpar container no branch de resultado vazio, mesmo padrão de `board.html`/`sobre.html` | Baixo — mudança local e isolada por arquivo |
| Motor de preços hardcoded (#1, #2, #4) | `functions/index.js`, schema de `organizations/{orgId}` | Migração de dados para orgs existentes | `organizations/{orgId}.billing.plans[]`, fallback para valores atuais do CCBMG durante a transição | Médio — toca o caminho de cobrança real, exige testes de regressão completos antes de deploy |

### Fase 2 — Alto
| Problema | Arquivos afetados | Dependências | Solução | Risco da mudança |
|---|---|---|---|---|
| Comissão/incremento de leilão (#5, #6, #7, #44, #45) | `functions/index.js`, `leilao_lote.html`, `lote_form.html`, `admin_leiloes.html`, `meus_lotes.html` | Fase 1 (padrão de campo em `organizations/{orgId}.business.*`) | Campo `business.auction.*` + interpolação nos textos estáticos | Médio — múltiplos arquivos, mas mudança mecânica |
| Grace period/renovação (#46) | `pg_associado.html` | Nenhuma | Ler `organizations/{orgId}.business.membership.*`, com default 5 dias | Baixo |
| WhatsApp/telefone não dinâmico (#28-#30) | `shared/core/tenant/branding.js`, `index.html`, `board.html`, `pay.html`, `sobre.html` | Nenhuma (campo já existe) | Adicionar leitura de `telefone` + marcador `[data-tenant-phone]` | Baixo |
| Endereço gated só por sandbox (#37) | `index.html`, `board.html` | Depende de decisão de produto: endereço vira campo CMS ou continua estático-com-override | Migrar para campo de organização em vez de gate binário | Médio — requer decisão de produto sobre onde esse dado deveria morar |
| Taxonomia de planos hardcoded no Painel Master (#24-#27) | `organization-detail.html`, `organizations.html`, `index.html`, `subscriptions.html` | Nenhuma (`systemPlans` já existe) | Substituir `<select>`/`PLAN_LABELS` estáticos por consulta dinâmica | Baixo |
| reCAPTCHA site key fixa (#13) | `functions/index.js` | Nenhuma | Mover para `organizations/{orgId}.security.recaptchaSiteKey` | Médio — requer criar uma chave reCAPTCHA por domínio de tenant |
| Provider/locale hardcoded no provisionamento (#8, #9) | `functions/lib/provisioning.js` | Nenhuma | Aceitar como parâmetros de entrada em vez de constante | Baixo |

### Fase 3 — Médio
| Problema | Arquivos afetados | Dependências | Solução | Risco da mudança |
|---|---|---|---|---|
| Preços duplicados no frontend admin (#39-#42) | `admin_associados.html`, `sobre.html`, `admin_sobre.html` | Fase 1 (campo de planos) | Ler o mesmo campo `billing.plans[]` em vez de constantes locais | Baixo, mecânico |
| Regra de classificados (#43) | `classificados.html` | Nenhum campo hoje | Criar `business.classifieds.*` + interpolação | Baixo |
| Redes sociais não lidas (#36) | `index.html`, `board.html`, `branding.js` | Campo já existe | Consumir `portal.redesSociais` | Baixo |
| Conta SMTP compartilhada (#12) | `functions/index.js` | Padrão de `billingConfig.secretName` já existe | Replicar padrão para e-mail | Médio — requer criar credenciais por tenant que precisar |
| Notification channel policy hardcoded (#10) | `functions/lib/billing/asaas.js` | Nenhuma | Campo `communication.notificationChannels` com default = política atual do CCBMG | Baixo |

### Fase 4 — Baixo
| Problema | Arquivos afetados | Dependências | Solução | Risco da mudança |
|---|---|---|---|---|
| Placeholder desatualizado (#23) | `organization-provision.html` | Nenhuma | Trocar texto de exemplo, alinhar com o que CLAUDE.md já afirma estar feito | Nenhum |
| Placeholders de telefone (#38) | `admin_master_associacoes.html` | Nenhuma | Trocar por texto genérico | Nenhum |
| `role: 'Master'` capitalizado (#16) | `functions/lib/provisioning.js` | Nenhuma | Normalizar para `'master'` minúsculo | Baixo — checar todo comparador de role antes |
| Fallback `org_bonfim` morto (#14) | `functions/index.js` | Nenhuma | Trocar por early-return/log quando `organizations` estiver vazio | Nenhum — caminho já inatingível hoje |
| Seed script com preço duplicado (#22) | `functions/scripts/seedSandboxTenant.js` | Fase 1 | Importar do mesmo lugar que a Cloud Function passar a usar | Nenhum, é tooling |
| Nome de arquivo `logo_CCBMG.png` (#49) | 41 páginas HTML | Nenhuma | Renomear asset (cosmético) | Baixo |
| Placeholder inconsistente de URL base (#47) | `admin_master_configuracoes.html` | Nenhuma | Trocar por texto genérico | Nenhum |

---

## 11. MATRIZ FINAL

| Área | Hard-coded encontrado | Já dinâmico | Precisa correção | Risco |
|---|---:|---:|---:|---|
| Identidade/Branding (frontend) | 8 | 6+ campos | Sim (5 itens) | Médio |
| Dados financeiros/Planos | 9 | 0 | Sim (todos) | **Crítico** |
| Regras de negócio (leilão/classificados/carência) | 7 | 0 | Sim (todos) | Alto |
| Comunicação (e-mail/notificações) | 3 | 1 campo (`notificationEmails`, mal utilizado) | Sim (todos) | **Crítico** |
| Integrações (Asaas/reCAPTCHA/SMTP) | 4 | 1 padrão replicável (`billingConfig.secretName`) | Sim (3 de 4) | Alto |
| Firestore (queries/paths) | 1 (fallback morto) | Rules + Indexes 100% limpos | Baixo (cosmético) | Baixo |
| Storage | 0 | 100% limpo | Não | — |
| Cloud Functions (geral) | 22 achados | ~9 arquivos confirmados limpos | Sim (maioria) | Alto |
| Security Rules | 0 | 100% limpo | Não | — |
| Painel Master (Configuração) | 6 | `plans.html`/`modules.html`/`domains.html` exemplares | Sim (taxonomia de planos) | Alto |
| Frontend (CCBMG) | ~20 | Maioria da identidade já dinâmica | Sim (financeiro + CMS empty-state) | **Crítico** |
| Infra (Worker/DNS) | 1 (legítimo) | — | Não (documentar limite) | Baixo |

---

## 12. TESTE CONCEITUAL DE SEGUNDO TENANT

Cenário: `orgId = org_associacao_exemplo`, nome/cidade/CNPJ diferentes, planos e valores diferentes, regras de negócio diferentes, branding diferente, provisionada via `provisionOrganization`, sem nenhum código alterado.

**O que já funciona corretamente, sem nenhuma alteração:**
- Login, resolução de organização por hostname/domínio, Security Rules, isolamento de dados entre tenants no Firestore/Storage.
- Identidade visual: nome, logo, favicon, cores primária/secundária, `<title>` dinâmico.
- Contato institucional: e-mail e endereço (quando cadastrado via CMS/branding — exceto o card estático de mapa, ver abaixo).
- Módulos ativos/inativos, feature flags.
- CNPJ/registro/sede exibidos via `sobre.html` (fonte: `cms_about`).
- Diretoria via `board.html` (fonte: `cms_board`), desde que populada.

**O que ainda exigiria alteração manual de código (não apenas de configuração) para essa organização funcionar corretamente:**

1. **Preços de mensalidade e desconto Mirim** — a organização cobraria automaticamente R$30/85/170 do CCBMG a menos que alguém edite `functions/index.js` diretamente (#1, #2, #4).
2. **Comissão e regras de leilão** (incremento mínimo, anti-sniper, split 5%+5%) — mesmo problema, só existe uma configuração global (#5-#7, #44-#45).
3. **Prazo de carência/renovação de associados** — `GRACE_OVERDUE_DAYS`/`RENEW_SOON_DAYS` fixos em `pg_associado.html` (#46).
4. **Preço/prazo mínimo de classificados** — texto estático sem nenhum campo de config (#43).
5. **reCAPTCHA de reset de senha por SMS** — precisaria de uma nova site key registrada para o domínio dessa organização, hardcoded manualmente em `functions/index.js` (#13).
6. **Conta de e-mail transacional** — continuaria usando a conta Gmail do CCBMG a menos que um novo secret seja criado e o código alterado para escolhê-lo (#12) — ou, pior, se `notificationEmails` não for configurado no provisionamento, PII de associados dessa organização vaza para os e-mails pessoais dos operadores do CCBMG (#11).
7. **Conta Asaas** — compartilharia a conta comercial do CCBMG a menos que um operador crie uma nova conta Asaas, um novo par de secrets, **e** um novo par de Cloud Functions de webhook seja hardcoded no código (#17, #18) — hoje o padrão só foi exercitado para exatamente 2 contas (produção CCBMG + sandbox), não é genérico para N contas.
8. **WhatsApp de contato/suporte** — mostraria o número de telefone do CCBMG em toda página pública e na página de pagamento (#28-#30).
9. **Link de rede social** — mostraria o Instagram do CCBMG (#36).
10. **Bloco de endereço/mapa institucional** — mostraria o endereço físico do CCBMG em `index.html`/`board.html`, já que o gate atual só reconhece "é o Sandbox" ou não (#37).
11. **Conteúdo público das páginas de banners, parceiros, eventos e galeria** — se essa organização ainda não tiver cadastrado seu próprio conteúdo via CMS no momento do lançamento, o site público exibiria fotos, nomes de parceiros comerciais e eventos reais do CCBMG (#31-#35) — o único jeito de evitar isso hoje seria popular manualmente o CMS **antes** de qualquer visitante acessar o site, o que é operacionalmente frágil (não é proteção de código, é disciplina de processo).
12. **Atribuição de um plano no Painel Master**, se esse plano tiver um nome fora de `starter/professional/enterprise/custom` — a tela de detalhe da organização e a de assinaturas não reconheceriam o plano (#24-#27).

Em resumo: a **camada de infraestrutura de tenant está pronta**; a **camada de regras de negócio e comunicação ainda não está** — e dois desses pontos (#11 e #31-#35) são vazamentos de dado/conteúdo entre tenants, não apenas inconveniência operacional.
