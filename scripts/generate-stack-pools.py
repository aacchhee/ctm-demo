"""Build browser-side math-exercise pools from the four supplied STACK models.

Run from any directory. No Maxima/Moodle server is needed. Ordinary checkers
replace the LMS point trees: triangles use 3 decimal places, trig values use
absolute tolerance .02, angles use relative tolerance 1%, algebra uses equivalence.
The trig pool samples 71 valid combinations instead of enumerating every product.
"""
from pathlib import Path
import json
import math
import re
from fractions import Fraction

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_includes/stack'
ASSETS = ROOT / 'assets/stack'
variants = {}

def texfrac(q):
    q = Fraction(q)
    return str(q.numerator) if q.denominator == 1 else rf'\frac{{{q.numerator}}}{{{q.denominator}}}'

def expr(q):
    q = Fraction(q)
    return str(q.numerator) if q.denominator == 1 else f'{q.numerator}/{q.denominator}'

def factor(p):
    return 'x' if p == 0 else f'x{-p:+d}'

def make_pool(kind, opts, tasks):
    header = ['```{math-exercise}', f'#| label: stack-{kind}', '#| pool: true',
              f'#| context: stack-conventions, stack-{kind}-context']
    header += [f'#| {k}: {v}' for k, v in opts.items()]
    bodies = []
    for i, (params, body, solution) in enumerate(tasks):
        key = f'{kind}-{i}'
        # Dynamic HTML bypasses Pandoc: use MathJax's standard delimiters.
        solution = re.sub(r'\$\$(.*?)\$\$|\$([^$]+)\$',
                          lambda m: r'\['+m[1]+r'\]' if m[1] is not None else r'\('+m[2]+r'\)',
                          solution, flags=re.S)
        variants[key] = {'kind': kind, 'params': params, 'solution': solution}
        bodies.append(f'<span hidden data-stack-variant="{key}"></span>\n'+body)
    (OUT / f'{kind}-pool.md').write_text('\n'.join(header)+'\n\n'+'\n\n---\n\n'.join(bodies)+'\n```\n')

tasks=[]
for ab in range(3,9):
    for bc in range(ab+1,ab+5):
        ratio=bc/math.hypot(ab,bc)
        body=rf'''I trekantene $ABC$ og $DEF$ er $\angle B=\angle E=90^\circ$ og $\angle C=\angle F$.
$AB={ab}$ og $BC={bc}$. Finn forholdet $EF/DF$.
Svar med <strong>3 desimaler</strong>. Et eksakt uttrykk eller flere riktige desimaler godtas også.

$\displaystyle\frac{{EF}}{{DF}}=$ _[{bc}/sqrt({ab}^2+{bc}^2)]'''
        sol=rf'''<p>Trekantene er formlike fordi to par vinkler er like. Siden $EF$ svarer til $BC$, og hypotenusen $DF$ svarer til $AC$.</p>
$$\frac{{EF}}{{DF}}=\frac{{BC}}{{AC}}=\frac{{{bc}}}{{\sqrt{{{ab}^2+{bc}^2}}}}\approx {ratio:.3f}.$$
<p>En endring av størrelsen på trekant $DEF$ endrer ikke forholdet.</p>'''
        tasks.append(({'ab':ab,'bc':bc},body,sol))
make_pool('triangles',{'mode':'numeric','decplaces':3,'field-labels':'Lengdeforholdet EF/DF'},tasks)

tasks=[]
for k in range(71):
    vs=[float(f'{math.pi*((k+offset)%71+1)/36:.2g}') for offset in (10,43)]
    ds=[5*((k+offset)%71+1) for offset in (0,24)]
    angles=vs+[math.radians(d) for d in ds]
    labels=[f'{v:g}' for v in vs]+[rf'{d}^\circ' for d in ds]
    body='Flytt punktet A i figuren og les av verdiene. Bruk <strong>2 desimaler</strong>, uten kalkulator.\nAvlesningsavvik inntil 0.02 godtas.\n\n'
    rows=[]
    for i,(a,label) in enumerate(zip(angles,labels)):
        if i==0:body+='Vinkler i <strong>radianer</strong>:\n'
        if i==2:body+='\nVinkler i <strong>grader</strong>:\n'
        # STACK rounds the target to two significant figures, not decimal places.
        sn=float(f'{math.sin(a):.2g}');cs=float(f'{math.cos(a):.2g}')
        body+=rf'$\sin({label})\approx$ _[{sn!r}], $\cos({label})\approx$ _[{cs!r}]'+'\n'
        rows.append(rf'<tr><td>${label}$</td><td>${math.sin(a):.2f}$</td><td>${math.cos(a):.2f}$</td></tr>')
    sol='<p>På enhetssirkelen er $A=(\\cos v,\\sin v)$. Les cosinus på x-aksen og sinus på y-aksen. Fortegnene følger av kvadranten.</p><table><thead><tr><th>Vinkel</th><th>Sinus</th><th>Cosinus</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table>'
    tasks.append(({'radians':vs,'degrees':ds},body,sol))
make_pool('values',{'mode':'numeric','tolerance':'0.02','partial-credit':'true','field-labels':'Sinus til første radianvinkel, Cosinus til første radianvinkel, Sinus til andre radianvinkel, Cosinus til andre radianvinkel, Sinus til første gradvinkel, Cosinus til første gradvinkel, Sinus til andre gradvinkel, Cosinus til andre gradvinkel'},tasks)

tasks=[]
for k in range(1,72):
    a=math.pi*k/36;sn=round(math.sin(a),2);cs=round(math.cos(a),2)
    body=rf'''Vinkelen $v$ ligger i første omløp: $0\leq v<2\pi$.
Vi har $\sin v\approx {sn:.2f}$ og $\cos v\approx {cs:.2f}$ (avrundede verdier).
Flytt A slik at koordinatene stemmer så godt som mulig, og les av vinkelen.

Svar i <strong>radianer med 3 desimaler</strong>. Relativt avvik inntil 1 % godtas.

$v\approx$ _[{k}*pi/36] rad.'''
    sol=rf'''<p>Cosinus gir x-koordinaten og sinus gir y-koordinaten. Flytt derfor A nær $({cs:.2f},{sn:.2f})$. Koordinatene er avrundet; punktet skal fortsatt ligge på sirkelen.</p>
<p>For denne varianten er vinkelen $v={texfrac(Fraction(k,36))}\pi\approx {a:.3f}$ rad, eller ${5*k}^\circ$. Vinkelen måles mot klokka fra positiv x-akse. Begge fortegnene trengs for å velge riktig kvadrant.</p>'''
    tasks.append(({'sine':sn,'cosine':cs},body,sol))
make_pool('angle',{'mode':'numeric','tolerance':'1%','field-labels':'Vinkel v i radianer'},tasks)

tasks=[]
for p1 in [-3,-2,-1,2,3,4]:
    for p2 in range(-3,5):
        if p2 in (0,p1):continue
        for x0 in range(-2,3):
            if x0==p2:continue
            y0=Fraction(x0-p1,x0-p2);a=Fraction(p1-p2,(x0-p2)**2);b=y0-a*x0
            u=factor(p1);v=factor(p2);df=f'({p1-p2})/({v})^2';t=f'({expr(a)})*x+({expr(b)})'
            body=rf'''Finn den deriverte og tangenten til $f(x)=\dfrac{{{u}}}{{{v}}}$ i punktet $({x0},f({x0}))$. Funksjonen er ikke definert når $x={p2}$.
Bruk brøkregelen $\left(\dfrac{{u}}{{v}}\right)'=\dfrac{{u'v-uv'}}{{v^2}}$, med $u(x)={u}$ og $v(x)={v}$.
Skriv <strong>eksakte uttrykk</strong>; bruk brøker i stedet for avrundede desimaltall.

$u'(x)=$ _[1], $v'(x)=$ _[1]

$f'(x)=$ __[{df}]

Tangenten har likning $y=$ __[{t}]'''
            sol=rf'''<p>Vi har $u'(x)=1$ og $v'(x)=1$. Brøkregelen gir</p>
$$f'(x)=\frac{{1\cdot({v})-({u})\cdot1}}{{({v})^2}}=\frac{{{p1-p2}}}{{({v})^2}}.$$
<p>Tangentpunktet er $({x0},{texfrac(y0)})$, og stigningstallet er $a=f'({x0})={texfrac(a)}$.</p>
$$y={texfrac(y0)}+\left({texfrac(a)}\right)(x-({x0})).$$
<p>Utvidet form er $y=\left({texfrac(a)}\right)x+\left({texfrac(b)}\right)$. Begge former godtas. I figuren under kan du flytte tangentpunktet og se hvordan stigningstallet endres.</p>'''
            tasks.append(({'p1':p1,'p2':p2,'x0':x0},body,sol))
make_pool('tangent',{'mode':'equivalent','vars':'x','partial-credit':'true','field-labels':'u derivert, v derivert, f derivert, Tangentens høyreside'},tasks)
(ASSETS/'variants.js').write_text('// Generated by scripts/generate-stack-pools.py.\nwindow.stackVariants = '+json.dumps(variants,ensure_ascii=False,separators=(',',':'))+';\n')
print({kind:sum(v['kind']==kind for v in variants.values()) for kind in ['triangles','values','angle','tangent']})
