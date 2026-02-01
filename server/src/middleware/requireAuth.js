import { getUserByToken } from "../data/store.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // Forventet format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const user = getUserByToken(token);

  if (!user) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid token",
    });
  }

  req.user = user;
  next();
}
