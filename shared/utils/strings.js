// shared/utils/strings.js — helpers de string puros, sem Firebase, sem DOM.

/** Remove tudo que não é dígito. Útil para CPF/telefone/CEP em qualquer tenant. */
export function onlyDigits(s) {
  return (s || "").replace(/\D/g, "");
}
