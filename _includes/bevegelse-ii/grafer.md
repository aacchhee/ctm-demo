## Bevegelsesfunksjoner og grafer

I én dimensjon med konstant akselerasjon er
$$v(t)=v_0+at,\qquad s(t)=s_0+v_0t+\frac12at^2.$$
Hastighetsgrafen er en rett linje med stigningstall $a$ og konstantledd $v_0$.
Posisjonsgrafen er en parabel når $a\ne0$.

| Fra grafen | Fysisk betydning |
|---|---|
| Stigningstallet til $s(t)$ | Hastighet $v(t)=s'(t)$ |
| Stigningstallet til $v(t)$ | Akselerasjon $a(t)=v'(t)$ |
| Areal med fortegn under $v(t)$ | Forflytning $\Delta s$ |
| Areal under $|v(t)|$ | Tilbakelagt strekning |
| Areal med fortegn under $a(t)$ | Hastighetsendring $\Delta v$ |

Sammenhengen mellom posisjon og hastighet kan også skrives
$$s(t_2)-s(t_1)=\int_{t_1}^{t_2}v(t)\,dt.$$
Under tidsaksen teller arealet negativt i forflytningen. For strekning
summerer vi positive arealer, også når bevegelsen snur.

### Oppgave 11 — bil med konstant akselerasjon

::: {#b2-11-context .math-exercise-context}

Fartsgrafen til en bil er en rett linje fra
$(t,v)=(0\,\mathrm s,10\,\mathrm{m/s})$ til
$(5\,\mathrm s,15\,\mathrm{m/s})$.
Finn stigningstall, konstantledd, akselerasjon, startfart og et uttrykk
for $v(t)$ med $t$ i sekunder.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-0.6, 18, 6.2, -3], physical=false;

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

 axes('t (s)','v (m/s)',1,5);line([0,10],[5,15],blue);point(0,10,'');point(5,15,'');
 line([5,0],[5,15],ink,2);line([0,15],[5,15],ink,2);

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

Rett fartsgraf fra 10 m/s ved t = 0 til 15 m/s ved t = 5 s.


```{math-exercise}
#| label: b2-11-1
#| caption: a–b · Tolk grafen
#| field-labels: Stigningstall i m/s², Konstantledd i m/s, Akselerasjon i m/s², Startfart i m/s
#| mode: numeric
#| decplaces: 1
#| partial-credit: true
#| context: b2-conventions, b2-11-context

Svar med 1 desimal.

Stigningstall: __[1] m/s². Konstantledd: __[10] m/s.

Akselerasjon: $a=$ __[1] m/s². Startfart: $v_0=$ __[10] m/s.
```

```{math-exercise}
#| label: b2-11-2
#| caption: c · Hastighetsfunksjon
#| field-labels: Hastighet som funksjon av t
#| mode: equivalent
#| vars: t
#| partial-credit: true
#| context: b2-conventions, b2-11-context

$v(t)=$ ___[10+t] m/s.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Stigningstallet er
$a=(15-10)/(5-0)=1.0\,\mathrm{m/s^2}$.
Skjæringen med den vertikale aksen er $v_0=10.0\,\mathrm{m/s}$.
Dermed $v(t)=10+t$ når $t$ måles i sekunder og $v$ i m/s.

</details>

### Oppgave 12 — sykkel som bremser

::: {#b2-12-context .math-exercise-context}

Posisjonsgrafen beskriver en sykkel med konstant akselerasjon.
Grafen går gjennom $(0,2)$, $(2,10)$ og $(4,14)$, med tid i sekunder og
posisjon i meter. Tangenten ved $t=2\,\mathrm s$ går gjennom hjelpepunktene
$(1,7)$ og $(3,13)$. Tangenten ved $t=4\,\mathrm s$ går gjennom
hjelpepunktene $(0,10)$ og $(5,15)$. Hjelpepunktene ligger på tangentene,
og trenger ikke ligge på selve posisjonsgrafen.
Finn grafisk hastigheten ved $t=2\,\mathrm s$ og akselerasjonen.
Flytt tidsregulatoren for å se hvordan tangenten endrer seg.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-0.8, 19, 6.6, -3], physical=false;

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

 axes('t (s)','s (m)',1,2);
 function pos(t){return 2+5*t-.5*t*t;}
 sample(function(t){return[t,pos(t)];},0,5,100,red);
 var s=board.create('slider',[[.5,17],[4.5,17],[0,2,5]],{tabindex:0,aria:{enabled:true,label:'Tid i sekunder. Bruk piltastene.'},name:'t (s)',digits:1,snapWidth:.1});
 line([0,function(){return pos(s.Value())-(5-s.Value())*s.Value();}],
      [5,function(){return pos(s.Value())+(5-s.Value())*(5-s.Value());}],blue);
 point(function(){return s.Value();},function(){return pos(s.Value());},'',blue);
 line([0,10],[5,15],green,2);txt(3.1,10.5,'Grønn tangent: t = 4 s',green);

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

Flytt tidsregulatoren og les stigningen til den blå tangenten. Den grønne tangenten ved t = 4 s er vist til sammenligning.


```{math-exercise}
#| label: b2-12-1
#| caption: Hastighet og akselerasjon fra tangenter
#| field-labels: Hastighet ved 2 s i m/s, Hastighet ved 4 s i m/s, Akselerasjon i m/s²
#| mode: numeric
#| decplaces: 1
#| partial-credit: true
#| context: b2-conventions, b2-12-context

Svar med 1 desimal.

$v(2)=$ __[3] m/s. $v(4)=$ __[1] m/s. $a=$ __[-1] m/s².
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Hastighet er stigningstallet til posisjonsgrafen.
Ved $t=2$ gir tangentens hjelpepunkter
$v(2)=(13-7)/(3-1)=3.0\,\mathrm{m/s}$.
Ved $t=4$ får vi $v(4)=(15-10)/(5-0)=1.0\,\mathrm{m/s}$.
Akselerasjonen er konstant:
$$a=\frac{v(4)-v(2)}{4-2}=\frac{1-3}{2}=-1.0\,\mathrm{m/s^2}.$$
En funksjon som beskriver den gjenskapte grafen er
$s(t)=2+5t-\tfrac12t^2$, med $v(t)=5-t$ for $0\le t\le5$.
Den negative akselerasjonen gjør at den positive hastigheten avtar.

</details>

### Oppgave 13 — forflytning som et areal

::: {#b2-13-context .math-exercise-context}

Vi vil finne forflytningen fra $t_1=0.60\,\mathrm s$ til
$t_2=1.40\,\mathrm s$. Bruk de avrundede grafavlesningene
$v_1=0.15\,\mathrm{m/s}$ og $v_2=1.05\,\mathrm{m/s}$ og anta at
hastigheten øker lineært mellom punktene. Figuren viser denne
avlesningsmodellen. Finn forflytningen fra arealet og kontroller med
bevegelseslikningen. Bruk uavrundet akselerasjon i kontrollen.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-0.2, 1.6, 1.85, -0.28], physical=false;

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

 axes('t (s)','v (m/s)',.2,.3);
 function v(t){return .15+1.125*(t-.6);}
 shade([[.6,0],[1.4,0],[1.4,1.05],[.6,.15]],'#e7b33b');
 sample(function(t){return[t,v(t)];},.47,1.7,50,red);
 line([.6,0],[.6,.15],ink,2);line([1.4,0],[1.4,1.05],ink,2);
 line([.6,.15],[1.4,.15],green,2);
 point(.6,.15,'');point(1.4,1.05,'');txt(.7,1.3,'Areal = forflytning');

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

Gult areal er forflytningen fra 0,60 s til 1,40 s i avlesningsmodellen. Den grønne linjen deler arealet i rektangel og trekant.


```{math-exercise}
#| label: b2-13-1
#| caption: Areal og akselerasjon
#| field-labels: Forflytning i m, Akselerasjon i m/s²
#| mode: numeric
#| decplaces: 3
#| partial-credit: true
#| context: b2-conventions, b2-13-context

Svar med 3 desimaler.

$\Delta s=$ __[(.15+1.05)/2*(1.4-.6)] m. $a=$ __[(1.05-.15)/(1.4-.6)] m/s².
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Arealet er et rektangel og en trekant:
$$\Delta s=v_1\Delta t+\frac{(v_2-v_1)\Delta t}{2}
=0.15\cdot0.80+\frac{(1.05-0.15)\cdot0.80}{2}
=0.120+0.360=0.480\,\mathrm m.$$
Det er også trapesarealet $(v_1+v_2)\Delta t/2$.
Akselerasjonen er $a=(1.05-0.15)/0.80=1.125\,\mathrm{m/s^2}$.
Kontrollen blir
$\Delta s=v_1\Delta t+\tfrac12a\Delta t^2=0.480\,\mathrm m$.

Måleskjermbildet i originalen viser også regresjonen
$v(t)=1.15t-0.528$. Bruker man denne framfor de avrundede avlesningene,
blir integralet $0.4976\,\mathrm m$. Forskjellen skyldes at man da bruker
en annen tilnærming til måledataene; denne oppgaven ber om avlesningsmodellen.

</details>

### Oppgave 14 — anslå arealet under en krum graf

::: {#b2-14-context .math-exercise-context}

Grafen viser en bils positive hastighet de første tre sekundene etter
et lyskryss. Anslå strekningen ved å dele arealet i ruter, rektangler eller
trapeser. Hver hovedrute har bredde $1\,\mathrm s$ og høyde $2\,\mathrm{m/s}$.

Den digitale kurven er en skjematisk gjengivelse av målegrafen.
Noen omtrentlige punkter $(t,v)$ er $(0,0)$, $(0.5,2.2)$, $(1,6.6)$,
$(1.5,7.8)$, $(2,8.0)$, $(2.5,10.5)$ og $(3,13.0)$, med SI-enheter.
Dette er en avlesningsoppgave; vi godtar et avvik på $2\,\mathrm m$
fra løsningsforslagets anslag. Det er ikke en oppgave om eksakt integrasjon.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-0.4, 15, 3.7, -2.5], physical=false;

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

 axes('t (s)','v (m/s)',1,2);
 var xs=[0,.25,.5,.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3];
 var ys=[0,.8,2.2,4.4,6.6,7.55,7.8,7.8,8,9.1,10.5,11.9,13];
 var ps=xs.map(function(x,i){return[x,ys[i]];});ps.push([3,0]);shade(ps,'#84bb9b');
 for(var i=1;i<=3;i++)line([i,0],[i,14],'#cad2db');
 for(var j=2;j<=14;j+=2)line([0,j],[3,j],'#cad2db');
 curve(xs,ys,green);

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

Skjematisk gjengivelse av fartsgrafen. Tell hele og delvise hovedruter; hver rute representerer 2 m.


```{math-exercise}
#| label: b2-14-1
#| caption: Strekning fra et anslag
#| field-labels: Anslått strekning i m
#| mode: numeric
#| tolerance: 2
#| partial-credit: true
#| context: b2-conventions, b2-14-context

Svar med 0 desimaler.

$s\approx$ __[22] m.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Hver hovedrute representerer
$1\,\mathrm s\cdot2\,\mathrm{m/s}=2\,\mathrm m$.
I originalgrafen kan vi samle hele og delvise ruter til omtrent 11 ruter.
Dermed er $s\approx11\cdot2\,\mathrm m=22\,\mathrm m$.
Andre rimelige inndelinger i trapeser gir omtrent samme størrelse.
Den gjenskapte kurven har et areal på omtrent $21\,\mathrm m$;
derfor brukes en toleranse på $2\,\mathrm m$, ikke en eksakt fasit.
Siden hastigheten er positiv hele tiden, er strekning og forflytning like.

</details>
