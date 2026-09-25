:::: {.panel-tabset}

### Kort teori

Ved konstant akselerasjon kan vi regne i hver koordinatretning for seg.
For $i=x$ eller $i=y$ gjelder
$$v_i=v_{0i}+a_it,\qquad
\Delta r_i=v_{0i}t+\frac12a_it^2,\qquad
\Delta r_i=\frac{v_{0i}+v_i}{2}t,\qquad
v_i^2=v_{0i}^2+2a_i\Delta r_i.$$
Her er $\Delta r_i=r_i-r_{0i}$ en **forflytning**, med fortegn.

Når tyngdekraften er eneste kraft og $y$ er positiv oppover, blir
$a_x=0$ og $a_y=-g$. Med startfart $v_0$ og vinkel $\theta$ over horisontalen:
$$v_{0x}=v_0\cos\theta,\qquad v_{0y}=v_0\sin\theta,$$
$$x(t)=x_0+v_0\cos\theta\,t,\qquad
y(t)=y_0+v_0\sin\theta\,t-\frac12gt^2,$$
$$v_x(t)=v_0\cos\theta,\qquad v_y(t)=v_0\sin\theta-gt.$$
Ved horisontalt kast er $\theta=0$ og $v_{0y}=0$.
Finn tiden fra den retningen du har nok informasjon om; bruk deretter
samme tid i den andre retningen. Velg løsningen med $t\ge0$ som tilhører
bevegelsen etter utskytingen.

### Oppgave 4

#### kule fra en kant

::: {#b2-4-context .math-exercise-context}

Ei kule ruller horisontalt utfor en kant med fart $10.0\,\mathrm{m/s}$.
Flygetiden fram til det horisontale gulvet er $5.0\,\mathrm s$.
Se bort fra luftmotstand. Hvor langt fra kanten lander kula, målt
horisontalt? Dette er et idealisert regneeksempel; høyden er ikke gitt.

:::

```{math-exercise}
#| label: b2-4-1
#| caption: Horisontal rekkevidde
#| field-labels: Horisontal rekkevidde i m
#| mode: numeric
#| decplaces: 1
#| partial-credit: true
#| context: b2-conventions, b2-4-context

Svar med 1 desimal.

$x=$ __[50] m.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Det er ingen akselerasjon horisontalt, så
$x=v_xt=10.0\cdot5.0=50.0\,\mathrm m$.
Dette svarer til alternativ D i originalens flervalgsoppgave.
Tyngden endrer den vertikale hastigheten, men ikke den horisontale.

</details>

### Oppgave 5

#### kule fra et bord

::: {#b2-5-context .math-exercise-context}

En kule ruller horisontalt utfor et bord med fart $3.0\,\mathrm{m/s}$.
Den lander $1.2\,\mathrm m$ fra bordkanten, målt vannrett.
Finn bordhøyden, hastighetskomponentene ved landing, banefarten og vinkelen
under horisontalen. Se bort fra luftmotstand. Bruk positiv $y$ oppover;
landingshastigheten får derfor negativ $y$-komponent.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-0.25, 1.25, 1.9, -0.35], physical=true;

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

 var g=9.81,T=.4,h=.5*g*T*T;
 line([-.15,0],[1.7,0],ink);line([0,0],[0,h],ink);line([-.15,h],[0,h],ink);
 sample(function(t){return[3*t,h-.5*g*t*t];},0,T,80,red);
 var s=board.create('slider',[[.1,1.1],[1.2,1.1],[0,.2,T]],{tabindex:0,aria:{enabled:true,label:'Tid i sekunder. Bruk piltastene.'},name:'t (s)',digits:2,snapWidth:.01});
 var p=point(function(){return 3*s.Value();},function(){return h-.5*g*s.Value()*s.Value();},'',red);
 line(p,[function(){return 3*s.Value()+.04*3;},function(){return h-.5*g*s.Value()*s.Value()-.04*g*s.Value();}],blue,0,true);
 txt(.05,.55,'h');txt(.7,-.16,'1,2 m');txt(.13,.84,'v₀ = 3,0 m/s');

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

Kule fra bordet. Dra tiden for å følge kula og hastighetsretningen; den blå pilen har skalert lengde.


```{math-exercise}
#| label: b2-5-1
#| caption: a · Tid og bordhøyde
#| field-labels: Flygetid i s, Bordhøyde i m
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-5-context

Svar med 2 desimaler.

$t=$ __[1.2/3] s. $h=$ __[.5*9.81*(1.2/3)^2] m.
```

```{math-exercise}
#| label: b2-5-2
#| caption: b · Hastighet og retning ved landing
#| field-labels: Landingshastighet x i m/s, Landingshastighet y i m/s, Banefart ved landing i m/s, Vinkel under horisontalen i grader
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-5-context

Svar med 2 desimaler.

$\vec v=($ __[3] $,\;$ __[-9.81*.4] $)$ m/s.

$v=$ __[sqrt(3^2+(9.81*.4)^2)] m/s.

Vinkel **under** horisontalen: $\theta=$ __[atan(9.81*.4/3)*180/pi] grader.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

**a)** Horisontalt er $t=x/v_x=1.2/3.0=0.40\,\mathrm s$.
Vertikalt er $v_{0y}=0$ og $\Delta y=-h$, så
$h=\tfrac12gt^2=0.7848\,\mathrm m\approx0.78\,\mathrm m$.

**b)** $v_x=3.00\,\mathrm{m/s}$ og $v_y=-gt=-3.924\,\mathrm{m/s}$.
Dermed er $v=\sqrt{3^2+3.924^2}=4.94\,\mathrm{m/s}$.
Vinkelen under horisontalen er
$\theta=\arctan(|v_y|/v_x)=52.60^\circ$.
Negativ $v_y$ betyr bevegelse nedover i koordinatsystemet som brukes her.

</details>

::::
