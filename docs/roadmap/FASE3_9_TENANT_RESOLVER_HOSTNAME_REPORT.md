# Fase 3.9 — Tenant Resolver por Hostname (G4 resolvido) — Relatório

*Consolidado a partir do registro em `CLAUDE.md` (repositório `clubedocavalobonfimmg`) durante a reorganização de documentação de agosto de 2026 — não é um relatório escrito no momento da implementação original, como os das Fases 3.1–3.6.*

---

## 1. Resumo executivo

Resolve o gap G4 (documentado desde a Fase 3.5, `docs/SAAS_MULTITENANT.md` no repositório `clubedocavalobonfimmg`): um único deployment do CCBMG (GitHub Pages) passa a servir **mais de uma organização**, decidindo qual pelo hostname que serviu a página — sem segundo frontend, sem segundo projeto Firebase, sem `currentOrgId` hardcoded pros dois casos abaixo.

## 2. Domínios ativos

| Hostname | orgId | Como chegou até aqui |
|---|---|---|
| `clubedocavalobonfim.com.br` | `org_bonfim` | Origem real (GitHub Pages) — arquivos servidos diretamente |
| `demo.portalassociativo.com.br` | `org_teste_etapa10` ("Clube dos Associados", tenant Sandbox — Fase 3.7) | Cloudflare Worker fazendo proxy reverso pra `clubedocavalobonfim.com.br` |

Ambos registrados em `domains/{hostname}` (Fase 3.5) via `setOrganizationDomains` — nenhum registro novo de mecanismo, só uso do que já existia.

## 3. Limitação confirmada do GitHub Pages (verificada antes de implementar)

GitHub Pages associa **um único domínio customizado por repositório** — não existe forma suportada de um mesmo Pages site responder por dois hostnames diferentes (confirmado: GitHub Community Discussion #22779 e #30915). `clubedocavalobonfim.com.br` resolve direto pros IPs do GitHub Pages (`185.199.10x.153`, `server: GitHub.com`) — sem CDN na frente. `demo.portalassociativo.com.br` (subdomínio de `portalassociativo.com.br`), por outro lado, **já está atrás do Cloudflare** (`server: cloudflare`, confirmado via `dig`/headers) — isso definiu a solução: em vez de brigar com a limitação do GitHub Pages, usar a infraestrutura de edge **que já existe** (não é uma peça nova no stack) como camada de proxy.

## 4. Arquitetura: Cloudflare Worker como proxy reverso (não um segundo frontend)

```
Browser → demo.portalassociativo.com.br (Cloudflare Worker)
              │  fetch(https://clubedocavalobonfim.com.br + path, preservando path/query)
              ▼
         clubedocavalobonfim.com.br (GitHub Pages — ORIGEM ÚNICA, arquivo idêntico)
```

O Worker é puro proxy — não hospeda nenhum HTML/JS próprio, não sabe nada sobre organizações. `location.hostname`, do ponto de vista do navegador, continua sendo `demo.portalassociativo.com.br` (é ele quem está na barra de endereço — o Worker busca o conteúdo de outro lugar e devolve, o browser nunca é redirecionado). É exatamente esse `location.hostname` que o resolvedor abaixo lê.

**Pacote pronto pra publicar** — `cloudflare-worker-demo-proxy/` (neste repositório, `portal-associativo`): `worker.js` (script do proxy) + `wrangler.toml` (já com `[[routes]] pattern = "demo.portalassociativo.com.br" custom_domain = true` — provisiona DNS + certificado TLS + rota automaticamente no deploy, zero passo manual no dashboard) + `README.md` com o passo a passo. Validado com `wrangler deploy --dry-run` antes de entregar.

**Passo pendente à época** (fora do que a automação conseguia provisionar — sem credencial de conta Cloudflare): publicação manual via `npx wrangler login` + `npx wrangler deploy` (ver `cloudflare-worker-demo-proxy/README.md` para o passo a passo completo).

## 5. Tenant Resolver — `shared/core/tenant/tenant-context.js` (este repositório)

`getTenant({db})` (único consumidor real é `firebase.js` do repositório `clubedocavalobonfimmg`) passou a consultar `domains/{location.hostname}` de verdade, não só documentar a intenção como antes desta fase:

1. `domains/{location.hostname}` no Firestore — cacheado em `sessionStorage` por 1h (mapeamento muda raríssimo).
2. Ausente/erro → cai pro `orgId` estático de `tenant.config.js` — **(revisado na Fase 3.10, ver `FASE3_10_TENANT_RESOLVER_SEM_FALLBACK_E_DOMINIOS_REPORT.md`: sem fallback nenhum, hostname não cadastrado nunca mais resolve organização nenhuma, nem a estática)**.

Um hostname registrado **sempre vence** qualquer config estática — é isso que permite o mesmo `tenant.config.js` ser servido atrás de dois hostnames diferentes resolvendo pra organizações diferentes.

`firebase.js` (repositório `clubedocavalobonfimmg`) mudou a ordem de inicialização: `initTenantFirebase()` (config do SDK, igual pra qualquer organização) roda **antes** de `getTenant({db})`, porque a consulta a `domains/` precisa de `db` já pronto. `currentOrgId` virou `const currentOrgId = (await getTenant({db})).orgId` — top-level await, seguro porque toda página já importa `firebase.js` via `<script type="module">`.

## 6. Validação (antes de qualquer deploy)

Testado ponta a ponta com Playwright interceptando requests pro hostname real e servindo os arquivos locais (não alterou `/etc/hosts`, não precisou de DNS) — `location.hostname` genuíno, consulta batendo na produção de verdade:

| Hostname testado | `currentOrgId` resolvido | Resultado |
|---|---|---|
| `clubedocavalobonfim.com.br` | `org_bonfim` | ✅ via `domains/` |
| hostname não cadastrado (qualquer um) | `org_bonfim` (fallback, comportamento desta fase) | ✅ na época — substituído na Fase 3.10 |
| `demo.portalassociativo.com.br` | `org_teste_etapa10` | ✅ via `domains/` |

## 7. Genérico para o futuro

Adicionar um domínio próprio pra uma organização nova (cliente piloto com domínio dele, por exemplo) não exige nenhuma mudança de código daqui pra frente — só: `setOrganizationDomains({orgId, dominioPrincipal})` (já existe, Fase 3.5) + registrar o mesmo Custom Domain no Worker já criado — nenhum código novo.

## 8. Arquivos alterados

`shared/core/tenant/tenant-context.js` (este repositório — resolução por hostname), `firebase.js` (repositório `clubedocavalobonfimmg` — reordena init, `currentOrgId` top-level await, bump `?v=2026.08.8` no import de `tenant-context.js` — cache de 4h do Cloudflare exige isso).
