import { UserController } from "../logic/user-controller.js";

class SavingsSummary extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.render();
    this.loadSummary();

    window.addEventListener("savings:changed", this.loadSummary.bind(this));
    window.addEventListener("user:created", this.loadSummary.bind(this));
  }

  render() {
    this.innerHTML = `
      <section style="border:1px solid #ccc; padding:12px; margin:12px 0;">
        <h2>Din sparing</h2>
        <div id="content">Laster...</div>
      </section>
    `;
  }

  async loadSummary() {
    const content = this.querySelector("#content");

    const token = localStorage.getItem("authToken");

    if (!token) {
      content.innerHTML = "Du må være logget inn";
      return;
    }

    try {
      const summary = await this.controller.getSavingsSummary({ token });

      content.innerHTML = `
        <div><strong>Total spart:</strong> ${summary.totalSaved} kr</div>
        <div><strong>Spart til mål:</strong> ${summary.totalSavedForGoals} kr</div>
        <div><strong>Spart uten mål:</strong> ${summary.totalSavedWithoutGoal} kr</div>
        <div><strong>Antall registreringer:</strong> ${summary.savingsCount}</div>
      `;
    } catch (err) {
      content.innerHTML = `❌ ${err.message}`;
    }
  }
}

customElements.define("savings-summary", SavingsSummary);