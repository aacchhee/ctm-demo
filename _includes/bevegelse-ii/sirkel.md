:::: {.panel-tabset}

### Kort teori

Ved sirkelbevegelse med konstant banefart endres retningen til
hastighetsvektoren hele tiden. Hastigheten er tangent til banen, mens
akselerasjonen peker inn mot sentrum:
$$a_s=\frac{v^2}{r}.$$
Dette er sentripetalakselerasjonen. «Sentripetal» beskriver retningen;
det er den samlede kraften inn mot sentrum som gir denne akselerasjonen.

Omløpstiden $T$ er tiden for én hel runde. Siden strekningen er $2\pi r$,
får vi
$$v=\frac{2\pi r}{T},\qquad
 a_s=\frac{4\pi^2r}{T^2}.$$
Ved varierende banefart kommer en tangentiell akselerasjon i tillegg.
Figuren nedenfor viser tilfellet med konstant banefart.

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-4.2, 4.7, 5.8, -3.9], physical=true;

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

 var s=board.create('slider',[[-3,4],[2.8,4],[0,45,360]],{tabindex:0,aria:{enabled:true,label:'Posisjon på sirkelen i grader. Bruk piltastene.'},name:'φ (grader)',digits:0,snapWidth:1});
 function c(){return Math.cos(s.Value()*Math.PI/180);}
 function sn(){return Math.sin(s.Value()*Math.PI/180);}
 board.create('circle',[[0,0],2.3],{strokeColor:ink,strokeWidth:2,highlight:false,fixed:true});
 var p=point(function(){return 2.3*c();},function(){return 2.3*sn();},'',ink);
 line([0,0],p,ink,2);
 line(p,[function(){return 2.3*c()-1.5*sn();},function(){return 2.3*sn()+1.5*c();}],blue,0,true);
 line(p,[function(){return 1.2*c();},function(){return 1.2*sn();}],red,0,true);
 txt(2.8,2.1,'v: tangent',blue);txt(2.8,1.3,'a: innover',red);
 txt(-3,-3.2,'Konstant banefart, mot klokken');

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

Flytt punktet rundt sirkelen. Blå pil er tangentretningen og rød pil peker inn mot sentrum. Pilene er skalert hver for seg; de har ulike enheter.

### Oppgave 15

#### sleggekaster

::: {#b2-15-context .math-exercise-context}

Sleggekula følger en horisontal sirkelbane med konstant banefart.
Radien er $r=2.05\,\mathrm m$, og sentripetalakselerasjonen er
$a_s=14.2\,\mathrm{m/s^2}$. Finn banefarten.

:::

```{math-exercise}
#| label: b2-15-1
#| caption: Banefart
#| field-labels: Banefart i m/s
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-15-context

Svar med 2 desimaler.

$v=$ __[sqrt(14.2*2.05)] m/s.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Fra $a_s=v^2/r$ får vi
$v=\sqrt{a_sr}=\sqrt{14.2\cdot2.05}=5.40\,\mathrm{m/s}$.
Vi velger positiv rot fordi banefart er en størrelse uten fortegn.

</details>

### Oppgave 16

#### månen rundt jorda

::: {#b2-16-context .math-exercise-context}

Anta at månen går i en sirkelbane med radius
$r=3.84\cdot10^8\,\mathrm m$ og omløpstid $T=27.3$ døgn.
Månens masse er $m=7.35\cdot10^{22}\,\mathrm{kg}$.
Bruk $1$ døgn $=86400\,\mathrm s$.
Finn sentripetalakselerasjonen og kraften fra jorda på månen.
Bruk den forenklede modellen der jordas gravitasjon gir hele
sentripetalkraften, og se bort fra andre himmellegemer.

:::

```{math-exercise}
#| label: b2-16-1
#| caption: a · Sentripetalakselerasjon
#| field-labels: Månens sentripetalakselerasjon i m/s²
#| mode: numeric
#| decplaces: 5
#| partial-credit: true
#| context: b2-conventions, b2-16-context

Svar med 5 desimaler.

$a_s=$ __[4*pi^2*3.84e8/(27.3*86400)^2] m/s².
```

```{math-exercise}
#| label: b2-16-2
#| caption: b · Gravitasjonskraft
#| field-labels: Kraft dividert med 10^20 N
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-16-context

Svar med 2 desimaler.

Skriv $F=q\cdot10^{20}\,\mathrm N$: $q=$ __[7.35e22*4*pi^2*3.84e8/(27.3*86400)^2/1e20].
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

**a)** Omløpstiden i SI-enheter er
$T=27.3\cdot86400=2358720\,\mathrm s$.
Dermed
$$a_s=\frac{4\pi^2r}{T^2}
=\frac{4\pi^2\cdot3.84\cdot10^8}{2358720^2}
\approx0.00272\,\mathrm{m/s^2}.$$
**b)** Newtons andre lov gir $F=ma_s$.
Med uavrundet akselerasjon får vi
$F\approx2.00\cdot10^{20}\,\mathrm N$, rettet mot jorda.
Den avrundede verdien $1.99\cdot10^{20}\,\mathrm N$ i originalen følger
ikke av de oppgitte tallene uten ytterligere avrunding.

</details>

::::
