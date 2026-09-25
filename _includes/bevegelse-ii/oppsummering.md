:::: {.panel-tabset}

### Kort teori

Du skal kunne bytte mellom tekst, tabell, graf og likning for samme
bevegelse. Kontroller at de beskriver de samme startverdiene, enhetene og
retningene. En nyttig arbeidsrekkefølge er:

1. Velg akser, positiv retning og et nullnivå for høyden.
2. Del posisjon, hastighet og akselerasjon i komponenter.
3. Finn en felles tid som oppfyller begge bevegelseslikningene.
4. Kombiner komponentene når du trenger en lengde eller en retning.
5. Kontroller fortegn, enheter og om resultatet passer med grafen.

En oppgitt «fart» er en positiv størrelse. En hastighetskomponent kan være
negativ. Forflytning, rett avstand mellom endepunkter og tilbakelagt
strekning er forskjellige størrelser.

### Oppgave 17

#### ball fra et vindu

::: {#b2-17-context .math-exercise-context}

En ball kastes fra et vindu $6.0\,\mathrm m$ over bakken, med
startfart $5.0\,\mathrm{m/s}$ i vinkel $30^\circ$ over horisontalplanet.
Positiv $y$ er oppover, og bakken har $y=0$. Se bort fra luftmotstand.
Hvilken likning gir riktig tid til landing?

A: $6=5t+9.81t^2$.

B: $-6=5t-4.905t^2$.

C: $6=4t+4.905t^2$.

D: $-6=3t-4.905t^2$.

E: Ingen av A–D.

:::

```{math-exercise}
#| label: b2-17-1
#| caption: a · Velg likning
#| field-labels: Riktig alternativ A til E
#| mode: string_ci
#| partial-credit: true
#| context: b2-conventions, b2-17-context

Skriv bokstaven til riktig alternativ: __[E].
```

```{math-exercise}
#| label: b2-17-2
#| caption: b · Skriv høydefunksjonen
#| field-labels: Høyde som funksjon av t
#| mode: equivalent
#| vars: t
#| partial-credit: true
#| context: b2-conventions, b2-17-context

$y(t)=$ ___[6+2.5*t-4.905*t^2] m.
```

```{math-exercise}
#| label: b2-17-3
#| caption: c · Finn flygetiden
#| field-labels: Flygetid fra vinduet i s
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-17-context

Svar med 2 desimaler.

$T=$ __[(2.5+sqrt(2.5^2+2*9.81*6))/9.81] s.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Den vertikale startfarten er $v_{0y}=5\sin30^\circ=2.5\,\mathrm{m/s}$.
Riktig likning ved bakken er derfor
$$0=6+2.5t-4.905t^2\quad\text{eller}\quad-6=2.5t-4.905t^2.$$
Ingen av originalens fire alternativer har dette uttrykket. Derfor er E
lagt til i den digitale versjonen.
Den positive roten er $T=1.39\,\mathrm s$.
Det er $v_{0y}$, ikke hele startfarten, som skal stå foran $t$ i høydefunksjonen.

</details>

### Oppgave 18

#### snøklump fra et tak

::: {#b2-18-context .math-exercise-context}

En snøklump sklir av et tak og treffer bakken $2.7\,\mathrm m$
horisontalt fra takkanten. Se bort fra takutstikk, slik at takkanten ligger
rett over veggen. Ved landing er banefarten $11\,\mathrm{m/s}$, og
hastigheten peker $64^\circ$ **under** horisontalen.
Finn startfarten ved takkanten og takets helningsvinkel.
Anta at snøklumpen forlater taket langs takflaten nedover og at luftmotstand
kan neglisjeres. Velg $x$ utover fra veggen og $y$ oppover.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-2, 5.7, 4.6, -1.2], physical=true;

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

 var vx=11*Math.cos(64*Math.PI/180),vy=-11*Math.sin(64*Math.PI/180),T=2.7/vx;
 var v0y=vy+9.81*T,h=-v0y*T+4.905*T*T;
 line([0,0],[0,h],ink);line([-1.6,h+1.6*(-v0y/vx)],[0,h],ink);
 line([-.5,0],[4.2,0],ink);
 sample(function(t){return[vx*t,h+v0y*t-4.905*t*t];},0,T,80,red);
 line([0,h],[.18*vx,h+.18*v0y],blue,0,true);
 line([2.7,0],[2.7+.1*vx,.1*vy],green,0,true);
 line([2.7,0],[4,0],ink,2);txt(3.3,-.55,'64°',green);
 txt(.9,-.35,'2,7 m');txt(-1.5,3.3,'Tak');txt(.45,h+.3,'v₀',blue);

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

Snøklumpen forlater taket langs takflaten og lander 2,7 m fra veggen. Hastighetspilene har skalert lengde.


```{math-exercise}
#| label: b2-18-1
#| caption: a · Landingshastighet og flygetid
#| field-labels: Landingshastighet x i m/s, Landingshastighet y i m/s, Flygetid fra takkanten i s
#| mode: numeric
#| decplaces: 3
#| partial-credit: true
#| context: b2-conventions, b2-18-context

Svar med 3 desimaler.

$v_x=$ __[11*cos(64*pi/180)] m/s. $v_y=$ __[-11*sin(64*pi/180)] m/s.

$T=$ __[2.7/(11*cos(64*pi/180))] s.
```

```{math-exercise}
#| label: b2-18-2
#| caption: b · Startfart og takvinkel
#| field-labels: Startfart ved takkanten i m/s, Takets helningsvinkel i grader
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-18-context

Svar med 2 desimaler.

$v_0=$ __[sqrt((11*cos(64*pi/180))^2+(-11*sin(64*pi/180)+9.81*2.7/(11*cos(64*pi/180)))^2)] m/s.

Takets vinkel under horisontalen: $\phi=$ __[atan((11*sin(64*pi/180)-9.81*2.7/(11*cos(64*pi/180)))/(11*cos(64*pi/180)))*180/pi] grader.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

**a)** Dekomponer slutthastigheten:
$$v_x=11\cos64^\circ=4.82208\ldots\,\mathrm{m/s},\qquad
v_y=-11\sin64^\circ=-9.88673\ldots\,\mathrm{m/s}.$$
Horisontalt er hastigheten konstant, så
$T=2.7/v_x=0.559924\ldots\,\mathrm s$.

**b)** Vi har $v_{0x}=v_x$. Vertikalt er $v_y=v_{0y}-gT$, altså
$v_{0y}=v_y+gT=-4.39388\ldots\,\mathrm{m/s}$.
Dermed
$$v_0=\sqrt{v_{0x}^2+v_{0y}^2}=6.52\,\mathrm{m/s},\qquad
\phi=\arctan\!\left(\frac{|v_{0y}|}{v_{0x}}\right)=42.34^\circ.$$
Startretningen ligger under horisontalen. Fordi klumpen forlater taket
langs takflaten, er dette også takets helningsvinkel.

</details>

::::
