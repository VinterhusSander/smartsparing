import { UserController } from "../logic/user-controller.js";

class UserCreate extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.innerHTML = `
      <div style="border:1px solid #ccc; padding:12px; margin:12px 0;">
        <h2>Create user</h2>

        <div style="display:grid; gap:8px; margin-bottom:10px;">
          <input id="username" type="text" placeholder="username" />
          <input id="password" type="password" placeholder="password (min 6 chars)" />

          <label>
            <input id="tos" type="checkbox" />
            Accept Terms of Service
          </label>
          <label>
            <input id="privacy" type="checkbox" />
            Accept Privacy Policy
          </label>
        </div>

        <button id="btn">Create</button>
        <div id="status" style="margin-top:10px;"></div>
      </div>
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
      status.textContent = "Please fill in username and password.";
      return;
    }

    try {
      const result = await this.controller.createUser({
        username,
        password,
        consent: { acceptedTos, acceptedPrivacy },
      });

      localStorage.setItem("authToken", result.token);
      status.textContent = `✅ User created: ${result.username} (id: ${result.id})`;
      // (valgfritt) gi beskjed til resten av appen
      this.dispatchEvent(new CustomEvent("user:created", { bubbles: true, detail: result }));
    } catch (err) {
      status.textContent = `❌ ${err.message}`;
    }
  }
}

customElements.define("user-create", UserCreate);
