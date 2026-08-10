# Núcleo compartilhado — Portal Associativo

Este diretório é a **origem única** de código reutilizável pela plataforma inteira — o Portal Associativo hospeda, qualquer tenant (hoje só o CCBMG, futuramente outros) consome via `import` cross-origin, sem duplicar nada localmente.

> **Contexto completo desta decisão**: `docs/architecture/README.md` (Portal Associativo) e `docs/SAAS_MULTITENANT.md` (repositório do CCBMG) — este README assume que você já leu os dois.

## Por que isso funciona sem build step

`<script type="module">` e `import` estático dentro de módulos ES fazem o fetch do arquivo em modo CORS, mesmo cross-origin. GitHub Pages já envia `Access-Control-Allow-Origin: *` em todo arquivo estático por padrão (confirmado ao vivo em `portalassociativo.com.br` e `clubedocavalobonfim.com.br`) — não precisa de nenhuma configuração extra dos dois lados. É exatamente o mesmo padrão que o `firebase.js` do CCBMG já usa há anos para importar o SDK do Firebase de `gstatic.com`.

## Como um tenant consome o núcleo

1. Declarar um `tenant.config.js` na raiz do próprio site (script clássico, **não** módulo ES — precisa estar disponível de forma síncrona antes do núcleo carregar):
   ```html
   <script src="./tenant.config.js"></script>
   ```
   Conteúdo mínimo:
   ```js
   window.__TENANT_CONFIG__ = {
     orgId: "org_bonfim",
     firebase: { apiKey: "...", authDomain: "...", projectId: "...", storageBucket: "...", messagingSenderId: "...", appId: "..." },
     loginUrl: "./login.html",
   };
   ```

2. Importar o que precisar do núcleo, sempre com a versão fixada na query string:
   ```html
   <script type="module">
     import { getTenant } from "https://portalassociativo.com.br/shared/core/tenant/tenant-context.js?v=2026.08.4";
     import { initTenantFirebase } from "https://portalassociativo.com.br/shared/core/auth/firebase-init.js?v=2026.08.4";
   </script>
   ```

3. Para os componentes visuais (CSS puro, sem dependência de JS além do Bootstrap que o site já carrega):
   ```html
   <link rel="stylesheet" href="https://portalassociativo.com.br/shared/components/index.css?v=2026.08.0">
   ```

## Versionamento — por que a query string `?v=` é obrigatória

`portalassociativo.com.br` está atrás de um proxy Cloudflare com cache de borda de **4 horas** (`cache-control: max-age=14400`, confirmado ao vivo). Sem uma versão fixada na URL, uma alteração no núcleo pode demorar até 4h para aparecer — ou, pior, aparecer em momentos diferentes para tenants diferentes durante esse intervalo.

Regra: **toda alteração publicada aqui incrementa a versão em `CHANGELOG.md` e a query string usada nos exemplos deste README.** Tenants existentes continuam apontando para a versão antiga indefinidamente — eles só quebram se decidirem, deliberadamente, atualizar a query string sem antes conferir o changelog. Isso é o que torna evoluções do núcleo **aditivas**, nunca uma reescrita forçada para quem já consome.

## O que está aqui e por quê

| Pasta | Conteúdo | Regra de entrada |
|---|---|---|
| `core/auth/` | Inicialização do Firebase, sessão/guarda de rota, normalização de papéis | Só mecanismo genérico e parametrizável — nenhum vocabulário de papel, nenhum caminho hardcoded, nenhuma regra de negócio de um tenant específico |
| `core/tenant/` | Resolução de tenant, módulos habilitados, branding, auditoria | `getTenant()` já nasce assíncrona (`Promise`), mesmo hoje sendo síncrona por dentro — ver nota de arquitetura em `core/tenant/tenant-context.js`. `branding.js` (Fase 3.5) lê a projeção pública e curada de `organizations/{orgId}`, nunca o documento inteiro |
| `utils/` | Funções puras sem dependência de Firebase nem de markup de nenhum tenant | — |
| `components/` | CSS puro (nenhum comportamento) para sidebar, KPI card, tabela de dados, modal | Todo `var()` tem fallback explícito — funciona mesmo em um tenant que não declarou os tokens de cor do Portal Associativo |
| `layouts/` | Composição de componentes (como eles se combinam numa tela), não átomos isolados | — |
| `services/` | Vazio nesta fase — ver `services/README.md` | — |

## O que NUNCA vai para o núcleo

- Vocabulário de papéis de um tenant específico (ex.: `participanteLeilao`, `associado` são conceitos do CCBMG, não universais).
- Qualquer efeito colateral automático disparado só por importar o módulo (o `_initNavbarUser` do `firebase.js` atual do CCBMG é o antiexemplo que motivou esta regra — mexe em `#btnAssociado` sozinho ao ser importado). Toda função do núcleo só executa quando a página chama explicitamente.
- Schema de catálogo/negócio específico de um tenant (produtos, serviços, planos de mensalidade).
- Caminho de redirecionamento hardcoded (`./login.html`) — sempre parâmetro, nunca default assumido.
