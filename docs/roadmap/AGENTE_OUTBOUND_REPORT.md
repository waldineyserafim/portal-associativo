# Agente de Outbound — Abordagem Comercial Assistida por IA — Relatório

## 1. Resumo executivo

Segundo agente da plataforma, construído como extensão natural do primeiro (ver `docs/roadmap/PROSPECCAO_IA_REPORT.md`): transforma leads já qualificados (pela Prospecção IA, ou cadastrados manualmente) em abordagens comerciais personalizadas — **sem enviar nada automaticamente**. Toda abordagem nasce em revisão humana; envio é sempre uma ação manual do comercial, registrada no sistema depois do fato.

Reaproveita, sem duplicar: o Lead existente (`leads/{leadId}`, nunca um segundo cadastro de prospect), o `ClaudeProvider` já implementado na Prospecção IA (mesma instância, mesma credencial, mesmo loop de tool-use — só uma tool final diferente), e a mesma arquitetura de duas fases request/execute pra geração em lote.

306 testes de backend (0 falhas), incluindo toda a suíte anterior sem regressão. 60/60 testes de Firestore Rules. ESLint sem novos avisos.

## 2. Arquitetura — extensão, não duplicação

### Auditoria prévia (CLAUDE.md "Arquitetura", itens 1-7 do prompt de implementação)

- `leads/{leadId}` já tem todos os campos necessários pra contexto de personalização (`organizacaoNome`, `segmento`, `cidade`, `estado`, `contatoNome`, `contatoCargo`, `dores`, `necessidades`, `observacoes`) e, quando veio da Prospecção IA, `aiProspecting.{score,qualificacao,evidence[]}` — reaproveitado como está, nenhum campo novo no lead.
- `systemConfig/{docId}` já existia em `firestore.rules` (`read: isPlatformStaff()`, `write: isPlatformAdministrator()`), **sem nenhum leitor/escritor real** — reaproveitado pra guardar o contexto comercial (`systemConfig/salesContext`), em vez de criar uma coleção nova.
- `functions/lib/prospecting/claudeProvider.js` — o loop de tool-use (envio, acúmulo de uso, resolução de `pause_turn`) foi **extraído pra uma função compartilhada** (`runToolLoop`) e reaproveitado por um novo método `generateOutboundApproach` na MESMA factory `createClaudeProvider` — nunca uma segunda integração Claude, nunca um segundo cliente HTTP.
- O padrão de duas Cloud Functions (rápida que só cria o doc de execução + Gen 2 que executa de verdade, disparada por trigger de criação de documento) da Prospecção IA foi reaplicado pro lote de Outbound (`requestOutboundBatch`/`executeOutboundBatch`) — mesma arquitetura, motor de execução diferente (não há iteração de pesquisa+dedup+score aqui, só N gerações independentes).

### Entidades novas

- `outboundMessages/{leadId}` — **o próprio `leadId` é o ID do documento** (nunca um segundo cadastro de prospect, nunca duplicado por regeneração): status (`pending`/`generating`/`ready_for_review`/`approved`/`rejected`/`edited`/`sent`/`responded`/`failed`), canal, conteúdo atual (subject/message/cta/personalizationSummary/motivos/evidence — denormalizado da versão mais recente), contadores de geração/custo.
- `outboundMessages/{leadId}/versions/{versionId}` — append-only, nunca editado nem apagado: cada geração da IA e cada edição humana vira uma versão nova, preservando as anteriores (CLAUDE.md "Regeração"/"Edição Humana").
- `outboundBatches/{batchId}` — rastreamento de uma geração em lote (lista de leads, resultado por lead, resumo), mesmo padrão de `prospectingRuns`.

Firestore Rules: mesmo par de `leads`/`prospectingCampaigns` — `read: isPlatformAdministrator()`, `write: if false` (só Cloud Function). `systemConfig` não precisou de nenhuma mudança de Rules — já estava correto.

### Fluxo de geração — resiliente, nunca lança por resposta ruim do modelo

```
Lead qualificado
      │
      ▼
generateForLead(leadId)  — claim atômico (nunca 2 gerações simultâneas pro
      │                     mesmo lead — bug real encontrado e corrigido
      │                     durante o desenvolvimento, ver seção 6)
      ▼
Claude gera (tool submit_approach) — até 2 tentativas com retry
      │
      ├─ sucesso → nova versão registrada, status "ready_for_review"
      └─ falha em ambas → status "failed", NUNCA lança exceção pro lote
```

O corte de qualidade nunca é confiado só ao modelo: o sistema valida que `message` não veio vazio antes de aceitar a geração como sucesso — uma resposta vazia é tratada como falha e entra no fluxo de retry, exatamente como um erro de rede.

### Geração individual vs. em lote

- **Individual** (`generateOutboundMessage`, "Gerar abordagem com IA" no Lead): callable Gen 1 síncrona — 1 a 3 chamadas Claude cabem folgado no teto de 9 minutos, sem precisar do desenho request/execute.
- **Em lote** (seleção múltipla em `leads.html` → `requestOutboundBatch` + `executeOutboundBatch`): a mesma separação rápido/lento da Prospecção IA, porque N gerações sequenciais podem passar do teto do Gen 1. Teto de 50 leads por lote (nunca "todos os leads sem ação explícita").

### Pesquisa adicional — limitada por padrão, opt-in explícito

`allowResearch` (checkbox no Painel Master) controla se as tools `web_search`/`web_fetch` são sequer oferecidas ao modelo nesta geração — quando desligado, a tool nem existe na requisição, custo zero de busca. Quando ligado, `max_uses` bem mais baixo que o da Prospecção IA (3 buscas + 2 fetches, contra 10+5) — o objetivo aqui é uma frase pontual de personalização, nunca uma pesquisa exaustiva. O prompt instrui explicitamente o modelo a só pesquisar se as evidências já fornecidas pela Prospecção IA não bastarem.

## 3. Qualidade da abordagem — regras no prompt, nunca hard-coded

O contexto comercial (`systemConfig/salesContext`: empresa, produto, proposta de valor, diferenciais, público-alvo, problemas resolvidos, benefícios, módulos relevantes, tom, CTA padrão, restrições de linguagem) é injetado no prompt em tempo de execução — a Serafim pode mudar a argumentação comercial pela tela **Outbound IA → Contexto comercial**, sem tocar em código.

Regras inegociáveis fixas no prompt (`buildOutboundSystemPrompt`, `functions/lib/prospecting/claudeProvider.js`): nunca afirmar um fato sobre o lead sem evidência, nunca inventar problema/cliente/evento/cargo/faturamento/tecnologia, mensagem curta e objetiva, CTA simples sem pressionar, e — quando o canal é e-mail — assunto curto e nunca clickbait.

## 4. Revisão humana — nenhum envio automático

Estados e transições (mesmo vocabulário do prompt de implementação): `ready_for_review`/`edited` podem ser aprovados ou rejeitados; `approved`/`edited` podem ser marcados como `sent` (SEMPRE uma ação manual do comercial clicando "Marcar como enviada" — com confirmação explícita de que o envio já aconteceu fora do sistema); `sent` pode virar `responded`. Editar preserva `evidence`/`motivos`/`personalizationSummary` da versão da IA (o comercial edita texto, nunca redigita evidências) e sempre cria uma nova versão no histórico — a versão original da IA nunca é sobrescrita.

## 5. Frontend

- `admin/lead-detail.html` — nova aba **Outbound IA**: gerar/regenerar, editar (assunto/mensagem/CTA), aprovar/rejeitar, marcar como enviada, ver "por que esta abordagem foi criada" (resumo de personalização + motivos), tabela de evidências com link pra fonte, e histórico de versões.
- `admin/leads.html` — checkboxes de seleção por linha + barra de ação em lote ("Gerar abordagens (Outbound IA)"), redireciona pra `outbound-ia.html?batchId=...` com progresso ao vivo.
- `admin/outbound-ia.html` (novo, nav) — fila de abordagens filtrável por status, painel de progresso de lote via `onSnapshot` (mesmo padrão do assistente de provisionamento/das execuções de Prospecção IA), e modal de configuração do contexto comercial.

## 6. Testes (306 verificações, 0 falhas) — e um bug real encontrado

`functions/test/outbound-*.test.js`, mesmo runner/emulador do resto da suíte:

- `outbound-messages.test.js` — claim/lock (geração inicial, regeneração, concorrência, staleness/self-heal, estados terminais bloqueando regeneração), histórico de versões, transições de status.
- `outbound-engine.test.js` — geração individual e em lote com um `aiProvider` fake roteirizado (**nunca toca a Claude API de verdade — "modo seguro de teste", CLAUDE.md "Teste Real"**): lead inexistente/arquivado, sucesso, uso do `aiProspecting` do lead como contexto, concorrência real (`Promise.allSettled` de duas chamadas simultâneas), resposta vazia do modelo, retry com sucesso na 2ª tentativa, regeneração sem duplicar documento, lote com item falho não travando os demais, idempotência do executor de lote.
- `outbound-callables.test.js` — autorização de todas as Cloud Functions (operator sempre rejeitado) e o ciclo completo de aprovar/rejeitar/editar/marcar-enviada/marcar-respondida/configurar contexto comercial via callable real (nenhuma delas toca o Claude, então é seguro exercitá-las de ponta a ponta).

**Bug real encontrado pelo teste de concorrência, corrigido antes deste relatório**: a primeira versão de `claimForGeneration` usava uma transação com `tx.set()` pra criar o documento — mas `set()` nunca falha por já existir (diferente de `create()`), então duas chamadas simultâneas pro mesmo lead conseguiam as duas "criar" o documento, quebrando a garantia de "nunca 2 gerações simultâneas". Corrigido reaplicando o padrão de duas etapas já usado em `provisionOrganization` (`lib/provisioning.js`): tentativa atômica de `.create()` fora de transação (só uma de duas chamadas concorrentes consegue), e só quando o documento já existe é que entra a transação de lock/staleness. Reexecutado o teste de concorrência isoladamente e a suíte inteira do zero (emulador limpo) pra confirmar a correção sem mascarar com resíduo de execução anterior.

## 7. Segurança, LGPD e custo

Mesmos princípios da Prospecção IA (ver relatório dela): API key só no Secret Manager (nenhum secret novo — reaproveita `anthropic-api-key`), Firestore Rules restritas a Platform Administrator/Owner, evidências sempre com origem registrada. Controles de custo: máximo 2 tentativas por geração, pesquisa adicional desligada por padrão e com `max_uses` baixo quando ligada, teto de 50 leads por lote, custo estimado (`totalCostUsd`) acumulado por abordagem.

## 8. Pendências operacionais antes do primeiro uso em produção

- [ ] Configurar `systemConfig/salesContext` pela tela **Outbound IA → Contexto comercial** antes da primeira geração real — sem isso, o agente usa só os defaults genéricos (`empresa: "Serafim Technologies"`, tom padrão) e a personalização fica mais pobre.
- [ ] Deploy das novas Cloud Functions (Gen 1: `updateSalesContext`/`generateOutboundMessage`/`requestOutboundBatch`/`approveOutboundMessage`/`rejectOutboundMessage`/`editOutboundMessage`/`markOutboundMessageSent`/`markOutboundMessageResponded`; Gen 2: `executeOutboundBatch`) e das novas regras do Firestore — ver relatório consolidado de deploy (pendente, ver recomendação no relatório final da sessão).
- [ ] Testar com alguns leads reais já existentes antes de qualquer uso em volume (ver critério "Teste Real" do prompt de implementação) — gerar, nunca enviar, avaliar qualidade humanamente.
