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
