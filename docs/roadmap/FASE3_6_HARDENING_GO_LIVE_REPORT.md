# Fase 3.6 — Hardening, Operação e Go Live Comercial — Relatório Final

**Status: implementação concluída, aguardando aprovação explícita para commit/push/deploy** (nos dois repositórios, exceto o patch crítico e o PITR, já aplicados em produção com aprovação explícita separada — ver seções 2 e 4).

---

## 1. Resumo executivo

Esta era para ser uma fase de auditoria e correção — não de descoberta estrutural. No meio da auditoria, o usuário reportou não conseguir logar no novo Painel Master. Investigando isso, confirmei direto contra o projeto Firebase real (`clubecavalobonfim`, não o repositório) o fato mais importante de toda a fase: **nada da Fase 3.2 em diante jamais foi implantado em produção.** `platformAdmins` está vazia; 36 das 43 Cloud Functions do repositório estão deployadas (faltam exatamente as 7 novas desde a Fase 3.2); o Firestore Rules ao vivo não muda desde 2026-08-07 (antes da Fase 3.2 começar) e o Storage Rules não muda desde 2026-06-17 (antes até da Fase 3.4). O frontend (GitHub Pages) foi publicado normalmente a cada fase — só o backend nunca acompanhou.

Essa descoberta mudou a natureza da auditoria de segurança: em vez de auditar só o código do repositório, precisei confirmar CADA achado crítico contra o que está de verdade no ar. Dois achados se confirmaram idênticos em produção e no repo — uma regra do Firestore que permitia a qualquer usuário autocadastrado gravar `role:"master"` no próprio documento (tomada completa de qualquer organização) e uma regra que expunha nome/CPF/telefone de todas as inscrições de evento, de todas as organizações, publicamente. Ambos foram tratados como **patch crítico independente desta fase**, a pedido explícito do usuário: reconfirmados contra produção, apresentados antes de qualquer alteração, corrigidos com o mínimo necessário, testados (38/38, incluindo 10 testes novos provando a correção sem quebrar os fluxos reais) e implantados em produção via `firebase deploy --only firestore:rules`, construído sobre o que já estava ao vivo (não sobre o acumulado não-deployado da Fase 3.2-3.5, propositalmente).

O restante da auditoria (3 passadas independentes: segurança/isolamento, qualidade/performance de Cloud Functions, operação/documentação) encontrou ~40 achados concretos. Priorizei por impacto real: 16 correções foram implementadas nesta fase (todas no repositório, aguardando deploy junto com o resto da Fase 3.2-3.6), e uma lista explícita de itens foi deliberadamente deixada de fora — decisões de produto/arquitetura maiores que esta fase, ou risco baixo demais para justificar mais mudança. Habilitei também o Point-in-Time Recovery do Firestore em produção (aprovado explicitamente) — resolve, sozinho, a maior lacuna operacional encontrada (não havia nenhum backup/restore configurado ou documentado).

## 2. Segurança

### 2.1 — Patch crítico (produção, independente desta fase)

| # | Vulnerabilidade | Confirmação em produção | Correção |
|---|---|---|---|
| 1 | `users/{userId}` create — `isSelf(userId)` sem validação de campo nenhuma; um auto-cadastro podia gravar `role:"master"`/`orgId` arbitrário e assumir controle total de qualquer organização | Ruleset ao vivo idêntico ao repositório na regra exata (linha 292 da versão então-vigente) | `isSelf` restrito a `role in ["associado","participanteLeilao"]` + `orgId` precisa referenciar uma organização existente |
| 2 | `eventRegistrations` — `allow read: if true` permitia `list()` público (dump da coleção inteira: nome, CPF, telefone, token de check-in, de todos os eventos de todas as organizações) | Idêntico ao repositório | Split `get`/`list`: `get` (1 doc por ID, usado pelo comprovante) continua público; `list` passa a exigir admin/master da própria organização |

Deploy verificado byte a byte contra produção; testado ao vivo (`list()` anônimo em `eventRegistrations` retorna `403` hoje). 38/38 testes de Rules (28 baseline + 10 novos). Detalhes completos já reportados ao usuário no momento da aplicação.

### 2.2 — Corrigido nesta fase (repositório, aguardando deploy)

| # | Achado | Severidade | Correção |
|---|---|---|---|
| 1 | `asaasCancelPayment`/`asaasGetPaymentStatus` confiavam no `asaasPaymentId` do payload sem validar que pertence ao uid já validado — como todas as organizações dividem a mesma conta Asaas, um admin de uma org podia consultar/cancelar cobrança de outra | **Alta** (já deployada, ativa hoje) | `assertPaymentBelongsToUid()` — resolve o pagamento pelas `financeInvoices` do uid validado, rejeita antes de chamar o provider |
| 2 | `storage.rules` `uploads/{category}` (produtos/serviços/classificados) — zero checagem de dono; qualquer usuário autenticado sobrescrevia imagem de qualquer outro | **Alta** (já deployada, ativa hoje) | Metadata de dono (`customMetadata.uid`) gravado no upload, exigido na regra: `resource == null \|\| resource.metadata.uid == request.auth.uid` |
| 3 | `migratePlatformAdmins` — bootstrap sem comparação de organização (por design), mas era o topo da cadeia auto-cadastro→master→Platform Owner | **Crítica em potencial** (não deployada ainda) | Só aceita chamada enquanto `platformAdmins` está genuinamente vazia — fecha a superfície pra sempre depois do primeiro uso real |
| 4 | `sendDailyPaymentReport` unia destinatários de todas as organizações num e-mail só, com blocos de todas elas | **Alta** (dormant — só 1 org real hoje, mas o próprio critério de aceite desta fase pede criar uma organização de teste) | Um e-mail por organização, só pros destinatários daquela organização |
| 5 | `storage.rules` `tenants/{orgId}/branding` exigia `isOwnOrg()`, mas o único escritor real (equipe de plataforma) nunca tem `orgId` — upload de logo/favicon da Fase 3.4 estruturalmente impossível | Funcional, não segurança | Aceita também `isPlatformAdministrator()` |
| 6 | `deleteAssociado`, `resetUserPassword`, `asaasCreatePayment`, `asaasCancelPayment` sem nenhum registro de auditoria (só `console.log`) | Média | `writeOrgAuditLog()` — mesmo schema do `logAction()` client-side, gravado do servidor |
| 7 | `onNewAssociadoCriado` — falha ao criar cliente/assinatura Asaas só logava, zero sinal pro admin | Média-Alta | Grava `asaasSync.lastSyncError`, mesmo campo que `onAssociadoAtualizado`/`syncOneAssociado` já usam |
| 8 | `confirmEventCheckin` — comentário documentava "admin/master/operador/adminView", código aceitava qualquer associado | Média | Guard alinhado ao comentário original |

### 2.3 — Riscos remanescentes (documentados, não corrigidos nesta fase)

- **Conta Asaas compartilhada entre organizações** — decisão de produto maior (já rastreada como G7 em `docs/SAAS_MULTITENANT.md`), não cabe numa fase de hardening.
- **Núcleo compartilhado (`shared/core`) servido cross-origin sem CSP/SRI** — toda sessão autenticada de todo tenant depende da integridade de `portalassociativo.com.br`; risco de supply-chain real, mas mudança arquitetural (GitHub Pages tem headers customizados limitados). Documentado, não resolvido.
- **4 Cloud Functions de manutenção sem UI nenhuma chamando** (`fixAsaasPhoneNumbers`, `listAsaasCustomersRaw`, `verifyAsaasNotificationStandard`) e **`gerarCobrancaLeilao` sem tela chamando** — não apaguei ferramentas que podem ser uso consciente por console nem inventei UI nova (aumentaria escopo). Sinalizado pro dono do produto decidir.
- Achados de severidade baixa da auditoria (leitura pública de `memberClassifieds`/`systemPlans`, `systemLogs` create forjável por qualquer autenticado, alguns campos fora de `noSensitiveFieldChange()`, `billingConfig.secretName` arbitrário) — documentados, não corrigidos: impacto real baixo, corrigir tudo agora contrariaria "não aumentar escopo".

## 3. Performance

- **Índice composto adicionado**: `financeInvoices` (`dueDate` + `status`) — a query de fallback de `upsertInvoiceFromAsaasPayment` não tinha índice declarado nem no repositório nem em produção; adicionar é sempre seguro (nunca quebra nada existente), fechado por precaução antes que o caminho de fallback seja exercitado em produção pela primeira vez.
- **Impacto esperado**: nenhuma otimização de leitura/escrita em massa foi necessária — a auditoria de Cloud Functions confirmou que os padrões de query existentes (filtro por `orgId`, sem N+1 fora dos jobs em lote já cientes do próprio custo) estão corretos para a escala atual. N+1 documentados como teto de escala futuro (`sendDailyPaymentReport`, sincronizações em lote), não como bug — não otimizados agora porque seria otimização prematura pro tamanho de dado de hoje.
- **Dead code removido**: bloco `_internal` de exports de teste (zero referência em `functions/test/`), 2 botões chamando Cloud Functions inexistentes (`seedMultiTenantData`/`migrateToMultiTenant`) em `admin_master_configuracoes.html` — não afeta performance diretamente, mas reduz superfície de manutenção e erro de operador (botão que sempre falha).

## 4. Operação

### 4.1 — Backup e Restore

- **Firestore Point-in-Time Recovery: habilitado em produção nesta fase** (aprovado explicitamente antes de executar) — `gcloud firestore databases update --enable-pitr`. Janela de recuperação de 7 dias, ativa a partir de 2026-08-10. Antes desta fase, não havia absolutamente nenhum mecanismo de backup configurado ou documentado — o achado mais grave da auditoria de operação.
- **Firebase Auth**: continua sem exportação/backup configurado. Não resolvido nesta fase (fora do escopo de "correção mínima necessária" — exigiria um processo/agendamento novo, não uma configuração de um comando só). Registrado como pendência explícita pro Go-Live Checklist.
- **Restore**: nenhum procedimento de restore foi testado nesta fase (habilitar PITR não é o mesmo que validar uma restauração real). Recomendação: antes de aceitar o primeiro cliente pagante real, executar um restore de teste (mesmo que em um projeto Firebase de teste) para confirmar que o mecanismo funciona como esperado.

### 4.2 — Deploy e Rollback

- **Situação real, confirmada nesta fase**: o backend de produção está travado no que existia em 2026-06-17 (Storage) / 2026-08-07 (Firestore Rules) / commit anterior à Fase 3.2 (Cloud Functions). Tudo de Fase 3.2 a 3.6 existe só no repositório.
- **Procedimento de deploy documentado** (`docs/DEPLOY.md`, CCBMG) cobre `firebase deploy --only functions`/`firestore:rules`/`storage` de forma escopada — mecanismo correto, só não foi executado nas últimas ~5 fases.
- **Rollback**: existe via `git revert` + redeploy pra Functions; Firestore Rules tem histórico de versão no Console do Firebase (fora do fluxo de código — um revert por lá desincroniza do `firestore.rules` do git até o próximo deploy). Nenhum rollback de 1 clique documentado — aceitável para o tamanho atual da operação, registrado como risco conhecido.
- **`shared/` (Portal Associativo) sem cache-busting no próprio Painel Master**: `admin/*.html` importava o núcleo compartilhado sem `?v=`, ao contrário do CCBMG — corrigido nesta fase (todos os imports agora `?v=2026.08.4`). Isso fecha uma janela real: antes da correção, uma atualização de segurança no núcleo (sessão/autenticação) podia demorar até 4h (cache de borda do Cloudflare) pra chegar no próprio console administrativo da plataforma.

### 4.3 — Checklist operacional (estado atual, não normativo)

| Item | Estado |
|---|---|
| Logs | `console.*` no Cloud Logging, sem agregação/alerta — uma falha repetida só é percebida se alguém rodar `firebase functions:log` manualmente |
| Auditoria | `systemLogs`, ampliada nesta fase (deleteAssociado/resetUserPassword/cobranças agora registram) |
| Backup Firestore | PITR habilitado nesta fase (7 dias) |
| Backup Auth | Não configurado |
| Deploy | Manual, escopado, documentado — não executado desde antes da Fase 3.2 |
| Rollback | Via git revert + redeploy; sem automação |
| Segredos | 5 no Secret Manager (`asaas-api-key`, `asaas-webhook-token`, `asaas-auction-webhook-token`, `email-user`, `email-password`) — `CLAUDE.md` agora lista os 5 (faltava o de leilões); sem política de rotação documentada |
| Alertas | Nenhum configurado |

## 5. Testes

| Suíte | Fase 3.5 (baseline) | Fase 3.6 |
|---|---|---|
| `functions/test` (emulador) | 128 passed | **139 passed, 0 failed** — +10 do novo `fase36-multitenant-validation.test.js` (organização de teste ponta a ponta), +1 líquido de ajustes/reforço em `platform.test.js` (bootstrap de `migratePlatformAdmins` reordenado pra testar contra coleção genuinamente vazia) e `callable-cross-tenant.test.js` (+2 testes de `confirmEventCheckin`) |
| `functions/test/rules.test.js` | 28 passed | **38 passed, 0 failed** (10 novos do patch crítico, já reportados separadamente) |
| `functions/test/storage-rules.test.js` | 8 passed | **15 passed, 0 failed** (+7: branding por Platform Administrator, uploads/* com metadata de dono) |
| **Total backend** | **164** | **192, 0 failed** |
| Organização de teste ponta a ponta (emulador) | — | Provisionada do zero via `provisionOrganization`, domínio próprio registrado, branding aplicado e sincronizado, **isolamento completo confirmado** contra uma segunda organização com dados moldados como o CCBMG real (associados, financeiro, produtos) — 10 testes dedicados, todos passando |
| Smoke test (Chromium headless) | 39/39 páginas | Páginas tocadas nesta fase (admin_produtos/servicos/classificados, admin_master_configuracoes, admin_associados, Painel Master completo) — zero erro de console real (os únicos avisos observados foram "sem conexão com a internet" do ambiente de teste isolado, e um artefato de redirecionamento do `npx serve` local não reproduzível em produção/GitHub Pages, ambos confirmados não serem regressão) |
| e2e Playwright CCBMG (produção) | 1258 passed / 86 failed | **1258 passed, 86 failed — categorias idênticas à baseline** (82 versão do Bootstrap desatualizada + 4 checagens de dado de produção não relacionadas). Uma falha nova surgiu na primeira rodada (`admin_master_configuracoes.html` — teste asserindo a existência dos botões Seed/Migração que esta fase removeu por serem código morto) e foi corrigida no próprio teste (agora confirma que os botões foram removidos), não revertendo a remoção — rodada final sem essa falha, contagem total idêntica à baseline |

## 6. Go Live Checklist

Ordenado por dependência — cada item pressupõe os anteriores concluídos.

1. **[ ] Revisar e aprovar o commit consolidado desta fase** (Fase 3.6 + tudo pendente de 3.2-3.5, já que nada foi deployado desde então).
2. **[ ] Deploy do Storage Rules** — `firebase deploy --only storage`. Primeiro, porque não depende de nada além de si mesmo.
3. **[ ] Deploy do Firestore Rules** — `firebase deploy --only firestore:rules,firestore:indexes`. Inclui o patch crítico já ao vivo (sem regressão — deploy é idempotente sobre o que já está lá) mais toda a Fase 3.2-3.6.
4. **[ ] Deploy das Cloud Functions** — `firebase deploy --only functions`. As 7 novas (`createPlatformAdmin`, `setPlatformAdminStatus`, `setPlatformAdminRole`, `migratePlatformAdmins`, `provisionOrganization`, `setOrganizationDomains`, `onOrganizationWritten`) só existem em produção a partir daqui.
5. **[ ] Executar `migratePlatformAdmins` UMA ÚNICA VEZ**, autenticado com a conta que hoje tem `role:"master"` em `users/`. Depois de rodada, a função nunca mais aceita chamada nenhuma (patch desta fase) — é o único jeito de criar o primeiro Platform Owner.
6. **[ ] Confirmar login no Painel Master** (`portalassociativo.com.br/admin/login.html`) com a conta recém-migrada.
7. **[ ] Registrar o domínio de produção do CCBMG** (`clubedocavalobonfim.com.br`) via `setOrganizationDomains`, pela Central de Configuração — hoje só existe no `organizations/org_bonfim.dominio` de texto livre, não no índice `domains/`.
8. **[ ] Confirmar que o CCBMG continua funcionando** — login de associado, admin, master; página pública; branding (ainda vai mostrar o visual estático hardcoded até o campo `config.logoUrl`/cores ser preenchido pela Central de Configuração — não é regressão, é o comportamento esperado documentado desde a Fase 3.5).
9. **[ ] Provisionar uma organização de teste real em produção** (não só no emulador) via `provisionOrganization`, confirmar ponta a ponta como no teste desta fase.
10. **[ ] Configurar backup do Firebase Auth** (exportação periódica) — único item de backup ainda pendente depois desta fase.
11. **[ ] Decidir e documentar uma política mínima de alerta** (mesmo que só um e-mail em caso de erro repetido de `asaasWebhook`) — não implementado nesta fase, recomendado antes do primeiro cliente pagante de verdade.
12. **[ ] Rodar a suíte e2e completa contra produção pós-deploy** — mesma suíte desta fase, comparar contra a baseline (1258/86) pra confirmar zero regressão real de produção, não só de emulador.
