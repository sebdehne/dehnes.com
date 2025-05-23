---
title:  "Levere Skattemelding for selskap gratis"
date:   '2025-05-05'
URL: "/software/2025/05/05/levere-skattemelding-for_selskap-gratis.html"
category: software
---

På Altinn side sider kan man lese følgende:

> Fra og med inntektsåret 2023 må alle selskap sende skattemelding i standard format via et regnskaps- eller årsoppgjørsprogram

Men i lovteksten står det egentlig bare om at skattemeldingen skal leveres
[elektronisk](https://lovdata.no/forskrift/2016-11-23-1360/§8-1-2) - står ikke noe om at det må
leveres fra et regnskapssystem.

Jeg har et bittelite aksjeselskap som ikke har noe særlig drift og bare noen få transaksjoner i året. Og da har man egentlig ikke noe særlig behov for et regnskapssystem, så da er det veldig enkelt å føre regnskap manuelt i Excel for eksempel. Men så var det dette kravet om å levere skattemeldingen da...

Jeg har derfor laget en superenkelt webapp som la en levere skattemeldingen for bedrifter (ikke ENK).

## Webapp for Skattemeldingen

Klienten er tilgjengelig her: [https://dehnes.com/skattemelding/](https://dehnes.com/skattemelding/)

Hvis du ønsker å bruke den for din bedrift også, så er det følgende regler som gjelder:

- Du aksepterer at all bruk av webappen er på egent ansvar. Den hjelper deg ikke å fylle ut skattemeldingen og du kan heller ikke stille meg, som har laget applikasjonen, til ansvar hvis det skulle oppstår en feil. Det er du alene som har ansvaret for å sende inn alle riktige opplysningene til skattemyndighetene. (Se eksempel nede)
- Etter at skattemeldingen er generert og lastet opp, så blir du sendt til skatteetaten sine sider hvor du kan se over og
  kontrollere at alt ser riktig ut, før du eventuelt bestemme deg for å sende alt inn.  
  Det gir deg 100% kontroll og hvis skattemeldingen, som ble generert av appen, ikke er riktig, så kan du altså 
  la være å sende inn.
- Kun inntektsår 2024 er støttet per nå.
- Jeg har lagt webappen bak google autentisering - den krever derfor at man har et google konto.
- All data som lagres, skrives ikke til disk, men lagres kun midlertidig i minne på serveren, som forsvinner hver gang jeg 
  restarte den.
- Jeg har ikke lagt inn massevis av arbeid og webappen er ikke noe særlig robust – for eksempel utløper autentiserings-token etter 10 minutter – så hvis du ikke har klart å gjøre deg ferdig, må du starte på nytt.

### Eksempel

Gitt ditt selskap hadde i inntektsåret 2024 følgende 3 transaksjoner:
- kontantinnskudd ved stiftelse: 30 000,00
- kjøp av askjer: 20 014,08
- stiftelsekosnad brønnøysundregistrene: 5 784,00

Gitt disse opplysningene, brukte jeg følgende verdiene i webappen for å levere skattemeldingen:
##### Regnskap:
-	driftskostnad: 5 784,00; konto: 7700
##### Balanse:
-	anleggsmiddel: 20 014,08; konto: 1350
-	omløpsmiddel: 4 201,92; konto: 1920
-	egenkaptial: 24 216,00; konto: 2050; egenkapitalendringstype=kontantinnskudd

Og husk riktig kontaktinformasjon og kommunenummer. Lykke til.
