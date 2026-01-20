# Feature Map – SmartSparing

## MVP-funksjoner

### Brukerkontoer

- Registrer bruker (email + passord)
- Logg inn
- Logg ut
- Brukere kan bare se og endre egne data

### Sparemål

- Opprett sparemål (tittel og målbeløp)
- Se liste over egne sparemål
- Se detaljer for ett sparemål (fremgang)
- Endre sparemål
- Slette sparemål

### Sparingsregistreringer

- Opprett sparing knyttet til et sparemål  
  Felter: varenavn, ordinær pris, tilbudspris, dato  
  Backend beregner spart beløp
- Se sparinger for et sparemål
- Endre sparing
- Slette sparing

### Deling (Share)

- Generer delingslenke for et sparemål
- Delingslenken viser (read-only):
  - mål-tittel
  - målbeløp
  - total spart sum
  - hvor mye som gjenstår

---

## Tekniske krav

### Client

- Enkel webklient (HTML + JavaScript)

### Server

- Node.js-server med REST-lignende API

### Database

- Sky-basert PostgreSQL
- Tabeller: users, goals, savings, goal_shares

### API

- REST-lignende endepunkter for auth, mål, sparing og deling

### PWA

- Web app som kan installeres
- App shell caches

### Offline-funksjonalitet

- Appen kan åpnes offline og laste cached filer
