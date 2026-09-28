```{.jsxgraph assessment_id="stack-tangent-board" width="760" height="480" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/12;min-height:360px;border:1px solid #ccd5df;border-radius:6px;"}
var kind = "tangent";
// Embedded in each JSXGraph iframe by generate-stack-figures.py.
document.documentElement.lang = 'nb';
var box = document.querySelector('.jxgbox'), board = null, params = null, variantKey = '';
var bounds = [-1.5, 1.5, 1.5, -1.5];
var blue = '#1565c0', red = '#b3263e', green = '#267044', ink = '#243447';
var style = document.createElement('style');
style.textContent = 'html,body{height:100%;margin:0;box-sizing:border-box}body{display:flex;flex-direction:column;padding:5px;font:15px system-ui;color:#243447}.jxgbox{flex:1;min-height:0;width:100%!important;height:auto!important;box-sizing:border-box}.stack-tools{flex:none;padding:8px 3px;line-height:1.5}.stack-tools button{font:inherit;margin:3px 5px 3px 0;padding:4px 9px}.stack-tools input[type=range]{max-width:48%;vertical-align:middle}.stack-readout{min-height:1.5em;font-variant-numeric:tabular-nums}button:focus-visible,input:focus-visible{outline:3px solid #ad6600;outline-offset:2px}';
document.head.appendChild(style);
var toolbar = document.createElement('div'); toolbar.className = 'stack-tools';
box.after(toolbar);
function textAt(x,y,s,color) { return board.create('text',[x,y,s],{fontSize:14,strokeColor:color||ink,fixed:true,highlight:false}); }
function segment(a,b,color,dash) { return board.create('segment',[a,b],{strokeColor:color||ink,strokeWidth:2,dash:dash||0,fixed:true,highlight:false}); }
function point(x,y,name,color) { return board.create('point',[x,y],{name:name,size:2,fixed:true,strokeColor:color||blue,fillColor:color||blue,label:{fontSize:14}}); }
function button(label,fn) { var b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;toolbar.appendChild(b);return b; }
function output() { var o=document.createElement('div');o.className='stack-readout';toolbar.appendChild(o);return o; }
function fitBoard() {
  var w=box.clientWidth,h=box.clientHeight;
  if(!params || w<=0 || h<=0) return;
  if(!board) {
    board=JXG.JSXGraph.initBoard(box.id,{boundingbox:bounds.slice(),axis:false,keepaspectratio:true,showNavigation:false,showCopyright:false,pan:{enabled:false},zoom:{enabled:false},resize:{enabled:false}});
    board.suspendUpdate(); draw(); board.unsuspendUpdate();
  }
  if(board.canvasWidth!==w||board.canvasHeight!==h)board.resizeContainer(w,h,true);
  var cx=(bounds[0]+bounds[2])/2,cy=(bounds[1]+bounds[3])/2;
  var scale=Math.min(w/(bounds[2]-bounds[0]),h/(bounds[1]-bounds[3]));
  if(kind==='tangent')board.setBoundingBox(bounds.slice(),false);
  else board.setBoundingBox([cx-w/(2*scale),cy+h/(2*scale),cx+w/(2*scale),cy-h/(2*scale)],true);
  board.fullUpdate();
}
function setParameters(key,next) {
  if(key===variantKey) {fitBoard();return;}
  variantKey=key;params=next;
  if(board){JXG.JSXGraph.freeBoard(board);board=null;}
  toolbar.replaceChildren();configure();fitBoard();
}
window.addEventListener('message',function(e){
  if(e.source!==window.parent || !e.data || e.data.protocol!=='ctm-stack-figure')return;
  if(e.data.type==='variant' && e.data.kind===kind)setParameters(e.data.key,e.data.params);
  if(e.data.type==='layout')fitBoard();
});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitBoard).observe(box);
window.addEventListener('resize',fitBoard);
window.addEventListener('pageshow',fitBoard);
window.parent.postMessage({protocol:'ctm-stack-figure',type:'ready',kind:kind},'*');

var slider,tangentX,readout;
function f(x){return (x-params.p1)/(x-params.p2);}
function derivative(x){return (params.p1-params.p2)/Math.pow(x-params.p2,2);}
function configure(){
  tangentX=params.x0;
  var y=f(tangentX);
  bounds=[Math.min(params.p2-3,params.x0-3),Math.max(y+3,4),Math.max(params.p2+3,params.x0+3),Math.min(y-3,-3)];
}
function draw(){
  var p=params.p2,epsilon=.002,low=bounds[0],high=bounds[2];
  board.create('axis',[[0,0],[1,0]],{ticks:{minorTicks:0,drawLabels:true,label:{fontSize:11}}});
  board.create('axis',[[0,0],[0,1]],{ticks:{minorTicks:0,drawLabels:true,label:{fontSize:11}}});
  segment([p,bounds[3]],[p,bounds[1]],ink,2);segment([low,1],[high,1],ink,2);
  // Split at the pole so the graph never joins the two branches across it.
  board.create('functiongraph',[f,low,p-epsilon],{strokeColor:blue,strokeWidth:2});
  board.create('functiongraph',[f,p+epsilon,high],{strokeColor:blue,strokeWidth:2});
  board.create('functiongraph',[function(x){return f(tangentX)+derivative(tangentX)*(x-tangentX);},low,high],{strokeColor:red,strokeWidth:2});
  point(function(){return tangentX;},function(){return f(tangentX);},'P',red);
  var span=Math.min(2,Math.abs(params.x0-p)*.75);
  var label=document.createElement('label');label.textContent='Flytt tangentpunktet: ';
  slider=document.createElement('input');slider.type='range';slider.min=String(params.x0-span);slider.max=String(params.x0+span);slider.step=String(span/100);slider.value=String(params.x0);slider.setAttribute('aria-label','Tangentpunktets x-koordinat');label.appendChild(slider);toolbar.appendChild(label);
  function updateView(){
    var y=f(tangentX),y0=f(params.x0);
    bounds[1]=Math.max(y+2,y0+3,4);bounds[3]=Math.min(y-2,y0-3,-3);
    fitBoard();
  }
  slider.oninput=function(){tangentX=Number(slider.value);updateView();};
  button('Til oppgavens punkt',function(){tangentX=params.x0;slider.value=String(params.x0);updateView();});
  readout=output();
  function update(){readout.textContent='x = '+tangentX.toFixed(2)+' · f(x) = '+f(tangentX).toFixed(3)+' · stigningstall = '+derivative(tangentX).toFixed(3);}
  board.on('update',update);update();
}

```
