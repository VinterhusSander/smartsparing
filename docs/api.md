# SmartSparing API (RESTful-ish)

Base URL: `/api`

Denne dokumentasjonen beskriver den første ressursen i SmartSparing: **Savings Goals (sparemål)**.

## Ressurs: Savings Goal

Et sparemål representerer noe brukeren sparer til.

### Felter (data shape)

- `id` (string) – unik id (genereres av server)
- `title` (string) – navn på sparemålet
- `targetAmount` (number) – hvor mye man vil spare (f.eks. 10000)
- `createdAt` (string, ISO dato) – når sparemålet ble opprettet

> NB: API-et scaffoldes nå. Lagring/DB kan komme senere.

## API-nøkkel (tilgangskontroll)

Noen endepunkter i SmartSparing API-et er beskyttet med en API-nøkkel.
For å få tilgang må klienten sende følgende HTTP-header:

```
x-api-key: supersecretkey
```

Dersom headeren mangler eller API-nøkkelen er feil, returnerer API-et:

- Statuskode: `401 Unauthorized`
- JSON-respons med feilmelding

---

## Endpoints

### 1) GET /api/goals

Henter alle sparemål.

**Response 200 (eksempel):**

```json
[
  {
    "id": "g1",
    "title": "Ny PC",
    "targetAmount": 12000,
    "createdAt": "2026-01-24T10:00:00.000Z"
  },
  {
    "id": "g2",
    "title": "Ferie",
    "targetAmount": 8000,
    "createdAt": "2026-01-24T10:05:00.000Z"
  }
]
```
