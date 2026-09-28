var A, readout;
function configure(){ bounds=[-1.42,1.42,1.42,-1.42]; }
function angle(){var v=Math.atan2(A.Y(),A.X());return v<0?v+2*Math.PI:v;}
function move(delta){var v=(angle()+delta+2*Math.PI)%(2*Math.PI);A.moveTo([Math.cos(v),Math.sin(v)]);board.update();}
function draw(){
  segment([-1.22,0],[1.22,0]);segment([0,-1.22],[0,1.22]);
  textAt(1.25,-.1,'x',blue);textAt(.07,1.28,'y',green);
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(p){point(p[0],p[1],'',ink);});
  textAt(.94,-.15,'1');textAt(-1.12,-.15,'−1');textAt(.06,1.08,'1');textAt(.06,-1.1,'−1');
  var circle=board.create('circle',[[0,0],1],{strokeColor:ink,strokeWidth:2,fixed:true,highlight:false});
  A=board.create('glider',[1,0,circle],{name:'A',size:5,strokeColor:red,fillColor:red,tabindex:0,aria:{enabled:true,label:'Punkt A på enhetssirkelen. Dra punktet eller bruk vinkelknappene.'},label:{fontSize:15,offset:[8,12]}});
  segment([0,0],A,red);
  segment([0,0],[function(){return A.X();},0],blue);
  segment([function(){return A.X();},0],A,green,2);
  segment([0,function(){return A.Y();}],A,blue,2);
  board.create('curve',[function(t){return .28*Math.cos(t*angle());},function(t){return .28*Math.sin(t*angle());},0,1],{strokeColor:red,strokeWidth:2,fixed:true});
  button('−1°',function(){move(-Math.PI/180);});button('+1°',function(){move(Math.PI/180);});
  button('−0.01 rad',function(){move(-.01);});button('+0.01 rad',function(){move(.01);});
  button('Nullstill',function(){A.moveTo([1,0]);board.update();});
  readout=output();
  function update(){readout.textContent='v = '+angle().toFixed(3)+' rad = '+(angle()*180/Math.PI).toFixed(1)+'° · x = cos v = '+A.X().toFixed(2)+' · y = sin v = '+A.Y().toFixed(2);}
  board.on('update',update);update();
}
