# Fase 3.3 — Provisionamento Automático de Organizações — Relatório Final

**Status: implementação concluída, aguardando aprovação explícita para commit/push/deploy** (nos dois repositórios).

---

## 1. Resumo executivo

"Criar uma organização" deixou de significar "criar um documento" e passou a significar "criar um ambiente completo". `provisionOrganization` (Cloud Function, `functions/lib/provisioning.js`) é agora o único mecanismo oficial de criação de tenants: em uma chamada idempotente, cria o doc da organização, o primeiro Organization Master (conta Auth de verdade, nunca reaproveitada da equipe da plataforma), os módulos do plano escolhido, a estrutura de Billing Provider (sem nenhuma credencial), configurações básicas de branding e o conteúdo institucional mínimo — com auditoria detalhada por etapa.

A investigação desta fase (pesquisa dirigida + uma revisão crítica de arquitetura, ambas com achados verificados manualmente no código antes de confiar neles) encontrou 3 problemas reais que mudaram o desenho: um campo de Billing Provider que eu ia escrever não era o que o código realmente lê (bug pré-existente desde a Fase 3.1, corrigido nesta fase); "retirar o caminho manual de criação" exigia mudar Firestore Rules e um arquivo do painel antigo do CCBMG, não só trocar um botão no Painel Master novo; e duplo envio concorrente (dois administradores criando a mesma organização quase ao mesmo tempo) era um risco genuinamente novo que a técnica de idempotência das fases anteriores não cobria — resolvido com `.create()` atômico do Firestore em vez de "ler-então-escrever".

Nenhuma organização real foi criada — tudo construído e testado só contra o emulador, nunca produção.

## 2. Arquitetura do provisionamento

### Fluxo (7 passos, sequenciais, cada um idempotente por checagem de existência própria)

```
provisionOrganization(orgId, nome, planId, master{email,nome})
  │
  ├─ Validação prévia: systemPlans/{planId} existe? master.email já é conta de plataforma?
  │
  ├─ 1. organization (+plan)  — .create() ATÔMICO (não .set) — resolve corrida de duplo envio
  │      ├─ já existe + completed + sem forceReprocess → rejeita (already-exists)
  │      ├─ já existe + running (recente) → rejeita (evita 2 execuções em paralelo)
  │      └─ já existe + failed/running-stale/forceReprocess → reprocessa a partir daqui
  │
  ├─ 2. masterAccount  — cria conta Auth + users/{uid} (recupera conta órfã se
  │      reprocessamento encontrar uma criada numa tentativa anterior sem o doc)
  │      [convite por e-mail NÃO sai aqui — só no final, ver abaixo]
  │
  ├─ 3. modules   — copia systemPlans/{planId}.modules → organizations/{orgId}.modules
  ├─ 4. billing   — organizations/{orgId}.billingProvider = "asaas" (campo do TOPO)
  ├─ 5. branding  — organizations/{orgId}.config.{idioma,timezone,moeda}
  ├─ 6. storage   — NÃO-OP deliberado e registrado (object storage não tem pasta pra pré-criar)
  ├─ 7. cms       — cms_about/{orgId} (único singleton real), só se ainda não existir
  │
  └─ Se 1–7 todos "ok"/"skipped": envia convite por e-mail ao Master, marca organização "completed"
     Se algum "error": marca "failed" — organização/Master ficam como estão (sem rollback), disponíveis pra reprocessar
```

### Por que convite só no final

Achado da revisão crítica: se o e-mail saísse logo no passo 2, um Master recém-criado poderia entrar numa organização sem módulo, sem branding, no meio do provisionamento — não existe hoje nenhum gate de status de organização no login que impedisse isso. Como a senha da conta é aleatória (24 bytes, ninguém tem), a conta "existir" cedo é inofensivo; só o convite precisa esperar.

### Por que `.create()` atômico, não "ler-então-escrever"

Toda function idempotente anterior deste projeto (`backfillLeilaoOrgId`, `migratePlatformAdmins`) era um script de operador único — nenhuma precisou sobreviver a dois humanos clicando "criar" quase ao mesmo tempo pro mesmo slug. Um "ler doc → não existe → escrever" tem uma janela de corrida real nesse cenário. `.create()` do Firestore lança `ALREADY_EXISTS` (código 6, verificado empiricamente contra o emulador antes de confiar nisso) se o doc já existir — funciona como trava natural, sem infraestrutura nova. Uma segunda barreira fecha um buraco que a primeira sozinha não cobria: um provisionamento "running" recente também rejeita uma segunda tentativa (mesmo com `forceReprocess`), pra duas chamadas concorrentes não rodarem os passos 2–7 em paralelo uma da outra.

## 3. Rollback: sem exclusão automática, reprocessamento idempotente

Nenhum passo desfaz o anterior em caso de falha. Por passo: **organization** — se falhar, nada mais existe, não há o que desfazer. **masterAccount** — não é apagado automaticamente (apagar uma conta de login recém-criada é, em si, uma operação arriscada, o mesmo tanto de cuidado que `deleteAssociado` já exige hoje). **modules/billing/branding** — escritas de campo idempotentes, refazer é mais simples e mais seguro que desfazer-e-refazer. **cms** — mesma lógica do Master, apagar um doc que um humano pode estar olhando é pior que deixá-lo. Resultado prático: uma falha deixa a organização "parcialmente pronta" e totalmente observável (`provisioningRuns` mostra exatamente onde parou); "Reprocessar" é a forma de terminar, não de recomeçar do zero.

## 4. `provisioningRuns/{runId}` — auditoria

Atualizado incrementalmente (a cada passo, não só no final) — sobrevive a um timeout no meio da execução (300s, com chamada de Auth SDK no meio, é o tipo de operação que já se sabe estourar o timeout padrão de 60s deste projeto) com um registro exato de até onde chegou. Leitura = qualquer papel de plataforma; escrita = só Cloud Functions — mesma garantia estrutural de `platformAdmins` desde a Fase 3.2.

## 5. Dois bugs/lacunas reais corrigidos nesta fase

- **`billingProvider` cosmético vs. real**: a aba Configurações (Fase 3.1) escrevia `organizations/{orgId}.config.billingProvider` — um campo que `functions/lib/billing/index.js` nunca lê (ele lê `org.billingProvider`, no topo). Os dois coexistiam sem ligação desde a Fase 3.1. Corrigido: a aba agora lê/escreve o campo real.
- **Dois caminhos manuais de criação ainda vivos**: `firestore.rules` permitia `write` (create+update) irrestrito em `organizations` pra qualquer Platform Administrator — nada distinguia "escrito pela function sancionada" de "escrito à mão". Corrigido: `create` agora é `if false` (só Admin SDK). O painel antigo do CCBMG (`admin_master_associacoes.html`, ainda no ar em paralelo desde a Fase 3.1) tinha um modal de "Nova Associação" funcional — removido (só o botão/caminho de criação; edição de organizações existentes continua funcionando).

## 6. Arquivos modificados

**CCBMG:** `functions/lib/provisioning.js` (novo, 226 linhas), `functions/index.js` (+callable `provisionOrganization`, `sendAccountInviteEmail` extraído/compartilhado de `createPlatformAdmin`), `firestore.rules` (`organizations` create/update separados, nova coleção `provisioningRuns`), `firestore.indexes.json` (+1 índice composto), `admin_master_associacoes.html` (criação removida), `functions/test/provisioning.test.js` (novo, 262 linhas, 12 testes) + `functions/test/rules.test.js` (+4 testes) + `functions/test/auction-isolation.test.js`/`helpers/seed.js`/`run-all.js` (ajustes de suporte), `CLAUDE.md` (nova seção "Fase 3.3" + schema atualizado).

**Portal Associativo:** `admin/organization-provision.html` (novo — assistente de 1 tela, progresso ao vivo via `onSnapshot`), `admin/organizations.html` (botão aponta pro assistente), `admin/organization-detail.html` (caso `id=new` retirado, banner de status/reprocessar novo, `billingProvider` corrigido), `docs/roadmap/README.md` + este relatório.

## 7. Testes executados

| Suíte | Resultado |
|---|---|
| `functions/test` (emulador, Admin SDK) | **114 passed, 0 failed** (101 pré-existentes + 12 novos de `provisioning.test.js`, cobrindo caminho feliz, idempotência, corrida de duplo envio, falha parcial + reprocessamento sem rollback destrutivo, recuperação de conta Auth órfã, gates de permissão e de "nunca reaproveitar conta de plataforma") |
| `functions/test/rules.test.js` (Rules de verdade) | **21 passed, 0 failed** (17 pré-existentes + 4 novos: `create` bloqueado em `organizations` mesmo pra Owner, e as 3 regras de `provisioningRuns`) |
| e2e do CCBMG (Playwright, produção real) | **1258 passed, 86 failed** — as 86 são as 2 mesmas categorias já documentadas desde a Fase 2C/3.1/3.2 (checagens de dado de produção não relacionadas + string de versão do Bootstrap desatualizada). A contagem dentro de `04-migration-data.spec.js` variou (2→4) em relação à baseline da Fase 3.2 — verifiquei que a regra de leitura de `systemPlans` está byte-a-byte idêntica desde antes desta fase (`git diff` confirma: só `write` mudou, na Fase 3.2), então essa variação é ruído de dado/token de produção entre execuções, não uma regressão desta fase. Zero categoria nova, zero falha em qualquer teste de autorização/Rules. |
| Smoke test manual (Chromium headless, 3 viewports) | **39/39 páginas carregadas sem erro de console**, incluindo o assistente novo (`organization-provision.html`) e o banner de reprocessamento em `organization-detail.html` |

## 8. Riscos remanescentes

- **Reprocessamento pede o e-mail do Master de novo** (pré-preenchido quando possível, mas editável) — necessário porque um reprocessamento pode precisar de um e-mail corrigido se foi isso que falhou; aceito como trade-off consciente, não um descuido.
- **Sem histórico cross-organização** (deliberadamente adiado, ver Contexto do plano) — hoje só dá pra ver o status de uma organização por vez (no assistente, ao criar, ou no banner da própria página dela). Uma tabela paginada de todas as execuções fica pra quando existir volume real pra justificar.
- **`storage.rules`** (achado incidental da pesquisa, não corrigido nesta fase por estar fora do escopo de provisionamento): a regra de `tenants/{orgId}/cms/{categoria}/{arquivo}` verifica só `isSignedIn()+isImage()`, nunca compara o `{orgId}` do caminho com a organização de quem está enviando — qualquer usuário autenticado pode escrever no caminho de qualquer organização hoje. Pré-existente, não introduzido por esta fase, mas vale endereçar numa fase futura de segurança.
- **`config.billingProvider`** (o campo cosmético antigo) não foi removido do schema, só parou de ser a fonte de verdade — ainda pode aparecer em documentos salvos antes desta correção; inofensivo (não é mais lido por nada), mas fica como uma pequena inconsistência histórica no dado.

## 9. Recomendações para a Fase 3.4 (Configuração por Organização)

- `organizations/{orgId}.config` já existe e já é populado automaticamente no provisionamento (`idioma`/`timezone`/`moeda`) — a Fase 3.4 tem uma base pronta pra crescer, não precisa desenhar o campo do zero.
- O padrão "Cloud Function cria Auth account + doc + convite por e-mail, best-effort e não-fatal" (`sendAccountInviteEmail`, agora compartilhado entre `createPlatformAdmin` e `provisionOrganization`) é reutilizável pra qualquer fluxo futuro de convite (ex.: convidar um Organization Administrator adicional pela própria organização).
- Vale corrigir o gap de `storage.rules` (seção 8) antes ou durante uma fase que amplie upload de arquivos por organização — hoje é uma lacuna pequena (nada explora isso ativamente), mas cresce de risco proporcionalmente ao número de organizações reais.

---

## Publicação

Nada foi commitado, enviado ou implantado, em nenhum dos dois repositórios. Aguardando aprovação explícita, conforme instruído.
