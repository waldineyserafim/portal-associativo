// shared/core/tenant/branding.js — identidade visual da organização (Fase 3.5).
//
// Espelha modules.js deliberadamente (mesmo padrão de cache/fail-safe já
// provado em produção desde a Fase 3.1) — lê
// organizations/{orgId}/public/branding, NUNCA organizations/{orgId} direto:
// esse documento pai ganhou campos não-públicos na Fase 3.4 (observações,
// billingConfig, integrations) e as Firestore Rules corretamente exigem
// login+mesma organização pra lê-lo. A projeção pública é curada e mantida
// pela Cloud Function onOrganizationWritten (CCBMG, functions/lib/
// organizationPublicSync.js) — este módulo só consome.

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * @param {object} opts
 * @param {object} opts.db — instância de Firestore.
 * @param {() => Promise<string>} opts.getOrgId
 * @param {string} [opts.orgCollection="organizations"]
 * @param {number} [opts.cacheTtlMs=600000] — 10 min, mesmo padrão de modules.js.
 */
export function createBrandingResolver({ db, getOrgId, orgCollection = "organizations", cacheTtlMs = 600000 }) {
  function cacheKeyFor(orgId) {
    return `branding_${orgId}`;
  }

  /**
   * @returns {Promise<null | {nome, nomeCurto, logoUrl, faviconUrl, corPrimaria, corSecundaria, modules, billingProvider}>}
   *   null = branding indisponível (documento ausente ou erro de leitura) —
   *   quem aplica trata como "não mexer em nada" (fail-safe, nunca quebra a
   *   página, mesmo espírito de checkModuleEnabled em modules.js).
   */
  async function getOrgBranding() {
    const orgId = await getOrgId();
    const cacheKey = cacheKeyFor(orgId);
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.at < cacheTtlMs) return cached.branding;
    } catch { /* cache inválido, ignora e recarrega */ }

    let branding = null;
    try {
      const snap = await getDoc(doc(db, orgCollection, orgId, "public", "branding"));
      branding = snap.exists() ? snap.data() : null;
    } catch (e) {
      console.warn("[shared/core/tenant] falha ao ler branding da organização (fail-safe: nenhuma alteração visual):", e);
      return null;
    }

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ branding, at: Date.now() }));
    } catch { /* ambiente sem sessionStorage, segue sem cache */ }

    return branding;
  }

  /**
   * Aplica favicon, cores (--brand/--brand-dark) e marcadores de conteúdo
   * ([data-tenant-name]/[data-tenant-logo]) — só sobrescreve o que o
   * branding realmente tem; campo ausente = o HTML/CSS estático da página
   * continua valendo (fallback automático por construção, nunca quebra).
   */
  async function applyBranding() {
    const branding = await getOrgBranding();
    if (!branding) return;

    if (branding.faviconUrl) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = branding.faviconUrl;
    }

    if (branding.corPrimaria) {
      document.documentElement.style.setProperty("--brand", branding.corPrimaria);
    }
    if (branding.corSecundaria) {
      document.documentElement.style.setProperty("--brand-dark", branding.corSecundaria);
    }

    const displayName = branding.nomeCurto || branding.nome;
    if (displayName) {
      document.querySelectorAll("[data-tenant-name]").forEach((el) => { el.textContent = displayName; });
    }
    if (branding.logoUrl) {
      document.querySelectorAll("[data-tenant-logo]").forEach((el) => { el.src = branding.logoUrl; });
    }
  }

  /** Só para testes/depuração. */
  function clearCache(orgId) {
    try { sessionStorage.removeItem(cacheKeyFor(orgId)); } catch { /* noop */ }
  }

  return { getOrgBranding, applyBranding, clearCache };
}
