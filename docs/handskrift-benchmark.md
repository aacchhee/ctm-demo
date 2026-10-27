# Benchmark: KI-tilbakemelding på håndskrevne besvarelser

Siden: `pages/handskrift-ki.qmd` (Håndskrift og KI → Prøveeksamen V2025).
Veiledning: `pages/handskrift-ki-prompter.qmd`.

Dette arket er fasiten vi sammenligner KI-en med. Det vises ikke på siden og
sendes aldri til KI-en.

## Besvarelsene

18 bilder fra to studenter, oppgave 1–4. Studentene har gitt samtykke.
Rutenettet med kandidatnummer er hvitet ut, og metadata er fjernet. Bildene
heter nå etter deloppgaven de faktisk viser:

| Fil i repoet | Opprinnelig fil | Merknad |
|---|---|---|
| `student1/1a.png` | `Student 1/S1 1a.png` | |
| `student1/1c.png` | `Student 1/S1 1b.png` | Viser 1c, ikke 1b |
| `student1/2a.png` … `4b.png` | `Student 1/S1 2a.png` … | `3b` var `s1 3b.png` |
| `student1/4c.png` | `Student 1/S2 4c.png` | Lå hos student 1 med feil prefiks; håndskriften er student 1 sin |
| `student2/1a.png` … `4c.png` | `Student 2/S2 1a.png` … | Ingen 1b |

Ingen av studentene har levert 1b (grafen).

## Lærerens vurdering

**Utkast laget ved gjennomlesing av bildene. Må kontrolleres av en faglærer.**
✔ riktig · ~ delvis riktig · ✘ feil eller mangler

| Del | Fasit | Student 1 | Student 2 |
|---|---|---|---|
| 1a | 0,61 s; 3,3 m | ✔ 0,6 s og 3,3 m. Ryddig oppsett. | ✔ 0,6 s og 3,3 m, med figur og svarsetning. |
| 1b | Rett linje fra 6,0 m/s til −8,1 m/s ved 1,44 s | — | — |
| 1c | 4,8 J | ✔ 4,9 J. Formelen står med $+\tfrac12at^2$, men s = 1,1 m er regnet med $a=-9{,}81$. Avrunder s til 1,1 m. | ~ Regner ΔE_k = 4,83 J (riktig vei via energibevaring), men skriver 4,87 J i svarsetningen. |
| 2a | 455 nm | ✘ Regner utstrålingstettheten σT⁴ (hører til b), ikke bølgelengden. | ~ λ = 455 nm i utregningen, men 465 nm i svarsetningen. Påstår at stjerna «lyser blått lys». |
| 2b | 4,2·10¹⁸ m² | ✔ 4,2·10¹⁸ m². | ✘ Potensfeil: σT⁴ = 9,35·10¹⁵ (skal være 10⁷), gir 4,2·10¹⁰ m² = «42,0 Gm²». |
| 3a | 175 K; 2,3 kg/m³ | ~ ρ = 2,2 kg/m³ fordi massen er avrundet til 0,02 kg for tidlig. Temperaturen mangler. | ✔ 175 K og 2,3 kg/m³ (også −98 °C). |
| 3b | 87,6 kg | ✔ 87,6 kg med Δp·A = mg. | ✘ Feil modell (p = p₀ + ρgh og gassloven) og konkluderer med «under 20 gram». |
| 4a | 205 N/m | ✔ 205 via energibevaring. Enhet mangler. | ✘ Bruker tyngden mg som fjærkraft: k = 11,2 «Nm». |
| 4b | 1,60 m | ✔ t = 0,53 s og x = 1,6 m. | ✘ Feil omforming, t = √(h + ½g) = 2,51 s, gir 7,53 m. |
| 4c | 2,8 m/s | ✘ Finner farten 4,1 m/s, men ikke den vertikale komponenten. | ✔ v_y = 2,8 m/s via Pytagoras. |

Hver student har både riktige, delvis riktige og gale svar. Feiltypene er
varierte: feil spørsmål besvart, avskrivingsfeil, potensfeil, feil fysisk modell,
manglende delsvar og manglende enhet.

## Logg

Én linje per forsøk. «Lesing» = leste KI-en bildet riktig? «Diagnose» = fant den
de reelle feilene, uten å finne på nye? «Lekkasje» = røpet den svaret før nivå 4?

| Dato | Hvem | Modell | Policy / sandkasse-endring | Del | Student | Lesing | Diagnose | Lekkasje | Kommentar |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |
