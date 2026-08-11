// admin/assets/admin-nav.js — shell de navegação do Painel Master (Fase 3.1).
//
// Injeta a sidebar (off-canvas em mobile, fixa em desktop — CSS já existe em
// shared/components/sidebar.css) e a topbar mobile com o botão que abre essa
// sidebar. Cada página chama renderAdminNav({active}) uma vez, no início do
// próprio <script type="module">.

const NAV_ITEMS = [
  { key: "dashboard", href: "./index.html", label: "Dashboard", icon: "bi-speedometer2" },
  { key: "organizations", href: "./organizations.html", label: "Organizações", icon: "bi-buildings" },
  { key: "domains", href: "./domains.html", label: "Domínios", icon: "bi-globe2" },
  { key: "plans", href: "./plans.html", label: "Planos", icon: "bi-layers" },
  { key: "subscriptions", href: "./subscriptions.html", label: "Assinaturas", icon: "bi-receipt" },
  { key: "modules", href: "./modules.html", label: "Módulos", icon: "bi-puzzle" },
  { key: "audit", href: "./audit.html", label: "Auditoria", icon: "bi-clock-history" },
  { key: "platform-operators", href: "./platform-operators.html", label: "Equipe da plataforma", icon: "bi-person-badge" },
  { key: "feature-flags", href: "./feature-flags.html", label: "Feature Flags", icon: "bi-toggles" },
  { key: "settings", href: "./settings.html", label: "Configurações", icon: "bi-gear" },
];

function navLinksHtml(active) {
  return NAV_ITEMS.map((item) => {
    const isActive = item.key === active;
    return `<a href="${item.href}" class="ds-sidebar-link${isActive ? " is-active" : ""}"${isActive ? ' aria-current="page"' : ""}>
      <i class="bi ${item.icon}" aria-hidden="true"></i> ${item.label}
    </a>`;
  }).join("\n");
}

/**
 * Monta a sidebar + topbar mobile do Painel Master e devolve os handles de
 * DOM já com os listeners de abrir/fechar/logout ligados.
 * @param {object} opts
 * @param {string} opts.active - key de NAV_ITEMS correspondente à página atual.
 * @param {string} [opts.userName] - rótulo exibido no rodapé da sidebar.
 */
export function renderAdminNav({ active, userName } = {}) {
  const sidebarHtml = `
    <aside class="ds-sidebar" id="adminSidebar">
      <div class="ds-sidebar-brand">
        <i class="bi bi-diagram-3" aria-hidden="true"></i> Painel Master
      </div>
      <div class="ds-sidebar-section">Plataforma</div>
      ${navLinksHtml(active)}
      <div style="margin-top:auto;">
        <div class="ds-sidebar-section">${userName ? userName : ""}</div>
        <a href="#" id="adminLogoutLink" class="ds-sidebar-link is-danger">
          <i class="bi bi-box-arrow-right" aria-hidden="true"></i> Sair
        </a>
      </div>
    </aside>
    <div class="ds-sidebar-overlay" id="adminSidebarOverlay"></div>
  `;
  document.body.insertAdjacentHTML("afterbegin", sidebarHtml);

  const main = document.querySelector(".ds-admin-main");
  if (main) {
    const topbarHtml = `
      <div class="ds-admin-topbar">
        <button type="button" class="ds-admin-topbar-toggle" id="adminSidebarToggle" aria-label="Abrir menu" aria-controls="adminSidebar" aria-expanded="false">
          <i class="bi bi-list" aria-hidden="true"></i>
        </button>
        <span class="ds-admin-topbar-brand">Painel Master</span>
      </div>
    `;
    main.insertAdjacentHTML("afterbegin", topbarHtml);
  }

  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("adminSidebarOverlay");
  const toggle = document.getElementById("adminSidebarToggle");
  const logoutLink = document.getElementById("adminLogoutLink");

  function openSidebar() {
    sidebar.classList.add("is-open");
    toggle?.setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }

  toggle?.addEventListener("click", () => {
    sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
  });
  // O overlay só fica visível quando a sidebar está aberta (CSS: seletor
  // irmão `.ds-sidebar.is-open ~ .ds-sidebar-overlay`) — o clique nele só
  // precisa fechar, nunca abrir.
  overlay?.addEventListener("click", closeSidebar);

  logoutLink?.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const { platformLogout } = await import("./admin-auth.js");
    platformLogout();
  });

  return { sidebar, overlay, toggle, closeSidebar, openSidebar };
}
