// shared/core/tenant/tenant-context.js — resolução de tenant.
//
// DECISÃO DE ARQUITETURA (ler antes de alterar este arquivo):
// getTenant() é assíncrona (retorna Promise) mesmo hoje, quando a resolução
// é só ler uma variável global síncrona. Isso é proposital: quando a
// resolução dinâmica por domínio existir (docs/SAAS_MULTITENANT.md §3/§5,
// Fase 3 daquele roadmap — consultar `domains/{hostname}` no Firestore),
// só o CORPO desta função muda. Nenhum consumidor (session.js, modules.js,
// audit.js, nem código de página) precisa mudar uma linha, porque todos já
// fazem `await getTenant()`. É a migração aditiva descrita em
// shared/README.md.
//
// Hoje: lê window.__TENANT_CONFIG__, que cada site declara localmente via
// um <script src="./tenant.config.js"> carregado ANTES deste módulo.

let _tenantPromise = null;

/**
 * @returns {Promise<{orgId: string, firebase: object, loginUrl?: string, branding?: object}>}
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
    resolve(Object.freeze({ ...config }));
  });

  return _tenantPromise;
}

/** Só para testes/depuração — força uma nova resolução na próxima chamada. */
export function _resetTenantCacheForTests() {
  _tenantPromise = null;
}
