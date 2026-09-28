/* Keep each native math-exercise pool, solution and JSXGraph figure in sync. */
(function () {
  var pendingMath=new Set(), mathQueue=Promise.resolve();
  function flushMath(){
    var mj=window.MathJax;
    if(!mj?.typesetPromise)return;
    var elements=Array.from(pendingMath);pendingMath.clear();
    if(!elements.length)return;
    mathQueue=mathQueue.then(function(){return mj.startup?.promise;})
      .then(function(){return mj.typesetPromise(elements.filter(function(el){return el.isConnected;}));})
      .catch(function(error){console.warn('STACK typesetting failed',error);});
  }
  window.stackTypeset=function(element){pendingMath.add(element);flushMath();};
  window.addEventListener('load',flushMath);
  document.addEventListener('load',function(event){
    if(event.target.tagName==='SCRIPT' && /mathjax/i.test(event.target.src||''))flushMath();
  },true);
  function start() {
    var kinds=['triangles','values','angle','tangent'];
    var active={};
    function frame(kind){return document.getElementById('stack-'+kind+'-board');}
    function send(kind,type){
      var f=frame(kind),v=active[kind];
      if(f&&f.contentWindow&&v)f.contentWindow.postMessage({protocol:'ctm-stack-figure',type:type||'variant',kind:kind,key:v.key,params:v.params},'*');
    }
    kinds.forEach(function(kind){
      var cell=document.querySelector('.math-exercise-cell[data-label="stack-'+kind+'"]');
      var question=cell.querySelector('.math-exercise-question');
      var solution=document.getElementById('stack-'+kind+'-solution');
      var details=solution.closest('details');
      function sync(){
        var marker=question.querySelector('[data-stack-variant]');
        if(!marker)return;
        var key=marker.dataset.stackVariant,data=window.stackVariants[key];
        if(!data || data.kind!==kind || active[kind]?.key===key)return;
        active[kind]={key:key,params:data.params};
        // A new question must not leave the previous worked solution open.
        details.open=false;
        if(window.MathJax?.typesetClear)window.MathJax.typesetClear([solution]);
        solution.innerHTML=data.solution;
        window.stackTypeset(solution);
        document.dispatchEvent(new CustomEvent('stack:variant-changed',{detail:{kind:kind,key:key}}));
        var labels=JSON.parse(cell.dataset.fieldLabels||'[]');
        question.querySelectorAll('.math-input').forEach(function(input,i){if(labels[i])input.setAttribute('aria-label',labels[i]);});
        send(kind);
      }
      new MutationObserver(sync).observe(question,{childList:true,subtree:true});
      details.addEventListener('toggle',function(){if(details.open)window.stackTypeset(solution);send(kind);send(kind,'layout');});
      var f=frame(kind);if(f){f.title={triangles:'Formlike trekanter med justerbar størrelse',values:'Enhetssirkel for avlesning av sinus og cosinus',angle:'Enhetssirkel for å finne vinkelen',tangent:'Rasjonal funksjon med bevegelig tangent'}[kind];f.addEventListener('load',function(){send(kind);});}
      sync();
    });
    window.addEventListener('message',function(e){
      if(e.data?.protocol!=='ctm-stack-figure'||e.data.type!=='ready')return;
      var kind=e.data.kind;if(!kinds.includes(kind)||e.source!==frame(kind)?.contentWindow)return;
      send(kind);
    });
    document.addEventListener('shown.bs.tab',function(){kinds.forEach(function(kind){send(kind);send(kind,'layout');});});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
