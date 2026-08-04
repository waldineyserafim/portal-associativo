// js/forms.js — envio de formulários sem backend (ver docs/architecture/README.md
// §Formulários). Decisão adotada nesta fase: montar um link mailto: com os dados
// preenchidos e abrir o aplicativo de e-mail do usuário — funciona 100% estático,
// compatível com GitHub Pages, sem depender de serviço de terceiro ainda não
// avaliado (Formspree/Web3Forms) nem de Cloud Function própria.

const DEST_EMAIL = "contato@portalassociativo.com.br";

export function initMailtoForm(form, { subjectPrefix, buildBody }) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const subject = encodeURIComponent(`${subjectPrefix} — ${data.nome || ""}`.trim());
    const body = encodeURIComponent(buildBody(data));

    window.location.href = `mailto:${DEST_EMAIL}?subject=${subject}&body=${body}`;

    const feedback = form.querySelector("[data-form-feedback]");
    if (feedback) feedback.classList.remove("d-none");
  });
}
