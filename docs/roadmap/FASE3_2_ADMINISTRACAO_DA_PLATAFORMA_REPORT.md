# Fase 3.2 — Administração da Plataforma — Relatório Final

**Status: implementação concluída, aguardando aprovação explícita para commit/push/deploy** (conforme instrução — nada foi publicado, nos dois repositórios).

---

## 1. Resumo executivo

O conceito antigo de `master` — um único papel plano, cego a organização, usado como bypass cross-tenant em `firestore.rules` (`isMaster()`, 17 ocorrências) — não existe mais. No lugar, dois planos de identidade genuinamente separados: **Plataforma** (equipe da Serafim Technologies, nunca pertence a organização nenhuma — nova coleção `platformAdmins/{uid}`) e **Organização** (equipe administrativa de um tenant, nunca cruza pra outro — `users/{uid}.role`, sempre com `orgId`). A palavra "master" sobrevive só como rótulo do papel **Organization Master**, agora sempre comparado à organização — o que foi eliminado foi o mecanismo de confiança cega, não o nome.

A investigação desta fase (2 agentes de exploração + 1 revisão crítica de arquitetura, todos com achados verificados manualmente no código antes de eu confiar neles) encontrou coisas que mudaram o desenho: `requireOrganizationMaster()` já era, na prática, restrito à própria organização em 2 das 3 Cloud Functions que o usavam; `firestore.rules` já tinha o padrão certo de comparação estrita mas não o usava em toda parte (Admin View nunca teve regra de leitura própria — corrigido nesta fase); e uma tela viva (`admin_associados.html`) dependia do bypass de escrita que esta fase removeu — mudança de comportamento intencional, documentada, não um acidente.

Nenhum arquivo do CCBMG foi apagado. O painel master antigo continua funcionando (usa `requireOrganizationMaster`/`requireOrganizationAdmin`, que não mudaram de código). O novo Painel Master (Portal Associativo) ganhou 1 página nova e 1 aba nova.

## 2. Modelo completo de papéis

### Plataforma (`platformAdmins/{uid}` — nunca tem `orgId`)

| Papel | Responsabilidade | Pode |
|---|---|---|
| **Platform Owner** | Autoridade máxima da plataforma | Tudo que Administrator pode + gerenciar outros Administrator/Owner + ações irreversíveis |
| **Platform Administrator** | Operação do dia a dia da plataforma | Criar/editar organizações, gerenciar planos, gerenciar Platform Operator (não Administrator/Owner), auditoria global |
| **Platform Operator** | Suporte/visibilidade | Somente leitura em todas as telas de plataforma — zero escrita |

### Organização (`users/{uid}.role` — sempre com `orgId`, nunca cruza tenant)

| Papel | Responsabilidade | Pode |
|---|---|---|
| **Organization Master** | Administrador máximo da própria organização | Tudo que Administrator pode + alterar papel de qualquer membro da equipe administrativa da própria org (único papel que pode) |
| **Organization Administrator** | Operação plena do dia a dia | Associados, conteúdo, financeiro, moderação — **não** pode alterar papel de ninguém (evita escalonamento lateral) |
| **Organization Operator** | Tarefa pontual | Ex.: check-in de evento — sem configuração, sem gestão de equipe |
| **Organization Viewer** | Somente leitura | Corrige uma lacuna real que existia antes desta fase (ver seção 4) |

`associado`/`participanteLeilao` (membros comuns) não mudaram — pedido explícito do escopo, fora desta reforma.

### Hierarquia de permissão (quem administra quem)

```
Platform Owner ──────► gerencia Platform Owner, Platform Administrator, Platform Operator
Platform Administrator ─► gerencia só Platform Operator
Platform Operator ────► gerencia ninguém (só lê)

Organization Master ────► gerencia Organization Master/Administrator/Operator/Viewer da PRÓPRIA org
Organization Administrator ► não gerencia papel de ninguém
```

## 3. Diagrama de permissões (matriz)

| Recurso | Platform Owner | Platform Administrator | Platform Operator | Org Master | Org Administrator | Org Operator/Viewer |
|---|---|---|---|---|---|---|
| `organizations` (listar/ver todas) | leitura+escrita | leitura+escrita | leitura | só a própria (get) | só a própria (get) | só a própria (get) |
| `systemPlans`/`systemConfig` (escrita) | ✅ | ✅ | ❌ (só leitura) | ❌ | ❌ | ❌ |
| `platformAdmins` (gerir equipe de plataforma) | qualquer um | só `operator` | ❌ | ❌ | ❌ | ❌ |
| `users` da própria org (escrita geral) | ❌ (só via Cloud Function) | ❌ | ❌ | ✅ | ✅ | ❌ |
| `users.role` da própria org (mudar papel) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `users` de qualquer org (leitura) | ✅ | ✅ | ✅ | ❌ (só a própria) | ❌ (só a própria) | ❌ (só a própria) |
| `users` de outra org (qualquer coisa) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

A última linha é o invariante central da fase: nenhum papel, de nenhum dos dois planos, alcança dado de organização alheia — plataforma tem visibilidade de leitura ampla (suporte/supervisão), nunca escrita direta; organização nunca sai de si mesma, em nenhuma direção.

## 4. Arquitetura adotada (e por que)

- **`platformAdmins` como coleção nova, não `organizationUsers`.** Os 4 papéis de organização continuam em `users/{uid}` (mesma coleção dos associados) — zero reescrita de dado para quem já é admin/adminView/operador hoje, só reinterpretação de significado (sempre org-scoped, nunca mais bypass). `organizationUsers` resolveria um problema que não existe hoje (1 pessoa administrando várias organizações) ao custo de migrar a coleção inteira — fica disponível como opção quando esse requisito for real.
- **`platformAdmins` nunca tem campo `orgId`** — garantia estrutural, não convenção. Resolve de propósito a contradição encontrada na investigação (comentário em `admin_associados.html` dizia que contas master não têm orgId; fixture de teste dizia que tinham) fazendo a plataforma **não ter onde** guardar um `orgId` por engano, daqui pra frente.
- **Confirmado empiricamente, não assumido**: rodei a suíte e2e completa do CCBMG contra produção real como parte da verificação desta fase — o teste `04-migration-data.spec.js` (`Users master NÃO têm orgId (correto)`) **passou**, confirmando que contas master reais hoje realmente não têm `orgId`. Isso significa que `resetUserPassword`/`deleteAssociado` (que exigem `requireOrganizationMaster` → resolução de organização) provavelmente estavam **silenciosamente inacessíveis** para contas master reais antes desta fase — a reforma não preserva um comportamento existente ali, corrige uma lacuna dormente.
- **Escrita de `platformAdmins` é sempre `false` nas Rules** — só Cloud Functions (Admin SDK) escrevem, então toda mutação de equipe de plataforma é auditada no servidor por construção, sem exceção possível. Mais estrito que `users` hoje (que ainda permite escrita direta do cliente).
- **Tabela de permissão explícita nas 3 Cloud Functions de gestão de equipe, não uma comparação de "rank" genérica** — mais fácil de auditar e testar; ficou claro na crítica de arquitetura desta fase que uma comparação de rank teria deixado brechas de auto-promoção sem eu perceber.
- **Guarda de "não deixar zero owners ativos"**: mantida como defesa em profundidade, mas — achado durante a escrita dos testes — é matematicamente inalcançável através de qualquer chamada legítima, dado que auto-alteração é sempre bloqueada e só um owner pode agir sobre outro owner (então quem age sempre sobra). Documentado no próprio teste em vez de fingir um cenário que o modelo de permissão já torna impossível.
- **Leitura/escrita separadas nas Rules das coleções que tinham bypass**: leitura de plataforma preservada (suporte, e o KPI "associados totais" do dashboard continua funcionando); escrita de plataforma removida — nenhuma tela viva além de `admin_associados.html` dependia disso, e mesmo essa tela só pra contas que hoje (empiricamente) não conseguiam usá-la mesmo, no caminho das Cloud Functions master-scoped.
- **`isMaster()` renomeado para `isOrgMaster(orgId)`** (não só reaproveitado com semântica nova) — importante pra que um `grep isMaster` no repositório continue provando que o conceito antigo sumiu, em vez de dar falso positivo.

## 5. Arquivos modificados

**CCBMG (`clubedocavalobonfimmg`):**
- `functions/lib/platform.js` (novo, 97 linhas) — resolvedor + guardas de papel de plataforma.
- `functions/index.js` — 4 callables novas (`createPlatformAdmin`, `setPlatformAdminStatus`, `setPlatformAdminRole`, `migratePlatformAdmins`), `backfillLeilaoOrgId` reclassificada.
- `firestore.rules` — reescrita dos helpers de papel/organização, nova coleção `platformAdmins`, leitura/escrita separadas em `users`/`memberServices`/`memberProducts`/leilão.
- `functions/test/platform.test.js` (novo, 276 linhas, 22 testes) + `functions/test/rules.test.js` (novo, 175 linhas, 17 testes) + `functions/test/helpers/seed.js` (+`seedPlatformAdmin`) + `functions/test/auction-isolation.test.js` (2 testes atualizados pra `backfillLeilaoOrgId` reclassificada) + `functions/test/run-all.js` (registro do novo arquivo) + `functions/package.json` (+`@firebase/rules-unit-testing`, +script `test:rules`).
- `CLAUDE.md` — nova seção "Fase 3.2" completa (modelo de papéis, Cloud Functions, Rules, consequência operacional) + atualização das seções "Firestore Schema"/"Autenticação e Roles".

**Portal Associativo (`portal-associativo`):**
- `admin/assets/admin-auth.js` — repontado pra `platformAdmins`, `requirePlatformAccess({requiredRole})` ganhou passthrough opcional.
- `admin/login.html` — checa qualquer papel de plataforma, não só `master`.
- `admin/platform-operators.html` (novo) — CRUD de equipe de plataforma, UI adaptada ao papel de quem está logado.
- `admin/assets/admin-nav.js` — novo item de navegação.
- `admin/organization-detail.html` — nova aba "Equipe" (somente leitura).
- `admin/index.html` — KPI "associados totais" agora exclui todo papel administrativo, não só master.
- `docs/roadmap/README.md` — entrada nova.

## 6. Testes executados

| Suíte | Resultado |
|---|---|
| `functions/test` (emulador Firestore+Auth, Admin SDK) | **101 passed, 0 failed** (73 pré-existentes + 22 novos de `platform.test.js`, 2 atualizados em `auction-isolation.test.js`, todos verdes; a suíte crashou uma vez durante o desenvolvimento por tentar Secret Manager real dentro do emulador — corrigido com uma guarda por `FIRESTORE_EMULATOR_HOST`, mesmo padrão que o resto do repositório já usa pra nunca tocar infraestrutura real durante testes) |
| `functions/test/rules.test.js` (`@firebase/rules-unit-testing`, Rules de verdade) | **17 passed, 0 failed** — primeira cobertura de Rules de verdade do projeto |
| e2e do CCBMG (Playwright, produção real) | **1260 passed, 84 failed** — as 84 falhas são 100% das 2 categorias pré-existentes já documentadas desde a Fase 2C/3.1 (1 checagem de dado de produção não relacionada + 82 de string de versão do Bootstrap desatualizada), zero categoria nova, zero falha em qualquer teste relacionado a papel/autorização/Rules |
| Smoke test manual (Chromium headless, 3 viewports) | **33/33 páginas carregadas sem erro de console**, incluindo `platform-operators.html` (nova) e a navegação completa do Painel Master |

## 7. Riscos remanescentes

- **Consequência operacional já documentada em `CLAUDE.md` e no plano**: depois de rodar `migratePlatformAdmins` em produção, `resetUserPassword`/`deleteAssociado` ficam inacessíveis pro CCBMG até um humano designar um Organization Master real — não há promoção automática (sem sinal seguro pra escolher). Ação de 1 update manual no Firestore ou uma futura tela de escrita na aba "Equipe" (hoje só leitura).
- **Sequenciamento de produção**: a migração precisa rodar antes (ou junto) do deploy das Rules novas, nunca depois — senão contas master reais perdem, por uma janela de tempo, a capacidade de editar papel de associados em `admin_associados.html` que hoje (aparentemente) nem conseguem exercer mesmo, por causa da lacuna de orgId já documentada.
- **Duas identidades pra mesma pessoa humana**: quem hoje é `master` e quer continuar operando o CCBMG como organização (não só supervisionar via o Painel Master) precisa de 2 contas separadas — decisão de produto explícita, não descuido.
- **Aba "Equipe" é somente leitura nesta fase** — gestão de verdade da equipe de uma organização continua em `admin_associados.html` (CCBMG), não no novo Painel Master. Trade-off deliberado pra não inflar escopo, sinalizado desde o plano.
- **`@firebase/rules-unit-testing` é dependência nova** — primeira vez que este repositório testa Rules de verdade; cobertura inicial (17 testes) é boa mas não exaustiva de toda regra do arquivo.

## 8. Recomendações para a Fase 3.3

- O provisionamento automático de organizações (criar org + Organization Master inicial + módulos padrão) agora tem uma base limpa pra se apoiar: `createPlatformAdmin` já prova o padrão "Cloud Function cria conta Auth + doc + convite por e-mail" que uma futura `provisionOrganization` provavelmente reaproveita quase igual, só trocando `platformAdmins` por `users` com `role:"master"` e `orgId` do tenant novo.
- A aba "Equipe" (hoje só leitura) é o lugar óbvio pra crescer quando o autoatendimento de organização precisar de uma tela de verdade — a estrutura de dado e a query já estão prontas, falta só a escrita.
- Nenhuma decisão desta fase amarra a Fase 3.6 (Marketplace de Módulos) nem a 3.7 (Billing da Plataforma) — `platformAdmins`/`organizations`/`systemPlans` continuam exatamente onde essas fases vão precisar que estejam.

---

## Publicação

Nada foi commitado, enviado ou implantado, em nenhum dos dois repositórios. Aguardando aprovação explícita, conforme instruído.
