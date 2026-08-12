# Fase 3.10 — Tenant Resolver: sem fallback + Gestão de Domínios — Relatório

*Consolidado a partir do registro em `CLAUDE.md` (repositório `clubedocavalobonfimmg`) durante a reorganização de documentação de agosto de 2026 — não é um relatório escrito no momento da implementação original, como os das Fases 3.1–3.6.*

---

## 1. Resumo executivo

Fecha duas lacunas da Fase 3.9: o fallback pro `orgId` estático mascarava erro de DNS/configuração (podia servir a organização errada silenciosamente pra um hostname mal configurado), e a manutenção de `domains/` dependia de entrar em `organization-detail.html` organização por organização — sem visão global, sem busca.

## 2. Decisão 1 — sem fallback automático, pra ninguém

`getTenant({db})` (`shared/core/tenant/tenant-context.js`, este repositório) não cai mais pro `orgId` de `tenant.config.js` quando o hostname não está em `domains/`. `tenant.config.js` (repositório `clubedocavalobonfimmg`) nem declara `orgId` mais — só a config do SDK do Firebase (igual pra qualquer organização). `db` passou de opcional pra **obrigatório** em `getTenant()` (não tem mais pra onde cair sem ele).

```
Hostname em domains/{hostname}?
  SIM → resolve orgId normalmente, aplicação inicia
  NÃO → TenantNotFoundError → renderTenantNotFoundPage() → página amigável, execução interrompida
```

`TenantNotFoundError` (nova classe exportada de `tenant-context.js`) é o sinal distinguível — quem chama decide o que fazer com ele; `renderTenantNotFoundPage(err)` é o comportamento padrão que `firebase.js` (repositório `clubedocavalobonfimmg`) usa: substitui **todo** o `<body>` por uma mensagem central ("Organização não encontrada", hostname que falhou, orientação pra quem for administrador da plataforma) — sem CSS/branding externo (não dá pra aplicar branding de uma organização que não foi resolvida), depois relança o erro pra interromper a avaliação do módulo (nenhum script de página específica roda depois).

**Sem exceção pro Sandbox nem pra nenhum caso** — o mesmo mecanismo vale pra `clubedocavalobonfim.com.br`, `demo.portalassociativo.com.br` e qualquer domínio futuro. Validado com Playwright (interceptação de hostname real, produção de verdade): hostname cadastrado resolve certo, hostname não cadastrado mostra a página amigável — nunca mais o fallback.

## 3. Decisão 2 — Gestão de Domínios reaproveita a Cloud Function existente, não cria CRUD paralelo

`admin/domains.html` (novo, nesta fase, este repositório — nav "Domínios" no Painel Master) é a primeira visão **global/cross-organização** de `domains/` — lista todos os hostnames com a organização dona (join com `organizations`), tipo (Principal/Alternativo), status, busca client-side por hostname ou nome da organização.

**Por que não criar `createDomain`/`updateDomain`/`deleteDomain` granulares**: `setOrganizationDomains({orgId, dominioPrincipal, dominiosAlternativos})` (Fase 3.5, Cloud Function no repositório `clubedocavalobonfimmg`) já modela "o conjunto de domínios de uma organização" como substituição atômica (garante unicidade global, mirror em `organizations/{orgId}.dominio`, auditoria) — exatamente o mesmo modelo que `organization-detail.html` já usa há uma fase inteira. Criar callables por-domínio duplicaria essa lógica de validação/auditoria em dois lugares. Em vez disso, `domains.html`:

- **Listar**: leitura direta de `domains`/`organizations` (Firestore Rules já permitem `isPlatformStaff()` listar).
- **Criar/promover a principal**: modal "Novo domínio" — escolhe organização + hostname + tipo; a tela busca o conjunto atual da organização, calcula o conjunto desejado (adiciona como alternativo, ou promove a principal empurrando o anterior pra alternativo) e chama `setOrganizationDomains`.
- **Remover** (só domínios alternativos, direto da lista — um clique): recalcula o conjunto da organização sem aquele hostname e chama `setOrganizationDomains`. Remover um domínio **principal** não tem atalho de um clique de propósito — expulsar o domínio que resolve a organização é uma mudança grande o bastante pra exigir passar por `organization-detail.html`.
- **Editar**: "Ver organização" leva direto pra `organization-detail.html?id={orgId}` (aba Geral, onde o editor completo de domínios já existe desde a Fase 3.5) — zero duplicação de formulário.

`domains` continua sendo **só o resolvedor de hostname** — `organizations` continua sendo a fonte oficial de quem é a organização. Validado com Playwright autenticado como Platform Owner contra produção: listagem com nomes corretos, busca, adicionar domínio alternativo via UI, remover via UI — ciclo completo, sem deixar resíduo.

## 4. Fluxo completo (hostname → aplicação)

```
1. Browser resolve DNS de demo.portalassociativo.com.br → Cloudflare
2. Cloudflare Worker recebe a request, faz fetch(clubedocavalobonfim.com.br + path)
   e devolve a resposta verbatim — location.hostname no browser continua
   sendo demo.portalassociativo.com.br (nunca há redirect)
3. Frontend carrega (mesmo HTML/JS de sempre — tenant.config.js só tem a
   config do SDK, sem orgId)
4. firebase.js: initTenantFirebase() (config do SDK) → db pronto
5. firebase.js: await getTenant({db}) — tenant-context.js consulta
   domains/{location.hostname} no Firestore (cacheado 1h em sessionStorage)
6a. Encontrado → orgId resolvido → currentOrgId exportado → app roda normal
6b. Não encontrado → TenantNotFoundError → renderTenantNotFoundPage() →
    "Organização não encontrada" → execução interrompida
```

## 5. Tratamento de erros

| Cenário | Onde é pego | Comportamento |
|---|---|---|
| Hostname sem registro em `domains/` | `getTenant()` → `TenantNotFoundError` | Página amigável, sem fallback |
| Domínio duplicado (já é de outra org) | `setOrganizationDomains` (`already-exists`) | Mensagem clara na tela |
| Domínio vazio/inválido | `setOrganizationDomains` (`invalid-argument`, `isValidHostname`) | Mensagem clara na tela |
| Organização inexistente | `setOrganizationDomains` (`not-found`) — na prática inatingível pela UI | Mensagem clara se atingido via chamada direta |
| Firestore inacessível durante a consulta a `domains/` | `getTenant()` deixa o erro propagar (sem try/catch silencioso) | Página quebra visivelmente em vez de mascarar |

## 6. Operação

**Publicar um domínio novo pra uma organização já existente**: Painel Master → Domínios → Novo domínio → escolher organização + hostname + tipo → Cadastrar. Se o domínio for servido por um novo hostname físico (não só um path), configurar DNS/Cloudflare Worker separadamente (Fase 3.9) — o cadastro em `domains/` sozinho não cria infraestrutura de rede.

**Criar um novo ambiente de demonstração** (mesmo padrão do Sandbox): 1) organização já provisionada (`provisionOrganization`, Fase 3.3); 2) adicionar Custom Domain no Worker do Cloudflare já existente (Fase 3.9); 3) Painel Master → Domínios → Novo domínio, apontando o hostname pra essa organização.

## 7. Arquivos alterados/criados

`shared/core/tenant/tenant-context.js` (sem fallback, `TenantNotFoundError`, `renderTenantNotFoundPage`) e `admin/domains.html`, `admin/assets/admin-nav.js` (item "Domínios") — todos neste repositório. `firebase.js`, `tenant.config.js` (remove `orgId`) no repositório `clubedocavalobonfimmg`.
