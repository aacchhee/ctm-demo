# Benchmark: AI feedback on handwritten answers (English)

Page: `pages/handwriting-ai.qmd` (Handwriting and AI → Practice exam V2025).
Guide: `pages/handwriting-ai-prompts.qmd`. Norwegian version of this sheet:
`docs/handskrift-benchmark.md`, which also holds the **shared results log**.

This sheet is the key we compare the AI with. It is not shown on the page and is
never sent to the AI.

## The answers

18 photos from two students, problems 1–4, handwritten in Norwegian. The
students gave consent. The candidate-number grid is blanked out and metadata is
removed. The photos are named after the subtask they actually show:

| File in the repository | Original file | Note |
|---|---|---|
| `student1/1a.png` | `Student 1/S1 1a.png` | |
| `student1/1c.png` | `Student 1/S1 1b.png` | Shows 1c, not 1b |
| `student1/2a.png` … `4b.png` | `Student 1/S1 2a.png` … | `3b` was `s1 3b.png` |
| `student1/4c.png` | `Student 1/S2 4c.png` | Filed under student 1 with the wrong prefix; the handwriting is student 1's |
| `student2/1a.png` … `4c.png` | `Student 2/S2 1a.png` … | No 1b |

Neither student answered 1b (the graph).

## Teacher's assessment

**Draft made by reading the photos. Must be checked by a subject teacher.**
✔ correct · ~ partly correct · ✘ wrong or missing

| Part | Reference | Student 1 | Student 2 |
|---|---|---|---|
| 1a | 0.61 s; 3.3 m | ✔ 0.6 s and 3.3 m. Tidy layout. | ✔ 0.6 s and 3.3 m, with a figure and an answer sentence. |
| 1b | Straight line from 6.0 m/s to −8.1 m/s at 1.44 s | — | — |
| 1c | 4.8 J | ✔ 4.9 J. The formula is written with $+\tfrac12at^2$, but s = 1.1 m is computed with $a=-9.81$. Rounds s to 1.1 m. | ~ Computes ΔE_k = 4.83 J (a valid route via energy conservation), but writes 4.87 J in the answer sentence. |
| 2a | 455 nm | ✘ Computes the radiant exitance σT⁴ (belongs to b), not the wavelength. | ~ λ = 455 nm in the working, but 465 nm in the answer sentence. Claims the star "shines blue light". |
| 2b | 4.2·10¹⁸ m² | ✔ 4.2·10¹⁸ m². | ✘ Power-of-ten slip: σT⁴ = 9.35·10¹⁵ (should be 10⁷), giving 4.2·10¹⁰ m² = "42.0 Gm²". |
| 3a | T ≈ 175 K; 2.3 kg/m³ | ~ ρ = 2.2 kg/m³ because the mass was rounded to 0.02 kg too early. Temperature missing. | ✔ 175 K and 2.3 kg/m³ (also −98 °C). |
| 3b | 87.6 kg | ✔ 87.6 kg from Δp·A = mg. | ✘ Wrong model (p = p₀ + ρgh and the gas law); concludes "under 20 grams". |
| 4a | 205 N/m | ✔ 205 via energy conservation. Unit missing. | ✘ Uses the weight mg as the spring force: k = 11.2 "Nm". |
| 4b | 1.60 m | ✔ t = 0.53 s and x = 1.6 m. | ✘ Wrong rearrangement, t = √(h + ½g) = 2.51 s, giving 7.53 m. |
| 4c | 2.8 m/s | ✘ Finds the speed 4.1 m/s, but not the vertical component. | ✔ v_y = 2.8 m/s via Pythagoras. |

Each student has correct, partly correct and wrong answers. The kinds of mistake
vary: wrong question answered, copying slip, power-of-ten error, wrong physical
model, missing part and missing unit.

## Log

Use the shared log in `docs/handskrift-benchmark.md` (bilingual headings), with
"en" in the page column.
