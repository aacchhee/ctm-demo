// Real coherent demo navigation/language acceptance. No routes or vendor edits.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2);
function option(name){const at=args.indexOf('--'+name);assert.ok(at>=0,'Missing --'+name);return args[at+1];}
const engine=option('browser'),site=path.resolve(option('site')),tooling=path.resolve(option('tooling')),output=path.resolve(option('output'));
assert.ok(['chromium','firefox','webkit'].includes(engine));
const widthAt=args.indexOf('--width'),widths=widthAt<0?[1280,390]:[Number(args[widthAt+1])];assert.ok(widths.every(w=>[1280,390].includes(w)),'--width must be 1280 or 390');
const playwright=await import(process.env.CTM_PLAYWRIGHT_MODULE||'playwright');
const {serve}=await import(pathToFileURL(path.join(tooling,'tools/compare-browser.mjs')));
const authored=path.join(path.dirname(site),'_includes/step4-ui/links-other.md');
const authoredBytes=await fs.readFile(authored);
const targets=[...authoredBytes.toString('utf8').matchAll(/\]\(step4-ui\.qmd#([^\)]+)\)/g)].map(match=>match[1]);
assert.equal(targets.length,20,'Retain every authored navigation target');
assert.equal(new Set(targets).size,20);
const targetAt=args.indexOf('--target'),diagnosticTarget=targetAt<0?null:args[targetAt+1];
assert.ok(!diagnosticTarget||targets.includes(diagnosticTarget),'Diagnostic target must be authored');
const selectedTargets=diagnosticTarget?[diagnosticTarget]:targets;
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const report={focusContract:{source:'docs/consolidation/2026-10-step4.md §6.3 Links; tools/compare-browser.mjs links(); ctm-libs/ui/ctm-nav.js keepFocus()',policy:'Atomic visible related landing focus and visible related focus after at least2.1s; all eight target/hash/open/header/geometry samples remain required. Intermediate focus falls and native recovery remain recorded, without a new duration SLA.',priorStrictFailures:'Retained separately; no production or PIN_MS change.'},passed:false,engine,site,tooling,sourceSha256:sha(await fs.readFile(new URL(import.meta.url))),authoredLinksSha256:sha(authoredBytes),targets,widths,diagnosticTarget,cases:[]};
report.htmlSha256={};for(const name of ['step4-ui','step4-ui-links','step4-ui-nb','step4-ui-nn','step4-ui-de'])report.htmlSha256['pages/'+name+'.html']=sha(await fs.readFile(path.join(site,'pages',name+'.html')));
await fs.mkdir(path.dirname(output),{recursive:true});
const shots=output.replace(/\.json$/,'')+'-shots';await fs.mkdir(shots,{recursive:true});
const server=await serve({site},true,'require-corp');
const base='http://127.0.0.1:'+server.address().port+'/site/';
let browser,context,page,current;
const pageRecords=new WeakMap();
const pause=ms=>new Promise(done=>setTimeout(done,ms));
async function settle(p,label){
  await p.waitForLoadState('load',{timeout:120000});
  const record=pageRecords.get(p),until=Date.now()+90000;
  while(record.pending.size || Date.now()-record.lastRequest<1000){
    if(Date.now()>until)throw Error(label+' request settlement: '+JSON.stringify([...record.pending.values()]));
    await pause(100);
  }
}
async function watch(p){
  const c=current,record={pending:new Map(),lastRequest:Date.now()};pageRecords.set(p,record);
  p.setDefaultTimeout(30000);
  p.on('pageerror',error=>c.raw.pageErrors.push({url:p.url(),message:error.message,stack:error.stack}));
  p.on('console',message=>{if(message.type()==='error')c.raw.consoleErrors.push({url:p.url(),text:message.text(),location:message.location()});});
  p.on('request',request=>{record.pending.set(request,request.url());record.lastRequest=Date.now();});
  for(const type of ['requestfinished','requestfailed'])p.on(type,request=>{
    record.pending.delete(request);record.lastRequest=Date.now();
    if(type==='requestfailed')c.raw.failedRequests.push({url:request.url(),error:request.failure()});
  });
  p.on('response',response=>{if(response.status()>=400)c.raw.badResponses.push({url:response.url(),status:response.status()});});
}
async function navigate(url){await settle(page,'before intentional navigation');await page.goto(url,{waitUntil:'load',timeout:120000});await settle(page,'after navigation');assert.equal(await page.evaluate(()=>crossOriginIsolated),true,'actual parent must be isolated');}
function stateInPage({id,landing=false}){
    const target=document.getElementById(id);if(!target)return landing?false:{missing:true};
    const anchor=target.classList.contains('ctm-tab-target')?target.closest('.panel-tabset')?.querySelector(':scope > [role="tablist"]'):
      target.tagName==='SECTION'&&/^H[1-6]$/.test(target.firstElementChild?.tagName||'')?target.firstElementChild:target;
    const focused=document.activeElement,rect=focused?.getBoundingClientRect(),r=anchor?.getBoundingClientRect();
    const panes=[],details=[],callouts=[];
    for(let node=target;node;node=node.parentElement){
      if(node.classList.contains('tab-pane'))panes.push({id:node.id,active:node.classList.contains('active'),visible:getComputedStyle(node).display!=='none'});
      if(node.tagName==='DETAILS')details.push({id:node.id,open:node.open});
      if(node.classList.contains('callout-collapse'))callouts.push(node.classList.contains('show'));
    }
    const own=target.classList.contains('callout')?target.querySelector(':scope > .callout-collapse'):null;if(own)callouts.push(own.classList.contains('show'));
    const state={at:performance.now(),documentHasFocus:document.hasFocus(),focusTrace:window.__ctmFocusAudit||[],iframeStates:[...document.querySelectorAll('iframe')].map(f=>({id:f.id,srcPrefix:(f.getAttribute('src')||'').slice(0,100),srcLength:(f.getAttribute('src')||'').length,active:document.activeElement===f})),id,hash:location.hash,mark:target.getAttribute('data-ctm-nav'),visible:target.getClientRects().length>0,
      anchorTop:r?.top,anchorHeight:r?.height,header:document.getElementById('quarto-header')?.offsetHeight||0,viewport:[innerWidth,innerHeight],
      focus:{tag:focused?.tagName,id:focused?.id,role:focused?.getAttribute('role'),top:rect?.top,height:rect?.height,
        related:!!focused&&(target.contains(focused)||focused.contains(target)||(target.classList.contains('ctm-tab-target')&&!!target.closest('.tab-pane')?.contains(focused)&&(focused.getAttribute('role')==='tabpanel'||/^H[1-6]$/.test(focused.tagName))))},panes,details,callouts};
    if(landing&&!(state.mark&&state.visible&&state.focus.tag!=='BODY'&&state.focus.related&&Number.isFinite(state.focus.top)&&state.focus.top>=state.header-2&&state.focus.top<state.viewport[1]))return false;
    return state;
}
async function snapshot(id){return page.evaluate(stateInPage,{id});}
async function arrival(id,kind){
  const landingHandle=await page.waitForFunction(stateInPage,{id,landing:true},{timeout:30000});
  const landing=await landingHandle.jsonValue();await landingHandle.dispose();
  const samples=[];
  for(let i=0;i<8;i++){samples.push(await snapshot(id));if(i<7)await pause(300);}
  const final=samples.at(-1),intervals=[];
  for(const event of final.focusTrace.filter(e=>e.at>=landing.at)){
    if(event.type==='focusout'&&!event.related&&['BODY','HTML'].includes(event.active?.tag))intervals.push({lostAt:event.at,recoveredAt:null,duration:null});
    if(event.type==='focusin'&&event.target?.tag===landing.focus.tag&&(event.target?.id||'')===(landing.focus.id||'')){
      const pending=intervals.at(-1);if(pending&&pending.recoveredAt===null){pending.recoveredAt=event.at;pending.duration=event.at-pending.lostAt;}
    }
  }
  current.navigation.push({id,kind,landing,samples,intermediateFocus:{bodySamples:samples.filter(s=>s.focus.tag==='BODY').map(s=>({at:s.at,documentHasFocus:s.documentHasFocus})),intervals}});await checkpoint();
  for(const s of samples){
    assert.equal(s.hash,'#'+id);assert.ok(s.visible,'target visible '+id);
    assert.ok(s.mark,'actual CTM navigation path '+id);
    assert.ok(s.panes.every(p=>p.active&&p.visible),'all enclosing tabs active '+id);
    assert.ok(s.details.every(d=>d.open),'all enclosing reveals open '+id);
    assert.ok(s.callouts.every(Boolean),'all enclosing callouts open '+id);
    assert.ok(Number.isFinite(s.anchorTop)&&s.anchorTop>=s.header-2&&s.anchorTop<s.viewport[1],'target/header bounds '+JSON.stringify(s));
  }
  assert.ok(final.at-landing.at>=2100,'Final focus observed at least2.1s after atomic landing');
  for(const state of [landing,final]){
    assert.notEqual(state.focus.tag,'BODY');assert.ok(state.focus.related,'landing/final focus belongs to target/pane '+id);
    assert.ok(Number.isFinite(state.focus.top)&&state.focus.top>=state.header-2&&state.focus.top<state.viewport[1],'landing/final focus visible '+JSON.stringify(state));
  }
  const tops=samples.map(s=>s.anchorTop);assert.ok(Math.max(...tops)-Math.min(...tops)<=3,'two-second target stability '+id);
  await settle(page,'target '+id);
}
async function clickTarget(id){
  const links=page.locator('main a[href]');
  const index=await links.evaluateAll((nodes,id)=>nodes.findIndex(a=>{const u=new URL(a.href);return u.pathname.endsWith('/pages/step4-ui.html')&&decodeURIComponent(u.hash.slice(1))===id;}),id);
  assert.ok(index>=0,'Missing actual authored link '+id);await links.nth(index).scrollIntoViewIfNeeded();await pause(300);
  const source=await links.nth(index).evaluate(e=>({scrollY,top:e.getBoundingClientRect().top,hash:location.hash,url:location.href}));
  await links.nth(index).click();
  await page.waitForURL(url=>url.hash==='#'+id,{timeout:120000});await page.waitForLoadState('load');return source;
}
async function shot(tag){await page.screenshot({path:path.join(shots,engine+'-'+current.width+'-'+tag+'.png')});}
let functionalFailures=0;
async function checkpoint(){await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');}
async function attempt(label,fn){
  report.stage={width:current.width,label,state:'running'};await checkpoint();
  try{await fn();report.stage.state='passed';}catch(error){functionalFailures++;report.stage.state='failed';current.issues.push({label,url:page?.url(),message:error.message,stack:error.stack});}
  await checkpoint();if(functionalFailures>=3)throw Error('Stopped after 3 functional failures; diagnose before repeating cases.');
}
const translations={nb:['Gå i dybden','Hint','Løsningsforslag','Detaljer'],nn:['Gå i djupna','Hint','Løysingsforslag','Detaljar'],de:['Vertiefung','Hinweis','Lösungsvorschlag','Details']};
async function language(lang){
  await navigate(base+'pages/step4-ui-'+lang+'.html');
  const titles=await page.locator('main details.ctm-reveal > summary').allTextContents();
  assert.deepEqual(titles.map(t=>t.trim()),translations[lang]);
  const modes=page.locator('.ctm-modes');
  if(lang==='de')assert.equal(await modes.count(),0,'modes:false keeps switch absent');
  else{
    assert.ok(await modes.isVisible());
    assert.deepEqual((await modes.locator('button[data-mode]').allTextContents()).map(t=>t.trim()),lang==='nb'?['Forelesning','Gå i dybden']:['Førelesing','Gå i djupna']);
    await modes.locator('[data-mode="lecture"]').click();
  }
  const summary=page.locator('main details.hint > summary');await summary.focus();
  await page.keyboard.press('Enter');assert.ok(await summary.evaluate(e=>e.parentElement.open));
  await page.keyboard.press('Space');assert.equal(await summary.evaluate(e=>e.parentElement.open),false);
  const before=await page.locator('main details.ctm-reveal').evaluateAll(nodes=>nodes.map(n=>n.open));
  await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));await page.emulateMedia({media:'print'});
  assert.ok(await page.locator('main details.reading-step').evaluateAll(nodes=>nodes.length>0&&nodes.every(n=>n.open)));
  if(lang!=='de')assert.equal(await modes.evaluate(e=>getComputedStyle(e).display),'none');
  await page.emulateMedia({media:'screen'});await page.evaluate(()=>dispatchEvent(new Event('afterprint')));
  assert.deepEqual(await page.locator('main details.ctm-reveal').evaluateAll(nodes=>nodes.map(n=>n.open)),before,'print lifecycle reversible');
  if(lang==='nb'){
    await modes.locator('[data-mode="reading"]').click();assert.equal(await modes.locator('[data-mode="reading"]').getAttribute('aria-pressed'),'true');
    await settle(page,'before mode reload');await page.reload({waitUntil:'load'});await settle(page,'mode reload');
    assert.equal(await page.evaluate(()=>CTMReveal.mode()),'reading');
    await navigate(base+'pages/step4-ui-nn.html');assert.equal(await page.evaluate(()=>CTMReveal.mode()),'reading');
    const fresh=await context.newPage();await watch(fresh);await fresh.goto(base+'pages/step4-ui-nn.html',{waitUntil:'load'});await settle(fresh,'fresh language tab');
    assert.equal(await fresh.evaluate(()=>CTMReveal.mode()),'lecture');await fresh.close();await page.bringToFront();
    await navigate(base+'pages/step4-ui-nb.html');await page.locator('.ctm-modes [data-mode="lecture"]').click();
  }
  await shot('language-'+lang);current.languages.push({lang,titles:titles.map(t=>t.trim()),keyboard:true,printLifecycle:true});
}
try{
  browser=await playwright[engine].launch({headless:true});report.browserVersion=browser.version();
  for(const width of widths){
    current={width,navigation:[],languages:[],issues:[],raw:{pageErrors:[],windowErrors:[],consoleErrors:[],failedRequests:[],badResponses:[],unhandledRejections:[]}};report.cases.push(current);
    context=await browser.newContext({viewport:{width,height:900}});
    const c=current;
    await context.exposeBinding('__ctmNavigationError',(source,value)=>c.raw[value.kind==='rejection'?'unhandledRejections':'windowErrors'].push({...value,frame:source.frame.url()}));
    await context.addInitScript(()=>{
      const audit=window.__ctmFocusAudit=[];
      const identity=e=>e?{tag:e.tagName||e.nodeName,id:e.id||null}:null;
      const record=(type,target,related)=>{if(audit.length<500)audit.push({at:performance.now(),type,target:identity(target),related:identity(related),active:identity(document.activeElement),documentHasFocus:document.hasFocus(),readyState:document.readyState});};
      for(const type of ['focusin','focusout','focus','blur'])addEventListener(type,e=>record(type,e.target,e.relatedTarget),true);
      new MutationObserver(records=>{for(const r of records)if(r.type==='attributes')record('nav-mark:'+r.target.getAttribute('data-ctm-nav'),r.target,null);}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-ctm-nav']});
      addEventListener('error',event=>{if(event instanceof ErrorEvent)window.__ctmNavigationError({kind:'error',message:event.message,source:event.filename,line:event.lineno,column:event.colno});},true);
      addEventListener('unhandledrejection',event=>window.__ctmNavigationError({kind:'rejection',message:String(event.reason?.message||event.reason),stack:event.reason?.stack||null}),true);
    });
    page=await context.newPage();await watch(page);
    for(const id of selectedTargets)await attempt('authored click '+id,async()=>{await navigate(base+'pages/step4-ui-links.html');await clickTarget(id);await arrival(id,'authored-other-page-click');});
    if(!diagnosticTarget){
    for(const id of ['ui-inner-heading','ui-target-nested','ui-far-heading','ui-quiz-math-answer','ui-quiz-python-answer'])await attempt('direct load '+id,async()=>{
      await navigate(base+'pages/step4-ui-links.html');await navigate(base+'pages/step4-ui.html#'+id);await arrival(id,'direct-load');
      if(['ui-inner-heading','ui-far-heading','ui-quiz-math-answer'].includes(id))await shot(id);
    });
    for(const id of ['ui-quiz-math-answer','ui-quiz-python-answer'])await attempt('quiz Back and Forward '+id,async()=>{
      await navigate(base+'pages/step4-ui-links.html');const source=await clickTarget(id);await arrival(id,'quiz-history-start');
      await settle(page,'before Back');await page.goBack();await page.waitForURL(url=>url.pathname.endsWith('/pages/step4-ui-links.html'));await settle(page,'quiz Back');
      const back=[];for(let n=0;n<8;n++){back.push(await page.evaluate(()=>({url:location.href,scrollY})));if(n<7)await pause(300);}
      assert.ok(back.every(s=>Math.abs(s.scrollY-source.scrollY)<=3),'Back restores the actual clicked-link position');current.navigation.push({id,kind:'quiz-Back-source',source,samples:back});
      await settle(page,'before Forward');await page.goForward();await arrival(id,'quiz-Forward');
    });
    for(const lang of ['nb','nn','de'])await attempt('language '+lang,()=>language(lang));
    }
    await attempt('final settlement',()=>settle(page,'before close'));
    await context.close();context=null;page=null;current.passed=current.issues.length===0&&Object.values(current.raw).every(a=>a.length===0);await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
  }
  for(const [file,digest] of Object.entries(report.htmlSha256))assert.equal(sha(await fs.readFile(path.join(site,file))),digest,'served source changed during acceptance '+file);
  report.passed=report.cases.length===widths.length&&report.cases.every(c=>c.passed);if(!report.passed)process.exitCode=1;
}catch(error){report.error=error.stack||String(error);process.exitCode=1;}
finally{if(context)await context.close();if(browser)await browser.close();await new Promise(done=>server.close(done));await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,engine,cases:report.cases.map(c=>({width:c.width,passed:c.passed,links:c.navigation.length,languages:c.languages.length,issues:c.issues,raw:Object.fromEntries(Object.entries(c.raw).map(([k,v])=>[k,v.length]))})),error:report.error}));
