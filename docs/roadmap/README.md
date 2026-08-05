# Roadmap — Portal Associativo

Alinhado ao roadmap geral da plataforma (ver `CLAUDE.md` do projeto CCBMG):

| Fase | Escopo aqui neste repositório |
|---|---|
| 1 | Fundação: estrutura, Design System, landing estrutural ✅ |
| 2 | Portal institucional completo: Brand System consolidado, Home real, `/funcionalidades`, `/segmentos`, `/planos`, `/sobre`, `/documentacao`, `/contato`, `/demonstracao`, `/privacidade`, `/termos`, `/404`, formulários funcionais (mailto) ✅ |
| 2.1 | Design Review da Fase 2 contra Brand DS/Creative Direction/Visual Identity/XA: paleta de espaçamento e tipografia recalibrada mobile-first, hero sem gradiente genérico, seções "Como funciona"/"Diferenciais" removidas (fora da arquitetura canônica de 9 seções da XA §8, conteúdo redundante com Planos/UX real), Benefícios/Funcionalidades convertidos de grade de cards para padrão editorial mais leve, navbar reduzida a 5 itens, slogan oficial reintroduzido (hero + rodapé + meta/OG) ✅ |
| 2.2 | Direção de Arte v1.0: fotografia real curada (Unsplash License, ver `assets/images/CREDITS.md`) no Hero, num novo bloco de respiro editorial e nos 4 cards de Segmentos (Home + `pages/segmentos.html`); Prova social/testimonials permanece deliberadamente sem foto (ver `assets/images/testimonials/README.md`) |
| 2.3 | Direção de Arte — 2ª iteração (Design Review): Hero trocado por completo (foto antiga lia como registro de evento, sem gente identificável, competia com o texto) e reestruturado em layout de duas colunas (texto + foto, nunca mais foto de fundo com scrim); `segmento-classe-card` recortado para remover crachá de evento e etiqueta de roupa legíveis; título de Benefícios trocado de "Menos ansiedade" para "Menos burocracia" (nomeia o adversário real, Brand DS §1.1); ícone quebrado (`bi-handshake`, inexistente no Bootstrap Icons) corrigido para `bi-gift`; seção "Quem já usa" reescrita para focar em resultado obtido, nunca pioneirismo (removida toda menção a "primeiro cliente"/"produção") — **este commit** |
| 3 | Páginas de Marketplace / segmentos específicos, se fizer sentido divulgar publicamente |
| 4 | Divulgação de app/aplicativo (quando existir) |
| 5 | Painel Master migra para este repositório/domínio; `js/firebase.js` passa a ser usado de fato; área autenticada nasce aqui |
| 6 | Páginas institucionais sobre IA/automações da plataforma |

## Não fazer antes da hora

- Não publicar número de preço em reais em `/planos` sem validação de negócio
  — a página já existe e mostra o que cada plano inclui, mas o valor
  permanece deliberadamente fora até a precificação estar fechada (ver nota
  na própria página e em `docs/brand-system/README.md`).
- Não mover o Painel Master para cá antes da Fase 5.

## Pendências antes de publicar (Fase 2)

- [ ] Trocar `DEST_EMAIL` em `js/forms.js` por uma caixa de e-mail real.
- [ ] Preencher CNPJ/endereço legal em `pages/termos.html` e `pages/privacidade.html`, se a empresa decidir publicá-los.
- [ ] Fechar precificação real para `pages/planos.html` (ver acima).
- [ ] Substituir `apple-touch-icon`/OG image por artes finais revisadas, se ainda não validadas.
