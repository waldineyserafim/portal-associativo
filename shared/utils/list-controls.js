// shared/utils/list-controls.js — paginação e busca client-side, genéricas.
//
// Puro (sem Firebase, sem DOM) — recebe um array já carregado e devolve
// controles de paginação/busca sobre ele. Nenhuma página master carregava
// mais de algumas centenas de documentos antes desta fase (sem paginação
// nenhuma) — isso não troca a estratégia de carga (ainda é "carrega tudo,
// pagina no cliente"), só resolve a UI/UX de listas grandes; paginação real
// no servidor (startAfter/cursor do Firestore) fica para quando o volume
// justificar, sem quebrar este contrato (getPage/search continuam fazendo
// sentido por cima de uma página de resultados do servidor também).

/**
 * @param {object} opts
 * @param {any[]} [opts.data=[]]
 * @param {number} [opts.pageSize=20]
 * @param {string[]} [opts.searchFields=[]] — campos do item comparados (string, case-insensitive, substring) na busca.
 */
export function createListController({ data = [], pageSize = 20, searchFields = [] } = {}) {
  let allData = data;
  let filtered = data;
  let currentPage = 1;
  let query = "";

  function applyFilter() {
    if (!query) {
      filtered = allData;
    } else {
      const q = query.toLowerCase();
      filtered = allData.filter((item) =>
        searchFields.some((field) => String(item?.[field] ?? "").toLowerCase().includes(q))
      );
    }
    currentPage = 1;
  }

  function totalPages() {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }

  function clampPage(page) {
    return Math.min(Math.max(1, page), totalPages());
  }

  /** Substitui o dataset (ex.: depois de um novo getDocs()). Reaplica a busca ativa. */
  function setData(newData) {
    allData = newData || [];
    applyFilter();
  }

  /** Atualiza o termo de busca e volta pra página 1. */
  function search(q) {
    query = q || "";
    applyFilter();
  }

  /** @returns {any[]} os itens da página pedida (não avança estado se só quiser espiar). */
  function getPage(page) {
    currentPage = clampPage(page);
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }

  /** @returns {any[]} os itens da página atual (sem mudar página). */
  function getCurrentPage() {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }

  applyFilter();

  return {
    setData,
    search,
    getPage,
    getCurrentPage,
    get currentPage() { return currentPage; },
    get pageSize() { return pageSize; },
    get totalPages() { return totalPages(); },
    get totalItems() { return filtered.length; },
    get totalItemsUnfiltered() { return allData.length; },
  };
}
