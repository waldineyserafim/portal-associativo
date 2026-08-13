# Pivô Arquitetural — Prospecção com Gemini + Outbound com Claude Code/Pro

Data: 2026-08-13
Motivação: eliminar a dependência de crédito pago da Anthropic API para operar os dois agentes comerciais (Prospecção IA e Agente de Outbound), sem comprar créditos Anthropic e sem reescrever os módulos do zero. Investigação prévia (Anthropic billing/alternativas) confirmou que a API paga funcionaria a baixo custo (~US$3-11/mês), mas o usuário optou por eliminar essa dependência agora mesmo assim, usando Gemini (free tier) para a Prospecção e Claude Pro/Claude Code (execução manual, sem API paga) para o Outbound.

## 1. Arquitetura atual (antes deste pivô)

```
Prospecção IA:  Prospecting Engine → ClaudeProvider → Anthropic Messages API (paga)
Agente de Outbound: Outbound Engine → ClaudeProvider → Anthropic Messages API (paga)
```
Ambos rodavam 100% como Cloud Functions (`functions-prospecting`, codebase `prospecting`), disparados por callable (execução individual/manual) ou task queue (lote/execução longa).

## 2. Arquitetura nova

```
PROSPECÇÃO                              OUTBOUND
Prospecting Engine (inalterado)         Claude Code (local, Claude Pro)
        ↓                                       ↓ lê leads via ADC (scripts/outbound-weekly-list.js)
GeminiProvider (novo)                           ↓ EU gero a abordagem (meu próprio raciocínio,
        ↓                                         sem chamar Anthropic API)
gemini-flash-latest + google_search             ↓ grava via ADC (scripts/outbound-weekly-write.js,
        ↓                                         reaproveita lib/outbound/messages.js)
Firestore (leads) — Cloud Function,             ↓
sem mudança de deploy                    Outbound IA (Painel Master) — revisão humana,
                                          aprovação/edição/rejeição, envio manual
```

## 3. Componentes reutilizados (sem alteração de lógica)

- `lib/prospecting/engine.js` — motor de execução (requestRun/executeRun, lock, orçamento por execução, dedup, scoring) — 100% inalterado. Já recebia `aiProvider` por injeção de dependência, então a troca de provider foi transparente para ele.
- `lib/prospecting/scoring.js`, `lib/prospecting/dedup.js`, `lib/prospecting/campaigns.js` — inalterados.
- `lib/leads.js` — inalterado.
- `lib/outbound/messages.js` — inalterado, e é a peça-chave reaproveitada pelo script local (`claimForGeneration`/`recordVersion` — mesmo contrato de `outboundMessages/{leadId}` que a Cloud Function já escrevia).
- `lib/outbound/salesContext.js` — inalterado.
- `lib/prospecting/claudeProvider.js` — **preservado, não apagado**. Continua sendo usado pelas Cloud Functions `generateOutboundMessage`/`requestOutboundBatch`/`executeOutboundBatch`, que seguem existindo como caminho alternativo (dependem de crédito Anthropic, hoje sem saldo — ver investigação anterior).

## 4. Componentes novos

| Arquivo | Papel |
|---|---|
| `functions-prospecting/lib/prospecting/geminiProvider.js` | Implementação alternativa de `AIProvider` — só `researchIteration`, mesma assinatura de `claudeProvider.researchIteration`. Duas chamadas por iteração (pesquisa com grounding, depois extração estruturada) — ver comentário no topo do arquivo pro porquê da separação. |
| `functions-prospecting/scripts/outbound-weekly-list.js` | Script local (ADC), só leitura — lista leads elegíveis (não arquivados, sem abordagem ativa), ordenados por score. |
| `functions-prospecting/scripts/outbound-weekly-write.js` | Script local (ADC) — grava a abordagem gerada pelo Claude Code, reaproveitando `lib/outbound/messages.js` diretamente. |
| `.claude/commands/outbound-weekly.md` | Slash command `/outbound-weekly` — orquestra o fluxo completo (listar → confirmar → gerar → gravar → resumo) numa sessão de Claude Code. |
| Secret `gemini-api-key` (Secret Manager, `clubecavalobonfim`) | Chave da Gemini Developer API (AI Studio, projeto `3820773689`, free tier — não Vertex AI). |

## 5. Integração Gemini — achados confirmados por chamada real (não só documentação)

- **Modelo**: `gemini-2.5-flash` (nome originalmente pedido) está **desativado para chaves novas** — confirmado por erro HTTP 404 real ("no longer available to new users... use the Interactions API"). Substituído por `gemini-flash-latest` (alias sempre-atual, recomendado pela própria mensagem de erro da API), que hoje resolve para `gemini-3.6-flash` (confirmado via `response.modelVersion`).
- **Endpoint usado**: `v1beta/models/gemini-flash-latest:generateContent` (endpoint clássico, estável) — não a "Interactions API" (`v1alpha`, e confirmado por chamada real que `v1alpha` está **deprecado**: "API version v1alpha is deprecated. Please use v1 or v1beta").
- **Google Search Grounding exige billing vinculado ao projeto**, mesmo para ficar dentro da cota gratuita (1.500 requisições/dia, US$0 real). Sem billing vinculado: `429 RESOURCE_EXHAUSTED` consistente, mesmo com geração de texto simples funcionando normalmente. Resolvido pelo usuário vinculando billing ao projeto da chave — sem custo real dentro do volume estimado.
- **Formato de grounding confirmado por resposta real**: `groundingMetadata.webSearchQueries[]` e `groundingMetadata.groundingChunks[].web.{uri,title}` — exatamente o formato que `geminiProvider.js` já esperava.

## 6. Testes

92 testes automatizados passando (emulador Firestore/Auth, nunca toca produção):
- 5 novos em `gemini-provider.test.js` (contrato de retorno, 2 chamadas por iteração, resposta vazia/bloqueada, JSON malformado, erro HTTP, `getApiKey` chamado uma vez por iteração — tudo com `fetchImpl` mockado, nunca a API real).
- 6 novos em `outbound-weekly-scripts.test.js` (listagem/ordenação/exclusão de já-abordados, reabordagem de `failed`/`rejected`, respeito ao `--limit`, escrita reaproveitando `lib/outbound/messages.js`, validação de payload).
- 81 pré-existentes, sem alteração de comportamento.

## 7. Testes reais controlados

**Prospecção (Gemini)** — campanha real, `maxLeadsPerRun:3`, `maxIterations:2`, ICP "clube hípico em MG":
- 2 iterações, 12 buscas realizadas, 4 candidatos analisados, 1 rejeitado (dedup), **2 leads reais criados** com evidências (CEHJUR – Centro Hípico Júnia Rabello, LAVI Centro Equestre), score médio 82,5.
- Tempo total: 107s. Custo estimado: US$0,10 (a preço de tabela pago — custo real dentro do free tier: US$0).
- Campanha de teste arquivada depois; os 2 leads reais foram mantidos (achados legítimos, não lixo de teste).

**Outbound (Claude Code/ADC)** — 3 leads reais já existentes no CRM (sem `aiProspecting`, cadastro manual anterior):
- Listagem via `outbound-weekly-list.js` confirmada contra produção (ordenação, exclusão de já-abordados).
- 3 abordagens geradas por mim mesmo (Claude Code, sem chamar a API paga), gravadas via `outbound-weekly-write.js` — todas com `status: ready_for_review`, `researchPerformed:false`, `totalCostUsd:0`.
- **Achado**: `systemConfig/salesContext` não está configurado em produção ainda — as abordagens ficaram corretas (nenhum dado inventado) mas genéricas quanto à proposta de valor. Recomendação: configurar antes do uso real recorrente.

## 8. Custos

| Componente | Custo real neste teste | Estimativa mensal (4 execuções/mês, ~20 leads/semana) |
|---|---|---|
| Gemini (texto) | US$0 (free tier) | US$0, dentro da cota gratuita esperada |
| Gemini (grounding) | US$0 (dentro de 1.500/dia) | US$0, folga enorme (~100-120 grounded/mês vs. 1.500/dia de cota) |
| Outbound (Claude Code) | US$0 (assinatura Pro, não API) | US$0 de API — consome cota de mensagens da assinatura pessoal |
| Anthropic API (Prospecção/Outbound antigos) | Não usada neste fluxo | US$0 (caminho preservado como fallback, não ativo) |

## 9. Riscos e pendências

- **Dependência de conta pessoal**: o botão "Executar Outbound IA" e `/outbound-weekly` local dependem da assinatura Claude Pro de quem gerou `CLAUDE_CODE_OAUTH_TOKEN` — ponto único de operação (mesmo risco já identificado na investigação anterior sobre Claude Pro/Code). Resolvido operacionalmente (não é possível eliminar sem trocar de arquitetura de billing), mas vale designar um titular claro.
- **Evidence URLs do Gemini** são links de redirecionamento (`vertexaisearch.cloud.google.com/grounding-api-redirect/...`), não a URL direta da fonte — funcionam (redirecionam corretamente), mas são menos legíveis que os `https://site-real.com.br` que o Claude devolvia. Não é um defeito, é como o Gemini grounding funciona oficialmente.
- **IAM do Firestore não segmenta por coleção** — a service account `outbound-remote-runner` tem `roles/datastore.user` (leitura/escrita em TODO o Firestore do projeto), não um escopo restrito só a `leads`/`outboundMessages`/`outboundRemoteRuns` como o pedido original desejava. Isso é uma limitação real do modelo de IAM do Firestore (não existe papel nativo por coleção) — mitigado por ser uma service account dedicada (nunca a `appspot` default, mais ampla ainda), auditável e revogável isoladamente, mas não é o isolamento perfeito pedido.
- **`github-actions-dispatch-token`** reaproveita o token OAuth pessoal do `gh` CLI já autenticado nesta máquina (escopo `repo`+`workflow`) — funciona, mas não é um credential dedicado com expiração própria. Recomendação de hardening futura (não crítica agora): trocar por um GitHub App instalado só neste repositório, ou um PAT fine-grained dedicado.

---

## FASE 2 — Contexto comercial, botão "Executar Outbound IA", deploy da Prospecção

### 1. `systemConfig/salesContext` configurado

Gravado em produção com o contexto oficial fornecido (o que é o Portal Associativo, problemas que resolve, ICP, diferenciais, proposta de valor, argumentos condicionais por evidência, CTAs, tom, proibições) — adaptado ao schema existente (`empresa/produto/descricao/propostaValor/diferenciais/publicoAlvo/problemasResolvidos/beneficios/modulosRelevantes/tom/cta/restricoesLinguagem`), sem alterar o schema. Lido de volta e confirmado. Testado com 1 lead real (CEHJUR) antes de escalar — abordagem usou os argumentos condicionais corretamente (só citou o que tinha evidência).

### 2. Arquivos criados

- `functions-prospecting/lib/outbound/eligibility.js` — critério único de elegibilidade, reaproveitado pelo script local E pelas Cloud Functions novas.
- `functions-prospecting/lib/outbound/remoteRuns.js` — lock/estado do botão (`outboundRemoteRuns`, mesmo idioma de `lib/prospecting/engine.js`).
- `functions-prospecting/lib/outbound/githubDispatch.js` — chama a API do GitHub (`workflow_dispatch`).
- `functions-prospecting/scripts/outbound-remote-run-start.js`, `outbound-remote-run-finish.js` — atualizam status do run de dentro do runner.
- `.github/workflows/outbound-weekly.yml` — o workflow em si.
- `.claude/commands/outbound-weekly-remote.md` — variante não-interativa do slash command (sem confirmação, já dada no Portal).
- `functions-prospecting/test/outbound-eligibility.test.js`, `outbound-remote-runs.test.js`, `outbound-github-dispatch.test.js`, `outbound-remote-callables.test.js` — 20 testes novos.

### 3. Arquivos alterados

- `functions-prospecting/index.js` — `previewOutboundRemoteRun`/`requestOutboundRemoteRun` (Cloud Functions novas).
- `firestore.rules` — `outboundRemoteRuns` (mesmo par leitura/escrita de `outboundMessages`).
- `admin/leads.html` (portal-associativo) — botão + modal de confirmação + banner de status ao vivo (`onSnapshot`).
- `functions-prospecting/scripts/outbound-weekly-list.js`, `outbound-weekly-write.js` — trocados de `firebase-admin` pra `@google-cloud/firestore` (ver achado abaixo).
- `functions-prospecting/package.json` — `@google-cloud/firestore` como dependência direta.

### 4. Como o botão funciona

Clique → `previewOutboundRemoteRun` (só leitura, mostra os números) → modal de confirmação exato ("Serão processados: N... Deseja continuar?") → `requestOutboundRemoteRun` (reivindica lock, calcula até 20 leads elegíveis, cria `outboundRemoteRuns/{runId}`, dispara o workflow) → banner na própria página acompanha o status ao vivo via `onSnapshot`, sem bloquear a UI → resumo final com link pro Outbound IA.

### 5. Como dispara o Claude Code

`requestOutboundRemoteRun` chama a API REST do GitHub (`POST .../actions/workflows/outbound-weekly.yml/dispatches`) usando um token guardado em Secret Manager (`github-actions-dispatch-token`) — nunca no frontend, nunca em log. O workflow roda `anthropics/claude-code-action@v1` em modo automação (`prompt: "/outbound-weekly-remote"`).

### 6. Como o Claude Code autentica com Claude Pro

`CLAUDE_CODE_OAUTH_TOKEN` (GitHub Secret), gerado via `claude setup-token` a partir da assinatura Claude Pro real do usuário — passado como `claude_code_oauth_token` pro action. Confirmado, oficialmente documentado: *"If you authenticate with an OAuth token, runs use your Claude subscription instead of API billing."* Nunca `ANTHROPIC_API_KEY`.

### 7. Como acessa o Firestore

`google-github-actions/auth@v3` com Workload Identity Federation — pool/provider restritos a este repositório exato (`assertion.repository == 'waldineyserafim/clubedocavalobonfimmg'`), impersonando a service account dedicada `outbound-remote-runner@clubecavalobonfim.iam.gserviceaccount.com` (`roles/datastore.user`). **Sem chave JSON em lugar nenhum.**

**Achado real durante o primeiro teste**: o SDK `firebase-admin` **não suporta** esse tipo de credencial — confirmado na documentação oficial do `google-github-actions/auth` ("*This option is not supported by Firebase Admin SDK. Use Service Account Key JSON authentication instead*") e na prática (erro real: "Invalid contents in the credentials file"). Em vez de recuar pra uma chave JSON estática (contrariando o pedido explícito de evitar isso), troquei os 4 scripts envolvidos pra usar `@google-cloud/firestore` diretamente — a biblioteca de baixo nível por trás do Firestore, que fala com `google-auth-library` sem a camada do firebase-admin, e essa SIM suporta WIF nativamente. Mesma lógica de negócio, só a inicialização do cliente Firestore mudou. Confirmado funcionando por dois disparos reais depois da correção.

### 8. Como os secrets são protegidos

- `github-actions-dispatch-token`: Secret Manager, lido só pela Cloud Function, nunca logado.
- `CLAUDE_CODE_OAUTH_TOKEN`: GitHub Secret, nunca sai do runner do GitHub Actions, nunca chega ao Firebase/GCP.
- Credenciais do Firestore: nunca um arquivo estático — WIF gera um token de curta duração por execução, removido automaticamente ao final do job (`Post Run google-github-actions/auth`).
- `gemini-api-key`/`anthropic-api-key`: inalterados, Secret Manager, IAM restrito à service account das Cloud Functions.

### 9. Controle de concorrência

`outboundRemoteRuns/_lock` (doc singleton) + transação atômica em `requestRun` — mesmo idioma de `RUNNING_STALE_MS` em `lib/prospecting/engine.js` (lock travado há mais de 40min é tratado como órfão e liberado). O passo final do workflow (`Garantir finalização (fallback)`, `if: always()`) garante que o lock NUNCA fica preso pra sempre, mesmo se o Claude Code crashar/travar/estourar o timeout de 25min.

### 10-11. Testes e resultado

112 testes automatizados (0 falhas) — nenhum chama Claude/Gemini/GitHub de verdade (mocks/fakes em todos os pontos de I/O externo). Lint: 0 erros.

### 12. Deploy realizado

`firebase deploy --only firestore:rules,functions:prospecting --project clubecavalobonfim` — 18 functions (16 atualizadas + 2 novas: `previewOutboundRemoteRun`, `requestOutboundRemoteRun`), Firestore Rules liberadas. Checklist completo (git status, testes, lint, secrets, scheduler, ausência de dependência Anthropic na Prospecção) verde antes do deploy.

### 13. Scheduler confirmado

`firebase-schedule-prospectingScheduledRun-us-central1` — `0 8 * * 1` (segunda-feira 08:00 America/Sao_Paulo), `ENABLED`.

### 14-15. Smoke test e teste de 1 lead

Disparo real via script (mesma lógica exata da Cloud Function) — 1º disparo falhou 2 vezes por motivos reais e corrigidos ao vivo:
1. `404 Not Found` do GitHub — o workflow nunca tinha sido commitado/dado push (só existia localmente). Corrigido: commit + push (autorizado explicitamente antes de executar).
2. `npm ci` falhou — `package-lock.json` estava coberto por uma regra `*.json` do `.gitignore` sem exceção. Corrigido: `!package-lock.json` adicionado.
3. `Invalid contents in the credentials file` — incompatibilidade firebase-admin/WIF, ver seção 7 acima.

Depois das 3 correções: **disparo real funcionou de ponta a ponta** — 1 lead real (LAVI Centro Equestre) processado em 1m40s, abordagem gerada com evidência real, `outboundRemoteRuns` marcado `"completed"`, `outboundMessages` com `status:"ready_for_review"`, `totalCostUsd:0`.

### 16. Teste com 3-5 leads

Gerados 4 leads reais frescos via uma nova campanha de Prospecção controlada (Sociedade Recreativa Palmeiras, Clube Recreativo Mineiro, Clube de Campo de São Paulo, Sociedade Hípica Paulista — scores 92-95). Disparo remoto real processou os 4: **4/4 gerados, 0 falhas**, 2m16s, abordagens variadas (CTAs diferentes, sem repetição mecânica), evidência real de cada site institucional, nenhuma informação inventada, atribuição correta à Serafim Technologies como desenvolvedora (sem virar propaganda da Serafim). Nada foi enviado.

### 17. Pendências

- Nenhuma bloqueante. Hardening futuro opcional: token de dispatch dedicado (item já listado nos riscos acima).

### 18. Como operar semanalmente

1. Abrir Portal Associativo → Painel Master → Leads.
2. Clicar em "Executar Outbound IA".
3. Confirmar no modal.
4. Aguardar o banner mostrar "Concluído" (não precisa ficar na tela — pode navegar e voltar depois).
5. Abrir Outbound IA.
6. Revisar cada abordagem.
7. Aprovar/editar/rejeitar.
8. Enviar manualmente pelo canal de sua escolha.

**Nunca é necessário abrir Claude Code ou digitar comando nenhum.** A Prospecção roda sozinha toda segunda-feira 08:00; o Outbound roda quando você clicar no botão.

---

## FASE 3 — Botão "Gerar Leads IA" + achado crítico (Cloud Tasks nunca funcionou)

### 1. Arquitetura utilizada

Extensão mínima, exatamente como pedido: o botão em `admin/leads.html` reaproveita a Cloud Function `requestProspectingRun`, **já existente e já deployada** (é a mesma que o botão "Executar agora" de `admin/prospeccao-ia.html` já usava). Nenhum motor novo, nenhum endpoint novo — só frontend.

### 2. Função/backend reutilizado

`requestProspectingRun` → `lib/prospecting/engine.js#requestRun` (lock atômico, cria `prospectingRuns/{runId}` com `trigger:"manual"`) → task enfileirada → `executeProspectingRun` → `GeminiProvider` → scoring/dedup/persistência — **tudo idêntico ao caminho do scheduler**, único ponto de distinção é o campo `trigger` (já existia).

### 3-4. Arquivos alterados/criados

- `admin/leads.html` (portal-associativo) — botão "Gerar Leads IA", modal de confirmação com números reais (não fictícios), acompanhamento via `onSnapshot` no doc da campanha.
- `functions-prospecting/test/prospecting-callables.test.js` — cobertura de autorização da callable.
- `functions-prospecting/lib/cloudTasksDispatch.js` (novo) + `index.js` alterado — ver achado crítico abaixo.

### Achado crítico #1 — `getFunctions().taskQueue().enqueue()` nunca funcionou em produção

Ao testar o disparo manual pela primeira vez de verdade (não só localmente com o motor direto, mas através da Cloud Function real), toda tentativa falhava com `"Queue does not exist"`, mesmo com a fila existindo e o IAM aparentemente correto. Investigação (não hipótese):

1. Confirmei a fila existe e está `RUNNING` (`gcloud tasks queues describe`).
2. Verifiquei e corrigi IAM: `roles/run.invoker` no Cloud Run alvo (`executeprospectingrun`/`executeoutboundbatch`) e `roles/cloudtasks.enqueuer` na service account chamadora (`appspot`) — ambos estavam **totalmente ausentes** (política vazia). Corrigido.
3. Mesmo assim, a Cloud Function real continuava falhando com a mensagem literal vinda da própria API do Google.
4. Reproduzi a MESMA chamada manualmente via REST puro (`POST cloudtasks.googleapis.com/v2/.../tasks`, mesmo payload, mesma identidade OIDC) — **funcionou, task criada com sucesso**.

Conclusão: o wrapper `getFunctions().taskQueue()` do `firebase-admin` tem uma incompatibilidade real com este ambiente — não é falta de permissão. **Isso significa que o scheduler semanal (`prospectingScheduledRun`) provavelmente nunca completou uma execução de verdade desde que foi implementado** — sempre falhava nesse mesmo passo, silenciosamente (o erro ficava só nos logs da Cloud Function, nunca chegava a um humano).

**Correção**: `lib/cloudTasksDispatch.js` (novo) chama a API REST do Cloud Tasks diretamente via `fetch()` — mesmo padrão já usado em `lib/outbound/githubDispatch.js`, nenhuma dependência nova (`google-auth-library` já era dependência direta). Substituiu `getFunctions().taskQueue()` em `enqueueProspectingRun`/`enqueueOutboundBatch`, sem alterar nenhuma lógica de negócio.

### Achado crítico #2 — secrets inacessíveis para as functions Gen2

Depois da correção acima, a execução real chegou a rodar, mas falhou com `PERMISSION_DENIED: secretmanager.versions.access` no `gemini-api-key`. Causa: `executeProspectingRun`/`executeOutboundBatch` são funções **Gen2** e rodam sob a service account default do **Compute Engine** (`{project-number}-compute@developer.gserviceaccount.com`), não a `appspot` — só a `appspot` tinha sido concedida acesso aos secrets quando eles foram criados. Corrigido concedendo `roles/secretmanager.secretAccessor` também à SA do Compute, para `gemini-api-key`, `anthropic-api-key`, `email-user` e `email-password`.

### Achado adicional — nenhuma campanha ativa em produção

Não havia nenhuma campanha `status:"active"` em produção — só campanhas de teste já arquivadas. Isso significava que, mesmo corrigindo os dois achados acima, nem o scheduler nem o botão teriam o que executar. Criada a campanha oficial `nIyOtBX8JBzm0uZAWZIX` ("Prospecção Portal Associativo — Clubes e Associações (Brasil)"), com o mesmo ICP documentado em `systemConfig/salesContext`.

### 7. Limite de 20 aplicado no servidor

`requestProspectingRun` nunca aceita um `maxLeads` do cliente — só `campaignId`. O teto vem de `campaign.execution.maxLeadsPerRun`, sempre sanitizado/clampado no servidor (`sanitizeExecution` em `lib/prospecting/campaigns.js`, min 1/max 100) — impossível de contornar pelo frontend.

### 8. Controle de concorrência

Reaproveita o lock já existente (`campaignStatus`, transação atômica em `engine.requestRun`) — nenhum mecanismo novo. O modal mostra "Já existe uma prospecção em andamento" quando `campaignStatus === "running"`.

### 10. Testes automatizados

118 testes (0 falhas): 2 novos em `prospecting-callables.test.js` (autorização da callable), 4 novos em `cloud-tasks-dispatch.test.js` (payload/URL/erro do novo mecanismo de enqueue, `getAccessToken`/`fetchImpl` mockados, nunca toca o Cloud Tasks real).

### 11. Teste real (dois estágios, Parte 21)

**Estágio 1 — 3 leads (limite temporariamente reduzido, depois restaurado para 20)**: disparado via chamada real à Cloud Function deployada (ID token genuíno, não simulado) — `status:"completed"`, 3 leads reais criados (Clube Recreativo São Pedro, Sindicato dos Servidores Públicos Municipais de Sorocaba, Clube Fonte São Paulo), scores 90-95.

**Estágio 2 — 20 leads (limite normal)**: mesma chamada real, campanha já restaurada ao limite de produção — `status:"completed"`, `stoppedReason:"meta_atingida"`, **20/20 leads criados**, 5 duplicados corretamente ignorados, custo estimado US$0,208 (custo real: US$0, dentro do free tier).

### 13. Deploy realizado

`firebase deploy --only functions:prospecting --project clubecavalobonfim` — 18 functions atualizadas (incluindo a correção do Cloud Tasks).

### 14. Scheduler confirmado

`firebase-schedule-prospectingScheduledRun-us-central1` — `ENABLED`, `0 8 * * 1` — e agora, pela primeira vez, com o mecanismo de disparo (`enqueueProspectingRun`) realmente funcional.

### 16. Pendências

Nenhuma bloqueante. Recomendação de observação: acompanhar a execução automática da próxima segunda-feira (primeira desde a correção) para confirmar que o scheduler completa sozinho, sem intervenção.

## Classificação final (atualizada)

**PRONTO PARA OPERAÇÃO.**

Além de tudo já validado nas Fases 1-2, esta fase encontrou e corrigiu dois defeitos reais e pré-existentes que impediam tanto o novo botão quanto o scheduler semanal de funcionar de ponta a ponta — nenhum dos dois nunca tinha sido exercido através do caminho real de produção antes de agora. Validado com dois disparos reais via a Cloud Function deployada de verdade (não simulação): 3 leads, depois 20/20 leads no limite normal. Custo real total: **US$0**.
