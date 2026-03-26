# API Key Middleware – Simple Access Control

## Problem / Need

SmartSparing er et backend-basert API som håndterer økonomiske data som
sparemål. Uten noen form for tilgangskontroll kan hvem som helst sende
requests til API-et og manipulere data.

Å implementere full autentisering med brukerkontoer, passord og tokens
er unødvendig komplekst på dette stadiet av prosjektet, og er derfor ikke
i tråd med prosjektets mål om å holde løsningen enkel og fokusert.

## Solution

Løsningen er en enkel API-key middleware som kontrollerer tilgang til
utvalgte endepunkter i API-et. Klienten må sende med en forhåndsdefinert
API-nøkkel i HTTP-headeren `x-api-key`.

Dersom nøkkelen mangler eller er feil, returnerer serveren en
`401 Unauthorized`-respons. Dersom nøkkelen er korrekt, får requesten
fortsette videre til neste steg i request-kjeden.

## Why Middleware

Løsningen er laget som middleware fordi den samme tilgangskontrollen brukes på flere endepunkter.

Middleware gjør det mulig å:

- gjenbruke samme tilgangslogikk på tvers av API-endepunkter
- unngå kode-duplisering
- skille sikkerhetslogikk fra forretningslogikk

Dette gir en ryddigere og mer vedlikeholdbar backend-arkitektur.

# SmartSparing

## 🌐 Live Deployment (Render)

**Web Service:**  
https://smartsparing.onrender.com

**Health check:**  
https://smartsparing.onrender.com/health

---

## 📖 Om prosjektet

SmartSparing er en full-stack webapplikasjon der brukere kan registrere hvor mye penger de sparer når de kjøper varer på tilbud.

Brukeren legger inn:

- varenavn
- ordinær pris
- tilbudspris

Appen beregner automatisk hvor mye som er spart.

Brukeren kan:

- opprette sparemål
- knytte sparing til mål
- se fremgang mot mål

Applikasjonen har brukerkontoer, og all data lagres i en skybasert PostgreSQL-database via et REST-lignende API.

---

## 🧱 Teknologier

**Frontend:**

- HTML, CSS, JavaScript (ES Modules)
- Web Components (Custom Elements)

**Backend:**

- Node.js
- Express

**Database:**

- PostgreSQL (hostet på Render)

**Hosting:**

- Render (Web Service + Database)

---

## 🧠 Arkitektur

Prosjektet følger en enkel og strukturert arkitektur:

- **UI (public/ui)**  
  Web Components for brukergrensesnitt

- **Logic (public/logic)**  
  Forretningslogikk og kontrollere

- **Data (public/data)**  
  API-kommunikasjon (én sentral fetch-funksjon)

Dette følger kravene:

- kun én fetch-funksjon
- ingen duplisering av datastrukturer
- tydelig separasjon mellom lag

---

## 🌍 Internasjonalisering (I18n / L10n)

Applikasjonen støtter flere språk:

- Norsk 🇳🇴
- Engelsk 🇬🇧

### Klient

- Språk velges automatisk basert på `navigator.language`
- UI-tekst hentes fra én sentral `i18n.js`

### Server

- Språk leses fra `Accept-Language` header
- API-feilmeldinger returneres på riktig språk

---

## 📱 PWA (Progressive Web App)

Applikasjonen er gjort installérbar som en PWA.

### Implementert:

- `manifest.json`
- service worker (`sw.js`)
- caching av viktige filer
- offline-støtte

### Resultat:

- Appen kan installeres
- Appen fungerer delvis uten internett
- Raskere lasting via cache

---

## ♿ Accessibility

Applikasjonen er testet med Lighthouse og oppnår:

- **Accessibility: 100**

Tiltak som er gjort:

- semantisk HTML
- labels på inputs
- aria-attributter (`aria-live`, `aria-labelledby`)
- tydelig struktur

---

## 🔐 Sikkerhet og brukerhåndtering

- Passord hashes med bcrypt
- Token-basert autentisering
- Samtykke til:
  - Terms of Service
  - Privacy Policy

---

## 🧪 Testing

API-et er testet med Bruno:

- Create user
- Delete account
- Get goals
- Create goals
- Health check

---

## 📂 Prosjektstruktur

---

## 📄 Dokumentasjon

- Feature map: [docs/feature-map.md](docs/feature-map.md)

---

## 🚀 Status

Prosjektet oppfyller kravene for:

- PostgreSQL database
- Render deployment
- REST API
- I18n (client + server)
- PWA (manifest + service worker)
- Offline mode
- Accessibility ≥ 90
