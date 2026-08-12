# Fase 3.12 — `login_master.html`/`admin_master*.html`: mecanismo legado — Relatório

*Consolidado a partir do registro em `CLAUDE.md` (repositório `clubedocavalobonfimmg`) durante a reorganização de documentação de agosto de 2026 — não é um relatório escrito no momento da implementação original, como os das Fases 3.1–3.6.*

---

## 1. Resumo executivo

Investigação disparada por um relato real: as contas Master/Admin do Sandbox (`sandbox_master_01`/`sandbox_admin_01`, criadas na Fase 3.7) foram documentadas desde a criação como "login por `login_master.html`, e-mail, não CPF" — mas isso nunca funcionou de verdade pra Admin, só coincidentemente pareceria funcionar pra Master.

## 2. O que `login_master.html`/`admin_master.html` realmente são (repositório `clubedocavalobonfimmg`)

Não é uma segunda forma legítima de logar como admin de organização — é um mecanismo **anterior à existência do Painel Master** (este repositório, `portal-associativo`, Fase 3.1/3.2). Evidência direta no código:

- `login_master.html` lê `users/{uid}.role` e só aceita **`"master"` exato** (`role !== "master"` bloqueia até um `"Admin"` legítimo) — nunca reconheceu `admin`/`operador`/`Admin View`.
- Redireciona pra `admin_master.html`, que consulta `organizations` **sem filtro de orgId** — um dashboard cross-tenant, não o painel de conteúdo de uma organização específica.
- A mesma família (`admin_master_associacoes.html`, `admin_master_configuracoes.html`, `admin_master_faturamento.html`) segue o mesmo padrão: `requiredRole:"master"` exato + consulta `organizations` inteira.

Ou seja: é a versão **pré-multi-tenant** do que a Fase 3.1/3.2 reconstruiu do zero como o Painel Master (`portal-associativo/admin/*.html`, autorização via `platformAdmins`) — nunca foi atualizado nem removido quando o Painel Master de verdade nasceu neste repositório separado. Consequência prática: como `migratePlatformAdmins` (Fase 3.2) neutralizou toda conta `role==="master"` legada em `users/{uid}` (virou `"migrado_para_platform_admins"`, nunca apagada), **nenhuma organização real tem hoje um usuário que passe nesse gate** — inclusive o próprio CCBMG. É código morto no repositório `clubedocavalobonfimmg`, não uma segunda tela concorrente à `admin.html` de organização.

## 3. O mecanismo correto (sempre foi este)

Master/Admin de uma organização são só usuários normais de `users/{uid}` com `role` elevado — logam pela **mesma** `login.html` (CPF) que qualquer associado. `setupAdminButton()` (`firebase.js`, repositório `clubedocavalobonfimmg`) mostra o botão "Administração" pra quem tem `role` em `["Admin","Master","admin","master","Admin View","adminView"]`, levando pra `admin.html` — o painel real de conteúdo (associados, eventos, galeria, diretoria, produtos, serviços, classificados), sempre escopado pela própria organização via `currentOrgId`.

## 4. Correção aplicada — contas do Sandbox

`sandbox_master_01`/`sandbox_admin_01` (repositório `clubedocavalobonfimmg`) foram criadas na Fase 3.7 com e-mail `@sandbox.invalid` e nunca tiveram CPF. Corrigido pra usar o mecanismo real:

- `users/sandbox_admin_01.cpf` = `11122233043`, `users/sandbox_master_01.cpf` = `22233344073` (checksum válido, nunca colide com os 35 CPFs de associados já seedados).
- E-mail da conta no Firebase Auth (não o `users/{uid}.email`, o e-mail de login de verdade) atualizado pra `{cpf}@cpf.local`, mesma convenção de qualquer associado.
- **Sem efeito colateral no Asaas**: confirmado antes de aplicar — `onNewAssociadoCriado` só dispara em `onCreate` (contas já existem); `onAssociadoAtualizado` (`onUpdate`) sai no primeiro `if (!after.asaasId) return null;` — nenhuma das duas contas tem `asaasId`.
- Validado ponta a ponta: login via `login.html` com o CPF novo → botão "Administração" aparece → `admin.html` carrega normalmente, escopado a "Clube dos Associados".

## 5. Follow-up — só 1 Admin, perfil copiado de uma pessoa real (com cuidado)

Pedido do operador: reduzir de 2 contas `Admin` pra 1 só, com nome/apelido/telefone copiados do perfil de uma associada real do CCBMG (identificada por CPF). **Achado antes de agir**: esse CPF pertence a uma associada real, paga, ativa em `org_bonfim` (produção) — copiar o CPF literal teria exigido mudar o `orgId` do documento dela, quebrando o acesso dela à própria conta real. Confirmado com o operador antes de agir; decisão: copiar só os campos de identificação pessoal (nome, apelido, telefone) pra um CPF **sintético** novo, nunca o CPF real — a conta real dela em `org_bonfim` nunca foi tocada.

- `sandbox_admin_02` (segunda conta Admin) excluída por completo — Firestore + Auth.
- `sandbox_admin_01` passou a ter `nome`/`apelido`/`telefone` copiados (só esses campos — nunca `asaasId`/`planType`/dados de billing); `cpf` continua o sintético já atribuído acima.
- `functions/scripts/seedSandboxTenant.js` (`TEAM`) atualizado pra refletir esse estado como o padrão daqui pra frente. Novo helper `ensureAuthUserEmail()` converge o e-mail de uma conta Auth pré-existente (idempotente).
- **Achado colateral, não relacionado à mudança em si**: durante a verificação ponta a ponta, o login parou de funcionar entre um teste e outro sem nenhuma ação intencional no meio — `passwordUpdatedAt` da conta mostrou uma mudança de senha ~12s depois do login anterior, coincidindo com um teste automatizado anterior que navegou e clicou dentro de `pg_associado.html`. Causa raiz não identificada com certeza — mitigado resetando a senha de volta pro padrão documentado. Registrado como ponto de atenção pra quem for testar esse fluxo de novo.

## 6. Pendência (decisão de negócio, não técnica)

`login_master.html`/`admin_master.html`/`admin_master_associacoes.html`/`admin_master_configuracoes.html`/`admin_master_faturamento.html` (repositório `clubedocavalobonfimmg`) são candidatos a remoção (código morto — nenhuma organização real consegue mais passar pelo gate `role==="master"` exato desde a Fase 3.2). Não removidos nesta fase: há referências em `docs/DEMO.md`, em `tests/e2e/*.spec.js` (múltiplos arquivos) e em `functions/scripts/seedSandboxTenant.js` — remover exige atualizar/remover os testes e2e correspondentes também.
