# Brand System — Portal Associativo

A identidade de marca do produto institucional está **definida e consolidada em arquivo** — não é mais placeholder. Este diretório reúne os quatro documentos-fonte, nesta ordem de autoridade:

1. [`BRAND_DESIGN_SYSTEM.md`](BRAND_DESIGN_SYSTEM.md) — propósito, personas, princípios de UX, linguagem, cor, tipografia, componentes, acessibilidade.
2. [`CREATIVE_DIRECTION.md`](CREATIVE_DIRECTION.md) — visão criativa, mood board, direção de fotografia/ilustração/ícone/motion, benchmark visual, 105 anti-patterns.
3. [`VISUAL_IDENTITY.md`](VISUAL_IDENTITY.md) — processo de exploração (8 conceitos → 3 finalistas → símbolo vencedor "Medalha-Portal"), especificação geométrica completa e mini brand book.
4. [`EXPERIENCE_ARCHITECTURE.md`](EXPERIENCE_ARCHITECTURE.md) — arquitetura de informação, jornadas, navegação e design tokens aplicados à experiência do produto.

Os ativos físicos (SVG/PNG/PDF) que implementam essas decisões vivem em [`../../assets/images/brand/`](../../assets/images/brand/README.md) (favicon e ícones de app em [`../../assets/images/icons/`](../../assets/images/icons/)).

## Paleta oficial (valores finais)

| Token | Hex | Uso |
|---|---|---|
| Tinta | `#211D18` | Texto, símbolo em fundo claro |
| Terracota | `#A85A34` | Ícone de app, favicon, avatar |
| Terracota profundo | `#7C4326` | Fundos escuros com acento de marca |
| Off-white (paper) | `#F5F0E6` | Fundo padrão |

Ver `BRAND_DESIGN_SYSTEM.md` §6.1 e `VISUAL_IDENTITY.md` §4.2–4.7 para o racional completo.

## Estado das pendências originais deste documento

- [x] Logo (SVG) → `assets/images/brand/` — símbolo "Medalha-Portal" com lockups horizontal/vertical, positivo/negativo/mono/outline.
- [x] Tipografia definitiva → sans-serif humanista (system font stack), ver `BRAND_DESIGN_SYSTEM.md` §6.2.
- [x] Tom de voz e diretrizes de copy → `BRAND_DESIGN_SYSTEM.md` §5.
- [x] Favicon/OG image definitivos → `assets/images/icons/favicon.svg` (substituiu o placeholder "PA") + `assets/images/brand/og-cover.png`.
- [x] `css/variables.css`/`css/components.css` portados para a paleta oficial (`--brand:#A85A34`, `--brand-dark:#7C4326`, `--surface-alt:#F5F0E6`, `--ink:#211D18`) e cores semânticas (`--success`/`--warning`/`--danger`) trocadas do genérico Tailwind para os tons desaturados terrosos definidos em `BRAND_DESIGN_SYSTEM.md` §6.1. O antigo `--accent` dourado (`#d4a72c`) foi removido: `BRAND_DESIGN_SYSTEM.md` §6.1 reserva "acento secundário" como slot **white-label por tenant** — o site institucional é a marca-mãe, sem tenant, então não usa uma cor de destaque própria fora da paleta oficial. `theme_color`/`meta theme-color` também atualizados.
