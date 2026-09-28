```{.jsxgraph assessment_id="stack-triangles-board" width="760" height="480" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/12;min-height:360px;border:1px solid #ccd5df;border-radius:6px;"}
var kind = "triangles";
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

var scaleInput, smallBase=2, ratioReadout;
function configure(){bounds=[-1,params.bc+1.2,params.ab+6,-1.3];smallBase=2;}
function draw(){
  var ab=params.ab,bc=params.bc,dx=ab+2;
  var a=point(0,0,'A'),b=point(ab,0,'B'),c=point(ab,bc,'C');
  var d=point(dx,0,'D',green),e=point(function(){return dx+smallBase;},0,'E',green),f=point(function(){return dx+smallBase;},function(){return bc*smallBase/ab;},'F',green);
  [[a,b],[b,c],[c,a]].forEach(function(p){segment(p[0],p[1],blue);});
  [[d,e],[e,f],[f,d]].forEach(function(p){segment(p[0],p[1],green);});
  board.create('angle',[c,b,a],{type:'square',radius:.35,name:'',fillOpacity:0,strokeColor:blue});
  board.create('angle',[f,e,d],{type:'square',radius:.25,name:'',fillOpacity:0,strokeColor:green});
  board.create('angle',[a,c,b],{radius:.7,name:'α',fillOpacity:.12,strokeColor:blue});
  board.create('angle',[d,f,e],{radius:.45,name:'α',fillOpacity:.12,strokeColor:green});
  textAt(ab/2,-.55,'AB = '+ab,blue);textAt(ab+.22,bc/2,'BC = '+bc,blue);
  var label=document.createElement('label');label.textContent='Endre størrelsen: DE ';
  scaleInput=document.createElement('input');scaleInput.type='range';scaleInput.min='1';scaleInput.max='3';scaleInput.step='.05';scaleInput.value='2';scaleInput.setAttribute('aria-label','Lengden DE');label.appendChild(scaleInput);toolbar.appendChild(label);
  scaleInput.oninput=function(){smallBase=Number(scaleInput.value);board.update();};
  button('Nullstill',function(){smallBase=2;scaleInput.value='2';board.update();});
  ratioReadout=output();
  function update(){ratioReadout.textContent='DE = '+smallBase.toFixed(2)+' · EF = '+(bc*smallBase/ab).toFixed(2)+' · DF = '+(Math.hypot(ab,bc)*smallBase/ab).toFixed(2);}
  board.on('update',update);update();
}

```
