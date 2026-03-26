import { apiRequest } from "../data/api.js";

const API_KEY = "supersecretkey";

export class UserController {
  async createUser({ username, password, consent }) {
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

  async getGoals({ token }) {
    return apiRequest("/api/goals", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getGoalsWithProgress({ token }) {
    return apiRequest("/api/goals/progress", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createGoal({ token, title, targetAmount }) {
    return apiRequest("/api/goals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": API_KEY,
      },
      body: { title, targetAmount },
    });
  }

  async getSavings({ token }) {
    return apiRequest("/api/savings", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getSavingsSummary({ token }) {
    return apiRequest("/api/savings/summary", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createSaving({ token, goalId = null, itemName, originalPrice, discountPrice }) {
    return apiRequest("/api/savings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": API_KEY,
      },
      body: {
        goalId,
        itemName,
        originalPrice,
        discountPrice,
      },
    });
  }
}