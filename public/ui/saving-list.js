import { UserController } from "../logic/user-controller.js";

class SavingList extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.render();
    this.loadSavings();

    window.addEventListener("savings:changed", this.loadSavings.bind(this));
    window.addEventListener("user:created", this.loadSavings.bind(this));
  }

  render() {
    this.innerHTML = `
      <section style="border:1px solid #ccc; padding:12px; margin:12px 0;">
        <h2>Dine registrerte sparinger</h2>
        <div id="list">Laster...</div>
      </section>
    `;
  }

  async loadSavings() {
    const list = this.querySelector("#list");

    const token = localStorage.getItem("authToken");

    if (!token) {
      list.innerHTML = "Du må være logget inn";
      return;
    }

    try {
      const savings = await this.controller.getSavings({ token });
      const goals = await this.controller.getGoals({ token });

      if (!savings.length) {
        list.innerHTML = "Ingen sparinger enda";
        return;
      }

      // Lag lookup for goal navn
      const goalMap = {};
      for (const goal of goals) {
        goalMap[goal.id] = goal.title;
      }

      list.innerHTML = savings
        .map((saving) => {
          const goalText = saving.goalId
            ? goalMap[saving.goalId] || "Ukjent mål"
            : "Ingen mål";

          return `
            <div style="border:1px solid #ddd; padding:8px; margin-bottom:8px;">
              <strong>${saving.itemName}</strong><br/>
              Ordinær pris: ${saving.originalPrice} kr<br/>
              Tilbudspris: ${saving.discountPrice} kr<br/>
              Spart: ${saving.savedAmount} kr<br/>
              Mål: ${goalText}
            </div>
          `;
        })
        .join("");
    } catch (err) {
      list.innerHTML = `❌ ${err.message}`;
    }
  }
}

customElements.define("saving-list", SavingList);