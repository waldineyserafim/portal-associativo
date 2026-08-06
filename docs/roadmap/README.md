# Roadmap — Portal Associativo

Alinhado ao roadmap geral da plataforma (ver `CLAUDE.md` do projeto CCBMG):

| Fase | Escopo aqui neste repositório |
|---|---|
| 1 | Fundação: estrutura, Design System, landing estrutural ✅ |
| 2 | Portal institucional completo: Brand System consolidado, Home real, `/funcionalidades`, `/segmentos`, `/planos`, `/sobre`, `/documentacao`, `/contato`, `/demonstracao`, `/privacidade`, `/termos`, `/404`, formulários funcionais (mailto) ✅ |
| 2.1 | Design Review da Fase 2 contra Brand DS/Creative Direction/Visual Identity/XA: paleta de espaçamento e tipografia recalibrada mobile-first, hero sem gradiente genérico, seções "Como funciona"/"Diferenciais" removidas (fora da arquitetura canônica de 9 seções da XA §8, conteúdo redundante com Planos/UX real), Benefícios/Funcionalidades convertidos de grade de cards para padrão editorial mais leve, navbar reduzida a 5 itens, slogan oficial reintroduzido (hero + rodapé + meta/OG) ✅ |
| 2.2 | Direção de Arte v1.0: fotografia real curada (Unsplash License, ver `assets/images/CREDITS.md`) no Hero, num novo bloco de respiro editorial e nos 4 cards de Segmentos (Home + `pages/segmentos.html`); Prova social/testimonials permanece deliberadamente sem foto (ver `assets/images/testimonials/README.md`) |
| 2.3 | Direção de Arte — 2ª iteração (Design Review): Hero trocado por completo (foto antiga lia como registro de evento, sem gente identificável, competia com o texto) e reestruturado em layout de duas colunas (texto + foto, nunca mais foto de fundo com scrim); `segmento-classe-card` recortado para remover crachá de evento e etiqueta de roupa legíveis; título de Benefícios trocado de "Menos ansiedade" para "Menos burocracia" (nomeia o adversário real, Brand DS §1.1); ícone quebrado (`bi-handshake`, inexistente no Bootstrap Icons) corrigido para `bi-gift`; seção "Quem já usa" reescrita para focar em resultado obtido, nunca pioneirismo (removida toda menção a "primeiro cliente"/"produção") — **este commit** |
| 2.4 | Proposta de nova Home (`index_nova.html` + `css/landing-nova.css`) — reconstrução completa a partir de benchmark de HiGestor/Associatec/Softaliza: hero com texto sobreposto (contraste AA verificado por cálculo), copy de transformação, seção "Plataforma em contexto" (dispositivos em CSS por perfil), seção Customização/Evolução, caso real com relato da presidência do CCBMG (**pendente de aprovação por escrito do Presidente antes de publicar**), seção Contato (formulário → WhatsApp; e-mail oficial pendente, ver comentário no HTML), CTAs → WhatsApp +55 31 99892-3209, CNPJ no rodapé. Home atual (`index.html`) intocada; página com `noindex` até ser promovida — **este commit** |
| 2.5 | Nova Home — 3ª iteração (conversão): hero v3 com primeira dobra completa no mobile (fundo terracota sólido, foto integrada como cartão + chip de UI real, chips de credibilidade), benefícios reescritos na perspectiva do presidente, nova seção "Tudo em um único lugar" (6 categorias com benefício + módulos como chips, substituindo a lista de funcionalidades soltas), demonstração com smartphone + notebook + desktop e 4 perfis ("o que esse usuário consegue fazer"), Customização com "parceria de mandato em mandato", caso real reformatado como história (contexto → problema → solução → resultado + citação, ainda **pendente de aprovação por escrito do Presidente**) — **este commit** |
| 2.6 | Nova Home — 4ª iteração (estratégia de produto): Home encurtada de 12 para 10 seções e ~23% mais baixa no mobile (hero −29%); primeira dobra do smartphone reconstruída (slogan, título, descrição, dois CTAs e foto integrada cabem em uma tela); chip de UI com números fabricados removido do hero (fotografia pura); faixa "para quem é" substituída pela faixa de ecossistema (12 públicos, não só a diretoria); "Plataforma completa" e "Demonstração" fundidas numa seção só; mockups de dispositivo trocados por molduras neutras preparadas para screenshot real (nenhum dashboard fictício); Contato e CTA final fundidos; "Login Master" removido da navegação pública; logotipo das páginas internas apontando para a nova Home; CTAs → WhatsApp em todo o site; `pages/planos.html` reestruturada em 5 planos (Site Institucional → Comunidade → **Gestão** → Plataforma → Customizado) com "a partir de R$ 49,90/mês"; corrigido bug real de rolagem horizontal no mobile (`row g-5` dentro de `.container`) na nova Home e em `pages/funcionalidades.html`, e ícone inexistente `bi-handshake` naquela página — **este commit** |
| 2.7 | Nova Home — iteração final (refinamento premium, sem seções novas): hero v5 com texto e fotografia numa única composição (foto como cenário atrás de degradê na cor da marca; contraste do pior pixel verificado por varredura dos JPEGs reais — mobile 5,22:1, desktop 5,29:1); faixa de ecossistema reestruturada de 12 chips iguais para 3 grupos com hierarquia (Quem administra / Quem participa / Quem movimenta); Benefícios, Segmentos e Caso Real em grade 2×2 no mobile com copy encurtada; página total no mobile: 10.655px → 9.206px (−14%), hero 649px → 546px (−16%). **Versão definitiva da Home antes das demais páginas institucionais** — **este commit** |
| 2.8 | **Go-live em produção**: nova Home promovida a `index.html` (Home antiga removida por decisão do dono do produto; checklist de promoção executado — sem `noindex`, canonical/OG/Twitter/manifest no head, links das páginas internas revertidos para `../index.html`); arquivo `CNAME` com `portalassociativo.com.br`; GitHub Pages habilitado (branch `main`, raiz). DNS no registro.br (registros A/AAAA + CNAME www) configurado pelo dono do produto; após propagação: Enforce HTTPS, verified domain e Search Console — **este commit** |
| 3 | Páginas de Marketplace / segmentos específicos, se fizer sentido divulgar publicamente |
| 4 | Divulgação de app/aplicativo (quando existir) |
| 5 | Painel Master migra para este repositório/domínio; `js/firebase.js` passa a ser usado de fato; área autenticada nasce aqui |
| 6 | Páginas institucionais sobre IA/automações da plataforma |

## Não fazer antes da hora

- Não publicar valor individual por plano em `/planos` sem validação de
  negócio. Desde a 4ª iteração a página publica a porta de entrada
  (**"a partir de R$ 49,90 por mês"**, decisão comercial do dono do produto)
  e o que cada um dos 5 planos inclui; o valor de cada degrau continua
  deliberadamente fora até a precificação estar fechada (ver nota na própria
  página e em `docs/brand-system/README.md`).
- Não mover o Painel Master para cá antes da Fase 5.

## Pendências antes de publicar (Fase 2)

- [x] `DEST_EMAIL` em `js/forms.js` e o bloco de e-mail em `index.html` publicados com `contato@portalassociativo.com.br` — recebimento via Cloudflare Email Routing (encaminha para caixa real da equipe), testado e confirmado em produção.
- [ ] Preencher CNPJ/endereço legal em `pages/termos.html` e `pages/privacidade.html`, se a empresa decidir publicá-los.
- [ ] Fechar o valor de cada um dos 5 planos para `pages/planos.html` (ver acima — o "a partir de R$ 49,90" já está publicado).
- [ ] Aprovação por escrito do Presidente do CCBMG para o relato do caso real na Home (ver comentário em `index.html`).
- [ ] Substituir as molduras neutras da seção "Tudo em um único lugar" por screenshots reais do produto (`assets/images/product/`).
- [ ] Decidir o destino de `pages/demonstracao.html` e `pages/contato.html`: seguem sendo o canal formal por e-mail (rodapé + páginas dedicadas), enquanto todo CTA de conversão do site vai para o WhatsApp (padrão consolidado em ago/2026 — ver Débito técnico abaixo sobre consistência).
- [ ] Substituir `apple-touch-icon`/OG image por artes finais revisadas, se ainda não validadas.

## Débito técnico

- **DNS do site proxied no Cloudflare (nuvem laranja) → cache de até 10 min em cada deploy.**
  Migramos a DNS de `portalassociativo.com.br` para o Cloudflare (Email Routing,
  ago/2026) e os registros A/AAAA/CNAME do site ficaram com o proxy
  (`Proxied`) ativo — o que dá CDN/WAF/analytics, mas também passou a
  cachear HTML na borda, fazendo cada deploy novo demorar até ~10 min para
  aparecer publicamente (`age`/`cf-ray` nos headers confirmam isso).
  Decisão registrada em ago/2026: **manter como está por enquanto**
  (fase de iteração rápida do produto) em vez de reconfigurar agora.
  Quando revisitar, duas opções: (1) trocar os registros para "DNS only"
  (nuvem cinza) — simples, sem cache, mas perde CDN/WAF/analytics; ou
  (2) manter `Proxied` e criar uma Cache Rule (Caching → Cache Rules)
  fazendo bypass de cache para HTML — mantém os benefícios do proxy sem o
  atraso de deploy. HTTPS, Email Routing e o Verified Domain do GitHub
  **não são afetados** por essa escolha (MX/TXT nunca passam pelo proxy).
