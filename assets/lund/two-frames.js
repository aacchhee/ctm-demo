// One button, one problem, two frames (lund.qmd). The same question goes to the
// same model twice, in parallel; only the hidden system prompt differs. The
// prompts stay hidden until the presenter opens "Behind the scenes". Uses the
// API base URL, key and model saved under the page's AI feedback settings (⚙).
(function () {
  'use strict';

  const PROBLEM = 'A rectangle has perimeter 20 cm. Which rectangle has the largest area?';

  const FRAMES = [
    {
      title: 'Answer A',
      reveal: 'Answer A: the course frame (retrieved passages)',
      maxTokens: 1500,
      timeoutMs: 90000,
      system: [
        'You are a teaching assistant in a first-year course, Precalculus.',
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
      maxTokens: 8000,
      timeoutMs: 180000,
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

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function init() {
    const host = document.getElementById('lund-two-frames');
    const F = window.AIFeedback;
    if (!host) return;
    if (!F || !F.getClient) { host.append(el('p', 'lund-tf-error', 'AI feedback is not available on this page.')); return; }

    const problem = el('p', 'lund-tf-problem', PROBLEM);
    const ask = el('button', 'btn btn-primary btn-lg', 'Ask the model');
    ask.type = 'button';
    const gear = el('button', 'btn btn-outline-secondary btn-lg', '⚙');
    gear.type = 'button';
    gear.title = gear.ariaLabel = 'AI settings';
    gear.onclick = () => F.openSettings();
    const bar = el('div', 'lund-tf-bar');
    bar.append(ask, gear);

    const cols = el('div', 'lund-cols');
    const outputs = FRAMES.map(frame => {
      const card = el('div', 'lund-card lund-tf-answer');
      const head = el('h3', '', frame.title);
      const meta = el('p', 'lund-tf-meta');
      const body = el('div', 'lund-tf-body');
      card.append(head, meta, body);
      cols.append(card);
      return {meta, body};
    });

    const reveal = el('details', 'lund-tf-prompts');
    reveal.append(el('summary', '', 'Behind the scenes'));
    FRAMES.forEach(frame => {
      reveal.append(el('h4', '', frame.reveal), el('pre', '', 'System: ' + frame.system + '\n\nUser: ' + PROBLEM));
    });

    host.append(problem, bar, cols, reveal);

    async function run(frame, out, client) {
      out.body.replaceChildren();
      out.meta.textContent = 'Thinking…';
      const start = performance.now();
      try {
        const reply = await client.complete(
          [{role: 'system', content: frame.system}, {role: 'user', content: PROBLEM}],
          {maxTokens: frame.maxTokens, timeoutMs: frame.timeoutMs});
        const seconds = ((performance.now() - start) / 1000).toFixed(0);
        const words = reply.text.split(/\s+/).filter(Boolean).length;
        out.meta.textContent = words + ' words · ' + seconds + ' s';
        out.body.innerHTML = F.renderMarkdown(reply.text);
        try { await F.typesetFeedback(out.body); } catch (error) { console.warn('two-frames: keeping readable TeX.', error); }
      } catch (error) {
        out.meta.textContent = '';
        out.body.append(el('p', 'lund-tf-error', error.message || String(error)));
      }
    }

    ask.onclick = async () => {
      const config = F.loadConfig();
      if (config.mode !== 'api' || !config.baseUrl || !config.model) { F.openSettings(); return; }
      const client = F.getClient();
      ask.disabled = true;
      await Promise.all(FRAMES.map((frame, i) => run(frame, outputs[i], client)));
      ask.disabled = false;
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
