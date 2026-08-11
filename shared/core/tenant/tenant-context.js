// shared/core/tenant/tenant-context.js — resolução de tenant.
//
// DECISÃO DE ARQUITETURA (ler antes de alterar este arquivo):
// getTenant() sempre foi assíncrona (retorna Promise), desde quando a
// resolução era só ler uma variável global síncrona — proposital: nenhum
// consumidor (session.js, modules.js, branding.js, audit.js, nem código de
// página) precisou mudar uma linha quando a resolução dinâmica chegou,
// porque todos já faziam `await getTenant()`. Migração aditiva, como descrito
// em shared/README.md.
//
// Fase 3.9 — G4 resolvido: um único deployment (CCBMG, GitHub Pages) serve
// mais de uma organização, dependendo do hostname que serviu a página.
// `domains/{hostname}` (Fase 3.5) é a ÚNICA fonte de verdade de qual
// organização um hostname resolve — window.__TENANT_CONFIG__ não carrega
// mais orgId nenhum (só a config do SDK do Firebase, igual pra qualquer
// organização neste projeto único).
//
// Fase 3.10 — SEM fallback automático. A primeira versão desta função (Fase
// 3.9) caía pro orgId estático de tenant.config.js quando o hostname não
// estava em `domains/` — decisão revertida deliberadamente: mascarava erro
// de DNS/configuração e arriscava servir a organização ERRADA silenciosamente
// pra um hostname mal configurado. Agora: hostname sem registro em
// `domains/` = TenantNotFoundError, sem exceção pra nenhum caso (nem
// Sandbox, nem nenhum outro) — quem chama decide o que fazer (ver
// renderTenantNotFoundPage() abaixo, usado por firebase.js do CCBMG).
//
// getTenant() exige `db` (Firestore já inicializado) — não tem mais pra onde
// cair sem ele, então virou parâmetro obrigatório em vez de opcional.

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let _tenantPromise = null;

/** Erro distinguível — quem chama getTenant() pode checar `err instanceof TenantNotFoundError`
 * pra decidir renderizar uma página amigável em vez de deixar a exceção crua propagar. */
export class TenantNotFoundError extends Error {
  constructor(hostname) {
    super(`Nenhuma organização registrada para o hostname "${hostname}".`);
    this.name = "TenantNotFoundError";
    this.hostname = hostname;
  }
}

/**
 * @param {object} opts
 * @param {object} opts.db — instância de Firestore já inicializada (ver firebase-init.js). Obrigatória.
 * @param {string} [opts.domainsCollection="domains"]
 * @param {number} [opts.cacheTtlMs=3600000] — 1h.
 * @returns {Promise<{orgId: string, firebase: object, domain: string}>}
 * @throws {TenantNotFoundError} hostname sem registro em domains/{hostname}.
 */
export function getTenant({ db, domainsCollection = "domains", cacheTtlMs = 60 * 60 * 1000 } = {}) {
  if (_tenantPromise) return _tenantPromise;

  _tenantPromise = (async () => {
    if (!db) throw new Error("[shared/core/tenant] getTenant() requer `db` (Firestore já inicializado).");

    const config = window.__TENANT_CONFIG__ || {};
    const hostname = (typeof location !== "undefined" && location.hostname) || "";
    if (!hostname) throw new TenantNotFoundError(hostname);

    const cacheKey = `tenant_domain_${hostname}`;
    let orgId = null;
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.at < cacheTtlMs) orgId = cached.orgId;
    } catch { /* cache inválido, ignora e consulta de novo */ }

    if (!orgId) {
      const snap = await getDoc(doc(db, domainsCollection, hostname));
      if (snap.exists() && snap.data().orgId) {
        orgId = snap.data().orgId;
        try { sessionStorage.setItem(cacheKey, JSON.stringify({ orgId, at: Date.now() })); } catch { /* sem storage, segue sem cache */ }
      }
    }

    if (!orgId) throw new TenantNotFoundError(hostname);

    // Congela para impedir mutação acidental do config resolvido por um
    // consumidor — qualquer alteração de tenant precisa passar por uma nova
    // resolução, nunca editar o objeto em memória.
    return Object.freeze({ ...config, orgId, domain: hostname });
  })();

  return _tenantPromise;
}

/** Só para testes/depuração — força uma nova resolução na próxima chamada. */
export function _resetTenantCacheForTests() {
  _tenantPromise = null;
}

/**
 * Página amigável de "organização não encontrada" — substitui TODO o
 * conteúdo do <body> (não dá pra aplicar branding/CSS da organização, porque
 * é justamente ela que não foi resolvida). Deliberadamente sem dependência
 * de nenhum framework/CSS externo — precisa funcionar mesmo se absolutamente
 * nada mais na página carregou.
 * @param {TenantNotFoundError} err
 */
export function renderTenantNotFoundPage(err) {
  document.title = "Organização não encontrada";
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
                font-family:system-ui,-apple-system,sans-serif;background:#f8f7f4;color:#2b2b28;padding:24px;">
      <div style="max-width:420px;text-align:center;">
        <div style="font-size:40px;line-height:1;margin-bottom:16px;">🔎</div>
        <h1 style="font-size:20px;margin:0 0 8px;">Organização não encontrada</h1>
        <p style="font-size:14px;color:#6b6b64;margin:0 0 4px;">
          O endereço <strong>${err?.hostname ? String(err.hostname).replace(/</g, "&lt;") : "acessado"}</strong>
          não está associado a nenhuma organização cadastrada.
        </p>
        <p style="font-size:13px;color:#8a8a83;">Se você é administrador da plataforma, verifique o cadastro
          de domínios no Painel Master.</p>
      </div>
    </div>`;
}
