# Arquitetura — Portal Associativo

## Visão geral

O Portal Associativo é um site estático (HTML + CSS + JS vanilla), publicado
via GitHub Pages, sem build step. É o produto institucional/marketing da
plataforma — não o sistema operacional dos clubes (esse papel continua com o
projeto **Clube do Cavalo de Bonfim MG**, que se tornará o SaaS multi-tenant
na Fase 5).

```
Visitante → Portal Associativo (marketing, SEO, planos, contato)
                  │
                  └── "Login Master" → redireciona para
                      clubedocavalobonfim.com.br/login_master.html
                      (Painel Master ainda vive lá — ver roadmap)
```

## Por que dois repositórios separados

- O CCBMG é hoje o produto operacional de UM cliente (Clube do Cavalo de
  Bonfim MG) — suas páginas, textos e módulos são específicos desse clube.
- O Portal Associativo é o produto institucional da EMPRESA (marketing,
  planos, SEO) — não deve herdar conteúdo específico de um cliente.
- Separar os repositórios evita acoplar deploys: uma alteração de marketing
  não arrisca quebrar o sistema em produção de um clube pagante, e vice-versa.
- Quando o Painel Master migrar para cá (Fase 5), ele passa a ser uma área
  autenticada dentro deste mesmo repositório/domínio — o Portal já nasce
  preparado para isso (ver `js/firebase.js`).

## Firebase compartilhado

Este projeto usa o **mesmo** projeto Firebase do CCBMG (`clubecavalobonfim`).
Não é criado um projeto Firebase novo. Nesta fase o Portal não lê/escreve
nada no Firestore — `js/firebase.js` apenas inicializa o SDK e fica pronto
para quando o Painel Master for movido para cá. Nenhuma regra do Firestore,
Storage ou Functions do projeto original é alterada por este repositório.

## Por que não há sistema de include/template

GitHub Pages sem Jekyll (ver `.nojekyll`, mesma decisão do CCBMG) e sem
build step não oferece include nativo de HTML. Duas opções foram
consideradas para reduzir duplicação de navbar/footer entre páginas:

1. **Duplicar o HTML em cada página** (abordagem do CCBMG hoje).
2. **Carregar fragmentos via `fetch()` em runtime** — chegou a ser
   implementado (`js/components.js` + pasta `components/`), mas nenhuma
   página real chegou a usar `data-component`: todo o site foi construído
   com HTML inline desde a 1ª landing page. Em ago/2026, com o produto já
   em produção e a duplicação de markup comprovadamente não sendo um
   problema real, esse sistema (código morto — nunca executado por nenhuma
   página) foi removido.

**Decisão final, confirmada pelo uso real:** todo o HTML — navbar, footer,
hero, seções — fica **inline em cada página**, igual ao CCBMG. Isso evita
atraso de pintura inicial, layout shift e o risco (ainda que pequeno) de
crawlers que não executam JS não verem o conteúdo — tudo isso seria custo
real de um sistema de fragmentos, para um ganho de DX que a prática mostrou
não valer a pena neste projeto.

## Formulários (contato / demonstração)

Sem backend próprio neste projeto (por definição do escopo). **Decisão
adotada**: `js/forms.js` monta um link `mailto:` com os dados do formulário
já preenchidos no corpo da mensagem e abre o cliente de e-mail do usuário —
funciona 100% estático, sem depender de serviço de terceiro (Formspree/
Web3Forms) nem de Cloud Function própria. O endereço de destino
(`contato@portalassociativo.com.br`, constante `DEST_EMAIL` em `js/forms.js`)
é uma caixa real desde ago/2026: recebimento via Cloudflare Email Routing
(MX/SPF/DKIM configurados na zona do domínio), com encaminhamento
confirmado por teste real para a caixa da equipe. Envio "como"
`contato@portalassociativo.com.br` (ex.: responder um e-mail recebido) usa
o recurso "Send mail as" do Gmail via SMTP relay — sem DKIM próprio do
domínio para esse fluxo específico, então alguns clientes de e-mail podem
mostrar uma anotação discreta "via gmail.com" no remetente (não afeta
entrega, é só cosmético; ver `docs/roadmap/README.md`, Débito técnico, para
o caminho de melhoria caso vire prioridade).

Se o volume de leads justificar substituir esse fluxo por um serviço de
formulário de terceiros ou por uma Cloud Function própria no futuro, a troca
fica isolada em `js/forms.js` — os formulários em si (`pages/contato.html`,
`pages/demonstracao.html`) não precisam mudar de estrutura.

## Núcleo compartilhado da plataforma (`shared/`) — ago/2026

O Portal Associativo passou a hospedar, em `shared/`, o núcleo de código reutilizável pela plataforma inteira: autenticação/Firebase, resolução de tenant, módulos habilitados, auditoria, utilitários e componentes visuais (sidebar, KPI card, tabela de dados, modal). Qualquer tenant — hoje só o CCBMG, futuramente outros — consome via `import` cross-origin de URL absoluta (`https://portalassociativo.com.br/shared/...`), sem duplicar nada localmente.

Contrato completo, política de versionamento e o que nunca entra no núcleo: ver `shared/README.md` neste mesmo repositório. Contexto de por que isso existe e como se encaixa no roadmap multi-tenant mais amplo: `docs/SAAS_MULTITENANT.md` no repositório do CCBMG (documento pré-existente, com um modelo de arquitetura ligeiramente diferente — resolução dinâmica por domínio num único app — que este núcleo complementa sem substituir; ver a seção "Reconciliação" no plano de implementação desta fase).

Decisão de design que vale registrar aqui: `shared/core/tenant/tenant-context.js` expõe `getTenant()` como **assíncrona** mesmo hoje, quando a resolução é só ler um arquivo de config local (`tenant.config.js`) declarado por cada tenant. Isso é proposital — quando a resolução dinâmica por domínio existir de fato, só o corpo interno dessa função muda; nenhum consumidor precisa ser reescrito.

Este núcleo **não inclui**, deliberadamente: vocabulário de papel de nenhum tenant específico, qualquer efeito colateral automático disparado só por importar um módulo, schema de catálogo/negócio de um tenant, ou caminho de redirecionamento hardcoded — tudo isso é responsabilidade do site consumidor, nunca do núcleo.

## Convenções herdadas do CCBMG

- Prefixo `ds-` para classes do Design System (`ds-card`, `ds-badge`, …).
- Variáveis CSS em `:root` com os mesmos nomes (`--brand`, `--space-*`,
  `--radius-*`, `--shadow-*`, `--z-*`) — paleta de cor diferente, mesma
  convenção de tokens.
- Bootstrap 5.3 vendorizado em `css/`/`js/` (não via CDN) + Bootstrap Icons
  via CDN — igual ao CCBMG.
- Sticky footer via flexbox em `css/utilities.css`.
- `?v=` como cache-busting manual em `<link>`/`<img>` (sem build, sem hash
  automático de asset).
