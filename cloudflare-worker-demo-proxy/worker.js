// worker.js — proxy reverso puro pra demo.portalassociativo.com.br
// (Fase 3.9/3.10, ver CLAUDE.md do repositório clubedocavalobonfimmg).
//
// Não hospeda nenhum HTML/JS próprio, não sabe nada sobre organizações — só
// busca o conteúdo de clubedocavalobonfim.com.br e devolve verbatim.
// location.hostname, do ponto de vista do navegador, continua sendo
// demo.portalassociativo.com.br (nunca há redirect) — é esse hostname que o
// Tenant Resolver (shared/core/tenant/tenant-context.js) lê pra escolher a
// organização certa via domains/{hostname}.
//
// Genérico: o MESMO worker atende qualquer domínio futuro adicionado como
// Custom Domain dele (wrangler.toml) — nenhuma mudança de código por
// organização nova, só um novo bloco [[routes]].

const ORIGIN = "https://clubedocavalobonfim.com.br";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const originRequest = new Request(`${ORIGIN}${url.pathname}${url.search}`, request);
    const response = await fetch(originRequest, { cf: { cacheTtl: 300 } });
    return new Response(response.body, response);
  },
};
