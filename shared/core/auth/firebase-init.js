// shared/core/auth/firebase-init.js — inicialização do Firebase App.
//
// Puramente mecânico: recebe a config de fora (do tenant.config.js de cada
// site consumidor) e devolve as instâncias prontas. Nenhuma credencial,
// nenhum projeto Firebase específico fica hardcoded aqui — isso pertence ao
// tenant, nunca ao núcleo (ver shared/README.md, "O que NUNCA vai para o
// núcleo").
//
// SDK importado direto do CDN oficial do Google, mesma versão usada hoje
// pelos tenants — sem camada de re-export própria (ver shared/README.md
// para o racional: uma indireção a mais aqui não traria ganho real).

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

/**
 * @param {object} firebaseConfig — vem de window.__TENANT_CONFIG__.firebase no site consumidor.
 * @param {{persistence?: boolean}} [opts]
 * @returns {{app: object, auth: object, db: object, storage: object}}
 */
export function initTenantFirebase(firebaseConfig, opts = {}) {
  const { persistence = true } = opts;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  if (persistence) {
    setPersistence(auth, browserLocalPersistence).catch((e) => {
      console.warn("[shared/core/auth] não foi possível setar persistence (ignorado):", e);
    });
  }

  return { app, auth, db, storage };
}
