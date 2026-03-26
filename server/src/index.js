import "dotenv/config";
import { initDb } from "./data/db.js";
import express from "express";
import cors from "cors";
import { requireApiKey } from "./middleware/requireApiKey.js";
import { requireAuth } from "./middleware/requireAuth.js";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import { t } from "./i18n.js";
import {
  createUser,
  findUserByUsername,
  createTokenForUser,
  getGoalsForUser,
  getGoalsWithProgressForUser,
  addGoalForUser,
  getGoalByIdForUser,
  addSavingForUser,
  getSavingsForUser,
  getSavingsSummaryForUser,
  deleteUserById,
} from "./data/store.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SmartSparing API is running" });
});

// CREATE USER
app.post("/api/users", async (req, res) => {
  try {
    const { username, password, consent } = req.body;

    // 1) Valider input
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: t(req, "missingFields"),
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: t(req, "missingFields"),
      });
    }

    // 2) Samtykke
    if (!consent?.acceptedTos) {
      return res.status(400).json({
        error: "CONSENT_REQUIRED",
        message: t(req, "tosRequired"),
      });
    }

    if (!consent?.acceptedPrivacy) {
      return res.status(400).json({
        error: "CONSENT_REQUIRED",
        message: t(req, "privacyRequired"),
      });
    }

    // 3) Unikt username
    const existing = await findUserByUsername(username);
    if (existing) {
      return res.status(409).json({
        error: "USERNAME_TAKEN",
        message: t(req, "usernameTaken"),
      });
    }

    // 4) Hash passord
    const passwordHash = await bcrypt.hash(password, 10);

    // 5) Lag bruker
    const now = new Date().toISOString();
    const user = await createUser({
      username,
      passwordHash,
      consent: {
        tosVersion: "1.0",
        privacyVersion: "1.0",
        acceptedTosAt: now,
        acceptedPrivacyAt: now,
      },
    });

    // 6) Token
    const token = await createTokenForUser(user.id);

    // 7) Respons
    return res.status(201).json({
      id: user.id,
      username: user.username,
      token,
      createdAt: user.createdAt,
      consent: user.consent,
    });
  } catch (err) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: t(req, "serverError"),
    });
  }
});

// DELETE USER
app.delete("/api/users/me", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const deleted = await deleteUserById(userId);

  if (!deleted) {
    return res.status(404).json({
      error: "NOT_FOUND",
      message: t(req, "serverError"),
    });
  }

  return res.status(200).json({
    status: "ok",
    message: t(req, "accountDeleted") ?? "Account deleted",
  });
});

// GOALS
app.get("/api/goals", requireAuth, async (req, res) => {
  try {
    const goals = await getGoalsForUser(req.user.id);
    res.json(goals);
  } catch (err) {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: t(req, "serverError"),
    });
  }
});

app.get("/api/goals/progress", requireAuth, async (req, res) => {
  try {
    const goals = await getGoalsWithProgressForUser(req.user.id);
    return res.json(goals);
  } catch (err) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: t(req, "serverError"),
    });
  }
});

app.post("/api/goals", requireAuth, requireApiKey, async (req, res) => {
  try {
    const { title, targetAmount } = req.body;

    const normalizedTitle =
      typeof title === "string" && title.trim() ? title.trim() : "Uten tittel";

    const normalizedTargetAmount = Number(targetAmount);

    if (!Number.isFinite(normalizedTargetAmount) || normalizedTargetAmount < 0) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: t(req, "missingFields"),
      });
    }

    const goal = await addGoalForUser(req.user.id, {
      title: normalizedTitle,
      targetAmount: normalizedTargetAmount,
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: t(req, "serverError"),
    });
  }
});

app.post("/api/savings", requireAuth, requireApiKey, async (req, res) => {
  try {
    const { goalId = null, itemName, originalPrice, discountPrice } = req.body;

    const normalizedItemName =
      typeof itemName === "string" ? itemName.trim() : "";

    if (!normalizedItemName) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: t(req, "itemNameRequired"),      });
    }

    const normalizedOriginalPrice = Number(originalPrice);
    const normalizedDiscountPrice = Number(discountPrice);

    if (
      !Number.isFinite(normalizedOriginalPrice) ||
      !Number.isFinite(normalizedDiscountPrice)
    ) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: t(req, "invalidPrices"),
      });
    }

    if (normalizedOriginalPrice < 0 || normalizedDiscountPrice < 0) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: t(req, "negativePrices"),
      });
    }

    if (normalizedDiscountPrice > normalizedOriginalPrice) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: t(req, "invalidDiscount"),
      });
    }

    let normalizedGoalId = null;

    if (goalId !== null && goalId !== undefined && goalId !== "") {
      if (typeof goalId !== "string") {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "goalId must be a string",
        });
      }

      const goal = await getGoalByIdForUser(req.user.id, goalId);

      if (!goal) {
        return res.status(404).json({
          error: "GOAL_NOT_FOUND",
          message: t(req, "goalNotFound"),
        });
      }

      normalizedGoalId = goalId;
    }

    const savedAmount = normalizedOriginalPrice - normalizedDiscountPrice;

    const saving = await addSavingForUser(req.user.id, {
      goalId: normalizedGoalId,
      itemName: normalizedItemName,
      originalPrice: normalizedOriginalPrice,
      discountPrice: normalizedDiscountPrice,
      savedAmount,
    });

    return res.status(201).json(saving);
  } catch (err) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: t(req, "serverError"),
    });
  }
});

app.get("/api/savings", requireAuth, async (req, res) => {
  try {
    const savings = await getSavingsForUser(req.user.id);
    return res.json(savings);
  } catch (err) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: t(req, "serverError"),
    });
  }
});

app.get("/api/savings/summary", requireAuth, async (req, res) => {
  try {
    const summary = await getSavingsSummaryForUser(req.user.id);
    return res.json(summary);
  } catch (err) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: t(req, "serverError"),
    });
  }
});

// START SERVER
async function main() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});