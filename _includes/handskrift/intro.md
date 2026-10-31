::: {.language-switch}
🌐 [English](handwriting-ai.qmd) · **Norsk bokmål**
:::

Løs oppgavene i [oppgavesettet (PDF)](../assets/handskrift/proveeksamen-v2025.pdf)
på papir. For hver deloppgave kan du

1. skrive sluttsvaret i svarfeltet og velge **Sjekk** (bruk desimalpunkt, og
   ikke skriv enheten i feltet);
2. ta et bilde av utregningen, laste det opp under **Last opp bilder** og velge
   **Tilbakemelding**. Hvert nytt klikk gir et dypere hint: først en vurdering,
   så en forklaring, så framgangsmåten og til slutt et løsningsforslag.
   Menyen **Språk for tilbakemeldingen** ved hvert opplastingsfelt velger
   språket KI-en svarer på (engelsk, norsk, svensk, spansk, russisk eller
   tysk) for akkurat den deloppgaven.

Hvis KI-en leser eller forstår bildet feil, velg **KI-en misforsto besvarelsen
min** under tilbakemeldingen. Vis til linjen eller detaljen den overså. Du får
ett svar på presiseringen, og hintene starter på nytt på nivå 1. Last opp en ny
side for å få vurdert endret eller nytt arbeid. Denne funksjonen er tilgjengelig
med direkte API-tilbakemelding.

Tilbakemeldingen kommer fra en KI-modell du velger selv under tannhjulet ⚙
(direkte API med egen nøkkel, eller «kopier instruksjon» til en KI-chat).
Modellen må kunne lese bilder. Bildet og oppgaveteksten sendes til
leverandøren du velger. KI-en kan ta feil: les tilbakemeldingen kritisk.

::: {.callout-note collapse="true"}
## For lærere: test med ekte besvarelser

Knappene **Fyll inn student 1** og **Fyll inn student 2** laster inn ekte,
anonymiserte besvarelser fra to studenter på oppgave 1–4, med bilde og
sluttsvar, så du slipper å laste opp selv. Knappene øverst fyller inn alle
deloppgavene samtidig. Lærerens vurdering av hver besvarelse står i
[benchmark-arket](https://github.com/aacchhee/ctm-demo/blob/main/docs/handskrift-benchmark.md).
Promptene ligger i YAML-filer i repoet; se [Spill med promptene](handskrift-ki-prompter.qmd).
Prompt-sandkassen nederst på siden lar deg prøve endringer uten å bygge siden
på nytt.
:::

::: {#fyll-inn-verktoy}
:::
