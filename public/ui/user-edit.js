class UserEdit extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div style="border:1px solid #ccc; padding:12px; margin:12px 0;">
          <h2>Edit user</h2>
          <p>
            This component exists to match the required architecture, but editing is not implemented
            because the backend is missing <code>PATCH /api/users/me</code>.
          </p>
        </div>
      `;
    }
  }
  
  customElements.define("user-edit", UserEdit);
  