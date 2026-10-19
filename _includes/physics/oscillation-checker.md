#|   # Shared checker body, included by phys-2024-1-4, phys-2025-1-3, phys-2026-1-4
#|   # and phys-2026-4-3. FIELDS holds one (label, target in t, scale) per answer field;
#|   # the scale is the amplitude, or the largest |target| for 0 < t <= 1 s. Each answer
#|   # is compared with its target at 13 evenly spaced times in (0, 1) s and accepted
#|   # when it deviates by at most 2 % of the scale at every time: exact forms, decimal
#|   # coefficients and frequencies such as 6.0 pass; a wrong amplitude, frequency,
#|   # phase or sign fails, and so does a value that is undefined at a sample time.
#|   # The times are offset by an irrational fraction of the spacing, so terms that
#|   # vanish at rational times, such as sin(13*pi*t), and aliased frequencies fail too.
#|   def check(response, symbols):
#|       t = symbols["t"]
#|       values = response["expressions"]
#|       if len(values) != len(FIELDS):
#|           return {"score": 0, "feedback": "Fyll ut alle feltene."}
#|       times = [(j + sqrt(2) - 1) / 13 for j in range(13)]
#|       wrong = []
#|       for value, (label, target, scale) in zip(values, FIELDS):
#|           target = sympify(target, locals={"t": t})
#|           tolerance = float(Rational(2, 100) * sympify(scale))
#|           try:
#|               ok = value.free_symbols <= {t} and all(
#|                   abs(complex(N((value - target).subs(t, s)))) <= tolerance for s in times)
#|           except (AttributeError, TypeError, ValueError):
#|               ok = False
#|           if not ok:
#|               wrong.append(label)
#|       listed = ", ".join(wrong[:-1]) + " og " + wrong[-1] if len(wrong) > 1 else "".join(wrong)
#|       return {"score": 1 - len(wrong) / len(FIELDS), "show_score": False,
#|               "feedback": "Kontroller " + listed + "." if wrong else ""}
