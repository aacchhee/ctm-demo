Explore a direction, run Python in your browser, and check your mathematics.
Use the tabs to move between the examples and problems.

<div class="learning-mode" data-learning-mode data-reading-label="Go deeper" role="group" aria-label="Choose reading mode">
<button type="button" data-mode="lecture" aria-pressed="true">Explore</button>
<button type="button" data-mode="reading" aria-pressed="false">Go deeper</button>
<span role="status" aria-live="polite"></span>
</div>

```{pyodide-python}
#| label: demo-setup
#| autorun: true
#| context: setup
import numpy as np
import matplotlib.pyplot as plt
```

::: {.panel-tabset}

## 1 A direction emerges {#direction}

### Which direction remains?

We repeatedly apply the transformation $T(x)=Ax$, represented in the standard basis by

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}.$$

**Do sequences starting from different vectors approach the same line?**
Each click applies the transformation once, then sets the vector's length to one.
This lets us follow its direction without growing vectors leaving the picture.

1. Choose **(1, 0)**. Predict which line the blue vector will approach.
   Click **One step** five times. Do the coordinates become closer?
2. Choose **(−1, 0)** and repeat. Is it the same line? The same orientation?
3. Choose **(1, 1)**, then **(1, −1)**. Take three steps from each starting vector.
   Does the direction change? Write down one observation for each.
4. Try **(0, 1)** and **(1, −0.9)**. The latter is close to the special direction
   $(1,-1)^T$. Then drag the orange ring to choose your own starting vector.

The presets specify directions. To **normalize** a vector means to divide it by
its length, giving a unit vector. The orange vector shows $x_0$; the blue vector
shows the normalized iterate $x_k$. Each click computes $Ax$ and divides the
whole vector by its length. We do not normalize individual coordinates.
The formula beside the blue endpoint identifies the iterate. You can drag the
orange ring even when it surrounds the blue endpoint.

{{< include direction-applet.md >}}

### What did you notice?

For many starting vectors, the normalized iterates approach the same **line**,
but their limiting vectors may point in opposite directions. Starting along
$(1,1)^T$ or $(1,-1)^T$ leaves the direction unchanged.

Combine multiplication and normalization into one update rule:

$$F(x)=\frac{Ax}{\lVert Ax\rVert_2},\qquad x_{k+1}=F(x_k).$$

Here $\lVert x\rVert_2$ is the usual vector length and $k$ counts the steps.
The rule is defined when $Ax\ne0$.

**Do you recognize this form from an iteration you already know?** We put a
value into a rule and use the result as the next value. What changes when the
value is a vector? Which equation must hold if the next step is to return
exactly the same vector?

After $k$ steps,

$$x_k=\frac{A^kx_0}{\lVert A^kx_0\rVert_2}.$$

We set $A^0=I$, the identity transformation. The starting vector in the figure
has length one.

**Discuss:** Why can we discard length information and still see which direction
dominates? What distinguishes the two special starting directions?

<details class="reading-step">
<summary>Go deeper: scaling without turning</summary>

Starting from $(1,0)^T$, the first step is

$$Ax_0=\begin{bmatrix}2\\1\end{bmatrix},\quad
\lVert Ax_0\rVert_2=\sqrt5,\quad
x_1=\frac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}.$$

**Check:** Multiply $(1,1)^T$ and $(1,-1)^T$ by $A$. Do they turn, or are they
just multiplied by a number?

For $x=(a,b)^T$,

$$Ax=\begin{bmatrix}2a+b\\a+2b\end{bmatrix},\qquad
\lVert Ax\rVert_2=\sqrt{(2a+b)^2+(a+2b)^2}.$$

Dividing both coordinates by the same positive number preserves their ratio
and the vector's orientation. Only its length changes.

At the next step, the previous normalization cancels:

$$x_2=\frac{(5,4)^T/\sqrt5}{\sqrt{41}/\sqrt5}
=\frac{(5,4)^T}{\sqrt{41}}
=\frac{A^2x_0}{\lVert A^2x_0\rVert_2}.$$

This happens at every step, explaining the formula in the figure. We take small,
normalized steps; we do not need to calculate $A^k$ explicitly. The denominators
must be nonzero.

Without normalization, the first vectors are
$(1,0)^T,(2,1)^T,(5,4)^T,(14,13)^T$. The coordinate difference remains one,
but becomes small relative to the vector's size. The direction approaches
the line whose two coordinates are equal.

The preset $(1,-1)$ uses $x_0=(1,-1)^T/\sqrt2$. Here $Ax_0=x_0$ from the
start: this direction is an exception. In fact, the two special lines are
eigenvector directions, with eigenvalues 3 and 1.

</details>

## 2 The power method {#power-method}

### What determines the speed?

**How quickly does the contribution along the eigenvector with the largest
eigenvalue take over?** Compare

$$A_\mu=Q\operatorname{diag}(3,\mu)Q^T,\qquad
Q=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$$

for $\mu=1$ and $\mu=2.9$. The columns $q_1,q_2$ of $Q$ are orthonormal
eigenvectors. Both sequences start at $x_0=(1,0)^T$.

Write each iterate as $x_k=b_1(k)+b_2(k)$, where
$b_i(k)=(q_i^Tx_k)q_i$. Compare the shares of their lengths:

$$a_i(k)=\frac{\lVert b_i(k)\rVert_2}
{\lVert b_1(k)\rVert_2+\lVert b_2(k)\rVert_2},\qquad i=1,2.$$

- **Blue:** $a_1(k)$. **Orange:** $a_2(k)$.
- **Solid:** $\mu=1$. **Dashed:** $\mu=2.9$.

1. Predict which pair of curves approaches 1 and 0 faster.
2. Run the cell. Compare the orange curves after ten steps.
3. How many steps does each orange curve need to fall below 0.1?
   What does this tell you about nearly equal eigenvalues?

```{pyodide-python}
#| label: demo-speed
# Color identifies the eigenvector contribution; line style identifies the matrix.
Q = np.array([[1., 1.], [1., -1.]]) / np.sqrt(2)
steps = np.arange(81)
fig, ax = plt.subplots()
for mu, style in [(1., '-'), (2.9, '--')]:
    A = Q @ np.diag([3., mu]) @ Q.T
    x = np.array([1., 0.])
    shares = []
    for k in steps:
        c = Q.T @ x  # Coordinates in the orthonormal eigenvector basis.
        lengths = np.abs(c)  # Each q_i has length one.
        shares.append(lengths / lengths.sum())
        if k < steps[-1]:
            x = A @ x
            x = x / np.linalg.norm(x)  # Common scaling preserves the shares.
    shares = np.array(shares)
    ax.plot(steps, shares[:, 0], color='#1565c0', linestyle=style,
            marker='o', markevery=5, markersize=3, label=f'a₁: λ₁ = 3, μ = {mu}')
    ax.plot(steps, shares[:, 1], color='#a04a00', linestyle=style,
            marker='o', markevery=5, markersize=3, label=f'a₂: λ₂ = μ = {mu}')
ax.set(xlabel='Number of multiplications', ylabel='Share of contribution lengths',
       ylim=(-0.03, 1.03), title='Same starting vector, different eigenvalue gaps')
ax.legend()
plt.show()
```

For $\mu=1$, the blue share quickly approaches 1. For $\mu=2.9$, the shares
change slowly: the two contributions grow by almost the same factor at each
step. The **eigenvalue ratio** $\mu/3$ determines the speed.

<details class="reading-step">
<summary>Go deeper: connect the curves to the eigenvalues</summary>

The starting vector has equal coordinates along $q_1$ and $q_2$. After $k$
multiplications, the ratio of contribution lengths is

$$r_k=\frac{\lVert b_2(k)\rVert_2}{\lVert b_1(k)\rVert_2}
=\left(\frac{|\mu|}{3}\right)^k.$$

The ratio $r_k$ and share $a_2(k)$ are different quantities:

$$a_1(k)=\frac1{1+r_k},\qquad a_2(k)=\frac{r_k}{1+r_k}.$$

Both shares start at $1/2$. After ten steps, the orange share is approximately
$0.0000169$ for $\mu=1$ and $0.416$ for $\mu=2.9$.

$$a_2(k)<0.1\quad\Longleftrightarrow\quad r_k<\frac19.$$

This requires 3 steps for $\mu=1$ and 65 for $\mu=2.9$.
Check these counts using the expression for $r_k$.

The exact recurrence $r_{k+1}=(|\mu|/3)r_k$ resembles the local error model
for a scalar fixed-point iteration: a factor close to one gives slow convergence.
The code computes coordinates from iterated vectors, so rounding can affect
very small contributions. A linear vertical axis does not reveal such tiny
errors clearly.

</details>

### Write down the algorithm

This is the **power method**:

```text
Choose x ≠ 0 and divide it by its length.
Repeat, with a maximum number of steps:
    y = A x
    If y = 0: stop; normalization is impossible.
    x = y / ‖y‖₂
    Find a number ρ describing the scaling along x.
    Check how closely A x ≈ ρ x.
```

One step is multiplication followed by normalization:

$$y_k=Ax_k,\qquad x_{k+1}=\frac{y_k}{\lVert y_k\rVert_2}.$$

### The power method as a fixed-point iteration

The update from 1 has the form $x_{k+1}=F(x_k)$, where
$F(x)=Ax/\lVert Ax\rVert_2$. The power method is a **fixed-point iteration**.
A fixed point $x_*$ satisfies $F(x_*)=x_*$. Normalization makes $F$ nonlinear,
even though $x\mapsto Ax$ is linear.

If $F(x_*)=x_*$, then

$$Ax_*=\lVert Ax_*\rVert_2\,x_*.$$

Thus a fixed point is a unit eigenvector for a **positive** eigenvalue;
conversely, every such eigenvector is a fixed point. This does not mean every
starting vector converges to it. The eigenvalues and the contributions present
in the starting vector determine the outcome.

For a unit eigenvector $v$ with a negative eigenvalue, $F(v)=-v$ and $F(-v)=v$.
The iteration alternates between two vectors on one line. The line remains
unchanged, but the vector is not a fixed point.

### From projection to the Rayleigh quotient

The power method first finds a candidate direction $x$. Which scalar $t$ makes
$tx$ the best approximation to $Ax$? We want the orthogonal projection of $Ax$
onto $\operatorname{span}\{x\}$.

For $x\ne0$, the projection of $b$ onto that line is
$\frac{x^Tb}{x^Tx}x$. The inner product $x^Tb=\sum_i x_i b_i$ gives the numerator;
$x^Tx=\lVert x\rVert_2^2$ corrects for the length of $x$. Setting $b=Ax$ gives

$$\rho(x)=\frac{x^TAx}{x^Tx},\qquad r=Ax-\rho(x)x,\qquad x^Tr=0.$$

The **Rayleigh quotient** $\rho$ minimizes $\lVert Ax-tx\rVert_2$ over all real
$t$. The **eigenresidual** $r$ is the part of $Ax$ perpendicular to $x$ that
cannot be described as scaling $x$.

For $x=(1,0)^T$ and the matrix in 1, $Ax=(2,1)^T$. Its projection is $2x$,
so $\rho=2$ and $r=(0,1)^T$: $x$ is not an eigenvector.
For $x=(1,1)^T/\sqrt2$, we get $\rho=3$ and $r=0$.

The eigenresidual tests $Ax=\rho x$, whereas the fixed-point residual $F(x)-x$
tests a different equation. For a unit eigenvector with a negative eigenvalue,
the eigenresidual is zero but $F(v)-v=-2v$.

**What does a small residual tell us?** The eigenvector equation is nearly
satisfied. It does not prove that the eigenvalue is dominant: the direction
with eigenvalue 1 also gives zero residual. For a general matrix it does not,
by itself, guarantee proximity to a particular exact eigenvector.

<details class="reading-step">
<summary>Go deeper: why this quotient?</summary>

Orthogonality of the residual gives

$$x^T(Ax-\rho x)=0
\quad\Longrightarrow\quad x^TAx-\rho x^Tx=0
\quad\Longrightarrow\quad \rho=\frac{x^TAx}{x^Tx}.$$

For a unit vector, $\rho=x^TAx$. A residual is a vector; its norm is a number.
The code below records the quotient and the residual norm.

**Calculate by hand:** Use $x=(2,1)^T/\sqrt5$, the first normalized step from 1.
Calculate $Ax$, $\rho$, and $r$, then compare with

$$Ax=\frac1{\sqrt5}\begin{bmatrix}5\\4\end{bmatrix},\qquad
\rho=\frac{14}{5},\qquad
r=\frac1{5\sqrt5}\begin{bmatrix}-3\\6\end{bmatrix},\qquad
\lVert r\rVert_2=\frac35.$$

The residual norm has decreased from 1 to $3/5$ after one step.

</details>

<details class="reading-step">
<summary>Go deeper: implementation of the power method</summary>

The definition runs automatically. Follow the pseudocode: normalization,
Rayleigh quotient, residual, and a maximum number of steps.

```{pyodide-python}
#| label: demo-power
#| autorun: true
# A small eigenresidual does not guarantee the dominant eigenvalue.
def power_iteration(A, x0, tol=1e-10, max_steps=500):
    A = np.asarray(A, dtype=float)
    x = np.array(x0, dtype=float, copy=True)
    if A.ndim != 2 or A.shape[0] != A.shape[1] or x.shape != (A.shape[0],):
        raise ValueError("A must be square and x0 must have matching length")
    if not np.all(np.isfinite(A)) or not np.all(np.isfinite(x)):
        raise ValueError("Use finite numbers")
    if np.linalg.norm(x) == 0 or tol <= 0 or max_steps < 1:
        raise ValueError("Use x0 ≠ 0, positive tolerance, and at least one step")
    x /= np.linalg.norm(x)
    scale = np.linalg.norm(A, 'fro')
    history = []
    for k in range(max_steps + 1):
        y = A @ x
        rho = x @ y  # x has length one.
        residual = np.linalg.norm(y - rho * x)
        history.append((rho, residual))
        if np.linalg.norm(y) == 0:
            return x, rho, np.array(history), "Ax = 0; cannot normalize"
        if residual <= tol * scale:
            return x, rho, np.array(history), "small eigenresidual"
        if k < max_steps:
            x = y / np.linalg.norm(y)
    return x, rho, np.array(history), "maximum number of steps"
```

`y` is $Ax$, `rho` is $x^TAx$, and `residual` is $\lVert Ax-\rho x\rVert_2$.
We record these **before** the next update, so the final row of `history`
corresponds to the returned vector.

`scale` is the **Frobenius norm** $\lVert A\rVert_F$, the square root of the sum
of the squared matrix entries. For $A\ne0$, the stopping test is
$\lVert r\rVert_2/\lVert A\rVert_F\le\text{tol}$. Scaling $A$ by a common
nonzero factor scales numerator and denominator equally. `max_steps` bounds
experiments that do not converge.

If $Ax=0$, $x$ is already an eigenvector for zero, but the next normalization
is impossible. The status message explains this case.

</details>

```{pyodide-python}
#| label: demo-power-result
A = np.array([[2., 1.], [1., 2.]])
x, rho, history, status = power_iteration(A, [1., 0.])
print(status, "ρ =", rho, "x =", x)
print("eigenresidual:", history[-1, 1])
```

Read the status together with $\rho$ and the residual. The tolerance controls
the relative residual; it is not an absolute error bound for the eigenvalue.

## 3 Problems {#problems}

Use these two problems to review linear systems, eigenvalues, and eigenvectors.
Work on paper first, then use the answer fields to check your calculations.
Use exact values such as `3/2` and `sqrt(2)`. Write explanations in your own notes.

### Problem 1 — coordinates in another basis

Let $v_1=(1,1)^T$, $v_2=(1,-1)^T$, and $x=(2,1)^T$.
Find $c_1,c_2$ such that $x=c_1v_1+c_2v_2$.

**a. Set up the system.** Write one equation for each coordinate.

**b. Solve the system.** Enter one real number in each field, not a vector or equation.

```{math-exercise}
#| label: demo-coordinates
#| caption: Find the coefficients by solving a linear system
#| mode: equivalent
#| partial-credit: true
#| field-labels: c₁, c₂

$c_1=$ __[3/2]

$c_2=$ __[1/2]
```

**c. Check and interpret.** Calculate $c_1v_1+c_2v_2$. Explain why $c_1,c_2$
are different from the standard coordinates $2,1$.

<details class="learning-hint">
<summary>Hint for problem 1</summary>

The equations are $c_1+c_2=2$ and $c_1-c_2=1$. What happens when you add them?

</details>

### Problem 2 — eigenvalues and your choice of eigenvectors

Consider $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.

**a. Find the eigenvalues.** Set up $\det(A-\lambda I)=0$ and solve it.
Show the intermediate calculations in your notes.

**b. Find an eigenvector for each eigenvalue.** Solve $(A-\lambda I)v=0$.
Choose any valid scaling: the vectors need not have length one or first coordinate one.

**Answer format:** two real eigenvalues in decreasing order, each with a
corresponding nonzero vector in $\mathbb R^2$. Enter one number per field.
The vector fields form columns. The checker tests $Av_i=\lambda_i v_i$ and
accepts every valid scaling.

```{math-exercise}
#| label: demo-eigenvectors
#| caption: Two eigenvalues with corresponding eigenvectors
#| mode: custom
#| field-labels: larger eigenvalue λ₁, first coordinate of v₁, second coordinate of v₁, smaller eigenvalue λ₂, first coordinate of v₂, second coordinate of v₂
#| checker: |
#|   def check(response, symbols):
#|       values = response["expressions"]
#|       if len(values) != 6:
#|           return {"score": 0, "feedback": "Enter two eigenvalues and two coordinates for each eigenvector."}
#|       if any(z.free_symbols or z.is_real is not True or z.is_finite is not True for z in values):
#|           return {"score": 0, "feedback": "Use specific, finite real numbers. Describe parameter families in part c."}
#|       A = Matrix([[2, 1], [1, 2]])
#|       checks = []
#|       messages = []
#|       for i, target in enumerate((3, 1)):
#|           lam = values[3*i]
#|           v = Matrix(values[3*i+1:3*i+3])
#|           eigenvalue_ok = simplify(lam-target) == 0
#|           nonzero = any(simplify(z) != 0 for z in v)
#|           eigenvector_ok = nonzero and all(simplify(z) == 0 for z in A*v-lam*v)
#|           checks.extend([eigenvalue_ok, eigenvalue_ok and eigenvector_ok])
#|           if not eigenvalue_ok:
#|               messages.append(f"Pair {i+1}: check the eigenvalue and decreasing order.")
#|           elif not nonzero:
#|               messages.append(f"Pair {i+1}: the zero vector is not an eigenvector.")
#|           elif not eigenvector_ok:
#|               messages.append(f"Pair {i+1}: check that Av = λv for your eigenvalue and vector.")
#|           else:
#|               messages.append(f"Pair {i+1}: the eigenvalue and eigenvector are correct.")
#|       return {"score": sum(checks)/4, "show_score": False, "feedback": " ".join(messages)}

For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, enter $\lambda_1>\lambda_2$
and nonzero vectors satisfying $Av_i=\lambda_i v_i$.

Larger eigenvalue: $\lambda_1=$ __[3]

A corresponding eigenvector: $v_1=$ vec[1,1]

Smaller eigenvalue: $\lambda_2=$ __[1]

A corresponding eigenvector: $v_2=$ vec[1,-1]
```

**c. Describe all choices.** Use your vectors to describe all eigenvectors
and both eigenspaces. Give two parameter families $t v_i$, specifying exactly
which $t\in\mathbb R$ are allowed for eigenvectors and for eigenspaces.
Explain why the zero vector is treated differently.

<details class="learning-hint">
<summary>Hint for problem 2</summary>

The determinant equation is $(2-\lambda)^2-1=0$. Substitute each root into
$A-\lambda I$ and solve the homogeneous system. The matrix is singular;
do not try to invert it.

</details>

:::
