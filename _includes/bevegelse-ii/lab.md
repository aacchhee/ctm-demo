## Lab: fjærkanon

Ved en vertikal avfyring kan vi anslå utgangsfarten på to uavhengige
måter. Noter hvilket hakk fjæra presses inn til, og mål utskytingshøyden
$h_0$, største høyde $H$ og tiden $T$ fra utskyting til landing.
Mål alle høyder fra samme gulvnivå. Bruk samme fjærinnstilling når du
sammenligner kast.

Øvelsene nedenfor bruker målingene og valgene fra notatene, slik at svarene
kan kontrolleres. Etterpå kan du gjenta beregningene med egne målinger og
en selvvalgt vinkel. Modellen ser bort fra luftmotstand.

### Oppgave 8 — to måter å måle utgangsfarten på

::: {#b2-8-context .math-exercise-context}

Ved vertikal utskyting måles $h_0=0.20\,\mathrm m$,
$H=2.24\,\mathrm m$ og $T=1.18\,\mathrm s$ fram til landing på gulvet.
Bruk først bare tiden og utskytingshøyden, deretter bare høydene, for å
bestemme startfarten. Målingene gir to ulike estimater; de skal ikke tvinges
til å bli like. I de generelle uttrykkene er $g>0$, $T>0$ og $H>h_0$.

:::

```{math-exercise}
#| label: b2-8-1
#| caption: a–b · Generelle uttrykk
#| field-labels: Startfart uttrykt ved tid og utskytingshøyde, Startfart uttrykt ved høydeforskjell
#| mode: equivalent
#| vars: g, T, h_0, H
#| partial-credit: true
#| context: b2-conventions, b2-8-context

Bruk `g`, `T`, `h_0` og `H`. Skriv høydeuttrykket som én samlet kvadratrot.

Fra flygetiden: $v_{0,T}=$ ___[g*T/2-h_0/T].

Fra største høyde: $v_{0,H}=$ ___[sqrt(2*g*(H-h_0))].
```

```{math-exercise}
#| label: b2-8-2
#| caption: a–b · Måleserien
#| field-labels: Startfart fra tidsmåling i m/s, Startfart fra høydemåling i m/s
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-8-context

Svar med 2 desimaler.

$v_{0,T}=$ __[9.81*1.18/2-.2/1.18] m/s. $v_{0,H}=$ __[sqrt(2*9.81*(2.24-.2))] m/s.
```

```{math-exercise}
#| label: b2-8-3
#| caption: c · Tiden til toppunktet
#| field-labels: Kan tiden til toppen settes lik halve total flygetid
#| mode: equivalent
#| partial-credit: true
#| context: b2-conventions, b2-8-context

Kan tiden fra utskyting til toppunkt settes lik $T/2$ når ballen
lander lavere enn den ble skutt ut? 1 = ja, 2 = nei. Svar: __[2].
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

**a)** Ved landing er $y=0$:
$0=h_0+v_{0,T}T-\tfrac12gT^2$. Dermed
$$v_{0,T}=\frac{gT}{2}-\frac{h_0}{T}
=5.62\,\mathrm{m/s}.$$
Denne beregningen bruker ikke største høyde.

**b)** Ved toppunktet er farten null, og høydeøkningen er
$H-h_0=2.04\,\mathrm m$. Derfor
$$0=v_{0,H}^2-2g(H-h_0)\quad\Rightarrow\quad
v_{0,H}=\sqrt{2g(H-h_0)}=6.33\,\mathrm{m/s}.$$
Denne beregningen bruker ikke flygetiden. Ulikheten mellom estimatene kan
skyldes måleusikkerhet og avvik fra modellen; noter målemetode og vurder
hvilken måling som er mest usikker.

**c)** Nei. Ballen bruker like lang tid opp og ned **mellom de samme to
høydene**, men her ligger landingspunktet lavere enn utskytingspunktet.
Derfor kan ikke total flygetid halveres for å finne tiden til toppen.
Denne snarveien i originalnotatene er ikke gyldig for forsøksoppsettet.

</details>

### Oppgave 9 — skrått kast med en valgt vinkel

::: {#b2-9-context .math-exercise-context}

I det videre forsøket bruker vi den avrundede startfarten
$v_0=6.30\,\mathrm{m/s}$ som en ny, oppgitt verdi. Kula skytes fra
$h_0=0.20\,\mathrm m$ i vinkelen $1.00^\circ$ over horisontalen og lander
på gulvet. Finn flygetid og rekkevidde.
Appletens vinkel kan endres for utforsking; svarfeltene gjelder alltid
$1.00^\circ$. Se bort fra luftmotstand.

:::

```{.jsxgraph width="760" height="360" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/9;min-height:240px;border:0;"}
var bounds=[-0.5, 3, 5.3, -0.8], physical=true;

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

 var s=board.create('slider',[[.2,2.65],[3.6,2.65],[1,1,85]],{tabindex:0,aria:{enabled:true,label:'Utskytingsvinkel i grader. Bruk piltastene.'},name:'θ (grader)',digits:0,snapWidth:1});
 function vx(){return 6.3*Math.cos(s.Value()*Math.PI/180);}
 function vy(){return 6.3*Math.sin(s.Value()*Math.PI/180);}
 function T(){return(vy()+Math.sqrt(vy()*vy()+2*9.81*.2))/9.81;}
 var path=curve([],[],red);
 path.updateDataArray=function(){this.dataX=[];this.dataY=[];for(var i=0;i<=100;i++){
  var t=T()*i/100;this.dataX.push(vx()*t);this.dataY.push(.2+vy()*t-4.905*t*t);}};
 line([0,0],[5,0],ink);line([0,0],[0,.2],ink);point(0,.2,'');
 txt(.1,-.35,'h₀ = 0,20 m, v₀ = 6,30 m/s');
 txt(.1,2.25,'Prøv flere vinkler; oppgaven gjelder 1°.');

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

Utforsk rekkevidden med samme startfart og utskytingshøyde. Regulatoren gjelder oppgave 9; oppgave 10 har en annen start- og slutthøyde.


```{math-exercise}
#| label: b2-9-1
#| caption: Flygetid og rekkevidde
#| field-labels: Flygetid ved 1 grad i s, Rekkevidde ved 1 grad i m
#| mode: numeric
#| decplaces: 3
#| partial-credit: true
#| context: b2-conventions, b2-9-context

Svar med 3 desimaler.

$T=$ __[(6.3*sin(pi/180)+sqrt((6.3*sin(pi/180))^2+2*9.81*.2))/9.81] s.

$R=$ __[6.3*cos(pi/180)*(6.3*sin(pi/180)+sqrt((6.3*sin(pi/180))^2+2*9.81*.2))/9.81] m.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

Komponentene er $v_{0x}=6.30\cos1^\circ$ og
$v_{0y}=6.30\sin1^\circ$. Sett $y(T)=0$:
$$0=0.20+v_{0y}T-\tfrac12gT^2.$$
Den positive roten gir $T=0.213446\ldots\,\mathrm s\approx0.213\,\mathrm s$.
Rekkevidden blir $R=v_{0x}T=1.344507\ldots\,\mathrm m\approx1.345\,\mathrm m$.
For en annen vinkel brukes samme framgangsmåte; den vertikale startfarten
kan ikke settes lik null når vinkelen er forskjellig fra null.

</details>

### Oppgave 10 — velg vinkel for å treffe målet

::: {#b2-10-context .math-exercise-context}

Kula skal nå en horisontal rekkevidde $R=3.00\,\mathrm m$ med
startfart $v_0=6.30\,\mathrm{m/s}$. Nå ligger utskytingspunktet og
landingspunktet på **samme høyde**, $y_0=y=0$.
Finn begge utskytingsvinklene i intervallet $0<\theta<90^\circ$.
Se bort fra luftmotstand.

:::

```{math-exercise}
#| label: b2-10-1
#| caption: To utskytingsvinkler
#| field-labels: Minste utskytingsvinkel i grader, Største utskytingsvinkel i grader
#| mode: numeric
#| decplaces: 2
#| partial-credit: true
#| context: b2-conventions, b2-10-context

Svar med 2 desimaler.

Minste vinkel: $\theta_1=$ __[asin(3*9.81/6.3^2)*90/pi] grader.

Største vinkel: $\theta_2=$ __[90-asin(3*9.81/6.3^2)*90/pi] grader.
```

<details class="solution-block">
<summary>Løsningsforslag</summary>

For samme start- og slutthøyde er den ikke-null flygetiden
$T=2v_0\sin\theta/g$. Da blir
$$R=v_0\cos\theta\,T=\frac{v_0^2}{g}\sin(2\theta).$$
Altså er $\sin(2\theta)=Rg/v_0^2=0.7414966\ldots$.
De to løsningene er
$$\theta_1=\tfrac12\arcsin(Rg/v_0^2)=23.93^\circ,
\qquad \theta_2=90^\circ-\theta_1=66.07^\circ.$$
Originalen viser bare den lave vinkelen. Begge er mulige her, og den høye
banen gir lengre flygetid. Generelt er målet bare mulig dersom
$R\le v_0^2/g$ i denne modellen.

</details>
