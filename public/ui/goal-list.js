import { UserController } from "../logic/user-controller.js";

class GoalList extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.render();
    this.loadGoals();

    window.addEventListener("goals:changed", this.loadGoals.bind(this));
    window.addEventListener("savings:changed", this.loadGoals.bind(this));
    window.addEventListener("user:created", this.loadGoals.bind(this));
  }

  render() {
    this.innerHTML = `
      <section style="border:1px solid #ccc; padding:12px; margin:12px 0;">
        <h2>Dine sparemål</h2>
        <div id="list"></div>
      </section>
    `;
  }

  async loadGoals() {
    const list = this.querySelector("#list");
    list.innerHTML = "Laster...";

    const token = localStorage.getItem("authToken");
    if (!token) {
      list.innerHTML = "Du må være logget inn";
      return;
    }

    try {
      const goals = await this.controller.getGoalsWithProgress({ token });

      if (!goals.length) {
        list.innerHTML = "Ingen mål enda";
        return;
      }

      list.innerHTML = goals
        .map(
          (goal) => `
        <div style="border:1px solid #ddd; padding:8px; margin-bottom:8px;">
          <strong>${goal.title}</strong><br/>
          Mål: ${goal.targetAmount} kr<br/>
          Spart: ${goal.savedSoFar} kr<br/>
          Gjenstår: ${goal.remainingAmount} kr<br/>
          Progresjon: ${goal.progressPercent}%
        </div>
      `
        )
        .join("");
    } catch (err) {
      list.innerHTML = `❌ ${err.message}`;
    }
  }
}

customElements.define("goal-list", GoalList);