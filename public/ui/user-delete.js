import { UserController } from "../logic/user-controller.js";
import { t } from "../logic/i18n.js";

class UserDelete extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.innerHTML = `
      <section style="border:1px solid #ccc; padding:12px; margin:12px 0;" aria-labelledby="delete-user-title">
        <h2 id="delete-user-title">${t("deleteAccountTitle")}</h2>
        <p>${t("deleteAccountText")}</p>

        <button id="btn" type="button" style="background:#b00020; color:#fff; padding:8px 12px; border:0; border-radius:6px;">
          ${t("deleteButton")}
        </button>

        <div id="status" style="margin-top:10px;" aria-live="polite"></div>
      </section>
    `;

    this.querySelector("#btn").addEventListener("click", () => this.onDelete());
  }

  async onDelete() {
    const status = this.querySelector("#status");
    status.textContent = "";

    const token = localStorage.getItem("authToken");
    if (!token) {
      status.textContent = t("noAuthToken");
      return;
    }

    try {
      const result = await this.controller.deleteMe({ token });
      localStorage.removeItem("authToken");
      status.textContent = result?.message ? `✅ ${result.message}` : t("accountDeleted");
      this.dispatchEvent(new CustomEvent("user:deleted", { bubbles: true, detail: result }));
    } catch (err) {
      status.textContent = `❌ ${err.message}`;
    }
  }
}

customElements.define("user-delete", UserDelete);