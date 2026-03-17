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
  addGoalForUser,
  deleteUserById,
  deleteGoalsForUser,
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

  deleteGoalsForUser(userId);
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
app.get("/api/goals", requireAuth, (req, res) => {
  const goals = getGoalsForUser(req.user.id);
  res.json(goals);
});

app.post("/api/goals", requireAuth, requireApiKey, (req, res) => {
  const { title, targetAmount } = req.body;

  const goal = {
    id: `g_${Date.now()}`,
    title: title ?? "Uten tittel",
    targetAmount: Number.isFinite(targetAmount)
      ? targetAmount
      : Number(targetAmount) || 0,
    createdAt: new Date().toISOString(),
  };

  addGoalForUser(req.user.id, goal);

  res.status(201).json(goal);
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