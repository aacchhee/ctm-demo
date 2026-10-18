#|   # Shared checker body, included by phys-2024-1-4, phys-2025-1-3 and phys-2026-1-4.
#|   # FIELDS holds one (label, target in t, amplitude) per answer field. Each answer
#|   # is compared with its target at 13 times in (0, 1] s and accepted when it
#|   # deviates by at most 2 % of the amplitude: exact forms, decimal coefficients
#|   # and frequencies such as 6.0 pass; a wrong amplitude, frequency, phase or sign fails.
#|   def check(response, symbols):
#|       t = symbols["t"]
#|       values = response["expressions"]
#|       if len(values) != len(FIELDS):
#|           return {"score": 0, "feedback": "Fyll ut alle feltene."}
#|       times = [Rational(j, 13) for j in range(1, 14)]
#|       wrong = []
#|       for value, (label, target, amplitude) in zip(values, FIELDS):
#|           target = sympify(target, locals={"t": t})
#|           try:
#|               ok = value.free_symbols <= {t} and max(
#|                   abs(complex(N((value - target).subs(t, s)))) for s in times
#|               ) <= Rational(2, 100) * sympify(amplitude)
#|           except (AttributeError, TypeError, ValueError):
#|               ok = False
#|           if not ok:
#|               wrong.append(label)
#|       return {"score": 1 - len(wrong) / len(FIELDS), "show_score": False,
#|               "feedback": "Kontroller " + " og ".join(wrong) + "." if wrong else ""}
