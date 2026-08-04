# Portal Associativo — Brand Assets Package

> **Esta pasta é a fonte oficial da identidade visual do Portal Associativo.**
> Nenhuma parte da marca existe apenas como Artifact do Claude — tudo aqui é
> arquivo físico, versionado no repositório, utilizável por qualquer pessoa ou
> ferramenta sem depender desta conversa ou de qualquer IA.
>
> **Documentos de referência (nesta ordem de autoridade):**
> 1. [`docs/brand-system/BRAND_DESIGN_SYSTEM.md`](../../../docs/brand-system/BRAND_DESIGN_SYSTEM.md) — filosofia, cor, tipografia, princípios
> 2. [`docs/brand-system/CREATIVE_DIRECTION.md`](../../../docs/brand-system/CREATIVE_DIRECTION.md) — direção criativa, mood board, benchmark
> 3. [`docs/brand-system/VISUAL_IDENTITY.md`](../../../docs/brand-system/VISUAL_IDENTITY.md) — processo de exploração e especificação completa da marca
> 4. Este arquivo — como usar os arquivos fisicamente presentes nesta pasta

---

## O símbolo

A marca é a **Medalha-Portal**: um anel espesso interrompido por uma abertura de
40° na base — círculo de comunidade + porta de entrada. Nunca gire, distorça ou
preencha a abertura. Construção geométrica completa em
[`logo/construction-grid.svg`](logo/construction-grid.svg).

**Paleta oficial (valores finais, ver `docs/brand-system/VISUAL_IDENTITY.md` §4.2–4.7):**

| Token | Hex | Uso |
|---|---|---|
| Tinta | `#211D18` | Texto, símbolo em fundo claro, contexto dentro do produto |
| Terracota | `#A85A34` | Ícone de app, favicon, avatar — contextos que competem por atenção |
| Terracota profundo | `#7C4326` | Fundos escuros com acento de marca |
| Off-white (paper) | `#F5F0E6` | Fundo padrão, símbolo em fundo escuro |
| Branco puro | `#FFFFFF` | Apenas em `logo-white.svg` / knockout sobre substrato colorido |
| Preto puro | `#000000` | Apenas nas versões monocromáticas de 1 cor |

---

## Estrutura da pasta

```
assets/images/
├── icons/                      ← favicon, ícone de app, PWA, launcher (pasta já existente do projeto)
│   ├── favicon.svg / favicon-16…128.png
│   ├── app-icon-192…1024.png
│   ├── apple-touch-icon.png
│   └── android-maskable.png
└── brand/
    ├── README.md                  ← este arquivo
    ├── logo/                      ← lockups completos (símbolo + wordmark)
    ├── symbol/                    ← símbolo isolado, sem texto
    ├── social/                    ← avatares e banner de redes sociais
    ├── print/                     ← versões para produção gráfica
    ├── presentations/             ← PNGs transparentes para slides/documentos
    ├── exports/                   ← pacote plano (svg/png/pdf) para handoff externo
    └── tools/                     ← scripts que regeneram os PNGs/PDFs a partir dos SVGs
```

> Os arquivos de ícone (favicon/app-icon/PWA) vivem em `assets/images/icons/` — uma
> pasta que já existia no projeto antes deste pacote de marca, referenciada por
> `manifest.webmanifest` e por todas as páginas HTML. Mantê-la no lugar evita
> quebrar esses vínculos; todo o resto da identidade visual vive em
> `assets/images/brand/`.

---

## Quando usar cada versão

| Arquivo | Quando usar | Quando NÃO usar |
|---|---|---|
| `logo/logo.svg` | Ponto de entrada padrão — "me dê o logo" | Espaços com menos de 120px de largura (use `symbol/symbol.svg`) |
| `logo/logo-horizontal.svg` | Cabeçalhos, rodapés, assinaturas de e-mail, landing page | Formatos quadrados/verticais estreitos |
| `logo/logo-vertical.svg` | Selo, post quadrado de rede social, capa de documento em retrato | Cabeçalhos horizontais largos (fica desproporcional) |
| `logo/logo-positive.svg` | Fundo claro, sem suporte a `currentColor` (PowerPoint, Word, e-mail) | Fundo escuro |
| `logo/logo-negative.svg` | Fundo escuro (tinta, terracota profundo, foto escura) | Fundo claro (ilegível) |
| `logo/logo-monochrome.svg` | Reprodução restrita a 1 cor (carimbo, fax, jurídico P&B) | Qualquer contexto colorido — não é a versão "padrão em preto" |
| `logo/logo-outline.svg` | Gravação a laser, corte de vinil, bordado ponto único | Tela digital comum (use as versões preenchidas) |
| `symbol/symbol.svg` | Ícone isolado em contexto com CSS (`currentColor`) | Quando o wordmark precisa aparecer |
| `symbol/symbol-positive.svg` / `-negative.svg` / `-monochrome.svg` | Mesma lógica das versões de logo, mas sem texto | — |
| `../icons/favicon.svg` + `favicon-*.png` | `<link rel="icon">` do site | Ícone de aplicativo (use `app-icon-*`) |
| `../icons/app-icon-*.png` | Submissão em loja de app (iOS/Android), ícone de PWA | Favicon de navegador |
| `../icons/apple-touch-icon.png` | `<link rel="apple-touch-icon">` — atalho salvo na tela iOS | Ícone de app nativo (App Store usa `app-icon-1024.png`) |
| `../icons/android-maskable.png` | `maskable` no `manifest.json` do PWA | Ícone comum não-adaptável |
| `social/avatar-*.png` | Foto de perfil da respectiva rede | Banner/capa |
| `social/banner-linkedin.png` | Capa da página da empresa no LinkedIn | Avatar |
| `print/logo-cmyk.svg` | Ponto de partida para pré-impressão (gráfica converte para CMYK calibrado) | Impressão doméstica comum (use `logo-positive.svg`) |
| `print/logo-black.svg` / `logo-white.svg` | Impressão de 1 cor sobre substrato claro/escuro | Impressão colorida padrão |
| `presentations/logo-png-transparent.png` | Slide claro (Google Slides, Keynote, PowerPoint) | Slide escuro (use `logo-white-transparent.png`) |
| `presentations/logo-white-transparent.png` | Slide escuro, vídeo, apresentação com fundo de foto | Slide claro (fica invisível) |
| `exports/` | Handoff para fornecedor externo (gráfica, agência, marketplace de merchandising) que não deve navegar pela estrutura completa do repositório | Uso interno do produto — dentro do código, sempre aponte para `logo/`, `symbol/` ou `../icons/` diretamente |

### Por contexto de aplicação

| Contexto | Arquivo recomendado |
|---|---|
| **Web** (header do site) | `logo/logo-horizontal.svg` (cor via CSS `currentColor`) |
| **Mobile** (dentro do app) | `symbol/symbol.svg` no topo de tela; `logo/logo-horizontal.svg` em telas de login/splash |
| **Favicon** | `../icons/favicon.svg` com fallback `../icons/favicon-32.png` |
| **PWA** (`manifest.json`) | `../icons/app-icon-192.png`, `../icons/app-icon-512.png` como ícones padrão + `../icons/android-maskable.png` com `"purpose": "maskable"` |
| **iOS (App Store / atalho de tela)** | `../icons/app-icon-1024.png` (submissão) · `../icons/apple-touch-icon.png` (atalho Safari) |
| **Android (Play Store / launcher)** | `../icons/app-icon-512.png` (submissão) · `../icons/android-maskable.png` (ícone adaptável) |
| **Redes sociais** | `social/avatar-*.png` específico da rede + `social/banner-linkedin.png` |
| **Impressão** | `print/logo-cmyk.svg` (produção gráfica) · `print/logo-black.svg` / `print/logo-white.svg` (1 cor) |
| **Camisetas / bonés (silk-screen ou vinil)** | `print/logo-black.svg` ou `print/logo-white.svg`, conforme a cor do tecido — nunca a versão colorida em telas de 1 cor |
| **Bordado** | `logo/logo-outline.svg` (ponto único/running stitch) — para bordado preenchido tradicional, forneça `symbol/symbol-positive.svg` ao ateliê como referência de forma fechada |
| **Documentos** (contratos, estatuto, ofícios) | `logo/logo-positive.svg` no cabeçalho; `print/logo-black.svg` se o documento for impresso em P&B |
| **Assinatura de e-mail** | `logo/logo-horizontal.svg` (clientes de e-mail modernos) ou `presentations/logo-png-transparent.png` (clientes sem suporte a SVG) |

---

## Regras que nunca mudam (ver `docs/brand-system/VISUAL_IDENTITY.md` §4.10–4.15)

- **Área de proteção**: respiro mínimo ao redor da marca = espessura do próprio traço do anel (16 unidades da grade de 100×100 — ver `logo/clear-space.svg`). Nenhum elemento pode invadir esse espaço.
- **Tamanho mínimo**: símbolo isolado nunca abaixo de 16px digital / 8mm impresso. Lockup horizontal completo nunca abaixo de 120px digital / 30mm impresso — abaixo disso, use apenas o símbolo.
- **Contraste**: todo par cor do símbolo / cor de fundo deve atingir no mínimo WCAG AA (4.5:1) — ver `docs/brand-system/BRAND_DESIGN_SYSTEM.md` §12. Nunca aplicar a marca sobre fundo fotográfico sem uma área sólida de contraste atrás dela.
- **Fundos permitidos**: off-white `#F5F0E6`, branco puro, tinta `#211D18`, terracota profundo `#7C4326`, fotografia com overlay sólido garantindo contraste.
- **Fundos proibidos**: gradientes, texturas decorativas, fotografia sem overlay de contraste, qualquer cor fora da paleta oficial, padrões (xadrez, listras, ruído).
- **Versões oficiais**: apenas os arquivos desta pasta. Nenhuma cópia recolorida, redesenhada ou "ajustada visualmente" fora deste sistema é uma versão oficial da marca.

### Usos incorretos (ver render visual em `docs/brand-system/VISUAL_IDENTITY.md` e no artifact de exploração)

1. Esticar/distorcer a proporção do símbolo.
2. Preencher a abertura do anel manualmente (a única exceção é o fallback automático de tamanhos ≤20px, ver graceful degradation abaixo).
3. Rotacionar o símbolo — a abertura fica sempre voltada para baixo.
4. Aplicar gradiente, sombra projetada, brilho ou efeito 3D.
5. Usar cor fora da paleta oficial.
6. Colocar a marca sobre fundo sem contraste suficiente.
7. Recriar o wordmark com fonte de sistema genérica em vez da tipografia oficial.
8. Usar o lockup vertical em espaço horizontal amplo (ou vice-versa) por conveniência de layout.
9. Adicionar contorno/stroke extra ao redor do símbolo já construído.
10. Combinar o símbolo com ícones de terceiros dentro da própria área de proteção.

---

## Graceful degradation (símbolo → ícone → disco)

```
Logo completa (símbolo + wordmark) ......... ≥ 120px digital / 30mm impresso
        ↓
Símbolo isolado (anel com abertura) ........ 20px – 119px digital / 8mm – 29mm impresso
        ↓
Disco sólido (fallback automático) ......... < 20px digital (favicon 16px, ícone de notificação)
```

O fallback de disco sólido já está pré-gerado em `../icons/favicon-16.png` — não é
erro de reprodução, é o comportamento correto definido em
`docs/brand-system/VISUAL_IDENTITY.md` §4.12. Nenhum arquivo abaixo de 16px deve ser criado
manualmente preenchendo a abertura "na mão" — sempre gere a partir do script
(ver abaixo) para manter a proporção do disco idêntica ao anel que ele substitui.

---

## Como os arquivos foram gerados (e como regenerá-los)

Todo `.svg` desta pasta foi desenhado à mão a partir da geometria paramétrica
definida em `docs/brand-system/VISUAL_IDENTITY.md` §4.2 (raio, centro, ângulo do vão,
espessura de traço) — são a fonte de verdade vetorial.

Todo `.png` e `.pdf` foi **gerado a partir dessa mesma geometria**, não
desenhado separadamente, para eliminar qualquer risco de divergência entre
versões. Os scripts ficam em `tools/` e podem ser reexecutados por qualquer
pessoa, a qualquer momento, sem depender de nenhuma ferramenta de IA:

```bash
pip install Pillow svglib reportlab lxml

python3 assets/images/brand/tools/render_assets.py   # gera todos os PNG (favicons/app-icons em ../icons/)
python3 assets/images/brand/tools/export_pdf.py      # gera os PDF vetoriais em exports/pdf/
```

**Nota técnica sobre transparência (leia antes de gerar novos ícones):**
o briefing original pedia "todo PNG com fundo transparente" — isso foi seguido
à risca em `favicon-*.png`, `presentations/*-transparent.png` e nos símbolos
soltos em `exports/png/`. Mas foi **deliberadamente não seguido** em
`app-icon-*.png`, `apple-touch-icon.png`, `android-maskable.png` e nos
`social/avatar-*.png`: a Apple App Store **rejeita** ícones de 1024px com
canal alfa (exige opacidade total), o ícone `maskable` do PWA precisa de fundo
sólido até a borda por especificação (W3C), e avatares de rede social
renderizam de forma imprevisível sobre transparência dependendo do tema do
app de cada usuário. Esses arquivos são opacos por serem tecnicamente
corretos, não por engano — ver `tools/render_assets.py`, comentário acima da
geração de cada grupo, para o detalhe de cada decisão.

**Nota sobre o wordmark em SVG**: o texto "Portal associativo" nos arquivos de
`logo/` é `<text>` vivo (editável), não contorno vetorizado — depende da fonte
declarada estar instalada em quem visualiza. Antes de enviar qualquer arquivo
de `logo/` a um fornecedor de impressão/bordado/merchandising, converta o
texto em contornos (Illustrator/Figma → *Create Outlines* / *Flatten*) usando
a tipografia oficial de `docs/brand-system/BRAND_DESIGN_SYSTEM.md` §6.2. Os arquivos em
`symbol/` não têm esse problema — são 100% geometria, sem texto.

---

## Checklist de utilização

Antes de aplicar a marca em qualquer novo material, confirme:

- [ ] Estou usando um arquivo desta pasta — não recriei o símbolo à mão
- [ ] Escolhi a versão de cor correta para o fundo (positiva / negativa / monocromática)
- [ ] Respeitei a área de proteção mínima ao redor da marca
- [ ] O tamanho final está acima do mínimo definido para o meio (digital ou impresso)
- [ ] O contraste entre marca e fundo atinge WCAG AA
- [ ] Não apliquei nenhum efeito (sombra, gradiente, 3D, contorno extra)
- [ ] Não girei nem distorci o símbolo
- [ ] Se o texto do wordmark precisa ir para impressão/bordado, já converti para contorno
- [ ] Verifiquei este README para o contexto específico (favicon, PWA, rede social, impressão) antes de escolher o arquivo
