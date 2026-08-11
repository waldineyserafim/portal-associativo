// shared/core/tenant/features.js — Feature Flags por organização (Fase 3.8).
//
// Espelha a FORMA de modules.js/branding.js (mesmo cache em sessionStorage
// com TTL, mesmo fail-safe, mesma factory com DI) mas NÃO a fonte de dado:
// aqui não há getDoc() direto no Firestore. Toda resolução passa pela
// callable `resolveFeatureFlags` (Cloud Function, ver functions/lib/
// features.js no repositório do CCBMG) — o documento featureFlags/{flagKey}
// agrega o mapa `overrides` de TODAS as organizações da plataforma; expor
// isso a um getDoc() client-side vazaria pra qualquer usuário logado quais
// outras organizações têm qual recurso ligado. A callable devolve só o
// booleano já resolvido pra ESTA organização — nunca o documento cru.
//
// TTL de cache mais curto que modules.js/branding.js de propósito: uma flag
// pensada como "desligamento emergencial" (ver Fase 3.8) precisa propagar
// rápido — 10 minutos de cache (padrão de módulos, que mudam raríssimo)
// seria inaceitável aqui.

import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-functions.js";

/**
 * @param {object} opts
 * @param {object} opts.app — instância do Firebase App (ex.: getApp() de firebase-init.js).
 * @param {() => Promise<string>} opts.getOrgId
 * @param {string} [opts.region="us-central1"]
 * @param {number} [opts.cacheTtlMs=60000] — 1 min (vs. 10 min de modules.js/branding.js — ver Contexto acima).
 */
export function createFeatureResolver({ app, getOrgId, region = "us-central1", cacheTtlMs = 60000 }) {
  const functionsApi = getFunctions(app, region);
  const resolveFeatureFlagsFn = httpsCallable(functionsApi, "resolveFeatureFlags");

  function cacheKeyFor(orgId) {
    return `features_${orgId}`;
  }

  /**
   * @returns {Promise<Record<string, boolean>>} — mapa flagKey→booleano já resolvido pra
   *   esta organização. Vazio (não erro) se a chamada falhar — fail-safe: nenhuma flag
   *   habilitada é a postura mais segura quando não se sabe o estado real (oposto
   *   deliberado do fail-open de modules.js, mesmo raciocínio do lado servidor —
   *   ver functions/lib/features.js).
   */
  async function getResolvedFlags() {
    const orgId = await getOrgId();
    const cacheKey = cacheKeyFor(orgId);
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.at < cacheTtlMs) return cached.flags;
    } catch { /* cache inválido, ignora e recarrega */ }

    let flags = {};
    try {
      const result = await resolveFeatureFlagsFn();
      flags = result?.data?.flags || {};
    } catch (e) {
      console.warn("[shared/core/tenant] falha ao resolver feature flags (fail-safe: nenhuma flag habilitada):", e);
      return {};
    }

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ flags, at: Date.now() }));
    } catch { /* ambiente sem sessionStorage, segue sem cache */ }

    return flags;
  }

  /** @returns {Promise<boolean>} */
  async function isFeatureEnabled(flagKey) {
    const flags = await getResolvedFlags();
    return flags[flagKey] === true;
  }

  /** Esconde (classe `d-none`) todo elemento [data-feature="X"] cuja flag X não esteja habilitada — simétrico a applyModuleVisibility() de modules.js. */
  async function applyFeatureVisibility() {
    const flags = await getResolvedFlags();
    document.querySelectorAll("[data-feature]").forEach((el) => {
      const flagKey = el.getAttribute("data-feature");
      if (flags[flagKey] !== true) el.classList.add("d-none");
    });
  }

  function clearCache(orgId) {
    try { sessionStorage.removeItem(cacheKeyFor(orgId)); } catch { /* noop */ }
  }

  return { getResolvedFlags, isFeatureEnabled, applyFeatureVisibility, clearCache };
}
