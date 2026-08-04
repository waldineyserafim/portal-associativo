// js/app.js — bootstrap de cada página do Portal Associativo.
// Ponto único de entrada JS por página (equivalente ao <script type="module"> inline
// que o CCBMG usa no fim de cada HTML, aqui extraído para arquivo compartilhado).

import { initComponents } from "./components.js";
import { highlightActiveNav, qs } from "./utils.js";

async function bootstrap() {
  await initComponents();
  highlightActiveNav();

  const yearEl = qs("[data-current-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", bootstrap);
