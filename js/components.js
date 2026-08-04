// js/components.js — carregador leve de componentes HTML (sem build step).
//
// O projeto não usa Jekyll (ver .nojekyll) nem bundler, então não há include
// nativo de HTML. Este loader resolve isso em runtime: qualquer elemento
// `<div data-component="caminho/arquivo.html"></div>` é substituído pelo
// conteúdo de components/caminho/arquivo.html via fetch(). Funciona em
// GitHub Pages porque é same-origin (sem CORS) e não exige servidor próprio.
//
// Uso em uma página:
//   <div data-component="navigation/navbar.html"></div>
//   ...
//   <script type="module">
//     import { initComponents } from "./js/components.js";
//     initComponents();
//   </script>
//
// Os arquivos em components/ ainda são placeholders estruturais (ver
// docs/architecture) — este loader já fica pronto para quando forem
// implementados, para não exigir retrabalho de arquitetura depois.

export async function loadComponent(el) {
  const path = el.getAttribute("data-component");
  if (!path) return;
  try {
    const res = await fetch(`components/${path}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    el.innerHTML = await res.text();
    el.dispatchEvent(new CustomEvent("component:loaded", { bubbles: true, detail: { path } }));
  } catch (err) {
    console.warn(`[components.js] Falha ao carregar "${path}":`, err);
  }
}

export function initComponents(root = document) {
  const nodes = Array.from(root.querySelectorAll("[data-component]"));
  return Promise.all(nodes.map(loadComponent));
}
