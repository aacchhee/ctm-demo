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
