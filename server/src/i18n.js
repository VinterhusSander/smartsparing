const messages = {
    no: {
      missingFields: "Brukernavn og passord er påkrevd.",
      usernameTaken: "Brukernavnet er allerede i bruk.",
      tosRequired: "Du må godta bruksvilkår.",
      privacyRequired: "Du må godta personvernerklæringen.",
      unauthorized: "Ikke autorisert.",
      serverError: "Noe gikk galt.",
    },
  
    en: {
      missingFields: "Username and password are required.",
      usernameTaken: "Username is already taken.",
      tosRequired: "You must accept Terms of Service.",
      privacyRequired: "You must accept Privacy Policy.",
      unauthorized: "Unauthorized.",
      serverError: "Something went wrong.",
    },
  };
  
  function normalizeLanguage(header) {
    if (!header) return "en";
  
    const lang = header.toLowerCase();
  
    if (lang.startsWith("no") || lang.startsWith("nb") || lang.startsWith("nn")) {
      return "no";
    }
  
    return "en";
  }
  
  export function getLang(req) {
    return normalizeLanguage(req.headers["accept-language"]);
  }
  
  export function t(req, key) {
    const lang = getLang(req);
    return messages[lang][key] || key;
  }