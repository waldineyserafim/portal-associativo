# Portal Associativo — Experience Architecture (XA)

> **Documentos-fonte obrigatórios (única fonte de verdade acima deste):** [`BRAND_DESIGN_SYSTEM.md`](BRAND_DESIGN_SYSTEM.md), [`CREATIVE_DIRECTION.md`](CREATIVE_DIRECTION.md) e [`VISUAL_IDENTITY.md`](VISUAL_IDENTITY.md). Nenhuma decisão abaixo contradiz esses três documentos; este documento **não redecide** marca, cor, tipografia, tom de voz ou símbolo — ele organiza a **experiência e a arquitetura de informação** que aplica essas decisões a cada tela, jornada e fluxo do produto.
> **Checagem de consistência (obrigatória antes de prosseguir):** revisão completa dos três documentos-fonte não encontrou nenhuma inconsistência a resolver. Este documento herda, sem alteração: os 12 princípios de UX (Brand Design System §4), as 5 personas (§3), o vocabulário proibido/recomendado (§5), o design system de componentes (§7), a arquitetura white-label (§10), os princípios mobile-first (§11), acessibilidade AA (§12) e performance percebida (§13); da Creative Direction herda a composição de um-ponto-focal (§9), o grid de 8px (§10), os 105 anti-patterns (§16) e as duas checklists de revisão (§17-18); da Visual Identity herda o símbolo Medalha-Portal e as regras de uso do logotipo. Onde este documento propõe uma estrutura nova (sitemap, jornadas, wireframes conceituais, Painel Master, tokens), ele cita explicitamente de qual princípio-fonte deriva — nenhuma decisão aqui é arbitrária.
> **Escopo:** este documento é exclusivamente arquitetural. Não contém HTML, CSS, JavaScript, Figma, wireframes gráficos, mockups ou protótipos — apenas estrutura, hierarquia, fluxo e justificativa, no formato descritivo já estabelecido pelos documentos-fonte.
> **Grounding:** o inventário de telas, coleções e fluxos citado abaixo reflete o estado real do código hoje (`FEATURES.md`, `ADMIN.md`, `SAAS_MULTITENANT.md`) — este documento não inventa telas que não existem nem finge que gaps conhecidos (ex.: resolução de tenant por domínio, ainda não implementada — `SAAS_MULTITENANT.md` G1) já estão prontos. Onde a experiência descrita é **aspiracional** (landing institucional, Painel Master expandido), isso é sinalizado explicitamente.
> **Para quem é este documento:** designers, desenvolvedores, IA (Claude, ChatGPT), Figma, e qualquer pessoa que precise tomar uma decisão de UX ou de arquitetura da informação no Portal Associativo — do zero, sem precisar perguntar a ninguém.

---

## Sumário

1. [Experience Principles](#1-experience-principles)
2. [Information Architecture](#2-information-architecture)
3. [Jornada do Usuário](#3-jornada-do-usuário)
4. [Navegação](#4-navegação)
5. [Wireframes Conceituais](#5-wireframes-conceituais)
6. [Sistema de Componentes](#6-sistema-de-componentes)
7. [Mobile Experience](#7-mobile-experience)
8. [Landing Page Architecture](#8-landing-page-architecture)
9. [Painel Master](#9-painel-master)
10. [White Label Experience](#10-white-label-experience)
11. [UX Writing](#11-ux-writing)
12. [Acessibilidade](#12-acessibilidade)
13. [Performance Percebida](#13-performance-percebida)
14. [Design Tokens](#14-design-tokens)
15. [Checklist de UX](#15-checklist-de-ux)
16. [UX Constitution](#16-ux-constitution)
17. [Roadmap — Próxima Etapa](#17-roadmap--próxima-etapa)

---

## 1. Experience Principles

Os 12 princípios do Brand Design System (§4) regem *interação*. Os princípios abaixo regem especificamente **arquitetura da informação e navegação** — como o usuário se move pelo produto inteiro, não só dentro de uma tela. Nenhum contradiz os 12 originais; todos derivam deles, aplicados ao nível de sitemap/jornada.

| # | Princípio | Deriva de | Por que funciona primeiro no mobile |
|---|---|---|---|
| 1 | **Uma decisão por tela.** Nunca duas perguntas de peso igual na mesma tela. | Brand DS §4.2 | Em tela pequena, duas decisões forçam scroll e comparação — em desktop isso já é ruído; no celular é abandono. |
| 2 | **Nunca mais de 3 toques até a ação principal.** Pagar, ver status, cadastrar associado. | Brand DS §4.1 | Cada toque extra em conexão rural instável (§11 do Brand DS) é uma chance real de perda de sessão. |
| 3 | **O usuário nunca fica perdido — "onde estou" é sempre visível**, mesmo sem breadcrumb literal (nome da seção no topo, item ativo destacado). | Anti-pattern #95, #17 | Tela pequena não cabe breadcrumb tradicional; "onde estou" precisa ser resolvido por hierarquia visual, não por texto extra. |
| 4 | **Sempre mostrar o próximo passo — nunca terminar uma tela em beco sem saída.** Toda tela final de um fluxo aponta para onde ir depois. | Brand DS §4.7 (empty states) estendido a todo fim de fluxo | Sem mouse para "explorar", o usuário mobile só tem o que está na tela — se não há próximo passo óbvio, ele sai do produto. |
| 5 | **Sempre explicar consequências antes de agir**, nunca depois. | Brand DS §4.8 | Correção de erro em formulário mobile é mais cara (digitar de novo é mais lento) — prevenir é mais barato que corrigir. |
| 6 | **Sempre reduzir ansiedade: nenhuma tela nova introduz um conceito não visto antes** sem explicação embutida. | Brand DS §2.5 | Público pouco técnico não tem paciência ou contexto para "descobrir" — em mobile isso é agravado pela tela pequena, que já reduz a quantidade de pistas visuais disponíveis. |
| 7 | **Sempre dar sensação de progresso** em qualquer fluxo de mais de uma etapa (stepper, indicador "passo X de Y"). | Brand DS §7 (Stepper) | Formulários mobile são preenchidos aos poucos, às vezes interrompidos (ligação, sinal caindo) — saber "quanto falta" reduz a chance de abandono ao retomar. |
| 8 | **Nunca depender de treinamento** — nenhuma tela pressupõe que o usuário já usou um sistema parecido antes. | Brand DS §2.5, regra de ouro | Não há "colega do lado" para perguntar no celular, ao contrário do computador da secretaria — a tela precisa se explicar sozinha. |
| 9 | **A profundidade máxima de menu para qualquer tarefa comum é de 2 níveis.** | Anti-pattern #17 | Menus profundos exigem múltiplos toques precisos em alvos pequenos — cada nível a mais multiplica o risco de erro de toque. |
| 10 | **Busca existe onde a lista pode crescer sem limite** (associados, classificados, lotes de leilão) — nunca como enfeite em telas de conteúdo fixo. | Brand DS §7 | Rolar uma lista longa com o polegar é a pior forma de "buscar" no mobile — campo de busca é sempre mais rápido que scroll. |
| 11 | **CTA principal sempre ao alcance do polegar**, nunca preso no topo em fluxos críticos (pagamento, confirmação). | Brand DS §11.4 | Uso de uma mão é o padrão real do público do produto — a "thumb zone" (ver §7) dita onde a ação principal deve estar fisicamente na tela. |
| 12 | **Nenhum menu ou navegação exige hover para ser descoberto.** Tudo que existe em desktop por hover precisa de um equivalente por toque. | Requisito técnico de mobile-first | Não existe hover em touchscreen — qualquer dependência de hover é, por definição, uma feature invisível no mobile. |
| 13 | **A informação mais importante da tela nunca está "abaixo da dobra" sem indicação de que há mais conteúdo.** | Composição, Creative Direction §9 | Em tela pequena a "dobra" acontece muito mais cedo — sem uma pista visual de continuidade (ex. card cortado), o usuário mobile assume que a tela acabou ali. |
| 14 | **Toda ação irreversível tem confirmação em duas etapas com contexto real**, nunca "tem certeza?" genérico. | Brand DS §4.8 | Erro de toque é mais comum no mobile (alvo pequeno, dedo grande) — a segunda etapa é a rede de segurança específica para esse tipo de erro. |
| 15 | **Um caminho recomendado, não múltiplas opções de mesmo peso** (princípio Linear, Brand DS Anexo A). | Creative Direction §15.3 | Decidir entre opções exige comparação — comparar em tela pequena é mais lento e mais cansativo do que em desktop; menos opções = decisão mais rápida. |
| 16 | **Toda tela tem exatamente um objetivo primário — mesmo telas administrativas densas.** Densidade de dado não é a mesma coisa que densidade de decisão. | Brand DS §4.12, §9 | Mesmo em telas com mais dado visível (admin), a *ação* que a tela pede precisa continuar única — senão a densidade vira ambiguidade. |
| 17 | **Áreas públicas (sem login) e áreas logadas nunca compartilham navegação idêntica** — a transição de "visitante" para "associado" deve ser sentida na própria estrutura de menu, não só no conteúdo. | IA, §2 deste documento | Reduz o risco real de um visitante achar que já é associado (ou vice-versa) só pela aparência do menu — comunicação de estado por estrutura, não só por texto. |
| 18 | **Nenhuma funcionalidade nova é adicionada à navegação principal sem remover ou consolidar algo** — a barra de navegação nunca cresce sem limite. | Anti-pattern #72, Lei de Hick | Espaço de navegação mobile é fisicamente finito (bottom nav cabe 4-5 itens no máximo) — cada item novo compete por esse espaço escasso. |
| 19 | **O nome de cada item de menu é a tarefa, não o módulo técnico** ("Pagar mensalidade", não "Financeiro › Cobrança"). | Brand DS §5.3 | Em tela pequena não há espaço para dois níveis de rótulo — o nome do item precisa comunicar a tarefa sozinho. |
| 20 | **Toda jornada crítica (associar-se, pagar, cancelar) pode ser completada inteiramente pelo celular, sem exigir desktop em nenhuma etapa.** | Brand DS §11 | É o teste definitivo de mobile-first: se uma etapa só funciona bem em desktop, o produto não é mobile-first, é "responsivo". |
| 21 | **Área administrativa também funciona no celular**, mesmo que o uso típico seja em desktop — nenhuma tela admin é "desktop-only" por design. | Brand DS §9.9, mobile-first §11.1 | O tesoureiro/secretária real frequentemente resolve tarefas rápidas (conferir um pagamento, aprovar um classificado) pelo celular, entre outras tarefas do dia — negar isso é ignorar o público real. |
| 22 | **Toda navegação tem um caminho de volta óbvio e único** — nunca dois botões de "voltar" com comportamentos diferentes na mesma tela. | Anti-pattern #22 (adaptado), consistência | Ambiguidade de "voltar" é uma das causas mais comuns de desorientação em usuários com baixa familiaridade digital. |
| 23 | **Nenhuma tela é acessível apenas por link direto sem também existir um caminho de navegação até ela** — exceto comprovantes/tokens de uso único (ex. `event_comprovante.html`) e `pages/login.html` do site institucional (ver nota abaixo), que são exceções documentadas, não padrão. | IA, §2 | Telas "órfãs" (só alcançáveis por URL direta) quebram a sensação de mapa mental do produto — o usuário nunca sabe se "existe mais alguma coisa" que ele não está vendo. |
| 24 | **A arquitetura de informação é a mesma para todos os tenants** — só o conteúdo e a marca mudam (branding), nunca a estrutura de menu ou hierarquia de página. | Brand DS §10.2, White Label | Consistência estrutural entre tenants é o que permite a qualquer pessoa da equipe (ou usuário que já usou outro tenant) se orientar imediatamente em qualquer instância do produto. |
| 25 | **Toda seção nova da IA precisa responder "essa informação existe em algum lugar do produto hoje?" antes de criar uma seção nova** — duplicação de informação em dois lugares diferentes é tratada como bug de arquitetura. | Anti-pattern #38 (adaptado) | Cada lugar novo onde a mesma informação pode estar é mais um lugar que pode ficar desatualizado — e mais uma decisão de "onde eu olho isso mesmo?" para o usuário. |
| 26 | **Documentação e ajuda vivem dentro do fluxo onde a dúvida acontece, nunca em uma seção "Central de Ajuda" isolada e genérica como único recurso.** | Brand DS §2.4 (progressive disclosure) | Ninguém no público-alvo vai "navegar até uma central de ajuda" por iniciativa própria — a ajuda precisa estar contextual, no ponto exato da dúvida. |

**Nota sobre a exceção do princípio #23 — `pages/login.html` (site institucional):** essa tela é o ponto de entrada do Login Master (cross-tenant, §2.2) e foi removida deliberadamente da navbar e do rodapé em ago/2026 — competia por atenção com os CTAs de conversão comercial (Agendar demonstração/WhatsApp) sem servir a nenhum visitante do público-alvo (presidente, diretoria, associado). Fica acessível só por URL direta, conhecida pela equipe operadora da plataforma, e é marcada `noindex, nofollow` para nunca ser descoberta por busca. Diferente de `event_comprovante.html` (token de uso único, uma pessoa por link), aqui a mesma URL serve permanentemente a mesma audiência restrita — por isso registrada aqui como uma segunda categoria de exceção válida ao princípio #23: **acesso operacional/administrativo de audiência restrita e conhecida**, não conteúdo do visitante comum.

---

## 2. Information Architecture

### 2.1 Dois domínios, duas arquiteturas de informação

O produto vive em **dois espaços fundamentalmente diferentes**, decisão já registrada como recomendação em `SAAS_MULTITENANT.md` §4.3 e adotada aqui como definição de arquitetura da informação:

| Espaço | Domínio | Público | Contém dado de alguma organização-cliente? |
|---|---|---|---|
| **Site institucional/comercial** | `portal-associativo.com.br` | Quem decide comprar (presidente/diretoria de uma associação ainda não-cliente) | Não — zero dado de tenant, zero login de associado |
| **Portal de cada organização-cliente (tenant)** | domínio próprio do cliente (ex. `clubedocavalobonfim.com.br`) | Associados, diretoria, visitantes daquela associação específica | Sim — toda a experiência do produto real |

Essa separação **não é só técnica** (ver G1/G4 em `SAAS_MULTITENANT.md`) — é uma decisão de arquitetura da informação: misturar as duas IAs no mesmo sitemap confundiria "site que vende o produto" com "produto em si", repetindo exatamente a falha nº1 identificada no Brand Design System (Anexo A: "distância entre o site de vendas e o produto real" — aqui invertida: o risco de os dois se misturarem ao ponto de o visitante não saber se está vendo o produto de um cliente real ou o material de vendas).

### 2.2 Sitemap — Site Institucional (`portal-associativo.com.br`)

*Aspiracional — este site ainda não existe (ver §17, Roadmap). Estrutura definida aqui para que a implementação da Landing Page (próxima etapa) não precise decidir IA durante o desenvolvimento.*

```
portal-associativo.com.br
├── / (Home / Landing)
├── /planos (Planos e preços — transparente, Brand DS §1.7.3)
├── /funcionalidades (Módulos do produto, um a um)
├── /segmentos (Para quem é: clubes equestres, associações de bairro, entidades de classe...)
├── /clientes (Prova social — casos reais, nunca genéricos)
├── /sobre (Missão, propósito — Brand DS §1.1)
├── /contato (Fale com o time comercial)
├── /documentacao (Central de ajuda pública — manuais, FAQ estendido)
├── /faq (respostas às dúvidas mais ansiosas — Brand DS §8.5)
├── /login (login master — cross-tenant, Serafim Technologies)
└── /termos, /privacidade (LGPD — obrigatório, CLAUDE.md §Segurança e LGPD)
```

**Lógica de cada seção:**

- **Home**: converte visitante em decisão de "isso é pra mim" — ver arquitetura completa em §8.
- **Planos**: existe separada da Home porque é a página mais visitada por quem já decidiu considerar o produto e quer o número antes de continuar — nunca "fale com vendas" (Brand DS §1.7.3, anti-pattern #47/#70).
- **Funcionalidades**: um por módulo, com nome humano (Brand DS §5.5) — serve quem já passou do "isso resolve meu problema" e quer detalhe antes de decidir.
- **Segmentos**: existe porque o produto começa vertical (clube equestre) mas a arquitetura já é horizontal (Brand DS §1.3) — essa página é onde um segmento novo (ex. associação de bairro) se reconhece sem precisar "traduzir" a linguagem equestre mentalmente.
- **Clientes**: prova social dedicada, separada da Home, para quem quer aprofundar antes de decidir — nunca depoimento sem rosto (anti-pattern #69).
- **Documentação/FAQ**: pública, sem login — reduz dependência de suporte humano para dúvidas recorrentes (anti-pattern #65 adaptado: self-service sempre que possível).
- **Login master**: cross-tenant por definição (`SAAS_MULTITENANT.md` §5.5) — vive no site institucional, nunca em nenhum tenant, porque não pertence a nenhuma organização-cliente específica.

### 2.3 Sitemap — Portal de cada tenant (estado real do produto hoje)

Estrutura efetivamente implementada (fonte: `FEATURES.md`, `ADMIN.md`), organizada por camada de acesso — esta é a IA que qualquer novo módulo deve respeitar (Experience Principle #24).

```
{dominio-do-tenant}
│
├── ÁREA PÚBLICA (sem login)
│   ├── / — Home (index.html)
│   ├── /sobre — Sobre o Clube
│   ├── /diretoria — Diretoria (board.html)
│   ├── /parceiros — Parceiros
│   ├── /eventos — Eventos públicos
│   │     └── /eventos/inscricao?eventoId= — Inscrição (sem login, valida sócio por CPF)
│   │           └── /eventos/comprovante?token= — Comprovante + QR (acesso por posse de token)
│   ├── /galeria — Fotos
│   └── /classificados — Classificados públicos (criação exige login)
│
├── CADASTRO / LOGIN / PAGAMENTO
│   ├── /cadastro — Signup (associado ou participante de leilão)
│   ├── /entrar — Login (CPF → e-mail interno)
│   ├── /redefinir-senha — Self-service via SMS
│   ├── /pagar — Regularização de fatura (redireciona ao checkout Asaas)
│   └── /pagamento-confirmado — Confirmação
│
├── ÁREA DO ASSOCIADO (login: role associado/admin/master)
│   ├── /minha-area — Dashboard (pg_associado.html)
│   ├── /produtos — Produtos exclusivos
│   └── /servicos — Serviços exclusivos
│
├── LEILÕES (módulo opcional por tenant)
│   ├── /leiloes — Listagem pública de lotes
│   ├── /leiloes/{lotId} — Detalhe do lote / lances
│   ├── /leiloes/cadastrar — Cadastro de lote (associado)
│   └── /leiloes/meus-lotes — Gestão dos próprios lotes
│
├── ÁREA ADMINISTRATIVA (login: role admin/master/adminView)
│   ├── /admin — Hub
│   ├── /admin/associados — Central de Gestão de Associados (financeiro incluso)
│   ├── /admin/produtos, /admin/servicos — CRUD de catálogo
│   ├── /admin/classificados — Moderação
│   ├── /admin/eventos, /admin/inscricoes — CMS de eventos + gestão de inscrições
│   ├── /admin/banners, /admin/diretoria, /admin/galeria, /admin/parceiros, /admin/sobre — CMS institucional
│   ├── /admin/conteudo — Dashboard somente-leitura do CMS
│   └── /admin/leiloes — Aprovação, vendas/repasses, participantes
│
└── PAINEL MASTER (login isolado, role master — cross-tenant por definição)
    ├── /master/entrar — Login master
    ├── /master — Hub / Dashboard
    ├── /master/organizacoes — CRUD de organizações-cliente
    ├── /master/configuracoes — Configurações globais da plataforma
    └── /master/faturamento — Faturamento SaaS (cobrança da Serafim Technologies aos tenants)
```

**Nota de arquitetura**: o Painel Master hoje é servido dentro do mesmo domínio do tenant (`login_master.html` existe fisicamente ao lado das páginas do Bonfim), o que é uma inconsistência de IA face à definição de "cross-tenant por definição" — a resolução correta de longo prazo é o Painel Master viver sob o site institucional (junto de `/login`, §2.2), não em cada domínio de cliente. Registrado aqui como item de arquitetura a resolver, não como decisão já tomada (depende de G1/G4 de `SAAS_MULTITENANT.md`).

### 2.4 Regras de organização da navegação

1. **Área pública nunca exige login para informação institucional** — só cadastro, financeiro e ação (dar lance, publicar classificado) pedem conta (Brand DS §3.5).
2. **A fronteira entre "área pública" e "área do associado" é a mais crítica de toda a IA** — é o ponto de conversão de visitante para associado, e também o ponto onde o bloqueio por inadimplência intercepta o fluxo (login → `pay.html` antes de `pg_associado.html`, já implementado — `CLAUDE.md` §Autocancelamento). Essa interceptação é, ela mesma, uma decisão de IA: financeiro pendente é sempre resolvido *antes* de qualquer outra tela da área logada, nunca depois.
3. **Módulos habilitáveis por tenant** (Leilões, Classificados, Eventos, etc., `organizations/{orgId}.modules`) significam que o sitemap **não é fixo entre tenants** — é sempre o sitemap completo menos os módulos desativados. Nenhuma tela deve assumir "todo tenant tem X módulo" — toda navegação precisa checar `checkModuleEnabled()` antes de exibir o item (já implementado, `firebase.js`).
4. **Um único hub por camada de acesso** (`admin.html`, `admin_master.html`) — nunca dois pontos de entrada concorrentes para a mesma camada.

---

## 3. Jornada do Usuário

Convenção: cada jornada lista **ponto de entrada → objetivo → etapas → pontos de ansiedade → pontos de abandono → pontos de confiança → momento decisivo**.

### 3.1 Visitante (ainda não associado, tenant real)

- **Entrada**: link do WhatsApp/Instagram do clube, busca no Google, indicação de outro associado.
- **Objetivo**: entender o que é a associação e decidir se associa.
- **Etapas**: Home → Sobre/Eventos/Galeria (exploração livre, sem ordem fixa) → decisão de se associar → Cadastro.
- **Pontos de ansiedade**: "isso é confiável?", "quanto custa mesmo?", "vou saber usar?".
- **Pontos de abandono**: Home carrega devagar ou parece datada (efeito estética-usabilidade, Creative Direction §1.4) → visitante sai antes mesmo de ler texto; formulário de cadastro longo demais.
- **Pontos de confiança**: fotografia real (nunca banco de imagens, Brand DS §6.4), diretoria visível com nome e foto (`board.html`), eventos reais e recentes na Galeria.
- **Momento decisivo**: o botão de cadastro — precisa estar visível sem precisar procurar, em qualquer página pública (Experience Principle #2).

### 3.2 Cliente (comprador do SaaS — Presidente/Diretor/Tesoureiro decidindo adotar o produto)

*Jornada no site institucional (§2.2), aspiracional.*

- **Entrada**: indicação de outro clube já cliente, busca orgânica, prospecção comercial.
- **Objetivo**: decidir se substitui a planilha/WhatsApp atual pelo Portal Associativo.
- **Etapas**: Home institucional → Planos (preço transparente) → Funcionalidades/Segmentos → FAQ (respondendo aos medos específicos, Brand DS §8.5) → Contato/Demo → Onboarding.
- **Pontos de ansiedade**: "isso vai dar trabalho pra implementar?", "minha diretoria não vai saber usar", "e se eu quiser cancelar depois?".
- **Pontos de abandono**: preço escondido atrás de formulário (anti-pattern #70 — nunca deve acontecer aqui); processo de onboarding longo (anti-pattern #51 — implantação de 90-180 dias é o padrão de falha a evitar).
- **Pontos de confiança**: caso real do Bonfim como prova (Brand DS §1.3, "primeiro cliente em produção"), preço publicado, FAQ respondendo objeções sem soar defensivo.
- **Momento decisivo**: o preço — é o ponto onde o produto se diferencia de todo concorrente pesquisado (Brand DS Anexo A) — precisa estar visível sem fricção.

### 3.3 Associado (uso comum, jornada mais frequente do produto)

- **Entrada**: link de login enviado por WhatsApp pela secretaria, ou acesso direto salvo no celular.
- **Objetivo mais comum**: saber se está em dia; objetivo secundário: pagar, ver carteirinha, ver eventos.
- **Etapas**: Login (CPF) → (se inadimplente, interceptado por `pay.html` antes de qualquer outra tela) → Minha área → ação específica.
- **Pontos de ansiedade**: "esqueci minha senha", "não sei se paguei mesmo", "não quero ser cobrado de novo por engano".
- **Pontos de abandono**: fluxo de redefinição de senha com fricção (mitigado — já é self-service via SMS); tela de pagamento sem clareza do motivo de recusa (anti-pattern #60).
- **Pontos de confiança**: status financeiro sempre visível sem precisar calcular (`finance/summary.activeUntil`, já implementado — Brand DS §2.4); confirmação imediata pós-pagamento.
- **Momento decisivo**: o primeiro pagamento pelo Portal — se for tranquilo, a confiança no produto se generaliza para todo o resto do uso (efeito documentado em Creative Direction §1.4, primeira impressão decide julgamento de facilidade).

### 3.4 Administrador (Secretária — cadastro e comunicação)

- **Entrada**: login direto na área administrativa (mesmo domínio, role diferente).
- **Objetivo**: cadastrar associado novo, atualizar dado cadastral, moderar classificado, publicar evento.
- **Etapas**: `admin.html` (hub) → módulo específico → ação → confirmação.
- **Pontos de ansiedade**: "vou cadastrar errado e vou ter que refazer tudo", "isso já foi salvo mesmo?".
- **Pontos de abandono**: formulário de cadastro (`admin_associados.html`) sem validação em tempo real; falta de confirmação visível pós-salvamento (anti-pattern #21).
- **Pontos de confiança**: `logAction()` registrando cada ação relevante (auditoria — embora hoje incompleta em `admin_associados.html`, ver `TECH_DEBT.md`, é o mecanismo correto e deve ser completado); mensagens de sucesso específicas.
- **Momento decisivo**: o primeiro cadastro bem-sucedido de um associado novo — se ela sente que "não precisou perguntar pro filho como funciona" (Brand DS §3.2), o produto ganhou a secretaria como usuária confiante.

### 3.5 Presidente (visão geral, não operação do dia a dia)

- **Entrada**: acesso pontual, geralmente para "ver como está a associação".
- **Objetivo**: confirmar que está tudo certo, sem precisar catar informação.
- **Etapas**: `admin.html` → visão geral de associados (tiers Pendentes/Ativos/Inativos, `admin_associados.html`) — nunca precisa entrar em detalhe de nenhum associado individual, salvo exceção.
- **Pontos de ansiedade**: "e se tiver algo errado que eu não sei ver?", "sou eu quem responde se sumir dinheiro".
- **Pontos de abandono**: painel sem números grandes e claros logo de cara — se ele precisa "procurar" a resposta, a tela falhou (Brand DS §9.1).
- **Pontos de confiança**: agrupamento por exceção já implementado em `admin_associados.html` (Pendentes aberto por padrão, Ativos/Inativos recolhidos) — ele vê primeiro exatamente o que precisa de atenção.
- **Momento decisivo**: a primeira vez que ele confere um número no painel contra o que já sabia de memória e bate — a partir daí ele confia no painel sem precisar reconferir.

### 3.6 Tesoureiro (financeiro, jornada de maior tensão emocional)

- **Entrada**: acesso recorrente e frequente, especificamente na aba Financeiro de `admin_associados.html`.
- **Objetivo**: provar, a qualquer momento, para qualquer associado, que o dinheiro dele está certo (Brand DS §3.3).
- **Etapas**: `admin_associados.html` → filtro financeiro → conferência de fatura individual → registro de pagamento manual (quando fora do fluxo Asaas) ou consulta de status.
- **Pontos de ansiedade**: "e se o sistema mostrar um valor diferente do que o associado alega ter pago?", "e se eu registrar errado?".
- **Pontos de abandono**: histórico de fatura sem rastreabilidade clara; ausência de confirmação de sincronização com o gateway de pagamento.
- **Pontos de confiança**: toda fatura tem `asaasPaymentId` (idempotência) e histórico auditável (`CLAUDE.md` §Firestore Schema); webhook valida pagamento diretamente na API Asaas antes de confirmar (anti-fraude, já implementado).
- **Momento decisivo**: a primeira reconciliação bem-sucedida entre o que o associado alegou e o que o sistema mostra — é aqui que o tesoureiro para de "desconfiar do sistema" e passa a usá-lo como prova.

### 3.7 Secretária (comunicação e suporte de primeira linha)

- **Entrada**: uso quase diário, tarefas variadas e intercaladas.
- **Objetivo**: reduzir retrabalho — parar de digitar a mesma informação em três lugares (Brand DS §3.2).
- **Etapas**: varia por tarefa — cadastro, atualização de CMS (eventos, banners), moderação de classificados, atendimento a dúvida de associado (usando o sistema como fonte de verdade em vez de "confiar de memória").
- **Pontos de ansiedade**: "o associado vai me ligar perguntando algo que eu não sei responder rápido".
- **Pontos de abandono**: telas de CMS sem pré-visualização antes de publicar (Brand DS §9.7) — medo de "quebrar" o site público.
- **Pontos de confiança**: soft-delete em todo CMS (nunca exclusão física, `ADMIN.md`) — ela sabe que pode desfazer um erro.
- **Momento decisivo**: a primeira vez que ela resolve uma dúvida de um associado ao vivo, consultando o painel na hora, sem precisar dizer "te retorno depois que eu verificar".

---

## 4. Navegação

### 4.1 Navbar — área pública (tenant)

- **Estrutura**: logo do tenant à esquerda (nunca o símbolo genérico do Portal Associativo sozinho — ver §10, White Label) + até 5-6 itens de navegação + CTA de login/cadastro à direita, sempre visualmente destacado do resto do menu (Experience Principle #19, anti-pattern #72).
- **Sticky**: sim, no desktop e no mobile — o caminho de volta e o login precisam estar sempre a um toque de distância, em qualquer ponto de scroll (Experience Principle #22).
- **Itens habilitados dinamicamente**: cada item de navegação corresponde a um módulo habilitável (`applyModuleVisibility()`) — a navbar nunca mostra um link para um módulo desativado naquele tenant.

### 4.2 Menu mobile (área pública e área do associado)

- **Padrão**: menu "hambúrguer" com painel deslizante (drawer) full-height, nunca dropdown compacto — cada item precisa de área de toque generosa (mínimo 44×44px, Brand DS §12.4).
- **Ordem dos itens**: replica exatamente a ordem da navbar desktop (Experience Principle #24, consistência entre breakpoints) — nunca uma reorganização "só porque é mobile".
- **Fechamento**: toque fora do drawer ou "X" explícito — nunca depende de gesto que o público real possa não conhecer (ex. swipe sem indicação visual).

### 4.3 Bottom Navigation (área do associado, mobile)

- **Quando usar**: exclusivamente na área logada do associado, mobile, para as 2-3 ações mais frequentes (Minha área, Pagar/Financeiro, Eventos) — nunca na área pública (que já tem CTA único de conversão) nem na área administrativa (densidade de tarefas não cabe em 3-4 ícones fixos).
- **Justificativa mobile-first**: é a aplicação direta do princípio "ações principais sempre ao alcance do polegar" (Brand DS §11.4) — subir a navegação mais frequente para a "thumb zone" (ver §7.1) em vez de deixá-la presa no topo.
- **Máximo de itens**: 4, nunca mais — cada item precisa de rótulo de texto visível junto ao ícone (Brand DS §6.3, nunca ícone sozinho).

### 4.4 Sidebar (área administrativa, desktop) / Menu por módulo (mobile)

- **Desktop**: sidebar fixa, agrupada por módulo, item ativo sempre com destaque visual óbvio (Brand DS §7).
- **Mobile**: colapsa para o mesmo padrão de drawer da área pública (§4.2) — a sidebar nunca é "encolhida" para ícones sem texto no mobile (Experience Principle #21: admin funciona no celular, com o mesmo padrão de menu já usado em outras áreas — não um padrão inventado só para admin mobile).
- **Hub como página inicial**: `admin.html` e `admin_master.html` são sempre o destino do item raiz de cada camada — nunca um redirecionamento automático para o módulo "mais usado", que quebraria a previsibilidade de onde o menu leva.

### 4.5 Footer

- **Área pública (tenant)**: contato do clube, links institucionais (Sobre, Diretoria), redes sociais — nunca poluído com dezenas de links (anti-pattern #77). Espaço para branding do tenant (White Label, §10).
- **Site institucional**: além do acima, links legais (Termos, Privacidade — LGPD), e única menção a "Portal Associativo" com o símbolo (aqui sim, a marca-mãe aparece — é o único contexto em que faz sentido, por não pertencer a nenhum tenant).
- **Área logada (associado/admin)**: footer minimalista ou ausente — o espaço vertical em mobile é escasso demais para gastar com links que o usuário logado raramente usa (prioriza o conteúdo funcional da tela).

### 4.6 Breadcrumb

- **Onde existe**: apenas em áreas administrativas com profundidade real de 2 níveis (ex. `admin_associados.html` → aba Financeiro de um associado específico) — nunca na área pública ou do associado, onde a profundidade máxima já é 1-2 telas (Experience Principle #9).
- **Formato**: sempre linguagem de tarefa, nunca nomenclatura técnica ("Associados › João Silva", não "users › {uid}").

### 4.7 Pesquisa (busca)

- **Onde existe**: `admin_associados.html` (busca de associado — lista pode crescer sem limite), `classificados.html`, `leiloes.html`, catálogos de produtos/serviços (Experience Principle #10).
- **Onde nunca existe**: telas de conteúdo fixo e pequeno (Diretoria, Parceiros) — campo de busca ali seria ruído sem utilidade real.
- **Comportamento**: busca client-side simples (já implementado nas telas atuais) para volumes pequenos/médios; caso o volume cresça (multi-tenant com muitos associados), migrar para busca server-side sem mudar a posição/comportamento visual do campo.

### 4.8 CTA

- **Um CTA primário por tela**, sempre com maior peso visual (cor, tamanho, posição — Creative Direction §9.2) — ações secundárias são sempre botão secundário/texto.
- **Texto do CTA sempre específico**: "Pagar mensalidade", nunca "Continuar" (Brand DS §5.4, anti-pattern #73).

### 4.9 Hierarquia geral de navegação (todas as camadas)

| Camada | Profundidade máxima | Ponto de entrada único | Navegação lateral/topo |
|---|---|---|---|
| Área pública | 2 níveis (Home → seção → detalhe, ex. evento) | `/` | Navbar |
| Área do associado | 1-2 níveis (Minha área → seção específica) | `/minha-area` | Navbar + bottom nav (mobile) |
| Área administrativa | 2 níveis (Hub → módulo → aba interna, ex. Financeiro) | `/admin` | Sidebar |
| Painel Master | 2 níveis (Hub → módulo) | `/master` | Sidebar (variante master) |

---

## 5. Wireframes Conceituais

*Descrição estrutural — hierarquia, ordem visual, CTA, conteúdo, espaçamento e responsividade. Nenhum desenho, nenhum layout pixel a pixel.*

### 5.1 Home (tenant, pública)

- **Mobile (base)**: 1 coluna. Ordem: navbar sticky → hero (foto real do clube em largura total + headline curta + CTA único "Associe-se"/"Entrar") → bloco "próximos eventos" (2-3 cards em carrossel horizontal, scroll por toque) → bloco "sobre o clube" resumido com link para página completa → bloco parceiros (logos, scroll horizontal) → footer.
- **Tablet**: hero mantém 1 coluna (fotografia grande continua sendo a heroína — Brand DS §6.4); blocos de evento passam a 2 colunas.
- **Desktop**: hero ganha texto e imagem lado a lado (nunca dois CTAs de peso igual); blocos de evento em grade de 3 colunas.
- **Espaçamento**: grid de 8px (Creative Direction §10); respiro generoso entre blocos, nunca linha divisória onde espaço resolve (Creative Direction §8.2).

### 5.2 Login (`/entrar`)

- **Estrutura única, sem exceção de layout por breakpoint** (formulário já é naturalmente 1 coluna): logo do tenant → campo CPF (com máscara) → campo senha → CTA primário "Entrar" → link secundário "Esqueci minha senha" → link terciário "Ainda não é associado? Cadastre-se".
- **Hierarquia**: CTA "Entrar" é o único elemento de alto contraste da tela — os dois links são texto simples, nunca botão.
- **Feedback de erro**: mensagem específica por tipo de falha (CPF não encontrado vs. senha incorreta) — nunca "credenciais inválidas" genérico, mas também nunca revelando qual dos dois campos está errado por segurança (padrão já correto de autenticação — mensagem única "CPF ou senha incorretos", com foco de acessibilidade no campo de senha).

### 5.3 Minha Área — Dashboard do Associado (`/minha-area`)

- **Mobile (base)**: 1 coluna, vertical, sem ramificação (Creative Direction §9.3). Ordem: saudação + nome → badge de status financeiro (maior elemento de contraste da tela, sempre visível sem scroll — "acima da dobra") → CTA condicional ("Pagar agora" se pendente, ou nada se em dia) → atalho para carteirinha → carrossel de destaques (produtos/serviços/classificados) → lista "minhas inscrições em eventos" → bottom nav.
- **Regra de ouro desta tela**: no máximo 3 informações em destaque (Brand DS §9.1) — status, próximo evento, atalho de carteirinha. Tudo o mais é secundário, abaixo da dobra.
- **Modal de primeiro acesso**: interrompe a tela inteira (backdrop estático, sem botão fechar) — única exceção ao princípio "nunca bloquear o usuário sem saída", justificada por ser uma troca de senha obrigatória de segurança, já com prazo e escopo claros.

### 5.4 Pagar mensalidade (`/pagar`)

- **Estrutura**: valor e vencimento em destaque máximo (maior elemento tipográfico da tela, alinhamento tabular — Brand DS §6.2) → explicação curta do que está sendo cobrado → CTA único "Pagar agora" (redireciona ao checkout Asaas) → estado de espera com feedback específico ("Aguardando confirmação do pagamento…", nunca spinner mudo) → link secundário discreto para cancelamento de assinatura (Experience Principle #14, sempre com contexto antes de confirmar).
- **Thumb zone**: CTA "Pagar agora" fixo próximo à base da tela em mobile (Brand DS §11.4).

### 5.5 Central de Gestão de Associados — admin (`/admin/associados`)

- **Estrutura por exceção** (já implementada e validada, mantida como padrão de referência): 3 tiers colapsáveis — Pendentes (aberto por padrão, vermelho), Ativos (recolhido, verde), Inativos (recolhido, cinza) — nunca uma lista plana única.
- **Indicadores no topo**: números grandes clicáveis como filtro (Total, Pendentes, Vence em 7 dias, Sem plano, Sem sinc., Inativos) — aplica o "termômetro" do Mercado Livre (Brand DS §9.1) de forma consistente com o resto do produto.
- **Mobile**: os indicadores viram um carrossel horizontal de cards (não cabem em grade fixa); os tiers continuam colapsáveis, cada linha de associado expande para revelar ações (nunca menu de contexto escondido, Brand DS §7).
- **Ação principal por linha**: sempre na mesma posição horizontal em toda linha, em qualquer breakpoint (Creative Direction §9.3, fluxo em F para telas densas).

### 5.6 Hub Administrativo (`/admin`)

- **Estrutura**: grade de módulos (cards com nome de tarefa, não de tabela técnica — Experience Principle #19) + bloco "Integrações" separado visualmente (ações de auditoria/sincronização em massa, sempre com confirmação prévia).
- **Mobile**: grade colapsa para lista vertical de cards em largura total.

### 5.7 Painel Master — Hub (`/master`)

- **Estrutura**: KPIs cross-tenant em destaque no topo (total de organizações, organizações ativas) → tabela de organizações → atividade recente (`systemLogs`). Ver arquitetura completa em §9.
- **Diferença estrutural da área admin comum**: aqui, e só aqui, densidade alta é o padrão desde a primeira dobra — o usuário master é, por definição, o operador técnico da própria plataforma (Brand DS §9.8).

---

## 6. Sistema de Componentes

Extensão do inventário já definido no Brand Design System (§7) — aqui com a regra explícita de "quando usar / quando evitar" pedida para este documento. Nenhum componente novo é criado; esta seção é a camada de *uso*, a biblioteca em si continua sendo a do documento-fonte.

| Componente | Quando utilizar | Quando evitar |
|---|---|---|
| **Botão primário** | Uma vez por tela, para a ação que a tela existe para viabilizar. | Nunca duas vezes na mesma tela — se duas ações parecem igualmente importantes, uma delas precisa virar secundária (Brand DS §4.2). |
| **Botão secundário/texto** | Ações que existem mas não competem com a primária (ex. "Cancelar", "Voltar"). | Nunca com mais contraste visual que o primário — isso inverteria a hierarquia. |
| **Botão destrutivo** | Exclusão, cancelamento, desativação — sempre acoplado a confirmação em duas etapas. | Nunca sem confirmação, mesmo em telas administrativas de uso frequente (anti-pattern #92). |
| **Card** | Agrupar informação relacionada com uma ação clara (evento, produto, fatura, lote de leilão). | Nunca para conteúdo que não tem ação nem hierarquia interna — nesse caso é só uma lista. |
| **Tabela** | Telas administrativas de alta densidade, onde comparação entre linhas é a tarefa real. | Nunca na área do associado — informação do associado é sempre card ou lista simples, nunca tabela (Brand DS §4.12). |
| **Modal** | Decisão que exige foco total: confirmação irreversível, troca de senha obrigatória. | Nunca para conteúdo que caberia numa página normal — um modal com scroll interno longo é sinal de que deveria ser uma tela. |
| **Drawer (menu mobile)** | Navegação mobile de qualquer camada (§4.2). | Nunca para formulário longo — um drawer não é lugar de digitar muito. |
| **Toast** | Confirmação de sucesso de ação rápida (salvou, copiou link). | Nunca para erro crítico ou informação que precisa permanecer visível — toast desaparece sozinho, não é lugar de mensagem que exige ação. |
| **Alerta (banner persistente)** | Informação que exige atenção contínua até ser resolvida ("sua mensalidade vence em 5 dias"). | Nunca mais de um banner simultâneo na mesma tela — múltiplos banners competem e comunicam descontrole (Creative Direction §11.4). |
| **Badge** | Status (em dia, vencido, pendente, aprovado) — sempre cor + ícone + texto. | Nunca cor isolada como único portador de significado (Brand DS §6.1, requisito de acessibilidade). |
| **Timeline** | Histórico de pagamentos/ações — visão do tesoureiro e do associado sobre as próprias faturas. | Nunca como log técnico bruto — sempre narrativa legível ("Pagamento confirmado em 03/08", nunca "PAYMENT_RECEIVED"). |
| **Stepper** | Fluxo de múltiplas etapas visíveis de uma vez (cadastro, onboarding de tenant). | Nunca para um fluxo de 2 etapas simples (cancelamento de assinatura já usa confirmação em 2 passos sem precisar de stepper visual completo). |
| **Wizard** | Onboarding de nova organização-cliente (Painel Master) — tarefa rara, complexa, guiada. | Nunca para tarefa do dia a dia do associado ou do admin comum — essas são sempre diretas, de tela única. |
| **Empty state** | Toda lista/tabela vazia (nenhum evento, nenhuma fatura, nenhum classificado ainda). | Nunca uma tabela literalmente em branco sem texto nem ação sugerida (anti-pattern implícito, Brand DS §7). |
| **Skeleton** | Qualquer carregamento de dado real, em qualquer camada. | Nunca spinner isolado sem contexto para carregamento de conteúdo — spinner mudo é reservado a ações pontuais com texto de acompanhamento (Brand DS §13.1). |
| **Busca** | Listas que podem crescer sem limite (§4.7). | Nunca em telas de conteúdo fixo e pequeno. |
| **Calendário** | Módulo Eventos, visão mensal como padrão. | Nunca visão de agenda densa como padrão — só mensal, mais familiar ao público leigo (Brand DS §7). |
| **Filtro/segmentação visual** | Listas administrativas densas (associados, leilões). | Nunca como campo de texto livre exigindo sintaxe (anti-pattern #94/#20) — sempre seletor visual guiado. |

---

## 7. Mobile Experience

### 7.1 Thumb Zone e Reachability

- O terço inferior da tela é a área de alcance natural do polegar em uso de uma mão (padrão de ergonomia mobile amplamente documentado, consistente com o público real do produto — uso no campo, muitas vezes com uma mão ocupada). CTAs primários de fluxos críticos (pagar, confirmar) vivem nessa faixa.
- O terço superior é reservado a *informação*, nunca a ação primária — é onde o usuário olha, não onde ele toca primeiro.
- Elementos de navegação de uso frequente (bottom nav, §4.3) vivem no terço inferior por essa mesma razão.

### 7.2 Gestos

- **Aceitos**: toque, scroll vertical nativo, swipe horizontal em carrosséis com indicação visual clara de que há mais conteúdo (nunca swipe "escondido" como único caminho).
- **Nunca exigidos como único caminho**: nenhuma ação crítica depende de gesto não-óbvio (long-press, swipe multi-dedo) — sempre existe um botão visível equivalente, porque o público real não tem por que conhecer gestos "avançados" de app.

### 7.3 Scroll

- Sempre nativo, nunca customizado com física alterada (Creative Direction §7.6) — qualquer alteração de comportamento de scroll é imprevisível para quem já aprendeu como scroll "deveria" se comportar em qualquer outro app do celular (Lei de Jakob).

### 7.4 Feedback

- Todo toque em elemento interativo tem resposta visual imediata (mudança sutil de estado) — crítico no mobile porque não há cursor para indicar "isto é clicável" antes do toque acontecer (Creative Direction §7.3).

### 7.5 Tamanho mínimo dos elementos

- 44×44px para qualquer alvo tocável, com espaçamento suficiente entre alvos adjacentes para evitar toque acidental (Brand DS §12.4, Lei de Fitts citada em Creative Direction §8.2).
- Nunca dois elementos tocáveis próximos o suficiente para causar ambiguidade em dedos maiores (público mais velho, requisito de acessibilidade motora).

### 7.6 Espaçamento

- Espaço em branco aumenta, nunca diminui, em telas mobile do associado comparado ao equivalente administrativo (Creative Direction §8.2, item 5) — a régua de simplicidade é sempre mais rígida no mobile do público leigo.

### 7.7 Responsividade — filosofia

- Toda tela nasce em coluna única (mobile) e **expande** para grid de colunas (tablet → desktop) — nunca o processo inverso de "encolher" um layout desktop (Experience Principle #20, Brand DS §11.1). O grid de 12 colunas (Creative Direction §10.3) é a versão expandida do mobile, não o ponto de partida.

---

## 8. Landing Page Architecture

*Arquitetura apenas — a narrativa já está definida no Brand Design System §8; este documento organiza a estrutura de seções em detalhe suficiente para que nenhuma decisão de ordem, hierarquia ou propósito precise ser tomada durante a implementação (ver §17, Roadmap).*

| Seção | Propósito (por que existe) | Conteúdo | CTA | Prova de que funciona (fonte) |
|---|---|---|---|---|
| **1. Hero** | Converter em 3 segundos: "isso é sobre o meu tipo de associação" + alívio (Creative Direction §12.2). | Fotografia real grande de uma associação-cliente real + headline emocional (não funcional) + subheadline curta. | Único, ex. "Comece agora" — nunca dois CTAs de peso igual (Brand DS §8.1). | Efeito estética-usabilidade (Creative Direction §1.4) — julgamento acontece antes da leitura. |
| **2. Benefícios** | Comunicar transformação de sentimento, não lista técnica. | 3-4 blocos "menos ansiedade / mais controle / mais tempo", cada um com uma frase curta e concreta. | Nenhum (seção informativa, sem CTA próprio). | Brand DS §8.2: "funcionalidade é prova de benefício, não o argumento em si". |
| **3. Módulos/Funcionalidades** | Mostrar competência organizada sem sobrecarregar. | Um módulo por vez, nome humano + propósito humano (Brand DS §8.3) — nunca grade densa de 10 ícones simultâneos (Creative Direction §12.2). | Link secundário "Ver todas as funcionalidades" → página `/funcionalidades`. | Anti-pattern #66 (evitar clichê de SaaS) explicitamente descartado aqui. |
| **4. Segmentos** | Visitante de um segmento diferente do equestre se reconhece rapidamente. | 3-4 cards de segmento (clube equestre, associação de bairro, entidade de classe...), cada um linkando para `/segmentos`. | Link secundário por card. | Brand DS §1.3 (expansão horizontal planejada desde a origem). |
| **5. Prova social** | Pertencimento e validação por semelhança. | Depoimentos nomeados, com cargo e foto real, número concreto quando possível (Brand DS §8.4). | Nenhum, ou link para `/clientes`. | Anti-pattern #69 (depoimento sem rosto tem valor ~zero). |
| **6. Preço/Planos** | Resolver a objeção nº1 do setor antes que o visitante precise perguntar. | Tabela de planos transparente, sem "fale com vendas" (Brand DS §8.6). | CTA "Ver planos completos" → `/planos`, ou CTA de conversão direto se a página já é `/planos`. | Anexo A do Brand DS: preço opaco é a reclamação nº1 do setor inteiro. |
| **7. FAQ** | Acolher as dúvidas mais ansiosas sem soar defensivo. | Perguntas nas palavras do usuário real ("Preciso saber de tecnologia pra usar?"), nunca reformuladas em tom técnico (Brand DS §8.5). | Nenhum, ou link para `/faq` completo. | Anti-pattern #71 (FAQ que evita a pergunta difícil mina confiança). |
| **8. CTA final** | Convite calmo, nunca urgência artificial. | Repetição do CTA do hero, com contexto adicional (ex. "Fale com a gente" como alternativa a "Comece agora"). | Único, mesmo verbo/tom do hero. | Creative Direction §12.2: "o arquétipo Cuidador nunca pressiona". |
| **9. Rodapé** | Navegação secundária + confiança institucional (CNPJ, contato, LGPD). | Links institucionais, redes sociais, termos/privacidade — nunca poluído (anti-pattern #77). | Nenhum CTA de conversão aqui (já esgotado na seção 8). | — |

**Ordem é deliberada, não arbitrária**: cada seção só existe depois que a anterior já resolveu a objeção correspondente — reconhecimento (hero) → benefício (2) → competência (3-4) → confiança social (5) → objeção de preço (6) → objeção de dúvida remanescente (7) → decisão (8). Reordenar qualquer seção quebra essa progressão de confiança (Creative Direction §12.3, "ritmo").

**Ritmo visual**: alternância entre blocos densos (texto + prova) e blocos de respiro quase vazios (fotografia grande, frase curta) — nunca uma rolagem contínua de densidade uniforme (Creative Direction §12.3).

---

## 9. Painel Master

*Arquitetura da experiência — não implementação. Estado real de hoje descrito em `ADMIN.md`/`SAAS_MULTITENANT.md`; esta seção organiza a experiência-alvo, sinalizando explicitamente onde diverge do que já existe.*

| Módulo | Propósito | Estrutura da experiência | Estado hoje |
|---|---|---|---|
| **Dashboard** | Visão instantânea da saúde da plataforma inteira, cross-tenant. | Números grandes no topo (organizações totais/ativas, MRR/ARR) → tabela de organizações → atividade recente (`systemLogs`). Sempre segmentável por organização, nunca só somado (corrige G8, `SAAS_MULTITENANT.md`). | Implementado, mas KPIs somam todos os tenants sem segmentação (`admin_master.html`, `ADMIN.md` item 4) — gap conhecido, não novo. |
| **Organizações** | CRUD de clientes (tenants) da plataforma. | Lista → detalhe por organização (identidade, visual/branding, domínio, módulos, integrações, financeiro — ver `SAAS_MULTITENANT.md` §7) → ação de suspender/reativar com confirmação contextual (Experience Principle #14). | Implementado parcialmente (`admin_master_associacoes.html`) — falta a expansão de campos de branding/domínio/integrações proposta em `SAAS_MULTITENANT.md` §7. |
| **Planos** | Definição dos planos SaaS oferecidos aos clientes (não confundir com planos de mensalidade do associado dentro de cada clube). | Lista de planos (starter/professional/enterprise/custom) → módulos incluídos por plano → preço. | Hoje hardcoded e duplicado em 3 arquivos (`ADMIN.md` item 2, `SAAS_MULTITENANT.md` G11) — a experiência-alvo é uma única fonte de verdade editável aqui, nunca no código. |
| **Financeiro** | Faturamento da Serafim Technologies aos clientes (SaaS). | Lista de assinaturas por organização → status (ativa/inadimplente/cancelada) → MRR/ARR calculado, sempre vinculado a uma organização real existente (corrige G3 do `admin_master_faturamento.html`, hoje `orgId` é texto livre). | Implementado de forma manual, sem gateway (`ADMIN.md`). |
| **Domínios** | Gestão de qual domínio resolve para qual organização. | Lista de domínios → status de verificação (pendente/verificado/suspenso) → organização vinculada — espelha a proposta de coleção `domains/{hostname}` (`SAAS_MULTITENANT.md` §3.2). | **Não existe hoje** — depende de G1/G4 (`SAAS_MULTITENANT.md`). Aspiracional. |
| **Usuários** | Visão cross-tenant de usuários `role:"master"` (equipe da Serafim Technologies) — nunca usuários finais de tenants individuais (isso é `admin/associados`, dentro de cada tenant). | Lista simples de operadores master, com ação de convite/revogação. | Não existe como tela dedicada hoje — usuários master são geridos diretamente no Firestore. Aspiracional. |
| **Logs** | Auditoria cross-tenant de ações sensíveis (criação/suspensão de organização, alteração de plano). | Lista cronológica, linguagem humana (nunca log técnico bruto, anti-pattern #104), filtrável por organização. | Parcialmente implementado (`systemLogs`, exibido nos últimos 20 itens do hub) — cobertura incompleta (`TECH_DEBT.md`). |
| **Suporte** | Canal para organizações-cliente reportarem problema/dúvida direto à Serafim Technologies. | Fila simples de solicitações por organização, com status (aberto/respondido/resolvido). | **Não existe hoje.** Aspiracional — necessário à medida que o número de tenants cresce além do relacionamento direto informal atual. |
| **Configurações** | Configuração global da plataforma (não de uma organização específica). | Nome/URL da plataforma, e-mails de notificação, informações somente-leitura de infraestrutura. | Implementado (`admin_master_configuracoes.html`) — dois botões hoje chamam Cloud Functions inexistentes (`TECH_DEBT.md` item 1) — gap de implementação, não de arquitetura. |

**Princípio central do Painel Master (herdado de Brand DS §9.8)**: é a única área do produto onde densidade alta é desejável desde a primeira dobra — o usuário aqui é a própria equipe operadora da plataforma, perfil técnico por definição. Mesmo assim, os componentes usados são exatamente os mesmos do resto do sistema (§6) — densidade nunca justifica reinventar um padrão de tabela, filtro ou confirmação.

---

## 10. White Label Experience

*Complementa diretamente Brand Design System §10 e Creative Direction §14 — aqui sob a lente de arquitetura de experiência e navegação.*

### 10.1 O que muda por tenant (sempre seguro)

- Nome, logotipo e cor de acento secundário do tenant, exibidos na navbar, footer, e-mails e carteirinha (Brand DS §10.1).
- Fotografia real do tenant em heróis, banners e estados vazios.
- Módulos habilitados/desabilitados no sitemap (§2.3) — a IA "completa menos os módulos desligados" é, ela mesma, a forma correta de personalização estrutural (nunca uma IA diferente por tenant, apenas um subconjunto da mesma IA).
- Domínio próprio.
- Nomenclatura pontual de nicho (ex. categoria de sócio) — dentro de vocabulário controlado (Brand DS §10.1).

### 10.2 O que nunca muda (esqueleto)

- A estrutura de navegação em si (§2, §4) — profundidade de menu, posição de navbar/sidebar/bottom nav, ordem das seções da Home e da Landing.
- O símbolo Medalha-Portal da marca-mãe "Portal Associativo" — nunca personalizado por tenant (Visual Identity §Mini Brand Book, item 10). O que aparece em destaque no tenant é a marca do clube, não a do produto — a marca-mãe permanece discreta (rodapé, "powered by").
- Os componentes do design system (§6) e os tokens (§14).
- Os princípios de UX e de arquitetura da informação deste documento e do Brand Design System §4 — nenhum tenant "pede" uma navegação diferente por preferência de um diretor (Brand DS §10.2).
- Fluxos críticos (login, pagamento, cancelamento) — o caminho é sempre o mesmo, testado uma vez, replicado para todos.

### 10.3 Analogia de governança (herdada de Creative Direction §14.1)

Rede de pousadas bem administrada: cada unidade (tenant) tem caráter local reconhecível, mas qualquer pessoa que já usou um tenant reconhece instantaneamente a estrutura, o padrão de navegação e os detalhes de interação ao entrar em outro. Toda solicitação de customização passa pelo teste: **muda a "roupa" (seguro) ou muda o "esqueleto" (proibido)?** — se ambíguo, sobe para revisão de arquitetura antes de ser implementada (Creative Direction §14.4).

---

## 11. UX Writing

Extensão do vocabulário e tom já definidos no Brand Design System §5, aplicados especificamente aos padrões de escrita que a arquitetura da experiência introduz (navegação, confirmação, estado vazio) — não redefine tom de voz, aplica-o a contextos novos deste documento.

### 11.1 Botões (padrão)

| Contexto | Padrão | Nunca |
|---|---|---|
| Ação principal financeira | Verbo + objeto específico: "Pagar mensalidade" | "Enviar", "Confirmar", "OK" |
| Ação destrutiva | Verbo + objeto + consequência implícita: "Cancelar minha assinatura" | "Cancelar" sozinho |
| Navegação de volta | "Voltar para o painel" | "Voltar" sozinho, sem destino explícito |
| Ação secundária de navegação institucional | "Ver planos e preços" | "Saiba mais", "Clique aqui" (anti-pattern #73) |

### 11.2 Mensagens de erro

Sempre três partes: **o que aconteceu** (em linguagem humana) + **por que** (quando souber) + **o que fazer agora**. Exemplo já correto no produto: fluxo de pagamento recusado deve nomear o motivo real (cartão recusado, saldo insuficiente), nunca "algo deu errado".

### 11.3 Mensagens de sucesso

Confirmam especificamente o que aconteceu, nunca um "Sucesso!" genérico: "Pagamento confirmado — você está em dia até 14/09", não "Operação realizada com sucesso".

### 11.4 Confirmações (ações irreversíveis)

Sempre no formato: **pergunta + consequência concreta + duas opções nomeadas** (nunca "Sim/Não" genérico). Modelo já implementado a replicar (`CLAUDE.md` §Autocancelamento): "Seu plano continua valendo até 14/09/2026. Quer mesmo cancelar agora?" com botões "Cancelar minha assinatura" / "Voltar".

### 11.5 Estados vazios

Sempre: ilustração comedida (Brand DS §6.5) + frase explicando o que vai aparecer ali + ação sugerida. Exemplo: "Nenhum evento cadastrado ainda" + "Quando o clube publicar um evento, ele aparece aqui" (associado) ou + CTA "Cadastrar primeiro evento" (admin).

### 11.6 Tom de voz — aplicação por camada

| Camada | Registro | Por quê |
|---|---|---|
| Área pública/institucional | Caloroso, primeira pessoa do plural ("nosso clube") | Comunica pertencimento a quem ainda decide (Brand DS §1.9). |
| Área do associado | Direto, segunda pessoa ("sua mensalidade", "você está em dia") | Foco em status pessoal, sempre claro (Brand DS §5.1). |
| Área administrativa | Direto, sem gentileza excessiva que soaria condescendente para quem já é usuário frequente — mas nunca frio ou técnico | Usuário frequente não precisa de acolhimento repetido a cada tela, mas continua sendo o mesmo público leigo (Brand DS §3). |
| Painel Master | Pode usar termos técnicos precisos (o usuário aqui é técnico por definição) — única exceção documentada ao vocabulário proibido do Brand DS §5.2 | Público muda de perfil (Brand DS §9.8) — mas mesmo aqui, sem jargão gratuito onde termo simples resolve. |

---

## 12. Acessibilidade

Requisitos operacionais que aplicam o piso WCAG 2.1 AA já definido no Brand Design System §12 à arquitetura de navegação e componentes deste documento.

1. **Contraste mínimo 4.5:1** (texto normal) / **3:1** (texto grande, ícones informativos) — checado em todo par cor/fundo antes de qualquer tela nova entrar em produção, incluindo estados de navegação (item ativo de menu, badge de status).
2. **Nenhum item de navegação depende só de cor** para indicar "está ativo/selecionado" — sempre peso de fonte ou indicador visual adicional junto da cor.
3. **Toda navegação por teclado é completa na área administrativa e no Painel Master**: tab order lógico (segue a ordem visual, nunca a ordem do DOM se divergirem), foco sempre visível, nenhum menu dropdown que só abre por hover sem equivalente por teclado (Enter/Space).
4. **Leitor de tela**: todo item de menu tem texto associado (nunca ícone puro sem `aria-label`); mudanças de estado assíncronas de navegação (ex. "carregando próxima seção") anunciadas via `aria-live` quando relevante.
5. **Área de toque mínima 44×44px** em qualquer item de navegação tocável, com espaçamento suficiente entre itens adjacentes do menu mobile (§7.5).
6. **Zoom do navegador/sistema até 200% sem quebra de layout** — nenhuma navegação (navbar, sidebar, bottom nav) pode depender de largura fixa que quebre com fonte ampliada.
7. **Movimento reduzido**: qualquer transição de navegação (abertura de drawer, troca de aba) respeita a preferência de sistema operacional "reduzir movimento" — desativada automaticamente quando configurado (Brand DS §12.7).
8. **Skip links** ("pular para o conteúdo principal") em toda página com navbar/sidebar fixa — item novo desta camada de arquitetura, necessário porque cada tela agora tem estrutura de navegação persistente que, sem skip link, obrigaria um usuário de teclado/leitor de tela a percorrer o menu inteiro em toda página.
9. **Hierarquia de headings correta e única por página** (`h1` único por tela, `h2`/`h3` seguindo a hierarquia visual real) — requisito de navegação por leitor de tela que se soma, sem contradizer, à hierarquia visual já definida em Creative Direction §9.2.

---

## 13. Performance Percebida

Aplicação dos princípios do Brand Design System §13 e Creative Direction §7.4 especificamente às transições **entre telas/seções da arquitetura de navegação** (o documento-fonte já cobria carregamento de dado dentro de uma tela).

1. **Skeleton screens em toda transição de navegação que carrega dado novo** (trocar de módulo no admin, abrir um lote de leilão) — nunca tela em branco entre o clique e o conteúdo aparecer.
2. **Navegação otimista**: ao tocar um item de menu, a transição visual (drawer fechando, destaque do item) acontece instantaneamente, mesmo que o conteúdo da próxima tela ainda esteja carregando — esconde a latência de rede (Creative Direction §7.4).
3. **Tempo máximo aceitável**: 400ms para qualquer transição de navegação percebida como "instantânea" (abrir menu, trocar aba); acima de ~1s de carregamento real de dado, skeleton é obrigatório, nunca apenas um atraso silencioso.
4. **Carregamento progressivo por prioridade de navegação**: o essencial de cada tela (status, ação principal — já definido em Brand DS §13.3) carrega antes de qualquer elemento de navegação secundário (ex. contador de notificação, badge de módulo).
5. **Cache de sessão para dados de navegação estáveis**: módulos habilitados por tenant, role do usuário — já implementado via `sessionStorage` (`checkModuleEnabled`) — é o padrão a generalizar para qualquer novo dado de navegação que não muda a cada requisição (ex. Tenant Context, `SAAS_MULTITENANT.md` §6).
6. **Conectividade instável (contexto rural)**: nenhuma navegação trava indefinidamente sem feedback — timeout com opção de "tentar de novo" em qualquer transição que dependa de rede (já implementado no fluxo de pagamento, `pay.html`, é o padrão a generalizar).

---

## 14. Design Tokens

Estrutura e nomenclatura dos tokens — não valores finais de marca (hex exatos, família tipográfica final ficam para a fase de Brand Identity, já sinalizada como próxima etapa em Creative Direction §20). Esta seção define **como os tokens devem ser organizados** para que design e desenvolvimento falem a mesma linguagem desde o primeiro componente.

### 14.1 Espaçamento

- Unidade atômica: **8px** (Brand DS §6.6, Creative Direction §10.1-10.2) — não redecidido aqui, apenas formalizado como token.
- Nomenclatura semântica, nunca numérica solta: `space-xs` (4px, exceção pontual de ajuste fino), `space-sm` (8px), `space-md` (16px), `space-lg` (24px), `space-xl` (32px), `space-2xl` (48px), `space-3xl` (64px) — todos múltiplos de 8, exceto o `xs` de 4px documentado como exceção (Brand DS §6.6).

### 14.2 Tipografia

- Escala nomeada por função, não por tamanho cru: `text-body` (16px mínimo, área do associado — Brand DS §6.2), `text-body-sm` (uso administrativo denso), `text-heading-sm/md/lg/xl`, `text-display` (hero de landing).
- Peso nomeado por papel: `weight-regular`, `weight-medium` (uso em wordmark, Visual Identity §4.4), `weight-bold` — nunca "peso 400/500/700" sem rótulo semântico.
- Números financeiros: token dedicado `text-tabular` (features tabulares ativadas, Brand DS §6.2) — aplicado a todo valor monetário e data.

### 14.3 Sombras / Elevação

- Escala de elevação nomeada por camada de interface, não por tamanho de sombra: `elevation-0` (plano, padrão), `elevation-1` (card), `elevation-2` (dropdown/popover), `elevation-3` (modal) — cada nível corresponde a "o que está acima do quê" (Brand DS §6.7), nunca decorativo.

### 14.4 Radius

- Escala única e consistente: `radius-sm` (inputs, badges), `radius-md` (cards, botões), `radius-lg` (modais) — cantos moderadamente arredondados em toda a escala (Brand DS §6.7), nunca cantos retos misturados com muito arredondados na mesma tela.

### 14.5 Breakpoints

| Token | Largura | Corresponde a |
|---|---|---|
| `bp-mobile` | 0–599px | Ponto de partida do design (§7, Experience Principle #20) |
| `bp-tablet` | 600–1023px | Grid expande para 4 colunas (Creative Direction §10.3) |
| `bp-desktop` | 1024px+ | Grid expande para 12 colunas |

### 14.6 Grid

- 12 colunas em desktop, 4 em tablet, 1 em mobile (Creative Direction §10.3) — gutters e margens sempre múltiplos de 8px, crescendo proporcionalmente com o breakpoint (Creative Direction §10.4).

### 14.7 Cor (estrutura de token, não valores)

- Tokens semânticos, nunca hex direto em componente: `color-brand-primary` (terracota), `color-ink` (estrutura/texto), `color-surface` (fundo off-white), `color-success`, `color-warning`, `color-danger` (Brand DS §6.1) + `color-accent-tenant` (variável por white-label, dentro de paleta pré-validada — Brand DS §10.1).
- Regra de token: nenhum componente referencia um valor de cor bruto — sempre um nome semântico, para que a troca de tenant (§10) seja uma troca de valor de token, nunca uma reescrita de componente.

---

## 15. Checklist de UX

*A ser aplicado antes da aprovação de qualquer tela nova — consolida e estende as checklists já existentes em Creative Direction §17-18, adicionando os itens específicos de arquitetura da informação e navegação definidos neste documento.*

**Arquitetura da informação**
- [ ] Esta tela já existe em outro lugar do sitemap com propósito equivalente? Se sim, consolidar em vez de duplicar (Experience Principle #25).
- [ ] A tela está a no máximo 2 níveis de profundidade de menu a partir do hub da sua camada (Experience Principle #9)?
- [ ] Existe um caminho de navegação até esta tela — ou ela só é alcançável por link direto sem justificativa documentada (Experience Principle #23)?
- [ ] O nome do item de menu correspondente é a tarefa, não o módulo técnico (Experience Principle #19)?

**Navegação**
- [ ] "Onde estou" é identificável sem esforço (item de menu ativo, título de seção)?
- [ ] O caminho de volta é único e óbvio?
- [ ] Se a tela pertence a um módulo habilitável por tenant, a navegação verifica `checkModuleEnabled()` antes de exibir o link?

**Mobile-first**
- [ ] Esta tela foi desenhada primeiro em mobile e depois expandida — não o inverso?
- [ ] O CTA principal está na thumb zone em fluxos críticos?
- [ ] Testado em coluna única antes de qualquer versão multi-coluna?

**Componentes e tokens**
- [ ] Todo componente usado já existe no inventário do §6 — nenhum componente novo sem justificar por que os existentes não resolvem?
- [ ] Todo valor de espaçamento/cor/tipografia é um token nomeado (§14), nunca um valor solto?

**Copy**
- [ ] Nenhum jargão técnico exposto (Brand DS §5.2)?
- [ ] Mensagens de erro/sucesso seguem o padrão de três partes (§11.2)?
- [ ] Confirmação de ação irreversível mostra consequência real, não "tem certeza?" genérico?

**White label**
- [ ] Nenhuma customização de tenant altera estrutura de navegação, componente ou token — só conteúdo/marca (§10.2)?

**Acessibilidade e performance**
- [ ] Todos os itens da checklist do §12 aplicados?
- [ ] Skeleton (não spinner mudo) em qualquer transição que carregue dado real (§13)?

**Validação final**
- [ ] Esta tela foi comparada com uma tela equivalente já aprovada — a mesma tarefa é resolvida do mesmo jeito em toda a área correspondente?
- [ ] Um usuário representativo do público real (não a equipe de produto) entende esta tela em até 3 segundos, sem explicação prévia?

---

## 16. UX Constitution

Regras inegociáveis — prevalecem sobre preferência pessoal, tendência de mercado ou pedido pontual de qualquer stakeholder, incluindo cliente/tenant. Se uma tela viola qualquer regra abaixo, ela é considerada **incorreta**, independentemente de quão "pronta" pareça.

1. **Nunca mais de um CTA primário por tela.**
2. **Nunca mais de 3 toques até a ação principal de qualquer fluxo crítico.**
3. **Nunca uma tela nova sem propósito único e identificável em 3 segundos.**
4. **Nunca profundidade de menu maior que 2 níveis para qualquer tarefa comum.**
5. **Nunca navegação que dependa de hover sem equivalente por toque.**
6. **Nunca ação irreversível sem confirmação em duas etapas com consequência real explícita.**
7. **Nunca jargão técnico, sigla interna ou nomenclatura de banco de dados exposta ao usuário final, em nenhuma camada além do Painel Master.**
8. **Nunca cor isolada como único portador de significado de status ou navegação.**
9. **Nunca uma tela do associado mais densa ou mais complexa que a tela administrativa equivalente.**
10. **Nunca componente novo criado sem antes verificar se um já existente no design system resolve.**
11. **Nunca customização de tenant que altere estrutura de navegação, grid, tipografia, cores semânticas ou princípios de UX.**
12. **Nunca informação crítica (status financeiro, resultado de uma ação) escondida atrás de mais de um clique/toque.**
13. **Nunca uma tela mobile "encolhida" a partir de uma tela desktop — sempre desenhada mobile-first desde a origem.**
14. **Nunca navegação com mais de 4 itens em bottom navigation.**
15. **Nunca lista/tabela vazia sem ilustração, texto explicativo e ação sugerida.**
16. **Nunca spinner isolado e mudo para carregamento de dado real — sempre skeleton ou texto de acompanhamento.**
17. **Nunca dark pattern de cancelamento — o caminho de sair é sempre tão fácil de encontrar quanto o de entrar.**
18. **Nunca urgência artificial (contador regressivo fabricado, "últimas vagas") em qualquer parte do produto ou da landing page.**
19. **Nunca duas telas resolvendo a mesma tarefa de formas visualmente diferentes.**
20. **Nunca uma decisão de arquitetura da informação tomada durante a implementação de código sem estar primeiro registrada neste documento ou em uma revisão formal dele.**
21. **Nunca uma tela nova aprovada sem checklist do §15 aplicado.**
22. **Nunca contraste de texto abaixo do piso WCAG AA, em qualquer tela, em qualquer tenant.**
23. **Nunca elemento tocável abaixo de 44×44px.**
24. **Nunca animação de navegação sem propósito informativo (nunca decorativa) e nunca acima de 400ms.**
25. **Nunca a marca-mãe "Portal Associativo" sobrepondo em destaque a marca do tenant dentro do produto de um cliente.**
26. **Nunca um módulo desabilitado por tenant visível na navegação daquele tenant.**
27. **Nunca uma funcionalidade lançada que exija manual ou treinamento prévio para uso básico.**
28. **Nunca preço, plano ou condição comercial escondida atrás de "fale conosco" na experiência institucional.**
29. **Nunca uma tela aprovada por decisão unilateral de quem a construiu, sem comparação com o padrão já existente.**
30. **Nunca este documento (ou os documentos-fonte que ele herda) contrariado sem que a contradição seja primeiro identificada, justificada e formalmente resolvida por escrito.**

---

## 17. Roadmap — Próxima Etapa

```
Experience Architecture (este documento)
        ↓
Implementação da Landing Page institucional do Portal Associativo
   → Aplicar a arquitetura da seção 8 (Landing Page Architecture) + a direção
     criativa já definida em Creative Direction §12 (sensação, linguagem visual)
     + os tokens da seção 14 + os componentes da seção 6.
   → Site institucional (`portal-associativo.com.br`, ver §2.2) — nunca misturado
     com a IA de um tenant (§2.1) — este é o primeiro artefato desse domínio a
     ser efetivamente construído; hoje ele existe apenas como arquitetura (§2.2)
     e como narrativa (Brand DS §8).
   → Nenhuma decisão de ordem de seção, hierarquia, CTA ou copy deve ser tomada
     durante essa implementação — todas já estão fixadas nos documentos-fonte
     e neste documento (§8, §11, §14).
   → Gate de aprovação antes de considerar pronta: checklist completo do §15
     deste documento aplicado à página construída, mais o teste de "3 segundos,
     olhos semicerrados" (Creative Direction §9.5) e validação com pelo menos
     um representante real de uma das personas (Brand DS §3).
        ↓
Design System Visual (Figma)
   → Sequência já registrada em Creative Direction §20 — inalterada por este
     documento, apenas informada pela arquitetura de componentes/tokens
     definida aqui (§6, §14).
        ↓
Protótipos de tela real → Desenvolvimento
   → Idem — sequência de Creative Direction §20, agora com a arquitetura de
     navegação/IA (§2-5, §9) disponível como referência obrigatória para
     qualquer tela nova, eliminando a necessidade de decidir estrutura durante
     a implementação.
```

**O que este documento deixa resolvido para a próxima etapa (Landing Page):**

- Sitemap completo do site institucional (§2.2) — nenhuma página nova a inventar.
- Estrutura e propósito de cada seção da Landing (§8) — nenhuma ordem a decidir.
- Componentes a usar (§6) e tokens a aplicar (§14) — nenhuma biblioteca nova a criar.
- Padrões de copy/CTA/erro/vazio (§11) — nenhum texto a improvisar sem régua.
- Requisitos de acessibilidade (§12) e performance percebida (§13) aplicáveis a qualquer página nova.
- Checklist de aprovação (§15) e regras inegociáveis (§16) contra as quais a página pronta deve ser testada antes de publicar.

**Regra de governança geral** (herdada de Creative Direction, nota final): nenhuma fase futura — nova landing, novo módulo, novo tenant — pode contradizer este documento ou os documentos-fonte sem que a contradição seja primeiro identificada, explicada e formalmente resolvida por escrito, exatamente como este próprio documento foi obrigado a fazer antes de propor qualquer estrutura nova.
