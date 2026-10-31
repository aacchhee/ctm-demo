# Design: KI-tilbakemelding på håndskrevne løsninger

Status: **fase 1 implementert** på grenen `claude/inspiring-einstein-al3f3t`.

## Avgrenset korrigeringssamtale (31. oktober 2026)

Den norske og engelske fysikksiden prøver nå `corrections="true"` på
bildefeltene. Etter direkte API-tilbakemelding kan studenten velge «KI-en
misforsto besvarelsen min», vise til en linje eller detalj og få ett svar.
Presiseringen sendes separat fra besvarelsen, sammen med originalbildet og
forrige tilbakemelding. Modellen skal kontrollere påstanden mot bildet, beholde
reelle feil og uttrykke usikkerhet når bildet er uklart. Ny utregning eller et
endret svar skal henvises til en ny opplasting. Ingen bildevelger eller full
transkripsjon kreves.

En vellykket korrigering erstatter tilbakemeldingen og starter på hint 1.
Senere hint beholder presiseringen, men åpner ikke en ny samtale. Feil og
avbrudd beholder tidligere tilbakemelding og hintnivå, og studenten kan prøve
igjen. En ny opplasting nullstiller hint og presiseringer, men beholder
svarteksten. Svarteksten låses bare når en korrigering faktisk tilbys etter
tilbakemelding på et opplastet bilde; tekst uten bilde låses ikke. Endres
policy, tilbakemeldingsspråk, API-modus, leverandør, modell eller nøkkel, ber
skjemaet om ny tilbakemelding i stedet for å sende. Presiseringer og bilder
lagres ikke i nettleserlagringen. Kopieringsmodus har ingen korrigeringssamtale.

Støtten ligger i ctm-libs `972cae3` (ctm-libs#64) og er av som standard. Siden
bruker den ordinære, pinnede ctm-assessment-pakken (`8a779d4`,
ctm-assessment#94):

```sh
python scripts/setup.py
quarto render pages/handwriting-ai.qmd
quarto render pages/handskrift-ki.qmd
node scripts/acceptance/test-handwriting-corrections.mjs _site
```

Dette erstatter ikke den valgfrie OCR-grenen i fase 2b:
originalbildet beholdes som grunnlag. Automatiske tester kan verifisere
grensesnitt, forespørsler og hintnivå; modellens vurdering av presiseringer må
fortsatt prøves med en bildemodell.

## 1. Mål

Studentene løser *Prøveeksamen V2025* i fysikk på papir, fotograferer
utregningen, laster den opp og får lærerik KI-tilbakemelding, omtrent som
Tilbakemelding-knappen i pyodide-interaktiv. Der deloppgaven har et tallsvar,
kan de også skrive sluttsvaret i et automatisk rettet `math-exercise`-felt.

Siden er også en **benchmark**. Vi har 18 ekte bilder fra to studenter, og
kollegaer skal kunne

1. laste inn en ekte besvarelse med ett klikk (**Fyll inn student 1 / 2**);
2. endre promptene i **YAML-filer i repoet**, uten å røre JavaScript eller Lua;
3. sammenligne KI-ens tilbakemelding med lærerens egen vurdering
   (`docs/handskrift-benchmark.md`, ikke på siden).

## 2. Beslutninger

| Spørsmål | Beslutning |
|---|---|
| Bilder i offentlig repo | Studentene har samtykket. Rutenettet med kandidatnummer er hvitet ut, og metadata er fjernet |
| Omfang | Alle oppgavene 1–9 og alle deloppgavene, også 1b. Deloppgaver uten besvarelse har bare opplasting |
| Fyll inn | Testverktøy i JavaScript, ad hoc. Laster bildet **og** studentens sluttsvar i svarfeltet |
| Hvor KI-tilbakemeldingen sitter | Bare i bildefeltet. Svarfeltets egen Tilbakemelding-knapp er av. Én samlet tilbakemelding (fase 2c) kommer senere |
| Tilbakemeldingsform | Hintstige med fire nivåer, der siste nivå er et fullstendig løsningsforslag. Svært lærerik |
| Språk | Alt på bokmål, pluss en engelsk tvilling (se 5.5) |
| Tilbakemeldingsspråk | Meny per deloppgave: engelsk, norsk bokmål, svensk, spansk, russisk, tysk (se 5.5) |
| Hvordan kollegaer prøver endringer | Prompt-sandkasse i nettleseren (umiddelbart), deretter redigering av YAML-filen på GitHub |
| Batchkjøring | Senere; først skal vi prøve oss fram med YAML |

## 3. OCR eller bildet rett til modellen?

| | A. Bildet rett til en bildemodell (ett kall) | B. OCR først, så tekst til tilbakemelding (to kall) |
|---|---|---|
| Skisser, grafer, figurer (1b er en graf), understreking, overstrykning | beholdes | går tapt |
| Antall kall og ventetid | 1 | 2 (feil i første kall forplanter seg) |
| Ser vi hva modellen «leste»? | bare hvis prompten ber om det | ja |
| Studenten kan rette feillesing | nei | ja, hvis transkripsjonen kan redigeres |
| Støtte i CTM i dag | **full** | ingen, krever ny kode |

**Valgt: A.** Policyen `handskrift-med-transkripsjon` i `veileder.yml` ber
modellen starte med «Slik leste jeg besvarelsen». Det gir mye av nytten med B
(skyldes en dårlig tilbakemelding feillesing eller feil vurdering?) med ett kall
og uten ny kode. **B** er en mulig fase 2b hvis benchmarken viser at
feillesing er hovedproblemet: knappen «Les av bildet» legger transkripsjonen i
svarfeltet, der studenten kan rette den, og Tilbakemelding sender så tekst
(og eventuelt bildet).

## 4. Siden

`pages/handskrift-ki.qmd`, i sidemenyen under «Håndskrift og KI», sammen med
veiledningen `pages/handskrift-ki-prompter.qmd` («Spill med promptene»).

```
Håndskrift og KI – Prøveeksamen V2025
  Lenke til oppgavesettet (PDF) · slik gjør du det · personvern
  ▸ For lærere: test med ekte besvarelser (sammenfoldet)
  ┌ Ekte besvarelser: [Fyll inn student 1] [Fyll inn student 2] [Tøm alt] ┐
  Fane per oppgave 1–9
    Oppgavetekst (+ figur i oppgave 4 og 9)
    a) spørsmål
       ─ math-exercise «a · Sluttsvar»: t = __ s, h = __ m        [Sjekk]
       ─ ai-feedback «Vis utregningen din for a)»
           Svaret ditt [tekstfelt]   Last opp bilder [fil]
           [Fyll inn student 1] [Fyll inn student 2]  (grå uten besvarelse)
           [Tilbakemelding] [⚙]     Hint 1 → 2 → 3 → 4
  ▸ Prompt-sandkasse (for lærere)
```

- Deloppgaver uten tallsvar (1b graf, 6c begrunnelse) har bare bildefeltet.
  8a har felt for A og B pluss bildefelt for begrunnelsen.
- Tallfeltene godtar 2 % avvik (skiller avrunding fra avskrivingsfeil som 465 nm for 455 nm). Desimalpunkt; store tall som `4.2*10^18`.

## 5. Arkitektur

### 5.1 Filer

```
pages/handskrift-ki.qmd               studentsiden
pages/handskrift-ki-prompter.qmd      veiledning for lærere
_includes/handskrift/intro.md         innledning og verktøylinje
_includes/handskrift/oppgave-1..9.md  oppgavetekst, svarfelt, bildefelt
feedback/handskrift/veileder.yml      ★ tone, struktur, lengde, hintstige (policyer)
feedback/handskrift/oppgaver.yml      ★ fasit og typiske feil per deloppgave
assets/handskrift/student1|2/*.png    besvarelsene; filnavn = deloppgave
assets/handskrift/oppgave4.png, oppgave9.png, proveeksamen-v2025.pdf
assets/handskrift/fyll-inn.js         testverktøy: fyll inn-knapper og sandkasse
assets/handskrift/js-yaml.min.js      YAML-leser for sandkassen (js-yaml 4.1.0, MIT)
docs/handskrift-benchmark.md          lærerens vurdering og logg
```

Kollegaer redigerer bare de to ★-filene. I `_quarto.yml` er sidene lagt til,
og `resources` publiserer bildene og YAML-filene, som skriptet henter.

### 5.2 Slik settes forespørselen sammen

| Del | Kilde | Kan endres i YAML? |
|---|---|---|
| Fast CTM-ramme (veileder, data ≠ instrukser, høyst *N* punkter / *M* ord, ingen fullstendig løsning med mindre tillatt, språk) | ctm-libs `buildMessages` | nei, men *N*, *M*, språk og tillatelse settes i YAML |
| Profilkriterier for `mathematics` | ctm-libs | nei |
| **Veiledertekst** | `veileder.yml` → felles grunnprompt (`policy: {default: …}`) | **ja** |
| **Fasit og typiske feil** | `oppgaver.yml` → `exercises: plain-text: v25-1a: base-prompt:` | **ja** |
| Gjeldende hintnivå | `steps` i policyen | **ja** |
| Oppgavetekst og spørsmål | `.ai-context`-blokken og seksjonsteksten | i `.md`-filene |
| Svartekst og bilde | studenten | — |

Dette følger reglene i ctm-libs. `default`-valget gir den *felles*
grunnprompten, mens `base-prompt` under en deloppgave bare erstatter
*integrasjonens* grunnprompt, så **begge** når modellen. Veilederen og fasiten kan
derfor redigeres hver for seg. Fallgruven er at en variant med `extends` og egen
`base-prompt` **erstatter** teksten, så hver variant inneholder hele teksten.

Svarfeltenes egen KI-knapp er slått av (`math-exercise: feedback: false`), fordi
`default`-valget ellers også ville gitt dem «bildet viser …»-instruksen.

Kontrollert i nettleseren mot en lokal etterligning av API-et: forespørselen
inneholder veilederteksten og fasiten som kriterium 3 og 4, gjeldende nivå,
oppgaveteksten, spørsmålet og bildet som `image_url`. Fyll inn-bildet heter
`besvarelse-1a.png`, så studentens nummer ikke røpes for modellen.

### 5.3 Fyll inn (testverktøy)

`fyll-inn.js` henter `assets/handskrift/<student>/<del>.png` (og `-2`, `-3`),
legger filene i aktivitetens `<input type=file>` med `DataTransfer` og sender
`change`. Da leses bildene på samme måte som ved ekte opplasting. Før det sendes
hendelsen `math-exercise:variant-accepted` med aktivitetens
`reset-on-variant`-navn (`v25-1a-fyll`). Den nullstiller hintstigen, teksten og
bildene, slik at hver ny besvarelse starter på nivå 1. Sluttsvarene står i
tabellen `ANSWERS` i skriptet. Skriptet går inn i DOM-en til CTM-komponentene;
brekker det etter en oppdatering, retter vi skriptet.

### 5.4 Prompt-sandkasse

Nederst på siden ligger de to YAML-filene i hvert sitt tekstfelt, med policyvalg,
forhåndsvisning av instruksjonene for en valgt deloppgave, kopieringsknapper og
tilbakestilling. **Bruk i denne nettleseren** leser YAML-en (js-yaml), bytter ut
sidens to policy-lag i `window.__aiFeedbackPolicies` og validerer med
`AIFeedback.resolvePolicy` før noe tas i bruk. Det lagres i `localStorage`, og
en varsellinje vises så lenge sandkassen er aktiv. Bygget validerer på samme
måte: ukjente nøkler og nøkler som ligner hemmeligheter stopper bygget.

### 5.5 Engelsk versjon og språkmeny

- **Språkbryter.** Øverst på alle fire sidene lenker `.language-switch` til
  tvillingsiden: `handskrift-ki` ↔ `handwriting-ai` og `handskrift-ki-prompter` ↔
  `handwriting-ai-prompts`. CTM-grensesnittet (knapper, meldinger) følger
  sidens `lang`, som settes ved bygging, så en bryter i nettleseren ville ikke
  kunne bytte det. Derfor er det to sider.
- **Engelsk tvilling.** Egen oppgavetekst (`_includes/handwriting/`) og egne
  engelske prompter (`feedback/handwriting/tutor.yml`, `tasks.yml`). Id-ene er
  de samme, så bildene, fyll inn og svarsjekken deles. Bare håndskriften i
  besvarelsene er norsk. Benchmark-arket finnes på engelsk
  (`docs/handwriting-benchmark.md`), og loggen er felles.
- **Språkmeny per deloppgave.** `fyll-inn.js` legger et ekstra lag med
  `exercises: plain-text: <id>: {language: …}` oppå sidens policy-filer (eller
  sandkassen) i `window.__aiFeedbackPolicies`. Da endres bare `language` for den
  deloppgaven, og ctm-libs skriver «Write explanations in <språk>». Valget
  lagres i `localStorage`, og hintstigen nullstilles fordi policyen endres.
  Veilederteksten ber om at også overskriftene skrives på tilbakemeldingsspråket.
  Kontrollert mot en lokal etterligning av API-et: svensk og russisk når fram,
  og standardspråket gjelder for de andre deloppgavene.

### 5.6 Leverandør

ctm-demo har `ai-feedback: mode: api`. Hver bruker legger inn adresse, nøkkel og
modell under ⚙. Modellen må kunne lese bilder, og leverandøren må tillate
nettleserkall (CORS). Modusen for å kopiere instruksjonen virker uten nøkkel.

## 6. Faser

| Fase | Innhold | Endring i CTM |
|---|---|---|
| 1 ✔ | Side for oppgave 1–9 (nb og en, med språkmeny), veiledning, to YAML-filer, hintstige med fire nivåer, fyll inn, prompt-sandkasse, benchmark-ark, rensede bilder | ingen |
| 2b | Valgfri OCR-gren («Les av bildet» → redigerbar transkripsjon) | sideskript eller ctm-libs |
| **2c** | `image-upload` på `math-exercise`, slik at **én** Tilbakemelding ser både bildet og svarsjekkens vurdering av sluttsvaret. Mindre risiko for at KI-en påstår feil om riktig svar | math-exercise + ctm-libs |
| 2d | Batchkjøring: alle besvarelser × policyer × modeller → Markdown-rapport, med samme prompt-bygger som siden | skript i ctm-demo |

### Fase 2c i mer detalj (senere)

Mål: ett felt per deloppgave med sluttsvar **og** bilde, og én Tilbakemelding som
får svarsjekken som privat evidens (riktig/galt per felt) sammen med bildet.

- **math-exercise:** nytt `#| image-upload: true` som viser ctm-libs'
  opplastingskomponent i cellen og legger bildene i `attachments` med
  `role: response` i forespørselen. Evidensen sendes allerede for felt som er
  sjekket.
- **ctm-libs:** trekk opplastingen ut av `initActivity` til en gjenbrukbar
  funksjon (`AIFeedback.imageUpload(el, {role})`) som både tekstaktiviteter og
  math-exercise bruker.
- **Policy:** `math-exercise`-integrasjonen får sin egen policy i `veileder.yml`
  (`policy: {default: …, math-exercise: …}`), og fasiten flyttes til
  `exercises: math-exercise: v25-1a-svar:`.
- **Siden:** bildefeltene erstattes av opplasting i svarfeltet, og fyll inn
  tilpasses.
