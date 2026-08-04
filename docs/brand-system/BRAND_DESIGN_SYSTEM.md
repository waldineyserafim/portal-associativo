# Portal Associativo — Product Brand & Design System

> **Nome do produto:** Portal Associativo
> **Slogan:** "O seu maior ativo é o sócio ativo."
> **Status:** Documento de referência viva — orienta branding, UX, UI e Design System do produto pelos próximos anos.
> **Para quem é este documento:** designers, desenvolvedores, IA (Claude, ChatGPT), Figma, e futuras equipes de produto.
> **Primeiro cliente em produção:** Clube do Cavalo de Bonfim MG (CCBMG) — a arquitetura, porém, é construída para atender qualquer associação (clubes recreativos, entidades de classe, sindicatos, ONGs, associações de bairro).

---

## Sobre este documento

Este documento não nasceu de um exercício de estilo. Nasceu de uma pesquisa de mercado profunda — descrita no Anexo A — que cobriu **12 plataformas internacionais** de gestão de associações (WildApricot, Glue Up, Member365, ClubExpress, Raklet, Join It, GrowthZone, Neon CRM, Fonteva, YourMembership, MemberClicks, CiviCRM), **mais de uma dezena de concorrentes brasileiros** (Softaliza, Associatec, Hinova/SGA, Clubes Associados, Cllube, Clube Control, Aclon/Pacto, Society, HiGestor, Clube Conecta, CastorWeb) e **14 referências fora do segmento** que resolveram simplicidade, confiança e redução de ansiedade em escala (Apple, Stripe, Notion, Linear, Airbnb, Shopify, Slack, Arc Browser, Cash App, Headspace, Calm, Banco Inter, Nubank, Mercado Livre).

Três achados dessa pesquisa sustentam cada decisão tomada neste documento:

1. **Todo concorrente direto tem o mesmo defeito estrutural: a distância entre o site de vendas e o produto real.** Em praticamente todas as 12 plataformas internacionais pesquisadas, o marketing site é moderno e o produto por trás é datado — "2005-2010 era" (citação literal de review sobre GrowthZone), "cumbersome and klugey" (ClubExpress), "antiquated, overcomplicated, and difficult" (YourMembership), interface "não responsiva" (CiviCRM). O investimento visual vai para a página que vende, não para a tela que a pessoa usa todo dia. Isso é uma falha sistemática do setor, não um acidente — e é a primeira coisa que o Portal Associativo se compromete a nunca repetir: **o produto tem que ser tão bem desenhado quanto qualquer landing page.**
2. **Nenhum concorrente, nacional ou internacional, resolveu de fato o problema do usuário não-técnico.** Todas seguem o vocabulário frio de CRM B2B ("contacts", "segments", "engagement metrics") e pressupõem um mínimo de conforto com software que o público real do Portal Associativo — presidentes de clube, tesoureiros voluntários, associados rurais, muitos com pouca ou nenhuma prática digital — não tem. O concorrente brasileiro mais moderno encontrado (Clube Control) já é mais bem desenhado que a média do setor, mas nenhum demonstrou um sistema de design consistente ponta a ponta, nem qualquer especialização na cultura rural/equestre.
3. **Simplicidade, nas empresas que resolveram isso de verdade (Apple, Stripe, Shopify, Nubank), nunca é tratada como estética — é tratada como critério de engenharia, com regras nomeadas e verificáveis.** "Reduzir ansiedade" não é adjetivo, é processo: um CTA por tela, progressive disclosure, estados vazios que sempre sugerem o próximo passo, erros tratados com o mesmo cuidado dos sucessos. É esse padrão de rigor — não a estética superficial dessas marcas — que o Portal Associativo importa.

Este documento traduz esses três achados numa filosofia de produto completa: da essência da marca ao design system, passando por linguagem, princípios de UX, arquitetura white-label e diretrizes de acessibilidade.

---

## Sumário

1. [Essência da Marca](#1-essência-da-marca)
2. [Filosofia do Produto](#2-filosofia-do-produto)
3. [Público](#3-público)
4. [Princípios de UX](#4-princípios-de-ux)
5. [Linguagem](#5-linguagem)
6. [Estratégia Visual](#6-estratégia-visual)
7. [Design System](#7-design-system)
8. [Landing Page](#8-landing-page)
9. [Produto](#9-produto)
10. [White Label](#10-white-label)
11. [Mobile First](#11-mobile-first)
12. [Acessibilidade](#12-acessibilidade)
13. [Performance Percebida](#13-performance-percebida)
14. [Evolução do Produto](#14-evolução-do-produto)
- [Anexo A — Metodologia e fontes de pesquisa](#anexo-a--metodologia-e-fontes-de-pesquisa)

---

## 1. Essência da Marca

### 1.1 Propósito

Associações existem para reunir pessoas em torno de algo que elas amam — um clube, uma causa, uma profissão, uma tradição. Mas a maior parte do tempo da diretoria não é gasta fortalecendo esse vínculo: é gasta perseguindo boleto vencido, atualizando planilha, respondendo a mesma dúvida no WhatsApp pela décima vez. O propósito do Portal Associativo é **devolver esse tempo para o que importa**: o vínculo entre a associação e o associado.

Isso não é retórica — é o critério de corte de escopo do produto. Toda funcionalidade nova é avaliada por uma pergunta: *isso fortalece o vínculo entre associação e associado, ou é só mais uma tarefa administrativa disfarçada de funcionalidade?*

### 1.2 Missão

Tornar a gestão de associações tão simples que qualquer diretoria eleita — técnica ou não — consiga operá-la sozinha, sem treinamento, sem medo de errar, e sem depender de um `filho que entende de informática`.

### 1.3 Visão

Ser, em cinco anos, a plataforma de referência para gestão de associações no Brasil — começando pelo nicho que hoje ninguém atende bem (clubes do cavalo, associações equestres, núcleos de criadores, entidades rurais) e expandindo, com a mesma disciplina de simplicidade, para qualquer associação: recreativa, profissional, de classe, comunitária.

A pesquisa de mercado confirma que essa é uma trajetória com precedente real fora do segmento: Stripe nasceu resolvendo pagamento para desenvolvedores antes de virar infraestrutura financeira universal; Notion nasceu para times de produto antes de virar ferramenta para qualquer tipo de trabalho. O padrão é "nicho vertical bem servido → expansão horizontal genérica" — não o inverso. O Portal Associativo segue esse mesmo caminho, com o Clube do Cavalo de Bonfim MG como primeira prova de produção real antes da generalização.

### 1.4 Valores

| Valor | O que significa na prática |
|---|---|
| **Simplicidade é respeito** | Cada tela complexa é uma forma de dizer ao associado "você devia saber usar isso". O Portal Associativo escolhe sempre a opção que exige menos do usuário, mesmo que exija mais do time de produto. |
| **Confiança se constrói, não se declara** | Nenhuma tela diz "somos seguros" — cada tela *demonstra* segurança sendo previsível, transparente sobre estado de pagamento, e nunca escondendo informação financeira do associado. |
| **Nenhuma pessoa fica para trás por não entender tecnologia** | O critério de design não é "o usuário médio de SaaS" — é o tesoureiro voluntário de 60+ anos que nunca usou um sistema de gestão. Se ele não consegue, o design falhou. |
| **A cultura do cliente aparece no produto, não desaparece nele** | Diferente de todo concorrente pesquisado (que trata toda associação como "conta genérica de CRM"), o Portal Associativo é desenhado para que a identidade de cada associação — cores, nome, linguagem do nicho — seja visível, dentro de um sistema consistente (ver seção 10, White Label). |
| **Dívida técnica visual não é aceitável** | O achado mais repetido da pesquisa é que produtos do setor ficam datados e ninguém prioriza reescrevê-los. O Portal Associativo trata manutenção do design system com a mesma prioridade de manutenção de código. |

### 1.5 Posicionamento

**Para** diretorias de associações — presidentes, tesoureiros, secretários — que hoje gerenciam sócios por planilha, WhatsApp e boleto avulso, **o Portal Associativo é** a plataforma de gestão associativa mais simples do mercado, **que** substitui esse caos por um painel único, bonito e confiável, **ao contrário de** WildApricot, ClubExpress, GrowthZone, CiviCRM e concorrentes brasileiros como Society ou Hinova/SGA, **que** empilham funcionalidades sobre interfaces datadas construídas para administradores técnicos, não para voluntários eleitos por mandato.

### 1.6 Promessa

*Se a sua diretoria sabe usar WhatsApp, ela sabe usar o Portal Associativo.*

Essa promessa é deliberadamente mensurável e ousada — funciona como critério de aceite de produto: qualquer fluxo que exija mais sofisticação técnica do que mandar uma mensagem no WhatsApp está fora da barra de qualidade aceitável.

### 1.7 Diferenciais

1. **Simplicidade radical como identidade central, não como slide de vendas.** A pesquisa mostra que todo concorrente *promete* simplicidade no marketing e entrega complexidade no produto. O Portal Associativo inverte isso: a simplicidade é a característica mais visível do produto em si.
2. **Mobile-first genuíno.** Nenhum concorrente pesquisado nasceu mobile-first — todos tratam celular como extensão do desktop administrativo. Para o público rural/equestre brasileiro, que vive no celular, isso é diferencial estrutural.
3. **Preço transparente.** A reclamação nº 1 de YourMembership, e um padrão comum a Fonteva, Glue Up e GrowthZone, é preço escondido atrás de "fale com vendas". O Portal Associativo publica preço, como Join It e Clube Control (as duas exceções positivas encontradas na pesquisa).
4. **Identidade cultural, não vocabulário de CRM corporativo.** Nenhum concorrente comunica pertencimento, tradição ou orgulho de comunidade — todos soam como ferramenta de RH. O Portal Associativo fala a língua da comunidade que atende.
5. **Confiabilidade financeira como manchete, não detalhe técnico.** Falha de cobrança/renovação é a queixa mais grave e recorrente entre concorrentes (especialmente Raklet, com SMS descrito como "worthless" em reviews). Garantir que o associado nunca perde o prazo por falha de notificação é tratado como proposta de valor central, não just funcionalidade.

### 1.8 Arquétipo de marca

**Arquétipo primário: o Cuidador (Caregiver).** O Portal Associativo existe para proteger algo que a associação já ama — não para vender inovação ou disrupção. A linguagem, o tom visual e o ritmo do produto comunicam cuidado, proteção e presença constante, nunca urgência agressiva ou hype tecnológico.

**Arquétipo secundário: o Companheiro (Everyman/Regular Guy).** O produto não se posiciona como superior ou sofisticado — se posiciona como "gente como a gente resolvendo um problema real", próximo do tom que Nubank e Cash App usam para conquistar público historicamente excluído de produtos financeiros bem desenhados. Isso justifica a ausência de jargão técnico e a escolha de tom conversacional em vez de corporativo.

Esses dois arquétipos combinados **excluem deliberadamente** os arquétipos de Herói (bravata, "revolucione sua gestão!"), Sábio (tom professoral, didático demais) e Governante (autoridade, controle, hierarquia visual pesada) — três tons comuns no marketing de SaaS B2B que soariam artificiais e intimidadores para o público real do produto.

### 1.9 Personalidade da marca

Se o Portal Associativo fosse uma pessoa, seria a pessoa da secretaria do clube que todo mundo confia: aquela que resolve o problema sem fazer drama, explica de novo sem se irritar, nunca faz ninguém se sentir mal por não entender de tecnologia, e trata cada associado — do mais antigo ao mais novo — com a mesma atenção.

Cinco adjetivos (inspirados diretamente na disciplina de tom de voz do Nu Design, do Nubank, adaptados ao contexto do produto):

- **Clara** — nunca ambígua, nunca genérica.
- **Acolhedora** — nunca fria, nunca corporativa.
- **Confiável** — nunca promete o que não cumpre, nunca esconde informação financeira.
- **Paciente** — nunca pressupõe conhecimento prévio.
- **Presente** — nunca deixa o associado sem saber o que fazer a seguir.

---

## 2. Filosofia do Produto

### 2.1 Como queremos que o usuário se sinta

| Momento | Sentimento-alvo |
|---|---|
| Ao abrir o Portal pela primeira vez | "Isso não vai ser difícil." |
| Ao pagar a mensalidade | "Pronto, resolvido — e eu sei que foi." |
| Ao ver o próprio status (em dia / vencido) | "Eu sei exatamente onde estou, sem precisar perguntar a ninguém." |
| Ao administrar (presidente/tesoureiro) | "Eu tenho controle total sobre a associação, sem precisar de um técnico do meu lado." |
| Ao ver um erro | "Ok, entendi o que aconteceu e sei o que fazer agora." |
| Ao voltar depois de meses sem acessar | "Continua tudo do jeito que eu lembrava." |

### 2.2 Emoções que queremos transmitir

- **Controle sem esforço** — a sensação central da Apple e do Shopify Polaris: o usuário sente que está no comando, não que está sendo operado pelo sistema.
- **Pertencimento** — diferente de qualquer concorrente pesquisado, o produto deve parecer "do clube", não "de uma empresa de software genérica" (ver seção 10, White Label).
- **Calma financeira** — inspirada em Calm e Headspace: mesmo lidando com cobrança e inadimplência, a interface nunca deve parecer uma cobrança agressiva. Tom firme, nunca alarmista.
- **Orgulho** — o associado deve sentir que a carteirinha digital, o portal, a comunicação da associação refletem bem a instituição da qual ele faz parte.

### 2.3 Emoções que queremos eliminar

- **Ansiedade de não saber o que fazer a seguir** — eliminada via um CTA primário óbvio por tela (princípio detalhado na seção 4).
- **Medo de errar e não poder desfazer** — eliminado via confirmação em duas etapas para toda ação irreversível (o autocancelamento de assinatura, já implementado, é o modelo a replicar: confirmar CPF+telefone → mostrar até quando o benefício vale → só então confirmar).
- **Vergonha por não entender tecnologia** — eliminada nunca usando jargão técnico na interface do associado (nunca "asaasSubscriptionId", nunca "webhook", nunca "sincronizar" — sempre "assinatura", "pagamento", "atualizar").
- **Frustração por interface inconsistente** — eliminada por um design system rigorosamente único entre todas as telas administrativas (o principal mecanismo de confiança identificado no Shopify Polaris).
- **Sensação de estar sendo vendido algo o tempo todo** — eliminada evitando qualquer padrão de dark pattern, urgência artificial ("últimas vagas!") ou notificação excessiva.

### 2.4 Como reduzir ansiedade — técnicas concretas adotadas

1. **Progressive disclosure**: qualquer configuração avançada fica atrás de "Ver mais" ou "Configurações avançadas" — nunca na tela principal (princípio Apple/Stripe).
2. **Um conceito por tela**: nenhuma tela do associado pede mais de uma decisão por vez.
3. **Estado sempre visível**: o associado sempre sabe "até quando estou pago" sem precisar calcular ou perguntar (já existe via `finance/summary.activeUntil` — é o padrão a generalizar).
4. **Erros tratados como cidadãos de primeira classe**: toda falha (pagamento recusado, sessão expirada, campo inválido) tem uma mensagem específica e um próximo passo — nunca um erro genérico.
5. **Nada aparece do nada**: toda transição de tela ou abertura de modal tem origem espacial visível (nasce do botão que foi clicado) — ajuda o usuário a entender causa e efeito, técnica emprestada da Linear.

### 2.5 Como tornar o produto intuitivo

A intuitividade não vem de tutoriais — vem de **nunca exigir que o usuário aprenda algo nesta tela que ele não usou na tela anterior.** Isso significa: mesmo padrão de botão de ação em todo lugar, mesmo padrão de confirmação, mesmo posicionamento de navegação. É a mesma lógica do Shopify Polaris: consistência absoluta = redução de carga cognitiva = sensação de "eu já sei usar isso".

**Regra de ouro do produto**: *se uma funcionalidade nova exige um manual para ser usada, ela não está pronta — está incompleta.*

---

## 3. Público

O Portal Associativo tem dois públicos com necessidades opostas: quem **compra e administra** (perfil analítico, quer controle) e quem **usa no dia a dia** (perfil leigo, quer simplicidade). O design tem que servir aos dois sem comprometer nenhum — daí o princípio (detalhado na seção 9) de que telas administrativas podem ser mais densas, mas telas do associado devem permanecer radicalmente simples.

### 3.1 Presidente — "Dona Marlene" / "Seu Antônio"

- **Quem é**: eleito ou indicado pela diretoria, normalmente por prestígio na comunidade, não por competência técnica. Idade típica: 45-70 anos. Pode ter pouquíssima prática com sistemas — usa WhatsApp e talvez Instagram, mas se assusta com qualquer tela "de empresa".
- **O que quer**: que a associação continue de pé, que a diretoria seguinte não herde bagunça, e que ele não seja pessoalmente cobrado por erro financeiro.
- **Maior medo**: ser responsabilizado por um problema que ele não sabe nem como diagnosticar ("sumiu um pagamento e eu não sei onde procurar").
- **Como o produto deve tratá-lo**: com um painel de visão geral simples (poucos números, muito claros: quantos associados em dia, quantos vencidos, quanto entrou este mês), nunca uma tela de configuração técnica como ponto de entrada.
- **Frase que ele diria**: "Eu só preciso saber se está tudo certo, sem ter que ficar catando informação."

### 3.2 Secretária — "Cida"

- **Quem é**: normalmente a pessoa mais "íntima de sistema" da diretoria, mas isso não significa técnica — significa que ela é quem preenche formulário, manda comunicado, cadastra gente nova. Faz esse trabalho manualmente hoje, em planilha e WhatsApp.
- **O que quer**: reduzir retrabalho. Hoje ela provavelmente digita a mesma informação em três lugares diferentes (planilha, grupo de WhatsApp, caderno).
- **Maior medo**: cadastrar errado e ter que refazer, ou perder informação de associado por falha do sistema.
- **Como o produto deve tratá-la**: com formulários curtos, validação em tempo real (nunca deixar ela descobrir um erro só depois de salvar), e confirmação clara de que a ação funcionou.
- **Frase que ela diria**: "Eu preciso conseguir fazer isso sem ficar perguntando pro meu filho como funciona."

### 3.3 Tesoureiro — "Seu Geraldo"

- **Quem é**: a pessoa mais ansiosa da diretoria, porque é diretamente responsável pelo dinheiro da associação perante os outros associados. Costuma ser mais cético com tecnologia especificamente quando envolve dinheiro — quer ver comprovação, não "confiar" no sistema.
- **O que quer**: nunca ser pego de surpresa. Saber, a qualquer momento, quem pagou, quem não pagou, e quanto entrou.
- **Maior medo**: uma cobrança sumir, duplicar, ou o associado alegar que pagou e o sistema "não mostrar".
- **Como o produto deve tratá-lo**: com rastreabilidade total (toda fatura tem histórico visível, todo pagamento é conferido contra a API do gateway antes de ser considerado confirmado — já é assim no webhook do Asaas, e é o padrão certo a manter e expor visualmente), e nunca escondendo um número atrás de "ver mais" quando se trata de dinheiro.
- **Frase que ele diria**: "Eu preciso conseguir provar, a qualquer momento, pra qualquer associado, que o dinheiro dele está certo."

### 3.4 Associado — "João" / "Ana"

- **Quem é**: o público mais heterogêneo — de jovens que cresceram com smartphone a idosos que usam o celular quase só para WhatsApp e ligação. É quem paga a mensalidade e quem, no fim, decide se o clube "vale a pena".
- **O que quer**: pagar sem complicação, saber que está em dia, e sentir que faz parte de algo — não ser tratado como "usuário nº 4521 de um CRM".
- **Maior medo**: pagar errado, ser cobrado duas vezes, ou perder acesso por um erro que ele não entende.
- **Como o produto deve tratá-lo**: com no máximo 2-3 ações visíveis na tela principal (pagar, ver carteirinha, falar com o clube), PIX e boleto sempre em primeiro plano ao lado do cartão (nem todo associado tem cartão de crédito — mesma lógica do Cash App ao priorizar métodos sem pré-condição), e status sempre visível sem precisar procurar.
- **Frase que ele diria**: "Eu só quero saber se estou em dia e, se não estiver, resolver em dois toques."

### 3.5 Visitante

- **Quem é**: alguém que ainda não é associado — pode estar decidindo se associa, pesquisando o clube, ou apenas curioso.
- **O que quer**: entender rapidamente o que é a associação, o que ganha ao se associar, e como se associar — sem precisar criar conta para ver informação básica.
- **Maior medo**: nenhum medo específico, mas baixa tolerância a fricção — se a primeira impressão for confusa ou datada, ele associa isso à própria associação, não só ao software.
- **Como o produto deve tratá-lo**: com uma área pública (eventos, sobre o clube, diretoria, classificados públicos) sempre acessível sem login, e um caminho de associação claro e curto.
- **Frase que ele diria**: "Antes de me associar, eu quero entender rapidinho do que se trata — sem ter que ligar pra alguém perguntar."

---

## 4. Princípios de UX

Regras não-negociáveis, aplicáveis a toda tela nova do produto — servem como checklist de revisão de design, no mesmo espírito dos princípios nomeados de Shopify Polaris e Apple HIG.

1. **Nunca mais de três cliques até a ação principal.** Pagar mensalidade, ver status, cadastrar associado — nenhuma dessas ações pode levar mais de três toques a partir da tela inicial.
2. **Nunca mais de um CTA primário por tela.** Ações secundárias existem, mas visualmente subordinadas (texto ou botão secundário). Inspirado em Apple e Linear — múltiplos CTAs de mesmo peso visual forçam o usuário a decidir o que o produto deveria decidir por ele.
3. **Sempre um caminho óbvio.** Toda tela deve responder, sem esforço de leitura, à pergunta "o que eu faço agora?". Se a resposta não é óbvia em 3 segundos, a tela falhou.
4. **Sempre feedback imediato.** Toda ação (salvar, pagar, cancelar) tem confirmação visual instantânea — nunca deixar o usuário sem saber se algo funcionou.
5. **Sempre linguagem humana.** Nenhuma mensagem de erro ou sucesso usa termo técnico, código de erro ou nome de campo de banco de dados.
6. **Nunca depender de treinamento.** Se uma funcionalidade exige explicação prévia por telefone/WhatsApp para o usuário conseguir usar, ela deve ser redesenhada antes de ser lançada.
7. **Nenhuma tela vazia sem próximo passo.** Todo estado vazio (nenhum evento cadastrado, nenhuma fatura ainda) sugere ativamente a próxima ação — nunca uma tabela ou lista literalmente em branco (princípio Notion/Slack).
8. **Toda ação irreversível tem confirmação em duas etapas com contexto.** Não basta um "tem certeza?" genérico — a confirmação mostra a consequência real (ex.: "seu plano continua valendo até 14/09" antes de confirmar cancelamento), replicando o padrão já usado no autocancelamento de assinatura.
9. **Erros e estados de falha recebem o mesmo cuidado de design que os estados de sucesso.** Nenhuma tela de erro é um placeholder genérico — cada uma explica o que aconteceu e o que fazer, princípio central do design de confiança da Stripe.
10. **Consistência absoluta entre telas do mesmo tipo.** O mesmo padrão de tabela, modal de confirmação e botão de ação em toda a área administrativa — nenhuma tela nova "inventa" um padrão próprio.
11. **Motion sempre tem propósito informativo, nunca decorativo.** Uma transição existe para ajudar o usuário a entender de onde veio e para onde vai a informação — nunca para "parecer moderno".
12. **A tela do associado é sempre mais simples que a tela equivalente do admin.** Densidade de informação é aceitável — e às vezes desejável — em telas administrativas (inspirado no Mercado Livre: mais dado visível pode gerar mais confiança quando a tarefa exige decisão). Mas a tela do associado comum segue a linha oposta: Apple/Calm/Nubank, radicalmente simples.

---

## 5. Linguagem

### 5.1 Tom de voz

Conversacional, direto, caloroso — nunca corporativo, nunca infantilizado. A régua é: *como a Cida da secretaria explicaria isso para um associado, numa boa tarde?*

Cinco regras de escrita, adaptadas do rigor documentado do Nu Design (Nubank) — "cada palavra precisa ser clara e ter significado":

1. Frases curtas. Uma ideia por frase.
2. Verbos no imperativo direto ("Pague agora", não "Você pode efetuar o pagamento").
3. Sempre explicar o "porquê" antes de pedir uma ação, especialmente quando envolve dinheiro.
4. Nunca usar voz passiva onde a voz ativa é mais clara ("Não conseguimos confirmar seu pagamento" em vez de "Seu pagamento não foi confirmado").
5. Contração e coloquialismo são bem-vindos ("Tá tudo certo por aqui") desde que não comprometam clareza para um leitor mais velho ou menos familiarizado com gírias.

### 5.2 Vocabulário — termos proibidos e recomendados

| Proibido (jargão técnico/frio) | Recomendado |
|---|---|
| Webhook, sincronizar, endpoint | (nunca expor ao associado; se necessário, "atualização automática") |
| Contato, lead, registro | Associado, sócio |
| Segmentação, engajamento, funil | (evitar por completo na interface do associado) |
| Assinatura ativa/inativa (bruto) | "Você está em dia" / "Sua mensalidade venceu" |
| Erro 404 / Erro de sistema | "Não encontramos essa página" / "Algo não funcionou — tente de novo" |
| Efetuar pagamento | Pagar |
| Realizar login | Entrar |
| CRM, AMS, plataforma (na interface do usuário) | Portal, o Clube, a associação |
| Cancelar conta | Cancelar assinatura / Sair do clube (contextual) |
| Dashboard (para associado) | Painel / Minha área |

### 5.3 Naming de telas

Nomes de tela sempre em primeira pessoa ou linguagem do dia a dia, nunca em nomenclatura de sistema:

- "Minha área" (não "Dashboard do usuário")
- "Minha carteirinha" (não "Cartão de membro")
- "Pagar mensalidade" (não "Central de cobrança")
- "Fale com o clube" (não "Central de atendimento")
- "Eventos" (não "Gestão de eventos" — isso é nome de admin, não de associado)

### 5.4 Naming de botões

Botões descrevem a ação com verbo + objeto, nunca genéricos:

- "Pagar agora" (não "Enviar" ou "Confirmar")
- "Cancelar minha assinatura" (não "Cancelar")
- "Ver minha fatura" (não "Detalhes")
- "Voltar para o painel" (não "Voltar")

### 5.5 Naming de funcionalidades (para o produto como um todo, multi-tenant)

Módulos recebem nomes descritivos e sem jargão em qualquer lugar visível ao usuário final: **Associados**, **Financeiro**, **Eventos**, **Parceiros**, **Classificados**, **Leilões**, **Comunicação**, **Diretoria** — evitando siglas internas (AMS, CRM) mesmo na documentação voltada a clientes.

---

## 6. Estratégia Visual

Esta seção define **princípios**, não peças finais — a implementação pixel-a-pixel acontece em Figma, mas toda decisão ali deve derivar destes princípios.

### 6.1 Cores

**Por que não usar azul corporativo genérico**: a pesquisa mostrou que WildApricot, GrowthZone, Fonteva, MemberClicks, CiviCRM e a maioria dos concorrentes brasileiros convergem para o mesmo "azul + branco + ícone de linha" — um visual tão genérico que dá para trocar o logo de um concorrente pelo outro sem o usuário notar diferença. Azul comunica "SaaS corporativo", não "clube que eu amo".

**Direção adotada**: uma paleta ancorada em tons quentes e terrosos — remetendo a couro, campo e tradição rural/equestre sem cair em clichê ilustrativo (nada de "textura de madeira" ou ícones de ferradura por todo lugar) — combinada com um "ink" quase-preto de altíssimo contraste para texto e estrutura, no espírito da disciplina tipográfica da Apple e da Stripe.

| Papel | Direção de cor | Racional |
|---|---|---|
| **Primária (marca)** | Terracota/couro — um tom quente, terroso, não-saturado agressivamente | Diferencia visualmente de todo concorrente pesquisado (nenhum usa essa família); remete a campo/tradição sem ilustração literal; funciona tanto em fundo claro quanto escuro |
| **Texto e estrutura** | "Tinta" quase-preta (nunca preto puro `#000`) | Alto contraste = legibilidade para público mais velho (requisito de acessibilidade, seção 12); preto puro cansa a leitura em telas — Apple e Stripe evitam por esse motivo |
| **Fundo** | Branco quente/off-white (nunca branco clínico `#FFFFFF` puro em grandes áreas) | Reduz sensação de "hospitalar"/frio identificada como problema em apps de saúde antes do redesign do Headspace; mais convidativo para leitura longa |
| **Sucesso / em dia** | Verde desaturado, nunca neon | Comunica positivo sem "gritar" — segue a lógica Calm/Headspace de evitar estridência mesmo em bons sinais |
| **Atenção / a vencer** | Âmbar desaturado | Alerta sem pânico |
| **Erro / vencido** | Vermelho-tijolo, nunca vermelho puro de alarme | Comunica seriedade sem tom de urgência agressiva — cobrança não deve parecer ameaça (princípio explícito de Calm aplicado a contexto financeiro) |
| **Acento secundário (white-label)** | Substituível por tenant | Ver seção 10 |

**Regra de contraste**: toda combinação de cor de texto/fundo é validada contra WCAG AA (mínimo 4.5:1 para texto normal) antes de entrar em produção — sem exceção, dado o público idoso.

**O que nunca fazer**: cor como único portador de significado (ex.: "ativo/inativo" nunca só verde/vermelho — sempre acompanhado de ícone e texto, requisito também de acessibilidade).

### 6.2 Tipografia

- **Família**: uma sans-serif humanista de alta legibilidade, com x-height generoso, boa renderização de acentuação em português (til, cedilha, acentos agudos/circunflexos devem ser nítidos mesmo em tamanhos pequenos) e suporte a peso variável — não uma geométrica fria (evitar o efeito "tudo parece Helvetica de novo" que a pesquisa notou como padrão genérico do setor).
- **Escala tipográfica**: base de 16px mínimo para corpo de texto na área do associado (nunca menor — público idoso), com incrementos generosos entre níveis hierárquicos, para que hierarquia seja óbvia sem depender só de cor ou peso.
- **Peso**: usar peso (regular/medium/bold) como ferramenta primária de hierarquia — não tamanho excessivo, que quebra layout em telas pequenas.
- **Números** (valores monetários, datas de vencimento): sempre com features tabulares/alinhadas, para que tabelas financeiras (visão do tesoureiro) sejam escaneáveis rapidamente.

### 6.3 Ícones

Estilo de linha único e consistente em todo o produto — nunca misturar estilos (linha + preenchido + emoji) na mesma tela. Ícones sempre acompanhados de texto ou label em contextos de ação (nunca ícone sozinho como único indicador em telas do associado — ambíguo para usuário pouco técnico).

### 6.4 Fotografia

**Princípio Airbnb aplicado diretamente**: a fotografia é a heroína, não decoração. Fotos reais do clube/associação (eventos, animais, pessoas) sempre substituem qualquer imagem de banco de imagens genérica — porque fotografia real e de qualidade é, comprovadamente (caso Airbnb), um sinal mensurável de confiança e legitimidade, não só estética. No modelo white-label, cada tenant deve poder substituir toda imagem-padrão pelas próprias fotos.

### 6.5 Ilustração

Uso comedido, monocromático ou de paleta limitada (nunca ilustração colorida "fofa" tipo app infantil — o público adulto/idoso rural não deve sentir que o produto não é "sério" o suficiente para gerir a associação dele, um risco identificado explicitamente na pesquisa sobre Notion). Ilustração é reservada a estados vazios e onboarding — nunca decoração de tela funcional.

### 6.6 Espaçamento e grid

Grid de 8px como unidade atômica (padrão amplamente validado por Airbnb, Stripe, Shopify). Espaçamento generoso — "respiro" — especialmente na área do associado: cada elemento tocável precisa de espaço suficiente ao redor para reduzir erro de toque em telas pequenas (requisito direto do público mobile/idoso).

### 6.7 Sombras e bordas

Sombras sutis, nunca decorativas — usadas exclusivamente para comunicar elevação/hierarquia (o que está "acima" do quê, ex.: modal sobre conteúdo). Bordas com raio consistente em todo o sistema (nunca misturar cantos retos com muito arredondados na mesma tela) — cantos moderadamente arredondados (não extremos) transmitem acessibilidade sem infantilizar.

### 6.8 Animação

Curta (150-250ms), sempre com origem espacial explícita (nada "aparece do nada"), nunca decorativa. Em dispositivos com "reduzir movimento" ativado no sistema operacional, toda animação não-essencial é desativada automaticamente (requisito de acessibilidade).

### 6.9 Estados

Todo componente interativo define, desde a primeira versão, seus 5 estados: padrão, hover/foco, ativo, desabilitado, erro. Nenhum componente vai para produção com apenas o estado "padrão" desenhado.

---

## 7. Design System

Lista de componentes que compõem a biblioteca única do produto — cada um usado de forma idêntica em toda tela, seguindo a regra de consistência absoluta (seção 4, princípio 10).

- **Botões** — primário (1 por tela), secundário, terciário/texto, destrutivo (sempre com confirmação associada), com estados de carregamento embutido (nunca deixar o botão "morto" sem feedback após clique).
- **Inputs** — texto, número, telefone (com máscara brasileira), CPF (com máscara e validação), moeda (formatação automática em R$), data, com validação em tempo real e mensagem de erro específica por campo (nunca erro genérico de formulário inteiro).
- **Cards** — usados para agrupar informação relacionada (evento, produto, fatura); sempre com hierarquia clara entre título, informação de suporte e ação.
- **Tabelas** — para telas administrativas de alta densidade (Mercado Livre, ver seção 4); sempre com estado vazio próprio, paginação clara, e ação principal por linha visível sem precisar de menu de contexto escondido quando possível.
- **Modais** — reservados a decisões que exigem foco total (confirmação de ação irreversível, troca de senha obrigatória); nunca usados para conteúdo que caberia numa página normal.
- **Navbar** — consistente entre área pública e área logada, com indicação clara de "onde estou" (breadcrumb implícito).
- **Sidebar** (área administrativa) — agrupamento por módulo, com o item ativo sempre visualmente óbvio.
- **Menus** — dropdown e context menu com toque generoso (mínimo 44×44px de área tocável, requisito de acessibilidade mobile).
- **Calendário** — usado em Eventos; sempre com visão mensal como padrão (mais familiar a público não-técnico que visão de agenda densa).
- **Toast** — feedback temporário e não-bloqueante para ações de sucesso; nunca usado para erros críticos (que merecem tela ou modal dedicado).
- **Badges** — para status (em dia, vencido, pendente) — sempre cor + ícone + texto, nunca cor isolada.
- **Alertas** — banners persistentes para informação que exige atenção contínua (ex.: "sua mensalidade vence em 5 dias"), diferenciados de toast pela persistência.
- **Timeline** — para histórico de pagamentos/ações (visão do tesoureiro e do associado sobre suas próprias faturas).
- **Stepper** — para fluxos de múltiplas etapas (cadastro, cancelamento de assinatura) — sempre indicando etapa atual e total de etapas.
- **Wizard** — usado para onboarding de nova associação (tenant) no modelo white-label — nunca para tarefas do dia a dia do associado comum, que devem ser diretas.
- **Empty states** — nunca uma tabela/lista literalmente vazia; sempre ilustração comedida + texto explicativo + ação sugerida (princípio Notion/Slack).
- **Skeleton** — usado durante carregamento de dados reais (nunca spinner genérico isolado) para comunicar "isto está quase pronto" e reduzir percepção de espera (ver seção 13).
- **Loading** — estados de carregamento sempre acoplados a feedback específico ("Confirmando seu pagamento..." em vez de spinner mudo).

---

## 8. Landing Page

Não é layout — é narrativa. A landing page (domínio institucional `portal-associativo.com.br`) precisa convencer dois públicos ao mesmo tempo: quem decide comprar (presidente/diretoria) e quem vai usar todo dia (associado, indiretamente, via percepção de qualidade).

### 8.1 Hero

Headline não vende funcionalidade — vende a transformação emocional: sair do caos de planilha/WhatsApp/boleto avulso para o controle simples. Segue o padrão mais eficaz encontrado na pesquisa (Join It: "Stop wrestling with spreadsheets and clunky software" — mas em tom mais caloroso, menos anti-concorrência agressivo, alinhado ao arquétipo Cuidador). CTA único e visível: "Comece agora" ou equivalente — nunca dois CTAs de peso igual competindo no hero (ver princípio 2, seção 4).

### 8.2 Benefícios

Organizados por transformação de sentimento (menos ansiedade, mais controle, mais tempo), não por lista técnica de funcionalidades — funcionalidade é prova de benefício, não o argumento em si.

### 8.3 Módulos

Apresentados com nome e propósito humano ("Financeiro — nunca mais perca o controle de quem pagou", não "Financeiro — cobrança recorrente e emissão de boletos").

### 8.4 Provas sociais

Depoimentos nomeados e específicos, com número real quando possível (ex.: "reduzimos a inadimplência em X%"), seguindo o padrão mais eficaz encontrado (Clube Control, Cllube) — nunca depoimento genérico sem contexto. Fotografia real da associação-cliente (nunca stock genérico), reforçando o princípio Airbnb de fotografia como sinal de confiança.

### 8.5 FAQ

Respondendo diretamente aos medos reais do público (ver personas, seção 3): "Preciso saber de tecnologia para usar?", "E se eu errar um cadastro?", "Meus dados e os dos associados estão seguros?", "Quanto custa e tem taxa escondida?" — a última pergunta responde diretamente ao maior ponto de fricção identificado no mercado (preço opaco em YourMembership, Fonteva, GrowthZone).

### 8.6 CTA final

Preço sempre visível e transparente na própria landing (não atrás de "fale com vendas") — diferencial direto identificado na pesquisa (Join It e Clube Control como únicas exceções positivas no mercado inteiro).

---

## 9. Produto

Princípios específicos por módulo — todos derivados dos princípios gerais de UX (seção 4), aplicados ao contexto de cada área.

### 9.1 Dashboard

Para o associado: no máximo 3 informações em destaque (status de pagamento, próximo evento, atalho para carteirinha). Para o admin: visão geral por números grandes e claros (associados em dia/vencidos, receita do mês) antes de qualquer tabela densa — segue o padrão de "termômetro" do Mercado Livre, tornando o estado geral da associação legível em segundos.

### 9.2 Financeiro

A área mais sensível do produto — aplica diretamente os princípios de confiança da Stripe: todo estado de pagamento (pendente, processando, recusado, confirmado) tem tela/mensagem própria; toda fatura é rastreável a qualquer momento; nunca se esconde o motivo de uma falha de pagamento atrás de linguagem vaga.

### 9.3 Eventos

Calendário como ponto de entrada (visão mensal), inscrição em no máximo 2 passos, confirmação imediata e visível — nunca deixar o associado sem saber se a inscrição "pegou".

### 9.4 Leilões

Estado do lote (aberto, em disputa, encerrado, arrematado) sempre visível sem ambiguidade — mesmo princípio de badge cor+ícone+texto da seção 7; contagem regressiva clara para reduzir ansiedade de "perder o lance por não saber a hora".

### 9.5 Classificados

Publicação simples (poucos campos obrigatórios), moderação transparente para quem publica (sempre saber se está pendente, aprovado ou recusado, com motivo quando recusado).

### 9.6 Parceiros

Vitrine simples, sem fricção de navegação — o objetivo é que o associado descubra o benefício em segundos, não que navegue por um catálogo complexo.

### 9.7 CMS

Interface de edição de conteúdo (banners, sobre, diretoria) desenhada para quem nunca usou um CMS — sempre pré-visualização antes de publicar, nunca a possibilidade de "quebrar" o site publicando algo incompleto sem aviso.

### 9.8 Painel Master (SaaS)

Única área do produto onde densidade de informação alta é não apenas aceitável, mas desejável (o usuário aqui é o operador do próprio Portal Associativo, perfil técnico) — mas mesmo aqui, os princípios de consistência visual (mesmo design system) nunca são abandonados.

### 9.9 Área Administrativa

Segue o modelo Shopify Polaris quase diretamente: administrador não-técnico, tarefas de alto peso (gerir dinheiro/pessoas de verdade) — cada tela precisa responder "o que eu preciso fazer aqui, e eu sei fazer sozinho?" antes de ir para produção.

### 9.10 Área do Associado

O padrão mais rígido de simplicidade do produto inteiro — aplicação direta e sem exceção da linha Apple/Calm/Nubank: poucas telas, poucas decisões, sempre status visível, sempre um caminho óbvio.

---

## 10. White Label

O Portal Associativo atende múltiplas associações (multi-tenant) sob um único produto — o desafio, identificado como lacuna de todo concorrente pesquisado, é permitir que cada associação "sinta" o produto como próprio sem fragmentar a experiência nem a manutenção.

### 10.1 O que pode ser personalizado por tenant

- **Nome e logotipo** da associação, exibidos em posição de destaque (cabeçalho, carteirinha digital, e-mails).
- **Cor de acento secundário** — dentro de uma paleta pré-validada para contraste/acessibilidade (nunca cor livre sem checagem, para não comprometer legibilidade).
- **Fotografia real** da associação em heróis, banners e estados vazios (substituindo qualquer imagem-padrão do sistema).
- **Domínio próprio** (ex.: `clubedocavalobonfim.com.br`), servindo a mesma aplicação (arquitetura já mapeada em `SAAS_MULTITENANT.md`).
- **Módulos habilitados** — cada associação ativa apenas os módulos relevantes ao seu contexto (ex.: Leilões pode não fazer sentido para uma associação de bairro).
- **Textos de nicho pontuais** (ex.: nomenclatura de categoria de sócio) — dentro de um vocabulário controlado, nunca texto livre que quebre o tom de voz definido na seção 5.

### 10.2 O que nunca pode ser alterado

- **Tipografia base, grid, espaçamento e componentes do design system** — a estrutura visual é sempre a mesma; muda a "roupa", não o "esqueleto".
- **Cor primária de estrutura (tinta/texto) e cores semânticas (sucesso/atenção/erro)** — mudar isso comprometeria acessibilidade e reconhecimento consistente de estado entre tenants.
- **Princípios de UX** (seção 4) — nenhum tenant pode "pedir" uma exceção que quebre um princípio (ex.: dois CTAs primários na mesma tela) por preferência pessoal de um diretor.
- **Tom de voz e vocabulário-base** (seção 5) — cada associação pode ter nome próprio de categoria de sócio, mas nunca jargão técnico exposto ao usuário final.
- **Fluxos críticos** (pagamento, cancelamento, autenticação) — o caminho é sempre o mesmo, testado e validado uma vez, replicado para todos.

### 10.3 Como manter consistência entre associações diferentes

A resposta não é "restringir customização" — é **separar claramente o que é marca do tenant (superficial, seguro de trocar) do que é sistema do produto (estrutural, nunca trocado)**, exatamente como Shopify permite que cada loja pareça "sua" sem que o admin do lojista mude de padrão de um lojista para outro. Um tenant nunca deve conseguir, através de configuração, produzir uma tela que quebre um dos princípios de UX da seção 4.

---

## 11. Mobile First

Nenhum concorrente pesquisado nasceu mobile-first — todos tratam celular como responsividade de um portal desktop, ou como app secundário incompleto. Essa é a maior oportunidade estrutural identificada na pesquisa, e o Portal Associativo a adota como princípio central, não feature adicional.

1. **Toda tela é desenhada primeiro para tela pequena, depois expandida** — nunca o inverso (nunca "encolher" uma tela desktop densa até caber no celular).
2. **Toque generoso**: área mínima de 44×44px para qualquer elemento tocável (requisito também de acessibilidade — dedos maiores, menos precisão em usuários mais velhos).
3. **Uma coluna como padrão** em telas do associado — nunca layout multi-coluna que exija zoom ou scroll horizontal.
4. **Ações principais sempre ao alcance do polegar** (parte inferior da tela em fluxos críticos como pagamento) — não presas no topo, fora do alcance natural de uso com uma mão.
5. **PIX e boleto sempre em pé de igualdade com cartão** na experiência mobile — nem todo associado tem cartão de crédito; esconder esses métodos atrás de mais cliques penaliza justamente o público que mais precisa deles (princípio emprestado do Cash App: métodos sem pré-condição em primeiro plano).
6. **Formulários curtos e por etapas** em vez de formulário único longo — mais fácil de completar com uma mão, em movimento, com conexão instável (contexto rural relevante).
7. **Funciona bem com conexão fraca** — carregamento progressivo, nunca uma tela em branco enquanto tudo carrega de uma vez (ver seção 13).
8. **Carteirinha digital e comprovantes acessíveis offline** sempre que tecnicamente possível — relevante em áreas rurais com conectividade instável.

---

## 12. Acessibilidade

Diretrizes baseadas em WCAG 2.1, nível AA como piso mínimo (não aspiracional) — dado que o público inclui, de forma estrutural e não excepcional, pessoas mais velhas com possíveis limitações de visão, audição ou destreza motora.

1. **Contraste mínimo 4.5:1** para texto normal e 3:1 para texto grande/elementos gráficos — checado em toda combinação de cor antes de entrar em produção (ver seção 6.1).
2. **Nunca cor como único portador de significado** — todo estado (ativo/inativo, pago/vencido) sempre acompanhado de ícone e/ou texto.
3. **Tamanho de fonte mínimo de 16px** no corpo de texto da área do associado; suporte total a zoom do navegador/sistema sem quebra de layout.
4. **Área de toque mínima de 44×44px** em qualquer elemento interativo, com espaçamento suficiente entre alvos adjacentes para evitar toque acidental.
5. **Navegação completa por teclado** em toda a área administrativa, com foco visível e ordem de tabulação lógica.
6. **Compatibilidade com leitor de tela**: toda imagem informativa com texto alternativo, todo formulário com label associado corretamente (não apenas placeholder), toda ação assíncrona anunciada via região viva (`aria-live`) quando relevante.
7. **Respeito à preferência de movimento reduzido** do sistema operacional — animações não-essenciais desativadas automaticamente quando o usuário configurou isso no dispositivo.
8. **Linguagem simples como requisito de acessibilidade cognitiva**, não apenas estilo — texto direto beneficia tanto o usuário com baixa literacia digital quanto qualquer pessoa com dificuldade de leitura.
9. **Mensagens de erro sempre associadas ao campo específico**, nunca apenas um resumo genérico no topo do formulário — essencial para quem usa leitor de tela navegar direto ao problema.
10. **Testes de acessibilidade real** (não apenas ferramenta automatizada) incluindo usuários representativos do público real do produto — idealmente incluindo associados de mais idade, sempre que uma tela crítica for redesenhada.

---

## 13. Performance Percebida

Velocidade não é só benchmark técnico — é uma emoção que o produto precisa transmitir ativamente, especialmente porque conectividade instável em contexto rural é a realidade, não a exceção.

1. **Skeleton screens em vez de spinner isolado** para qualquer carregamento de dados reais — comunica "isto está quase pronto" e reduz a sensação de espera (técnica usada por praticamente todo produto moderno de referência pesquisado).
2. **Feedback instantâneo e otimista para ações do usuário** — ao clicar em "pagar" ou "salvar", a interface reage imediatamente (estado de carregamento no próprio botão), mesmo que a confirmação real do servidor leve alguns segundos — escondendo a latência de rede em vez de deixar o usuário encarando uma tela estática (princípio Linear).
3. **Carregamento progressivo, nunca tudo-ou-nada**: o essencial da tela (status, ação principal) carrega primeiro; informação secundária (histórico completo, gráficos) pode carregar depois, sem bloquear a interação principal.
4. **Toda ação crítica confirma seu resultado explicitamente** — nunca deixar o usuário "supor" que funcionou; uma mensagem clara de sucesso é tão importante quanto a velocidade real da operação para a percepção de confiabilidade.
5. **Compressão agressiva de imagem** (já praticado no projeto — compressão a ~200KB no Storage) como padrão obrigatório em qualquer novo módulo com upload de imagem, dada a realidade de conexão rural.
6. **Cache local de informação não-sensível** (ex.: role de usuário já em uso via `sessionStorage`) para evitar releituras desnecessárias e telas de carregamento repetidas em navegação comum.

---

## 14. Evolução do Produto

Como este documento — e o produto que ele descreve — permanecem vivos e consistentes conforme o Portal Associativo cresce de um cliente (CCBMG) para múltiplos tenants e novos módulos.

### 14.1 Como novos módulos devem ser criados

Todo módulo novo passa por um checklist derivado direto deste documento antes de ir para produção:

1. Serve ao propósito da marca (seção 1.1) — fortalece o vínculo associação–associado, não é só tarefa administrativa disfarçada?
2. Segue os 12 princípios de UX (seção 4) sem exceção?
3. Usa exclusivamente componentes do design system existente (seção 7) — nenhum componente novo é criado sem antes verificar se um já existente resolve?
4. Segue o vocabulário e tom de voz definidos (seção 5) — sem jargão técnico exposto?
5. Foi desenhado mobile-first (seção 11) e passa no piso de acessibilidade AA (seção 12)?
6. Pode ser habilitado/desabilitado por tenant sem quebrar consistência visual (seção 10)?

### 14.2 Como manter consistência

Nenhuma tela nova é aprovada por decisão unilateral de quem a construiu — todo componente ou padrão novo passa por comparação explícita com o que já existe no design system antes de virar exceção. Divergência visual não documentada é tratada como bug, não como decisão de design.

### 14.3 Como novas funcionalidades devem ser desenhadas

Sempre partindo da pergunta "qual é o caminho *único* e recomendado?" (princípio Linear) antes de "quais opções eu ofereço?" — a régua de qualidade não é quantidade de configuração, é clareza de caminho.

### 14.4 Como novas telas devem ser nomeadas

Seguindo as regras da seção 5.3/5.4 sem exceção: linguagem de primeira pessoa/dia a dia para o associado, nome descritivo de ação para admin — nunca nomenclatura de sistema ou sigla interna em qualquer superfície visível ao usuário.

### 14.5 Como manter o Design System vivo

- Este documento é revisado a cada expansão relevante do produto (novo módulo, novo mercado vertical, redesign de fluxo crítico) — não é escrito uma vez e esquecido; é o principal aprendizado negativo tirado da pesquisa de mercado (nenhum concorrente pesquisado demonstrou disciplina de manutenção visual de longo prazo).
- Toda divergência encontrada entre o produto real e este documento é tratada como dívida técnica de design, com a mesma prioridade dada a dívida técnica de código.
- Qualquer decisão que fuja destes princípios exige justificativa explícita registrada (por quê, o que resolve, o que sacrifica) — nunca uma exceção silenciosa.

---

## Anexo A — Metodologia e fontes de pesquisa

Este documento foi produzido a partir de cinco frentes de pesquisa de mercado, realizadas via busca e leitura direta de sites oficiais, documentação de design systems públicos, e agregadores de avaliação (G2, Capterra, TrustRadius, Reclame Aqui), em agosto de 2026:

1. **Concorrentes internacionais — grupo 1**: WildApricot, Glue Up, Member365, ClubExpress, Raklet.
2. **Concorrentes internacionais — grupo 2**: Join It, GrowthZone, Neon CRM, Fonteva, YourMembership, MemberClicks, CiviCRM.
3. **Concorrentes brasileiros**: Softaliza, Associatec, Hinova/SGA, Clubes Associados, Cllube, Clube Control, Aclon (Pacto), Society, HiGestor, Clube Conecta, CastorWeb — incluindo sub-pesquisa dedicada ao setor equestre (Hippogest, Equites, App do Cavalo, Horse Manager, ABQM, ABCCH, ABCCMM, ABCPCC) e ao segmento de CDLs/ACIs/sindicatos.
4. **Referências de design fora do segmento — grupo 1**: Apple, Stripe, Notion, Linear, Airbnb, Shopify.
5. **Referências de design fora do segmento — grupo 2**: Slack, Arc Browser, Cash App, Headspace, Calm, Banco Inter, Nubank, Mercado Livre.

Os cinco relatórios brutos de pesquisa — com citações literais de reviews, tabelas de precificação, prints de posicionamento e listas completas de fontes/URLs — foram usados como insumo direto para cada decisão registrada neste documento e podem ser recuperados junto à equipe que produziu esta versão para consulta detalhada ponto a ponto, caso alguma decisão precise ser revisitada ou expandida no futuro.

**Achados centrais que sustentam este documento** (repetidos ao longo do texto onde aplicável):

- Todo concorrente relevante do setor sofre da mesma falha: marketing moderno, produto datado (WildApricot, GrowthZone, ClubExpress, YourMembership, CiviCRM).
- Preço opaco é a reclamação nº 1 mais citada (YourMembership) — publicar preço é exceção rara e valorizada (Join It, Clube Control).
- Nenhum concorrente, nacional ou internacional, é mobile-first de verdade.
- Nenhum concorrente comunica pertencimento/identidade cultural — todos soam como CRM corporativo genérico.
- O nicho equestre/rural brasileiro não tem nenhum concorrente direto sério — é gerido hoje, em grande parte, por planilha e WhatsApp.
- Empresas fora do segmento que resolveram simplicidade de verdade (Apple, Stripe, Shopify, Nubank) tratam isso como critério de engenharia nomeado e verificável, não como estética — é esse padrão de rigor que este documento tenta replicar.
