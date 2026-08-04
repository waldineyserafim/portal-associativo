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
2. **Carregar fragmentos via `fetch()` em runtime** (`js/components.js`,
   já implementado neste projeto).

**Decisão:** para conteúdo crítico de SEO/primeira renderização (navbar,
footer, hero da landing), o HTML fica **inline em cada página** — igual ao
CCBMG. Fragmentos carregados via `fetch()` atrasam a pintura inicial, podem
gerar layout shift e são um risco (ainda que pequeno) para crawlers que não
executam JS. `js/components.js` continua disponível para fragmentos **não
críticos** (ex.: modais, blocos opcionais) onde esse custo não importa.

Isso é uma pequena divergência da lista de exemplo do briefing original
(que sugeria os componentes de `components/` sendo "carregados"), mas evita
comprometer o principal objetivo de negócio deste produto — SEO — por uma
conveniência de DX. Os arquivos em `components/*.html` continuam existindo
como referência de markup a ser copiado para as páginas.

## Formulários (contato / demonstração)

Sem backend próprio neste projeto (por definição do escopo). **Decisão adotada
nesta fase**: `js/forms.js` monta um link `mailto:` com os dados do formulário
já preenchidos no corpo da mensagem e abre o cliente de e-mail do usuário —
funciona 100% estático, sem depender de serviço de terceiro (Formspree/
Web3Forms) nem de Cloud Function própria. O endereço de destino
(`contato@portalassociativo.com.br`, constante `DEST_EMAIL` em `js/forms.js`)
é um placeholder de domínio — **precisa apontar para uma caixa real antes da
publicação**.

Se o volume de leads justificar substituir esse fluxo por um serviço de
formulário de terceiros ou por uma Cloud Function própria no futuro, a troca
fica isolada em `js/forms.js` — os formulários em si (`pages/contato.html`,
`pages/demonstracao.html`) não precisam mudar de estrutura.

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
