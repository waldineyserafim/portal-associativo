// js/firebase.js — Portal Associativo
//
// Este módulo NÃO está em uso ativo ainda. O Portal, nesta fase, apenas
// redireciona "Login Master" para o projeto Clube do Cavalo de Bonfim MG
// (ver pages/login.html). Ele é preparado agora para quando o Painel Master
// migrar para cá (Fase 5 do roadmap — ver docs/roadmap/).
//
// Aponta para o MESMO projeto Firebase do Clube do Cavalo de Bonfim MG
// (`clubecavalobonfim`) — não é um projeto Firebase novo. A apiKey de um
// app Firebase web é um identificador público (não é secreto), por isso é
// seguro repeti-la aqui; regras de acesso reais vivem no Firestore/Storage
// rules do projeto original, que este repositório não altera.
//
// Importado via CDN modular (mesma versão do projeto CCBMG) — sem bundler,
// sem npm install, compatível com GitHub Pages.

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1HBodrFRmgGKnYtX2v0X5LiIkowhR9wg",
  authDomain: "clubecavalobonfim.firebaseapp.com",
  projectId: "clubecavalobonfim",
  storageBucket: "clubecavalobonfim.firebasestorage.app",
  messagingSenderId: "115015503370",
  appId: "1:115015503370:web:3864e3e55714d33f8319f3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
  .catch((e) => console.warn("Não foi possível setar persistence (ignorado):", e));

// URL canônica do login existente (Painel Master continua no CCBMG até a Fase 5).
export const MASTER_LOGIN_URL = "https://clubedocavalobonfim.com.br/login_master.html";
