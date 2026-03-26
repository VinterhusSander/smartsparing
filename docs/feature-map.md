# Feature Map – SmartSparing

## 🎯 Kjernefunksjonalitet (implementert)

### Brukerkontoer

- Registrer bruker (username + passord)
- Bruker må godta Terms of Service og Privacy Policy
- Bruker får autentiseringstoken
- Slette egen bruker (inkludert data)

---

### Sparemål (Goals)

- Opprett sparemål (tittel + målbeløp)
- Se liste over egne sparemål
- Se progresjon per mål:
  - spart så langt
  - gjenstående beløp
  - prosent fullført

---

### Sparing (Savings)

- Registrer sparing:
  - varenavn
  - ordinær pris
  - tilbudspris
- Backend beregner spart beløp
- Sparing kan knyttes til et mål (valgfritt)
- Se liste over alle sparinger

---

### Oversikt

- Se total spart:
  - totalt spart
  - spart til mål
  - spart uten mål
- Se antall registrerte sparinger

---

## 🧱 Tekniske krav (implementert)

### Client

- Webklient med HTML + JavaScript
- Bygget med Web Components
- Strukturert i:
  - UI
  - Logic
  - Data

---

### Server

- Node.js + Express
- REST-lignende API
- Middleware for:
  - autentisering
  - API-nøkkel

---

### Database

- PostgreSQL (Render)
- Tabeller:
  - users
  - tokens
  - goals
  - savings

---

### API

- REST-lignende endepunkter for:
  - users
  - goals
  - savings
- Progresjon beregnes i backend

---

### PWA

- Manifest
- Service Worker
- Caching av app shell

---

### Offline-funksjonalitet

- Appen kan åpnes offline
- Cached filer lastes fra service worker

---

## 🚀 Videre utvikling (ikke implementert)

Mulige utvidelser:

- Redigere bruker (PATCH /api/users/me)
- Redigere sparemål
- Slette sparemål
- Redigere sparing
- Slette sparing
- Deling av sparemål (read-only link)
- Progress bar i UI
- Dark mode
