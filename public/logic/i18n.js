const messages = {
    no: {
      languageCode: "no",
      createUserTitle: "Opprett bruker",
      usernameLabel: "Brukernavn",
      passwordLabel: "Passord",
      passwordHelp: "Passordet må være minst 6 tegn langt.",
      acceptTermsPrefix: "Godta",
      termsOfService: "Bruksvilkår",
      acceptPrivacyPrefix: "Godta",
      privacyPolicy: "Personvernerklæring",
      createButton: "Opprett",
      fillUsernamePassword: "Fyll inn brukernavn og passord.",
      userCreated: ({ username, id }) => `✅ Bruker opprettet: ${username} (id: ${id})`,
  
      editUserTitle: "Rediger bruker",
      editUserText:
        "Denne komponenten finnes for å følge den påkrevde arkitekturen, men redigering er ikke implementert fordi backend mangler PATCH /api/users/me.",
  
      deleteAccountTitle: "Slett konto",
      deleteAccountText: "Sletter brukeren som er “logget inn” basert på lagret token.",
      deleteButton: "Slett kontoen min",
      noAuthToken: "❌ Fant ikke authToken i localStorage. Opprett en bruker først.",
      accountDeleted: "✅ Konto slettet",
      userManagementLabel: "Brukerhåndtering",
    },
  
    en: {
      languageCode: "en",
      createUserTitle: "Create user",
      usernameLabel: "Username",
      passwordLabel: "Password",
      passwordHelp: "Password must be at least 6 characters long.",
      acceptTermsPrefix: "Accept",
      termsOfService: "Terms of Service",
      acceptPrivacyPrefix: "Accept",
      privacyPolicy: "Privacy Policy",
      createButton: "Create",
      fillUsernamePassword: "Please fill in username and password.",
      userCreated: ({ username, id }) => `✅ User created: ${username} (id: ${id})`,
  
      editUserTitle: "Edit user",
      editUserText:
        "This component exists to match the required architecture, but editing is not implemented because the backend is missing PATCH /api/users/me.",
  
      deleteAccountTitle: "Delete account",
      deleteAccountText: "Deletes the currently “logged in” user based on stored token.",
      deleteButton: "Delete my account",
      noAuthToken: "❌ No authToken found in localStorage. Create a user first.",
      accountDeleted: "✅ Account deleted",
      userManagementLabel: "User management",
    },
  };
  
  function normalizeLanguage(language) {
    const short = (language || "").toLowerCase().split("-")[0];
    return short === "no" || short === "nb" || short === "nn" ? "no" : "en";
  }
  
  export function getLanguage() {
    return normalizeLanguage(navigator.language);
  }
  
  export function t(key, params) {
    const lang = getLanguage();
    const value = messages[lang][key];
  
    if (typeof value === "function") {
      return value(params ?? {});
    }
  
    return value ?? key;
  }