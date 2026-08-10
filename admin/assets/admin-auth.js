// admin/assets/admin-auth.js — autenticação/autorização do Painel Master
// (plataforma), Fase 3.1 / Fase 3.2.
//
// Import LOCAL do núcleo compartilhado (caminho relativo, mesmo repositório)
// — o painel master não é um "tenant" no sentido do contrato
// tenant.config.js/getTenant() (que pressupõe 1 site = 1 organização fixa);
// ele é a própria plataforma, então inicializa o Firebase diretamente.
//
// Toda checagem de acesso passa por UMA função, requirePlatformAccess() —
// nenhuma página conhece o mecanismo por dentro. Fase 3.2: trocou de
// "role===master" em users/{uid} pra um doc real em platformAdmins/{uid}
// (owner/administrator/operator) — só este arquivo mudou; as 8 páginas que
// chamam requirePlatformAccess() continuam exatamente iguais.

import { initTenantFirebase } from "../../shared/core/auth/firebase-init.js?v=2026.08.5";
import { createRoleResolver } from "../../shared/core/auth/roles.js?v=2026.08.5";
import { createAuthSession } from "../../shared/core/auth/session.js?v=2026.08.5";
import { createAuditLogger } from "../../shared/core/tenant/audit.js?v=2026.08.5";

// Mesmo projeto Firebase do CCBMG (clubecavalobonfim) — decisão já tomada e
// documentada desde a criação do Portal Associativo: a plataforma inteira
// roda hoje sobre 1 único projeto Firebase, particionado por orgId.
const firebaseConfig = {
  apiKey: "AIzaSyB1HBodrFRmgGKnYtX2v0X5LiIkowhR9wg",
  authDomain: "clubecavalobonfim.firebaseapp.com",
  projectId: "clubecavalobonfim",
  storageBucket: "clubecavalobonfim.firebasestorage.app",
  messagingSenderId: "115015503370",
  appId: "1:115015503370:web:3864e3e55714d33f8319f3",
};

const { auth, db, storage } = initTenantFirebase(firebaseConfig, { persistence: true });
export { auth, db, storage };

// Fase 3.2: vocabulário de PLATAFORMA — owner/administrator/operator, em
// inglês de propósito (evita colisão com "operador" de Organization Operator,
// que é um papel completamente diferente, de outro plano de identidade — ver
// docs/CLAUDE.md "Fase 3.2"). Nada de associado/admin/operador do CCBMG
// pertence aqui: isso é regra de negócio de organização, não de plataforma.
export const PLATFORM_ROLES = ["operator", "administrator", "owner"];
const mapRole = createRoleResolver(
  [
    ["owner", (n) => n.includes("owner")],
    ["administrator", (n) => n.includes("administrator")],
    ["operator", (n) => n.includes("operator")],
  ],
  "outro"
);

const session = createAuthSession({
  auth,
  db,
  mapRole,
  roleField: "role",
  roleCollection: "platformAdmins",
  cacheKey: "platformRole",
});

// orgId "platform" sinaliza uma ação do operador da plataforma, não de uma
// organização específica — quando a ação afeta uma organização, o orgId dela
// vai em `details`, não aqui (mesmo padrão que o CCBMG já usa: currentOrgId
// no topo é "quem faz", details.orgId é "sobre o quê").
const audit = createAuditLogger({
  db,
  auth,
  getOrgId: async () => "platform",
  collectionName: "systemLogs",
});
export const logPlatformAction = audit.logAction;

/**
 * Única porta de entrada de autorização do painel master.
 * @param {object} [opts]
 * @param {string|string[]} [opts.requiredRole] — default: qualquer papel de
 *   plataforma (operator/administrator/owner). Passe um subconjunto pra
 *   restringir uma página/ação (ex.: ["administrator","owner"] pra esconder
 *   escrita de Platform Operator).
 * @param {(role: string, user: object) => void} [opts.onRole]
 */
export function requirePlatformAccess({ requiredRole, onRole } = {}) {
  session.requireAuth({
    requiredRole: requiredRole || PLATFORM_ROLES,
    loginUrl: "./login.html",
    unauthorizedUrl: "./login.html",
    onRole,
  });
}

export function platformLogout() {
  return session.doLogout({ redirectUrl: "./login.html" });
}

export const getCurrentRole = session.getCurrentRole;
export const fetchRoleByUid = session.fetchRoleByUid;
