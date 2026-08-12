# Fase 3.8 — Ambiente Local, CI/CD e Feature Flags — Relatório

*Consolidado a partir do registro em `CLAUDE.md` (repositório `clubedocavalobonfimmg`) durante a reorganização de documentação de agosto de 2026 — não é um relatório escrito no momento da implementação original, como os das Fases 3.1–3.6.*

---

## 1. Resumo executivo

Três lacunas de engenharia resolvidas de forma definitiva (não paliativa): ambiente local 100% funcional, pipeline de qualidade no GitHub Actions (sem automatizar deploy) e uma camada de Feature Flags multi-tenant. Pensada para "dezenas ou centenas de organizações" — nenhuma solução aqui assume o tamanho atual da plataforma.

## 2. Ambiente local — Java era o único bloqueio real

`firebase emulators:start` (Firestore/Storage) depende de um binário `java` no PATH — ausente na máquina de desenvolvimento, o que impedia rodar `functions/test/*` localmente (só era possível contra produção). Resolvido com `brew install openjdk` + `export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"` (openjdk do Homebrew é keg-only, não se auto-linka) — **sem sudo, sem symlink de sistema**, só PATH da sessão de shell, documentado em `docs/DEVELOPMENT.md` (repositório `clubedocavalobonfimmg`) para qualquer máquina. Validado rodando a suíte completa: **193 verificações passando localmente** (139 unidade/integração + 38 Firestore Rules + 15 Storage Rules) antes desta fase acrescentar mais 26 (Feature Flags) — 219 no total ao final.

Scripts novos (raiz `package.json`, `functions/package.json`, ambos no repositório `clubedocavalobonfimmg`):
- `npm install` → dispara `postinstall` → instala `functions/` junto (não precisa rodar duas vezes).
- `npm run dev` → `firebase emulators:start --only firestore,auth,functions,storage`. **Hosting emulator não é usado** — o frontend é servido pelo GitHub Pages, não Firebase Hosting (documentado, não é lacuna).
- `npm test` → `firebase emulators:exec` envolvendo `functions/test:all` (unidade + Rules + Storage Rules, os três em uma única sessão de emulador — antes, cada um exigia uma invocação manual separada contra um emulador já de pé, sem nenhum comando único).
- `npm run lint` → ESLint (flat config, `eslint.config.js`) — escopo deliberadamente restrito a `functions/**`, `firebase.js`, `tenant.config.js` (núcleo compartilhado, maior alcance de bug). **Não** lint os `<script type="module">` inline das dezenas de páginas admin — nunca foram escritas pensando em lint, cobertura ali seria ruído sem consertar bug nenhum.
- `npm run build` → `scripts/check-syntax.js` (`node --check` em todo `.js` do repo). Este projeto não tem bundler (GitHub Pages serve estático, Cloud Functions roda `.js` como está) — "build" aqui é o equivalente honesto de "quebrou a build" numa stack sem etapa de compilação, não uma etapa decorativa.
- `.nvmrc` (`22`, mesma versão de `functions.engines.node`) — reduz "funciona local, quebra no deploy".

**Decisão documentada — sem "typecheck"**: projeto 100% JavaScript vanilla, sem TypeScript e sem JSDoc com verificação de tipo em nenhum arquivo. Um step de typecheck aqui não checaria nada de verdade. Se o projeto adotar TS/JSDoc no futuro, é aí que este step ganha sentido.

## 3. CI/CD — `.github/workflows/ci.yml` (repositório `clubedocavalobonfimmg`)

Dois jobs paralelos e independentes, PR e push em `main`, **sem automatizar deploy** (continua manual, via `firebase deploy` local, como sempre foi):
- `lint-and-build` — rápido, sem Java: `npm ci` → `npm run lint` → `npm run build`.
- `test` — instala Java (`actions/setup-java@v4`, Temurin 21) + Firebase CLI, roda `npm test` (mesmo comando que um dev roda local — zero divergência entre "passa no meu commit" e "passa no CI").

Cache de dependências via `actions/setup-node@v4` (`cache: npm`); `concurrency` cancela runs obsoletos do mesmo PR. Branch protection (GitHub → Settings → Branches, exigir os checks `lint-and-build`/`test` antes de merge) é um passo manual de configuração do repositório — a Cloud Function/workflow não consegue se auto-configurar como obrigatório, só o painel do GitHub decide isso.

**Validação desta fase**: os comandos reais (`npm ci`, `npm run lint`, `npm run build`, `npm test`) rodaram e passaram antes do workflow ser considerado pronto. `act` (executor local de GitHub Actions) foi instalado mas não usado de fim a fim: exige Docker rodando (via Colima), que não estava ativo, e subir uma VM só para essa validação extra foi julgado desproporcional — pendência anotada, não um "confiei sem checar".

## 4. Feature Flags — `functions/lib/features.js` (repositório `clubedocavalobonfimmg`)

A parte mais substancial da fase. Deploy ≠ Release: uma funcionalidade pode estar no código publicado sem estar disponível pra ninguém (ou pra quase ninguém) até uma decisão explícita, sem outro deploy.

**Schema — `featureFlags/{flagKey}`** (coleção nova, plataforma):
```
key, description, category ("experiment"|"beta"|"premium"|"killswitch"|"other" — só rótulo/filtro, nunca muda a lógica de resolução)
status: "off" | "on" | "rollout"
rolloutPercentage: number (0-100, só relevante com status="rollout")
overrides: { [orgId]: boolean }  — SEMPRE vence status/rollout; é o único mecanismo pra
  beta interno/cliente piloto (override:true) E desligamento emergencial por tenant
  (override:false) — não precisa de "modo" separado pra cada caso de uso
environments: string[] | null — restringe por organizations/{orgId}.environment
  (Fase 3.7), NUNCA por nome de organização
archived: boolean — soft-state; nunca hard-delete
createdAt, updatedAt, createdBy, updatedBy
```

**Resolução — função pura, testável sem Firestore** (`resolveFlag(flag, org)` em `lib/features.js`): override da organização sempre vence; senão `environments` filtra; senão `status` decide (`off`→false, `on`→true, `rollout`→bucket determinístico via hash `key+orgId`, mesma org sempre no mesmo grupo conforme o % sobe). **Fail-CLOSED pra flag desconhecida/arquivada** — divergência deliberada do fail-open de `modules.js`/`branding.js` (mecanismos de módulo/marca da Fase 3.4/3.5): lá, campo ausente = entitlement herdado; aqui, flag desconhecida = funcionalidade nova/incompleta que nunca foi ligada explicitamente — o padrão seguro é não vazar.

**Por que o cliente NÃO lê `featureFlags/{flagKey}` direto**: o documento agrega o mapa `overrides` de **todas** as organizações da plataforma. Se exposto via `getDoc()` client-side, qualquer usuário logado de qualquer organização veria pra quais outras organizações um recurso está ligado — vazamento cross-tenant. Solução: `resolveFeatureFlags` (Cloud Function callable) é a **única porta de entrada do cliente**, devolve só o mapa já resolvido (flagKey→booleano) pra UMA organização, nunca o documento cru. Firestore Rules restringem leitura direta de `featureFlags/*` a `isPlatformStaff()` — só o Painel Master (que precisa administrar, não só consumir) lê a coleção inteira.

**Camada única, sem IFs espalhados**: toda checagem de flag passa por `featureService.isEnabled(key, org)` (dentro de Cloud Functions) ou pela callable/`shared/core/tenant/features.js` (cliente, repositório `portal-associativo`) — nenhuma outra parte do sistema lê `featureFlags` do Firestore.

**Cloud Functions** (`functions/index.js`, repositório `clubedocavalobonfimmg`): `resolveFeatureFlags` (qualquer membro autenticado, resolve a própria org; Platform Staff pode passar `orgId` pra pré-visualizar outra), `createFeatureFlag`/`setFeatureFlagStatus`/`setFeatureFlagOverride`/`archiveFeatureFlag` (Platform Administrator/Owner, auditados em `systemLogs`).

**Cliente** — `shared/core/tenant/features.js` (este repositório, `portal-associativo`), mesma FORMA de `modules.js`/`branding.js` (factory com DI, cache em `sessionStorage`, fail-safe, `applyFeatureVisibility()` simétrico a `applyModuleVisibility()` via `[data-feature="chave"]`) mas fonte de dado diferente (callable, não `getDoc()` direto). TTL de cache do cliente: 1 min (vs. 10 min de módulos/branding — uma flag muda com muito mais frequência que módulo contratado).

**Painel Master** (este repositório) — `admin/feature-flags.html` (nova página + entrada na sidebar): listar flags, criar, mudar status/rollout, adicionar/remover exceção por organização (dropdown com todas as orgs), arquivar. Mesmo padrão de `admin/platform-operators.html` (auth guard, tabela, modais Bootstrap).

**Achado real durante a validação — SLA de propagação, não bug de lógica**: `invalidateCache()` (chamado por toda mutação) só limpa o cache da **instância de processo** que executou a escrita — cada Cloud Function exportada roda em containers separados mesmo compartilhando `index.js`, sem memória compartilhada entre elas. Confirmado empiricamente no deploy desta fase: `setFeatureFlagStatus` mudando uma flag e `resolveFeatureFlags` (instância própria, já quente) ainda devolvendo o valor antigo por alguns segundos. `CACHE_TTL_MS` (20s, `lib/features.js`) **é o SLA real de propagação de um kill-switch**, não uma otimização cosmética — documentado extensivamente no código pra nunca ser reintroduzido como surpresa. Testado ponta a ponta com uma conta `platformAdmins` descartável (criada, testada, apagada — nunca a conta owner real).

## 5. Testes

`functions/test/features.test.js` (26 verificações): `resolveFlag`/`isInRolloutBucket` puros (override vence status, kill-switch por tenant, `environments`, fail-closed) + `createFeatureService` contra o emulador real (ciclo completo create→status→override→archive, idempotência de `createFlag` por chave duplicada, validação de `rolloutPercentage`). Suíte completa: **219 verificações, 0 falhas** (166 unidade/integração — incluindo as 26 novas, 38 Rules, 15 Storage Rules).
