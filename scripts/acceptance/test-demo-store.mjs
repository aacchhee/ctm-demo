// Real rendered saving/IDE acceptance. Source review is required before execution.
// Only Monaco selection uses its public API; all answer edits/checks/reset/delete
// actions use keyboard input and actual controls. No result/runtime stubs.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const args = process.argv.slice(2);
function option(name) {
  const i = args.indexOf('--' + name);
  assert.ok(i >= 0 && args[i + 1], 'Missing --' + name);
  return args[i + 1];
}
const engine = option('browser'), site = resolve(option('site'));
const tooling = resolve(option('tooling')), output = resolve(option('output'));
assert.ok(['chromium', 'firefox', 'webkit'].includes(engine));
const {serve} = await import(pathToFileURL(resolve(tooling, 'tools/compare-browser.mjs')));
const playwright = await import(process.env.CTM_PLAYWRIGHT_MODULE || 'playwright');
const PY = 'step4-ui-quiz-python', MATH = 'step4-ui-quiz-math', IDE = 'step4-ui-ide';
const MARKER = 'CTM_SAVED_ANSWER_CANARY';
const CODE = 'def quiz_sum(a, b):\n    return a + b  # ' + MARKER;
const IDE_CODE = 'print(12 * 7)  # ' + MARKER;
const PY_START = 'def quiz_sum(a, b):\n    return a - b';
const IDE_START = 'print(6 * 7)';
const OTHER_KEY = 'ctm|1|acceptance-other-course|other-page|opaque-sentinel';
const OTHER_VALUE = 'must survive the candidate course delete';
const USER_TIMING = ['mark', 'measure', 'clearMarks', 'clearMeasures', 'getEntries', 'getEntriesByName', 'getEntriesByType'];
const selectors = {[PY]: '[data-ctm-id="' + PY + '"]',
  [MATH]: '[data-ctm-id="' + MATH + '"]',
  [IDE]: '.qpyodide-interactive-area[data-id="' + IDE + '"]'};
const report = {passed: false, scope: 'real-page saved answers; desktop require-corp; real runtime clock then separate frozen debounce phase',
  engine, site, tooling, pageSha256: createHash('sha256').update(await readFile(resolve(site, 'pages/step4-ui.html'))).digest('hex'),
  pageErrors: [], windowErrors: [], unhandledRejections: [], observerErrors: [], consoleErrors: [], failedRequests: [], badResponses: [], responses: [], dialogs: [], pages: [], checkpoints: [], phaseLog: []};
let server, browser, context, page, peer;
const pending = new Set();
let lastHTTPActivity = Date.now();

// This observer does not construct/replace workers or alter packet contents.
// Own data descriptors avoid invoking payload getters. Observation failures are
// retained separately and cannot stop native forwarding or change its throw.
function installObserver() {
  const state = window.__demoStoreAudit = {phase: 'initial-load', packets: [], replies: [], pending: [], events: [], windowErrors: [], rejections: [], observerErrors: []};
  function deliver(kind, value) {
    try { window.__demoStoreRaw(kind, value).catch(error => state.observerErrors.push('Raw binding: ' + error)); }
    catch (error) { state.observerErrors.push('Raw binding: ' + error); }
  }
  function observerError(error) { const value = String(error); state.observerErrors.push(value); deliver('observerErrors', value); }
  const workerIds = new WeakMap(); let nextWorker = 0;
  function primitive(object, key) { return Object.getOwnPropertyDescriptor(object, key)?.value; }
  const clip = value => typeof value === 'string' ? value.slice(0, 131072) : value;
  const rpc = new Set(['init', 'runPython', 'runCell', 'setGlobal', 'loadPackage', 'loadPackagesFromImports']);
  const descriptor = Object.getOwnPropertyDescriptor(Worker.prototype, 'postMessage');
  const original = descriptor.value;
  Object.defineProperty(Worker.prototype, 'postMessage', {...descriptor, value: function () {
    try {
      let worker = workerIds.get(this);
      if (!worker) {
        worker = ++nextWorker; workerIds.set(this, worker);
        this.addEventListener('message', event => {
          try {
            const msg = event.data;
            if (!msg || typeof msg !== 'object') return;
            const type = primitive(msg, 'type'), id = primitive(msg, 'id');
            if (type === 'result' || type === 'error') {
              state.pending = state.pending.filter(item => item.worker !== worker || item.id !== id);
              state.replies.push({phase: state.phase, at: performance.now(), worker, type, id});
            }
          } catch (error) { observerError(error); }
        });
      }
      const msg = arguments[0];
      const row = {phase: state.phase, at: performance.now(), worker, argumentCount: arguments.length};
      if (msg && typeof msg === 'object') {
        for (const key of ['type', 'id', 'name', 'code', 'value']) {
          const value = primitive(msg, key);
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) row[key] = clip(value);
          if (typeof value === 'string' && value.length > 131072) row[key + 'Truncated'] = value.length;
          if ((key === 'code' || key === 'value') && typeof value === 'string') row[key + 'HasLearnerMarker'] = value.includes('CTM_SAVED_ANSWER_CANARY');
        }
        if (rpc.has(row.type) && Number.isInteger(row.id)) state.pending.push({worker, id: row.id, type: row.type});
      } else row.messageKind = typeof msg;
      state.packets.push(row);
    } catch (error) { observerError(error); }
    return Reflect.apply(original, this, arguments);
  }});
  addEventListener('error', event => {
    if (event instanceof ErrorEvent) {
      const value = {message: event.message, filename: event.filename, line: event.lineno, column: event.colno};
      state.windowErrors.push(value); deliver('windowErrors', value);
    }
  }, true);
  addEventListener('unhandledrejection', event => {
    const value = String(event.reason?.stack || event.reason); state.rejections.push(value); deliver('unhandledRejections', value);
  });
  for (const type of ['ctm:result', 'ctm:store-restore', 'ctm:store-clear', 'ctm:store-enabled']) {
    document.addEventListener(type, event => state.events.push({type, phase: state.phase, detail: event.detail}));
  }
}

async function poll(read, message, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (true) {
    if (await read()) return;
    assert.ok(Date.now() < deadline, message);
    await new Promise(done => setTimeout(done, 25));
  }
}
async function bounded(promise, message, timeout = 10000) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message + ' timed out after ' + timeout + 'ms')), timeout); })]); }
  finally { clearTimeout(timer); }
}
async function checkpoint(label) {
  const row = {label, at: new Date().toISOString()}; report.phaseLog.push(row);
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({phase: label, pageErrors: report.pageErrors.length, failedRequests: report.failedRequests.length}));
}
const root = (p, id) => p.locator(selectors[id]);
async function phase(p, name) { await p.evaluate(name => { __demoStoreAudit.phase = name; }, name); await checkpoint(name); }
async function audit(p) { return p.evaluate(() => __demoStoreAudit); }
async function record(p, id) { return p.evaluate(id => JSON.parse(localStorage.getItem(CTMStore.key(id)) || 'null'), id); }
async function model(p, id) {
  return root(p, id).evaluate(element => {
    const editor = monaco.editor.getEditors().find(editor => element.contains(editor.getDomNode()));
    if (!editor) throw new Error('Scoped Monaco editor is missing');
    return editor.getValue();
  });
}
async function openAncestors(p, locator) {
  const tabs = await locator.evaluate(element => {
    const ids = []; for (let node = element; node; node = node.parentElement) if (node.classList.contains('tab-pane')) ids.unshift(node.getAttribute('aria-labelledby'));
    return ids;
  });
  for (const id of tabs) if (await p.locator('[id="' + id + '"]').getAttribute('aria-selected') !== 'true') await p.locator('[id="' + id + '"]').click();
  for (const detail of (await locator.locator('xpath=ancestor::details[not(@open)]').all()).reverse()) await detail.locator(':scope > summary').click();
  const caption = locator.locator(':scope > .math-exercise-toggle[aria-expanded="false"]');
  if (await caption.count()) await caption.click();
}
async function code(p, id, value, frozen = false) {
  await p.bringToFront();
  const node = root(p, id);
  if (!frozen) await openAncestors(p, node);
  await node.locator('.monaco-editor').waitFor({state: 'visible', timeout: 90000});
  // Public selection bridge, needed for host/WebKit shortcut differences.
  // Every content mutation below is actual keyboard input.
  const focused = await node.evaluate(element => {
    const editor = monaco.editor.getEditors().find(editor => element.contains(editor.getDomNode()));
    if (!editor) throw new Error('Scoped Monaco editor is missing');
    editor.focus(); editor.setSelection(editor.getModel().getFullModelRange());
    return document.activeElement === editor.getDomNode().querySelector('textarea.inputarea');
  });
  if (!focused) await node.locator('.monaco-editor textarea.inputarea').focus();
  const precondition = await node.evaluate(element => {
    const editor = monaco.editor.getEditors().find(editor => element.contains(editor.getDomNode()));
    editor.setSelection(editor.getModel().getFullModelRange());
    const input = editor.getDomNode().querySelector('textarea.inputarea');
    return {documentHasFocus: document.hasFocus(), scopedTextareaActive: !!input && document.activeElement === input && element.contains(input),
      activeTag: document.activeElement?.tagName, activeClass: document.activeElement?.className,
      selection: editor.getSelection(), selectionCoversModel: editor.getModel().getValueInRange(editor.getSelection()) === editor.getValue()};
  });
  (report.inputActions ||= []).push({id, frozen, fallbackNativeFocus: !focused, ...precondition});
  assert.equal(precondition.documentHasFocus, true, 'Target tab must be foreground before keyboard input');
  assert.equal(precondition.scopedTextareaActive, true, 'Actual active textarea must belong to the scoped editor before Backspace');
  assert.equal(precondition.selectionCoversModel, true, 'Selection must cover the actual scoped model before Backspace');
  await p.keyboard.press('Backspace');
  await poll(async () => await model(p, id) === '', 'Keyboard must clear the scoped model');
  for (const [i, line] of value.split('\n').entries()) {
    if (i) await p.keyboard.press('Enter');
    await p.keyboard.insertText(i ? line.trimStart() : line);
  }
  assert.equal(await model(p, id), value, 'Typed scoped Monaco model must exactly match before persistence/grade assertions');
}
async function control(p, selector) {
  await p.bringToFront();
  // Keyboard activation also works when the deliberate debounce clock is paused.
  const button = p.locator(selector); await button.focus(); await p.keyboard.press('Enter');
}
async function result(p, id, action) {
  const before = (await audit(p)).events.filter(e => e.type === 'ctm:result').length;
  await action();
  await poll(async () => (await audit(p)).events.filter(e => e.type === 'ctm:result').slice(before).some(e => e.detail.id === id && e.detail.status === 'correct'), 'Real correct result for ' + id, 180000);
  await poll(async () => (await record(p, id))?.result?.status === 'correct', 'Correct result must persist');
}
async function settle(p) {
  // Count context-wide requests, including worker/frame downloads. A native
  // networkidle lifecycle event can remain absent after those requests finish.
  await bounded(poll(async () => pending.size === 0 && Date.now() - lastHTTPActivity >= 500 && (await audit(p)).pending.length === 0,
    'HTTP quiet for500ms and observed worker RPC settled before navigation/close', 30000), 'HTTP/RPC settle', 30000);
}
async function capture(p, label) {
  return bounded(captureActual(p, label), 'Capture ' + label, 10000);
}
async function captureActual(p, label) {
  // Store/learner execution lives in the main frame. Enumerate hidden frames
  // without evaluating them; all-frame lifecycle errors still stream through
  // __demoStoreRaw and the separate board harness checks the revealed iframe.
  const frameInventory = p.frames().map(frame => ({url: frame.url(), main: frame === p.mainFrame()}));
  const frames = [{url: p.url(), audit: await audit(p)}];
  const state = await p.evaluate(() => ({storage: Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])),
    proxy: !!window.mainPyodide?.isWorkerProxy, enabled: window.CTMStore?.enabled(),
    documentHasFocus: document.hasFocus(), activeElement: {tag: document.activeElement?.tagName, className: document.activeElement?.className,
      owner: document.activeElement?.closest('[data-ctm-id],.qpyodide-interactive-area[data-id]')?.outerHTML.slice(0, 250)},
    editorSelections: window.monaco?.editor.getEditors().map(editor => ({hasTextFocus: editor.hasTextFocus(), selection: editor.getSelection()})),
    models: window.monaco?.editor.getModels().map(model => model.getValue())}));
  report.pages.push({label, url: p.url(), frameInventory, frames, state});
  await checkpoint(label);
}
async function newPage(url) {
  await checkpoint('load-real-page-start');
  const p = await context.newPage();
  p.on('pageerror', error => report.pageErrors.push({url: p.url(), message: error.message, stack: error.stack}));
  p.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({url: p.url(), text: message.text(), location: message.location()}); });
  p.on('dialog', async dialog => { report.dialogs.push({type: dialog.type(), message: dialog.message()}); await dialog.accept(); });
  await p.goto(url, {waitUntil: 'load', timeout: 180000});
  assert.equal(await p.evaluate(() => crossOriginIsolated), true);
  await p.locator(selectors[IDE]).waitFor({state: 'attached', timeout: 90000});
  await p.waitForFunction(() => window.monaco?.editor?.getEditors().length >= 3, null, {timeout: 90000});
  // Await only the already-started canonical runtime; never call ensure/run here.
  const proxy = await bounded(p.evaluate(async () => {
    const current = typeof qpyodideInstance !== 'undefined' ? qpyodideInstance : window.mainPyodide;
    const py = await current; if (py?.whenSetup) await py.whenSetup; return !!py?.isWorkerProxy;
  }), 'Already-started canonical runtime setup', 180000);
  assert.equal(proxy, true, 'Worker-only execution observer requires the actual canonical worker proxy; a main-thread fallback needs a separate audit');
  await settle(p); await checkpoint('real-page-runtime-ready'); return p;
}
function checkPositive(trace, withIDE) {
  assert.ok(trace.packets.some(row => row.type === 'setGlobal' && row.name === '_ctm_py_request' && row.valueHasLearnerMarker), 'Real Python Check must reach observed native worker');
  assert.ok(trace.packets.some(row => row.type === 'runPython'), 'Check must execute the private Python wrapper');
  if (withIDE) assert.ok(trace.packets.some(row => row.type === 'runCell' && row.codeHasLearnerMarker), 'Real IDE Run must reach observed native worker');
}
function checkPassive(trace) {
  assert.deepEqual(trace.events.filter(e => e.type === 'ctm:result'), [], 'Restoration must not emit a fresh grade');
  assert.deepEqual(trace.packets.filter(row => row.type === 'runCell' || row.type === 'runPython' && row.codeHasLearnerMarker || row.type === 'setGlobal' && ['_ctm_py_request', '_ctm_request'].includes(row.name)), [], 'No learner Run/private Check requests during restoration');
  assert.deepEqual(trace.observerErrors, []);
}
async function runIDE(p, expected) {
  const node = root(p, IDE); await openAncestors(p, node);
  await node.locator('.qpyodide-button-run').click();
  await poll(async () => (await node.locator('.qpyodide-output-code-area').innerText()).trim() === expected, 'Real IDE output ' + expected, 180000);
  await poll(async () => await node.locator('.qpyodide-button-run').isEnabled(), 'IDE Run must finish');
}

try {
  await mkdir(dirname(output), {recursive: true});
  server = await serve({candidate: site}, true, 'require-corp');
  const url = 'http://127.0.0.1:' + server.address().port + '/candidate/pages/step4-ui.html';
  browser = await playwright[engine].launch({headless: true}); report.browser = browser.version();
  context = await browser.newContext({viewport: {width: 1280, height: 900}, acceptDownloads: true});
  context.on('request', request => { if (/^https?:/.test(request.url())) { pending.add(request); lastHTTPActivity = Date.now(); } });
  context.on('requestfinished', request => { pending.delete(request); lastHTTPActivity = Date.now(); });
  context.on('requestfailed', request => { pending.delete(request); lastHTTPActivity = Date.now(); report.failedRequests.push({url: request.url(), error: request.failure()}); });
  context.on('response', response => { const row = {url: response.url(), status: response.status()}; report.responses.push(row); if (row.status >= 400) report.badResponses.push(row); });
  await context.exposeBinding('__demoStoreRaw', ({frame}, kind, value) => {
    assert.ok(['windowErrors', 'unhandledRejections', 'observerErrors'].includes(kind));
    report[kind].push({frame: frame.url(), value});
  });
  await context.addInitScript(installObserver);
  page = await newPage(url); checkPassive(await audit(page));
  await phase(page, 'real-grade-and-run');
  await code(page, PY, CODE);
  await result(page, PY, () => root(page, PY).locator('.py-exercise-check').click());
  await openAncestors(page, root(page, MATH)); await root(page, MATH).locator('.math-input').fill('7');
  await result(page, MATH, () => root(page, MATH).locator('.math-check-btn').click());
  await runIDE(page, '42'); await code(page, IDE, IDE_CODE); await runIDE(page, '84');
  await poll(async () => (await record(page, IDE))?.inputs?.code === IDE_CODE, 'IDE code must save through its real adapter');
  const originalPython = await record(page, PY), originalMath = await record(page, MATH);
  checkPositive(await audit(page), true);
  assert.ok((await audit(page)).packets.some(row => row.type === 'setGlobal' && row.name === '_ctm_request'), 'Real math Check positively exercises the observed private-request path');
  // Opaque sentinel belongs to another course; no candidate answer/result is seeded.
  await page.evaluate(({key, value}) => localStorage.setItem(key, value), {key: OTHER_KEY, value: OTHER_VALUE});
  const manifest = await page.locator('#ctm-store-manifest').textContent().then(JSON.parse);
  if (manifest.export) {
    await page.locator('[data-ctm-export]').click();
    const text = await page.locator('#ctm-export-view textarea').inputValue();
    assert.ok(text.includes(CODE) && text.includes(IDE_CODE) && text.includes('Last checked'));
    report.export = {enabled: true, markdown: text, downloads: []};
    for (const [label, suffix] of [[manifest.messages.downloadMarkdown, '.md'], [manifest.messages.downloadHTML, '.html']]) {
      const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#ctm-export-view').getByRole('button', {name: label, exact: true}).click()]);
      const path = output.replace(/\.json$/, '') + suffix; await download.saveAs(path);
      assert.equal(await download.failure(), null); const content = await readFile(path);
      assert.ok(content.includes(Buffer.from(MARKER)));
      report.export.downloads.push({path, filename: download.suggestedFilename(), sha256: createHash('sha256').update(content).digest('hex')});
    }
    await page.locator('#ctm-export-view').getByRole('button', {name: manifest.messages.exportClose, exact: true}).click();
  } else report.export = {enabled: false};
  await settle(page); await capture(page, 'real-correct-results-and-IDE-output'); await page.close();
  page = await newPage(url); await phase(page, 'passive-reopen');
  await poll(async () => await model(page, PY) === CODE && await model(page, IDE) === IDE_CODE, 'Both Python consumers must restore exact code');
  await openAncestors(page, root(page, MATH)); assert.equal(await root(page, MATH).locator('.math-input').inputValue(), '7');
  assert.match(await root(page, PY).locator('.py-exercise-saved-result').innerText(), /correct.*100|100.*correct/i);
  assert.match(await root(page, MATH).locator('.math-saved-result').innerText(), /correct.*100|100.*correct/i);
  assert.equal((await root(page, IDE).locator('.qpyodide-output-code-area').innerText()).trim(), '', 'Saved IDE output is not rerun on reopen');
  assert.deepEqual(await record(page, PY), originalPython); assert.deepEqual(await record(page, MATH), originalMath);
  await settle(page); checkPassive(await audit(page)); await capture(page, 'passive-restoration-no-learner-run-or-check');
  await phase(page, 'positive-controls-after-reopen');
  await openAncestors(page, root(page, PY));
  await result(page, PY, () => root(page, PY).locator('.py-exercise-check').click());
  await runIDE(page, '84'); checkPositive(await audit(page), true);
  assert.notEqual((await record(page, PY)).result.at, originalPython.result.at, 'Recheck produces a fresh historical timestamp');
  await settle(page); await capture(page, 'observer-positive-controls-after-negative-window');
  // Reset both actual Python consumers, then reload. Mathematics is independent.
  await openAncestors(page, root(page, PY)); await root(page, PY).locator('.py-exercise-reset').click();
  await openAncestors(page, root(page, IDE)); await root(page, IDE).locator('.qpyodide-button-reset').click();
  await poll(async () => await record(page, PY) === null && await record(page, IDE) === null, 'Reset removes both Python records');
  assert.equal(await model(page, PY), PY_START); assert.equal(await model(page, IDE), IDE_START);
  assert.deepEqual(await record(page, MATH), originalMath);
  await settle(page); await capture(page, 'reset-before-reload'); await page.close();
  page = await newPage(url);
  assert.equal(await model(page, PY), PY_START); assert.equal(await model(page, IDE), IDE_START);
  assert.equal(await record(page, PY), null); assert.equal(await record(page, IDE), null);
  assert.deepEqual(await record(page, MATH), originalMath); checkPassive(await audit(page));
  await capture(page, 'reset-remains-starter-after-reload-math-independent');

  // Deterministic autosave/races are separate from the real-runtime-clock proof.
  // Runtime/HTTP work is settled before either page's clock is paused.
  peer = await newPage(url);
  for (const p of [page, peer]) { await openAncestors(p, root(p, IDE)); await openAncestors(p, root(p, PY)); await settle(p); }
  // Playwright1.62 Page.clock is the BrowserContext clock. Install/pause once
  // so both real tabs share the same deterministic debounce time.
  // Its fakePerformance replaces entry queries with empty arrays; Monaco0.46
  // measures actual input latency and reads the corresponding native entry.
  // Preserve the original main documents' bound UserTiming methods/entries.
  // No entry/duration is fabricated; Date/timers/RAF/performance.now stay fake.
  for (const p of [page, peer]) await p.evaluate(names => {
    const native = performance;
    window.__demoNativeUserTiming = Object.fromEntries(names.map(name => {
      if (typeof native[name] !== 'function') throw new Error('Native UserTiming method missing: ' + name);
      return [name, native[name].bind(native)];
    }));
  }, USER_TIMING);
  const at = new Date(); await context.clock.install({time: at});
  for (const p of [page, peer]) await p.evaluate(() => {
    for (const [name, method] of Object.entries(__demoNativeUserTiming)) performance[name] = method;
  });
  report.clockPolicy = {scope: 'two main documents, after the complete real-runtime proof',
    userTiming: 'original bound native methods and native entries', preservedMethods: USER_TIMING,
    fake: ['Date', 'timers', 'requestAnimationFrame', 'performance.now'], fabricatedEntries: false,
    reason: 'Playwright1.62 fakePerformance entry queries return []; Monaco0.46 input-latency timer requires its measured entry'};
  await context.clock.pauseAt(new Date(at.getTime() + 1000));
  for (const p of [page, peer]) await phase(p, 'frozen-250ms-cross-tab-races');
  const pendingCode = 'def quiz_sum(a, b):\n    return a + b  # pending reset';
  const pendingIDE = 'print(3 * 7)  # pending save';
  await code(peer, PY, pendingCode, true);
  assert.equal(await record(peer, PY), null); await peer.clock.runFor(249); assert.equal(await record(peer, PY), null);
  await control(page, selectors[PY] + ' .py-exercise-reset');
  await poll(async () => await model(peer, PY) === PY_START, 'Cross-tab exercise reset clears even a recordless pending edit');
  await peer.clock.runFor(1000); assert.equal(await record(peer, PY), null); assert.deepEqual(await record(peer, MATH), originalMath);
  report.checkpoints.push('recordless pending edit cancelled by another tab exercise reset; math unchanged');
  await checkpoint('exercise-reset-pending-race-passed');
  await code(peer, PY, pendingCode, true);
  await code(peer, IDE, pendingIDE, true);
  await control(page, '[data-ctm-clear-page]');
  await poll(async () => await model(peer, PY) === PY_START && await model(peer, IDE) === IDE_START, 'Cross-tab page clear resets both pending Python inputs');
  await peer.clock.runFor(1000); assert.equal(await record(peer, PY), null); assert.equal(await record(peer, IDE), null); assert.equal(await record(peer, MATH), null);
  report.checkpoints.push('page clear cancels pending edit without a late write');
  await checkpoint('page-clear-pending-race-passed');
  await code(peer, PY, pendingCode, true);
  await code(peer, IDE, pendingIDE, true);
  const beforeOff = await model(peer, PY);
  await control(page, '[data-ctm-save-toggle]');
  await poll(() => peer.evaluate(() => !CTMStore.enabled()), 'Saving-off preference reaches peer');
  assert.equal(await model(peer, PY), beforeOff); assert.equal(await model(peer, IDE), pendingIDE);
  await peer.clock.runFor(1000); assert.equal(await record(peer, PY), null); assert.equal(await record(peer, IDE), null);
  const offCode = 'def quiz_sum(a, b):\n    return a + b  # typed while saving off';
  await code(peer, PY, offCode, true); await code(peer, IDE, IDE_CODE, true);
  await peer.clock.runFor(1000); assert.equal(await record(peer, PY), null); assert.equal(await record(peer, IDE), null);
  await control(page, '[data-ctm-save-toggle]');
  await poll(() => peer.evaluate(() => CTMStore.enabled()), 'Re-enable reaches peer');
  assert.equal(await model(peer, PY), offCode); assert.equal(await model(peer, IDE), IDE_CODE);
  await peer.clock.runFor(1000); assert.equal(await record(peer, PY), null, 'Enabling cannot resurrect an old debounce'); assert.equal(await record(peer, IDE), null);
  await code(peer, PY, pendingCode, true); assert.equal(await record(peer, PY), null);
  await code(peer, IDE, pendingIDE, true); assert.equal(await record(peer, IDE), null);
  await peer.clock.runFor(249); assert.equal(await record(peer, PY), null); assert.equal(await record(peer, IDE), null);
  await peer.clock.runFor(1); assert.equal((await record(peer, PY)).inputs.code, pendingCode, 'Genuine new edit saves at the 250ms debounce boundary');
  assert.equal((await record(peer, IDE)).inputs.code, pendingIDE);
  report.checkpoints.push('save-off/on preserves live code, cancels late writes, new edit saves exactly at250ms');
  await checkpoint('save-off-on-and250ms-boundary-passed');
  await code(peer, PY, offCode, true); // Another pending edit, with an existing durable record.
  await control(page, '[data-ctm-clear-course]');
  await poll(async () => await model(peer, PY) === PY_START && await model(peer, IDE) === IDE_START, 'Course clear resets both Python consumers in the other tab');
  await peer.clock.runFor(1000); assert.equal(await record(peer, PY), null); assert.equal(await record(peer, IDE), null);
  assert.deepEqual(await peer.evaluate(() => Object.keys(localStorage).filter(key => {
    const prefix = 'ctm|1|' + encodeURIComponent(CTMStore.course) + '|';
    return key.startsWith(prefix) && !key.slice(prefix.length).startsWith('~');
  })), [], 'Course clear removes all candidate answer records');
  assert.equal(await peer.evaluate(key => localStorage.getItem(key), OTHER_KEY), OTHER_VALUE);
  report.checkpoints.push('course clear cancels pending edits and preserves the other course sentinel');
  await checkpoint('course-clear-pending-race-passed');
  await context.clock.resume();
  for (const p of [page, peer]) { await settle(p); await capture(p, 'completed-cross-tab-races'); }
  for (const key of ['pageErrors', 'windowErrors', 'unhandledRejections', 'observerErrors', 'consoleErrors', 'failedRequests', 'badResponses']) assert.deepEqual(report[key], [], key);
  for (const saved of report.pages) for (const frame of saved.frames) if (frame.audit) for (const key of ['windowErrors', 'rejections', 'observerErrors']) assert.deepEqual(frame.audit[key], [], key);
  report.passed = true;
} catch (error) {
  report.error = String(error.stack || error); process.exitCode = 1;
  for (const [label, p] of [['failure-page', page], ['failure-peer', peer]]) if (p && !p.isClosed()) try { await capture(p, label); } catch (diagnostic) { (report.diagnosticErrors ||= []).push(String(diagnostic)); }
} finally {
  report.pendingBeforeTeardown = [...pending].map(request => request.url());
  // A successful run must finish all network/runtime work before any close.
  if (report.passed && pending.size) { report.passed = false; report.error = 'Pending HTTP at teardown'; process.exitCode = 1; }
  if (context) await context.close(); if (browser) await browser.close();
  if (server) await new Promise(done => server.close(done));
  if (report.passed) for (const key of ['pageErrors', 'windowErrors', 'unhandledRejections', 'observerErrors', 'consoleErrors', 'failedRequests', 'badResponses']) if (report[key].length) { report.passed = false; report.error = 'Raw failure retained during teardown: ' + key; process.exitCode = 1; }
  await mkdir(dirname(output), {recursive: true}); await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({passed: report.passed, error: report.error, checkpoints: report.checkpoints}));
}
