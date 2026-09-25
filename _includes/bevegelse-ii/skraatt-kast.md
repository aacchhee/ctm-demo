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

### Oppgave 6

#### kanonkule over sjøen

::: {#b2-6-context .math-exercise-context}

En kanonkule skytes ut med fart $30\,\mathrm{m/s}$ og vinkel
$20^\circ$ over horisontalplanet. Kula treffer sjøen $3.0\,\mathrm s$
senere. Se bort fra luftmotstand. Finn horisontal rekkevidde,
utskytingshøyde over sjøen og posisjonen til banens toppunkt.
Sett $x=0$ ved kanonen og $y=0$ ved sjøflaten.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-6, 32, 100, -8], physical=true;

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

 var a=20*Math.PI/180,vx=30*Math.cos(a),vy=30*Math.sin(a),h=.5*9.81*9-3*vy;
 line([-3,0],[95,0],blue);txt(55,-3,'Sjønivå y = 0',blue);
 line([0,0],[0,h],ink);txt(-4,h/2,'h₀');
 sample(function(t){return[vx*t,h+vy*t-4.905*t*t];},0,3,100,red);
 var s=board.create('slider',[[5,28],[65,28],[0,1,3]],{tabindex:0,aria:{enabled:true,label:'Tid i sekunder. Bruk piltastene.'},name:'t (s)',digits:2,snapWidth:.01});
 var p=point(function(){return vx*s.Value();},function(){return h+vy*s.Value()-4.905*s.Value()*s.Value();},'',red);
 line(p,[function(){return vx*s.Value()+.3*vx;},function(){return h+vy*s.Value()-4.905*s.Value()*s.Value()+.3*(vy-9.81*s.Value());}],green,0,true);
 txt(5,22,'v₀ = 30 m/s, θ = 20°');

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

Kanonkulens bane med sjøen som nullnivå. Flytt tiden mellom utskyting og landing. Grønn pil viser skalert hastighet.


```{math-exercise}
#| label: b2-6-1
#| caption: a–b · Rekkevidde og utskytingshøyde
#| field-labels: Horisontal rekkevidde i m, Utskytingshøyde over sjøen i m
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-6-context

Svar med 2 desimaler.

$x_\mathrm{landing}=$ __[30*cos(pi/9)*3] m. $y_0=$ __[.5*9.81*3^2-30*sin(pi/9)*3] m.
```

```{math-exercise}
#| label: b2-6-2
#| caption: c · Toppunktet
#| field-labels: Tid til toppunkt i s, Horisontal avstand til toppunkt i m, Maksimal høyde over sjøen i m
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-6-context

Svar med 2 desimaler.

$t_\mathrm{topp}=$ __[30*sin(pi/9)/9.81] s.

$x_\mathrm{topp}=$ __[30*cos(pi/9)*30*sin(pi/9)/9.81] m.

$y_\mathrm{maks}=$ __[.5*9.81*3^2-30*sin(pi/9)*3+(30*sin(pi/9))^2/(2*9.81)] m over sjøen.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

**a)** Startkomponentene er
$v_{0x}=30\cos20^\circ=28.1908\ldots\,\mathrm{m/s}$ og
$v_{0y}=30\sin20^\circ=10.2606\ldots\,\mathrm{m/s}$.
Rekkevidden er $x=v_{0x}\cdot3.0=84.57\,\mathrm m$.

**b)** Ved landing er $y=0$, så
$0=y_0+v_{0y}\cdot3.0-\tfrac12g(3.0)^2$.
Dermed $y_0=13.36\,\mathrm m$.

**c)** På toppen er $v_y=0$, mens $v_x$ fortsatt er positiv.
$t_\mathrm{topp}=v_{0y}/g=1.05\,\mathrm s$.
Med uavrundet tid blir $x_\mathrm{topp}=v_{0x}t_\mathrm{topp}=29.49\,\mathrm m$.
Høyden over sjøen er
$y_\mathrm{maks}=y_0+v_{0y}^2/(2g)=18.73\,\mathrm m$.
Det siste tillegget er høydeøkningen **over kanonen**, ikke over sjøen.

</details>

### Oppgave 7

#### ball fra hånda

::: {#b2-7-context .math-exercise-context}

En ball kastes med startfart $12.0\,\mathrm{m/s}$ fra
$1.80\,\mathrm m$ over bakken, i vinkel $35^\circ$ over horisontalen.
Se bort fra luftmotstand. Finn flygetiden, horisontal rekkevidde og den
rette avstanden fra startpunkt til landingspunkt. Den siste er lengden
av forflytningsvektoren, **ikke** lengden langs den krumme banen.
Finn også høyden over bakken når banefarten er $11.0\,\mathrm{m/s}$.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-1, 8, 20, -2], physical=true;

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

 var vx=12*Math.cos(35*Math.PI/180),vy=12*Math.sin(35*Math.PI/180),h=1.8;
 var T=(vy+Math.sqrt(vy*vy+2*9.81*h))/9.81;
 line([-.5,0],[19,0],ink);line([0,0],[0,h],ink);txt(-.7,1,'1,80 m');
 sample(function(t){return[vx*t,h+vy*t-4.905*t*t];},0,T,100,red);
 line([0,h],[vx*T,0],ink,2);
 var s=board.create('slider',[[1,6.5],[13,6.5],[0,.6,T]],{tabindex:0,aria:{enabled:true,label:'Tid i sekunder. Bruk piltastene.'},name:'t (s)',digits:2,snapWidth:.01});
 var p=point(function(){return vx*s.Value();},function(){return h+vy*s.Value()-4.905*s.Value()*s.Value();},'',red);
 line(p,[function(){return vx*s.Value()+.15*vx;},function(){return h+vy*s.Value()-4.905*s.Value()*s.Value()+.15*(vy-9.81*s.Value());}],blue,0,true);
 txt(4,-1,'Horisontal rekkevidde langs bakken');

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

Ballkast fra hånda. Rød kurve er banen, stiplet linje er den rette forbindelsen mellom start og landing. Hastighetspilen er skalert.


```{math-exercise}
#| label: b2-7-1
#| caption: a · Flygetid
#| field-labels: Flygetid i s
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-7-context

Svar med 2 desimaler.

$t_\mathrm{landing}=$ __[(12*sin(35*pi/180)+sqrt((12*sin(35*pi/180))^2+2*9.81*1.8))/9.81] s.
```

```{math-exercise}
#| label: b2-7-2
#| caption: b · To ulike avstander
#| field-labels: Horisontal rekkevidde i m, Lengden av forflytningsvektoren i m
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-7-context

Svar med 2 desimaler.

Horisontal rekkevidde: $R=$ __[12*cos(35*pi/180)*(12*sin(35*pi/180)+sqrt((12*sin(35*pi/180))^2+2*9.81*1.8))/9.81] m.

Lengde av forflytningsvektoren: $|\Delta\vec r|=$ __[sqrt((12*cos(35*pi/180)*(12*sin(35*pi/180)+sqrt((12*sin(35*pi/180))^2+2*9.81*1.8))/9.81)^2+1.8^2)] m.
```

```{math-exercise}
#| label: b2-7-3
#| caption: c · Høyde ved gitt banefart
#| field-labels: Høyde når banefarten er 11 m/s i m
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-7-context

Svar med 2 desimaler.

$y=$ __[1.8+(12^2-11^2)/(2*9.81)] m over bakken.
```

```{math-exercise}
#| label: b2-7-4
#| caption: c · Hvor mange ganger?
#| field-labels: Antall tidspunkter med banefart 11 m/s
#| mode: equivalent
#| partial-credit: true
#| context: b2-conventions, b2-7-context

Hvor mange ganger etter utskytingen og før landing har ballen denne farten?
Skriv et heltall: __[2]. Begrunn med bevegelsen opp og ned.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

**a)** $v_{0y}=12\sin35^\circ=6.88292\ldots\,\mathrm{m/s}$.
Likningen for bakken er $0=1.80+v_{0y}t-4.905t^2$.
Den positive roten er
$$t=\frac{v_{0y}+\sqrt{v_{0y}^2+2g\cdot1.80}}{g}
=1.62858\ldots\,\mathrm s\approx1.63\,\mathrm s.$$
Den negative roten beskriver ikke flygetiden etter kastet.

**b)** $v_{0x}=12\cos35^\circ=9.82982\ldots\,\mathrm{m/s}$.
Da er $R=v_{0x}t=16.01\,\mathrm m$, og
$|\Delta\vec r|=\sqrt{R^2+(-1.80)^2}=16.11\,\mathrm m$.
Originalens flygetid $1.595\,\mathrm s$ og de påfølgende lengdene er
regnefeil; verdiene her følger den oppgitte andregradslikningen.

**c)** Fra $v_y^2=v_{0y}^2-2g(y-y_0)$ og konstant $v_x$ får vi
$v^2=v_0^2-2g(y-y_0)$, altså
$$y=y_0+\frac{v_0^2-v^2}{2g}
=1.80+\frac{12^2-11^2}{2\cdot9.81}=2.97\,\mathrm m.$$
Dette kan også utledes fra energibevaring:
$\tfrac12mv_0^2+mgy_0=\tfrac12mv^2+mgy$.
På vei opp og på vei ned har ballen samme banefart i samme høyde.
Her skjer det ved omtrent $t=0.20\,\mathrm s$ og $t=1.20\,\mathrm s$.

</details>

::::
