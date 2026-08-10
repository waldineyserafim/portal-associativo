// admin/assets/pagination-ui.js — renderização DOM da paginação, reusada
// pelas telas de lista (organizations/subscriptions/audit/modules).
//
// Fica em admin/, não em shared/: list-controls.js (shared) é o mecanismo
// puro; isto aqui é só a marcação de <button> específica destas telas.
// Prev/next + "X de Y", não uma lista de números de página — com milhares
// de organizações uma lista de páginas não escala, prev/next escala sempre.

/**
 * @param {HTMLElement} container
 * @param {ReturnType<typeof import("../../shared/utils/list-controls.js").createListController>} controller
 * @param {(page: number) => void} onChange
 */
export function renderPagination(container, controller, onChange) {
  if (controller.totalItems === 0) {
    container.innerHTML = "";
    return;
  }
  const { currentPage, totalPages, totalItems } = controller;
  container.innerHTML = `
    <div class="ds-pagination">
      <button type="button" class="ds-pagination-btn" id="ppPrev" ${currentPage <= 1 ? "disabled" : ""}>
        <i class="bi bi-chevron-left" aria-hidden="true"></i> Anterior
      </button>
      <span class="ds-pagination-info">${totalItems} resultado(s) · página ${currentPage} de ${totalPages}</span>
      <button type="button" class="ds-pagination-btn" id="ppNext" ${currentPage >= totalPages ? "disabled" : ""}>
        Próxima <i class="bi bi-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
  `;
  container.querySelector("#ppPrev")?.addEventListener("click", () => onChange(currentPage - 1));
  container.querySelector("#ppNext")?.addEventListener("click", () => onChange(currentPage + 1));
}
