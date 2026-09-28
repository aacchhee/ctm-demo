/* Keep each native math-exercise pool, solution and JSXGraph figure in sync. */
(function () {
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
        if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([solution]).catch(function(error){console.warn('Solution typesetting failed',error);});
        var labels=JSON.parse(cell.dataset.fieldLabels||'[]');
        question.querySelectorAll('.math-input').forEach(function(input,i){if(labels[i])input.setAttribute('aria-label',labels[i]);});
        send(kind);
      }
      new MutationObserver(sync).observe(question,{childList:true,subtree:true});
      details.addEventListener('toggle',function(){send(kind);send(kind,'layout');});
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
