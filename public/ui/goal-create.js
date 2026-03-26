import { UserController } from "../logic/user-controller.js";

const controller = new UserController();

class GoalCreate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 300px;
        }
      </style>

      <h2>Opprett sparemål</h2>

      <form id="form">
        <input type="text" id="title" placeholder="Mål (f.eks. Playstation)" required />
        <input type="number" id="amount" placeholder="Målbeløp (kr)" required />
        <button type="submit">Opprett mål</button>
        <p id="status" aria-live="polite"></p>
      </form>
    `;

    this.shadowRoot.querySelector("#form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const title = this.shadowRoot.querySelector("#title").value;
    const amount = this.shadowRoot.querySelector("#amount").value;
    const status = this.shadowRoot.querySelector("#status");

    const token = localStorage.getItem("authToken");

    if (!token) {
      status.textContent = "Du må være logget inn";
      return;
    }

    try {
        const result = await controller.createGoal({
            token,
            title,
            targetAmount: Number(amount),
          });

      status.textContent = "Mål opprettet ✅";
      this.shadowRoot.querySelector("#form").reset();

      window.dispatchEvent(
        new CustomEvent("goals:changed", {
          detail: result,
        })
      );
    } catch (err) {
      status.textContent = err.message;
    }
  }
}

customElements.define("goal-create", GoalCreate);