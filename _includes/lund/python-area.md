Write `largest_area(p)`: the largest area of a rectangle with perimeter `p`
(in cm). For example, `largest_area(20)` is `25`.

```{py-exercise}
#| label: lund-python-area
#| caption: Largest rectangle, in Python
#| task: Write largest_area(p) to return the largest area of a rectangle with perimeter p.
def largest_area(p):
    pass

## TESTS ##
assert largest_area(20) is not None, "largest_area(20) returned None: does the function end with a return statement?"
assert isinstance(largest_area(20), (int, float)) and abs(largest_area(20) - 25) < 1e-9, f"largest_area(20) returned {largest_area(20)!r}, expected 25: the best rectangle is a 5 cm by 5 cm square."
assert isinstance(largest_area(4), (int, float)) and abs(largest_area(4) - 1) < 1e-9, f"largest_area(4) returned {largest_area(4)!r}, expected 1: a 1 cm by 1 cm square."
assert isinstance(largest_area(10), (int, float)) and abs(largest_area(10) - 6.25) < 1e-9, f"largest_area(10) returned {largest_area(10)!r}, expected 6.25: a 2.5 cm square. Integer division (//) would cut this off."
```
