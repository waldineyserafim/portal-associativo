// shared/core/auth/roles.js — mecanismo genérico de normalização de papel.
//
// O núcleo não conhece vocabulário de papel nenhum (nem "master", nem
// "associado") — cada tenant declara suas próprias regras, na ordem em que
// devem ser testadas. Isso reproduz exatamente o comportamento do
// mapRole() atual do CCBMG, só que com o vocabulário fora do núcleo.

/**
 * Normaliza uma string para comparação tolerante a acento/maiúscula/espaço.
 * @param {string} raw
 * @returns {string}
 */
function normalize(raw) {
  return String(raw || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * @param {Array<[roleName: string, test: (normalized: string) => boolean]>} rules
 *   Testadas em ordem — a primeira que casar decide o papel.
 * @param {string} fallbackRole — usado quando nenhuma regra casa.
 * @returns {(raw: string) => string} mapRole
 *
 * Exemplo (reproduzindo o vocabulário atual do CCBMG no site consumidor,
 * não aqui):
 *   const mapRole = createRoleResolver([
 *     ["master", (r) => r === "master"],
 *     ["adminView", (r) => r.includes("adminview") || r.includes("admin view")],
 *     ["admin", (r) => r.includes("admin")],
 *     ["operador", (r) => r.includes("operador")],
 *     ["participanteLeilao", (r) => r.includes("participante") || r.includes("leilao")],
 *   ], "associado");
 */
export function createRoleResolver(rules, fallbackRole) {
  return function mapRole(raw) {
    const normalized = normalize(raw);
    for (const [roleName, test] of rules) {
      if (test(normalized)) return roleName;
    }
    return fallbackRole;
  };
}
