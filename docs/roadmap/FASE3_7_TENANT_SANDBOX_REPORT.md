# Fase 3.7 — Tenant Sandbox Oficial da Plataforma — Relatório

*Consolidado a partir do registro em `CLAUDE.md` (repositório `clubedocavalobonfimmg`) durante a reorganização de documentação de agosto de 2026 — não é um relatório escrito no momento da implementação original, como os das Fases 3.1–3.6.*

---

## 1. Resumo executivo

A plataforma sempre teve um único ambiente Firebase (`clubecavalobonfim`) — sem projeto de staging separado. Esta fase resolve isso sem criar um segundo projeto: transforma um tenant já existente no ambiente permanente de desenvolvimento funcional, homologação, QA, demonstrações comerciais, treinamento e validação de integrações — **nunca dados reais**. Não é um tenant qualquer; é *o* Sandbox oficial da plataforma (singular), do mesmo jeito que CCBMG é hoje o único tenant de produção real.

## 2. Identificação — nunca por nome

```
organizations/org_teste_etapa10
  nome: "Clube dos Associados"           — só exibição, igual a qualquer outra organização
  isSandbox: true                        — a ÚNICA fonte de verdade sobre "isto é o Sandbox"
  environment: "sandbox"
  isDemoTenant: true
```

Qualquer código futuro que precise se comportar diferente num tenant de demonstração (throttling mais permissivo, banners de aviso, exclusão de relatórios agregados, etc.) deve checar `organizations/{orgId}.isSandbox === true` — nunca `nome === "Clube dos Associados"` ou qualquer variação de string. O nome é só rótulo; pode mudar sem quebrar nada que dependa da flag.

## 3. Asaas Sandbox — reaproveitando a resolução por organização que já existia

A Fase 3.4 já tinha criado `getBillingProvider({org, getSecret, defaultSecretName})` (`functions/lib/billing/index.js`) e `createAsaasBillingProvider({apiKey, environment})` (`functions/lib/billing/asaas.js`, que já resolvia `sandbox.asaas.com` vs `api.asaas.com` a partir de `org.billingEnvironment`) — e todo o outbound (criar cliente, assinatura, cobrança, cancelar, etc.) já passava por `getProviderForOrg(orgId)` em `functions/index.js` desde então. Ou seja: **a "camada única de resolução do ambiente de pagamento" pedida nesta fase já existia** — não foi criada de novo, só configurada e, pela primeira vez, exercitada com uma segunda conta Asaas de verdade.

```
organizations/org_teste_etapa10
  billingProvider: "asaas"
  billingEnvironment: "sandbox"
  billingConfig.secretName: "projects/clubecavalobonfim/secrets/asaas-sandbox-api-key/versions/latest"
```

Qualquer Cloud Function que já chamava `getProviderForOrg(userData.orgId)` (criação de assinatura, sincronização de dados cadastrais, cancelamento/reativação self-service, cobrança avulsa, etc.) automaticamente passou a falar com o Asaas Sandbox para este tenant, com **zero mudança de código** nesses pontos — só a configuração da organização mudou. CCBMG (`org_bonfim`) continua sem `billingEnvironment` (ausente = produção, comportamento 100% retrocompatível).

### Webhook por-organização — a única lacuna real

O webhook (inbound) nunca tinha sido pensado por-organização — o comentário original de `asaasWebhook` já dizia "só passa a ser por-organização quando existir mais de uma conta Asaas na plataforma" (Fase 2B). Esta fase chegou nesse ponto. Como o Asaas configura webhook por CONTA (não por payload — não há como saber a organização antes de validar o token), a solução foi mirror do padrão que `auctionAsaasWebhook` já usava (endpoint + secret dedicados), não um roteamento em tempo de requisição:

| Função | Token (Secret Manager) | Provider |
|---|---|---|
| `asaasWebhook` (inalterado no comportamento) | `asaas-webhook-token` | conta Asaas Production (CCBMG e demais tenants futuros de produção) |
| `asaasSandboxWebhook` (novo) | `asaas-sandbox-webhook-token` | conta Asaas Sandbox (só o tenant Sandbox oficial) |

Ambos chamam o mesmo `handleAsaasWebhookRequest()` extraído de dentro de `asaasWebhook` — nenhuma lógica duplicada. A assinatura de webhook em si foi criada via `POST /v3/webhooks` da própria API do Asaas Sandbox (não precisa do painel manualmente): URL `https://us-central1-clubecavalobonfim.cloudfunctions.net/asaasSandboxWebhook`, eventos `PAYMENT_RECEIVED`/`PAYMENT_CONFIRMED`, `authToken` = valor do secret `asaas-sandbox-webhook-token` (gerado por este projeto, não pelo Asaas — é o mesmo token que a Cloud Function espera no header `asaas-access-token`).

**Validado ponta a ponta nesta fase**: uma cobrança real marcada como recebida no Asaas Sandbox disparou o webhook, que criou `financeInvoices` e atualizou `finance/summary` no Firestore automaticamente, sem nenhuma intervenção manual.

## 4. Seed Oficial — `functions/scripts/seedSandboxTenant.js`

Não existia nenhum seed reaproveitável antes desta fase (`functions/test/helpers/seed.js` é infraestrutura de teste contra o emulador, não um seed de tenant real). O novo script roda direto contra produção via REST (Firestore, Identity Toolkit/Auth, Secret Manager), autenticado com `gcloud auth print-access-token` do operador logado — sem depender de Application Default Credentials nem de uma chave de serviço distribuída.

```
node functions/scripts/seedSandboxTenant.js [team|associados|financeFollowup|events|partners|classificados|repairAsaasLinks|all]
```

- **Guarda de segurança**: antes de qualquer escrita, confirma `organizations/{SANDBOX_ORG_ID}.isSandbox === true` — recusa rodar contra qualquer outra organização, mesmo se `SANDBOX_ORG_ID` for trocado por engano.
- **Idempotência por ID determinístico**: todo documento usa prefixo `sandbox_` (`sandbox_master_01`, `sandbox_assoc_01..35`, `sandbox_evt_01..05`, etc.) e `seedTag: "sandbox-seed-v1"`. Reexecutar nunca duplica.
- **`users/{uid}` é campo minado para overwrite total**: esse documento é co-dono de Cloud Functions (`onNewAssociadoCriado` grava `asaasId`/`asaasSubscriptionId`/`asaasSync`; `onAssociadoAtualizado` reage a mudanças de `ativo`). Um `PATCH` sem `updateMask` (overwrite completo) *apaga* esses campos a cada reexecução — bug real, encontrado e corrigido durante esta fase. A correção — `upsertUserFields()`, que só grava os campos explicitamente passados via `updateMask.fieldPaths` — é a razão de existir do passo `repairAsaasLinks` (reconstrói o vínculo com o Asaas Sandbox a partir de `findCustomerByExternalReference`/`listSubscriptionsByCustomer` quando algo precisar ser recuperado).
- **Sincronização real, não simulada**: criar os 40 associados/mirins com `cpf`/`role:"Associado"` dispara `onNewAssociadoCriado` de verdade (mesmo trigger de produção), que cria cliente + assinatura reais no Asaas Sandbox. O passo `financeFollowup` usa `provider.cancelSubscription()` (cancelados) e `provider.receiveInCash()` (adimplentes) — chamadas reais à API do Asaas Sandbox, reaproveitando `lib/billing/asaas.js` sem nenhum código novo de integração.
- **Equipe administrativa** (Master/2×Admin/2×Operador): sem `cpf` (não são associados pagantes — evita disparar `onNewAssociadoCriado`), e-mail fictício em `@sandbox.invalid` (TLD reservado pela IANA, nunca resolve de verdade), login por `login_master.html` (não `login.html`, que é exclusivo do fluxo CPF→`@cpf.local`) — nota: esta equipe foi posteriormente corrigida na Fase 3.12 para usar o mecanismo real de login (CPF via `login.html`), ver `FASE3_12_LOGIN_MASTER_LEGADO_REPORT.md`.
- **Distribuição de cenários** entre os 35 associados normais: 1–15 adimplentes (cobrança confirmada de verdade no Asaas Sandbox via `receiveInCash`), 16–20 inativos (`ativo:false` real, dispara `onAssociadoAtualizado` pausando a assinatura), 21–25 cancelados (`assinaturaCanceladaPeloAssociado:true` + assinatura pausada de verdade, sem tocar `ativo` — mesmo contrato do autocancelamento self-service), 26–30 inadimplentes (fatura vencida há 20 dias, escrita direta no Firestore), 31–35 recém-cadastrados (assinatura criada agora, primeira cobrança em aberto, sem pós-processamento). Os 5 Mirins seguem o fluxo normal de cobrança (sem CPF próprio, cobrados no CPF do responsável, valor pela metade — mesma regra de `resolvePlanValue()`).
- **Senha padrão** de todas as contas fictícias: `SandboxDemo#2026` (env `SANDBOX_SEED_PASSWORD` sobrescreve).

## 5. Fora de escopo desta fase (decisão deliberada)

- **Módulo de Notícias**: não existe em nenhum dos dois repositórios (nem coleção, nem tela admin, nem exibição pública — só menção em copy de marketing do Portal Associativo). Construir um módulo novo é mudança de produto, não seed de tenant; não foi feito.
- **Produtos/Serviços/Galeria/Diretoria/Leilões**: módulos ativados no plano (`plan: "enterprise"`, todos os módulos `true`) para o tenant ficar pronto pra uso, mas sem dados fictícios seedados — não estavam no escopo original desta fase (Usuários/Eventos/Parceiros/Classificados/Financeiro). Ficam como "estado vazio honesto" até alguém pedir.
