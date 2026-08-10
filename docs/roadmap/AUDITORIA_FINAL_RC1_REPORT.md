# Auditoria Final RC1 — Portal Associativo SaaS Multi-Tenant

## 1. Executive Summary

Auditoria de prontidão comercial executada com evidência real contra produção (não apenas revisão de código), cobrindo as 20 fases pedidas. Durante a Fase 10 (revisão de Cloud Functions), foi encontrado e reproduzido um achado **P1 real e ativo**: `startPasswordReset` retornava o telefone completo de qualquer associado para uma chamada anônima que soubesse o CPF, com busca global entre organizações quando `orgId` não era informado. A auditoria foi **pausada** no momento do achado, conforme protocolo — nenhuma correção foi feita silenciosamente. Após autorização explícita, a menor correção segura compatível com o mecanismo existente (Firebase Phone Auth client-driven, sem alternativa server-side) foi implementada: `orgId` obrigatório + reCAPTCHA Enterprise obrigatório e verificado no servidor, preservando `completePasswordReset` e o disparo do SMS exatamente como estavam. A correção foi testada (6 cenários com reCAPTCHA real, 140 testes de backend, 336 testes E2E relacionados) e validada em produção antes da auditoria ser retomada.

Fora esse achado — já corrigido — **nenhum outro P0 ou P1 foi encontrado**. Zero drift de produção (Rules, Functions, frontend, todos byte-idênticos ao repositório). Isolamento entre tenants confirmado com 20 tentativas de acesso cross-tenant/escalada de privilégio, todas corretamente bloqueadas (12 no Firestore direto, 8 em tentativas de escalada, 7 chamando Cloud Functions diretamente). E2E completo pós-todas-as-correções: 1258 passed / 86 failed, número e categorias idênticos à baseline — zero regressão.

## 2. Escopo auditado

Portal Associativo (plataforma) + CCBMG (primeiro tenant real) + segundo tenant de teste (`org_teste_etapa10`), cobrindo Firestore Rules, Storage Rules, as 44 Cloud Functions, Authentication, Billing/Asaas, provisionamento, domínios/branding, backup, alertas, frontend público e administrativo, e a suíte E2E completa.

## 3. Ambiente de produção

Projeto Firebase `clubecavalobonfim`. CCBMG em `clubedocavalobonfim.com.br` (GitHub Pages). Painel Master em `portalassociativo.com.br` (GitHub Pages). Backend único (Cloud Functions, Firestore, Storage) compartilhado entre os dois.

## 4. Arquitetura Multi-Tenant

Confirmado coerente com o diagrama de referência. Busca por hardcode de `org_bonfim`/`CCBMG` no `shared/core` do Portal Associativo: **zero ocorrências em lógica real** — todas as ~15 ocorrências encontradas são comentários explicando origem histórica do código ("reproduzindo X do CCBMG"). `getTenant()` falha explicitamente (rejeita a Promise) se `window.__TENANT_CONFIG__` estiver ausente — nunca cai silenciosamente para uma organização diferente.

Um fallback de dead code encontrado em `functions/index.js` (`sendDailyPaymentReport`, `asaasReconciliationDaily`): `orgsSnap.empty ? [{id:'org_bonfim'}] : ...` — inalcançável hoje e no futuro, porque a coleção `organizations` nunca fica vazia de novo depois que a primeira organização existe (organizações são suspensas, nunca apagadas). P3, não corrigido (fora do escopo da auditoria).

## 5. Authentication

Login Master e login administrativo validados repetidamente ao longo desta sessão e da anterior (Deploy Controlado), com sessão real via fluxo de autenticação legítimo. `startPasswordReset`/`completePasswordReset` (reset self-service por SMS) — ver achado P1 na seção 9 e correção completa. Usuário desativado (`ativo:false`) não consegue se reativar sozinho (testado, bloqueado). Usuário sem `role`/doc nenhum não acessa nenhum dado de organização (testado, bloqueado).

## 6. Authorization

8/8 tentativas de escalada de privilégio via Firestore direto bloqueadas: auto-promoção a admin, auto-alteração de `orgId`, associado escrevendo em `platformAdmins`, leitura de `platformAdmins` de outro uid, auto-reativação de conta desativada, usuário sem role lendo dados de organização/listando usuários, admin (não-master) alterando role de outro usuário. 7/7 tentativas via Cloud Functions callable bloqueadas: `deleteAssociado`/`resetUserPassword` por não-master, `setPlatformAdminRole`/`createPlatformAdmin`/`provisionOrganization` por quem não é staff de plataforma, `asaasCancelPayment` com `paymentId` forjado.

## 7. Firestore Security

Rules ao vivo confirmadas **byte a byte idênticas** ao repositório (29.175 bytes). 12/12 testes de isolamento cross-tenant passaram: `users`/`finance`, `systemLogs`, `memberProducts`/`Services`/`Classificados`, `cms_gallery`/`cms_events`, leitura direta de `organizations/{orgId}`, nas duas direções (org_bonfim ↔ org_teste_etapa10).

**Achado P2**: qualquer usuário autenticado (qualquer role, qualquer org) pode criar um documento em `systemLogs` com `orgId`/`action`/`details` arbitrários, desde que `userId` seja o próprio uid — a Rule só valida o campo `userId`. Não é acesso cross-tenant a dado real (não há leitura nem escrita de dado de negócio), é forja de trilha de auditoria — `systemLogs` só é lido por staff de plataforma, sem nenhum outro mecanismo confiando nele para conceder permissão. Não corrigido (fora do escopo desta auditoria, é dívida técnica de integridade de log, não vulnerabilidade de acesso a dado).

## 8. Storage Security

Rules ao vivo confirmadas byte a byte idênticas ao repositório (4.781 bytes). Isolamento de `tenants/{orgId}/branding` e `tenants/{orgId}/cms` já validado com evidência real nas Etapas 8/9/11 desta mesma sessão (upload próprio permitido, cross-tenant bloqueado, leitura pública funcionando, backup do Auth não-público). Bloqueio de DELETE via cliente em `branding`/`cms` (achado já registrado como dívida técnica P3 antes desta auditoria) permanece — não é P0/P1, ninguém precisa excluir esses arquivos hoje.

## 9. Cloud Functions

44/44 funções — nomes idênticos entre repositório e produção. Classificação: 37 callable, 2 HTTP público (`asaasWebhook`, `auctionAsaasWebhook`), 5 agendadas, resto triggers de Firestore. Varredura de todas as callable/HTTP por ausência de checagem de auth: 2 sinalizadas inicialmente (`startPasswordReset`, `createEventRegistration`) — a segunda é intencionalmente pública por design (inscrição em evento sem login, documentado no próprio código); a primeira é o achado P1 desta auditoria.

### Achado P1 — `startPasswordReset` expunha telefone completo (CORRIGIDO)

**Vulnerabilidade**: chamada anônima com CPF válido retornava `telefoneE164` completo, sem nenhuma prova de identidade; busca global entre organizações se `orgId` ausente.
**Reproduzido**: sim, com conta de teste descartável (CPF/telefone fictícios).
**Tenants afetados**: todos (lógica compartilhada).
**Dados afetados**: telefone (PII).
**Risco**: exposição de PII a terceiros sem autorização — risco LGPD; não é takeover de conta (ainda exige receber o SMS real pra completar o reset) nem afeta dado financeiro/administrativo.

**Correção implementada** (autorizada explicitamente, com análise técnica prévia do fluxo completo): `signInWithPhoneNumber()` do Firebase Phone Auth é client-driven por construção — não existe alternativa server-side para disparar o SMS sem o número completo chegar ao JS do navegador, então zero exposição total não era alcançável sem trocar o mecanismo de SMS (fora do escopo autorizado). Duas mitigações implementadas: `orgId` passou a ser obrigatório (fecha a busca global cross-tenant) e um token de reCAPTCHA Enterprise (chave nova criada — `6Ld-m38tAAAAAI6Useox6aHfJ6WpxySYIfzl_Qx7`, verificação via IAM/`google-auth-library`, sem secret pra gerenciar; independente do `RecaptchaVerifier` do Phone Auth, que é opaco e não oferece nada verificável pelo nosso servidor) passou a ser exigido e validado no servidor antes de qualquer consulta ao Firestore. `completePasswordReset` (validação do claim `phone_number` assinado pelo Firebase) e o disparo do SMS não foram tocados.

**Testes**: 6/6 com reCAPTCHA real obtido de navegador real — sem reCAPTCHA (bloqueado), sem orgId (bloqueado), CPF de outro tenant (não retorna telefone), CPF inexistente (bloqueado), chamada legítima completa (telefone retornado só nesse caso, fluxo continua), rate limit (6ª tentativa em 1h estoura, preservado sem alteração). 140/140 testes de backend, 336/336 testes E2E relacionados (`01`, `02`, `03`, `07`).

**Deploy**: só `startPasswordReset` (Cloud Function) + `reset_senha.html` (frontend). `completePasswordReset` não foi redeployada (código idêntico).

**Limitação residual documentada**: um ataque manual e direcionado (atacante com CPF real de uma pessoa específica + navegador real capaz de resolver o reCAPTCHA) ainda consegue obter o telefone — reCAPTCHA eleva o custo de automação/enumeração em massa, não elimina um ataque manual pontual. Eliminar isso por completo exigiria trocar o mecanismo de SMS (gateway próprio) ou autenticação prévia — mudança de arquitetura fora do escopo autorizado.

## 10. Billing / Asaas

Coberto por automação já existente (`callable-cross-tenant.test.js`, `billing-asaas.test.js`, `billing-registry.test.js` — todos passando) mais testes ao vivo desta sessão: `asaasCancelPayment` com `paymentId` forjado corretamente rejeitado (`assertPaymentBelongsToUid`); `billingEnvironment` do CCBMG confirmado ausente = produção real (não sandbox), comportamento documentado e intencional. Webhook (`asaasWebhook`) valida token antes de processar, idempotência por `asaasPaymentId` já testada e documentada desde a Fase 3.6.

## 11. Provisionamento

`provisionOrganization` chamado uma 3ª vez (sem `forceReprocess`) sobre uma organização já existente: rejeitado com `409 ALREADY_EXISTS` — idempotência confirmada, sem duplo-write, sem efeito colateral duplicado. `systemPlans/{starter,professional,enterprise}.modules` confirmado presente e correto (corrigido na Etapa 10 do Deploy Controlado); campo legado `modulos` (array) mantido intacto, sem conflito — nenhum código lê `modulos` além do próprio doc de referência.

## 12. Domains / Branding

Domínio do CCBMG (`clubedocavalobonfim.com.br` → `org_bonfim`) confirmado ao vivo. Branding dinâmico (nome completo, logo, favicon, cores) validado em 7 páginas públicas, desktop e mobile, após a correção do achado de nome (Etapa de correções anterior a esta auditoria). Fallback (organização sem branding) confirmado: leitura pública de doc inexistente retorna 404, página estática permanece intacta.

## 13. Backup / Recovery

Firestore PITR confirmado habilitado (`POINT_IN_TIME_RECOVERY_ENABLED`), 7 dias. `backupAuthUsers` (semanal, domingo 3h BRT) já validado com execução real nesta sessão anterior (74 usuários exportados, incluindo `passwordHash`/`passwordSalt`, arquivo confirmado não-público, lifecycle de 90 dias ativo).

## 14. Monitoring / Alerts

2 políticas de alerta ativas (erro geral de Cloud Functions + `asaasWebhook` dedicado), canal de e-mail confirmado. `functions.logger.error/warn` migrado nos pontos que alimentam alertas reais (`asaasWebhook`, triggers de billing automático, falha de passo em `provisionOrganization` — que antes não tinha nenhum sinal em Cloud Logging). Funções não-críticas (ferramentas administrativas/manutenção) deliberadamente não migradas — as políticas mantêm um filtro de texto como fallback pra essas, então cobertura não regrediu.

**Achado P2** (já registrado antes desta auditoria, confirmado ainda presente): nem toda function usa `functions.logger` — cobertura de severity é parcial, complementada por filtro de texto (mais frágil). Migração completa fica como trabalho futuro.

## 15. Performance / Cost

Nenhum padrão de leitura sem limite encontrado em coleções por-usuário. Leituras de `organizations` inteira (em `sendDailyPaymentReport`/`asaasReconciliationDaily`) são seguras porque escalam com número de *tenants*, não de usuários. `encerrarLotesExpirados` roda a cada 1 minuto — hoje barato (módulo de leilão desabilitado no único tenant real ativo), mas é um ponto de atenção (P3) se o uso de leilões crescer entre vários tenants.

## 16. Frontend / UX

Overflow horizontal do Painel Master corrigido e validado com medição real (0/45 combinações página×viewport, era 36/45) — ver correções pré-auditoria. Portal público do CCBMG validado em 7 páginas, desktop e mobile, sem erros de console (à parte de um aviso benigno de `requestStorageAccess` do reCAPTCHA, cosmético, não-funcional).

## 17. E2E

**1258 passed / 86 failed** — número e categorias exatamente idênticos à baseline (4 em `04-migration-data.spec.js`, dado de teste desalinhado com dado real, já documentado; 82 em `05-design-system-regression.spec.js`, checagem de versão do Bootstrap desatualizada, cosmético). Executado *depois* de todas as correções desta auditoria (branding, overflow, logger, PII/reCAPTCHA) — zero regressão introduzida por qualquer uma delas.

## 18. Segurança negativa / penetration-style tests

20 tentativas de ataque controlado executadas nesta auditoria (seções 6/7/9), todas corretamente bloqueadas, mais a reprodução e correção do achado P1 da seção 9. Reuso de token de reCAPTCHA (replay) também testado incidentalmente — rejeitado corretamente (tokens de avaliação são de uso único).

## 19. Production drift

**Zero drift.** Firestore Rules, Storage Rules, as 44 Cloud Functions, `firebase.js`/`index.html` do CCBMG e `admin-auth.js`/`sidebar.css` do Painel Master — todos confirmados byte a byte idênticos entre produção e repositório. Único desvio conhecido: 5 índices compostos do Firestore órfãos (41 ao vivo vs. 36 no repo) — já documentado desde a Fase 3.6, inofensivo, não removido automaticamente pelo Firestore.

## 20. Achados classificados

Ver tabela na seção 21.

## 21. Tabela final obrigatória

| ID | Prioridade | Área | Achado | Evidência | Produção? | Cross-Tenant? | Bloqueia Go Live? | Ação |
|----|---|---|---|---|---|---|---|---|
| RC1-01 | **P1** | Authentication/PII | `startPasswordReset` retornava telefone completo pra chamada anônima com CPF; busca global entre orgs | Reproduzido com conta de teste; corrigido e testado (6/6) | Sim (já corrigido) | Sim (busca global, já corrigido) | Não (corrigido nesta auditoria) | **Corrigido, deployado, validado** |
| RC1-02 | P2 | Firestore/Integridade | Qualquer usuário autenticado pode forjar entrada em `systemLogs` com orgId/action arbitrários | Testado ao vivo (create com 200) | Sim | Não é acesso a dado real, só ao log | Não | Registrar como dívida técnica |
| RC1-03 | P2 | Observabilidade | Cobertura de `functions.logger` parcial — algumas functions ainda sem severity estruturada | Código + Etapa 12 anterior | Sim | Não | Não | Completar migração em trabalho futuro |
| RC1-04 | P3 | Cloud Functions | Fallback `org_bonfim` hardcoded em 2 functions, inalcançável (dead code) | Leitura de código | Sim | Não | Não | Remover quando mexer nessas functions por outro motivo |
| RC1-05 | P3 | Performance | `encerrarLotesExpirados` a cada 1 min — ok hoje, ponto de atenção se leilão escalar entre tenants | Leitura de código | Sim | Não | Não | Rever se uso de leilão crescer |
| RC1-06 | P3 | Firestore | 5 índices compostos órfãos (41 vs 36 no repo) | `gcloud`, já documentado desde Fase 3.6 | Sim | Não | Não | Limpar quando conveniente |
| RC1-07 | P3 | Documentação | `CLAUDE.md` ainda não reflete as correções desta sessão (branding/overflow/logger/PII) | Leitura do arquivo | N/A | N/A | Não | Atualizar após esta auditoria |
| RC1-08 | P3 | Provisionamento | `role:"Master"` capitalizado, inconsistente com `"master"` minúsculo usado em outros pontos | Leitura de código | Sim | Não | Não | Padronizar quando mexer no arquivo |
| RC1-09 | P3 | E2E | 86 falhas conhecidas (Bootstrap desatualizado + 4 asserções de dado desalinhadas) | Baseline confirmada idêntica | Sim | Não | Não | Já é dívida técnica aceita |

## 22. Dívidas técnicas

RC1-02 a RC1-09 acima. Adicionalmente (já documentadas antes desta auditoria, confirmadas ainda válidas, não re-detalhadas aqui): bloqueio de DELETE via cliente em `branding`/`cms`; conta Asaas compartilhada entre todos os tenants (G7); ausência de resolução hostname→orgId em tempo real (G4).

## 23. Limitações conhecidas

**CCBMG sem Organization Master ativo** — por decisão operacional explícita sua, **não é tratada como bug**. Consequência real: os painéis administrativos do próprio CCBMG (`admin_associados.html` etc.) não puderam ser validados interativamente nesta auditoria nem no Deploy Controlado anterior — registrado como limitação de teste, não como achado, exatamente como instruído. `resetUserPassword`/`deleteAssociado` (que exigem Organization Master) seguem inacessíveis até você designar alguém pelo mecanismo do próprio app.

Reset de senha via SMS não foi validado ponta a ponta com recebimento real de SMS (exigiria um telefone real de teste) — validado até o ponto exato em que o SMS seria disparado (código do disparo em si não foi alterado por esta correção).

## 24. Baseline versus estado atual

| Métrica | Baseline (Fase 3.6 / Deploy Controlado) | Estado atual |
|---|---|---|
| E2E produção | 1258 passed / 86 failed | 1258 passed / 86 failed — idêntico |
| Testes backend | 140 | 140 — idêntico |
| Cloud Functions | 43 → 44 (após `backupAuthUsers`) | 44 — sem drift |
| Firestore/Storage Rules | Deployadas na Fase 3.6/Deploy Controlado | Byte-idênticas, sem drift |
| Achados P0/P1 abertos | 0 (patch crítico já resolvido antes) | 0 (achado desta auditoria já corrigido) |

## 25. Recomendações futuras

1. Designar um Organization Master real para o CCBMG pelo mecanismo do próprio app (não uma correção desta auditoria — ação sua).
2. Completar a migração de `functions.logger` nas funções restantes que ainda não alimentam os alertas com severity confiável.
3. Restringir a criação de `systemLogs` além de checar `userId` (ex.: também validar que `orgId` bate com o do próprio usuário) — dívida técnica de integridade, baixo risco real.
4. Atualizar `CLAUDE.md` com as correções desta sessão (branding, overflow, logger, PII/reCAPTCHA) — meramente documental.
5. Considerar, fora desta auditoria, se vale a pena eliminar por completo a exposição residual de telefone em `startPasswordReset` via um mecanismo de SMS server-driven — decisão de produto/arquitetura, não uma correção mínima.

---

## GO / GO WITH CONDITIONS / NO-GO

# **GO WITH CONDITIONS**

A plataforma está pronta para receber organizações reais pagantes. Zero P0. O único P1 encontrado durante a própria auditoria foi corrigido, testado com evidência real (incluindo reCAPTCHA genuíno de navegador real) e validado em produção antes da auditoria ser retomada — não é mais uma pendência em aberto. As condições que acompanham o "GO" são os itens P2 (RC1-02, RC1-03) e a limitação conhecida do Organization Master do CCBMG (seção 23) — nenhum bloqueia operação comercial, mas merecem acompanhamento próximo.

**P0: 0 | P1: 0 em aberto (1 encontrado e corrigido nesta auditoria) | P2: 2 | P3: 7**
