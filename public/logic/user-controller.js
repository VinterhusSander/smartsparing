import { apiRequest } from "../data/api.js";

export class UserController {
  async createUser({ username, password, consent }) {
    // Ikke endre struktur – send samme felter som API forventer
    return apiRequest("/api/users", {
      method: "POST",
      body: { username, password, consent },
    });
  }

  async deleteMe({ token }) {
    return apiRequest("/api/users/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
