# SmartSparing API (RESTful-ish)

Base URL: `/api`

Denne dokumentasjonen beskriver de sentrale ressursene i SmartSparing:

- brukere
- sparemål
- sparing

API-et bruker JSON for requests og responses.

---

## 🔐 Autentisering

Noen endepunkter krever at brukeren er autentisert med token.

Klienten må sende:

Authorization: Bearer <token>

Token returneres ved opprettelse av bruker.

---

## 🔑 API-nøkkel

Noen write-endepunkter krever også API-nøkkel:

x-api-key: supersecretkey

Hvis nøkkelen mangler eller er feil:

- 401 Unauthorized

---

# 👤 Ressurs: User

## Felter

- id (UUID)
- username (string)
- createdAt (ISO string)
- token (string)
- consent (object)

---

## POST /api/users

Oppretter en bruker.

### Request

{
"username": "ola",
"password": "hemmelig123",
"consent": {
"acceptedTos": true,
"acceptedPrivacy": true
}
}

### Response 201

{
"id": "uuid",
"username": "ola",
"token": "token",
"createdAt": "2026-03-25T...",
"consent": {
"tosVersion": "1.0",
"privacyVersion": "1.0",
"acceptedTosAt": "2026-03-25T...",
"acceptedPrivacyAt": "2026-03-25T..."
}
}

---

## DELETE /api/users/me

Sletter innlogget bruker.

### Krever

- Authorization header

### Response

{
"status": "ok",
"message": "Account deleted"
}

---

# 🎯 Ressurs: Goal

## Felter

- id
- title
- targetAmount
- createdAt

---

## GET /api/goals

Henter alle mål.

### Krever

- Authorization

### Response

[
{
"id": "uuid",
"title": "Ny mobil",
"targetAmount": 5000,
"createdAt": "2026-03-25T..."
}
]

---

## GET /api/goals/progress

Henter mål med progresjon.

### Response

[
{
"id": "uuid",
"title": "Ny mobil",
"targetAmount": 5000,
"savedSoFar": 50,
"remainingAmount": 4950,
"progressPercent": 1,
"createdAt": "2026-03-25T..."
}
]

---

## POST /api/goals

Oppretter mål.

### Krever

- Authorization
- API key

### Request

{
"title": "Playstation",
"targetAmount": 5000
}

---

# 💸 Ressurs: Saving

## Felter

- id
- goalId (kan være null)
- itemName
- originalPrice
- discountPrice
- savedAmount
- createdAt

---

## POST /api/savings

Registrerer sparing.

### Krever

- Authorization
- API key

### Request

{
"goalId": "uuid",
"itemName": "Ost",
"originalPrice": 150,
"discountPrice": 100
}

---

## GET /api/savings

Henter alle sparinger.

### Response

[
{
"id": "uuid",
"goalId": "uuid",
"itemName": "Ost",
"originalPrice": 150,
"discountPrice": 100,
"savedAmount": 50,
"createdAt": "2026-03-25T..."
}
]

---

## GET /api/savings/summary

Henter total oversikt.

### Response

{
"savingsCount": 2,
"totalSaved": 100,
"totalSavedForGoals": 50,
"totalSavedWithoutGoal": 50
}

---

# ✅ Validering

API-et validerer:

- brukernavn må være oppgitt
- passord må være minst 6 tegn
- samtykke til ToS og Privacy
- itemName må være oppgitt
- priser må være gyldige tall
- priser kan ikke være negative
- tilbudspris kan ikke være høyere enn ordinær pris
- goalId må tilhøre bruker

---

# 📦 Status

API-et er fullt implementert og koblet til PostgreSQL for persistent lagring.
