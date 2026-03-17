import { t } from "../logic/i18n.js";

class UserEdit extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section style="border:1px solid #ccc; padding:12px; margin:12px 0;" aria-labelledby="edit-user-title">
        <h2 id="edit-user-title">${t("editUserTitle")}</h2>
        <p>${t("editUserText")}</p>
      </section>
    `;
  }
}

customElements.define("user-edit", UserEdit);