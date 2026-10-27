// Live AI demos for the talk page (lund.qmd). All calls use the API base URL and
// key saved under the page's AI feedback settings (⚙). Prompts live here, out of
// sight, until the presenter opens "Behind the scenes".
//
//   #lund-two-frames   one problem, one model, two hidden system prompts
//   #lund-two-models   one plain question, two models
//   #lund-course-frame the same question and models, with course passages added
(function () {
  'use strict';

  // ---------------------------------------------------------------- demo 1

  const RECTANGLE = 'A rectangle has perimeter 20 cm. Which rectangle has the largest area?';

  const FRAMES = [
    {
      title: 'Answer A',
      reveal: 'Answer A: the course frame (retrieved passages)',
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
      reveal: 'Answer B: no course, "be as general as possible"',
      system: [
        'You are a research mathematician writing for colleagues.',
        'Give the most general and rigorous treatment you can, and do not simplify.',
        'Formulate the problem as constrained optimisation, solve it with Lagrange multipliers,',
        'and verify second-order sufficient conditions with the bordered Hessian.',
        'Check the KKT conditions and a constraint qualification, and discuss the Lagrangian dual.',
        'Then generalise to boxes in $\\mathbb{R}^n$ with a fixed sum of edge lengths, using AM-GM and Jensen\'s inequality,',
        'and relate the result to the isoperimetric inequality.',
        'Use headings. Write mathematics in LaTeX between $ signs.'
      ].join('\n')
    }
  ];

  // ------------------------------------------------------- demos 2 and 3

  // Each problem has a tempting shortcut that gives a wrong value. `answer` is
  // the correct final value, used for the automatic check on each card.
  const PROBLEMS = [
    {
      name: 'A hidden AM-GM trap',
      text: 'Find the smallest value of $\\dfrac{x^2+5}{\\sqrt{x^2+4}}$ for real $x$.',
      ask: 'End your answer with one line: Final answer: <the smallest value>',
      answer: 5 / 2  // AM-GM shortcut gives 2; equality would need sqrt(x^2+4)=1
    },
    {
      name: 'AM-GM with a sine',
      text: 'Find the smallest value of $\\sin^2 x+\\dfrac{4}{\\sin^2 x}$, where $\\sin x\\neq 0$.',
      ask: 'End your answer with one line: Final answer: <the smallest value>',
      answer: 5  // AM-GM shortcut gives 4; equality would need sin^2 x = 2
    },
    {
      name: 'Rowing and walking',
      text: 'A rower starts at point A on one bank of a straight river that is 300 m wide. ' +
        'Point B is on the opposite bank, 400 m downstream from the point directly across from A. ' +
        'She rows at 4.5 km/h and walks at 5 km/h; ignore the current. ' +
        'Where should she land to reach B as quickly as possible, and what is the shortest time?',
      ask: 'End your answer with one line: Final answer: <the shortest time in seconds>',
      answer: 400  // the critical point (619 m downstream) lies beyond B; row straight to B
    }
  ];

  // The fixed prompt for demo 3: what retrieval from the course would supply.
  const COURSE_FRAME = [
    'You are a teaching assistant in a first-year engineering mathematics course.',
    'Solve the problem with the course methods below, step by step, in at most 15 short lines.',
    'Write mathematics in LaTeX between $ signs.',
    '',
    'Course passages:',
    '[S1] Optimisation recipe. (1) Name the variable and write down the set of allowed values. ' +
      '(2) Find the candidates: critical points inside that set, and its end points. ' +
      'Discard critical points outside the set. (3) Compare the values at all candidates. ' +
      '(4) Check the result by substituting it back.',
    '[S2] AM-GM. For $a,b>0$, $a+b\\ge 2\\sqrt{ab}$, with equality only when $a=b$. ' +
      'The bound is the minimum only if $a=b$ is possible for the allowed values. ' +
      'If it is not, use S1 instead.',
    '[S3] Substitution. When an expression repeats, call it $t$ and find the set of values of $t$ first.',
    '[S4] Units. Convert km/h to m/s by dividing by 3.6.'
  ].join('\n');

  // Shown when the model list cannot be fetched (Idun model ids).
  // Ids ending in -instant are the same models with reasoning off.
  const KNOWN_MODELS = [
    'NbAiLab/borealis-27b', 'norallm/normistral-11b-thinking', 'NorwAI/NorwAI-Magistral-24B-reasoning',
    'Qwen/Qwen3.8-27B-FP8', 'mistralai/Mistral-Medium-3.5-128B', 'Inferact/GLM-5.3-NVFP4',
    'deepseek-ai/DeepSeek-V4.1-Flash-1017', 'zai-org/GLM-5.3-Flash', 'openai/gpt-oss-120b', 'moonshotai/Kimi-K2.6'
  ];
  // First available match becomes the default for each side: a small model
  // without reasoning on the left, a large reasoning model on the right.
  const PREFER = [
    ['borealis', 'normistral', 'magistral'],
    ['kimi-k2.6', 'gpt-oss-120b', 'glm-5.3-nvfp4']
  ];
  const MODELS_KEY = 'lund-demo-models-v1';

  // --------------------------------------------------------------- helpers

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(text, cls) { const b = el('button', 'btn ' + cls, text); b.type = 'button'; return b; }
  function label(model) { return String(model).split('/').pop(); }

  async function showMarkdown(F, node, text) {
    node.innerHTML = F.renderMarkdown(text);
    try { await F.typesetFeedback(node); } catch (error) { console.warn('lund demos: keeping readable TeX.', error); }
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

  function card(title) {
    const node = el('div', 'lund-card lund-tf-answer');
    const head = el('h3', '', title);
    const meta = el('p', 'lund-tf-meta');
    const verdict = el('p', 'lund-tf-verdict');
    const body = el('div', 'lund-tf-body');
    node.append(head, meta, verdict, body);
    return {node, head, meta, verdict, body};
  }

  async function run(F, out, client, messages, opts) {
    out.body.replaceChildren();
    out.verdict.replaceChildren();
    out.verdict.className = 'lund-tf-verdict';
    out.meta.textContent = 'Thinking…';
    const start = performance.now();
    try {
      // generation: strips reasoning blocks and allows up to 180 s.
      const reply = await client.complete(messages, {generation: true, maxTokens: opts.maxTokens || 16000, timeoutMs: opts.timeoutMs || 180000});
      const seconds = ((performance.now() - start) / 1000).toFixed(0);
      const words = reply.text.split(/\s+/).filter(Boolean).length;
      out.meta.textContent = words + ' words · ' + seconds + ' s';
      if (opts.answer !== undefined) {
        const read = finalValue(reply.text);
        if (!read) { out.verdict.textContent = '? no final answer found'; out.verdict.classList.add('is-unknown'); }
        else {
          const ok = Math.abs(read.value - opts.answer) <= 0.005 * Math.abs(opts.answer);
          out.verdict.textContent = (ok ? '✓ ' : '✗ ') + 'Final answer: ' + read.shown;
          out.verdict.classList.add(ok ? 'is-right' : 'is-wrong');
        }
      }
      await showMarkdown(F, out.body, reply.text);
    } catch (error) {
      out.meta.textContent = '';
      out.body.append(el('p', 'lund-tf-error', error.message || String(error)));
    }
  }

  function configured(F) {
    const config = F.loadConfig();
    if (config.mode !== 'api' || !config.baseUrl) { F.openSettings(); return null; }
    return config;
  }

  function behindTheScenes(entries) {
    const reveal = el('details', 'lund-tf-prompts');
    reveal.append(el('summary', '', 'Behind the scenes'));
    entries.forEach(([title, text]) => reveal.append(el('h4', '', title), el('pre', '', text)));
    return reveal;
  }

  // ---------------------------------------------------------------- demo 1

  function twoFrames(F, host) {
    const ask = button('Ask the model', 'btn-primary btn-lg');
    const gear = button('⚙', 'btn-outline-secondary btn-lg');
    gear.title = gear.ariaLabel = 'AI settings';
    gear.onclick = () => F.openSettings();
    const bar = el('div', 'lund-tf-bar');
    bar.append(ask, gear);
    const cols = el('div', 'lund-cols');
    const outs = FRAMES.map(frame => { const c = card(frame.title); cols.append(c.node); return c; });
    host.append(el('p', 'lund-tf-problem', RECTANGLE), bar, cols,
      behindTheScenes(FRAMES.map(f => [f.reveal, 'System: ' + f.system + '\n\nUser: ' + RECTANGLE])));

    ask.onclick = async () => {
      const config = configured(F);
      if (!config) return;
      if (!config.model) { F.openSettings(); return; }
      const client = F.getClient();
      ask.disabled = true;
      await Promise.all(FRAMES.map((frame, i) => run(F, outs[i], client,
        [{role: 'system', content: frame.system}, {role: 'user', content: RECTANGLE}], {maxTokens: 8000})));
      ask.disabled = false;
    };
  }

  // ------------------------------------------------------- demos 2 and 3

  // Shared by demos 2 and 3: the chosen problem and the two models.
  const state = {problem: 0, models: ['', ''], listeners: []};
  function changed() { state.listeners.forEach(fn => fn()); }
  function saveModels() { try { localStorage.setItem(MODELS_KEY, JSON.stringify(state.models)); } catch {} }
  function loadModels() { try { return JSON.parse(localStorage.getItem(MODELS_KEY) || 'null'); } catch { return null; } }

  async function availableModels(F) {
    const config = F.loadConfig();
    if (config.mode !== 'api' || !config.baseUrl) return KNOWN_MODELS;
    try {
      const response = await fetch(config.baseUrl.replace(/\/+$/, '') + '/models', {
        headers: config.apiKey ? {Authorization: 'Bearer ' + config.apiKey} : {}, signal: AbortSignal.timeout(15000)});
      const ids = ((await response.json()).data || []).map(m => m.id).filter(id => !/embed|ocr|clef/i.test(id)).sort();
      return ids.length ? ids : KNOWN_MODELS;
    } catch { return KNOWN_MODELS; }
  }

  function userMessage(problem) { return problem.text + '\n\n' + problem.ask; }

  function comparison(F, host, withCourse) {
    const problemText = el('div', 'lund-tf-problem');
    const ask = button(withCourse ? 'Ask both models again' : 'Ask both models', 'btn-primary btn-lg');
    const gear = button('⚙', 'btn-outline-secondary btn-lg');
    gear.title = gear.ariaLabel = 'AI settings';
    gear.onclick = () => F.openSettings();
    const bar = el('div', 'lund-tf-bar');
    bar.append(ask, gear);

    const controls = el('div', 'lund-tf-controls');
    const selects = [];
    if (!withCourse) {
      const problemSelect = el('select', 'form-select');
      PROBLEMS.forEach((p, i) => problemSelect.append(new Option(p.name, String(i))));
      problemSelect.onchange = () => { state.problem = Number(problemSelect.value); changed(); };
      const pl = el('label', '', 'Problem ');
      pl.append(problemSelect);
      controls.append(pl);
      ['Model A ', 'Model B '].forEach((name, i) => {
        const select = el('select', 'form-select');
        select.onchange = () => { state.models[i] = select.value; saveModels(); changed(); };
        const ml = el('label', '', name);
        ml.append(select);
        controls.append(ml);
        selects.push(select);
      });
      const refresh = button('Load models', 'btn-outline-secondary btn-sm');
      refresh.onclick = () => fill();
      controls.append(refresh);
    }

    const cols = el('div', 'lund-cols');
    const outs = [card(''), card('')];
    outs.forEach(c => cols.append(c.node));
    const reveal = el('div');
    host.append(controls, problemText, bar, cols, reveal);

    function render() {
      const problem = PROBLEMS[state.problem];
      showMarkdown(F, problemText, problem.text);
      outs.forEach((c, i) => { c.head.textContent = label(state.models[i]) || (i ? 'Model B' : 'Model A'); });
      reveal.replaceChildren(behindTheScenes(withCourse
        ? [['The course frame (system prompt)', COURSE_FRAME], ['The question (unchanged)', userMessage(problem)]]
        : [['The question, the only message sent', userMessage(problem)]]));
    }
    state.listeners.push(render);

    async function fill() {
      const ids = await availableModels(F);
      const saved = loadModels() || [];
      selects.forEach((select, i) => {
        select.replaceChildren(...ids.map(id => new Option(label(id), id)));
        const preferred = PREFER[i].map(p => ids.find(id => id.toLowerCase().includes(p) && !/-instant$/i.test(id))).find(Boolean);
        state.models[i] = ids.includes(saved[i]) ? saved[i] : preferred || ids[i] || ids[0];
        select.value = state.models[i];
      });
      changed();
    }
    if (!withCourse) fill();
    render();

    ask.onclick = async () => {
      const config = configured(F);
      if (!config || !state.models[0] || !state.models[1]) return;
      const problem = PROBLEMS[state.problem];
      const messages = withCourse
        ? [{role: 'system', content: COURSE_FRAME}, {role: 'user', content: userMessage(problem)}]
        : [{role: 'user', content: userMessage(problem)}];
      ask.disabled = true;
      await Promise.all(state.models.map((model, i) => run(F, outs[i],
        F.createClient({...config, model}, {storage: window.localStorage}), messages, {answer: problem.answer})));
      ask.disabled = false;
    };
  }

  function init() {
    const F = window.AIFeedback;
    const hosts = ['lund-two-frames', 'lund-two-models', 'lund-course-frame'].map(id => document.getElementById(id));
    if (!hosts.some(Boolean)) return;
    if (!F || !F.getClient) { hosts.filter(Boolean).forEach(h => h.append(el('p', 'lund-tf-error', 'AI feedback is not available on this page.'))); return; }
    if (hosts[0]) twoFrames(F, hosts[0]);
    if (hosts[1]) comparison(F, hosts[1], false);
    if (hosts[2]) comparison(F, hosts[2], true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
