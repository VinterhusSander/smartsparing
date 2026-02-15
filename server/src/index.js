import express from "express";
import cors from "cors";
import { requireApiKey } from "./middleware/requireApiKey.js";
import { requireAuth } from "./middleware/requireAuth.js";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
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
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));


// Test-endepunkt for å sjekke at serveren kjører
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SmartSparing API is running" });
});

app.post("/api/users", async (req, res) => {
  try {
    const { username, password, consent } = req.body;

    // 1) Valider input (enkelt og tydelig)
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "username is required",
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "password must be at least 6 characters",
      });
    }

    // 2) Aktivt samtykke (krav i oppgaven)
    // Forventet format:
    // consent: { acceptedTos: true, acceptedPrivacy: true }
    if (!consent?.acceptedTos || !consent?.acceptedPrivacy) {
      return res.status(400).json({
        error: "CONSENT_REQUIRED",
        message: "You must accept Terms of Service and Privacy Policy",
      });
    }

    // 3) Unikt username
    const existing = findUserByUsername(username);
    if (existing) {
      return res.status(409).json({
        error: "USERNAME_TAKEN",
        message: "Username is already in use",
      });
    }

    // 4) Hash passord (aldri lagre plaintext)
    const passwordHash = await bcrypt.hash(password, 10);

    // 5) Lagre bruker i in-memory store
    const now = new Date().toISOString();
    const user = createUser({
      username,
      passwordHash,
      consent: {
        tosVersion: "1.0",
        privacyVersion: "1.0",
        acceptedTosAt: now,
        acceptedPrivacyAt: now,
      },
    });

    // 6) Lag token for denne brukeren
    const token = createTokenForUser(user.id);

    // 7) Returner trygg respons (ikke passwordHash)
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
      message: "Something went wrong",
    });
  }
});

app.delete("/api/users/me", requireAuth, (req, res) => {
  const userId = req.user.id;

  // 1) Slett brukerens personlige data (goals)
  deleteGoalsForUser(userId);

  // 2) Slett selve brukeren + tokens
  const deleted = deleteUserById(userId);

  if (!deleted) {
    return res.status(404).json({
      error: "NOT_FOUND",
      message: "User not found",
    });
  }

  return res.status(200).json({
    status: "ok",
    message: "Account deleted and consent retracted",
  });
});



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
      : (Number(targetAmount) || 0),
    createdAt: new Date().toISOString(),
  };

  addGoalForUser(req.user.id, goal);

  res.status(201).json(goal);
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
