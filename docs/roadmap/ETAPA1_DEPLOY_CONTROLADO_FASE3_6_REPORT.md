# Etapa 1 — Deploy Controlado Completo da Fase 3.6 — Relatório Final

**Status: concluído.** Fases 3.2–3.6 estão em produção. CCBMG operando normalmente. Um segundo tenant real de teste provisionado e validado. Backup e alertas mínimos configurados. E2E pós-deploy idêntico à baseline (zero regressão). Pendências reais listadas na seção 9 (nenhuma P0).

---

## 1. Estado anterior

Confirmado no início desta etapa, direto contra o projeto Firebase (`clubecavalobonfim`), não contra o repositório:

- `platformAdmins` vazia — nenhum Platform Owner/Administrator/Operator existia.
- 36 das 43 Cloud Functions do repositório estavam deployadas (faltavam as 7 da Fase 3.2/3.3/3.5: `createPlatformAdmin`, `setPlatformAdminStatus`, `setPlatformAdminRole`, `migratePlatformAdmins`, `provisionOrganization`, `setOrganizationDomains`, `onOrganizationWritten`).
- Firestore Rules ao vivo não mudavam desde antes da Fase 3.2 (exceto o patch crítico de segurança aplicado isoladamente antes desta etapa — self-registration `role:"master"` e `eventRegistrations` list público).
- Storage Rules ao vivo não mudavam desde antes da Fase 3.4.
- Frontend (GitHub Pages) já publicado normalmente a cada fase — só o backend nunca tinha acompanhado.

## 2. O que foi publicado

| Etapa | Ação | Resultado |
|---|---|---|
| 2 | Deploy Storage Rules | Verificado byte a byte contra produção |
| 3 | Deploy Firestore Rules + Indexes | Verificado byte a byte; 1 aviso benigno de compilação ("Unused function: isPlatformOwner"); 5 índices legados órfãos não removidos automaticamente (pré-existentes, inofensivos) |
| 4 | Deploy das 43 Cloud Functions da Fase 3.2–3.6 | Confirmado via `firebase functions:list` = 43/43 do repositório |
| 11 | Deploy de 1 Cloud Function nova (`backupAuthUsers`) | Total atual: 44/44 funções, repositório e produção idênticos |

Todo o código está commitado e **pushado** para `origin/main` (`8703d4bb`).

## 3. Migração do Platform Owner

`migratePlatformAdmins` executada exatamente uma vez, via fluxo de autenticação legítimo (custom token real via Admin SDK → troca por ID token real via `signInWithCustomToken` → chamada à callable deployada como qualquer cliente faria — nunca simulação de `context.auth`, nunca senha solicitada, nunca bypass do handler).

- `platformAdmins/MXOSb23C4eX7G57LMlLg24sxKSD3` criado: `{role:"owner", ativo:true, nome:"Waldiney Jose Costa Serafim", createdBy:"migration_fase3_2"}`.
- `users/MXOSb23C4eX7G57LMlLg24sxKSD3.role` neutralizado para `"migrado_para_platform_admins"` (não-destrutivo).
- Login Master validado no Painel Master (`portalassociativo.com.br/admin/*`) — 8 páginas carregando sem erro, confirmado duas vezes (Etapa 6, logo após o deploy das functions; e novamente na Etapa 9e, com verificação de conteúdo real, não só status HTTP).

**Consequência conhecida, aceita**: nenhum `users/{uid}` no CCBMG tem `role:"master"` desde então — não há promoção automática. Ver seção 9, item P1-1.

## 4. CCBMG

- Domínio real registrado: `domains/clubedocavalobonfim.com.br` → `org_bonfim`, espelhado em `organizations/org_bonfim.dominio`.
- Identidade visual configurada e validada 100% em produção: nome, logo, favicon e cores (`#111279`/`#0a0c55`) persistidos em `organizations/org_bonfim.config` e corretamente espelhados via trigger em `organizations/org_bonfim/public/branding` (sem nenhum campo sensível exposto).
- **Achado corrigido nesta etapa**: o site público não estava de fato sem consumir esse branding (conclusão inicial equivocada, corrigida) — `shared/core/tenant/branding.js` + `firebase.js` já aplicam favicon/cores/nome/logo automaticamente em todas as páginas. Validado ao vivo em 4 páginas (`index`, `events`, `board`, `sobre`): favicon, `--brand`, nome e logo dinâmicos idênticos e corretos em todas.
- Fallback (organização sem branding) confirmado: leitura pública de `public/branding` inexistente retorna 404 → `applyBranding()` não altera nada → HTML/CSS estático permanece.
- **Validação de fluxos em produção** (Etapa 9), via associado de teste descartável criado pelo `signup.html` real (CPF fictício, sem dado de pessoa real), depois completamente removido:
  - Público: 7/7 páginas OK, zero erros de console.
  - Associado: signup → dashboard → produtos/serviços exclusivos → financeiro (`finance/summary`, planos, vencimento) → classificados (visualização + postagem real com upload de imagem) → trocar senha (modal). Confirmado `onNewAssociadoCriado` criando cliente+assinatura Asaas reais sem erro (`asaasSync.lastSyncResult:"ok"`).
  - Administração do CCBMG (`admin_associados.html` etc.): **não validada interativamente** — ver P1-1.
  - Master/Plataforma: Organizações, Assinaturas, Auditoria, Central de Configuração — conteúdo real conferido, zero erros.
- Limpeza confirmada: conta de teste removida do Firestore/Auth, Asaas (cliente + assinatura canceladas via API, `deleted:true`), Storage.

## 5. Segundo Tenant

`org_teste_etapa10` provisionada via `provisionOrganization` real (mesmo fluxo de autenticação legítimo da seção 3), plano `starter`, Master de teste com e-mail próprio do administrador (`+etapa10`, nunca um terceiro real).

- **Bug real encontrado e corrigido**: `systemPlans/{starter,professional,enterprise}` tinham só o campo legado `modulos` (array) — `provisionOrganization` lê `modules` (mapa), então todo provisionamento real gravava `organizations/{orgId}.modules = {}` silenciosamente, sem erro reportado. **Todo tenant provisionado antes desta correção teria ficado sem nenhum módulo habilitado.** Corrigido nos 3 planos (mapa `modules` adicionado, `modulos` preservado); `org_teste_etapa10` reprocessada com `forceReprocess:true` — reprocessamento idempotente confirmado (organization/masterAccount/storage/cms puladas corretamente, só modules/billing/branding rodaram de novo).
- Isolamento confirmado com o token real do Master do tenant novo (não bypass IAM): escreve na própria org (200), bloqueado ao tentar escrever em `org_bonfim` (403), bloqueado ao listar dados de `org_bonfim` filtrados (403), bloqueado ao ler `organizations/org_bonfim` diretamente (403), lê a própria org normalmente (200). CCBMG não foi tocado em nenhum momento.
- **Decisão do usuário**: `org_teste_etapa10` mantida em produção por ora (não removida).

## 6. Backup

Firebase Auth não tinha nenhum mecanismo de backup (diferente do Firestore, que já tem PITR de 7 dias desde o hardening da Fase 3.6). Implementado `backupAuthUsers` (nova Cloud Function agendada, domingo 3h BRT): exporta todos os usuários via Admin SDK (`listUsers`, inclui `passwordHash`/`passwordSalt`, necessário pra restauração real) para `backups/auth/{data}.json` no bucket de Storage já existente — sem infraestrutura nova. Retenção de 90 dias via lifecycle rule do bucket, escopada só ao prefixo `backups/auth/`.

Validado end-to-end em produção: job disparado manualmente, exportou 74 usuários reais, arquivo confirmado no Storage (38,6 KB), leitura pública testada e bloqueada (403, protegida pelo catch-all das Storage Rules).

## 7. Alertas

Canal de e-mail (`waldiney.serafim@gmail.com`) + 2 políticas de alerta no Cloud Monitoring:
1. **"Cloud Functions - erro de execução"** — qualquer Cloud Function do projeto, 1 notificação por 30 min.
2. **"asaasWebhook - falha ao processar pagamento"** — dedicada, por ser a function pública mais crítica; 1 notificação por 15 min.

**Achado real durante a validação**: `console.error`/`console.warn` neste runtime (gen1, Node 22) **não populam o campo `severity`** do Cloud Logging — confirmado testando de verdade contra `asaasWebhook` (requisição com token inválido, path seguro e já projetado pra rejeição) e auditando 7 dias de logs do projeto: zero entradas com `severity=ERROR`/`WARNING` apesar de chamadas reais a `console.error`/`warn` já terem executado nesse período. As políticas originais (por `severity`) nunca teriam disparado. Reconfiguradas para filtrar por texto (erro/falha/error/fail) — validado que o filtro bate contra o log real do teste. Ver P1-2 para a correção definitiva pendente.

## 8. E2E

Suíte completa (11 specs × chromium + mobile) rodada contra produção (`https://clubedocavalobonfim.com.br`), pós-deploy completo:

**1258 passed / 86 failed — idêntico, número exato, à baseline registrada no relatório da Fase 3.6.**

As 86 falhas são as mesmas já documentadas como conhecidas antes desta etapa começar: 82 por versão do Bootstrap desatualizada (checagem de asset, não de funcionalidade) + 4 por checagens de dado de migração com asserções desatualizadas (`04-migration-data.spec.js` espera `org_bonfim.plan === "enterprise"` e `modules.leiloes === true`; a organização real usa `plan:"custom"` e não tem o módulo de leilão habilitado — mismatch de teste, não de produção; confirmado meses antes desta etapa). Zero regressão real de produção.

## 9. Problemas encontrados

| # | Prioridade | Descrição | Estado |
|---|---|---|---|
| P1-1 | **P1** | CCBMG sem nenhum `users/{uid}.role === "master"` desde a migração do Platform Owner (Etapa 5) — só existe `admin` (Carlos Henrique). Bloqueia `resetUserPassword`/`deleteAssociado`/mudança de role de qualquer membro, e impediu a validação interativa dos painéis `admin_*.html` do CCBMG nesta etapa (Etapa 9d). Não há caminho automático de promoção — decisão deliberada da Fase 3.2 (sem sinal seguro pra escolher quem). | **Aberto** — requer você designar um Organization Master real pelo mecanismo do próprio app; ação separada, fora do escopo desta etapa por sua decisão explícita |
| P1-2 | **P1** | `console.error`/`console.warn` não populam `severity` no Cloud Logging deste runtime — as políticas de alerta da seção 7 dependem de filtro por texto (funcional, mas mais frágil que filtro por severity: pode perder variações de mensagem não previstas). Causa raiz real: código usa `console.*` global em vez de `functions.logger.*` (SDK estruturado do `firebase-functions`). | **Aberto** — correção definitiva é migrar as chamadas relevantes (pelo menos `asaasWebhook` e outras críticas) para `functions.logger.error`/`warn`; escopo de código, não só configuração |
| P2-1 | P2 | `systemPlans/{starter,professional,enterprise}` sem o campo `modules` (mapa) — todo provisionamento real ficava com módulos vazios, silenciosamente | **Corrigido nesta etapa** (seção 5) |
| P2-2 | P2 | `provisionOrganization` não conseguiu enviar o e-mail real de convite ao Master de teste (`emailSent:false`, sem erro relatado) — não investiguei a causa a fundo (não bloqueou nada crítico, `resetLink` foi capturado via retorno da própria function) | **Aberto** — investigar transporte de e-mail (mesmas credenciais Gmail/Nodemailer do relatório diário) antes do primeiro provisionamento real de cliente pagante |
| P3-1 | P3 | `role: "Master"` (capitalizado) gravado por `provisionOrganization`, inconsistente com `"master"` minúsculo usado em outros pontos do código — funciona hoje porque `mapRoleServer`/comparações normalizam para minúsculo, mas é uma inconsistência de estilo | Não corrigido — nota apenas |
| P3-2 | P3 | 86 falhas pré-existentes na suíte e2e (Bootstrap desatualizado + 4 asserções de migração desalinhadas com dado real) | Já eram conhecidas antes desta etapa; fora de escopo corrigir agora |

Nenhum problema classificado como **P0** foi encontrado ou permanece em aberto.

## 10. Estado final

## **SIM** — a Fase 3.6 está em produção, íntegra, sem regressão detectável, com as pendências P1/P2 listadas acima explicitamente registradas para ação futura.

Resumo do que isso significa na prática:
- CCBMG opera normalmente hoje, para associados reais, sem interrupção observada em nenhum momento desta etapa.
- Toda a superfície de plataforma (Fase 3.2–3.6) que antes só existia no repositório agora está ao vivo e validada: papéis de plataforma, provisionamento automático, configuração por organização, identidade/domínio do tenant, hardening de segurança.
- Backup (Auth) e alertas mínimos existem e foram validados com uma execução/disparo real, não só configurados no papel.
- As duas pendências P1 (Organization Master ausente; alertas por texto em vez de severity) não bloqueiam a operação atual do CCBMG — bloqueiam, especificamente, (a) autoatendimento administrativo avançado do CCBMG via seus próprios painéis e (b) a robustez fina do sistema de alertas. Ambas requerem uma decisão ou ação sua fora do escopo desta etapa.

---

*Relatório gerado ao final da Etapa 1 — Deploy Controlado Completo da Fase 3.6, cobrindo as Etapas 0–13 executadas em produção nesta sessão. Não inicia a "Auditoria Final RC1" — fase futura separada, por instrução explícita.*
