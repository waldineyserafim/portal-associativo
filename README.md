# Portal Associativo

Plataforma de gestão para clubes e associações — site institucional,
marketing, SEO, planos e ponto de entrada para o Login Master.

> Este é o produto institucional da plataforma. O sistema operacional que
> os clubes usam no dia a dia (associados, financeiro, eventos) é um projeto
> irmão: [Clube do Cavalo de Bonfim MG](https://github.com/waldineyserafim/clubedocavalobonfimmg),
> que hoje atende um cliente e evoluirá para o SaaS multi-tenant da
> plataforma. Este repositório **não** contém esse sistema nem o modifica.

---

## Objetivo do projeto

Dar à plataforma uma presença institucional própria — landing page, SEO,
apresentação de planos e funcionalidades, captação de leads (demonstração/
contato) e, futuramente, o Painel Master — sem acoplar esse conteúdo de
marketing ao deploy do sistema operacional de nenhum cliente.

Nesta fase inicial, o objetivo é **a fundação**: estrutura de pastas,
Design System, convenções de código e uma landing page estrutural (sem copy
definitivo) — pronta para receber conteúdo real nas próximas fases. Ver
[docs/roadmap/](docs/roadmap/).

---

## Arquitetura

Site estático, publicado direto no GitHub Pages, sem build step. Mesma
filosofia do projeto CCBMG — ver [docs/architecture/](docs/architecture/)
para as decisões técnicas detalhadas (por que sem sistema de include, como
o Firebase é compartilhado, como formulários serão resolvidos, etc.).

```
Visitante → Portal Associativo (marketing, SEO, planos, contato)
                  │
                  └── "Login Master" → redireciona para
                      clubedocavalobonfim.com.br/login_master.html
```

---

## Estrutura de pastas

```
portal-associativo/
├── assets/
│   ├── images/
│   │   ├── brand/          # logo, og-cover — a definir (docs/brand-system)
│   │   ├── icons/          # favicon.svg
│   │   └── illustrations/  # ilustrações da landing (a definir)
│   └── fonts/               # fontes customizadas (hoje herda a font-stack do sistema/Bootstrap)
├── components/               # referência de markup reutilizável — PLACEHOLDERS,
│   ├── layout/                # ainda sem conteúdo definitivo (ver docs/architecture
│   ├── navigation/             # sobre por que não são "incluídos" via JS)
│   ├── sections/
│   ├── cards/
│   └── forms/
├── css/
│   ├── design-system.css     # ponto de entrada — importa os 4 abaixo
│   ├── variables.css         # tokens (cor, espaçamento, raio, sombra, z-index)
│   ├── typography.css
│   ├── components.css        # átomos do DS (.ds-card, .ds-badge, .ds-alert…)
│   ├── landing.css           # estilos específicos da landing page
│   ├── utilities.css
│   ├── bootstrap.min.css     # vendorizado (Bootstrap 5.3.3)
├── js/
│   ├── app.js                 # bootstrap de cada página
│   ├── components.js          # loader de fragmentos HTML não críticos (fetch)
│   ├── firebase.js            # SDK do Firebase compartilhado — preparado, não usado ainda
│   ├── utils.js                # helpers puros
│   └── bootstrap.bundle.min.js
├── pages/                    # páginas internas (login, contato, demonstração…)
├── docs/                     # documentação interna (brand, DS, arquitetura, UX/UI, roadmap…)
├── index.html                 # home — precisa ficar na raiz (requisito do GitHub Pages)
├── robots.txt / sitemap.xml / manifest.webmanifest
└── README.md
```

---

## Tecnologias

Exatamente as mesmas do projeto CCBMG — por decisão de arquitetura, não por
limitação:

- HTML5 + CSS3 + Bootstrap 5.3 (vendorizado, sem CDN para o core)
- JavaScript vanilla, ES Modules, `async/await`
- Firebase SDK (via CDN modular) — mesmo projeto Firebase do CCBMG, preparado
  para uso futuro (Painel Master, Fase 5)
- Bootstrap Icons via CDN

**Sem** React/Vue/Angular/Next/Nuxt/Vite/TypeScript, sem build, sem
compilação, sem Node em produção, sem dependências de pacote — compatível
com GitHub Pages "puro".

---

## Como publicar

O repositório é servido diretamente pelo GitHub Pages a partir da branch de
produção (raiz). Não há passo de build:

1. Configurar o domínio (custom domain) nas configurações do repositório no
   GitHub Pages quando o domínio definitivo for decidido (hoje as URLs
   absolutas usam o placeholder `portalassociativo.com.br` — ver
   [docs/seo/](docs/seo/)).
2. Fazer `git push` — o GitHub Pages publica automaticamente.

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
(`utils.js` = funções puras, `components.js` = infraestrutura de
carregamento, `app.js` = orquestração por página), sem frameworks, sem
classes desnecessárias — funções exportadas individualmente.

**Componentes (`components/`):** cada arquivo é markup de referência com um
cabeçalho de comentário explicando status, propósito e convenções — ver
qualquer arquivo em `components/` como exemplo do padrão a seguir.

**Estrutura:** uma página HTML = um arquivo autocontido (navbar/footer
inline, como no CCBMG) para conteúdo crítico de SEO/primeira renderização —
ver justificativa em [docs/architecture/](docs/architecture/).

---

## Roadmap

Ver [docs/roadmap/](docs/roadmap/) para o detalhamento por fase.

| Fase | Escopo |
|---|---|
| 1 | Fundação (este commit): estrutura, Design System, landing estrutural |
| 2 | Conteúdo definitivo: copy, marca, formulários funcionais |
| 3 | Páginas de segmento/marketplace, se fizer sentido publicamente |
| 4 | Divulgação do aplicativo |
| 5 | Painel Master migra para este domínio/repositório |
| 6 | Páginas institucionais sobre IA e automações da plataforma |

---

## Licença

Ver [LICENSE](LICENSE).
