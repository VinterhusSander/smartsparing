export function requireApiKey(req, res, next) {
    const apiKey = req.headers["x-api-key"];
  
    if (!apiKey) {
      return res.status(401).json({
        error: "API-nøkkel mangler"
      });
    }
  
    if (apiKey !== "supersecretkey") {
      return res.status(401).json({
        error: "Ugyldig API-nøkkel"
      });
    }
  
    next();
  }
  