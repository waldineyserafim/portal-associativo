# pages/

Páginas internas/secundárias do site (a home fica em `/index.html`, na raiz,
porque o GitHub Pages exige isso para servir o domínio).

## Já implementadas (estruturais, sem copy definitivo)

- `login.html` — redireciona para o Login Master do CCBMG
- `contato.html` — placeholder, aguarda `components/forms/contact-form.html`
- `demonstracao.html` — placeholder, aguarda `components/forms/demo-request-form.html`

## Planejadas

Hoje "Funcionalidades", "Planos", "Segmentos" e "FAQ" são seções âncora
dentro de `index.html` (`#funcionalidades`, `#planos`, etc.). Quando o SEO
pedir por URLs próprias por tópico (cada um rankeando para um cluster de
palavra-chave diferente), promover para páginas dedicadas aqui:

- `funcionalidades.html`
- `planos.html`
- `segmentos.html`

Ver `docs/seo/README.md` antes de decidir — nem sempre separar em mais
páginas é melhor para SEO de um site desse tamanho.
