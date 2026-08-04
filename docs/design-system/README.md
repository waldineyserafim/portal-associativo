# Design System — Portal Associativo

Estrutura inicial preparada. Conteúdo detalhado (specimen de cores,
tipografia, espaçamento, biblioteca de componentes com exemplos) a
documentar aqui conforme os componentes forem implementados.

## Onde vive cada coisa hoje

- Tokens (`css/variables.css`) — cores, espaçamento, raio, sombra, z-index.
- Tipografia (`css/typography.css`).
- Componentes base (`css/components.css`) — `.ds-card`, `.ds-badge`,
  `.ds-alert`, `.ds-quick-card`, etc.
- Utilitários (`css/utilities.css`).
- `css/design-system.css` importa os quatro acima — é o único link de CSS
  que toda página deve incluir.

## Pendências para este documento

- [ ] Specimen visual de cores (com contraste WCAG documentado)
- [ ] Escala tipográfica com exemplos de uso
- [ ] Galeria de componentes (com HTML de exemplo, ligada a `components/`)
- [ ] Guia de uso de ícones (Bootstrap Icons)
