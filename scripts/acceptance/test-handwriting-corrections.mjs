// Render both handwriting pages first. Exercises the real UI and photographs
// against a local provider stub; it does not measure a live model's vision.
// CTM_PLAYWRIGHT_MODULE may name an installed Playwright index.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const site = path.resolve(process.argv[2] || path.join(root, '_site'));
const artifacts = path.resolve(process.argv[3] || '/tmp/handwriting-corrections');
const {chromium} = await import(process.env.CTM_PLAYWRIGHT_MODULE || 'playwright');
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.svg':'image/svg+xml', '.json':'application/json'};
const server = createServer(async (req, res) => {
  try {
    const filename = path.resolve(site, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!filename.startsWith(site + path.sep)) {res.writeHead(403).end(); return;}
    res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream');
    res.end(await fs.readFile(filename));
  } catch {res.writeHead(404).end();}
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
let browser;
const results = [];
try {
  browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_EXECUTABLE || undefined, args:['--no-sandbox']});
  await fs.mkdir(artifacts, {recursive:true});
  for (const [lang, name, width] of [['en','handwriting-ai',1280], ['nb','handskrift-ki',1280], ['en','handwriting-ai',390]]) {
    // The worker used for Python isolation otherwise bypasses provider routes.
    // This check exercises feedback, without starting the Python runtime.
    const context = await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
    const page = await context.newPage(), requests = [], errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let failCorrection = true;
    await page.route('**/*', async route => {
      const url = route.request().url();
      if (!url.startsWith(base + '/')) {await route.abort(); return;}
      if (!url.endsWith('/mock/v1/chat/completions')) {await route.continue(); return;}
      const body = route.request().postDataJSON();
      requests.push(body);
      const user = body.messages[1].content, data = JSON.parse(Array.isArray(user) ? user[0].text : user);
      if (data.correction?.previousFeedback && failCorrection) {
        failCorrection = false; await route.fulfill({status:503,body:'Try again later.'}); return;
      }
      const text = data.correction?.previousFeedback
        ? lang === 'nb' ? 'Jeg leste tiden feil. Det står 0,53 s på bildet. Utregningen din stemmer.' : 'I misread the time. The image says 0.53 s. Your calculation is consistent.'
        : lang === 'nb' ? 'Kontroller tiden på den andre linjen.' : 'Check the time on the second line.';
      await route.fulfill({contentType:'application/json',body:JSON.stringify({choices:[{finish_reason:'stop',message:{content:text}}]})});
    });
    try {
      await page.goto(base + '/pages/' + name + '.html', {waitUntil:'load'});
      await page.waitForFunction(() => !!window.AIFeedback?.saveConfig);
      await page.evaluate(base => window.AIFeedback.saveConfig({mode:'api',baseUrl:base+'/mock/v1',model:'custom-vision',apiKey:'local-test',storage:'session'}), base);
      await page.getByRole('tab',{name:'4',exact:true}).click();
      const activity = page.locator('#v25-4b');
      const upload = activity.locator('input[type=file]');
      const originalText = activity.locator(':scope > textarea');
      await upload.setInputFiles(path.join(root, 'assets/handskrift/student1/4b.png'));
      const trigger = activity.getByRole('button',{name:lang === 'nb'?'Tilbakemelding':'Feedback',exact:true});
      for (let i = 1; i <= 4; i++) {
        await trigger.click();
        await page.waitForFunction(id => document.querySelector('#'+id+' .ai-feedback-output')?.getAttribute('aria-busy') === 'false', 'v25-4b');
        assert.match(await activity.locator('.ai-feedback-output').innerText(), new RegExp('Hint '+i));
      }
      assert.equal(await originalText.getAttribute('readonly'), '');
      const originalImage = requests[0].messages[1].content.find(c => c.type === 'image_url').image_url.url;
      assert.ok(originalImage.length > 1000, 'actual physics photograph submitted');
      await activity.getByRole('button',{name:lang === 'nb'?'KI-en misforsto besvarelsen min':'The AI misunderstood my work',exact:true}).click();
      const form = activity.locator('.ai-feedback-correction form');
      const note = lang === 'nb'?'På andre linje står det t = 0,53 s.':'The second line says t = 0.53 s.';
      await form.locator('textarea').fill(note);
      await form.screenshot({path:path.join(artifacts,lang+'-'+width+'-form.png')});
      const submit = form.getByRole('button',{name:lang === 'nb'?'Oppdater tilbakemeldingen':'Update feedback',exact:true});
      await submit.click();
      await form.getByRole('status').filter({hasText:'503'}).waitFor();
      assert.match(await activity.locator('.ai-feedback-hint').innerText(), /4$/);
      assert.match(await activity.locator('.ai-feedback-body').innerText(), /second line|andre linjen/);
      await submit.click();
      await page.waitForFunction(id => document.querySelector('#'+id+' .ai-feedback-hint')?.textContent.trim().endsWith('1') && !document.querySelector('#'+id+' .ai-feedback-correction form'), 'v25-4b');
      const corrected = requests.at(-1);
      const payload = JSON.parse(corrected.messages[1].content[0].text);
      assert.equal(payload.correction.note, note);
      assert.match(payload.correction.previousFeedback, /second line|andre linjen/);
      assert.equal(corrected.messages[1].content.find(c => c.type === 'image_url').image_url.url, originalImage);
      assert.match(corrected.messages[0].content, /CURRENT HINT LEVEL: 1 OF 4/);
      assert.match(corrected.messages[0].content, /Do not supply a complete/);
      assert.match(corrected.messages[0].content, /do not ask follow-up questions/);
      await activity.locator('.ai-feedback-output').screenshot({path:path.join(artifacts,lang+'-'+width+'.png')});
      await trigger.click();
      await page.waitForFunction(id => document.querySelector('#'+id+' .ai-feedback-hint')?.textContent.trim().endsWith('2'), 'v25-4b');
      assert.equal(JSON.parse(requests.at(-1).messages[1].content[0].text).correction.note, note);
      assert.equal(await activity.locator('.ai-feedback-correction form').count(), 0);
      await upload.setInputFiles(path.join(root, 'assets/handskrift/student2/4b.png'));
      assert.equal(await activity.locator('.ai-feedback-output').innerText(), '');
      assert.equal(await originalText.getAttribute('readonly'), null);
      await trigger.click();
      await page.waitForFunction(id => document.querySelector('#'+id+' .ai-feedback-hint')?.textContent.trim().endsWith('1'), 'v25-4b');
      assert.equal(JSON.parse(requests.at(-1).messages[1].content[0].text).correction, undefined);
      assert.equal(await activity.locator('.ai-feedback-correction form').count(), 1);

      // A text-or-photo subtask: typed text survives an upload, a changed
      // feedback language asks for fresh feedback without sending, and
      // text-only feedback never locks the box.
      await page.getByRole('tab',{name:'6',exact:true}).click();
      const textOrPhoto = page.locator('#v25-6c'), box = textOrPhoto.locator(':scope > textarea');
      const typed = lang === 'nb' ? 'I serie har R1 størst effekt fordi P = I^2 R.' : 'In series R1 has the largest power because P = I^2 R.';
      await box.fill(typed);
      await textOrPhoto.locator('input[type=file]').setInputFiles(path.join(root, 'assets/handskrift/student1/4b.png'));
      assert.equal(await box.inputValue(), typed);
      assert.equal(await box.getAttribute('readonly'), null);
      const trigger6 = textOrPhoto.getByRole('button',{name:lang === 'nb'?'Tilbakemelding':'Feedback',exact:true});
      await trigger6.click();
      await page.waitForFunction(id => document.querySelector('#'+id+' .ai-feedback-output')?.getAttribute('aria-busy') === 'false', 'v25-6c');
      assert.equal(await box.getAttribute('readonly'), '');
      assert.equal(JSON.parse(requests.at(-1).messages[1].content[0].text).responses[0].value, typed);
      await textOrPhoto.locator('select.form-select').selectOption('German');
      await textOrPhoto.getByRole('button',{name:lang === 'nb'?'KI-en misforsto besvarelsen min':'The AI misunderstood my work',exact:true}).click();
      const form6 = textOrPhoto.locator('.ai-feedback-correction form');
      await form6.locator('textarea').fill(note);
      const sentBefore = requests.length;
      await form6.getByRole('button',{name:lang === 'nb'?'Oppdater tilbakemeldingen':'Update feedback',exact:true}).click();
      await textOrPhoto.locator('.ai-feedback-correction').getByText(lang === 'nb' ? /Innstillingene for tilbakemelding er endret/ : /The feedback settings changed/).waitFor();
      assert.equal(requests.length, sentBefore);
      assert.equal(await textOrPhoto.locator('.ai-feedback-correction form').count(), 0);
      assert.match(await textOrPhoto.locator('.ai-feedback-hint').innerText(), /1$/);
      await textOrPhoto.getByRole('button',{name:lang === 'nb'?'Fjern bilder':'Remove images',exact:true}).click();
      assert.equal(await box.getAttribute('readonly'), null);
      assert.equal(await box.inputValue(), typed);
      await box.fill(typed + ' (text only)');
      await trigger6.click();
      await page.waitForFunction(id => document.querySelector('#'+id+' .ai-feedback-output')?.getAttribute('aria-busy') === 'false', 'v25-6c');
      assert.equal(await box.getAttribute('readonly'), null);
      assert.equal(await textOrPhoto.locator('.ai-feedback-correction').count(), 0);
      assert.deepEqual(errors, []);
      results.push({lang,width,passed:true,provider:'local stub',realPhotographs:['student1/4b.png','student2/4b.png'],requests:requests.length});
    } catch (error) {
      const state = {error:String(error),errors,requests:requests.map(r => ({system:r.messages[0].content})),
        activity:await page.locator('#v25-4b').innerText().catch(() => '')};
      await fs.writeFile(path.join(artifacts,'failure.json'),JSON.stringify(state,null,2)+'\n');
      await page.screenshot({path:path.join(artifacts,'failure.png'),fullPage:true});
      console.error(JSON.stringify({error:String(error),errors,activity:state.activity},null,2));
      throw error;
    } finally {await context.close();}
  }
  await fs.writeFile(path.join(artifacts,'results.json'),JSON.stringify({passed:true,cases:results},null,2)+'\n');
  console.log(JSON.stringify({passed:true,cases:results,artifacts},null,2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
