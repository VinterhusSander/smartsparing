import { UserController } from "../logic/user-controller.js";

class UserDelete extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.innerHTML = `
      <div style="border:1px solid #ccc; padding:12px; margin:12px 0;">
        <h2>Delete account</h2>
        <p>Deletes the currently “logged in” user based on stored token.</p>

        <button id="btn" style="background:#b00020; color:#fff; padding:8px 12px; border:0; border-radius:6px;">
          Delete my account
        </button>

        <div id="status" style="margin-top:10px;"></div>
      </div>
    `;

    this.querySelector("#btn").addEventListener("click", () => this.onDelete());
  }

  async onDelete() {
    const status = this.querySelector("#status");
    status.textContent = "";

    const token = localStorage.getItem("authToken");
    if (!token) {
      status.textContent = "❌ No authToken found in localStorage. Create a user first.";
      return;
    }

    try {
      const result = await this.controller.deleteMe({ token });

      // Rydd opp lokalt
      localStorage.removeItem("authToken");

      status.textContent = `✅ ${result?.message ?? "Account deleted"}`;
      this.dispatchEvent(new CustomEvent("user:deleted", { bubbles: true, detail: result }));
    } catch (err) {
      status.textContent = `❌ ${err.message}`;
    }
  }
}

customElements.define("user-delete", UserDelete);
