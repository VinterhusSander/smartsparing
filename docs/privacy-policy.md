# Personvernerklæring – SmartSparing

## Hvilke data vi samler inn

SmartSparing samler inn følgende data:

- Brukernavn
- Kryptert passord (passord-hash)
- Sparemål som brukeren oppretter
- Registrerte sparinger (varenavn, priser og spart beløp)
- Samtykkeinformasjon (tidspunkt og versjon for Terms of Service og Privacy Policy)

Applikasjonen samler ikke inn personopplysninger som navn, e-postadresse eller fysisk adresse.

---

## Hvorfor vi samler inn disse dataene

Dataene er nødvendige for å:

- Identifisere brukere i systemet
- Gi brukeren tilgang til egne data
- La brukeren opprette og følge sparemål
- Registrere og beregne sparing
- Sikre tilgangskontroll og beskyttelse av data
- Dokumentere brukerens samtykke

---

## Dataminimering

SmartSparing samler kun inn data som er nødvendig for å levere tjenesten.

---

## Lagring og sikkerhet

Data lagres i en skybasert PostgreSQL-database.

- Passord lagres aldri i klartekst, men som sikre kryptografiske hasher (bcrypt)
- Tilgang til brukerdata er beskyttet med autentiseringstoken
- API-et benytter også API-nøkkel for beskyttelse av enkelte operasjoner

---

## Brukerens rettigheter

Brukere har rett til å:

- Få innsyn i egne data
- Slette kontoen sin og alle tilknyttede data
- Trekke tilbake samtykke ved å slette kontoen

---

## Samtykke

Ved opprettelse av konto gir brukeren aktivt samtykke til:

- Terms of Service
- Privacy Policy

Samtykket lagres med tidspunkt og versjon.

Samtykke kan når som helst trekkes tilbake ved å slette kontoen.
