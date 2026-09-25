## Vektorer og bevegelse

En vektor har både størrelse og retning. Posisjon, forflytning, hastighet,
akselerasjon og kraft er vektorstørrelser. Vi skriver for eksempel
$\vec s=(s_x,s_y)$ og bruker $s=|\vec s|$ for lengden.

Når $\theta$ måles fra positiv $x$-retning, er
$$s_x=s\cos\theta,\qquad s_y=s\sin\theta,\qquad
s=\sqrt{s_x^2+s_y^2}.$$
Vinkelen må plasseres i riktig kvadrant ut fra fortegnene til komponentene.
Når begge komponentene er positive, kan vi bruke
$\theta=\arctan(s_y/s_x)$.

Posisjonen kan avhenge av tiden: $\vec r(t)=(x(t),y(t))$.
Forflytningen er $\Delta\vec r=\vec r(t_2)-\vec r(t_1)$,
og gjennomsnittshastigheten er
$$\bar{\vec v}=\frac{\Delta\vec r}{t_2-t_1}.$$
Den momentane hastigheten $\vec v(t)=\vec r\,'(t)$ er tangent til banen.
Banefarten er $v(t)=|\vec v(t)|$. Gjennomsnittlig **banefart** er derimot
banens lengde delt på tiden; den er vanligvis større enn
$|\bar{\vec v}|$ når banen er krum.

Akselerasjon beskriver endring av hastighetsvektoren:
$$\bar{\vec a}=\frac{\vec v_2-\vec v_1}{t_2-t_1},\qquad
\vec a(t)=\vec v\,'(t).$$
Retningen kan endres selv om banefarten er konstant.

### Oppgave 1 — lengde og retning

::: {#b2-1-context .math-exercise-context}

En forflytningsvektor har komponentene $s_x=4.0\,\mathrm m$ og
$s_y=3.0\,\mathrm m$. Finn lengden og vinkelen fra positiv $x$-akse.
Begge komponentene er positive. Figuren kan utforskes ved å dra i P,
men svarene skal gjelde den oppgitte vektoren $(4,3)\,\mathrm m$.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-1, 6.5, 8, -1], physical=true;

document.documentElement.lang='nb';
var box=document.querySelector('.jxgbox'),board=null;
var ink='#243447',blue='#1565c0',red='#b3263e',green='#217346';
function line(a,b,color,dash,arrow){return board.create('segment',[a,b],{
 strokeColor:color||ink,strokeWidth:2,dash:dash||0,lastArrow:!!arrow,fixed:true,highlight:false});}
function txt(x,y,s,color){return board.create('text',[x,y,s],{
 fontSize:function(){return Math.max(10,Math.min(15,box.clientWidth/45));},
 strokeColor:color||ink,fixed:true,highlight:false});}
function curve(xs,ys,color){return board.create('curve',[xs,ys],{
 strokeColor:color||blue,strokeWidth:2.5,fixed:true,highlight:false});}
function point(x,y,name,color){return board.create('point',[x,y],{
 name:name||'',color:color||blue,size:3,fixed:true,label:{fontSize:12},highlight:false});}
function shade(points,color){return board.create('polygon',points,{
 vertices:{visible:false},borders:{visible:false},fillColor:color||'#e7b33b',fillOpacity:.3,
 fixed:true,highlight:false});}
function axes(xname,yname,dx,dy){
 board.create('axis',[[0,0],[function(){return board.getBoundingBox()[2]-20/board.unitX;},0]],{
 straightFirst:false,straightLast:false,firstArrow:false,lastArrow:true,
 ticks:{ticksDistance:dx,minorTicks:0,insertTicks:false,drawLabels:true,label:{fontSize:11}},fixed:true});
 board.create('axis',[[0,0],[0,function(){return board.getBoundingBox()[1]-20/board.unitY;}]],{
 straightFirst:false,straightLast:false,firstArrow:false,lastArrow:true,
 ticks:{ticksDistance:dy,minorTicks:0,insertTicks:false,drawLabels:true,label:{fontSize:11}},fixed:true});
 var font=function(){return Math.max(10,Math.min(15,box.clientWidth/45));};
 board.create('text',[function(){return board.getBoundingBox()[2]-12/board.unitX;},
  function(){return -28/board.unitY;},xname],
  {fontSize:font,anchorX:'right',anchorY:'bottom',fixed:true,highlight:false});
 board.create('text',[function(){return 20/board.unitX;},
  function(){return board.getBoundingBox()[1]-8/board.unitY;},yname],
  {fontSize:font,anchorX:'left',anchorY:'top',fixed:true,highlight:false});
}
function sample(fn,a,b,n,color){var xs=[],ys=[];for(var i=0;i<=n;i++){
 var t=a+(b-a)*i/n;var p=fn(t);xs.push(p[0]);ys.push(p[1]);}return curve(xs,ys,color);}

function draw(){

 axes('x (m)','y (m)',1,1);
 var p=board.create('point',[4,3],{name:'P',size:4,color:red,fixed:false,tabindex:0,aria:{enabled:true,label:'Flytt punkt P med piltastene'}});
 line([0,0],p,blue,0,true);
 line([0,0],[function(){return p.X();},0],green,0,true);
 line([function(){return p.X();},0],p,green,2,true);
 txt(4.5,5.5,function(){return 'P = ('+p.X().toFixed(1)+', '+p.Y().toFixed(1)+') m';});
 board.create('button',[4.5,4.7,'Tilbakestill',function(){p.moveTo([4,3]);board.update();}],{fixed:true});

}

function fitBoard(){
 var w=box.clientWidth,h=box.clientHeight;
 if(!(w>0&&h>0))return;
 if(!board){
  board=JXG.JSXGraph.initBoard(box.id,{boundingbox:bounds.slice(),axis:false,
   keepaspectratio:physical,showNavigation:false,showCopyright:false,
   pan:{enabled:false},zoom:{enabled:false},resize:{enabled:false}});
  board.suspendUpdate();draw();board.unsuspendUpdate();
 }
 if(board.canvasWidth!==w||board.canvasHeight!==h)board.resizeContainer(w,h,true);
 if(physical){
  var scale=Math.min(w/(bounds[2]-bounds[0]),h/(bounds[1]-bounds[3]));
  var cx=(bounds[0]+bounds[2])/2,cy=(bounds[1]+bounds[3])/2;
  board.setBoundingBox([cx-w/(2*scale),cy+h/(2*scale),cx+w/(2*scale),cy-h/(2*scale)],true);
 }else board.setBoundingBox(bounds.slice(),false);
 board.fullUpdate();
}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitBoard).observe(box);
window.addEventListener('resize',fitBoard);
window.addEventListener('pageshow',fitBoard);
window.addEventListener('message',function(e){if(e.source===window.parent&&e.data&&
 e.data.protocol==='jsxgraph-quarto-assessment'&&e.data.type==='layout')fitBoard();});
fitBoard();
```

Dra P for å utforske komponentene. Blå pil er vektoren og grønne piler er komponentene. Oppgave 1 gjelder P = (4, 3) m.


```{math-exercise}
#| label: b2-1-1
#| caption: Lengde og vinkel
#| field-labels: Vektorlengde i m, Vinkel fra positiv x-akse i grader
#| mode: numeric
#| decplaces: 1
#| partial-credit: true
#| context: b2-conventions, b2-1-context

Svar med 1 desimal.

$|\vec s|=$ __[5] m. $\theta=$ __[atan(3/4)*180/pi] grader.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Pytagoras gir $|\vec s|=\sqrt{4^2+3^2}=5.0\,\mathrm m$.
Vektoren ligger i første kvadrant, og
$\theta=\arctan(3/4)=36.9^\circ$ over positiv $x$-akse.
Vi kan også bruke $\theta=\arccos(4/5)$.

</details>

### Oppgave 2 — posisjon, forflytning og tangent

::: {#b2-2-context .math-exercise-context}

Vi beskriver en bevegelse med
$$\vec r(t)=\bigl(15t,\;1.5+7t-4.905t^2\bigr),$$
der $t$ måles i sekunder og komponentene i meter. $P_1$ er posisjonen ved
$t_1=0.20\,\mathrm s$, og $P_2$ er posisjonen ved $t_2=0.70\,\mathrm s$.
Finn posisjonene, forflytningen, gjennomsnittshastigheten og de momentane
hastighetene. Tegn tangentretningene i begge punktene. Finn også banefarten i $P_1$.

*Den håndtegnede grafen og de avleste koordinatene i PDF-en stemmer ikke
med vektorfunksjonen der. Her er graf, punkter og svar beregnet fra
funksjonen ovenfor, med $g=9.81\,\mathrm{m/s^2}$.*

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-1.5, 8, 26, -1.5], physical=true;

document.documentElement.lang='nb';
var box=document.querySelector('.jxgbox'),board=null;
var ink='#243447',blue='#1565c0',red='#b3263e',green='#217346';
function line(a,b,color,dash,arrow){return board.create('segment',[a,b],{
 strokeColor:color||ink,strokeWidth:2,dash:dash||0,lastArrow:!!arrow,fixed:true,highlight:false});}
function txt(x,y,s,color){return board.create('text',[x,y,s],{
 fontSize:function(){return Math.max(10,Math.min(15,box.clientWidth/45));},
 strokeColor:color||ink,fixed:true,highlight:false});}
function curve(xs,ys,color){return board.create('curve',[xs,ys],{
 strokeColor:color||blue,strokeWidth:2.5,fixed:true,highlight:false});}
function point(x,y,name,color){return board.create('point',[x,y],{
 name:name||'',color:color||blue,size:3,fixed:true,label:{fontSize:12},highlight:false});}
function shade(points,color){return board.create('polygon',points,{
 vertices:{visible:false},borders:{visible:false},fillColor:color||'#e7b33b',fillOpacity:.3,
 fixed:true,highlight:false});}
function axes(xname,yname,dx,dy){
 board.create('axis',[[0,0],[function(){return board.getBoundingBox()[2]-20/board.unitX;},0]],{
 straightFirst:false,straightLast:false,firstArrow:false,lastArrow:true,
 ticks:{ticksDistance:dx,minorTicks:0,insertTicks:false,drawLabels:true,label:{fontSize:11}},fixed:true});
 board.create('axis',[[0,0],[0,function(){return board.getBoundingBox()[1]-20/board.unitY;}]],{
 straightFirst:false,straightLast:false,firstArrow:false,lastArrow:true,
 ticks:{ticksDistance:dy,minorTicks:0,insertTicks:false,drawLabels:true,label:{fontSize:11}},fixed:true});
 var font=function(){return Math.max(10,Math.min(15,box.clientWidth/45));};
 board.create('text',[function(){return board.getBoundingBox()[2]-12/board.unitX;},
  function(){return -28/board.unitY;},xname],
  {fontSize:font,anchorX:'right',anchorY:'bottom',fixed:true,highlight:false});
 board.create('text',[function(){return 20/board.unitX;},
  function(){return board.getBoundingBox()[1]-8/board.unitY;},yname],
  {fontSize:font,anchorX:'left',anchorY:'top',fixed:true,highlight:false});
}
function sample(fn,a,b,n,color){var xs=[],ys=[];for(var i=0;i<=n;i++){
 var t=a+(b-a)*i/n;var p=fn(t);xs.push(p[0]);ys.push(p[1]);}return curve(xs,ys,color);}

function draw(){

 axes('x (m)','y (m)',5,2);
 function y(t){return 1.5+7*t-4.905*t*t;}
 var end=(7+Math.sqrt(49+2*9.81*1.5))/9.81;
 sample(function(t){return[15*t,y(t)];},0,end,100,red);
 var p1=point(3,y(.2),'P₁'),p2=point(10.5,y(.7),'P₂');
 line([0,0],p1,ink,2,true);line([0,0],p2,ink,2,true);line(p1,p2,green,0,true);
 var s=board.create('slider',[[2,6.3],[17,6.3],[0,.4,end]],{tabindex:0,aria:{enabled:true,label:'Tid i sekunder. Bruk piltastene.'},name:'t (s)',digits:2,snapWidth:.01});
 var p=point(function(){return 15*s.Value();},function(){return y(s.Value());},'',red);
 line(p,[function(){return 15*s.Value()+.18*15;},function(){return y(s.Value())+.18*(7-9.81*s.Value());}],blue,0,true);


}

function fitBoard(){
 var w=box.clientWidth,h=box.clientHeight;
 if(!(w>0&&h>0))return;
 if(!board){
  board=JXG.JSXGraph.initBoard(box.id,{boundingbox:bounds.slice(),axis:false,
   keepaspectratio:physical,showNavigation:false,showCopyright:false,
   pan:{enabled:false},zoom:{enabled:false},resize:{enabled:false}});
  board.suspendUpdate();draw();board.unsuspendUpdate();
 }
 if(board.canvasWidth!==w||board.canvasHeight!==h)board.resizeContainer(w,h,true);
 if(physical){
  var scale=Math.min(w/(bounds[2]-bounds[0]),h/(bounds[1]-bounds[3]));
  var cx=(bounds[0]+bounds[2])/2,cy=(bounds[1]+bounds[3])/2;
  board.setBoundingBox([cx-w/(2*scale),cy+h/(2*scale),cx+w/(2*scale),cy-h/(2*scale)],true);
 }else board.setBoundingBox(bounds.slice(),false);
 board.fullUpdate();
}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitBoard).observe(box);
window.addEventListener('resize',fitBoard);
window.addEventListener('pageshow',fitBoard);
window.addEventListener('message',function(e){if(e.source===window.parent&&e.data&&
 e.data.protocol==='jsxgraph-quarto-assessment'&&e.data.type==='layout')fitBoard();});
fitBoard();
```

Gjenskapt bane for den oppgitte vektorfunksjonen. Flytt tiden: den blå hastighetspilen er tangent til banen og har skalert lengde. Grønn pil er forflytningen fra P₁ til P₂.


```{math-exercise}
#| label: b2-2-1
#| caption: a · Posisjonsvektorer
#| field-labels: r1 x i m, r1 y i m, r2 x i m, r2 y i m
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-2-context

Svar med 2 desimaler.

$\vec r_1=($ __[3] $,\;$ __[1.5+7*.2-4.905*.2^2] $)$ m.

$\vec r_2=($ __[10.5] $,\;$ __[1.5+7*.7-4.905*.7^2] $)$ m.
```

```{math-exercise}
#| label: b2-2-2
#| caption: b · Forflytning og gjennomsnittshastighet
#| field-labels: Forflytning x i m, Forflytning y i m, Gjennomsnittshastighet x i m/s, Gjennomsnittshastighet y i m/s
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-2-context

Svar med 2 desimaler.

$\Delta\vec r=($ __[7.5] $,\;$ __[7*(.7-.2)-4.905*(.7^2-.2^2)] $)$ m.

$\bar{\vec v}=($ __[15] $,\;$ __[7-4.905*(.7+.2)] $)$ m/s.
```

```{math-exercise}
#| label: b2-2-3
#| caption: c · Hastighetsfunksjon
#| field-labels: Hastighetsfunksjon x, Hastighetsfunksjon y
#| mode: equivalent
#| vars: t
#| partial-credit: true
#| context: b2-conventions, b2-2-context

Deriver hver komponent og skriv formler med `t`:

$v_x(t)=$ __[15] m/s. $v_y(t)=$ ___[7-9.81*t] m/s.
```

```{math-exercise}
#| label: b2-2-4
#| caption: d · Tangentvektorer og banefart
#| field-labels: v1 x i m/s, v1 y i m/s, v2 x i m/s, v2 y i m/s, Banefart i P1 i m/s
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-2-context

Svar med 2 desimaler.

$\vec v_1=($ __[15] $,\;$ __[7-9.81*.2] $)$ m/s.

$\vec v_2=($ __[15] $,\;$ __[7-9.81*.7] $)$ m/s.

Banefart i $P_1$: $v_1=$ __[sqrt(15^2+(7-9.81*.2)^2)] m/s.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

**a)** Innsetting gir $\vec r_1=(3.0000,2.7038)\,\mathrm m$ og
$\vec r_2=(10.5000,3.99655)\,\mathrm m$.

**b)** Sluttposisjon minus startposisjon gir
$\Delta\vec r=(7.5000,1.29275)\,\mathrm m$.
Siden $\Delta t=0.50\,\mathrm s$, er
$\bar{\vec v}=(15.0000,2.5855)\,\mathrm{m/s}$.
Bruk uavrundede koordinater når du regner videre.

**c)** $\vec v(t)=(15,7-9.81t)\,\mathrm{m/s}$.

**d)** $\vec v_1=(15,5.038)\,\mathrm{m/s}$ og
$\vec v_2=(15,0.133)\,\mathrm{m/s}$. Begge tangentene peker mot høyre og
oppover; i $P_2$ er tangenten nesten vannrett. Toppunktet nås først ved
$t=7/9.81\approx0.714\,\mathrm s$.
Banefarten i $P_1$ er
$\sqrt{15^2+5.038^2}=15.82\,\mathrm{m/s}$.
Akselerasjonen til denne modellen er $\vec a=(0,-9.81)\,\mathrm{m/s^2}$.

</details>

### Oppgave 3 — bil i en sving

::: {#b2-3-context .math-exercise-context}

En bil har først hastighetsvektoren
$\vec v_1=(12,0)\,\mathrm{m/s}$. Etter $3.0\,\mathrm s$ er den
$\vec v_2=(0,-12)\,\mathrm{m/s}$. Finn gjennomsnittsakselerasjonens
komponenter og lengde. Positiv $x$ er mot høyre og positiv $y$ oppover.
Det spørres om gjennomsnittsakselerasjonen, ikke den momentane akselerasjonen
på et bestemt sted i svingen.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-4, 5, 17, -16], physical=true;

document.documentElement.lang='nb';
var box=document.querySelector('.jxgbox'),board=null;
var ink='#243447',blue='#1565c0',red='#b3263e',green='#217346';
function line(a,b,color,dash,arrow){return board.create('segment',[a,b],{
 strokeColor:color||ink,strokeWidth:2,dash:dash||0,lastArrow:!!arrow,fixed:true,highlight:false});}
function txt(x,y,s,color){return board.create('text',[x,y,s],{
 fontSize:function(){return Math.max(10,Math.min(15,box.clientWidth/45));},
 strokeColor:color||ink,fixed:true,highlight:false});}
function curve(xs,ys,color){return board.create('curve',[xs,ys],{
 strokeColor:color||blue,strokeWidth:2.5,fixed:true,highlight:false});}
function point(x,y,name,color){return board.create('point',[x,y],{
 name:name||'',color:color||blue,size:3,fixed:true,label:{fontSize:12},highlight:false});}
function shade(points,color){return board.create('polygon',points,{
 vertices:{visible:false},borders:{visible:false},fillColor:color||'#e7b33b',fillOpacity:.3,
 fixed:true,highlight:false});}
function axes(xname,yname,dx,dy){
 board.create('axis',[[0,0],[function(){return board.getBoundingBox()[2]-20/board.unitX;},0]],{
 straightFirst:false,straightLast:false,firstArrow:false,lastArrow:true,
 ticks:{ticksDistance:dx,minorTicks:0,insertTicks:false,drawLabels:true,label:{fontSize:11}},fixed:true});
 board.create('axis',[[0,0],[0,function(){return board.getBoundingBox()[1]-20/board.unitY;}]],{
 straightFirst:false,straightLast:false,firstArrow:false,lastArrow:true,
 ticks:{ticksDistance:dy,minorTicks:0,insertTicks:false,drawLabels:true,label:{fontSize:11}},fixed:true});
 var font=function(){return Math.max(10,Math.min(15,box.clientWidth/45));};
 board.create('text',[function(){return board.getBoundingBox()[2]-12/board.unitX;},
  function(){return -28/board.unitY;},xname],
  {fontSize:font,anchorX:'right',anchorY:'bottom',fixed:true,highlight:false});
 board.create('text',[function(){return 20/board.unitX;},
  function(){return board.getBoundingBox()[1]-8/board.unitY;},yname],
  {fontSize:font,anchorX:'left',anchorY:'top',fixed:true,highlight:false});
}
function sample(fn,a,b,n,color){var xs=[],ys=[];for(var i=0;i<=n;i++){
 var t=a+(b-a)*i/n;var p=fn(t);xs.push(p[0]);ys.push(p[1]);}return curve(xs,ys,color);}

function draw(){

 line([0,0],[12,0],blue,0,true);line([0,0],[0,-12],green,0,true);
 line([12,0],[0,-12],red,0,true);
 txt(3,1.3,'v₁ = (12, 0) m/s',blue);txt(1,-12.8,'v₂ = (0, −12) m/s',green);
 txt(6,-7,'Δv = v₂ − v₁',red);

}

function fitBoard(){
 var w=box.clientWidth,h=box.clientHeight;
 if(!(w>0&&h>0))return;
 if(!board){
  board=JXG.JSXGraph.initBoard(box.id,{boundingbox:bounds.slice(),axis:false,
   keepaspectratio:physical,showNavigation:false,showCopyright:false,
   pan:{enabled:false},zoom:{enabled:false},resize:{enabled:false}});
  board.suspendUpdate();draw();board.unsuspendUpdate();
 }
 if(board.canvasWidth!==w||board.canvasHeight!==h)board.resizeContainer(w,h,true);
 if(physical){
  var scale=Math.min(w/(bounds[2]-bounds[0]),h/(bounds[1]-bounds[3]));
  var cx=(bounds[0]+bounds[2])/2,cy=(bounds[1]+bounds[3])/2;
  board.setBoundingBox([cx-w/(2*scale),cy+h/(2*scale),cx+w/(2*scale),cy-h/(2*scale)],true);
 }else board.setBoundingBox(bounds.slice(),false);
 board.fullUpdate();
}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitBoard).observe(box);
window.addEventListener('resize',fitBoard);
window.addEventListener('pageshow',fitBoard);
window.addEventListener('message',function(e){if(e.source===window.parent&&e.data&&
 e.data.protocol==='jsxgraph-quarto-assessment'&&e.data.type==='layout')fitBoard();});
fitBoard();
```

Hastighetsvektorene tegnet fra felles utgangspunkt. Den røde pilen er endringen i hastighet, ikke bilens bane.


```{math-exercise}
#| label: b2-3-1
#| caption: Gjennomsnittsakselerasjon
#| field-labels: Gjennomsnittsakselerasjon x i m/s², Gjennomsnittsakselerasjon y i m/s², Lengden av gjennomsnittsakselerasjonen i m/s²
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-3-context

Svar med 2 desimaler.

$\bar{\vec a}=($ __[-4] $,\;$ __[-4] $)$ m/s². $|\bar{\vec a}|=$ __[sqrt(32)] m/s².
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

$$\bar{\vec a}=\frac{(0,-12)-(12,0)}{3.0}=(-4,-4)\,\mathrm{m/s^2}.$$
Lengden er $\sqrt{(-4)^2+(-4)^2}=5.66\,\mathrm{m/s^2}$, og retningen er
nedover mot venstre. Selv om start- og sluttfarten begge er
$12\,\mathrm{m/s}$, har hastighetsvektoren endret seg.

</details>
