# Componentes visuais compartilhados

CSS puro — nenhum comportamento JS aqui (modal reaproveita o Bootstrap que os dois repos já carregam). Import único: `index.css`.

## Pré-requisito

Este CSS assume que `var(--brand)`, `var(--brand-dark)` etc. já estão definidos pelo tenant (`css/variables.css` do Portal Associativo, ou equivalente próprio). Sem isso, os componentes caem nos valores de **fallback do Portal Associativo** (todo `var()` aqui tem um segundo argumento) — funcional, mas com a cor de marca do Portal, não a do tenant.

## Estrutura de markup esperada, por componente

### Sidebar (`sidebar.css`)
```html
<aside class="ds-sidebar">
  <div class="ds-sidebar-brand">...</div>
  <div class="ds-sidebar-section">Título da seção</div>
  <a class="ds-sidebar-link is-active" href="...">Item</a>
  <a class="ds-sidebar-link is-danger" href="...">Sair</a>
</aside>
<div class="ds-sidebar-overlay"></div>
<main class="ds-admin-main">...</main>
```
Abaixo de 768px, a sidebar precisa de um controlador JS próprio da página adicionando/removendo `is-open` (não fornecido aqui — é comportamento específico de cada tela, não visual).

### KPI card (`kpi-card.css`)
```html
<div class="ds-kpi-card">
  <div class="ds-kpi-value">128</div>
  <div class="ds-kpi-label">Associados em dia</div>
</div>
```
Classes opcionais em `.ds-kpi-value`: `.ds-kpi-success`, `.ds-kpi-warn`, `.ds-kpi-danger`.

### Tabela de dados (`data-table.css`)
```html
<div class="ds-table-card">
  <div class="ds-table-card-header"><h2>Título</h2></div>
  <table class="table ds-table">
    <thead><tr><th>Coluna</th></tr></thead>
    <tbody><tr><td>Valor</td></tr></tbody>
  </table>
</div>
```
Classes Bootstrap padrão (`table-hover`, `table-sm`) continuam funcionando normalmente junto de `.ds-table`.

### Modal (`modal.css`)
```html
<div class="modal ds-modal" ...>...</div>
```
Comportamento (`data-bs-toggle`, `bootstrap.Modal`) é 100% Bootstrap padrão — `.ds-modal` só troca a aparência do conteúdo.
