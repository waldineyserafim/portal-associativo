# Créditos e licenças — fotografia

Todas as fotos abaixo são licenciadas sob a [Unsplash License](https://unsplash.com/license)
— uso livre, inclusive comercial, sem exigir atribuição. Os créditos ficam
registrados aqui mesmo assim, por boa prática e para rastreabilidade.

**Por que fotografia de banco de imagens, e não fotografia própria**: os
documentos-fonte (`docs/brand-system/CREATIVE_DIRECTION.md` §4.9) definem
fotografia própria/comissionada de uma associação-cliente real como
prioridade máxima. Hoje isso não está disponível com uso autorizado para
este site institucional (ver `docs/roadmap/README.md`) — banco de imagens
editorial, com curadoria manual e critério rígido de autenticidade, é o
fallback explicitamente prescrito pelo mesmo documento, usado aqui como tal.
**Toda imagem abaixo está organizada para ser trocada por fotografia real no
futuro sem alterar layout, corte ou tratamento** — mesmo nome de arquivo,
mesmo aspect ratio, mesma pasta.

| Arquivo | Foto original | Fotógrafo(a) | Usada em |
|---|---|---|---|
| `hero/hero-comunidade-*` | [unsplash.com/photos/HeI4wIZLUsk](https://unsplash.com/photos/HeI4wIZLUsk) | Toledo Fotografia ([@toledofotografia_](https://unsplash.com/@toledofotografia_)) — São Paulo, Brasil | `index.html` — Hero |
| `sections/respiro-comunidade-*` | [unsplash.com/photos/MVT0Nz9YClY](https://unsplash.com/photos/MVT0Nz9YClY) | Arthur Hickinbotham ([@arthurhick](https://unsplash.com/@arthurhick)) | `index.html` — seção de respiro editorial, entre Funcionalidades e Segmentos |
| `community/segmento-equestre-card.*` | [unsplash.com/photos/T0kXMgwCpck](https://unsplash.com/photos/T0kXMgwCpck) | Oleksii Rozanov ([@rozanovz](https://unsplash.com/@rozanovz)) | `index.html` + `pages/segmentos.html` — card "Clubes equestres e associações rurais" |
| `community/segmento-recreativo-card.*` | [unsplash.com/photos/XlkgzIEzpJQ](https://unsplash.com/photos/XlkgzIEzpJQ) | Aiden Craver ([@slaiden](https://unsplash.com/@slaiden)) | `index.html` + `pages/segmentos.html` — card "Clubes recreativos e sociais" |
| `community/segmento-classe-card.*` | [unsplash.com/photos/bxiOjnbjRM0](https://unsplash.com/photos/bxiOjnbjRM0) | Small Group Network | `index.html` + `pages/segmentos.html` — card "Entidades de classe" |
| `community/segmento-bairro-card.*` | [unsplash.com/photos/c9xGzxR8ego](https://unsplash.com/photos/c9xGzxR8ego) | Haberdoedas | `index.html` + `pages/segmentos.html` — card "Associações de bairro e comunitárias" |

## Critério de curadoria aplicado

Cada foto foi avaliada contra `docs/brand-system/CREATIVE_DIRECTION.md` §3-4
antes de ser baixada — descartadas nesta rodada, e por quê:

- Fotos com texto/logotipo de terceiro legível no quadro (ex.: uma opção
  para a seção de respiro mostrava letreiros de lojas de calçado ao fundo)
  — risco de marca alheia aparecendo na nossa Landing, descartada mesmo
  depois de selecionada, ao ser vista em resolução real.
- Fotos com pessoas em pose de ensaio fotográfico combinando roupa (ex.:
  família toda de branco, still de books) — cai exatamente no anti-pattern
  "imagens excessivamente produzidas" (Creative Direction §3.12).
- Fotos genéricas de "equipe sorrindo pro tablet"/aperto de mão/escritório
  — vetadas explicitamente pelo briefing e pelo Creative Direction §4.8.
- Fotos Unsplash+ (pagas) — descartadas mesmo quando visualmente boas, por
  não serem gratuitas.

## Tratamento visual aplicado

Todas as fotos passam pelo mesmo tratamento programático antes de entrar no
projeto (script usado nesta rodada, não versionado — resultado é o que está
em `assets/images/`): leve dessaturação (−14%), leve aumento de contraste
(+6%) e uma sobreposição de 6% na cor `--brand-dark` (`#7C4326`). O
objetivo é unificar fotos de fontes/fotógrafos/luzes diferentes num único
"tom" — Creative Direction §3.1 ("tons levemente dessaturados, como se
tivessem sido expostos ao sol") e o requisito desta rodada de que todas as
fotos pareçam parte do mesmo sistema visual.

## Pendência

Ver `docs/roadmap/README.md` — trocar por fotografia própria/comissionada
de associações-clientes reais é item de roadmap, não decisão final.
