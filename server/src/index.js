import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Test-endepunkt for å sjekke at serveren kjører
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SmartSparing API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
