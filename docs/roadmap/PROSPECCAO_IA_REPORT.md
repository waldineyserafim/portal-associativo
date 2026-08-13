# Prospecção IA — Agente Autônomo de Prospecção Comercial — Relatório

## 1. Resumo executivo

Novo módulo de plataforma: um agente autônomo (Claude, via Messages API + tool `web_search` server-side) que pesquisa a web semanalmente e alimenta o funil comercial existente (`leads/{leadId}`, Release 2) com organizações candidatas a se tornarem novos tenants do Portal Associativo — **nunca** um CRM de leads por organização/tenant. Escopo confirmado explicitamente com o dono do produto antes de qualquer implementação (ver seção 2).

Backend (Cloud Functions, `functions/lib/prospecting/*.js`) mora no repositório `clubedocavalobonfimmg` — mesmo lugar de todo o resto do backend da plataforma (ver `CLAUDE.md` do CCBMG, seção "Organização"). Frontend (`admin/prospeccao-ia.html`, `admin/prospeccao-execucao.html`) mora aqui, no Painel Master.

263 testes de backend (0 falhas), incluindo toda a suíte pré-existente sem regressão.

## 2. Decisão de escopo — funil comercial da plataforma, não CRM por tenant

O prompt de implementação original descrevia isolamento "por tenant" (campanhas/leads/execuções nunca visíveis entre organizações), o que sugeria um CRM por organização. Auditoria do módulo `leads` existente revelou o oposto: `leads/{leadId}` é o funil comercial da própria Serafim Technologies (`segmento: clube|associacao|sindicato|conselho|ong|outro` — literalmente "tipos de organização candidatos a virar cliente da plataforma"), vive só no Painel Master, sem `orgId`, acessível só a Platform Administrator/Owner — nenhuma tela de CRM existe hoje dentro do painel de um tenant.

Duas leituras possíveis foram apresentadas ao dono do produto:
- **A — Funil comercial da Serafim** (escolhida): o agente busca *novas organizações candidatas a contratar a plataforma* e alimenta o `leads` existente exatamente como ele é hoje. Zero conflito arquitetural, reaproveita 100% do modelo de dados/regras/Painel Master já existentes.
- **B — CRM por tenant**: cada organização prospecta os próprios clientes/associados, exigindo um módulo de leads novo escopado por `orgId` — contradiria a decisão de design registrada em `lib/leads.js` de que Leads é "100% independente" de Organizações, e duplicaria conceito.

Confirmada a opção A antes de qualquer linha de código.

## 3. Arquitetura

### Entidades novas (projeto Firebase compartilhado)

- `prospectingCampaigns/{campaignId}` — identificação, ICP, config de pesquisa, config de qualificação (`scoreMinimo` configurável por campanha, nunca hard-coded), config de execução (`maxLeadsPerRun` padrão 20 — teto, nunca garantia — `maxIterations`, `maxCandidatesProcessed`, `timeoutSeconds`, `limiteConsumoUsd`), `campaignStatus: idle|running` (lock de concorrência).
- `prospectingRuns/{runId}` — mesmo padrão de `provisioningRuns` (Fase 3.3): array `steps[]` com progresso por etapa, nunca lança exceção pro chamador, atualizado incrementalmente pra suportar `onSnapshot` ao vivo. Métricas: pesquisas realizadas, candidatos analisados/rejeitados, leads criados/duplicados, score médio, custo estimado.
- `leadDedupIndex/{chaveNormalizada}` — índice auxiliar (domínio/telefone/e-mail/nome normalizados → `leadId`), evita varrer toda a coleção `leads` a cada candidato.
- `leads/{leadId}` — **nenhum schema paralelo**. Reaproveita o enum `origem` existente (`"prospeccao"` já estava lá) e ganha um sub-objeto opcional `aiProspecting: {campaignId, runId, score, qualificacao, evidence[], discoveredAt}`.

### Fluxo de execução — duas fases deliberadamente separadas

```
Cloud Scheduler (semanal) ou "Executar agora"
        │
        ▼
requestRun()  — RÁPIDO (Gen 1, mesmo teto de 9min do resto do repositório)
  reivindica o lock da campanha (transação atômica, mesmo padrão de
  provisionOrganization) e cria prospectingRuns/{runId} com status "queued"
        │
        ▼  (trigger onDocumentCreated)
executeRun()  — LONGO, minutos (Gen 2, timeout de até 30min)
  ciclo iterativo: pesquisa → validação → dedup → qualificação → score →
  criação de leads → relatório final, sempre liberando o lock no fim
```

Por quê: uma Cloud Function *callable* síncrona não pode bloquear por 10-25 minutos (proxy/hosting cortam a conexão bem antes disso). "Executar agora" só *pede* a execução e devolve o `runId` na hora; o Painel Master acompanha o progresso ao vivo via `onSnapshot` em `prospectingRuns/{runId}` — mesma UX do assistente de provisionamento (Fase 3.3).

**Risco explícito assumido**: `executeProspectingRun` é a única Cloud Function Gen 2 do backend — todo o resto do repositório é Gen 1 (teto de 540s). Desvio justificado por ser a única carga de trabalho longa; usa `firebase-functions/v2/firestore`, já disponível na versão instalada (`firebase-functions@4.9.0` empacota v1 e v2 no mesmo pacote).

### Integração Claude — pesquisa web server-side, oficialmente suportada

Confirmado contra a documentação oficial da Anthropic antes de implementar (não presumido): a Messages API suporta uma tool `web_search` server-side (`web_search_20260209`, com filtragem dinâmica) — o modelo pesquisa autonomamente, várias vezes se necessário, **dentro de uma única chamada de API** (loop server-side nativo, até 10 buscas por requisição; ao atingir o limite, `stop_reason: "pause_turn"` — reenviar a mesma conversa continua, sem mensagem extra). Não requer Managed Agents (que exigiria provisionar agents/environments/sessions/containers — infraestrutura pesada demais para uma execução semanal de até 20 leads).

`functions/lib/prospecting/claudeProvider.js` implementa uma abstração `AIProvider` simples (`researchIteration(campaign, context) → {candidates, buscaResumo, usage, costUsd}`), com `ClaudeProvider` como única implementação — permite trocar de provider no futuro sem tocar no orquestrador, sem acoplar toda a arquitetura ao Claude, conforme pedido.

Padrão de chamada: `claude-sonnet-5` (custo/qualidade para pesquisa+qualificação em volume — Opus reservado para se a qualidade não for suficiente), tool `web_search_20260209` + `web_fetch_20260209` + uma tool custom `submit_candidates` (schema JSON com organização/segmento/localização/contato/score/evidências por candidato) que o modelo chama ao terminar de pesquisar — mais robusto que forçar `output_config.format` por cima de um turno que também usa tools server-side.

**O score final é sempre calculado em código, nunca confiado ao modelo.** Claude propõe um score e evidências (tem o contexto pra julgar), mas `functions/lib/prospecting/scoring.js` (`evaluateCandidate`, puro, sem I/O) decide deterministicamente se um candidato é "quente" comparando contra `campaign.qualification.scoreMinimo` — auditável e reproduzível, nunca varia por causa de uma resposta diferente do modelo numa nova chamada. Testado explicitamente: um candidato com `score: 69` e `qualificacao: "quente"` proposto pelo próprio Claude é reclassificado como `nao_qualificado` se `scoreMinimo: 70`.

### Deduplicação

`functions/lib/prospecting/dedup.js` — normaliza domínio/telefone/e-mail/nome do candidato em chaves estáveis (`dominio:`, `telefone:`, `email:`, `nome:`) e mantém `leadDedupIndex` como índice auxiliar — qualquer chave em comum com um lead já existente (de qualquer origem, não só prospecção) bloqueia a criação de um duplicado.

### Ciclo iterativo e controle de custo

`functions/lib/prospecting/engine.js` implementa exatamente o ciclo descrito no prompt de implementação original (pesquisa → N candidatos → M qualificados → "ainda faltam N" → nova pesquisa), orquestrado em código (nunca deixado 100% autônomo dentro do Claude, por controle de custo). Para de pesquisar ao primeiro destes limites, todos configuráveis por campanha:

- `maxLeadsPerRun` atingido (`stoppedReason: "meta_atingida"`, status `"completed"` — resultado esperado, não interrupção)
- `maxIterations` esgotado sem atingir a meta (`"max_iterations"`, também `"completed"` — "12 leads em vez de 20" é aceitável, nunca um erro)
- `maxCandidatesProcessed`, `timeoutSeconds` ou `limiteConsumoUsd` atingidos (`"interrompida"` — a execução foi cortada por um limite de recurso)

**Nunca reduz o critério de qualidade pra atingir a meta** — `scoreMinimo` é sempre o mesmo, independente de quantos leads a execução já encontrou.

### Resiliência

`step()` (mesmo padrão de `provisioning.js`) nunca lança exceção — uma iteração de pesquisa que falha (rate limit, timeout, JSON inválido) é registrada como passo com erro e a execução segue para a próxima iteração. Um candidato malformado nunca derruba a iteração inteira (try/catch por candidato). O lock da campanha é **sempre** liberado (bloco `finally`), mesmo em falha totalmente inesperada — testado explicitamente com uma campanha com `execution: null` (dado corrompido) para confirmar que o motor nunca deixa uma campanha travada em `"running"` para sempre.

### Segurança

`prospectingCampaigns`/`prospectingRuns` — mesmo par de `firestore.rules` de `leads`: `read: isPlatformAdministrator()` (nem Platform Operator vê), `write: if false` (só Admin SDK, via Cloud Function). `leadDedupIndex` — `read/write: if false` por inteiro, nunca lido pelo cliente. Novo secret `anthropic-api-key` no Secret Manager, lido via `getSecret()` já existente (nenhuma credencial nova toca o frontend).

### LGPD

ICP e evidências priorizam dados empresariais/institucionais (nome da organização, site, contato institucional) — os mesmos campos já coletados manualmente em `leads` hoje (`contatoNome`, `contatoCargo`, `contatoWhatsapp`, `contatoEmail`), nenhum campo novo de dado pessoal. Toda evidência é registrada com URL/fonte — nunca uma afirmação sem origem verificável.

## 4. Frontend

`admin/prospeccao-ia.html` — lista de campanhas (status, frequência, resumo da última execução, meta) + modal de criação/edição (abas: Identificação/ICP/Pesquisa/Qualificação/Execução) + "Executar agora" + histórico de execuções recentes, seguindo o padrão de `admin/feature-flags.html` (modais Bootstrap, `httpsCallable`, tudo inline). `admin/prospeccao-ia` adicionado a `admin/assets/admin-nav.js`.

`admin/prospeccao-execucao.html?id={runId}` — detalhe de uma execução com progresso ao vivo via `onSnapshot` (mesmo padrão de `organization-provision.html`, Fase 3.3): KPIs, timeline de passos com spinner/check/erro por iteração, e lista dos leads criados nesta execução (linkando para `lead-detail.html`).

## 5. Testes (263 verificações, 0 falhas)

Suíte nova (`functions/test/prospecting-*.test.js`) roda contra o emulador Firestore/Auth, mesmo runner do resto do backend (`npm test`):

- `prospecting-dedup.test.js` — normalização pura + índice de dedup contra o emulador.
- `prospecting-scoring.test.js` — `evaluateCandidate` puro, sem I/O; inclui o caso explícito de o score do Claude nunca sobrepor o corte determinístico.
- `prospecting-campaigns.test.js` — CRUD + autorização (operator rejeitado, igual a `leads`) via Cloud Functions.
- `prospecting-engine.test.js` — o mais extenso: controle de concorrência (segunda execução simultânea rejeitada, lock antigo tratado como travado/self-heal), ciclo completo (candidato qualificado vira lead com evidências, candidato abaixo do score é rejeitado, candidato duplicado não cria outro lead), todos os limites de custo (`meta_atingida`, `limite_consumo`), resiliência a erro do provider numa iteração isolada, falha inesperada nunca trava o lock, e notificação por e-mail nunca derruba a execução se falhar.

**Modo seguro de teste**: todo o motor é testado com um `aiProvider` fake roteirizado (`makeScriptedProvider`) — nenhum teste chama a Claude API de verdade, zero custo.

## 6. Pendências operacionais antes do primeiro uso em produção

- [ ] Criar o secret `anthropic-api-key` no Secret Manager do projeto `clubecavalobonfim` (`projects/clubecavalobonfim/secrets/anthropic-api-key`) com uma chave da API da Anthropic — a implementação lê via `getSecret()`, mas o secret em si precisa ser criado manualmente no GCP (fora do escopo de código).
- [ ] Deploy das novas Cloud Functions (Gen 1: CRUD + `requestProspectingRun` + `prospectingScheduledRun`; Gen 2: `executeProspectingRun`) e das novas regras do Firestore.
- [ ] Criar a primeira campanha real (ICP do Portal Associativo) pelo Painel Master e validar uma execução manual antes de deixar a agenda semanal ativa.
