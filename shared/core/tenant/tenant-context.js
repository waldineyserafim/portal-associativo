// shared/core/tenant/tenant-context.js — resolução de tenant.
//
// DECISÃO DE ARQUITETURA (ler antes de alterar este arquivo):
// getTenant() é assíncrona (retorna Promise) mesmo hoje, quando a resolução
// é só ler uma variável global síncrona. Isso é proposital: quando a
// resolução dinâmica por domínio existir, só o CORPO desta função muda.
// Nenhum consumidor (session.js, modules.js, branding.js, audit.js, nem
// código de página) precisa mudar uma linha, porque todos já fazem
// `await getTenant()`. É a migração aditiva descrita em shared/README.md.
//
// Hoje: lê window.__TENANT_CONFIG__, que cada site declara localmente via
// um <script src="./tenant.config.js"> carregado ANTES deste módulo — e
// enriquece com `domain: location.hostname`, que não precisa de nenhuma
// leitura de rede (é literalmente o host que serviu esta página).
//
// Fase 3.5 — por que o corpo NÃO consulta `domains/{hostname}` no Firestore
// ainda: hoje cada deployment (GitHub Pages, CNAME único por repositório —
// ver docs/SAAS_MULTITENANT.md, gap G4, CCBMG) já serve uma única
// organização, então "qual orgId?" tem sempre a mesma resposta conhecida
// estaticamente — uma consulta de rede no boot de toda página pública
// adicionaria latência e um novo modo de falha sem nenhum ganho observável.
// `domains/{hostname}` já existe e é a fonte de verdade de governança
// (unicidade entre organizações, gerida pela Central de Configuração), mas
// só passa a ser o que ESTA função consulta quando G4 for resolvido (decisão
// de hospedagem — Firebase Hosting ou proxy — permitindo um único deployment
// servir múltiplos domínios/organizações de verdade). Quando isso acontecer,
// o padrão recomendado é: consultar `domains/{location.hostname}` primeiro,
// com fallback pro `orgId` estático abaixo se a consulta falhar ou o
// domínio não estiver cadastrado — nunca cair silenciosamente pra uma
// organização diferente da acessada.

let _tenantPromise = null;

/**
 * @returns {Promise<{orgId: string, firebase: object, loginUrl?: string, branding?: object, domain: string}>}
 */
export function getTenant() {
  if (_tenantPromise) return _tenantPromise;

  _tenantPromise = new Promise((resolve, reject) => {
    const config = window.__TENANT_CONFIG__;
    if (!config || !config.orgId) {
      reject(new Error(
        "[shared/core/tenant] window.__TENANT_CONFIG__ ausente ou sem orgId. " +
        "Declare um <script src=\"./tenant.config.js\"> ANTES de importar este módulo."
      ));
      return;
    }
    // Congela para impedir mutação acidental do config resolvido por um
    // consumidor — qualquer alteração de tenant precisa passar por uma
    // nova resolução, nunca editar o objeto em memória.
    resolve(Object.freeze({
      ...config,
      domain: (typeof location !== "undefined" && location.hostname) || "",
    }));
  });

  return _tenantPromise;
}

/** Só para testes/depuração — força uma nova resolução na próxima chamada. */
export function _resetTenantCacheForTests() {
  _tenantPromise = null;
}
