// Byte-preserving static-host first visit. No routes, component stubs, or runtime patches.
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2),arg=(name,fallback)=>{const i=args.indexOf('--'+name);if(i<0){assert.notEqual(fallback,undefined,'Missing --'+name);return fallback;}return args[i+1];};
const root=fs.realpathSync(path.resolve(arg('site'))),output=path.resolve(arg('output')),engine=arg('browser','webkit');
assert.ok(['chromium','firefox','webkit'].includes(engine));fs.mkdirSync(path.dirname(output),{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.wasm':'application/wasm','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8','.map':'application/json'};
const report={passed:false,functionalPassed:false,engine,width:1280,startedAt:Date.now(),scope:'actual first-visit functionality baseline: COI ready OR explicit supported unavailable fallback; no static SAB-all-browsers, offline or deployed Pages claim; unresolved retired-frame requests remain separate',
  harnessSha256:sha(fs.readFileSync(fileURLToPath(import.meta.url))),pageSha256:sha(fs.readFileSync(path.join(root,'pages/step4-ui.html'))),serviceWorkerSha256:sha(fs.readFileSync(path.join(root,'coi-serviceworker.js'))),
  phase:'setup',rawServed:[],mainNavigations:[],documentEvents:[],pageErrors:[],webErrors:[],windowErrors:[],unhandledRejections:[],consoleErrors:[],failedRequests:[],badResponses:[],responses:[],requestEvents:[],automationErrors:[]};
const pending=new Map(),requestHistory=new Map();let lastActivity=0,server,browser,context,page;
const stamp=()=>({at:Date.now(),elapsedMs:Date.now()-report.startedAt,executionPhase:report.phase});
function pendingSnapshot(){const active=[],retired=[];for(const [request,row] of pending){const item={...row,observedAt:Date.now(),frameDetached:false,lifecycleStatus:'unknown-no-terminal-event',successfulTransferProven:false,receivedBytes:null};try{const frame=request.frame();item.frameUrl=frame.url();item.frameDetached=frame.isDetached();}catch(error){item.frameUnavailable=String(error);} (item.frameDetached?retired:active).push(item);}return {active,retired};}
function save(){fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');}
function phase(name){report.phase=name;save();console.log(JSON.stringify({phase:name,engine,pending:pending.size}));}
async function bounded(promise,ms,label){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>timer=setTimeout(()=>reject(new Error(label+' timed out')),ms))]);}finally{clearTimeout(timer);}}
async function poll(read,label,ms=90000){const end=Date.now()+ms;while(Date.now()<end){try{const result=await bounded(read(),5000,label+' evaluation');if(result)return result;}catch(error){report.automationErrors.push({phase:report.phase,label,error:String(error)});}await new Promise(done=>setTimeout(done,100));}throw new Error(label+' did not complete within '+ms+'ms');}
async function settle(){await poll(async()=>pendingSnapshot().active.length===0&&Date.now()-lastActivity>=500,'current active-frame HTTP requests finished and quiet',30000);report.activeRequestsSettled=true;}
async function waitStartedSetup(label){
  phase(label);
  await poll(()=>page.evaluate(()=>!!window.mainPyodide?.whenSetup),'already-started canonical whenSetup exists',90000);
  const outcome=await bounded(page.evaluate(async()=>{const proxy=window.mainPyodide;try{await proxy.whenSetup;return {status:'resolved',workerProxy:!!proxy.isWorkerProxy};}catch(error){return {status:'rejected',error:String(error)};}}),180000,'already-started canonical whenSetup');
  report.setupWaits??=[];report.setupWaits.push({...stamp(),label,...outcome});assert.equal(outcome.status,'resolved',label+' must retain setup failures');
}
async function reveal(locator){
  const tabs=await locator.evaluate(e=>{const out=[];for(let n=e;n;n=n.parentElement)if(n.classList.contains('tab-pane'))out.unshift(n.getAttribute('aria-labelledby'));return out;});
  for(const id of tabs){const tab=page.locator('[id="'+id+'"]');if(await tab.getAttribute('aria-selected')!=='true')await tab.click();}
  for(const detail of (await locator.locator('xpath=ancestor::details[not(@open)]').all()).reverse())await detail.locator(':scope > summary').click();
}
try{
  server=http.createServer((request,response)=>{
    let file;
    try{
      const pathname=decodeURIComponent(new URL(request.url,'http://static.invalid').pathname);
      if(!pathname.startsWith('/candidate/')||pathname.includes('\0'))throw new Error('outside mount');
      file=path.resolve(root,'.'+pathname.slice('/candidate'.length));
      if(file!==root&&!file.startsWith(root+path.sep))throw new Error('outside root');
      if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
      file=fs.realpathSync(file);
      if(!file.startsWith(root+path.sep)||!fs.statSync(file).isFile())throw new Error('not a file');
      const bytes=fs.readFileSync(file),headers={'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':bytes.length,'Access-Control-Allow-Origin':'*'};
      report.rawServed.push({...stamp(),phase:report.phase,url:request.url,path:path.relative(root,file).split(path.sep).join('/'),sha256:sha(bytes),bytes:bytes.length,headers});
      response.writeHead(200,headers);response.end(request.method==='HEAD'?undefined:bytes);
    }catch(error){report.rawServed.push({...stamp(),phase:report.phase,url:request.url,status:404,error:String(error)});response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');}
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));
  const url='http://127.0.0.1:'+server.address().port+'/candidate/pages/step4-ui.html';report.url=url;
  const browsers=await import(process.env.CTM_PLAYWRIGHT_MODULE||'playwright');browser=await browsers[engine].launch({headless:true});report.browser=browser.version();
  context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'allow'});
  context.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({...stamp(),phase:report.phase,text:message.text(),location:message.location()});});
  context.on('weberror',event=>report.webErrors.push({...stamp(),phase:report.phase,message:event.error().message,stack:event.error().stack}));
  context.on('request',request=>{
    let main=false;try{main=page&&request.isNavigationRequest()&&request.frame()===page.mainFrame();}catch{}
    if(main){report.phase=report.mainNavigations.length?'service-worker-reload':'initial-document';report.mainNavigations.push({...stamp(),phase:report.phase,url:request.url()});}
    if(/^https?:/.test(request.url())){const row={...stamp(),url:request.url(),phase:report.phase,originPhase:report.phase};pending.set(request,row);requestHistory.set(request,row);report.requestEvents.push({event:'request',...row});lastActivity=Date.now();}
  });
  context.on('requestfinished',request=>{const row=requestHistory.get(request);report.requestEvents.push({...stamp(),event:'requestfinished',url:request.url(),originPhase:row?.originPhase});pending.delete(request);lastActivity=Date.now();});
  context.on('requestfailed',request=>{const row=requestHistory.get(request);pending.delete(request);lastActivity=Date.now();const failure={...stamp(),phase:row?.phase||report.phase,originPhase:row?.originPhase,url:request.url(),error:request.failure()};report.failedRequests.push(failure);report.requestEvents.push({...failure,event:'requestfailed'});});
  context.on('response',response=>{const started=requestHistory.get(response.request()),row={...stamp(),phase:started?.phase||report.phase,originPhase:started?.originPhase,url:response.url(),status:response.status(),fromServiceWorker:response.fromServiceWorker(),headers:response.headers()};report.responses.push(row);if(row.status>=400)report.badResponses.push(row);});
  await context.exposeBinding('__firstVisitObserve',({frame},kind,value)=>report[kind].push({...stamp(),phase:report.phase,frame:frame.url(),...value}));
  await context.addInitScript(()=>{
    const sw=self===top?navigator.serviceWorker:null;
    const meta=()=>({eventAt:Date.now(),eventPerformanceNow:performance.now(),documentId:String(performance.timeOrigin),url:location.href,top:self===top,isolated:crossOriginIsolated});
    const send=(kind,value)=>window.__firstVisitObserve(kind,{...meta(),...value});
    send('documentEvents',{event:'document-start',navigationType:performance.getEntriesByType('navigation')[0]?.type});
    for(const event of ['DOMContentLoaded','load','pageshow','pagehide','coi-sw-ready','coi-unavailable'])addEventListener(event,()=>send('documentEvents',{event,controller:sw?.controller?.scriptURL||null}),true);
    sw?.addEventListener('controllerchange',()=>send('documentEvents',{event:'controllerchange',controller:sw.controller?.scriptURL||null}));
    addEventListener('error',e=>{if(e instanceof ErrorEvent)send('windowErrors',{message:e.message,filename:e.filename,line:e.lineno,column:e.colno});},true);
    addEventListener('unhandledrejection',e=>send('unhandledRejections',{reason:String(e.reason?.stack||e.reason)}));
  });
  page=await context.newPage();page.setDefaultTimeout(30000);
  page.on('pageerror',error=>report.pageErrors.push({...stamp(),phase:report.phase,message:error.message,stack:error.stack}));
  phase('initial-document');
  try{await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});}catch(error){report.automationErrors.push({phase:report.phase,label:'initial goto',error:String(error)});}
  report.isolation=await poll(()=>page.evaluate(async()=>{
    const ready=crossOriginIsolated&&typeof SharedArrayBuffer==='function';
    const unavailable=window.qpyodideInputState==='unavailable'||window.qpyodideCoiOutcome==='unavailable';
    if(!ready&&!unavailable)return null;
    const registration=await navigator.serviceWorker.getRegistration();
    return {outcome:ready?'ready':'unavailable',inputState:window.qpyodideInputState,coiOutcome:window.qpyodideCoiOutcome,crossOriginIsolated,sharedArrayBufferBytes:ready?new SharedArrayBuffer(4).byteLength:null,controller:navigator.serviceWorker.controller?.scriptURL,scope:registration?.scope,active:registration?.active?.state,navigationType:performance.getEntriesByType('navigation')[0]?.type};
  }),'actual COI ready or explicit unavailable fallback',90000);
  if(report.isolation.outcome==='ready'){
    assert.equal(report.isolation.active,'activated');assert.ok(report.isolation.controller);assert.ok(report.mainNavigations.length>=2,'fresh isolated first visit retains initial navigation and controlled reload');
    assert.ok(report.responses.some(r=>r.fromServiceWorker&&r.url===url),'controlled document response observed');
  }
  assert.ok(report.documentEvents.some(e=>e.top&&e.url===url&&e.event==='document-start'&&!e.isolated),'actual initial unisolated document observed');
  await waitStartedSetup('setup-before-run');phase('ide-run');
  const ide=page.locator('.qpyodide-interactive-area[data-id="step4-ui-ide"]');await ide.waitFor({state:'attached',timeout:90000});await reveal(ide);
  await ide.locator('.qpyodide-button-run').click();
  await poll(async()=>(await ide.locator('.qpyodide-output-code-area').innerText()).trim()==='42','real IDE Run output42',180000);
  await poll(()=>ide.locator('.qpyodide-button-run').isEnabled(),'real IDE Run completes');
  report.ide={output:(await ide.locator('.qpyodide-output-code-area').innerText()).trim(),inputStopControlInteractionTested:false,runtime:await page.evaluate(()=>({workerProxy:!!window.mainPyodide?.isWorkerProxy,isolated:crossOriginIsolated,inputState:window.qpyodideInputState,inputAvailable:typeof window.qpyodideInputAvailable==='function'?window.qpyodideInputAvailable():null,interruptBufferBytes:window.mainPyodide?.interruptBuffer?.byteLength||0,inputStatusBytes:window.mainPyodide?.inputStatusBuf?.byteLength||0}))};
  phase('opaque-board');
  const board=page.locator('#ui-board iframe');await reveal(board);await board.scrollIntoViewIfNeeded();assert.equal(await board.getAttribute('sandbox'),'allow-scripts');
  const frame=await board.elementHandle().then(h=>h.contentFrame());assert.ok(frame);
  await frame.waitForFunction(()=>[...document.querySelectorAll('.jxgbox mjx-container')].some(n=>n.querySelector('svg path,svg use')&&n.getAttribute('data-semantic-speech-none')==='x squared plus 1'&&n.getAttribute('data-semantic-braille')==='⠭⠘⠆⠐⠬⠂'),null,{timeout:90000});
  report.board=await frame.evaluate(()=>({origin:self.origin,labels:[...document.querySelectorAll('.jxgbox mjx-container')].map(n=>({glyphs:n.querySelectorAll('svg path,svg use').length,speech:n.getAttribute('data-semantic-speech-none'),braille:n.getAttribute('data-semantic-braille')}))}));assert.equal(report.board.origin,'null');
  await page.screenshot({path:output.replace(/\.json$/,'-board.png'),fullPage:false});
  report.functionalPassed=true;await waitStartedSetup('setup-before-teardown');phase('final-settle');await settle();
}catch(error){report.error=String(error.stack||error);process.exitCode=1;
  if(page&&!page.isClosed())try{report.failureState=await bounded(page.evaluate(()=>({url:location.href,isolated:crossOriginIsolated,sab:typeof SharedArrayBuffer,coiOutcome:window.qpyodideCoiOutcome,controller:navigator.serviceWorker?.controller?.scriptURL,body:document.body?.innerText.slice(-4000)})),10000,'failure snapshot');}catch(error){report.snapshotError=String(error);}
  if(page&&!page.isClosed())try{await bounded(page.screenshot({path:output.replace(/\.json$/,'-failure.png'),fullPage:false}),10000,'failure screenshot');}catch(error){report.screenshotError=String(error);}
}finally{
  if(page&&!page.isClosed()&&!report.setupWaits?.some(row=>row.label==='setup-before-teardown'))try{
    const started=await bounded(page.evaluate(()=>!!window.mainPyodide?.whenSetup),5000,'already-started setup inspection');
    if(started)await waitStartedSetup('setup-before-error-teardown');
  }catch(error){report.setupTeardownError=String(error);}
  report.pendingBeforeTeardown=pendingSnapshot();report.allRequestsFinished=pending.size===0;report.teardown={startedAt:Date.now()};phase('teardown');save();
  if(context)await bounded(context.close(),15000,'context close').catch(e=>report.teardownError=String(e));
  report.teardown.contextClosedAt=Date.now();
  if(browser)await bounded(browser.close(),15000,'browser close').catch(e=>report.teardownError=String(e));
  report.teardown.browserClosedAt=Date.now();
  if(server)await new Promise(done=>server.close(done));
  report.teardown.serverClosedAt=Date.now();
  const raw=['pageErrors','webErrors','windowErrors','unhandledRejections','consoleErrors','failedRequests','badResponses'];
  report.rawCountsByPhase=Object.fromEntries(['initial-document','service-worker-reload','setup-before-run','ide-run','opaque-board','setup-before-teardown','final-settle','teardown'].map(phase=>[phase,Object.fromEntries(raw.map(key=>[key,0]))]));
  for(const key of raw)for(const row of report[key]){const phase=row.phase||'unknown';report.rawCountsByPhase[phase]??={};report.rawCountsByPhase[phase][key]=(report.rawCountsByPhase[phase][key]||0)+1;}
  report.rawPassed=raw.every(key=>report[key].length===0);
  report.strictAllRequestLifecyclesObserved=report.allRequestsFinished;
  report.functionalBaselinePassed=!!(report.functionalPassed&&report.rawPassed&&report.activeRequestsSettled&&report.pendingBeforeTeardown.active.length===0&&!report.error&&!report.teardownError&&!report.setupTeardownError);
  report.passed=report.functionalBaselinePassed;
  if(!report.passed)process.exitCode=1;save();console.log(JSON.stringify({passed:report.passed,functionalBaselinePassed:report.functionalBaselinePassed,functionalPassed:report.functionalPassed,allRequestsFinished:report.allRequestsFinished,engine,error:report.error,rawCountsByPhase:report.rawCountsByPhase}));
}
