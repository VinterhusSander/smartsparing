import { UserController } from "../logic/user-controller.js";
import { t } from "../logic/i18n.js";

class UserCreate extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.innerHTML = `
      <section style="border:1px solid #ccc; padding:12px; margin:12px 0;" aria-labelledby="create-user-title">
        <h2 id="create-user-title">${t("createUserTitle")}</h2>

        <div style="display:grid; gap:8px; margin-bottom:10px;">
          <label for="username">${t("usernameLabel")}</label>
          <input id="username" name="username" type="text" autocomplete="username" />

          <label for="password">${t("passwordLabel")}</label>
          <input id="password" name="password" type="password" autocomplete="new-password" />
          <small id="password-help">${t("passwordHelp")}</small>

          <label>
            <input id="tos" type="checkbox" />
            ${t("acceptTermsPrefix")} 
            <a href="./terms.html" target="_blank" rel="noopener noreferrer">
              ${t("termsOfService")}
            </a>
          </label>

          <label>
            <input id="privacy" type="checkbox" />
            ${t("acceptPrivacyPrefix")} 
            <a href="./privacy.html" target="_blank" rel="noopener noreferrer">
              ${t("privacyPolicy")}
            </a>
          </label>
        </div>

        <button id="btn" type="button">${t("createButton")}</button>
        <div id="status" style="margin-top:10px;" aria-live="polite"></div>
      </section>
    `;

    this.querySelector("#btn").addEventListener("click", () => this.onCreate());
  }

  async onCreate() {
    const status = this.querySelector("#status");
    status.textContent = "";

    const username = this.querySelector("#username").value.trim();
    const password = this.querySelector("#password").value;
    const acceptedTos = this.querySelector("#tos").checked;
    const acceptedPrivacy = this.querySelector("#privacy").checked;

    if (!username || !password) {
      status.textContent = t("fillUsernamePassword");
      return;
    }

    try {
      const result = await this.controller.createUser({
        username,
        password,
        consent: { acceptedTos, acceptedPrivacy },
      });

      localStorage.setItem("authToken", result.token);

      status.textContent = t("userCreated", {
        username: result.username,
        id: result.id,
      });

      this.dispatchEvent(new CustomEvent("user:created", { bubbles: true, detail: result }));
    } catch (err) {
      status.textContent = `❌ ${err.message}`;
    }
  }
}

customElements.define("user-create", UserCreate);