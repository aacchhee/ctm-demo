// Live AI demos for the talk page (lund.qmd), independent of CTM's AI feedback.
// The page has its own connection (API base URL and key, saved in this browser),
// its own model choice per demo, and calls the OpenAI-compatible
// /chat/completions endpoint directly. Prompts live here, out of sight, until
// the presenter opens "Behind the scenes".
//
//   #lund-connection   API base URL, key, "Fetch models"
//   #lund-two-frames   1b: one problem, one model, two hidden system prompts
//   #lund-two-models   1c: the rectangle or two lines in space, on a small and a large model
//   #lund-html-monster 3a: the page's own HTML for the course exercise in part 5
(function () {
  'use strict';

  // ------------------------------------------------------ models per demo

  // Idun model ids, used until "Fetch models" loads the live list.
  // Ids ending in -instant are the same models with reasoning off.
  const KNOWN_MODELS = [
    'NbAiLab/borealis-27b', 'norallm/normistral-11b-thinking', 'NorwAI/NorwAI-Magistral-24B-reasoning',
    'Qwen/Qwen3.8-27B-FP8', 'mistralai/Mistral-Medium-3.5-128B', 'Inferact/GLM-5.3-NVFP4',
    'deepseek-ai/DeepSeek-V4.1-Flash-1017', 'zai-org/GLM-5.3-Flash', 'openai/gpt-oss-120b', 'moonshotai/Kimi-K2.6'
  ];

  // Preselected models, tuned per demo. Each entry lists choices in order of
  // preference; the first one that is available is selected.
  const PRESETS = {
    frames: [['openai/gpt-oss-120b', 'mistralai/Mistral-Medium-3.5-128B', 'moonshotai/Kimi-K2.6']],
    models: [['NbAiLab/borealis-27b', 'norallm/normistral-11b-thinking', 'NorwAI/NorwAI-Magistral-24B-reasoning'],
             ['openai/gpt-oss-120b', 'moonshotai/Kimi-K2.6', 'Inferact/GLM-5.3-NVFP4']]
  };

  // Answer length and waiting time per demo.
  const LIMITS = {
    frames: [{maxTokens: 4000, timeoutMs: 120000}, {maxTokens: 8000, timeoutMs: 180000}],
    models: {maxTokens: 12000, timeoutMs: 180000}
  };

  const CONNECTION_KEY = 'lund-connection-v1';
  const MODEL_LIST_KEY = 'lund-model-list-v1';
  const CHOICE_KEY = 'lund-model-choice-v1';

  // ------------------------------------------------------------ 1b prompts

  const RECTANGLE = 'A rectangle has perimeter 20 cm. Which rectangle has the largest area?';

  const FRAMES = [
    {
      title: 'Answer A',
      reveal: 'Answer A: course passages (typed by hand)',
      system: [
        'You are a teaching assistant in the first weeks of a first-year engineering mathematics course.',
        'Answer using only the methods in the course passages below.',
        'Derivatives have not been taught yet: do not use them.',
        'Write at most eight short lines for a first-year student.',
        'Write mathematics in LaTeX between $ signs.',
        '',
        'Course passages:',
        '[S1] Modelling. Name the unknown, write the quantity to optimise as a function of one variable, and state the allowed values.',
        '[S2] Completing the square. Every quadratic $ax^2+bx+c$ can be written as $a(x-h)^2+k$. If $a<0$, the largest value is $k$, attained at $x=h$.',
        '[S3] Always end with a sentence that answers the question.'
      ].join('\n')
    },
    {
      title: 'Answer B',
      reveal: 'Answer B: a research-level prompt',
      system: [
        'You are a research mathematician writing for colleagues. Be rigorous and general.',
        'Solve it as constrained optimisation with Lagrange multipliers, check second-order conditions',
        'with the bordered Hessian and the KKT conditions, then generalise in one short paragraph',
        'to boxes in $\\mathbb{R}^n$ via the inequality between arithmetic and geometric means. Use headings, at most 350 words.',
        'Write mathematics in LaTeX between $ signs.'
      ].join('\n')
    }
  ];

  // ------------------------------------------------------------ 1c prompts

  // Directions in space: several steps and fractions, so models differ.
  // Answer: distance 2, attained at (10/3, 14/3, 20/3) on L1 and (14/3, 10/3, 22/3) on L2.
  const LINES = {
    text: 'Two lines in space are $L_1:\\ (1,0,2)+t\\,(1,2,2)$ and $L_2:\\ (4,3,8)+s\\,(2,1,-2)$. ' +
      'Find the shortest distance between them, and the point on each line where it is attained.',
    ask: 'End your answer with one line: Final answer: <the shortest distance>',
    answer: 2
  };

  const LINES_FRAME = [
    'You are a teaching assistant in a first-year engineering mathematics course, linear algebra.',
    'Answer using the methods in the course passages below, in at most twelve short lines.',
    'Write mathematics in LaTeX between $ signs.',
    '',
    'Course passages:',
    '[S1] Lines. A line is a point plus a parameter times a direction vector.',
    '[S2] Common normal. The cross product $u\\times v$ is orthogonal to both directions $u$ and $v$.',
    '[S3] Distance. Project the vector between a point on each line onto the common normal: $|w\\cdot n|/|n|$.',
    '[S4] Closest points. The connecting vector of the closest points is orthogonal to both directions.'
  ].join('\n');

  // --------------------------------------------------------------- helpers

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(text, cls) { const b = el('button', 'btn ' + cls, text); b.type = 'button'; return b; }
  function label(model) { return String(model).split('/').pop(); }
  function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

  // Markdown with LaTeX: the mathematics is set aside before Markdown runs, then
  // typeset by the page's MathJax. Without marked the text stays readable.
  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function sanitize(node) {
    node.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach(n => n.remove());
    node.querySelectorAll('*').forEach(n => [...n.attributes].forEach(a => {
      if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
    }));
  }
  async function showMarkdown(node, text) {
    const math = [];
    const keep = (tex, display) => { math.push(display ? '\\[' + tex + '\\]' : '\\(' + tex + '\\)'); return 'LUNDMATH' + (math.length - 1) + 'X'; };
    const source = String(text)
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => keep(t, true))
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => keep(t, true))
      .replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => keep(t, false))
      .replace(/\$([^$\n]+?)\$/g, (_, t) => keep(t, false));
    const html = window.marked ? window.marked.parse(source) : '<p>' + escapeHtml(source).replace(/\n/g, '<br>') + '</p>';
    node.innerHTML = html.replace(/LUNDMATH(\d+)X/g, (_, i) => escapeHtml(math[Number(i)]));
    sanitize(node);
    try { if (window.MathJax?.typesetPromise) await window.MathJax.typesetPromise([node]); }
    catch (error) { console.warn('lund demos: keeping readable TeX.', error); }
  }

  // The value on the last "Final answer:" line: an integer, a decimal, a/b or \frac{a}{b}.
  function finalValue(text) {
    const line = [...String(text).matchAll(/final answer\s*[:：]\s*(.+)/gi)].pop();
    if (!line) return null;
    const s = line[1].replace(/[*$]/g, '').replace(/\\[dt]?frac\s*\{\s*([^{}]+?)\s*\}\s*\{\s*([^{}]+?)\s*\}/g, '$1/$2');
    const m = s.match(/(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?/);
    if (!m) return null;
    return {shown: m[0], value: m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1])};
  }
  function isRight(text, answer) {
    const read = finalValue(text);
    return read ? {read, ok: Math.abs(read.value - answer) <= 0.005 * Math.abs(answer)} : null;
  }

  // ------------------------------------------------------------ connection

  const connection = Object.assign({baseUrl: '', apiKey: ''}, load(CONNECTION_KEY, {}));
  let modelList = load(MODEL_LIST_KEY, null) || KNOWN_MODELS;
  const modelListeners = [];
  let openConnection = () => {};

  function base() { return connection.baseUrl.trim().replace(/\/+$/, ''); }
  function headers() {
    const h = {'Content-Type': 'application/json'};
    if (connection.apiKey) h.Authorization = 'Bearer ' + connection.apiKey;
    return h;
  }

  async function fetchModels() {
    const response = await fetch(base() + '/models', {headers: headers(), signal: AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('API ' + response.status);
    const ids = ((await response.json()).data || []).map(m => m.id).filter(id => !/embed|ocr|clef/i.test(id)).sort();
    if (!ids.length) throw new Error('the API returned no chat models');
    modelList = ids;
    save(MODEL_LIST_KEY, ids);
    modelListeners.forEach(fn => fn());
    return ids.length;
  }

  // One chat completion. Reasoning blocks are removed; only the answer is kept.
  async function chat(model, messages, {maxTokens, timeoutMs}) {
    if (!base()) throw new Error('Set the API base URL under "AI connection" first.');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(base() + '/chat/completions', {
        method: 'POST', headers: headers(), signal: controller.signal,
        body: JSON.stringify({model, messages, max_tokens: maxTokens})
      });
      if (!response.ok) {
        const error = new Error('API ' + response.status + ': ' + (await response.text().catch(() => '')).slice(0, 300));
        if (response.status === 429) error.retryAfter = Number(response.headers.get('Retry-After')) || 30;
        throw error;
      }
      const choice = (await response.json())?.choices?.[0];
      let text = choice?.message?.content;
      if (Array.isArray(text)) text = text.filter(p => p.type === 'text').map(p => p.text).join('');
      text = String(text || '').replace(/<(think|analysis|reasoning)(?:\s[^>]*)?>[\s\S]*?<\/\1\s*>/gi, '').trim();
      if (!text) throw new Error(choice?.finish_reason === 'length' ? 'The answer was cut off (token limit).' : 'The model returned no answer.');
      return {text, truncated: choice?.finish_reason === 'length'};
    } catch (error) {
      if (controller.signal.aborted) throw new Error('No answer within ' + Math.round(timeoutMs / 1000) + ' s.');
      throw error;
    } finally { clearTimeout(timer); }
  }

  function connectionPanel(host) {
    const panel = el('details', 'lund-connection');
    const summary = el('summary');
    const url = el('input', 'form-control');
    url.type = 'url'; url.placeholder = 'https://…/v1'; url.value = connection.baseUrl;
    const key = el('input', 'form-control');
    key.type = 'password'; key.autocomplete = 'off'; key.placeholder = 'API key'; key.value = connection.apiKey;
    const saveButton = button('Save', 'btn-primary btn-sm');
    const fetchButton = button('Fetch models', 'btn-outline-secondary btn-sm');
    const status = el('p', 'lund-tf-meta');
    const field = (text, input) => { const l = el('label', '', text); l.append(input); return l; };
    const form = el('div', 'lund-tf-controls');
    form.append(field('API base URL', url), field('API key', key), saveButton, fetchButton);
    panel.append(summary, form, status,
      el('p', 'lund-small', 'Saved in this browser only. The demos on this page call the API directly; the exercises keep their own AI settings (⚙).'));
    host.append(panel);

    function refresh() {
      summary.textContent = 'AI connection: ' + (base() ? new URL(base()).host + ' · ' + modelList.length + ' models' : 'not set');
    }
    function store() {
      connection.baseUrl = url.value.trim();
      connection.apiKey = key.value.trim();
      save(CONNECTION_KEY, connection);
      refresh();
    }
    saveButton.onclick = () => { store(); status.textContent = 'Saved.'; };
    fetchButton.onclick = async () => {
      store();
      status.textContent = 'Fetching models…';
      try { status.textContent = (await fetchModels()) + ' models loaded.'; }
      catch (error) { status.textContent = 'Could not fetch models: ' + error.message; }
      refresh();
    };
    openConnection = () => { panel.open = true; panel.scrollIntoView({block: 'center'}); url.focus(); };
    refresh();
  }

  // A model menu for one slot of one demo, kept in step with the model list.
  const choices = load(CHOICE_KEY, {});
  function modelSelect(demo, slot, onChange) {
    const select = el('select', 'form-select');
    function preferred() {
      const saved = choices[demo]?.[slot];
      if (saved && modelList.includes(saved)) return saved;
      return PRESETS[demo][slot].find(id => modelList.includes(id)) || PRESETS[demo][slot][0];
    }
    function fill() {
      const ids = [...new Set([...modelList, preferred()])];
      select.replaceChildren(...ids.map(id => new Option(label(id), id)));
      select.value = preferred();
    }
    select.onchange = () => {
      choices[demo] = choices[demo] || [];
      choices[demo][slot] = select.value;
      save(CHOICE_KEY, choices);
      onChange?.();
    };
    modelListeners.push(fill);
    fill();
    return select;
  }

  // ----------------------------------------------------------------- cards

  function card(title) {
    const node = el('div', 'lund-card lund-tf-answer');
    const head = el('h3', '', title);
    const meta = el('p', 'lund-tf-meta');
    const verdict = el('p', 'lund-tf-verdict');
    const body = el('div', 'lund-tf-body');
    node.append(head, meta, verdict, body);
    return {node, head, meta, verdict, body};
  }

  async function run(out, model, messages, opts) {
    out.body.replaceChildren();
    out.verdict.textContent = '';
    out.verdict.className = 'lund-tf-verdict';
    out.meta.textContent = label(model) + ' · thinking…';
    const start = performance.now();
    try {
      const reply = await chat(model, messages, opts);
      const seconds = ((performance.now() - start) / 1000).toFixed(0);
      const words = reply.text.split(/\s+/).filter(Boolean).length;
      out.meta.textContent = label(model) + ' · ' + words + ' words · ' + seconds + ' s' + (reply.truncated ? ' · cut off' : '');
      if (opts.answer !== undefined) {
        const check = isRight(reply.text, opts.answer);
        out.verdict.textContent = check ? (check.ok ? '✓ ' : '✗ ') + 'Final answer: ' + check.read.shown : '? no final answer found';
        out.verdict.classList.add(check ? (check.ok ? 'is-right' : 'is-wrong') : 'is-unknown');
      }
      await showMarkdown(out.body, reply.text);
    } catch (error) {
      out.meta.textContent = label(model);
      out.body.append(el('p', 'lund-tf-error', error.message || String(error)));
    }
  }

  function ready() {
    if (base()) return true;
    openConnection();
    return false;
  }

  function behindTheScenes(entries) {
    const reveal = el('details', 'lund-tf-prompts');
    reveal.append(el('summary', '', 'Behind the scenes'));
    entries.forEach(([title, text]) => reveal.append(el('h4', '', title), el('pre', '', text)));
    return reveal;
  }

  function controlsRow(...items) {
    const row = el('div', 'lund-tf-controls');
    items.forEach(([text, input]) => { if (!text) { row.append(input); return; } const l = el('label', '', text); l.append(input); row.append(l); });
    return row;
  }

  // --------------------------------------------------- test runs (presenter)

  // Rough flag for "used derivatives" in an answer: words or notation.
  const DERIVATIVE = /derivative|differentiat|d[A-Za-z]?\s*\/\s*d[a-z]|\\frac\s*\{\s*d|[A-Za-z]'\s*\(|[A-Za-z]\u2032|lagrange|\\nabla/i;

  // Runs every job N times (one round at a time, the jobs of a round in parallel)
  // and tallies time, length and one yes/no column. For choosing
  // models before the talk, not for showing live.
  // column: {title, test(text) -> true/false} for the last column of the table.
  function testPanel(jobs, column) {
    const box = el('div', 'lund-test');
    const count = el('input', 'form-control');
    count.type = 'number'; count.min = '1'; count.max = '50'; count.value = '10';
    // A pause between rounds keeps within the API's rate limits (on Idun about 20 requests a minute).
    const pause = el('input', 'form-control');
    pause.type = 'number'; pause.min = '0'; pause.max = '600'; pause.value = '20';
    const start = button('Test', 'btn-outline-secondary btn-sm');
    const stop = button('Stop', 'btn-outline-secondary btn-sm');
    stop.disabled = true;
    const status = el('p', 'lund-tf-meta');
    const summary = el('div', 'lund-test-summary');
    const table = el('table', 'table table-sm lund-test-table');
    box.append(el('h4', '', 'Test runs (for the presenter)'),
      controlsRow(['Runs', count], ['Pause (s)', pause], ['', start], ['', stop]), status, summary, table);
    let stopped = false;
    stop.onclick = () => { stopped = true; status.textContent = 'Stopping…'; };
    // Waits, with a countdown in the status line; ends early when stopped.
    async function wait(seconds, why) {
      for (let left = Math.ceil(seconds); left > 0 && !stopped; left--) {
        status.textContent = why + ': waiting ' + left + ' s…';
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    start.onclick = async () => {
      if (!ready()) return;
      const n = Math.max(1, Math.min(50, Number(count.value) || 10));
      const gap = Math.max(0, Math.min(600, Number(pause.value) || 0));
      const list = jobs();
      const results = list.map(() => []);
      stopped = false; start.disabled = true; stop.disabled = false;
      table.replaceChildren();
      const head = el('tr');
      ['Run', 'Job', 'Model', 'Seconds', 'Words', column.title].forEach(t => head.append(el('th', '', t)));
      table.append(head);
      const median = xs => { const v = [...xs].sort((a, b) => a - b); return v.length ? v[Math.floor((v.length - 1) / 2)] : NaN; };
      function tally() {
        summary.replaceChildren(...list.map((job, j) => {
          const ok = results[j].filter(r => !r.error);
          const hits = ok.filter(r => r.flag).length;
          return el('p', '', job.name + ' (' + label(job.model) + '): ' + ok.length + ' answers, ' + hits + ' ' + column.summary + ', median '
            + median(ok.map(r => r.seconds)) + ' s and ' + median(ok.map(r => r.words)) + ' words'
            + (results[j].length > ok.length ? ', ' + (results[j].length - ok.length) + ' errors' : ''));
        }));
      }
      for (let round = 1; round <= n && !stopped; round++) {
        if (round > 1 && gap) await wait(gap, 'Pause before round ' + round);
        if (stopped) break;
        status.textContent = 'Round ' + round + ' of ' + n + '…';
        await Promise.all(list.map(async (job, j) => {
          let row;
          for (let attempt = 1; !row; attempt++) {
            const t0 = performance.now();
            try {
              const reply = await chat(job.model, job.messages, job.limits);
              row = {seconds: Math.round((performance.now() - t0) / 1000), words: reply.text.split(/\s+/).filter(Boolean).length,
                flag: column.test(reply.text)};
            } catch (error) {
              // Rate limited: wait as the API asks, then try again (three times at most).
              if (error.retryAfter && attempt < 4 && !stopped) await wait(error.retryAfter, 'Rate limit (' + label(job.model) + ')');
              else row = {error: error.message};
            }
          }
          results[j].push(row);
          const tr = el('tr');
          [String(round), job.name, label(job.model), row.error ? '–' : String(row.seconds), row.error ? '–' : String(row.words),
           row.error ? row.error.slice(0, 60) : (row.flag ? 'yes' : 'no')].forEach(t => tr.append(el('td', '', t)));
          table.append(tr);
        }));
        tally();
      }
      status.textContent = stopped ? 'Stopped.' : 'Done.';
      start.disabled = false; stop.disabled = true;
    };
    return box;
  }

  // ------------------------------------------------------------------- 1b

  function twoFrames(host) {
    const model = modelSelect('frames', 0);
    const ask = button('Ask the model', 'btn-primary btn-lg');
    const bar = el('div', 'lund-tf-bar');
    bar.append(ask);
    const cols = el('div', 'lund-cols');
    const outs = FRAMES.map(frame => { const c = card(frame.title); cols.append(c.node); return c; });
    const scenes = behindTheScenes(FRAMES.map(f => [f.reveal, 'System: ' + f.system + '\n\nUser: ' + RECTANGLE]));
    scenes.append(testPanel(() => FRAMES.map((frame, i) => ({name: 'Prompt ' + 'AB'[i], model: model.value, limits: LIMITS.frames[i],
      messages: [{role: 'system', content: frame.system}, {role: 'user', content: RECTANGLE}]})),
      {title: 'Derivatives', summary: 'with derivatives', test: text => DERIVATIVE.test(text)}));
    host.append(controlsRow(['Model', model]), el('p', 'lund-tf-problem', RECTANGLE), bar, cols, scenes);

    ask.onclick = async () => {
      if (!ready()) return;
      ask.disabled = true;
      await Promise.all(FRAMES.map((frame, i) => run(outs[i], model.value,
        [{role: 'system', content: frame.system}, {role: 'user', content: RECTANGLE}], LIMITS.frames[i])));
      ask.disabled = false;
    };
  }

  // ------------------------------------------------------------------- 1c

  // The same prompt on a small and a large model: the rectangle with prompt A
  // from 1b, or a harder question about lines in space with its own passages.
  const DERIVATIVES_COLUMN = {title: 'Derivatives', summary: 'with derivatives', test: text => DERIVATIVE.test(text)};
  const CASES = [
    {name: 'Rectangle (prompt A from 1b)', problem: RECTANGLE, system: FRAMES[0].system, user: RECTANGLE,
     reveal: 'Both models get prompt A from 1b', column: DERIVATIVES_COLUMN},
    {name: 'Two lines in space', problem: LINES.text, system: LINES_FRAME, user: LINES.text + '\n\n' + LINES.ask,
     reveal: 'Course passages (system prompt)', answer: LINES.answer,
     column: {title: 'Correct', summary: 'correct', test: text => isRight(text, LINES.answer)?.ok === true}}
  ];

  function twoModels(host) {
    let current = CASES[0];
    const messages = () => [{role: 'system', content: current.system}, {role: 'user', content: current.user}];
    const caseSelect = el('select', 'form-select');
    CASES.forEach((c, i) => caseSelect.append(new Option(c.name, String(i))));
    const ask = button('Ask both models', 'btn-primary btn-lg');
    const bar = el('div', 'lund-tf-bar');
    bar.append(ask);
    const outs = [card(''), card('')];
    const titles = () => outs.forEach((c, i) => { c.head.textContent = label(selects[i].value); });
    const selects = [0, 1].map(slot => modelSelect('models', slot, titles));
    const cols = el('div', 'lund-cols');
    outs.forEach(c => cols.append(c.node));
    const problem = el('div', 'lund-tf-problem');
    const scenes = el('div');
    host.append(controlsRow(['Problem', caseSelect], ['Small model', selects[0]], ['Large model', selects[1]]), problem, bar, cols, scenes);

    function render() {
      showMarkdown(problem, current.problem);
      outs.forEach(c => { c.body.replaceChildren(); c.meta.textContent = ''; c.verdict.textContent = ''; });
      const reveal = behindTheScenes([[current.reveal, 'System: ' + current.system + '\n\nUser: ' + current.user]]);
      reveal.append(testPanel(() => selects.map((select, i) => ({name: ['Small', 'Large'][i], model: select.value, limits: LIMITS.models,
        messages: messages()})), current.column));
      scenes.replaceChildren(reveal);
    }
    caseSelect.onchange = () => { current = CASES[Number(caseSelect.value)]; render(); };
    modelListeners.push(titles);
    titles();
    render();

    ask.onclick = async () => {
      if (!ready()) return;
      ask.disabled = true;
      await Promise.all(selects.map((select, i) => run(outs[i], select.value, messages(), {...LIMITS.models, answer: current.answer})));
      ask.disabled = false;
    };
  }

  // ----------------------------------------------- 3a: Markdown versus HTML

  // Shows the HTML the browser holds for the course exercise (part 5), live from the page.
  function htmlMonster(host) {
    const show = button('Show the HTML', 'btn-outline-primary');
    const stats = el('p', 'lund-tf-meta');
    const box = el('pre', 'lund-html-box');
    box.hidden = true;
    host.append(show, stats, box);
    show.onclick = () => {
      const exercise = document.querySelector('[data-ctm-id="lund-derivative-course"]');
      if (!exercise) { stats.textContent = 'The exercise is not on this page.'; return; }
      const html = exercise.outerHTML.replace(/></g, '>\n<');
      const lines = html.split('\n').length;
      stats.textContent = lines.toLocaleString('en') + ' lines · ' + html.length.toLocaleString('en') + ' characters, for a few lines of Markdown';
      box.textContent = html;
      box.hidden = false;
    };
  }


  function init() {
    const byId = id => document.getElementById(id);
    if (byId('lund-html-monster')) htmlMonster(byId('lund-html-monster'));
    if (byId('lund-connection')) connectionPanel(byId('lund-connection'));
    if (byId('lund-two-frames')) twoFrames(byId('lund-two-frames'));
    if (byId('lund-two-models')) twoModels(byId('lund-two-models'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
