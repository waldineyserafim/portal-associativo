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

// Formata um número no padrão brasileiro de celular (DDI+DDD+9 dígitos) pra
// exibição; formatos que não batem (organização fora do Brasil, número sem
// DDI) mostram os dígitos como vieram — nunca assume que todo tenant é
// brasileiro pra decidir NÃO mostrar nada.
function formatPhoneDisplay(digits) {
  const d = String(digits || "").replace(/\D/g, "");
  const m = d.match(/^55(\d{2})(\d{5})(\d{4})$/);
  return m ? `+55 (${m[1]}) ${m[2]}-${m[3]}` : d;
}

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
      // Várias páginas têm rel="icon" E rel="shortcut icon" — atualiza todos
      // (só o primeiro deixava o segundo com o favicon antigo em alguns navegadores).
      const iconLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      if (iconLinks.length) {
        iconLinks.forEach((link) => { link.href = branding.faviconUrl; });
      } else {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = branding.faviconUrl;
        document.head.appendChild(link);
      }
    }

    if (branding.corPrimaria) {
      document.documentElement.style.setProperty("--brand", branding.corPrimaria);
    }
    if (branding.corSecundaria) {
      document.documentElement.style.setProperty("--brand-dark", branding.corSecundaria);
    }

    // [data-tenant-name] é o nome exibido na navbar do portal público — usa o
    // nome completo (nomeCurto é um campo distinto, para exibições que
    // legitimamente precisam de um rótulo curto, ex.: tabela de organizações
    // do Painel Master; não deve ser confundido com o nome de exibição público).
    const displayName = branding.nome || branding.nomeCurto;
    if (displayName) {
      document.querySelectorAll("[data-tenant-name]").forEach((el) => { el.textContent = displayName; });
    }
    if (branding.logoUrl) {
      document.querySelectorAll("[data-tenant-logo]").forEach((el) => { el.src = branding.logoUrl; });
      // og:image (Fase 3.11 — White Label): sem isso, compartilhar o link de
      // qualquer organização em redes sociais/WhatsApp mostrava a prévia com o
      // logo do CCBMG (URL absoluta hardcoded no HTML estático de cada página).
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute("content", branding.logoUrl);
    }

    // Contato institucional (Fase 3.11 — White Label): [data-tenant-email] em
    // <a href="mailto:..."> troca href E texto; [data-tenant-address] só o
    // texto. Ambos condicionais — organização sem o campo preenchido mantém
    // o texto estático da página (fail-safe, mesmo padrão do resto daqui).
    if (branding.email) {
      document.querySelectorAll("[data-tenant-email]").forEach((el) => {
        el.textContent = branding.email;
        if (el.tagName === "A") el.href = `mailto:${branding.email}`;
      });
    }
    if (branding.endereco) {
      document.querySelectorAll("[data-tenant-address]").forEach((el) => { el.textContent = branding.endereco; });
    } else {
      // [data-tenant-address-card]/[data-tenant-address-empty] (Fase 4):
      // organização sem endereço configurado esconde o card de endereço (que,
      // sem isto, continuaria mostrando o endereço físico real do CCBMG
      // hardcoded no HTML) e mostra o estado vazio no lugar. Card visível por
      // padrão (a maioria das organizações tem endereço) — só esconde quando
      // NÃO há dado, mesmo padrão condicional de data-hide-if-sandbox acima,
      // agora orientado por dado em vez de um booleano fixo (achado #37 da
      // auditoria: antes, só "é o Sandbox?" escondia o endereço do CCBMG —
      // um 2º tenant de produção sem endereço próprio continuava vendo-o).
      document.querySelectorAll("[data-tenant-address-card]").forEach((el) => { el.classList.add("d-none"); });
      document.querySelectorAll("[data-tenant-address-empty]").forEach((el) => { el.classList.remove("d-none"); });
    }

    // WhatsApp (Evolução Multi-Tenant, Fase 4): [data-tenant-whatsapp] em
    // <a href="https://wa.me/..."> troca href (preservando qualquer
    // ?text=... já presente no atributo data-wa-text, ver uso em pay.html/
    // sobre.html/index.html/board.html) e, quando o elemento não tem texto
    // próprio marcado (sem [data-tenant-whatsapp-label]), também o texto
    // exibido — mesmo padrão fail-safe do resto desta função.
    if (branding.whatsapp) {
      document.querySelectorAll("[data-tenant-whatsapp]").forEach((el) => {
        const text = el.dataset.waText ? `?text=${encodeURIComponent(el.dataset.waText)}` : "";
        el.href = `https://wa.me/${branding.whatsapp}${text}`;
      });
      document.querySelectorAll("[data-tenant-whatsapp-label]").forEach((el) => {
        el.textContent = formatPhoneDisplay(branding.whatsapp);
      });
    }

    // Redes sociais (Fase 4): organizations/{orgId}.portal.redesSociais já
    // era administrável desde a Fase 3.4, mas sem nenhum consumidor no
    // frontend público (achado #36 da auditoria) — [data-tenant-social="facebook|instagram|youtube"]
    // troca o href; some (d-none) quando a organização não configurou aquela
    // rede específica, em vez de deixar um link morto/genérico visível.
    if (branding.redesSociais) {
      document.querySelectorAll("[data-tenant-social]").forEach((el) => {
        const network = el.dataset.tenantSocial;
        const url = branding.redesSociais[network];
        if (url) {
          el.href = url;
          el.classList.remove("d-none");
        } else {
          el.classList.add("d-none");
        }
      });
    }

    // [data-hide-if-sandbox] (Fase 3.11 — White Label): esconde conteúdo
    // institucional hardcoded que hoje só pertence de verdade ao CCBMG (fotos
    // reais de diretoria, histórico do clube) — nenhuma outra organização tem
    // uma versão própria disso ainda (não existe CMS pra essas seções, ver
    // CLAUDE.md). Gate por `isSandbox`, não por orgId: genérico pra qualquer
    // tenant de demonstração futuro, não uma exceção pro Sandbox de hoje.
    // [data-hide-if-sandbox-fallback] no MESMO container (ou logo em seguida)
    // aparece no lugar, se existir.
    if (branding.isSandbox === true) {
      document.querySelectorAll("[data-hide-if-sandbox]").forEach((el) => { el.classList.add("d-none"); });
      document.querySelectorAll("[data-hide-if-sandbox-fallback]").forEach((el) => { el.classList.remove("d-none"); });
    }

    // <title> — cada página declara só o propósito ("Login", "Área do
    // Associado") em <body data-page-title="..."> (nunca o nome da
    // organização, que não pertence ao HTML estático). Ausência do atributo
    // = página não migrada ainda, título estático de sempre continua valendo
    // (fail-safe, mesmo espírito do resto desta função).
    if (displayName && document.body?.dataset.pageTitle) {
      document.title = `${document.body.dataset.pageTitle} — ${displayName}`;
    }

    // meta[name="description"] (Fase 3.11 — White Label): mesmo padrão de
    // data-page-title, mas com um template ({org}) em vez de string fixa,
    // porque a descrição é uma frase inteira, não só um nome anexado no fim.
    // Ausência do atributo = descrição estática da página continua valendo.
    if (displayName && document.body?.dataset.descTemplate) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", document.body.dataset.descTemplate.replace(/\{org\}/g, displayName));
      }
    }
  }

  /** Só para testes/depuração. */
  function clearCache(orgId) {
    try { sessionStorage.removeItem(cacheKeyFor(orgId)); } catch { /* noop */ }
  }

  return { getOrgBranding, applyBranding, clearCache };
}
