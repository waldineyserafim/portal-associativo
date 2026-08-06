// shared/core/tenant/modules.js — módulos habilitados por organização.
//
// Diferença deliberada do checkModuleEnabled()/applyModuleVisibility() do
// CCBMG hoje: applyModuleVisibility() aqui NÃO recebe uma lista fixa de
// módulos (o firebase.js atual hardcoda 10 nomes). Em vez disso, varre
// [data-module] presentes NA PRÓPRIA PÁGINA — o markup já é a fonte da
// verdade de quais módulos aquela tela usa, então não há lista para manter
// sincronizada em dois lugares. Comportamentalmente idêntico para o CCBMG
// hoje (as mesmas 10 tags data-module já existem no HTML), mas remove a
// necessidade de qualquer tenant futuro declarar uma lista em lugar nenhum.

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * @param {object} opts
 * @param {object} opts.db — instância de Firestore.
 * @param {() => Promise<string>} opts.getOrgId — resolve o orgId atual (ex.: `async () => (await getTenant()).orgId`).
 * @param {string} [opts.orgCollection="organizations"]
 * @param {number} [opts.cacheTtlMs=600000] — 10 min, mesmo padrão do CCBMG hoje.
 */
export function createModuleGate({ db, getOrgId, orgCollection = "organizations", cacheTtlMs = 600000 }) {
  function cacheKeyFor(orgId) {
    return `modules_${orgId}`;
  }

  async function readModulesMap(orgId) {
    const cacheKey = cacheKeyFor(orgId);
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.at < cacheTtlMs) return cached.modules;
    } catch { /* cache inválido, ignora e recarrega */ }

    let modules = {};
    try {
      const snap = await getDoc(doc(db, orgCollection, orgId));
      modules = snap.exists() ? (snap.data().modules || {}) : {};
    } catch (e) {
      console.warn("[shared/core/tenant] falha ao ler módulos da organização (fail-safe: tratando como habilitado):", e);
      return null; // sinaliza "não sei" — checkModuleEnabled trata como true (fail-safe)
    }

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ modules, at: Date.now() }));
    } catch { /* ambiente sem sessionStorage, segue sem cache */ }

    return modules;
  }

  function clearCache(orgId) {
    try { sessionStorage.removeItem(cacheKeyFor(orgId)); } catch { /* noop */ }
  }

  /** @returns {Promise<boolean>} — fail-safe: retorna true se o Firestore estiver inacessível. */
  async function checkModuleEnabled(moduleName) {
    const orgId = await getOrgId();
    const modules = await readModulesMap(orgId);
    if (modules === null) return true; // fail-safe, igual ao comportamento atual
    return modules[moduleName] !== false;
  }

  /** Esconde (classe `d-none`) todo elemento [data-module="X"] cujo módulo X esteja desabilitado. */
  async function applyModuleVisibility() {
    const orgId = await getOrgId();
    clearCache(orgId); // sempre recarrega antes de aplicar, evita staleness (mesmo padrão de hoje)
    const modules = await readModulesMap(orgId);
    if (modules === null) return; // fail-safe: não esconde nada se não conseguiu ler

    const seen = new Set();
    document.querySelectorAll("[data-module]").forEach((el) => seen.add(el.getAttribute("data-module")));

    seen.forEach((moduleName) => {
      const enabled = modules[moduleName] !== false;
      if (!enabled) {
        document.querySelectorAll(`[data-module="${moduleName}"]`).forEach((el) => el.classList.add("d-none"));
      }
    });
  }

  return { checkModuleEnabled, applyModuleVisibility };
}
