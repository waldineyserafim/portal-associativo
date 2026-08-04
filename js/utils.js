// js/utils.js — helpers genéricos, sem dependências externas.
// Mesma filosofia do firebase.js do CCBMG: funções puras, pequenas, exportadas
// individualmente (sem classe/namespace) para tree-shaking manual e leitura fácil.

export const qs  = (sel, ctx = document) => ctx.querySelector(sel);
export const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

export const onlyDigits = (s) => (s || "").replace(/\D/g, "");

export function formatCurrencyBRL(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function debounce(fn, wait = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// Marca o link de navegação correspondente à página atual com "active-page".
export function highlightActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  qsa("[data-nav-link]").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("/").pop();
    link.classList.toggle("active-page", href === path);
  });
}
