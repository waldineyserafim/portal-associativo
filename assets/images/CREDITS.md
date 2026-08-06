# Créditos e licenças — fotografia

Todas as fotos abaixo são licenciadas sob a [Unsplash License](https://unsplash.com/license)
ou a [licença da Pexels](https://www.pexels.com/license/) — ambas de uso
livre, inclusive comercial, sem exigir atribuição. Os créditos ficam
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
| `hero/hero-comunidade-*` | [pexels.com/photo/16934845](https://www.pexels.com/photo/people-at-a-social-gathering-in-a-park-16934845/) | Samuel Peter ([@newmanphotographs](https://www.pexels.com/@newmanphotographs)) — licença Pexels, uso comercial livre | (sem uso desde a promoção da nova Home em ago/2026 — mantida no repositório para reuso editorial) |
| `hero/hero-diretoria-*` | [pexels.com/photo/3753009](https://www.pexels.com/photo/elderly-people-sitting-at-table-with-laptop-3753009/) | Andrea Piacquadio ([@olly](https://www.pexels.com/@olly/)) — licença Pexels, uso comercial livre | `index.html` — Hero (Home oficial desde ago/2026): diretoria madura reunida em volta de um notebook, parede terracota, luz natural — personas reais 50+ (Creative Direction §4.1) usando tecnologia com naturalidade. Contraste do texto sobreposto verificado por cálculo sobre os pixels (ver `css/landing-nova.css`) |
| `sections/respiro-comunidade-*` | [unsplash.com/photos/MVT0Nz9YClY](https://unsplash.com/photos/MVT0Nz9YClY) | Arthur Hickinbotham ([@arthurhick](https://unsplash.com/@arthurhick)) | `index.html` — seção de respiro editorial |
| `community/segmento-equestre-card.*` | [unsplash.com/photos/T0kXMgwCpck](https://unsplash.com/photos/T0kXMgwCpck) | Oleksii Rozanov ([@rozanovz](https://unsplash.com/@rozanovz)) | `index.html` + `pages/segmentos.html` — card "Clubes equestres e associações rurais" |
| `community/segmento-recreativo-card.*` | [unsplash.com/photos/XlkgzIEzpJQ](https://unsplash.com/photos/XlkgzIEzpJQ) | Aiden Craver ([@slaiden](https://unsplash.com/@slaiden)) | `index.html` + `pages/segmentos.html` — card "Clubes recreativos e sociais" |
| `community/segmento-classe-card.*` | [unsplash.com/photos/bxiOjnbjRM0](https://unsplash.com/photos/bxiOjnbjRM0) | Small Group Network — recortada para excluir crachá de evento e tag de roupa legíveis no enquadramento original (ver 2ª rodada abaixo) | `index.html` + `pages/segmentos.html` — card "Entidades de classe" |
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

### 2ª rodada — Design Review do Hero (troca completa)

O Hero original (foto de festa junina de rua) foi identificado, nesta
revisão, como o problema central da Home: lia como registro de evento, sem
pessoa claramente identificável em foco, e competia visualmente com o
título mesmo com scrim escuro por trás do texto. Foi completamente
substituído — critério de curadoria desta rodada, incluindo achados que
descartaram candidatos fortes na aparência mas problemáticos em resolução
real:

- Fotos de eventos/conferência com crachá de identificação legível (nome
  da pessoa + nome do evento) — encontrado repetidamente no acervo de um
  mesmo fotógrafo de retiro religioso ("Small Group Network"); mesmo
  quando a cena em si era genuína e calorosa, o crachá lido de perto
  identifica um evento de terceiro real, o que a Home não pode carregar.
  Isso também obrigou recortar `segmento-classe-card` (mesmo fotógrafo,
  mesmo problema) para excluir o crachá e uma etiqueta "Patagonia" visível
  na roupa, mantendo só as duas pessoas em conversa.
- Foto de "reunião comunitária" com bandeira de campanha política real
  ("GIRMAY") e máscaras de pandemia visíveis ao fundo — audiência sentada
  olhando para frente também não comunica "pessoas interagindo
  naturalmente", e sim "plateia de palestra".
- Fotos de grupo jovem em pose de ensaio/estilo "influencer" (círculo
  visto de baixo, gesto de "paz e amor" para câmera, logo de marca de
  streetwear na roupa) — exatamente o "elenco homogêneo jovem e urbano"
  que o Creative Direction §4.1 pede para nunca usar como padrão único.
- Foto de confraternização comunitária com embalagens de marca (Kirkland,
  Reynolds, Breyers) visíveis na mesa — mantida, mas recortada para
  excluir completamente a mesa e qualquer embalagem, preservando só o
  grupo em conversa/risada sob as árvores.

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
