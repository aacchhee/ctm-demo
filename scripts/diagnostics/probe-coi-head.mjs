// Diagnostic A/B only: the real CDN, trusted CI Chromium, and fresh contexts.
// The candidate changes one service-worker response span; it is never installed
// in a course or treated as first-visit acceptance. All raw failures are kept.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2),arg=(name,fallback)=>{const i=args.indexOf('--'+name);return i<0?fallback:args[i+1];};
const runtimeRoot=arg('runtime-root',null),site=fs.realpathSync(path.resolve(runtimeRoot||arg('site','_saving-quiz-site'))),output=path.resolve(arg('output','first-start-network/nettrace-head.json'));
const workerScript=runtimeRoot?fs.readFileSync(path.join(site,'pyodide-worker.js'),'utf8'):null;
const canonical=fs.readFileSync(path.join(site,'coi-serviceworker.js'),'utf8');
const before='if (resp.status === 0) return resp;',after='if (resp.status === 0 || request.method === "HEAD") return resp;';
assert.equal(canonical.split(before).length,2,'candidate must change exactly the reviewed response span');
const candidate=canonical.replace(before,after),hash=value=>createHash('sha256').update(value).digest('hex');
const wheel='https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide_http-0.2.2-py3-none-any.whl';
const workerInvocation=workerScript?`
(async()=>{
 const identity={isolated:crossOriginIsolated,controller:navigator.serviceWorker?.controller?.scriptURL||null,keepsWheels:keepsWheels(),cache:keepsWheels()?'no-store':'default',workerType:'module',transport:'canonical networkFetch/fetchRange'};
 try{
  postMessage({diagnosticPhase:'head',identity});
  const HEAD=await fetchRange(${JSON.stringify(wheel)},0,'HEAD');
  postMessage({diagnosticPhase:'get',HEAD,identity});
  const result=await fetchRange(${JSON.stringify(wheel)},null);
  const bytes=joined(result.chunks,result.received);
  const GET={method:'GET',bytes:bytes.byteLength,prefixHex:Array.from(bytes.slice(0,8),b=>b.toString(16).padStart(2,'0')).join(''),sha256:await sha256Hex(bytes)};
  postMessage({diagnosticDone:true,HEAD,GET,identity});
 }catch(error){console.error(error);postMessage({diagnosticDone:true,error:String(error.stack||error),identity});}
})();
`:null;
const report={diagnosticOnly:true,driver:workerScript?'canonical-blob-module-worker':'legacy-page-fetch',workerScriptSHA256:workerScript?hash(workerScript):null,workerInvocation,workerInvocationSHA256:workerInvocation?hash(workerInvocation):null,completed:false,scope:'Causal HEAD response A/B against a real public CDN using trusted CI Chromium. No first-visit, Python, grading or deployment acceptance.',wheel,canonicalSHA256:hash(canonical),candidateSHA256:hash(candidate),candidatePatch:{before,after,occurrences:1},cases:[],startedAt:Date.now()};
fs.mkdirSync(path.dirname(output),{recursive:true});const save=()=>fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
let server,browser;
try{
 server=http.createServer((req,res)=>{const p=new URL(req.url,'http://local').pathname,scope=p.split('/')[1];
  if(p==='/favicon.ico'){res.writeHead(204);return res.end();}
  if(!['current','candidate'].includes(scope)){res.writeHead(404);return res.end('Not found');}
  if(p==='/'+scope+'/coi-serviceworker.js'){res.setHeader('Content-Type','text/javascript; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.end(scope==='current'?canonical:candidate);}
  if(p==='/'+scope+'/pyodide-worker.js'&&workerScript){res.setHeader('Content-Type','text/javascript; charset=utf-8');return res.end(workerScript);}
  if(p==='/'+scope+'/index.html'){res.setHeader('Content-Type','text/html; charset=utf-8');return res.end('<!doctype html><meta charset="utf-8"><title>COI HEAD transport diagnostic</title><p>HEAD/GET transport diagnostic only.</p>'+ (workerScript?'<script src="pyodide-worker.js"></script>':''));}
  res.writeHead(404);res.end('Not found');
 });await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const origin='http://127.0.0.1:'+server.address().port;
 const pw=await import(process.env.CTM_PLAYWRIGHT_MODULE||'playwright');browser=await pw.chromium.launch({headless:true});report.browser=browser.version();
 for(const name of ['current','candidate']){
  const row={name,completed:false,phase:'setup',requests:[],responses:[],requestEvents:[],pending:[],pageErrors:[],webErrors:[],consoleErrors:[],windowErrors:[],unhandledRejections:[],failedRequests:[],badResponses:[],cdp:[]};report.cases.push(row);save();
  const context=await browser.newContext({serviceWorkers:'allow'}),pending=new Map(),ids=new Map();let nextId=0;
  const stamp=()=>({at:Date.now(),phase:row.phase}),id=req=>{if(!ids.has(req))ids.set(req,++nextId);return ids.get(req);};
  const describe=req=>{const result={id:id(req),method:req.method(),url:req.url(),resourceType:req.resourceType(),headers:req.headers()};try{result.serviceWorker=req.serviceWorker()?.url()||null;}catch(e){result.workerOwnerError=String(e);}try{result.frame=req.frame().url();}catch(e){result.frameUnavailable=String(e);}return result;};
  context.on('request',req=>{const item={...stamp(),...describe(req)};row.requests.push(item);row.requestEvents.push({event:'request',...item});pending.set(req,item);});
  for(const event of ['requestfinished','requestfailed'])context.on(event,req=>{const item={...stamp(),event,...describe(req)};if(event==='requestfailed'){item.failure=req.failure();row.failedRequests.push(item);}row.requestEvents.push(item);pending.delete(req);});
  context.on('response',res=>{const item={...stamp(),requestId:id(res.request()),method:res.request().method(),url:res.url(),status:res.status(),fromServiceWorker:res.fromServiceWorker(),headers:res.headers()};row.responses.push(item);if(item.status>=400)row.badResponses.push(item);});
  context.on('console',m=>{if(m.type()==='error')row.consoleErrors.push({...stamp(),text:m.text(),location:m.location()});});
  context.on('weberror',e=>row.webErrors.push({...stamp(),error:String(e.error()),stack:e.error().stack}));
  await context.exposeBinding('__headProbeObserve',({frame},kind,value)=>row[kind].push({...stamp(),frame:frame.url(),...value}));
  await context.addInitScript(()=>{addEventListener('error',e=>{if(e instanceof ErrorEvent)window.__headProbeObserve('windowErrors',{message:e.message,filename:e.filename,line:e.lineno});});addEventListener('unhandledrejection',e=>window.__headProbeObserve('unhandledRejections',{reason:String(e.reason?.stack||e.reason)}));});
  const page=await context.newPage();page.on('pageerror',e=>row.pageErrors.push({...stamp(),message:e.message,stack:e.stack}));page.setDefaultTimeout(30000);
  try{
   const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');
   for(const event of ['requestWillBeSent','responseReceived','loadingFailed','loadingFinished'])cdp.on('Network.'+event,value=>row.cdp.push({...stamp(),event,value}));
   row.phase='register';await page.goto(origin+'/'+name+'/index.html',{waitUntil:'load'});
   await page.evaluate(async scope=>{let timer,onControl;const ready=async()=>{await navigator.serviceWorker.register('/'+scope+'/coi-serviceworker.js');await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(r=>{onControl=r;navigator.serviceWorker.addEventListener('controllerchange',r,{once:true});});};try{await Promise.race([ready(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Service-worker registration/control timed out')),30000);})]);}finally{clearTimeout(timer);if(onControl)navigator.serviceWorker.removeEventListener('controllerchange',onControl);}},name);
   row.phase='controlled-reload';await page.reload({waitUntil:'load'});
   row.control=await page.evaluate(()=>({isolated:crossOriginIsolated,controller:navigator.serviceWorker.controller?.scriptURL}));
   assert.equal(row.control.isolated,true,'probe must use a controlled isolated document');assert.ok(row.control.controller.endsWith('/'+name+'/coi-serviceworker.js'));
   if(workerScript){
    row.phase='worker-head-get';
    const result=await page.evaluate(invocation=>new Promise((resolve,reject)=>{
     const source=CTMWorker.source+invocation,blobURL=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
     const worker=new Worker(blobURL,{type:'module'});window.__diagnosticWorker=worker;
     const timer=setTimeout(()=>reject(Error('Canonical worker HEAD/GET diagnostic timed out')),75000);
     worker.onerror=e=>{clearTimeout(timer);reject(Error(e.message));};
     worker.onmessage=e=>{if(e.data.diagnosticDone){clearTimeout(timer);resolve(e.data);}};
     // Retain the worker and Blob until all actual request lifecycles settle.
    }),workerInvocation);
    row.worker=result.identity;row.HEAD=result.HEAD;row.GET=result.GET;
    if(result.error)throw Error(result.error);
    assert.equal(row.worker.isolated,true);assert.equal(row.worker.keepsWheels,true,'real isolated worker must use production no-store path');assert.ok(row.GET.bytes>0);save();
   }else for(const method of ['HEAD','GET']){
    row.phase=method.toLowerCase();row[method]=await page.evaluate(async({url,method})=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);try{const response=await fetch(url,{method,cache:'no-store',signal:controller.signal});const body=await response.arrayBuffer();return{method,status:response.status,type:response.type,headers:Object.fromEntries(response.headers),bytes:body.byteLength,prefixHex:Array.from(new Uint8Array(body).slice(0,8),b=>b.toString(16).padStart(2,'0')).join(''),sha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',body)),b=>b.toString(16).padStart(2,'0')).join('')};}finally{clearTimeout(timer);}},{url:wheel,method});
    assert.equal(row[method].status,200);if(method==='HEAD')assert.equal(row[method].bytes,0);else assert.ok(row[method].bytes>0);save();
   }
   row.phase='settle';const end=Date.now()+20000;while(pending.size&&Date.now()<end)await new Promise(r=>setTimeout(r,50));row.pending=[...pending.values()];assert.equal(pending.size,0,'all request lifecycles must finish before teardown');row.completed=true;
  }catch(error){row.error=String(error.stack||error);}
  finally{row.pending=[...pending.values()];row.beforeTeardownRawCounts=Object.fromEntries(['pageErrors','webErrors','consoleErrors','windowErrors','unhandledRejections','failedRequests','badResponses'].map(k=>[k,row[k].length]));row.phase='teardown';await context.close();row.phase='closed';save();}
 }
 const [current,changed]=report.cases;report.completed=report.cases.every(c=>c.completed);
 report.sameGETBytes=!!(current.GET&&changed.GET&&current.GET.bytes===changed.GET.bytes&&current.GET.sha256===changed.GET.sha256);
 report.headFailureCounts=Object.fromEntries(report.cases.map(c=>[c.name,c.failedRequests.filter(r=>r.method==='HEAD'&&r.url===wheel).length]));
 report.causalDifferenceObserved=report.completed&&report.sameGETBytes&&report.headFailureCounts.current>0&&report.headFailureCounts.candidate===0;
 if(!report.completed)process.exitCode=1;
}catch(error){report.error=String(error.stack||error);process.exitCode=1;}
finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));report.finishedAt=Date.now();save();console.log(JSON.stringify({diagnosticOnly:true,completed:report.completed,causalDifferenceObserved:report.causalDifferenceObserved,headFailureCounts:report.headFailureCounts,sameGETBytes:report.sameGETBytes,error:report.error}));}
