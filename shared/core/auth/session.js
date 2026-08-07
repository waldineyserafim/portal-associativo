// shared/core/auth/session.js — guarda de rota, logout e resolução de papel.
//
// Reproduz o mecanismo de requireAuth()/doLogout()/getCurrentRole() do
// firebase.js atual do CCBMG, mas sem nenhum default hardcoded (nem
// "./login.html", nem "./index.html", nem vocabulário de papel) e sem
// nenhum efeito colateral automático — nada aqui roda sozinho ao ser
// importado, tudo é chamado explicitamente pela página consumidora (ver
// shared/README.md, "O que NUNCA vai para o núcleo").

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * @param {object} opts
 * @param {object} opts.auth — instância de Auth (de initTenantFirebase).
 * @param {object} opts.db — instância de Firestore (de initTenantFirebase).
 * @param {(raw: string) => string} opts.mapRole — de createRoleResolver().
 * @param {string} [opts.roleField="role"]
 * @param {string} [opts.roleCollection="users"]
 * @param {string} [opts.cacheKey="userRole"] — chave no sessionStorage.
 */
export function createAuthSession({
  auth,
  db,
  mapRole,
  roleField = "role",
  roleCollection = "users",
  cacheKey = "userRole",
}) {
  function cacheRole(role) {
    try { sessionStorage.setItem(cacheKey, role); } catch { /* ignora ambiente sem sessionStorage */ }
  }
  function loadCachedRole() {
    try { return sessionStorage.getItem(cacheKey); } catch { return null; }
  }
  function clearCachedRole() {
    try { sessionStorage.removeItem(cacheKey); } catch { /* noop */ }
  }

  async function fetchRoleByUid(uid) {
    const snap = await getDoc(doc(db, roleCollection, uid));
    const raw = snap.exists() ? snap.data()[roleField] : "";
    return mapRole(raw);
  }

  async function getCurrentRole() {
    const cached = loadCachedRole();
    if (cached) return cached;
    const user = auth.currentUser;
    if (!user) return null;
    const role = await fetchRoleByUid(user.uid);
    cacheRole(role);
    return role;
  }

  /**
   * @param {object} options
   * @param {string|string[]} [options.requiredRole] — se informado, só esse(s) papel(is) passa(m) (inclusão, não igualdade — um único papel resolvido só precisa bater com um item da lista).
   * @param {string} options.loginUrl — obrigatório; para onde vai quem não está logado.
   * @param {string} [options.unauthorizedUrl] — para onde vai quem está logado mas sem o papel exigido (default: loginUrl).
   * @param {string[]} [options.readOnlyRoles=[]] — papéis que disparam o banner de "somente leitura".
   * @param {string} [options.readOnlyBannerText] — texto do banner (obrigatório se readOnlyRoles não for vazio).
   * @param {(role: string, user: object) => void} [options.onRole] — chamado depois que o papel é resolvido e aprovado.
   */
  function requireAuth(options = {}) {
    const { requiredRole, loginUrl, unauthorizedUrl, readOnlyRoles = [], readOnlyBannerText, onRole } = options;

    if (!loginUrl) {
      console.error(
        "[shared/core/auth] requireAuth() chamado sem `loginUrl` — nenhum redirecionamento hardcoded existe no núcleo. " +
        "Passe loginUrl explicitamente (ex.: \"./login.html\")."
      );
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = loginUrl;
        return;
      }

      let role;
      try {
        role = await fetchRoleByUid(user.uid);
      } catch (e) {
        console.error("[shared/core/auth] falha ao resolver papel do usuário:", e);
        window.location.href = loginUrl;
        return;
      }
      cacheRole(role);

      if (requiredRole) {
        const allowed = (Array.isArray(requiredRole) ? requiredRole : [requiredRole]).map(mapRole);
        if (!allowed.includes(role)) {
          window.location.href = unauthorizedUrl || loginUrl;
          return;
        }
      }

      window.__userRole = role;
      window.__userEmail = user.email;
      window.__userUid = user.uid;

      if (readOnlyRoles.includes(role) && readOnlyBannerText) {
        const banner = document.createElement("div");
        banner.className = "alert alert-warning text-center mb-0 rounded-0";
        banner.setAttribute("role", "status");
        banner.textContent = readOnlyBannerText;
        document.body.prepend(banner);
      }

      if (typeof onRole === "function") onRole(role, user);
    });
  }

  /**
   * @param {object} options
   * @param {string} options.redirectUrl — obrigatório; para onde vai depois de sair.
   */
  async function doLogout({ redirectUrl } = {}) {
    if (!redirectUrl) {
      console.error("[shared/core/auth] doLogout() chamado sem `redirectUrl` — nenhum redirecionamento hardcoded existe no núcleo.");
      return;
    }
    await signOut(auth);
    clearCachedRole();
    window.location.href = redirectUrl;
  }

  return { requireAuth, doLogout, getCurrentRole, fetchRoleByUid };
}
