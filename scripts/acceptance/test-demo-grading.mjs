// One actual rendered page, real graders/runtime, passive observation only.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2);
const option=name=>{const n=args.indexOf('--'+name);assert.ok(n>=0,'Missing --'+name);return args[n+1];};
const optional=(name,fallback)=>args.includes('--'+name)?option(name):fallback;
const site=resolve(option('site')),output=resolve(option('output'));
const engine=optional('browser','webkit'),width=Number(optional('width','1280'));
assert.ok(['chromium','firefox','webkit'].includes(engine));assert.ok([1280,390].includes(width));
const {serve}=await import(pathToFileURL(resolve(option('tooling'),'tools/compare-browser.mjs')));
const browsers=await import(process.env.CTM_PLAYWRIGHT_MODULE||'playwright');
const report={passed:false,engine,width,scope:'one real-page grading/quiz/board case; headered require-corp, not static/offline acceptance',
  pageSha256:createHash('sha256').update(await readFile(resolve(site,'pages/step4-ui.html'))).digest('hex'),
  pageErrors:[],windowErrors:[],unhandledRejections:[],consoleErrors:[],failedRequests:[],badResponses:[],responses:[],results:[],restores:[],steps:[]};
let server,browser,context,page;
async function bounded(promise,milliseconds,label){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(label+' timeout')),milliseconds);})]);}finally{clearTimeout(timer);}}
const pending=new Set();
let lastRequestActivity=0;
async function checkpoint(phase){report.phase=phase;await writeFile(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({phase,engine,width,pending:pending.size}));}
async function settle(){
  const deadline=Date.now()+30000;
  while(Date.now()<deadline){if(!pending.size&&Date.now()-lastRequestActivity>=500)return;await new Promise(done=>setTimeout(done,50));}
  throw new Error('Observed HTTP requests did not settle within30s: '+JSON.stringify([...pending].map(r=>r.url())));
}
async function tile(index,id){
  await quiz().locator('button').nth(index).click();
  await page.waitForFunction(id=>{const e=document.querySelector('[data-ctm-id="'+id+'"]');return e&&(e===document.activeElement||e.contains(document.activeElement));},id);
  const state=await cell(id).evaluate(e=>{const r=e.getBoundingClientRect();return {id:e.dataset.ctmId,focused:e===document.activeElement||e.contains(document.activeElement),left:r.left,right:r.right,width:r.width,height:r.height,viewport:innerWidth};});
  assert.ok(state.focused&&state.width>0&&state.height>0);report.steps.push({tile:state});
}
const cell=id=>page.locator('[data-ctm-id="'+id+'"]');
const quiz=()=>page.locator('.ctm-progress-slot[data-ctm-quiz="step4-ui-quiz"]');
async function openAncestors(locator){
  // Use actual summaries/tabs; no DOM attribute mutation or navigation API call.
  const tabs=await locator.evaluate(element=>{const out=[];for(let n=element;n;n=n.parentElement)if(n.classList.contains('tab-pane'))out.unshift(n.getAttribute('aria-labelledby'));return out;});
  for(const id of tabs){const tab=page.locator('[id="'+id+'"]');if(await tab.getAttribute('aria-selected')!=='true')await tab.click();}
  const details=await locator.locator('xpath=ancestor::details[not(@open)]').all();
  for(const detail of details.reverse())await detail.locator(':scope > summary').click();
  const caption=locator.locator(':scope > .math-exercise-toggle[aria-expanded="false"]');
  if(await caption.count())await caption.click();
}
async function code(id,value){
  const root=cell(id);await openAncestors(root);
  await root.locator('.monaco-editor').waitFor({state:'visible',timeout:90000});
  // Selection bridge only: WebKit's host shortcuts/palette do not reliably
  // select the actual model. All content edits still use real keyboard events.
  await root.evaluate(element=>{const e=monaco.editor.getEditors().find(e=>element.contains(e.getDomNode()));if(!e)throw new Error('Scoped Monaco editor missing');e.focus();e.setSelection(e.getModel().getFullModelRange());});
  await page.waitForFunction(id=>{const root=document.querySelector('[data-ctm-id="'+id+'"]'),e=monaco.editor.getEditors().find(e=>root.contains(e.getDomNode()));return e&&e.getModel().getValueInRange(e.getSelection())===e.getValue();},id,{timeout:5000});
  await page.keyboard.press('Backspace');
  await page.waitForFunction(id=>{const root=document.querySelector('[data-ctm-id="'+id+'"]'),e=monaco.editor.getEditors().find(e=>root.contains(e.getDomNode()));return e&&e.getValue()==='';},id,{timeout:5000});
  const lines=value.split('\n');
  for(let i=0;i<lines.length;i++){if(i)await page.keyboard.press('Enter');await page.keyboard.insertText(i?lines[i].trimStart():lines[i]);}
  assert.ok(await page.evaluate(expected=>monaco.editor.getModels().some(m=>m.getValue()===expected),value),'typed Monaco model must equal authored code before any storage/grading assertion');
}
async function waitResult(id,status){
  await page.waitForFunction(({id,status})=>window.__focusedResults.some(e=>e.id===id&&e.status===status),{id,status},{timeout:180000});
}
async function attach(p){
  p.on('pageerror',e=>report.pageErrors.push({url:p.url(),message:e.message,stack:e.stack}));
  p.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({url:p.url(),text:m.text(),location:m.location()});});
}
try{
  await mkdir(dirname(output),{recursive:true});
  server=await serve({candidate:site},true,'require-corp');
  const url='http://127.0.0.1:'+server.address().port+'/candidate/pages/step4-ui.html';
  browser=await browsers[engine].launch({headless:true});report.browser=browser.version();
  context=await browser.newContext({viewport:{width,height:900}});
  context.on('request',r=>{if(/^https?:/.test(r.url())){pending.add(r);lastRequestActivity=Date.now();}});
  context.on('requestfinished',r=>{pending.delete(r);lastRequestActivity=Date.now();});
  context.on('requestfailed',r=>{pending.delete(r);lastRequestActivity=Date.now();report.failedRequests.push({url:r.url(),error:r.failure()});});
  context.on('response',r=>{const entry={url:r.url(),status:r.status()};report.responses.push(entry);if(r.status()>=400)report.badResponses.push(entry);});
  await context.exposeBinding('__focusedObserve',({frame},kind,value)=>{report[kind].push({frame:frame.url(),value});});
  await context.addInitScript(()=>{
    window.__focusedResults=[];
    addEventListener('error',e=>{if(e instanceof ErrorEvent)window.__focusedObserve('windowErrors',{message:e.message,filename:e.filename,line:e.lineno,column:e.colno});},true);
    addEventListener('unhandledrejection',e=>window.__focusedObserve('unhandledRejections',String(e.reason?.stack||e.reason)));
    document.addEventListener('ctm:result',e=>{window.__focusedResults.push(e.detail);window.__focusedObserve('results',e.detail);});
    document.addEventListener('ctm:store-restore',e=>window.__focusedObserve('restores',e.detail));
    document.addEventListener('load',e=>{if(e.target?.id==='MathJax-script')window.__focusedNativeLoader={src:e.target.src,version:window.MathJax?.version,readyMethod:typeof window.MathJax?.startup?.defaultReady};},true);
  });
  await checkpoint('load');page=await context.newPage();await attach(page);await page.goto(url,{waitUntil:'load',timeout:180000});
  assert.equal(await page.evaluate(()=>crossOriginIsolated),true);
  await quiz().locator('button').first().waitFor({timeout:90000});assert.equal(await quiz().locator('button').count(),2);
  // Save both ordinary answers through real input widgets, without grading them.
  const savedCode='def double(x):\n    return x * 2';
  await checkpoint('ordinary-save');
  await code('step4-ui-autosave',savedCode);
  await openAncestors(cell('step4-ui-autosave-math'));await cell('step4-ui-autosave-math').locator('.math-input').fill('4');
  await page.waitForFunction(expected=>{
    const read=id=>JSON.parse(localStorage.getItem(CTMStore.key(id))||'null');
    return read('step4-ui-autosave')?.inputs?.code===expected&&read('step4-ui-autosave-math')?.inputs?.fields?.f1==='4';
  },savedCode,{timeout:10000});
  report.steps.push('ordinary Python and mathematics inputs saved without Check/Run');
  // Real mixed quiz grades: wrong first, then correct, using actual controls.
  await checkpoint('math-real-grading');await tile(0,'step4-ui-quiz-math');
  await cell('step4-ui-quiz-math').locator('.math-input').fill('6');await cell('step4-ui-quiz-math').locator('.math-check-btn').click();await waitResult('step4-ui-quiz-math','wrong');
  await cell('step4-ui-quiz-math').locator('.math-input').fill('7');await cell('step4-ui-quiz-math').locator('.math-check-btn').click();await waitResult('step4-ui-quiz-math','correct');
  await checkpoint('python-real-grading');await tile(1,'step4-ui-quiz-python');
  await cell('step4-ui-quiz-python').locator('.py-exercise-check').click();await waitResult('step4-ui-quiz-python','wrong');
  await code('step4-ui-quiz-python','def quiz_sum(a, b):\n    return a + b');
  await cell('step4-ui-quiz-python').locator('.py-exercise-check').click();await waitResult('step4-ui-quiz-python','correct');
  await page.waitForFunction(()=>document.querySelector('.ctm-progress-slot[data-ctm-quiz="step4-ui-quiz"] .ctm-progress-total')?.textContent==='2 of 2');
  assert.deepEqual(await quiz().locator('button').evaluateAll(nodes=>nodes.map(n=>n.dataset.status)),['correct','correct']);
  report.quiz={total:await quiz().locator('.ctm-progress-total').textContent(),tiles:await quiz().locator('button').allTextContents()};
  // The page's actual hidden board, not a synthetic conversion or substitute.
  await checkpoint('board');const board=page.locator('#ui-board iframe');await openAncestors(board);await board.scrollIntoViewIfNeeded();
  report.boardBounds=await board.evaluate(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height,viewport:innerWidth};});
  assert.ok(report.boardBounds.width>0&&report.boardBounds.height>0&&report.boardBounds.left>=-1&&report.boardBounds.right<=report.boardBounds.viewport+1,'revealed board must fit viewport');
  assert.equal(await board.getAttribute('sandbox'),'allow-scripts');
  const frame=await board.elementHandle().then(h=>h.contentFrame());assert.ok(frame);
  await frame.waitForFunction(()=>!!window.MathJax?.startup?.promise,null,{timeout:90000});
  await frame.waitForFunction(()=>[...document.querySelectorAll('.jxgbox mjx-container')].some(n=>n.querySelector('svg path,svg use')&&n.getAttribute('data-semantic-speech-none')==='x squared plus 1'&&n.getAttribute('data-semantic-braille')==='⠭⠘⠆⠐⠬⠂'),null,{timeout:90000});
  report.board=await frame.evaluate(()=>{const svg=document.querySelector('.jxgbox svg'),r=svg?.getBoundingClientRect();return {origin:self.origin,svgBounds:r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,viewport:innerWidth}:null,loader:__focusedNativeLoader,attributes:[...document.getElementById('MathJax-script').attributes].map(a=>a.name).sort(),labels:[...document.querySelectorAll('.jxgbox mjx-container')].map(n=>({glyphs:n.querySelectorAll('svg path,svg use').length,speech:n.getAttribute('data-semantic-speech-none'),braille:n.getAttribute('data-semantic-braille')}))};});
  assert.equal(report.board.origin,'null');assert.deepEqual(report.board.attributes,['async','id','src']);
  assert.equal(report.board.loader.version,'4.1.3');assert.equal(report.board.loader.readyMethod,'function');
  assert.ok(report.board.svgBounds?.width>0&&report.board.svgBounds?.height>0);
  await page.screenshot({path:output.replace(/\.json$/,'-board.png'),fullPage:true});
  // A fresh page in the same context exercises reopen, including no automatic grade.
  await checkpoint('settle-before-reopen');await settle();await page.close();await checkpoint('reopen');page=await context.newPage();await attach(page);await page.goto(url,{waitUntil:'load',timeout:180000});
  await page.waitForFunction(expected=>window.monaco?.editor?.getModels().some(model=>model.getValue()===expected),savedCode,{timeout:90000});
  await openAncestors(cell('step4-ui-autosave-math'));
  assert.equal(await cell('step4-ui-autosave-math').locator('.math-input').inputValue(),'4');
  report.reopened=await page.evaluate(()=>({models:monaco.editor.getModels().map(model=>model.getValue()),automaticResults:__focusedResults,
    records:Object.fromEntries(['step4-ui-autosave','step4-ui-autosave-math'].map(id=>[id,JSON.parse(localStorage.getItem(CTMStore.key(id)))]))}));
  assert.deepEqual(report.reopened.automaticResults,[],'reopen must restore without automatically checking/running');
  report.steps.push('fresh page restored ordinary code and math input without grading');
  await checkpoint('final-settle');await settle();
  await page.screenshot({path:output.replace(/\.json$/,'.png'),fullPage:true});
  for(const key of ['pageErrors','windowErrors','unhandledRejections','consoleErrors','failedRequests','badResponses'])assert.deepEqual(report[key],[],key);
  report.passed=true;
}catch(error){report.error=String(error.stack||error);process.exitCode=1;
  if(page&&!page.isClosed())try{report.failureState=await bounded(page.evaluate(()=>({models:window.monaco?.editor?.getModels().map(m=>m.getValue()),inputs:[...document.querySelectorAll('.math-input')].map(n=>({id:n.id,value:n.value})),storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),active:document.activeElement?.outerHTML,quiz:document.querySelector('.ctm-progress-slot[data-ctm-quiz="step4-ui-quiz"]')?.outerHTML})),10000,'failure snapshot');}catch(diagnostic){report.diagnosticError=String(diagnostic);}
  if(page&&!page.isClosed())try{await bounded(page.screenshot({path:output.replace(/\.json$/,'-failure.png'),fullPage:true}),10000,'failure screenshot');}catch(diagnostic){report.screenshotError=String(diagnostic);}
}
finally{
  report.pendingBeforeTeardown=[...pending].map(r=>r.url());
  if(context)await context.close();if(browser)await browser.close();if(server)await new Promise(done=>server.close(done));
  if(report.passed)for(const key of ['pageErrors','windowErrors','unhandledRejections','consoleErrors','failedRequests','badResponses'])if(report[key].length){report.passed=false;report.error='Raw failure retained during teardown: '+key;process.exitCode=1;}
  await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:report.passed,error:report.error}));
}
