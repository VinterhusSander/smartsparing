# 💰 SmartSparing

SmartSparing er en full-stack webapplikasjon hvor brukere kan registrere penger spart fra tilbud, knytte sparing til sparemål, og følge progresjon mot disse målene.

Applikasjonen er utviklet med fokus på god arkitektur, separasjon av ansvar og moderne webteknologier.

---

## 🌐 Live Deployment (Render)

**Web Service:**  
https://smartsparing.onrender.com

**Health check:**  
https://smartsparing.onrender.com/health

---

## 📌 Funksjonalitet

Brukeren kan:

- Opprette brukerkonto (med samtykke til ToS og Privacy Policy)
- Slette egen konto (inkludert tilhørende data)
- Opprette sparemål (f.eks. “Playstation”)
- Registrere sparing fra tilbud:
  - varenavn
  - ordinær pris
  - tilbudspris
- Knytte sparing til et spesifikt mål (valgfritt)
- Se progresjon per mål:
  - spart så langt
  - gjenstående beløp
  - prosent fullført
- Se total oversikt:
  - total spart
  - spart til mål
  - spart uten mål
- Se liste over alle registrerte sparinger

---

## 🧱 Teknologi og arkitektur

### Backend

- Node.js + Express
- PostgreSQL (Render)
- REST-lignende API
- Middleware:
  - `requireAuth` (autentisering)
  - `requireApiKey` (beskyttelse av write-endpoints)

### Frontend

- Vanilla JavaScript
- Web Components (Custom Elements)
- Modulbasert struktur

### PWA

- Service Worker
- Offline støtte (caching)
- Manifest (installbar app)

### Internasjonalisering

- I18n (server + klient)
- Språk basert på browser settings

---

## 🧠 Arkitekturvalg

Applikasjonen er strukturert med tydelig separasjon av ansvar:

### 📁 UI (`public/ui/`)

- Web Components (f.eks. `goal-create`, `saving-list`)
- Ansvar: presentasjon og brukerinteraksjon

### 📁 Logic (`public/logic/`)

- Controller (`user-controller.js`)
- Ansvar: håndtere dataflyt mellom UI og API

### 📁 Data (`public/data/`)

- `api.js` (én sentral fetch-funksjon)
- Ansvar: all kommunikasjon med backend

---

## 🔁 Dataflyt

1. UI-komponent trigger handling (f.eks. opprette sparing)
2. Controller håndterer logikk
3. `api.js` gjør fetch-kall (én felles inngang)
4. Backend validerer og lagrer i PostgreSQL
5. UI oppdateres via events (`CustomEvent`)

---

## 📡 API (utdrag)

- `POST /api/users` – opprette bruker
- `DELETE /api/users/me` – slette bruker
- `GET /api/goals` – hente mål
- `GET /api/goals/progress` – mål med progresjon
- `POST /api/goals` – opprette mål
- `POST /api/savings` – registrere sparing
- `GET /api/savings` – hente sparinger
- `GET /api/savings/summary` – total oversikt

Full dokumentasjon finnes i:

- `docs/api.md`

---

## 🗄️ Database

PostgreSQL brukes for persistent lagring:

- `users`
- `tokens`
- `goals`
- `savings`

Data lagres i skyen via Render.

---

## 🔐 Sikkerhet og personvern

- Passord hashes med bcrypt
- Token-basert autentisering
- Samtykke til:
  - Terms of Service
  - Privacy Policy
- Bruker kan slette egen konto (GDPR-prinsipp)

---

## 📄 Dokumentasjon

- Feature map: `docs/feature-map.md`
- API: `docs/api.md`
- Middleware: `docs/middleware-api-key.md`
- Privacy Policy: `docs/privacy-policy.md`
- Terms of Service: `docs/terms-of-service.md`

---

## ⚙️ Kjøre prosjektet lokalt

### 1. Installer avhengigheter

```bash
npm install
```
