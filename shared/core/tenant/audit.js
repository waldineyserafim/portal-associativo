// shared/core/tenant/audit.js — auditoria de ações administrativas.
//
// Mecanismo genérico, reproduzindo logAction() do CCBMG: grava em uma
// coleção de log com identidade do usuário + organização + ação + detalhes.
// Falha silenciosamente (auditoria nunca deve interromper o fluxo
// principal de uma ação real) — mesmo comportamento de hoje.

import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * @param {object} opts
 * @param {object} opts.db
 * @param {object} opts.auth
 * @param {() => Promise<string>} opts.getOrgId
 * @param {string} [opts.collectionName="systemLogs"]
 */
export function createAuditLogger({ db, auth, getOrgId, collectionName = "systemLogs" }) {
  /**
   * @param {string} action
   * @param {object} [details]
   */
  async function logAction(action, details = {}) {
    try {
      const user = auth.currentUser;
      const orgId = await getOrgId();
      await addDoc(collection(db, collectionName), {
        userId: user?.uid || null,
        userEmail: user?.email || null,
        orgId,
        action,
        details,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.warn("[shared/core/tenant] falha ao registrar auditoria (ignorado, não interrompe a ação):", e);
    }
  }

  return { logAction };
}
