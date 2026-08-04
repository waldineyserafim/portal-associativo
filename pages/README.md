# pages/

Páginas internas/secundárias do site (a home fica em `/index.html`, na raiz,
porque o GitHub Pages exige isso para servir o domínio; `/404.html` também
fica na raiz, pelo mesmo motivo — é o nome exigido pelo GitHub Pages para a
página de erro customizada).

## Implementadas (Fase 2 — copy real, não placeholder)

- `funcionalidades.html` — cada módulo (Associados, Financeiro, Eventos, Comunicação, Classificados, Parceiros, Leilões) com nome e propósito humano.
- `segmentos.html` — os quatro segmentos atendidos, do nicho equestre à associação de bairro.
- `planos.html` — três planos (Essencial, Completo, Sob medida) com o que cada um inclui — sem valor em reais ainda (ver `docs/roadmap/README.md`).
- `sobre.html` — propósito, missão, valores e o primeiro cliente em produção (Clube do Cavalo de Bonfim MG).
- `documentacao.html` — central de ajuda pública, sem login.
- `contato.html` — formulário real (envio via `mailto:`, ver `js/forms.js`).
- `demonstracao.html` — formulário de solicitação de demonstração (mesmo mecanismo de envio).
- `privacidade.html` / `termos.html` — páginas legais (LGPD).
- `login.html` — redireciona para o Login Master do CCBMG.

## Pendências conhecidas (ver `docs/roadmap/README.md`)

- Trocar o e-mail de destino em `js/forms.js` por uma caixa real antes de publicar.
- Fechar precificação real de `planos.html` quando o negócio validar.
- Preencher dados legais (CNPJ/endereço) em `termos.html`/`privacidade.html`, se a empresa decidir publicá-los.
