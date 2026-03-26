import { UserController } from "../logic/user-controller.js";

class SavingCreate extends HTMLElement {
  controller = new UserController();

  connectedCallback() {
    this.render();
    this.loadGoals();

    window.addEventListener("goals:changed", this.handleGoalsChanged);
    window.addEventListener("user:created", this.handleUserCreated);
  }

  disconnectedCallback() {
    window.removeEventListener("goals:changed", this.handleGoalsChanged);
    window.removeEventListener("user:created", this.handleUserCreated);
  }

  handleGoalsChanged = () => {
    this.loadGoals();
  };

  handleUserCreated = () => {
    this.loadGoals();
  };

  render() {
    this.innerHTML = `
      <section style="border:1px solid #ccc; padding:12px; margin:12px 0;" aria-labelledby="create-saving-title">
        <h2 id="create-saving-title">Registrer sparing</h2>

        <div style="display:grid; gap:8px; margin-bottom:10px;">
          <label for="itemName">Varenavn</label>
          <input id="itemName" name="itemName" type="text" placeholder="f.eks. Ost" />

          <label for="originalPrice">Ordinær pris</label>
          <input id="originalPrice" name="originalPrice" type="number" min="0" step="0.01" placeholder="150" />

          <label for="discountPrice">Tilbudspris</label>
          <input id="discountPrice" name="discountPrice" type="number" min="0" step="0.01" placeholder="100" />

          <label for="goalId">Knytt til sparemål (valgfritt)</label>
          <select id="goalId" name="goalId">
            <option value="">Ingen mål valgt</option>
          </select>
        </div>

        <button id="btn" type="button">Lagre sparing</button>
        <div id="status" style="margin-top:10px;" aria-live="polite"></div>
      </section>
    `;

    this.querySelector("#btn").addEventListener("click", () => this.onCreate());
  }

  async loadGoals() {
    const select = this.querySelector("#goalId");
    if (!select) return;

    select.innerHTML = `<option value="">Ingen mål valgt</option>`;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const goals = await this.controller.getGoals({ token });

      for (const goal of goals) {
        const option = document.createElement("option");
        option.value = goal.id;
        option.textContent = `${goal.title} (${goal.targetAmount} kr)`;
        select.appendChild(option);
      }
    } catch (err) {
      const status = this.querySelector("#status");
      if (status) {
        status.textContent = `❌ ${err.message}`;
      }
    }
  }

  async onCreate() {
    const status = this.querySelector("#status");
    status.textContent = "";

    const token = localStorage.getItem("authToken");

    if (!token) {
      status.textContent = "Du må være logget inn";
      return;
    }

    const itemName = this.querySelector("#itemName").value.trim();
    const originalPrice = Number(this.querySelector("#originalPrice").value);
    const discountPrice = Number(this.querySelector("#discountPrice").value);
    const rawGoalId = this.querySelector("#goalId").value;
    const goalId = rawGoalId || null;

    if (!itemName) {
      status.textContent = "Du må skrive inn varenavn";
      return;
    }

    if (!Number.isFinite(originalPrice) || !Number.isFinite(discountPrice)) {
      status.textContent = "Prisene må være gyldige tall";
      return;
    }

    try {
      const result = await this.controller.createSaving({
        token,
        goalId,
        itemName,
        originalPrice,
        discountPrice,
      });

      status.textContent = `Sparing lagret ✅ Du sparte ${result.savedAmount} kr`;
      this.querySelector("#itemName").value = "";
      this.querySelector("#originalPrice").value = "";
      this.querySelector("#discountPrice").value = "";
      this.querySelector("#goalId").value = "";

      window.dispatchEvent(
        new CustomEvent("savings:changed", {
          detail: result,
        })
      );
    } catch (err) {
      status.textContent = `❌ ${err.message}`;
    }
  }
}

customElements.define("saving-create", SavingCreate);