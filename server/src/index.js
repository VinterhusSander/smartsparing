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

app.get("/api/goals", (req, res) => {
  res.json([
    {
      id: "g1",
      title: "Ny PC",
      targetAmount: 12000,
      createdAt: new Date().toISOString(),
    },
  ]);
});

app.post("/api/goals", (req, res) => {
  const { title, targetAmount } = req.body;

  res.status(201).json({
    id: "g2",
    title: title ?? "Uten tittel",
    targetAmount: targetAmount ?? 0,
    createdAt: new Date().toISOString(),
    note: "This is a stubbed response (not persisted)",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
