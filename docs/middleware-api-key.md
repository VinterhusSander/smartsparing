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
