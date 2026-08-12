# Portal Associativo

Plataforma SaaS multi-tenant para clubes e associações — site institucional
(marketing, SEO, planos) **e** o Painel Master (`admin/`), usado pela equipe
da Serafim Technologies para administrar todas as organizações da
plataforma.

> Este repositório é o produto/plataforma: site institucional + Painel
> Master + núcleo de frontend compartilhado (`shared/`, consumido por
> qualquer tenant). O sistema operacional que um clube usa no dia a dia
> (associados, financeiro, eventos) é implementado no projeto irmão
> [Clube do Cavalo de Bonfim MG](https://github.com/waldineyserafim/clubedocavalobonfimmg)
> — hoje o único tenant de produção real, mais um tenant Sandbox oficial de
> demonstração. Os dois repositórios compartilham o mesmo projeto Firebase.
> Para o modelo de arquitetura completo, ver **[CLAUDE.md](CLAUDE.md)**.

---

## Objetivo do projeto

Dar à plataforma uma presença institucional própria (landing page, SEO,
apresentação de planos e funcionalidades, captação de leads) **e** hospedar
o Painel Master — administração cross-tenant (organizações, planos,
assinaturas, módulos, domínios, feature flags, equipe de plataforma,
auditoria) — sem acoplar esse conteúdo ao deploy do sistema operacional de
nenhum tenant.

**Em produção desde ago/2026**, em `https://portalassociativo.com.br/`:
Design System consolidado, Home e páginas internas com copy final, Painel
Master completo em `admin/`, formulários funcionais, domínio próprio com
DNS/HTTPS/e-mail configurados. Ver [CLAUDE.md](CLAUDE.md) para o estado
atual e [docs/roadmap/](docs/roadmap/) para o histórico completo por fase.

---

## Arquitetura

Site estático (marketing) + Painel Master autenticado, ambos publicados
direto no GitHub Pages, sem build step. Mesma filosofia do projeto CCBMG —
ver [CLAUDE.md](CLAUDE.md) (estado atual do modelo multi-tenant) e
[docs/architecture/](docs/architecture/) (decisões técnicas: por que sem
sistema de include, como o Firebase é compartilhado, como formulários são
resolvidos).

```
Visitante → Portal Associativo (marketing, SEO, planos, contato)
                  │
                  └── "Login Master" → admin/login.html (Painel Master,
                      neste mesmo repositório — equipe da plataforma)

Associado/Admin de um tenant → clubedocavalobonfim.com.br (ou outro
                  domínio registrado) → resolvido para a organização
                  correta pelo Tenant Resolver (ver CLAUDE.md)
```

---

## Estrutura de pastas

```
portal-associativo/
├── admin/                      # Painel Master — administração cross-tenant
│   ├── login.html, index.html, organizations.html, organization-detail.html,
│   │   organization-provision.html, domains.html, plans.html, subscriptions.html,
│   │   modules.html, feature-flags.html, platform-operators.html, audit.html,
│   │   leads.html, lead-detail.html, settings.html
│   └── assets/                 # admin-auth.js, admin-nav.js (deste painel)
├── shared/                     # núcleo compartilhado consumido cross-origin por qualquer tenant
│   ├── core/                   # auth/Firebase, tenant (resolução por hostname, branding, features), módulos
│   └── components/             # sidebar, KPI card, tabela de dados, modal (ver shared/README.md)
├── cloudflare-worker-demo-proxy/  # Worker de proxy reverso do domínio de demonstração
├── assets/
│   ├── images/
│   │   ├── brand/          # logo, og-cover — definitivos (docs/brand-system)
│   │   ├── icons/          # favicon.svg e ícones de app, definitivos
│   │   └── illustrations/  # ainda sem conteúdo (não usado pela landing atual)
│   └── fonts/               # fontes customizadas (hoje herda a font-stack do sistema/Bootstrap)
├── css/
│   ├── design-system.css     # ponto de entrada — importa os 4 abaixo
│   ├── variables.css         # tokens (cor, espaçamento, raio, sombra, z-index)
│   ├── typography.css
│   ├── components.css        # átomos do DS (.ds-card, .ds-badge, .ds-alert…)
│   ├── landing.css           # estilos compartilhados da landing (Home + páginas internas)
│   ├── landing-nova.css      # estilos exclusivos da Home (hero-v5, categorias, dispositivos…)
│   ├── utilities.css
│   ├── bootstrap.min.css     # vendorizado (Bootstrap 5.3.3)
├── js/
│   ├── app.js                 # bootstrap de cada página (nav ativa + ano do rodapé)
│   ├── firebase.js            # SDK do Firebase compartilhado (site institucional)
│   ├── forms.js                # formulários → mailto: (js/forms.js)
│   ├── utils.js                # helpers puros
│   └── bootstrap.bundle.min.js
├── pages/                    # páginas internas (login, contato, demonstração…)
├── docs/                     # documentação interna (brand, DS, arquitetura, UX/UI, roadmap…)
├── index.html                 # home — precisa ficar na raiz (requisito do GitHub Pages)
├── CNAME                      # domínio próprio do GitHub Pages (portalassociativo.com.br)
├── CLAUDE.md                  # arquitetura da plataforma multi-tenant — estado atual
├── robots.txt / sitemap.xml / manifest.webmanifest
└── README.md
```

> `components/` (sistema de fragmentos HTML via `fetch()`) existiu na fase de
> fundação, nunca chegou a ser usado por nenhuma página real e foi removido
> em ago/2026 — ver "Por que não há sistema de include/template" em
> [docs/architecture/](docs/architecture/).

---

## Tecnologias

Exatamente as mesmas do projeto CCBMG — por decisão de arquitetura, não por
limitação:

- HTML5 + CSS3 + Bootstrap 5.3 (vendorizado, sem CDN para o core)
- JavaScript vanilla, ES Modules, `async/await`
- Firebase SDK (via CDN modular) — mesmo projeto Firebase do CCBMG; usado
  ativamente pelo Painel Master (`admin/`) e pelo núcleo compartilhado
  (`shared/`), que o site institucional (`index.html`/`pages/`) não usa
- Bootstrap Icons via CDN

**Sem** React/Vue/Angular/Next/Nuxt/Vite/TypeScript, sem build, sem
compilação, sem Node em produção, sem dependências de pacote — compatível
com GitHub Pages "puro".

---

## Como publicar

O repositório é servido diretamente pelo GitHub Pages a partir da branch de
produção (raiz). Não há passo de build:

1. Domínio já configurado: `portalassociativo.com.br` (registro.br como
   registrador, DNS no Cloudflare, arquivo `CNAME` na raiz deste repo,
   GitHub Pages com HTTPS obrigatório) — ver [docs/seo/](docs/seo/) e o
   histórico de go-live em [docs/roadmap/](docs/roadmap/).
2. Fazer `git push` na branch de produção — o GitHub Pages publica
   automaticamente (build costuma levar menos de 1 min; o proxy do
   Cloudflare pode levar até ~10 min adicionais para refletir por causa de
   cache de borda — ver Débito técnico em [docs/roadmap/](docs/roadmap/)).

### Rodando localmente

Qualquer servidor estático funciona (só é preciso HTTP, não `file://`, por
causa dos ES Modules):

```bash
npx serve . -l 3333
# ou
python3 -m http.server 3333
```

---

## Como contribuir

1. Ler [docs/architecture/](docs/architecture/) antes de propor mudança
   estrutural.
2. Seguir as convenções de nomenclatura abaixo.
3. Não implementar copy definitivo sem checar [docs/copywriting/](docs/copywriting/).
4. Não duplicar tokens de cor/espaçamento fora de `css/variables.css`.
5. Commits pequenos e descritivos; sem `--no-verify`.

### Padrões adotados

**Nomes de arquivo:** `kebab-case.html`, `kebab-case.css`, `kebab-case.js`
(ex.: `demo-request-form.html`, `design-system.css`).

**Nomes de imagem:** `contexto-descricao.ext` em minúsculo, sem espaço
(ex.: `brand/logo-horizontal.svg`, `icons/favicon.svg`).

**CSS:** variáveis em `:root` (`--brand`, `--space-md`, `--radius-lg`…);
componentes reutilizáveis prefixados com `ds-` (`.ds-card`, `.ds-badge`);
estilos específicos de uma página isolados em seu próprio arquivo
(`landing.css`), nunca misturados em `components.css`.

**JavaScript:** ES Modules, uma responsabilidade por arquivo
(`utils.js` = funções puras, `forms.js` = envio de formulário, `app.js` =
orquestração por página), sem frameworks, sem classes desnecessárias —
funções exportadas individualmente. Antes de adicionar um export novo em
`utils.js`, confirmar que ele é realmente usado por alguma página — a
limpeza de ago/2026 removeu três funções que nunca chegaram a ser chamadas.

**Estrutura:** uma página HTML = um arquivo autocontido (navbar/footer
inline, como no CCBMG) para conteúdo crítico de SEO/primeira renderização —
ver justificativa em [docs/architecture/](docs/architecture/).

---

## Roadmap

A tabela de fases detalhada, com o histórico de cada commit relevante e as
pendências reais em aberto, vive só em [docs/roadmap/](docs/roadmap/) — não
duplicada aqui, para não haver duas fontes de verdade divergentes. O estado
**atual** (não histórico) do modelo multi-tenant vive em [CLAUDE.md](CLAUDE.md).

Resumo de alto nível: fundação e conteúdo definitivo do site institucional
(Fases 1–2, em produção) → Painel Master reconstruído e publicado, junto com
todo o mecanismo multi-tenant da plataforma (Fases 3.1–3.12 + Fase 4, **onde
o projeto está hoje**, todas já em produção) → páginas de segmento/marketplace
do site institucional (Fase 3 local) → divulgação do aplicativo (Fase 4
local) → páginas institucionais sobre IA e automações (Fase 6 local). Ver a
nota sobre numeração em [docs/roadmap/README.md](docs/roadmap/README.md) —
"Fase 3.x"/"Fase 4" têm significados diferentes conforme o contexto (site
institucional vs. plataforma SaaS).

---

## Licença

Ver [LICENSE](LICENSE).
