# Portal Associativo — Creative Direction

> **Documento-fonte oficial:** [`BRAND_DESIGN_SYSTEM.md`](BRAND_DESIGN_SYSTEM.md) — toda decisão deste documento deriva exclusivamente dos princípios ali fixados (essência da marca, arquétipos, personas, princípios de UX, linguagem, estratégia visual). Nada aqui contradiz aquele documento; este documento aprofunda a camada **criativa** (sensação, forma, imagem, movimento) que o documento-fonte deixou intencionalmente em nível de princípio.
> **Checagem de consistência**: revisão completa do documento-fonte não encontrou nenhuma inconsistência a resolver antes de avançar. Este documento herda, sem alteração: o arquétipo duplo Cuidador + Companheiro (seção 1.8 do documento-fonte), a direção de cor terracota/tinta/off-white fugindo do azul corporativo genérico (seção 6.1), a regra de fotografia real como sinal de confiança (seção 6.4, inspirada em Airbnb), a regra de ilustração comedida e nunca-infantilizada (seção 6.5), o grid de 8px (seção 6.6), os 12 princípios de UX (seção 4) e as cinco personas (seção 3). Onde este documento propõe algo novo, ele cita explicitamente de qual princípio-fonte deriva.
> **Uso**: qualquer designer ou IA deve conseguir produzir logo, landing page, ilustrações, ícones, animações, telas de produto e materiais institucionais consistentes usando apenas este documento + o documento-fonte — sem precisar adivinhar intenção.

---

## Sumário

1. [Creative Vision](#1-creative-vision)
2. [Creative Manifesto](#2-creative-manifesto)
3. [Mood Board Conceitual](#3-mood-board-conceitual)
4. [Direção Fotográfica](#4-direção-fotográfica)
5. [Direção de Ilustração](#5-direção-de-ilustração)
6. [Direção dos Ícones](#6-direção-dos-ícones)
7. [Motion Design](#7-motion-design)
8. [Espaços em Branco](#8-espaços-em-branco)
9. [Composição](#9-composição)
10. [Grid](#10-grid)
11. [Linguagem Visual](#11-linguagem-visual)
12. [Landing Page](#12-landing-page)
13. [Sistema](#13-sistema)
14. [White Label](#14-white-label)
15. [Benchmark Visual](#15-benchmark-visual)
16. [Anti-Patterns — O que nunca devemos fazer](#16-anti-patterns--o-que-nunca-devemos-fazer)
17. [Visual Language Checklist](#17-visual-language-checklist)
18. [Design Review Checklist](#18-design-review-checklist)
19. [Creative Principles](#19-creative-principles)
20. [Próximos Passos](#20-próximos-passos)

---

## 1. Creative Vision

### 1.1 A visão em uma frase

O Portal Associativo deve parecer que foi desenhado por gente que entende profundamente de software **e** profundamente da vida de uma associação do interior — não por uma agência que nunca visitou um clube do cavalo, e não por uma fábrica de SaaS que trata toda organização como "conta genérica de CRM" (o erro estrutural de todo concorrente mapeado no documento-fonte, seção 1.5 e Anexo A).

Isso significa uma coisa muito específica: **o produto precisa parecer sério sem parecer frio, e precisa parecer caloroso sem parecer amador.** É a interseção mais difícil de acertar — e é exatamente onde Apple, Stripe e Airbnb operam (seriedade + calor humano ao mesmo tempo), e onde todo concorrente do setor associativo falha para um lado ou para o outro (ou parece uma planilha do governo, ou parece um clipart de convite de aniversário).

### 1.2 O sentimento que ele transmite

Ao ver qualquer tela do Portal Associativo — landing page, painel do associado, tela administrativa — a pessoa deve sentir, nesta ordem:

1. **"Isso não vai ser difícil."** (primeiro contato, primeiros 3 segundos — reação à composição visual antes mesmo de ler qualquer texto)
2. **"Isso é sério, posso confiar meu dinheiro/dados aqui."** (segundos seguintes — reação à qualidade de acabamento, consistência, ausência de ruído visual)
3. **"Isso parece com a minha associação, não com uma empresa de fora."** (ao longo do uso — reação à presença de identidade cultural real: fotos, nome, cor de acento do clube)
4. **"Minha associação parece mais organizada agora."** (resultado, não primeira impressão — o produto reflete bem de volta sobre a instituição que o usa)

### 1.3 O que nunca queremos transmitir

- **"Isso parece um sistema de banco/governo."** — frieza institucional sem calor humano (o erro do lado oposto ao "amador"; ver seção 3 para o que isso significa visualmente).
- **"Isso parece complicado."** — a reação mais citada nos reviews reais de concorrentes pesquisados no documento-fonte (Anexo A): "cumbersome", "cluttered", "antiquated". É a reação que mais mata adoção num público pouco técnico — o medo, não a indiferença, é a barreira real.
- **"Isso parece uma startup querendo me vender algo."** — tom de hype, urgência artificial, gamificação forçada. Contraria diretamente o arquétipo Cuidador (documento-fonte, 1.8) — um cuidador não vende, ele cuida.
- **"Isso parece genérico, dava pra ser qualquer sistema."** — a queixa estrutural encontrada em praticamente todo concorrente pesquisado (documento-fonte, Anexo A: "dá para trocar o logo de uma pela outra sem o usuário notar diferença").
- **"Isso parece caro/exclusivo, não é pra associação pequena como a minha."** — risco oposto: uma direção visual "premium" mal calibrada (excesso de luxo, tom editorial frio) pode intimidar o público real tanto quanto complexidade técnica.

### 1.4 Fundamento cognitivo desta visão

Esta hierarquia de sentimento não é arbitrária — segue o **efeito estética-usabilidade** (Kurosu & Kashimura, 1995; popularizado por Don Norman): interfaces percebidas como esteticamente agradáveis são julgadas como mais fáceis de usar, *mesmo antes de qualquer interação real* — o julgamento acontece nos primeiros 50 milissegundos de exposição visual (Lindgaard et al., 2006). Isso significa que a primeira impressão visual do Portal Associativo não é "só estética" — ela literalmente determina se um tesoureiro de 60 anos vai se sentir capaz de usar o produto antes mesmo de tentar. É por isso que investimento em direção criativa é, neste produto, investimento direto em adoção — não luxo, não vaidade.

---

## 2. Creative Manifesto

> Toda associação começa com gente que se importa.
>
> Um clube não é feito de planilha. É feito de gente que aparece, que cuida, que continua.
>
> Achamos que a tecnologia que serve essa gente devia se comportar do mesmo jeito: aparecer quando precisa, cuidar sem se impor, continuar funcionando sem pedir atenção.
>
> Por isso, desenhamos para clareza antes de impressionar.
>
> Removemos antes de adicionar.
>
> Explicamos antes de exigir.
>
> Confiança não se anuncia — se demonstra, tela após tela, sem exceção.
>
> Simplicidade não é a ausência de poder. É poder que não pesa nas mãos de quem nunca usou um sistema antes.
>
> Nunca desenhamos para impressionar quem já entende de tecnologia. Desenhamos para a pessoa que tem mais medo de errar.
>
> Se uma decisão de design exige explicação para ser usada, a decisão está errada — não a pessoa.
>
> Uma tela bonita que confunde é uma tela malsucedida. Uma tela simples que emociona é uma tela bem-sucedida.
>
> Nunca vamos parecer que estamos vendendo. Vamos parecer que estamos ajudando.
>
> O espaço vazio também é cuidado. Cada elemento que tiramos da tela é um gesto de respeito por quem vai usá-la.
>
> A cultura de quem usa o produto aparece no produto — não desaparece atrás de um sistema genérico.
>
> Isto vale por igual para a landing page, a tela de pagamento, o ícone menor do menu e o e-mail de cobrança. Nenhuma parte do produto está isenta deste manifesto.

**Como este manifesto deve ser usado**: toda decisão criativa nova — nome de tela, cor de botão, tempo de animação, escolha de foto — deve poder ser defendida por pelo menos uma frase deste manifesto. Se não pode, a decisão precisa ser revista, não o manifesto.

---

## 3. Mood Board Conceitual

*(Descrição verbal apenas — nenhuma imagem gerada, conforme regras deste documento. Esta seção orienta quem for montar o mood board visual real.)*

### 3.1 Cores

Retomando a direção do documento-fonte (seção 6.1): terracota/couro como cor de marca, tinta quase-preta para estrutura, off-white quente para fundo. No mood board conceitual, isso se traduz em referências como: couro de sela envelhecido ao sol (não couro de loja de luxo, brilhante — couro usado, com caráter), terra batida seca de curral ao entardecer, madeira de cocheira desgastada pelo tempo (tom, não textura literal aplicada em tela), o marrom-avermelhado de uma crina ao contraluz. Nunca cores "puras" de tinta industrial — sempre tons levemente dessaturados, como se tivessem sido expostos ao sol por anos. Isso é deliberado: cor saturada demais comunica "produto novo tentando parecer moderno"; cor com leve dessaturação comunica "tradição, permanência, coisa que já existia antes de você chegar" — sensação central para o público do documento-fonte (presidentes/diretores que valorizam a continuidade da instituição, seção 3.1 do documento-fonte).

### 3.2 Formas

Formas geométricas simples com cantos moderadamente arredondados — nunca círculos perfeitos infantilizados, nunca ângulos retos agressivos de "sistema corporativo dos anos 2000". A referência de forma é a ferradura *não* como ícone literal (o documento-fonte proíbe isso explicitamente, seção 6.1) mas como *sensação* de arco — curvas abertas, não fechadas; a forma de um portal, de uma entrada, de um arco de cocheira — reforçando o próprio nome "Portal".

### 3.3 Texturas

Texturas discretas e nunca decorativas: papel levemente encorpado (como um documento institucional impresso com cuidado, não digital genérico), couro fosco (nunca verniz brilhante — brilho excessivo lê como "barato tentando parecer caro"), tecido de sela. Todas essas texturas existem apenas como referência de *humor visual* para fotografia e materiais institucionais impressos — nunca como padrão repetido aplicado a fundos de tela (isso seria ruído visual, contrário ao princípio de espaço em branco da seção 8).

### 3.4 Luz

Luz natural, quase sempre de "hora dourada" (final de tarde, início de manhã) — luz que existe em qualquer propriedade rural brasileira, não luz de estúdio artificial. Contraluz suave em fotografia de pessoas e animais. Nunca luz de neon, nunca luz fria de escritório fluorescente, nunca flash direto e duro (que achata e "estraga" a sensação de calor humano).

### 3.5 Fotografia

Ver seção 4 completa. Como referência de humor: uma foto que parece ter sido tirada por alguém que estava lá — presente, não um fotógrafo profissional produzindo uma campanha publicitária de moda equestre.

### 3.6 Ambientes

Espaços reais de convivência: o alambrado ao entardecer, a arquibancada de uma prova, a sede social do clube num domingo de evento, a secretaria com gente de verdade trabalhando (nunca um "escritório de startup" com mesa de ping-pong e post-its coloridos — isso é o oposto do universo do público-alvo). Ambientes internos do produto (telas) devem *sugerir* esse humor através de cor e fotografia usada, nunca tentando literalmente recriar uma paisagem rural na interface.

### 3.7 Materiais (para peças institucionais físicas/impressas)

Couro, metal escovado fosco (nunca cromado brilhante — cromado lê como "carro novo", não "instituição de tradição"), papel de gramatura alta com acabamento fosco. Nunca plástico brilhante, nunca acrílico transparente "tech".

### 3.8 Arquitetura (como referência de humor, não de UI)

Construções rurais brasileiras bem cuidadas — sede de clube, cocheira organizada, cercas retas e bem mantidas — comunicam "cuidado e organização" sem parecer corporativas. É essa sensação (organização com raiz, não organização estéril) que a interface deve evocar através de alinhamento e grid (seção 10), não através de elementos arquitetônicos literais na tela.

### 3.9 Paisagens

Campo aberto, horizonte baixo, céu ocupando grande parte do quadro — visualmente equivalente ao "espaço em branco generoso" que o documento-fonte pede (seção 6.6): a paisagem rural já é, por natureza, uma composição de muito espaço vazio ao redor de poucos elementos importantes. Essa é a analogia raiz de todo o princípio de whitespace do produto (ver seção 8).

### 3.10 Objetos

Uma carteirinha de couro, uma sela bem cuidada, um chapéu pendurado, uma caneta sobre um caderno de ata — objetos que comunicam "instituição com história", nunca objetos "tech" (laptop brilhante, headset de call center, gráfico 3D flutuante).

### 3.11 Sensações-alvo

Calor, permanência, orgulho discreto (nunca ostentação), acolhimento, competência silenciosa.

### 3.12 O que jamais representa o Portal Associativo

- Escritório de startup (mesa de ping-pong, post-it colorido, óculos de armação grossa).
- Fotografia de banco de imagens genérica de "equipe de negócios sorrindo para gráfico em tablet".
- Estética "fintech neon" (roxo/azul saturado com gradiente, ilustração 3D flutuante de moeda).
- Estética "rodeio de exposição" exagerada (excesso de couro decorado, fivelas douradas grandes, tipografia western cliché tipo faroeste) — isso seria caricatura, não representação real do universo equestre/rural sério.
- Qualquer imagem que pareça gerada por IA de forma perceptível (mãos estranhas, textura "plástica", simetria artificial demais).
- Interface "gamer" (RGB, contraste extremo, tipografia futurista angular).

---

## 4. Direção Fotográfica

Fundamento: documento-fonte, seção 6.4 — "fotografia é a heroína, não decoração" (princípio herdado da Airbnb) e "fotografia real e de qualidade é sinal mensurável de confiança e legitimidade". Isto é psicologia, não gosto: o **efeito de mera exposição a rostos humanos reais** aumenta confiança percebida mais rápido que qualquer texto (Zajonc, 1968; replicado extensivamente em UX de produtos de confiança como marketplaces e fintechs).

### 4.1 Tipos de pessoas

Diversidade real de idade — com representação deliberadamente forte de pessoas 50+ (o público central do produto, não um público secundário tratado como exceção). Gente do interior de Minas Gerais e do Brasil rural em geral: variedade de tons de pele, tipos de corpo, formas de se vestir — nunca um elenco homogêneo de modelos jovens e urbanos, que é o padrão-problema de praticamente todo banco de imagens de tecnologia.

### 4.2 Expressões

Expressões genuínas, levemente contidas — o sorriso real de quem está numa tarde de domingo no clube, não o sorriso de banco de imagens ("teeth smile" produzido para câmera). Concentração e atenção também são expressões válidas e desejadas (alguém conferindo um cavalo, alguém conversando sério na secretaria) — nem toda foto precisa ser "gente feliz olhando pra câmera".

### 4.3 Vestimentas

Roupas reais de dia a dia rural/equestre — nunca traje de desfile ou moda equestre editorial (bota polida de estúdio, roupa branca impecável de campeonato internacional). O objetivo é reconhecimento ("essa pessoa parece com alguém do meu clube"), não aspiração de luxo.

### 4.4 Iluminação

Luz natural sempre que possível (ver seção 3.4) — nunca luz de estúdio dura ou flash direto. Fotografia em ambiente real (evento do clube, campo, secretaria), nunca em cyclorama/fundo infinito de estúdio.

### 4.5 Animais

Cavalos fotografados com o mesmo princípio de autenticidade: em contexto real (curral, prova, cocheira), nunca em pose "editorial de revista de moda equestre" com iluminação artificial excessiva. O animal é parte da vida da comunidade retratada, não o "produto" sendo vendido.

### 4.6 Eventos

Fotografia documental — como se fosse tirada por alguém presente no evento, não uma produção publicitária. Movimento real, ângulos naturais (não necessariamente perfeitamente centralizados), aceitação de imperfeição controlada (uma pessoa de perfil, uma composição levemente assimétrica) — isso é o que diferencia "foto real" de "banco de imagens", e é exatamente o sinal de confiança que a pesquisa do documento-fonte identifica no case Airbnb.

### 4.7 Comunidade

Grupos reais interagindo — nunca pose de "todo mundo olhando pra câmera alinhado". A câmera é testemunha, não diretora da cena.

### 4.8 O que nunca utilizar

- Banco de imagens genérico de "negócios" (aperto de mão, gráfico ascendente, pessoas de terno em sala de reunião de vidro).
- Fotografia com watermark ou aparência claramente de banco de imagens gratuito de baixa qualidade.
- Imagens geradas por IA que pareçam sintéticas quando ampliadas (risco real e crescente — deve ser verificado item por item antes de publicação).
- Filtros de cor artificiais e agressivos (saturação alta, viradas de cor tipo Instagram 2012).
- Fotografia de modelo profissional posando como "associado" de forma obviamente encenada.
- Qualquer imagem com elemento de marca de outro concorrente visível (uniforme, logo).

### 4.9 Banco de imagens aceitável

Fotografia própria e comissionada de associações-cliente reais (prioridade máxima — sempre a primeira escolha), complementada, apenas onde não houver material próprio disponível, por bancos de imagens editoriais/documentais de alta qualidade com filtro rigoroso por autenticidade (não bancos "corporate stock" genéricos) — sempre com curadoria manual, nunca inserção automática por palavra-chave.

### 4.10 Banco de imagens proibido

Qualquer banco de imagens de estética "corporate stock" padrão (os mesmos rostos sorridentes que aparecem em milhares de sites de SaaS — o próprio documento-fonte, Anexo A, identifica esse padrão genérico como falha estrutural do setor inteiro) e qualquer banco especializado em "lifestyle de luxo equestre" (moda, não comunidade).

---

## 5. Direção de Ilustração

Fundamento: documento-fonte, seção 6.5 — uso comedido, monocromático/paleta limitada, reservado a estados vazios e onboarding, nunca decoração de tela funcional, nunca estilo "fofo" que infantilize o produto perante um público adulto/idoso sério.

### 5.1 Estilo adotado

**Outline minimalista com peso único**, leve influência editorial (traço com caráter humano, não geometricamente perfeito e frio) — não geométrico-corporativo puro (que soa "tech genérico"), não orgânico-fluido demais (que soa "app de bem-estar/meditação", território do Headspace/Calm, não do Portal Associativo). O traço deve parecer desenhado por uma mão competente, não gerado por um algoritmo de forma perfeita.

**Por que não flat colorido tipo "Alegria-style"**: o estilo de ilustração flat com personagens coloridos e proporções arredondadas (que ficou onipresente em SaaS entre 2018-2023) é hoje o clichê visual mais reconhecível de "startup genérica" — é exatamente o oposto do objetivo do documento-fonte de nunca parecer "mais um SaaS" (Creative Vision, seção 1.3 deste documento). Evitar por completo.

**Por que não 3D**: ilustração 3D comunica "tech sofisticada/gamer/fintech moderna" — território de Cash App e de produtos voltados a público jovem-urbano. Contraria o arquétipo Cuidador e arrisca intimidar exatamente o público que o produto mais precisa acolher (documento-fonte, seção 3, personas Presidente/Tesoureiro/Secretária).

**Por que não geométrico puro (formas abstratas coloridas)**: comunica "corporativo frio", risco already descartado na seção 6.1 do documento-fonte ao evitar azul genérico.

### 5.2 Paleta de ilustração

Monocromática dentro da cor "tinta" (estrutura) com no máximo um acento em terracota por composição — nunca ilustração multicolorida. Isso mantém a ilustração subordinada ao conteúdo real (dado, foto, texto), nunca competindo visualmente — mesmo princípio "deferência" citado no benchmark da Apple (documento-fonte, Anexo A).

### 5.3 Quando utilizar

- Estados vazios (nenhum evento ainda, nenhuma fatura ainda) — sempre com sugestão de próxima ação ao lado, nunca decorativa isolada.
- Onboarding de nova associação (tenant) no modelo white-label.
- Materiais institucionais e apresentações comerciais, com mais liberdade de composição do que dentro do produto.
- Ícones conceituais em landing page para ilustrar um módulo (ex.: um desenho simples de calendário para "Eventos") — sempre com função explicativa, nunca puramente decorativa.

### 5.4 Quando nunca utilizar

- Dentro de fluxos funcionais ativos (pagamento, cadastro) — nenhuma ilustração decorativa deve competir com uma tarefa que o usuário está tentando completar.
- Como substituto de fotografia real em contextos que pedem prova de confiança (depoimentos, casos de sucesso — aqui a regra é sempre fotografia real, nunca ilustração, ver seção 4).
- Repetida em excesso na mesma tela (mais de uma ilustração por tela é ruído, não comunicação).
- Com expressões humanas exageradas/caricatas — quebra a seriedade que o produto precisa manter para o público adulto (documento-fonte, seção 6.5).

---

## 6. Direção dos Ícones

Fundamento: documento-fonte, seção 6.3 — estilo de linha único e consistente, nunca misturado, sempre acompanhado de texto em contexto de ação.

### 6.1 Família

Um único set de ícones de linha (outline) coerente com o traço da ilustração (seção 5) — nunca combinar sets de fornecedores/estilos diferentes no mesmo produto (erro comum e citado na seção 16, Anti-Patterns).

### 6.2 Peso e espessura

Traço de espessura média-fina, consistente em 100% do set — nem tão fino que desapareça em telas pequenas/pouco contraste (falha de acessibilidade, ver documento-fonte seção 12), nem tão grosso que pareça infantilizado ou "app de criança".

### 6.3 Raio

Cantos com arredondamento discreto e consistente — ecoando o raio de borda definido para botões e cards (documento-fonte, seção 6.7) — nunca ícones com cantos perfeitamente retos ao lado de ícones com cantos muito arredondados no mesmo conjunto.

### 6.4 Detalhamento

Nível médio-baixo de detalhe — reconhecível instantaneamente em tamanho pequeno (16-24px), sem detalhes que só fazem sentido ampliados. Um ícone que precisa ser "decifrado" já falhou como comunicação (ver seção 11, Linguagem Visual).

### 6.5 Quando utilizar

- Reforçando um rótulo de texto (nunca substituindo-o em ações críticas, documento-fonte seção 4, princípio 5 — "sempre linguagem humana").
- Indicadores de status, sempre acompanhados de cor E texto (documento-fonte, seção 6.1 e 12 — nunca cor isolada como portador de significado).
- Navegação (menu, sidebar) onde o rótulo de texto está sempre visível ao lado.

### 6.6 Quando nunca utilizar

- Como único indicador de uma ação importante sem texto de apoio (ambíguo para usuário pouco técnico — falha direta do princípio "nunca depender de treinamento", documento-fonte seção 4).
- Misturado com emoji no mesmo contexto (quebra consistência de peso/estilo instantaneamente).
- Ícones "de sistema operacional" (Material Design, SF Symbols) importados sem adaptação ao traço próprio do produto — cria inconsistência visual sutil mas perceptível.
- Ícones com metáforas obscuras ou específicas demais de cultura tech (ex.: ícone de "nuvem" para sincronização — testar sempre se o público real reconhece o símbolo antes de usar).

---

## 7. Motion Design

Fundamento: documento-fonte, seção 6.8 (curta, com origem espacial, nunca decorativa), seção 4 princípio 11 (motion sempre com propósito informativo), seção 13 (skeleton em vez de spinner, feedback otimista).

### 7.1 Duração

150–250ms para a maioria das transições de UI (abrir modal, trocar de estado de botão); até 400ms para transições de tela inteira. Nunca acima de 400ms para qualquer interação direta do usuário — acima disso, a animação deixa de parecer "resposta" e passa a parecer "atraso" (percepção documentada em pesquisas de performance percebida — a mesma lógica da seção 13 do documento-fonte).

### 7.2 Velocidade e curva de easing

Curvas de aceleração/desaceleração suaves (ease-out para elementos entrando, ease-in para elementos saindo) — nunca linear (parece mecânico/frio) nunca com "bounce"/elástico (parece lúdico demais, território de app infantil ou de entretenimento, não de gestão financeira séria).

### 7.3 Microinterações

Cada microinteração existe para confirmar uma ação ou indicar um estado — nunca para "decorar" o momento. Exemplos aceitáveis: o botão que recebe um leve estado de "pressionado" ao toque (confirma que o toque foi registrado — crítico para usuários que não têm certeza se a tela é ou não é tocável); um campo de formulário que sinaliza sucesso de validação com uma transição sutil de cor de borda.

### 7.4 Loading

Skeleton screens (documento-fonte, seção 7 e 13) como padrão para carregamento de conteúdo real — nunca um spinner genérico isolado sem contexto. Quando um spinner for estritamente necessário (ação pontual, ex. processando pagamento), ele deve vir acompanhado de texto que descreve o que está acontecendo ("Confirmando seu pagamento…") — nunca mudo.

### 7.5 Hover (contextos com mouse/desktop administrativo)

Alteração sutil de estado (leve mudança de cor de fundo ou elevação/sombra) — nunca movimento de escala exagerado, nunca troca de cor drástica. Hover deve confirmar "isto é interativo", não chamar atenção para si mesmo.

### 7.6 Scroll

Scroll sempre nativo e previsível — nunca scroll "customizado" com física alterada, nunca parallax decorativo (efeito comum em landing pages de agência que prioriza impacto visual sobre legibilidade — colide diretamente com o objetivo de reduzir ansiedade e carga cognitiva do documento-fonte). Elementos podem revelar-se com fade/slide sutil ao entrar na viewport, mas nunca de forma que atrase a leitura do conteúdo.

### 7.7 Transições entre telas

Sempre com origem espacial clara (documento-fonte, seção 4 princípio 11): um modal cresce a partir do elemento que o originou; uma tela de detalhe desliza a partir do item da lista que foi tocado. Isso não é estilo — é uma ferramenta de orientação espacial que ajuda usuários menos familiarizados com interfaces digitais a entender "de onde vim e para onde fui" (relevante para o público idoso do produto, reduzindo desorientação — um problema real de usabilidade sênior documentado em pesquisa de acessibilidade cognitiva).

### 7.8 O que nunca fazer

- Nenhum efeito puramente decorativo (partículas, gradientes animados, elementos "vivos" sem função) — regra explícita do briefing e do documento-fonte.
- Nenhuma animação de entrada em cascata exagerada (múltiplos elementos entrando em sequência longa) apenas para "parecer dinâmico" — atrasa a percepção de velocidade em vez de ajudar.
- Nenhuma animação ignora a preferência de "reduzir movimento" do sistema operacional do usuário (documento-fonte, seção 12) — verificação obrigatória antes de qualquer entrega.
- Nenhuma animação de loop infinito visível fora de um estado de carregamento ativo (ex.: ícone "pulsando" sem motivo) — gera ansiedade de fundo, contrário ao objetivo central do produto.

---

## 8. Espaços em Branco

### 8.1 Por que o espaço vazio comunica qualidade — fundamento psicológico

Espaço em branco generoso é, historicamente, um sinal de **abundância de recursos** — em branding físico, marcas de luxo usam mais espaço ao redor de menos produto porque podem "se dar ao luxo" de não precisar preencher cada centímetro para justificar o preço (princípio bem documentado em estudos de percepção de luxo em embalagem e varejo). Em produtos digitais, o mesmo efeito se transporta: uma tela com muito espaço ao redor de pouca informação comunica "este produto tem confiança suficiente em si mesmo para não gritar por atenção" — exatamente o oposto do padrão "cluttered"/"cumbersome" identificado como falha central de quase todo concorrente do setor associativo (documento-fonte, Anexo A).

Há também um fundamento puramente cognitivo, não apenas de percepção de marca: espaço em branco reduz literalmente a **carga cognitiva extrínseca** (Sweller, Cognitive Load Theory) — cada elemento adicional numa tela consome capacidade de atenção limitada; espaço vazio ao redor de um elemento importante aumenta a chance de esse elemento ser processado corretamente pelo usuário (efeito documentado em pesquisas de "signal-to-noise ratio" em design de interface).

### 8.2 Regras claras

1. **Toda tela tem uma margem mínima segura** nas bordas — nunca conteúdo colado à borda da tela/viewport, em nenhum breakpoint.
2. **O espaço ao redor do CTA primário é sempre maior que o espaço ao redor de qualquer outro elemento na tela.** O espaço em branco é, ele mesmo, uma ferramenta de hierarquia — não apenas cor ou tamanho (efeito Von Restorff: um elemento isolado por espaço se destaca mais que um elemento apenas colorido diferente).
3. **Preferir espaço em branco a linhas divisórias.** Sempre que for possível separar dois blocos de conteúdo por espaço em vez de por borda/linha, a opção de espaço é a escolhida (princípio direto do design system da Stripe, documento-fonte Anexo A) — bordas acumuladas criam sensação de "grade", espaço cria sensação de "respiro".
4. **Nunca reduzir espaçamento para "caber mais coisa" na tela.** Se uma tela não cabe confortavelmente com o espaçamento padrão do grid (seção 10), o problema é excesso de conteúdo na tela, não o espaçamento — a tela deve ser dividida ou simplificada, nunca comprimida.
5. **Espaço em branco aumenta, nunca diminui, em telas do associado** em relação a telas administrativas equivalentes — reforçando a diferença de densidade definida na seção 13 e no documento-fonte (seção 4, princípio 12).
6. **Todo elemento tocável tem espaço suficiente ao redor** para não ser confundido com o elemento vizinho — aplicação direta da Lei de Fitts e do requisito de acessibilidade motora (documento-fonte, seção 12: mínimo 44×44px de área tocável com espaçamento entre alvos adjacentes).

---

## 9. Composição

### 9.1 Princípio central

Cada tela tem **um único ponto focal primário** — o olho do usuário deve saber exatamente onde pousar primeiro, sem esforço. Isso deriva diretamente do princípio "nunca mais de um CTA primário por tela" do documento-fonte (seção 4, princípio 2), estendido de regra de interação para regra de composição visual: hierarquia visual (tamanho, peso, cor, posição, espaço ao redor) deve deixar óbvio, antes mesmo da leitura do texto, qual é a ação/informação mais importante da tela.

### 9.2 Hierarquia

Construída por camadas redundantes e reforçadoras — nunca dependente de um único sinal isolado: o elemento mais importante da tela é, ao mesmo tempo, o maior (ou entre os maiores), o de maior contraste, o com mais espaço ao redor, e o posicionado no caminho natural de leitura. Quando múltiplos sinais apontam para a mesma prioridade, a hierarquia fica óbvia mesmo para quem não lê cuidadosamente o texto — essencial para o público de baixa familiaridade tecnológica (documento-fonte, seção 3).

### 9.3 Fluxo de leitura

- **Landing page e conteúdo editorial**: fluxo vertical em "Z" ou "F" adaptado — elemento de maior peso no topo esquerdo/centro (onde a leitura ocidental naturalmente começa), CTA de conversão sempre no fim natural do fluxo de leitura de cada bloco, nunca escondido fora do padrão.
- **Telas administrativas densas (tabelas, relatórios)**: fluxo em "F" clássico — cabeçalhos de coluna alinhados à esquerda, ação principal por linha sempre na mesma posição horizontal em todas as linhas (nunca posição variável, que forçaria o olho a "procurar" a cada linha).
- **Telas do associado**: fluxo vertical único, linear, sem ramificações — uma decisão de cada vez, de cima para baixo, nunca layout em múltiplas colunas competindo por atenção simultânea.

### 9.4 Respiração

"Respiração" é o espaço entre grupos de conteúdo relacionado (não apenas entre elementos individuais, ver seção 8) — grupos com respiração generosa entre si comunicam, via princípio de proximidade da Gestalt, que são conceitualmente distintos, sem precisar de rótulo explícito "Seção 1", "Seção 2". Usar espaço para separar contexto é sempre preferível a usar texto explicativo para separar contexto.

### 9.5 Regra de revisão de composição

Antes de aprovar qualquer composição de tela, aplicar o teste dos "3 segundos, olhos semicerrados": olhar a tela borrada/à distância — se o ponto focal principal ainda é identificável mesmo sem conseguir ler o texto, a composição está correta. Se não, a hierarquia visual falhou independentemente de quão "bonita" a tela pareça de perto.

---

## 10. Grid

### 10.1 Unidade atômica

Grid de **8px** como unidade base de todo espaçamento, dimensionamento e posicionamento (herdado diretamente do documento-fonte, seção 6.6 — não uma nova decisão, uma reafirmação obrigatória). Toda margem, padding, altura de componente e gutter é um múltiplo de 8 (com exceção pontual de 4px para ajustes finos de alinhamento tipográfico, nunca para espaçamento estrutural).

### 10.2 Por que 8px e não outro valor

8 é divisível de forma limpa em múltiplos contextos de tela e densidade de pixel (incluindo telas de alta resolução, onde múltiplos de 8 evitam problemas de arredondamento sub-pixel) — é o padrão validado independentemente por Airbnb, Stripe e Shopify (documento-fonte, Anexo A), o que reduz risco de reinventar um sistema pior. Mais relevante ainda: uma unidade atômica única e nunca quebrada é, por si só, um mecanismo de consistência perceptível — mesmo um usuário que não sabe articular "por que essa tela parece organizada" sente a diferença entre um layout construído sobre grid rígido e um layout com espaçamentos arbitrários.

### 10.3 Grid de colunas (layout responsivo)

Estrutura de 12 colunas em desktop, colapsando para 4 colunas em tablet e coluna única em mobile — seguindo a filosofia mobile-first do documento-fonte (seção 11): o layout de coluna única do mobile não é uma versão "encolhida" do desktop, é o ponto de partida do design; o grid de 12 colunas é a expansão, não o contrário.

### 10.4 Gutters e margens

Gutter (espaço entre colunas) e margem externa sempre múltiplos de 8px, aumentando proporcionalmente com o tamanho da tela — telas maiores recebem mais margem externa (não mais conteúdo espremido), reforçando o princípio de espaço em branco (seção 8) em vez de contrariá-lo em telas grandes.

### 10.5 Alinhamento como sinal de confiança

Todo elemento na tela se alinha a uma linha do grid — nunca posicionamento "olho" ou aproximado. Isso não é perfeccionismo estético: pesquisa de credibilidade web (Fogg et al., Stanford Web Credibility Project) identifica consistentemente o "design visual" — do qual alinhamento é o componente mais mensurável — como um dos fatores mais citados por usuários reais ao julgar se um site é confiável ou não, mesmo quando não conseguem articular exatamente o que "parece errado" num layout desalinhado. Para um produto que lida com o dinheiro da associação, alinhamento inconsistente é, literalmente, um risco de confiança mensurável — não só um detalhe de acabamento.

### 10.6 Exceções ao grid

A única exceção aceitável ao grid de 8px é fotografia em tela cheia (heróis, banners) onde a imagem pode ocupar a largura total da viewport — mesmo assim, todo texto e elemento de interface sobreposto à imagem continua alinhado ao grid.

---

## 11. Linguagem Visual

### 11.1 O que faz uma tela parecer simples

- **Poucos elementos competindo por atenção simultaneamente** (Lei de Hick: tempo de decisão cresce com o número de opções apresentadas — menos opções visíveis de uma vez = decisão mais rápida e menos ansiosa).
- **Hierarquia óbvia sem esforço de leitura** (ver seção 9.5, teste dos "3 segundos").
- **Linguagem familiar e sem jargão** (documento-fonte, seção 5) — uma tela pode ser visualmente simples e ainda assim parecer complexa se o texto usa palavras que o usuário não reconhece.
- **Espaço em branco generoso** (seção 8) — funciona como sinal visual de "isto é tudo que você precisa olhar agora".
- **Consistência com telas já vistas antes** — familiaridade reduz esforço de reaprendizado (Lei de Jakob: usuários preferem que um site funcione como os outros sites que já conhecem). Isto se aplica a **convenções de interação** (onde fica o botão de voltar, como funciona um formulário) — não à **identidade visual** (cor, tom, fotografia), que deve ser distinta. Não há contradição entre "não parecer um SaaS genérico" (Creative Vision, seção 1) e "seguir convenções de interação conhecidas": a primeira é sobre personalidade e emoção, a segunda é sobre não reinventar comportamentos básicos que o usuário já domina de outros apps do dia a dia (WhatsApp, aplicativos de banco).
- **Estados sempre visíveis sem precisar procurar** (documento-fonte, seção 2.4) — "até quando estou pago" sempre à vista, nunca atrás de um clique extra.

### 11.2 O que faz uma tela parecer complexa

- Múltiplas ações de mesmo peso visual competindo (viola diretamente o princípio 2 do documento-fonte).
- Densidade de informação alta sem agrupamento visual claro (viola princípio de proximidade da Gestalt).
- Jargão técnico exposto ("webhook", "sincronizar", "ID da assinatura" — proibidos explicitamente no documento-fonte, seção 5.2).
- Inconsistência entre telas (um padrão de botão numa tela, outro padrão na tela seguinte) — força o usuário a reaprender a cada navegação.
- Cor usada sem sistema (mais de 2-3 cores de destaque numa mesma tela cria ruído sem hierarquia real).
- Textos longos sem quebra ou hierarquia tipográfica — um parágrafo denso é lido como "trabalho", não como "informação".

### 11.3 O que reduz ansiedade

- Estado do dinheiro sempre visível e claro (documento-fonte, seção 2.4 e 9.2).
- Confirmação explícita de toda ação — nunca deixar o usuário "supor" que algo funcionou (documento-fonte, seção 13, princípio 4).
- Linguagem que explica o "porquê" antes de pedir uma ação (documento-fonte, seção 5.1).
- Tom de cor sóbrio mesmo em alertas — vermelho-tijolo, nunca vermelho-alarme puro, para cobrança vencida (documento-fonte, seção 6.1) — comunica seriedade sem parecer ameaça.
- Caminho de desfazer/voltar sempre visível em qualquer fluxo de múltiplas etapas.

### 11.4 O que aumenta ansiedade

- Contagens regressivas agressivas ou avisos em vermelho puro piscante — padrão de "urgência artificial" de e-commerce que não tem lugar num produto que se posiciona como Cuidador (documento-fonte, seção 1.8).
- Mensagens de erro vagas ("Ocorreu um erro") sem explicação nem próximo passo — a ausência de informação, não o erro em si, é o que gera ansiedade.
- Ações irreversíveis sem confirmação clara de consequência (documento-fonte, seção 4, princípio 8).
- Excesso de notificação/alerta simultâneo — múltiplos banners/toasts competindo dividem a atenção e comunicam descontrole, não organização.
- Qualquer tela que exija que o usuário "descubra" como proceder por tentativa e erro.

---

## 12. Landing Page

*(Direção criativa apenas — não wireframe, não layout. O documento-fonte, seção 8, já define a narrativa/estrutura; esta seção define exclusivamente a sensação e a linguagem visual.)*

### 12.1 Como ela deve parecer

Editorial, não "produto de software". A referência de humor visual é mais próxima de uma revista institucional bem produzida (fotografia grande, tipografia com respiro, texto curto e confiante) do que de um site SaaS típico. **O que evitar explicitamente**: o padrão "hero com gradiente colorido + ilustração 3D flutuante de dashboard + três ícones com texto embaixo" — esse é hoje o template visual mais repetido de landing pages de SaaS no mundo inteiro, e é exatamente o oposto do objetivo de não parecer "mais um software" (briefing original, seção "Importante").

A primeira dobra (hero) deve ser dominada por **fotografia real** (seção 4) de uma associação de verdade — não uma ilustração, não um mockup de tela de produto. Mostrar gente antes de mostrar interface é uma escolha deliberada: comunica "isto é sobre pessoas e comunidade" antes de comunicar "isto é um sistema".

### 12.2 Emoção a transmitir, por trecho da página

- **Hero**: reconhecimento imediato ("isso é sobre o meu tipo de associação") + alívio ("finalmente algo pensado pra gente como a gente").
- **Benefícios**: alívio prático — cada benefício deve soar como o fim de um incômodo real e específico, não uma lista abstrata de funcionalidades.
- **Módulos**: competência organizada, sem sobrecarregar — apresentar com calma, um de cada vez, nunca uma grade densa de 10 ícones simultâneos.
- **Provas sociais**: pertencimento e validação por semelhança ("gente como eu já confia nisso") — fotografia real de clientes reais é obrigatória aqui (seção 4.9), nunca depoimento sem rosto.
- **FAQ**: acolhimento das dúvidas mais ansiosas sem soar defensivo — tom de conversa, não de documento legal.
- **CTA final**: convite calmo, nunca urgência artificial ("últimas vagas!", contadores regressivos) — o arquétipo Cuidador nunca pressiona.

### 12.3 Ritmo

Alternância deliberada entre blocos densos de informação (com texto e prova) e blocos de respiro quase vazios (fotografia grande, uma frase curta, muito espaço) — o ritmo em si comunica cuidado editorial, imitando a experiência de folhear uma publicação bem diagramada, não de rolar uma lista infinita de features.

---

## 13. Sistema

### 13.1 Princípio unificador

Administração e área do associado compartilham 100% do mesmo DNA visual — tipografia, cor, grid, ícones, tom de voz (documento-fonte, seção 10.2: "estrutura visual é sempre a mesma; muda a roupa, não o esqueleto", aplicado aqui não ao white-label, mas à diferença entre os dois tipos de usuário). A diferença entre as duas áreas nunca é de *identidade*, é de *densidade e ritmo* — exatamente como o documento-fonte já estabelece na seção 4, princípio 12, e na seção 9.9-9.10.

### 13.2 Como as telas administrativas devem parecer

Mais densas, mas nunca caóticas: tabelas completas, múltiplos números visíveis simultaneamente (inspirado no princípio do "termômetro" do Mercado Livre citado no documento-fonte, seção 4) — porque o usuário administrativo (presidente/tesoureiro/secretária) está numa tarefa de análise/decisão que se beneficia de mais contexto visível de uma vez. Mesmo assim, cada bloco de dado denso segue as mesmas regras de grid, espaçamento e hierarquia definidas nas seções 8-10 — densidade não é desculpa para abandonar o sistema.

### 13.3 Como as telas do associado devem parecer

Radicalmente mais simples: no máximo 2-3 blocos de informação visíveis por vez, um caminho vertical único, espaço em branco no máximo definido pela seção 8. A régua de teste: uma tela do associado deve parecer, à primeira vista, "com menos coisa" que a tela administrativa equivalente — se as duas parecerem igualmente densas, a tela do associado precisa ser simplificada.

### 13.4 Como manter a identidade única entre as duas áreas

Nunca através de estilo visual diferente (isso quebraria a coerência de marca) — sempre através de **quantidade de informação exposta simultaneamente** e **número de decisões oferecidas por tela**. A cor, a tipografia, o tom de voz, o traço dos ícones são idênticos nas duas áreas; o que muda é o volume.

---

## 14. White Label

*(Complementa diretamente o documento-fonte, seção 10 — aqui sob a lente específica de identidade visual/criativa, não de arquitetura de produto.)*

### 14.1 A analogia central

O modelo correto não é "um produto genérico com logo trocável" (a falha visível em todo concorrente do setor pesquisado no documento-fonte — "dá pra trocar o logo de uma pela outra sem notar diferença"). O modelo correto é o de uma **rede de pousadas ou hotéis boutique bem administrada**: cada unidade tem caráter próprio e reconhecível localmente, mas qualquer hóspede que já ficou numa unidade reconhece instantaneamente o padrão de qualidade, o tom de atendimento e os detalhes de acabamento ao chegar em outra unidade da mesma rede. A marca-mãe nunca desaparece — ela se manifesta através de um sistema consistente que acomoda variação superficial controlada.

### 14.2 O que garante identidade única a cada associação (superfície, sempre segura de trocar)

- Nome e logotipo da associação em posição de destaque.
- Cor de acento secundário, escolhida de uma paleta pré-validada para contraste e harmonia com a cor-tinta/estrutura (nunca cor livre sem checagem — documento-fonte, seção 10.1).
- Fotografia real da própria associação substituindo qualquer imagem-padrão do sistema (a personalização mais poderosa e a mais barata de manter consistente, porque não exige nenhuma decisão de design nova — só substituição de asset dentro de um template já aprovado).
- Domínio próprio.

### 14.3 O que garante que o produto continua sendo, inconfundivelmente, o Portal Associativo (esqueleto, nunca trocado)

- Grid, tipografia, espaçamento, raio de borda, estilo de ícone e ilustração (seções 5, 6, 10) — literalmente o mesmo arquivo de design tokens para todos os tenants.
- Cor-tinta (estrutura/texto) e cores semânticas (sucesso/atenção/erro) — nunca alteradas por tenant, sob risco de comprometer acessibilidade e o reconhecimento consistente de estado (documento-fonte, seção 10.2).
- Tom de voz e vocabulário (documento-fonte, seção 5) — cada associação pode nomear sua própria categoria de sócio, mas nunca foge do registro de linguagem definido.
- Motion, composição e princípios de UX (seções 7, 9, e documento-fonte seção 4) — nenhum tenant "pede" uma exceção por preferência pessoal de um diretor.

### 14.4 Regra de aprovação de customização

Toda solicitação de customização de um tenant passa por um teste simples: **isso muda a "roupa" (superficial, seguro) ou muda o "esqueleto" (estrutural, proibido)?** Se a resposta for ambígua, a decisão sobe para revisão de direção criativa antes de ser implementada — nunca é decidida ad-hoc por quem está configurando a conta do cliente.

---

## 15. Benchmark Visual

*(Aprofundamento, sob lente exclusivamente criativa/visual, do benchmark de UX já registrado no documento-fonte, Anexo A. Aqui: o que aprender, o que nunca copiar, quais princípios aproveitar — para cada uma das 10 referências pedidas.)*

### 15.1 Apple

**O que aprender**: disciplina radical de redução — cada elemento na tela precisa justificar sua existência. Tipografia como principal ferramenta de hierarquia (antes de cor, antes de ilustração). Uso de "deferência" — o chrome da interface nunca compete com o conteúdo real do usuário.
**O que nunca copiar**: a estética fria e minimalista extrema quando aplicada sem calor humano — em contexto Apple isso funciona porque a marca já tem décadas de confiança acumulada; para uma marca nova, minimalismo sem calor pode ler como "vazio" em vez de "confiante". Também nunca copiar o vocabulário visual literal (SF Symbols, paleta neutra cinza/branco/azul-sistema) — seria imitação reconhecível, não princípio.
**Princípios a aproveitar**: um CTA por tela; progressive disclosure; hierarquia tipográfica antes de decoração; consistência absoluta entre partes do sistema.

### 15.2 Stripe

**O que aprender**: como comunicar seriedade financeira através de restrição de paleta (poucas cores, usadas com extrema disciplina) e tratamento de erro/estado de pagamento como cidadão de primeira classe do design, não exceção rara.
**O que nunca copiar**: a estética "developer-first" (tom técnico, tipografia monoespaçada para dados, densidade voltada a programadores) — nosso público é o oposto do público técnico da Stripe.
**Princípios a aproveitar**: sombra como extensão da paleta de marca (nunca cinza neutro genérico); espaçamento consistente como sinal de precisão; toda falha desenhada com o mesmo cuidado do sucesso.

### 15.3 Linear

**O que aprender**: como "estrutura sentida, não vista" cria interfaces que parecem organizadas sem depender de bordas/linhas em excesso; motion com origem espacial sempre explícita.
**O que nunca copiar**: densidade de informação voltada a usuários avançados/power users (Linear é feito para quem usa o produto 8 horas por dia com atalhos de teclado) — nosso público administrativo já é o "avançado" do nosso sistema, e mesmo assim precisa de muito mais orientação visual do que o usuário técnico da Linear.
**Princípios a aproveitar**: "existe um caminho certo, não múltiplos igualmente válidos"; hierarquia por peso visual em vez de linhas divisórias; motion como ferramenta de orientação, nunca decoração.

### 15.4 Notion

**O que aprender**: como tratar estado vazio como convite, nunca como ausência; como equilibrar flexibilidade com identidade visual consistente através de um sistema de blocos único.
**O que nunca copiar**: a flexibilidade extrema de formato (qualquer bloco pode virar qualquer coisa) — o Portal Associativo é o oposto: um produto opinativo com caminhos fixos, não uma tela em branco para o usuário construir sozinho, o que seria assustador para o público-alvo.
**Princípios a aproveitar**: nenhuma tela vazia de verdade; regra "duas partes instrução, uma parte acolhimento" em todo texto de estado vazio.

### 15.5 Airbnb

**O que aprender**: fotografia como elemento central de confiança, não decoração; construção de confiança em camadas ao longo da jornada (nenhum sinal isolado é suficiente sozinho).
**O que nunca copiar**: a paleta vibrante coral/rosa como cor de marca própria (já documentada e reconhecível como "Airbnb"), nem o tom "aventura/viagem/descoberta" — nosso tom é permanência e cuidado, não descoberta.
**Princípios a aproveitar**: mapear os medos específicos do público e desenhar resposta visual explícita para cada um; fotografia profissional como investimento direto em conversão/confiança, não custo estético.

### 15.6 Shopify (Polaris)

**O que aprender**: como desenhar para um administrador não-técnico gerindo algo que importa muito para ele (o próprio negócio) sozinho — é, de todos os benchmarks, o mais próximo do nosso público administrativo real (presidente/tesoureiro sem equipe de TI).
**O que nunca copiar**: a estética "admin de e-commerce" genérica (tabelas densas de produto/pedido, paleta neutra corporativa) sem adaptação ao tom mais caloroso que o Portal Associativo exige.
**Princípios a aproveitar**: "empoderar sem sobrecarregar" como critério formal de revisão; consistência entre telas como principal mecanismo de confiança percebida; acessibilidade embutida por padrão, não adicionada depois.

### 15.7 Arc Browser

**O que aprender**: como uma categoria madura e "chata" pode ser reimaginada com personalidade sem perder função — relevante como prova de conceito de que "gestão de associação" não precisa parecer burocrática só porque sempre pareceu.
**O que nunca copiar**: a linguagem visual (explosões de cor, motion abundante, tom lúdico/experimental) — é dirigida a um público early-adopter jovem e tolerante a novidade constante, o oposto do nosso público, que valoriza estabilidade e reconhecimento.
**Princípios a aproveitar**: coragem de questionar convenções herdadas da categoria (por que um sistema de gestão de associação *precisa* parecer com uma planilha do governo?) — sem adotar a estética resultante do Arc, só a atitude de questionamento.

### 15.8 Nubank

**O que aprender**: é a referência mais próxima em contexto brasileiro de como conquistar confiança de público cético com dinheiro através de transparência e tom de voz, não de solenidade. Disciplina de nomenclatura em português cotidiano (documento-fonte, seção 5, cita isso diretamente).
**O que nunca copiar**: a cor roxa como identidade (já é a marca mais reconhecível do país nessa cor — usar seria confusão direta de marca, não inspiração) nem o tom "disruptivo/anti-banco" — o Portal Associativo não está lutando contra uma instituição opressora, está apoiando uma instituição que a comunidade já ama.
**Princípios a aproveitar**: os cinco adjetivos de voz (Simples, Humana, Amigável, Prestativa, Educada) já adotados no documento-fonte (seção 1.9); transparência total de estado financeiro como ferramenta de confiança.

### 15.9 Banco Inter

**O que aprender**: como uma marca regional (mineira, como o próprio CCBMG) consolida múltiplos serviços num único produto sem perder clareza; significado deliberado atribuído a escolhas visuais (cada elemento do logo do Inter "significa" algo específico e comunicável).
**O que nunca copiar**: a identidade "super app financeiro" (visualmente próxima de fintech) — o Portal Associativo não é um banco e não deve parecer um.
**Princípios a aproveitar**: priorizar na tela principal as 2-3 ações que a maioria das pessoas faz; dar significado declarável e comunicável às escolhas de cor e forma (útil diretamente para o brief de criação de logo que sucede este documento).

### 15.10 Mercado Livre

**O que aprender**: como densidade de informação pode, em contextos específicos de decisão (não em todos), aumentar confiança em vez de reduzi-la — relevante apenas para telas administrativas (seção 13), nunca para telas do associado.
**O que nunca copiar**: a estética "marketplace" (muitos elementos coloridos competindo, selos, badges promocionais) — errado para um produto de gestão institucional, correto apenas como uma técnica pontual (o "termômetro" de status) já incorporada com moderação na seção 13.2.
**Princípios a aproveitar**: reputação/confiança construída por histórico visível de terceiros, não apenas declarada pela plataforma — aplicável de forma adaptada em depoimentos e provas sociais da landing page (seção 12.2).

---

## 16. Anti-Patterns — O que nunca devemos fazer

Cada item abaixo foi observado como padrão real de falha — seja nos concorrentes mapeados no documento-fonte (Anexo A), seja como padrão amplamente documentado em UX de SaaS/ERP/CRM/interfaces administrativas em geral. Organizado por categoria.

### 16.1 SaaS em geral (1–16)

1. **Múltiplos CTAs de mesmo peso visual na mesma tela** → força o usuário a decidir o que o produto deveria decidir por ele (viola princípio 2 do documento-fonte).
2. **Onboarding com mais de 5 passos antes do primeiro valor real** → cada passo extra é uma chance de abandono, especialmente para público pouco técnico.
3. **Paywall ou upsell aparecendo no meio de uma tarefa em andamento** → interrompe confiança e comunica "estão tentando me vender algo", contra o arquétipo Cuidador.
4. **Notificações push excessivas e não essenciais** → gera ansiedade de fundo e ensina o usuário a ignorar (e eventualmente desativar) todas as notificações, inclusive as importantes.
5. **Dark patterns de cancelamento difícil** → contraria diretamente o próprio autocancelamento self-service já implementado no produto; nunca esconder ou dificultar uma ação que o usuário tem direito de fazer.
6. **Copy genérica de marketing dentro do produto** ("Turbine sua gestão!") → soa como propaganda, quebra o tom de confiança sóbria.
7. **Gamificação forçada** (troféus, pontos, barras de progresso sem propósito real) → infantiliza um público adulto sério cuidando do dinheiro da própria associação.
8. **Modal de "novidades" a cada login** → interrompe a tarefa que o usuário veio fazer; equivalente digital de propaganda não solicitada.
9. **Formulários que perdem dados preenchidos ao dar erro em um campo** → pune o usuário por um erro pequeno com retrabalho total; gera desconfiança duradoura no sistema.
10. **Textos de ajuda que só aparecem depois que o erro já aconteceu** → deveriam existir antes, prevenindo o erro (design proativo, não reativo).
11. **Excesso de opções de configuração expostas de uma vez** → viola Lei de Hick; a maioria nunca será usada e só aumenta ansiedade de decisão.
12. **Uso de terminologia em inglês sem necessidade** ("dashboard", "workflow", "login" em vez de alternativas em português já naturalizadas quando existem) → aumenta barreira para público com menos intimidade digital.
13. **Botões com rótulos ambíguos** ("OK", "Enviar" sem contexto do que está sendo enviado) → força o usuário a confiar cegamente numa ação que não entende completamente.
14. **Autoplay de vídeo com som em landing pages** → invasivo, quebra a sensação de controle do visitante.
15. **Popups de saída ("Espera! Não vá embora!")** → tom de desespero comercial, incompatível com o arquétipo Cuidador.
16. **Contador regressivo artificial de "oferta por tempo limitado"** → urgência fabricada, tática de venda agressiva que nenhum concorrente sério de confiança usa (nem Apple, nem Stripe, nem Airbnb).

### 16.2 ERP / sistemas de gestão (17–32)

17. **Menus com mais de dois níveis de profundidade para tarefas comuns** → cada nível extra é uma chance de o usuário se perder e desistir.
18. **Terminologia de banco de dados exposta na interface** (IDs, chaves estrangeiras, nomes de tabela) → o usuário nunca deveria ver a estrutura interna do sistema.
19. **Telas de configuração que exigem entender a arquitetura do sistema para serem preenchidas corretamente** → característica clássica de ERP legado (o próprio padrão citado como falha em Fonteva/CiviCRM no documento-fonte).
20. **Relatórios que exigem lógica booleana (E/OU/NÃO) para serem filtrados** → citado explicitamente como fonte de confusão em reviews reais da Neon CRM (documento-fonte, Anexo A) — nunca expor lógica booleana crua ao usuário final.
21. **Nenhuma confirmação visual após salvar um registro** → o usuário não sabe se a ação funcionou, precisa "confiar" ou recarregar a página para verificar.
22. **Formulários de cadastro com dezenas de campos obrigatórios de uma vez** → deveriam ser divididos em etapas curtas (documento-fonte, seção 11, princípio 6).
23. **Impossibilidade de desfazer uma ação administrativa comum** → gera medo paralisante de usar o sistema, especialmente em usuários já ansiosos com tecnologia.
24. **Exportação de dados apenas em formato técnico (CSV cru sem formatação)** → inutilizável para quem não sabe abrir/tratar planilha.
25. **Auditoria/log de ações visível apenas para especialistas técnicos** → o tesoureiro precisa conseguir provar o que aconteceu com um pagamento sem pedir ajuda de TI (persona seção 3.3 do documento-fonte).
26. **Sistema que trava ou exige recarregar a página para refletir uma mudança recente** → sinal clássico de dívida técnica que também é falha de design percebida (documento-fonte, Anexo A: reclamações reais de instabilidade em SGA/Hinova).
27. **Múltiplos módulos com padrões visuais diferentes dentro do mesmo produto** → sintoma de crescimento por acúmulo sem redesenho — exatamente o padrão de falha identificado em GrowthZone (múltiplos logins de plataforma por fusão de produtos).
28. **Impressão/PDF gerado com layout quebrado ou desatualizado** → materiais impressos (recibo, carteirinha) são tão parte da marca quanto a tela.
29. **Campos numéricos sem máscara/formatação automática** (CPF, telefone, moeda digitados sem qualquer ajuda visual) → aumenta erro de digitação e retrabalho.
30. **Paginação sem indicação clara de quantos itens/páginas existem no total** → o usuário não consegue estimar o tamanho da tarefa (ex.: quantos associados faltam revisar).
31. **Permissões de usuário configuráveis apenas por texto técnico de papel/role** → deveria ser em linguagem de função real ("pode ver financeiro", não "role: finance_viewer").
32. **Telas administrativas sem estado de "carregando" claro em ações demoradas (ex.: geração de relatório grande)** → o usuário clica múltiplas vezes por achar que não funcionou, podendo duplicar a ação.

### 16.3 CRM (33–46)

33. **Vocabulário de "contatos" e "leads" aplicado a associados/pessoas de uma comunidade** → linguagem fria de vendas, incompatível com o tom do documento-fonte (seção 5.2, proibido explicitamente).
34. **Pontuação de "engajamento" exposta como número frio** ("Score: 34") → reduz uma pessoa e sua relação com a associação a uma métrica, contrário ao propósito de marca (documento-fonte, seção 1.1).
35. **Segmentação avançada de público como funcionalidade central visível ao usuário comum** → linguagem e conceito de marketing B2B que não pertence à experiência de um tesoureiro voluntário.
36. **E-mails automáticos com tom de campanha de marketing** em vez de comunicação institucional real → quebra a sensação de "isso vem do meu clube", não de uma ferramenta terceirizada.
37. **Histórico de interação apresentado como linha do tempo técnica de eventos de sistema** em vez de narrativa legível por humano.
38. **Duplicidade de cadastro sem processo de mesclagem simples** → erro comum em CRMs genéricos, gera desconfiança quando um associado aparece "duas vezes".
39. **Campos de CRM genéricos demais para o contexto de associação** (ex.: "Empresa", "Cargo" aplicados sem sentido a um associado pessoa física) → sinal de sistema não pensado para o caso de uso real.
40. **Automação de comunicação sem controle humano de revisão antes do primeiro disparo** → risco de mensagem errada saindo em massa sem supervisão, especialmente crítico em confirmação de pagamento.
41. **Relatório de "funil de conversão" aplicado a associados** → vocabulário de vendas que não tem lugar numa relação de pertencimento comunitário.
42. **Falta de campo para reconhecer relações reais da comunidade** (padrinho, família, categoria histórica do sócio) → um CRM genérico não modela o que realmente importa numa associação.
43. **Exibição pública não intencional de dados sensíveis de associado** (ex.: telefone visível para outros associados sem consentimento) → risco de LGPD e de confiança, deve ser verificado explicitamente em toda tela nova.
44. **Impossibilidade de o próprio associado corrigir seus dados sem abrir chamado de suporte** → gera dependência desnecessária da secretaria para tarefas simples.
45. **Comunicação em massa sem preview antes de enviar** → risco real de erro de digitação/formatação indo para toda a base de associados de uma vez.
46. **Tags e categorizações internas expostas ao usuário final sem tradução para linguagem humana** → mesmo erro do item 33, mas aplicado especificamente a classificação/categoria de sócio.

### 16.4 Sistemas de associação especificamente (47–65)

*(Itens 47-58 documentados diretamente na pesquisa de mercado do documento-fonte, Anexo A — não são hipóteses, são falhas reais confirmadas em reviews de concorrentes.)*

47. **Preço escondido atrás de "fale com vendas"** → reclamação nº1 mais citada do setor (YourMembership); gera desconfiança antes mesmo do primeiro contato.
48. **Marketing site moderno com produto real datado** → falha estrutural confirmada em WildApricot, GrowthZone, ClubExpress, YourMembership, CiviCRM — o Portal Associativo nunca investe menos no produto do que investe na landing page.
49. **Portal do associado sem possibilidade real de personalização de marca** → reclamação central de Member365 e Glue Up; contraria diretamente a arquitetura white-label do documento-fonte (seção 10).
50. **Notificação de renovação/cobrança não confiável** (SMS que não chega, aviso duplicado ou ausente) → falha crítica documentada em Raklet ("worthless"); num produto cuja função central é garantir receita da associação, isso é falha de missão, não só de UX.
51. **Implementação inicial longa e complexa demais para uma diretoria voluntária** → padrão de Fonteva (dependência de parceiros certificados) e YourMembership (90-180 dias de implantação); o Portal Associativo deve poder ser adotado em dias, não meses.
52. **Suporte que só responde sob ameaça de cancelamento** → padrão citado em reviews reais de MemberClicks/Glue Up; suporte reativo apenas à pressão é o oposto do arquétipo Cuidador.
53. **Interface administrativa que exige treinamento formal para uso básico** → padrão de CiviCRM ("semanas para entender"); contraria diretamente o documento-fonte (seção 2.5: "se exige manual, não está pronta").
54. **Banco de dados de associados "cumbersome e propenso a erro"** (citação literal sobre ClubExpress) → cadastro deve ser a tarefa mais simples do sistema, não a mais frustrante.
55. **Integração contábil rígida "tudo ou nada"** (ClubExpress) → deve sempre haver caminho intermediário, nunca um único modo de integração inflexível.
56. **Cobrança de add-on para funcionalidade essencial** (ex.: app mobile como upsell separado, padrão de MemberClicks) → mobile é parte central do produto (documento-fonte, seção 11), nunca um extra pago à parte.
57. **Ausência completa de app/experiência mobile nativa de qualidade** (padrão da Neon CRM) → inaceitável dado o compromisso mobile-first do documento-fonte.
58. **Vocabulário corporativo genérico de "gestão de membros" sem nenhuma adaptação ao nicho do cliente** → todo concorrente pesquisado soa igual para clube de tiro, coral de igreja ou associação médica; o Portal Associativo deve sempre soar como "daquela associação específica".
59. **Carteirinha digital feia ou genérica** → é um dos objetos de maior carga emocional/identitária do produto (orgulho de pertencimento, seção 2.2); nunca tratada como tela secundária de baixa prioridade de design.
60. **Fluxo de pagamento que esconde o motivo de uma recusa** → viola diretamente o princípio de confiança financeira do documento-fonte (seção 9.2, inspirado em Stripe).
61. **Processo de associação (virar sócio) mais longo ou mais complicado que o processo de cancelamento** → sinal invertido de prioridade; associar-se deve ser tão fácil quanto (ou mais fácil que) sair.
62. **Diretoria sem visão simples e imediata da saúde financeira geral** → obriga a "caçar" informação em vez de recebê-la de forma direta (documento-fonte, seção 9.1).
63. **Comunicação institucional (e-mail, SMS) com aparência de spam/phishing** (remetente genérico, sem identidade visual do clube) → associado real pode simplesmente ignorar ou desconfiar de uma cobrança legítima.
64. **Nenhuma distinção visual entre comunicação urgente (fatura vencida) e comunicação social (convite para evento)** → tudo com a mesma aparência reduz a eficácia de ambas.
65. **Exigir presença física ou ligação telefônica para tarefas que poderiam ser self-service** (atualizar dado cadastral, reimprimir carteirinha, consultar fatura) → contraria o próprio propósito de existência do produto.

### 16.5 Landing Pages (66–79)

66. **Hero com gradiente colorido genérico + ilustração 3D de "dashboard flutuante"** → o clichê visual mais repetido de SaaS no mundo; o oposto do objetivo de não parecer "mais um software" (seção 12.1 deste documento).
67. **Foto de banco de imagens de "equipe sorrindo para tablet"** → reconhecível instantaneamente como estoque genérico, mina credibilidade em vez de construir.
68. **Excesso de texto de marketing vago** ("solução completa", "plataforma robusta") sem benefício concreto e específico.
69. **Prova social sem nome, cargo ou foto real** → depoimento anônimo tem valor de credibilidade próximo de zero.
70. **Preço escondido atrás de formulário de contato** → ver item 47; landing page deve sempre mostrar preço.
71. **FAQ que evita as perguntas mais difíceis/ansiosas** (segurança de dados, facilidade real de uso) → sinaliza que a empresa está escondendo algo, mesmo sem intenção.
72. **Menu de navegação com mais de 6-7 itens no topo** → sobrecarga de escolha logo na primeira interação com a marca.
73. **CTA com texto genérico** ("Saiba mais", "Clique aqui") em vez de ação específica ("Ver planos e preços").
74. **Seção "sobre nós" focada na empresa em vez de focada no cliente e sua transformação** → o visitante quer saber "isso resolve o meu problema", não a história corporativa em si (que tem seu lugar, mas não como argumento central).
75. **Página que carrega lentamente por excesso de animação/vídeo autoplay** → contraria diretamente o princípio de performance percebida (documento-fonte, seção 13).
76. **Contraste de texto insuficiente sobre imagem de fundo no hero** → falha de acessibilidade e de legibilidade básica, comum em heroes "bonitos" mal executados.
77. **Rodapé poluído com dezenas de links irrelevantes** → dilui a atenção no momento em que o visitante já decidiu explorar mais.
78. **Nenhuma indicação clara de para quem o produto é** (o visitante precisa ler parágrafos até entender se aquilo serve para o clube dele) → deve ficar claro nos primeiros segundos.
79. **Formulário de contato/demo com excesso de campos obrigatórios** → fricção desnecessária logo na primeira intenção de conversão.

### 16.6 Design Systems (80–90)

80. **Múltiplos componentes fazendo a mesma função com aparência diferente** (três estilos de botão "primário" espalhados pelo produto) → sintoma de crescimento sem governança de design.
81. **Tokens de cor não documentados/nomeados de forma ambígua** ("blue-2", "blue-3" em vez de "sucesso", "atenção") → dificulta uso correto e consistente por qualquer designer/dev novo.
82. **Componentes sem estados de erro/vazio/carregamento desenhados desde o início** → força improviso ad-hoc em produção, gerando inconsistência (documento-fonte, seção 6.9).
83. **Ausência de documentação de "quando usar" vs. "quando não usar" cada componente** → sem isso, cada equipe reinterpreta o sistema à sua maneira.
84. **Sistema de design que nunca é revisado após o lançamento inicial** → é exatamente o padrão de falha identificado no setor inteiro (documento-fonte, Anexo A: "nenhum concorrente demonstrou disciplina de manutenção visual de longo prazo").
85. **Componentes copiados de bibliotecas genéricas (Bootstrap padrão, Material Design puro) sem nenhuma adaptação à identidade da marca** → produz a sensação de "produto sem identidade própria".
86. **Escala tipográfica com saltos aleatórios entre tamanhos** (não seguindo uma proporção/sistema) → hierarquia inconsistente e difícil de escalar para novas telas.
87. **Ícones de múltiplos estilos/fornecedores misturados no mesmo produto** → ver seção 6.6 deste documento.
88. **Grid quebrado "só dessa vez" por pressão de prazo** → toda exceção não documentada vira precedente e corrói o sistema com o tempo.
89. **Nenhum processo definido para propor um componente novo** → resulta em duplicação e inconsistência crescente conforme o produto cresce (ver seção 14 do documento-fonte para o processo correto).
90. **Acessibilidade tratada como camada adicionada depois, não construída dentro de cada componente desde o início** → sempre resulta em cobertura incompleta e inconsistente (documento-fonte, seção 12).

### 16.7 Interfaces administrativas (91–105)

91. **Tabelas com dezenas de colunas visíveis simultaneamente sem priorização** → sobrecarga visual; priorizar as colunas mais usadas, esconder o resto atrás de "mais detalhes".
92. **Ações destrutivas (excluir, cancelar) com o mesmo peso visual que ações neutras** → aumenta risco de erro grave por clique acidental.
93. **Nenhuma confirmação com contexto real antes de uma ação irreversível** (só um "tem certeza?" genérico, sem mostrar a consequência) → viola diretamente o princípio 8 do documento-fonte.
94. **Filtros de busca que exigem sintaxe técnica** → deve ser sempre interface visual guiada, nunca campo de texto livre exigindo operadores.
95. **Menus de administração organizados por estrutura técnica do sistema em vez de por tarefa real do usuário** → o admin pensa em "quero ver quem não pagou", não em "acessar módulo financeiro > submódulo cobrança > filtro de status".
96. **Ausência de busca global** → obriga navegação manual por menus para encontrar um associado específico, tarefa extremamente comum.
97. **Relatórios exportados sem contexto (números sem explicação do que representam)** → inutilizável para quem não construiu o relatório.
98. **Nenhum indicador de "última atualização" em dados financeiros críticos** → gera dúvida sobre se a informação na tela é atual.
99. **Permitir múltiplas sessões/edições simultâneas do mesmo registro sem aviso de conflito** → risco real de perda de dados quando duas pessoas da diretoria editam ao mesmo tempo.
100. **Textos de ajuda escritos em tom técnico de manual de sistema** em vez do mesmo tom de voz acolhedor do resto do produto → quebra de consistência de marca justamente no momento em que o usuário mais precisa de acolhimento (ele está com dúvida/dificuldade).
101. **Onboarding de administrador que assume conhecimento prévio de "como sistemas de gestão funcionam"** → deve assumir zero conhecimento prévio, sempre.
102. **Painel inicial (dashboard) do admin com mais de 6-8 informações simultâneas** → mesmo em telas administrativas mais densas (seção 13.2), há um limite — excesso de números sem hierarquia é ruído, não controle.
103. **Nenhuma forma de desfazer uma exclusão recente (sem soft-delete/lixeira)** → erro humano é inevitável; o sistema deve absorver isso com grace, não punir com perda permanente.
104. **Textos de log/auditoria ilegíveis para não-técnicos** ("UPDATE users SET ativo=false WHERE...") → deve sempre ser traduzido para narrativa humana ("João desativou o associado Maria em 03/08 às 14h").
105. **Configurações críticas de segurança/financeiro enterradas em submenus profundos** → o que é mais sensível deveria ser mais fácil de encontrar e revisar, não mais escondido.

---

## 17. Visual Language Checklist

*(Aplicar antes de aprovar qualquer tela nova ou revisão visual significativa.)*

**Cor**
- [ ] Usa exclusivamente tokens de cor do sistema (nunca cor "solta"/hexadecimal ad-hoc)?
- [ ] Todo par texto/fundo passa em contraste mínimo AA (4.5:1 texto normal, 3:1 texto grande)?
- [ ] Nenhum significado depende de cor isolada (sempre cor + ícone/texto)?
- [ ] Máximo de 2-3 cores de destaque na mesma tela?

**Tipografia**
- [ ] Corpo de texto ≥16px na área do associado?
- [ ] Hierarquia clara por peso e tamanho, seguindo a escala definida (não tamanhos arbitrários)?
- [ ] Números financeiros com alinhamento tabular?

**Espaçamento e grid**
- [ ] Todo espaçamento é múltiplo de 8px?
- [ ] Nenhum elemento colado à borda da viewport?
- [ ] Espaço em branco usado antes de linha divisória, sempre que possível (seção 8.2)?

**Iconografia e ilustração**
- [ ] Um único set de ícones, um único traço, em toda a tela?
- [ ] Ícone crítico sempre acompanhado de texto?
- [ ] Ilustração (se presente) é monocromática e não decorativa de fluxo funcional?

**Motion**
- [ ] Toda animação tem propósito informativo (não decorativo)?
- [ ] Duração dentro de 150-400ms?
- [ ] Preferência de "reduzir movimento" do sistema respeitada?

**Fotografia**
- [ ] Fotografia real (nunca banco de imagens genérico corporativo) em qualquer contexto de prova/confiança?
- [ ] Luz natural, expressão genuína, diversidade real de idade representada?

**Tom e copy**
- [ ] Nenhum jargão técnico exposto ao associado (ver lista de termos proibidos, documento-fonte seção 5.2)?
- [ ] Cada botão descreve a ação específica, nunca genérico ("OK", "Enviar")?

**Consistência**
- [ ] Este componente já existe em outro lugar do sistema com aparência diferente? Se sim, unificar antes de aprovar.
- [ ] Esta tela segue exatamente o mesmo padrão de tela equivalente já aprovada?

**White label**
- [ ] Nenhuma customização de tenant altera grid, tipografia, cores semânticas ou princípios de UX (documento-fonte, seção 10.2)?

---

## 18. Design Review Checklist

*(Foco em fluxo, cognição e experiência — complementar ao checklist visual da seção 17.)*

**Clareza de propósito**
- [ ] Em até 3 segundos, um usuário novo entende o que essa tela quer que ele faça?
- [ ] Existe exatamente um CTA primário visualmente dominante?

**Carga cognitiva**
- [ ] Quantas decisões esta tela pede de uma vez? (meta: uma só, sempre que possível)
- [ ] Algum campo/opção poderia ser removido sem perda real de função?

**Erros e estados-limite**
- [ ] Todo estado de erro tem mensagem específica + próximo passo (nunca genérico)?
- [ ] Todo estado vazio sugere uma ação (nunca tela/tabela literalmente em branco)?
- [ ] Ações irreversíveis têm confirmação em duas etapas com consequência explícita?

**Feedback**
- [ ] Toda ação do usuário gera confirmação visual imediata?
- [ ] Estados de carregamento comunicam o que está acontecendo, nunca mudos?

**Consistência de interação**
- [ ] Esta tela segue as mesmas convenções de navegação/interação já estabelecidas em outras partes do produto (Lei de Jakob)?
- [ ] O caminho de "voltar"/desfazer está sempre visível em fluxos de múltiplas etapas?

**Mobile e acessibilidade**
- [ ] Testado primeiro em tela pequena, depois expandido (não o inverso)?
- [ ] Toque mínimo de 44×44px com espaçamento entre alvos?
- [ ] Navegável por teclado e compatível com leitor de tela (área administrativa)?

**Linguagem**
- [ ] Nenhum termo técnico/jargão exposto ao público leigo?
- [ ] O tom soa como "a Cida da secretaria explicando numa boa tarde" (documento-fonte, seção 5.1)?

**Validação com o público real**
- [ ] Esta tela foi (ou será) testada com alguém do perfil real das personas (documento-fonte, seção 3) — não apenas com a equipe de produto?

---

## 19. Creative Principles

1. **Menos opções. Mais clareza.**
2. **Menos decoração. Mais significado.**
3. **Menos tecnologia aparente. Mais gente.**
4. **Mais pertencimento. Mais comunidade.**
5. **Simplicidade é respeito, não simplificação excessiva.**
6. **O espaço vazio também é uma decisão de design — nunca um acidente.**
7. **Consistência vale mais que originalidade pontual.**
8. **Nenhuma tela deve exigir explicação para ser usada.**
9. **Confiança se demonstra tela após tela — nunca se declara em uma única frase.**
10. **A cultura de quem usa o produto aparece nele — nunca desaparece atrás de um sistema genérico.**
11. **Fotografia real sempre vence ilustração ou banco de imagens genérico em contexto de confiança.**
12. **Toda animação tem função. Nenhuma é apenas bonita.**
13. **O erro é tratado com o mesmo cuidado do sucesso.**
14. **Um caminho certo é melhor que dez caminhos possíveis.**
15. **A régua de simplicidade é a pessoa com mais medo de errar, não a pessoa mais experiente da equipe.**
16. **Nada aparece do nada — toda transição tem origem visível.**
17. **Cor nunca é o único portador de significado.**
18. **O produto nunca deve parecer estar vendendo algo — deve parecer estar ajudando.**
19. **A tela do associado é sempre mais simples que a tela administrativa equivalente.**
20. **Alinhamento é confiança — nada é posicionado "no olho".**
21. **Densidade de informação é aceitável apenas onde a tarefa realmente exige análise.**
22. **Cada elemento removido é um gesto de cuidado, não uma perda.**
23. **O sistema de design é mantido com a mesma prioridade que o código — nunca deixado para depois.**
24. **Personalização de marca (white-label) muda a roupa, nunca o esqueleto.**
25. **Se algo precisa de manual, o design falhou — não o usuário.**
26. **Linguagem simples é acessibilidade, não estilo.**
27. **A primeira impressão visual decide a confiança antes da primeira leitura de texto — leve isso a sério em toda entrega.**
28. **Nunca imitar a estética de um concorrente — aprender o princípio, nunca copiar a forma.**
29. **Performance percebida é tão importante quanto performance real.**
30. **Toda decisão criativa precisa se sustentar em usabilidade, psicologia cognitiva, acessibilidade ou branding — nunca apenas em "ficar bonito".**

---

## 20. Próximos Passos

A sequência abaixo existe para garantir que nenhuma etapa avance sobre uma base não validada — cada fase só começa depois que a anterior passa pelos checklists das seções 17 e 18 (quando aplicável).

```
Creative Direction (este documento)
        ↓
Logo Exploration
   → Explorar direções de marca que expressem os arquétipos Cuidador + Companheiro
     (documento-fonte, seção 1.8), a forma de "arco/portal" descrita na seção 3.2,
     e o significado comunicável exigido pelo benchmark do Banco Inter (seção 15.9).
   → Gate de aprovação: a logo precisa passar o teste "isso poderia ser confundido
     com um banco, uma startup tech ou um clipart rural cliché?" — se sim, revisar.
        ↓
Brand Identity
   → Fechar paleta final (hex exatos derivados da direção terracota/tinta/off-white),
     tipografia final, sistema de ícones e ilustração, tokens de design.
   → Gate de aprovação: checklist de contraste/acessibilidade (seção 17) aplicado
     a toda combinação de cor antes de seguir adiante.
        ↓
Landing Page
   → Aplicar a direção criativa da seção 12 a uma estrutura de página real
     (a narrativa/estrutura já está definida no documento-fonte, seção 8).
   → Gate de aprovação: teste com pelo menos um representante real de cada
     persona (documento-fonte, seção 3) antes de considerar pronta.
        ↓
Design System Visual (Figma)
   → Construir a biblioteca completa de componentes (documento-fonte, seção 7,
     e este documento, seções 5-10) como tokens e componentes reutilizáveis.
   → Gate de aprovação: nenhum componente entra na biblioteca sem os 5 estados
     completos (padrão, hover/foco, ativo, desabilitado, erro — documento-fonte 6.9).
        ↓
Figma → Protótipos de tela real
   → Aplicar o design system às telas prioritárias (área do associado primeiro,
     por ser a régua mais rígida de simplicidade — seção 13.3).
   → Gate de aprovação: checklist de revisão de design completo (seção 18) por tela,
     antes de qualquer handoff para desenvolvimento.
        ↓
Desenvolvimento
   → Implementação seguindo os tokens e componentes aprovados, nunca reinterpretados
     livremente pela equipe de engenharia.
   → Gate de aprovação: toda tela em produção revisada contra a seção 17
     (Visual Language Checklist) antes do lançamento.
```

**Regra geral de governança**: nenhuma fase futura (nova logo, nova landing page, novo módulo) pode contradizer este documento ou o documento-fonte sem que a contradição seja primeiro identificada, explicada e formalmente resolvida — exatamente como este próprio documento foi obrigado a fazer antes de propor qualquer decisão nova (ver nota de consistência no topo deste documento).
