// Live AI demos for the talk page (lund.qmd), independent of CTM's AI feedback.
// The page has its own connection (API base URL and key, saved in this browser),
// its own model choice per demo, and calls the OpenAI-compatible
// /chat/completions endpoint directly. Prompts live here, out of sight, until
// the presenter opens "Behind the scenes".
//
//   #lund-connection   API base URL, key, "Fetch models"
//   #lund-two-frames   1a: one problem, one model, two hidden system prompts
//   #lund-two-models   1b: prompt A from 1a on a small and a large model
//   #lund-html-monster 3a: the page's own HTML for the part 1 exercise
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
    models: {maxTokens: 8000, timeoutMs: 180000}
  };

  const CONNECTION_KEY = 'lund-connection-v1';
  const MODEL_LIST_KEY = 'lund-model-list-v1';
  const CHOICE_KEY = 'lund-model-choice-v1';

  // ------------------------------------------------------------ 1a prompts

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
      if (!response.ok) throw new Error('API ' + response.status + ': ' + (await response.text().catch(() => '')).slice(0, 300));
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
      if (!base()) panel.open = true;
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
    const body = el('div', 'lund-tf-body');
    node.append(head, meta, body);
    return {node, head, meta, body};
  }

  async function run(out, model, messages, opts) {
    out.body.replaceChildren();
    out.meta.textContent = label(model) + ' · thinking…';
    const start = performance.now();
    try {
      const reply = await chat(model, messages, opts);
      const seconds = ((performance.now() - start) / 1000).toFixed(0);
      const words = reply.text.split(/\s+/).filter(Boolean).length;
      out.meta.textContent = label(model) + ' · ' + words + ' words · ' + seconds + ' s' + (reply.truncated ? ' · cut off' : '');
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

  // ------------------------------------------------------------------- 1a

  function twoFrames(host) {
    const model = modelSelect('frames', 0);
    const ask = button('Ask the model', 'btn-primary btn-lg');
    const bar = el('div', 'lund-tf-bar');
    bar.append(ask);
    const cols = el('div', 'lund-cols');
    const outs = FRAMES.map(frame => { const c = card(frame.title); cols.append(c.node); return c; });
    host.append(controlsRow(['Model', model]), el('p', 'lund-tf-problem', RECTANGLE), bar, cols,
      behindTheScenes(FRAMES.map(f => [f.reveal, 'System: ' + f.system + '\n\nUser: ' + RECTANGLE])));

    ask.onclick = async () => {
      if (!ready()) return;
      ask.disabled = true;
      await Promise.all(FRAMES.map((frame, i) => run(outs[i], model.value,
        [{role: 'system', content: frame.system}, {role: 'user', content: RECTANGLE}], LIMITS.frames[i])));
      ask.disabled = false;
    };
  }

  // ------------------------------------------------------------------- 1b

  // Prompt A from 1a (the course frame), unchanged, on a small and a large model.
  function twoModels(host) {
    const frame = FRAMES[0];
    const ask = button('Ask both models', 'btn-primary btn-lg');
    const bar = el('div', 'lund-tf-bar');
    bar.append(ask);
    const outs = [card(''), card('')];
    const titles = () => outs.forEach((c, i) => { c.head.textContent = label(selects[i].value); });
    const selects = [0, 1].map(slot => modelSelect('models', slot, titles));
    const cols = el('div', 'lund-cols');
    outs.forEach(c => cols.append(c.node));
    host.append(controlsRow(['Small model', selects[0]], ['Large model', selects[1]]),
      el('p', 'lund-tf-problem', RECTANGLE), bar, cols,
      behindTheScenes([['Both models get prompt A from 1a', 'System: ' + frame.system + '\n\nUser: ' + RECTANGLE]]));
    modelListeners.push(titles);
    titles();

    ask.onclick = async () => {
      if (!ready()) return;
      ask.disabled = true;
      await Promise.all(selects.map((select, i) => run(outs[i], select.value,
        [{role: 'system', content: frame.system}, {role: 'user', content: RECTANGLE}], LIMITS.models)));
      ask.disabled = false;
    };
  }

  // ----------------------------------------------- 3a: Markdown versus HTML

  // Shows the HTML the browser holds for the part 1 exercise, live from the page.
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
