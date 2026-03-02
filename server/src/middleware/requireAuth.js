import { getUserByToken } from "../data/store.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Forventet format: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    const user = await getUserByToken(token);

    if (!user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Authentication failed",
    });
  }
}