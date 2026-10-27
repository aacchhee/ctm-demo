// Test helpers for the "Håndskrift og KI" / "Handwriting and AI" pages (for
// trying things out; not a CTM feature). Used by the Norwegian and the English
// page; its own texts follow the page language (<html lang>).
//  1. "Fill in student N" loads a real answer into the upload field (and the
//     final values into the answer field), so nobody has to upload by hand.
//  2. A feedback-language menu next to each upload field overrides the
//     feedback language for that subtask only.
//  3. The prompt sandbox lets teachers try edited YAML prompts in their own
//     browser without rebuilding the site.
// The script reaches into the DOM of the CTM components; if a CTM update
// breaks it, this script is what needs fixing.
//
// <script src="…/fyll-inn.js" data-feedback-dir="feedback/handskrift/"
//         data-files="veileder.yml,oppgaver.yml" data-guide="handskrift-ki-prompter.html">
(function () {
  'use strict';

  const script = document.currentScript;
  const ASSETS = new URL('./', script.src);
  const SITE = new URL('../../', script.src);
  const FEEDBACK_DIR = new URL(script.dataset.feedbackDir || 'feedback/handskrift/', SITE);
  const FILES = (script.dataset.files || 'veileder.yml,oppgaver.yml').split(',');
  const GUIDE = script.dataset.guide || 'handskrift-ki-prompter.html';
  const LANG = (document.documentElement.lang || 'nb').toLowerCase().startsWith('en') ? 'en' : 'nb';
  const STUDENTS = [['student1', 'Student 1'], ['student2', 'Student 2']];
  // Images: assets/handskrift/<student>/<subtask>.png, optionally also
  // <subtask>-2.png and <subtask>-3.png. Adding a file adds an answer.
  // Final values the students wrote (read off the photos), in field order.
  // Empty string = not answered.
  const ANSWERS = {
    student1: {'1a': ['0.6', '3.3'], '1c': ['4.9'], '2a': [''], '2b': ['4.2*10^18'], '3a': ['', '2.2'],
               '3b': ['87.6'], '4a': ['205'], '4b': ['1.6'], '4c': ['4.1']},
    student2: {'1a': ['0.6', '3.3'], '1c': ['4.87'], '2a': ['465'], '2b': ['4.2*10^10'], '3a': ['175', '2.3'],
               '3b': [''], '4a': ['11.2'], '4b': ['7.53'], '4c': ['2.8']}
  };
  // Value = the language name the model is told to write in.
  const FEEDBACK_LANGUAGES = [
    ['English', 'Engelsk', 'English'],
    ['Norwegian (Bokmål)', 'Norsk bokmål', 'Norwegian (Bokmål)'],
    ['Swedish', 'Svensk', 'Swedish'],
    ['Spanish', 'Spansk', 'Spanish'],
    ['Russian', 'Russisk', 'Russian'],
    ['German', 'Tysk', 'German']
  ].map(([value, nb, en]) => ({value, label: LANG === 'nb' ? nb : en}));
  const DEFAULT_LANGUAGE = LANG === 'nb' ? 'Norwegian (Bokmål)' : 'English';
  const SANDBOX_KEY = 'handskrift-sandkasse-v1|' + LANG;
  const LANGUAGE_KEY = 'handskrift-sprak-v1|' + location.pathname;

  const T = {
    nb: {
      fill: label => 'Fyll inn ' + label.toLowerCase(),
      loading: 'Laster inn …',
      missing: label => label + ' har ikke levert denne deloppgaven.',
      loaded: label => 'Besvarelsen til ' + label + ' er lastet inn. Velg Tilbakemelding.',
      realAnswers: 'Ekte besvarelser: ',
      filled: (label, n) => label + ': ' + n + ' deloppgaver lastet inn (oppgave 1–4).',
      clearAll: 'Tøm alt', cleared: 'Alt er tømt.',
      language: 'Språk for tilbakemeldingen: ',
      languageDefault: ' (standard)',
      sandboxActive: 'Sandkasse-prompter er aktive i denne nettleseren. ', goSandbox: 'Gå til sandkassen',
      fileStart: name => name + ': filen må starte med «ai-feedback:».',
      level: 'Nivå', maxWords: 'maks', words: 'ord', fullAllowed: ', fullstendig løsning tillatt',
      noLevels: n => 'Ingen nivåer: én vurdering per klikk (maks ' + n + ' ord).',
      previewHead: (lang, n) => 'Språk: ' + lang + ', maks ' + n + ' punkter',
      instructions: '— Instruksjoner (veileder + deloppgave) —', ladder: '— Hintstige —', error: 'Feil: ',
      savedActive: 'Lagrede sandkasse-prompter er aktive.', savedError: 'Lagrede sandkasse-prompter har en feil: ',
      copy: name => 'Kopier ' + name, copied: name => name + ' er kopiert. Lim den inn i filen på GitHub.',
      copyManual: 'Kopier markert tekst med Ctrl+C / Cmd+C.',
      summary: 'Prompt-sandkasse (for lærere)',
      intro: 'Rediger promptene her og velg «Bruk i denne nettleseren». Endringen gjelder bare deg, i denne nettleseren, til du tilbakestiller. Når du er fornøyd, kopierer du teksten inn i filen i repoet (se ',
      guide: 'Spill med promptene',
      policy: name => 'Aktiv policy (fra ' + name + '): ',
      apply: 'Bruk i denne nettleseren',
      applied: 'Sandkasse-promptene er aktive. Neste klikk på Tilbakemelding bruker dem (hintstigen starter på nytt).',
      notApplied: 'Ikke brukt, YAML-en har en feil: ',
      reset: 'Tilbakestill til repo-versjonen', resetDone: 'Promptene fra repoet er aktive igjen.',
      previewTitle: 'Hva KI-en får vite om en deloppgave', subtask: 'Deloppgave: ', show: 'Vis'
    },
    en: {
      fill: label => 'Fill in ' + label.toLowerCase(),
      loading: 'Loading …',
      missing: label => label + ' did not answer this subtask.',
      loaded: label => label + '’s answer is loaded. Choose Feedback.',
      realAnswers: 'Real answers: ',
      filled: (label, n) => label + ': ' + n + ' subtasks loaded (problems 1–4).',
      clearAll: 'Clear all', cleared: 'Everything is cleared.',
      language: 'Feedback language: ',
      languageDefault: ' (default)',
      sandboxActive: 'Sandbox prompts are active in this browser. ', goSandbox: 'Go to the sandbox',
      fileStart: name => name + ': the file must start with “ai-feedback:”.',
      level: 'Level', maxWords: 'max', words: 'words', fullAllowed: ', full solution allowed',
      noLevels: n => 'No levels: one review per click (max ' + n + ' words).',
      previewHead: (lang, n) => 'Language: ' + lang + ', max ' + n + ' points',
      instructions: '— Instructions (tutor + subtask) —', ladder: '— Hint ladder —', error: 'Error: ',
      savedActive: 'Saved sandbox prompts are active.', savedError: 'The saved sandbox prompts have an error: ',
      copy: name => 'Copy ' + name, copied: name => name + ' is copied. Paste it into the file on GitHub.',
      copyManual: 'Copy the selected text with Ctrl+C / Cmd+C.',
      summary: 'Prompt sandbox (for teachers)',
      intro: 'Edit the prompts here and choose “Use in this browser”. The change applies only to you, in this browser, until you reset. When you are happy, copy the text into the file in the repository (see ',
      guide: 'Playing with the prompts',
      policy: name => 'Active policy (from ' + name + '): ',
      apply: 'Use in this browser',
      applied: 'The sandbox prompts are active. The next click on Feedback uses them (the hint ladder starts again).',
      notApplied: 'Not applied, the YAML has an error: ',
      reset: 'Reset to the repository version', resetDone: 'The prompts from the repository are active again.',
      previewTitle: 'What the AI is told about a subtask', subtask: 'Subtask: ', show: 'Show'
    }
  }[LANG];

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (key === 'class') node.className = value; else if (key.startsWith('on')) node[key] = value; else node.setAttribute(key, value);
    }
    node.append(...children);
    return node;
  }
  function activities() { return [...document.querySelectorAll('.ai-feedback-activity[id^="v25-"]')]; }
  function subtask(activity) { return activity.id.slice(4); }

  // ---------- Policy configuration: repository or sandbox, plus language choices ----------

  const original = window.__aiFeedbackPolicies;
  let base = original;
  let languages = {};
  try { languages = JSON.parse(localStorage.getItem(LANGUAGE_KEY) || '{}') || {}; } catch {}
  // Language choices are an extra exercise-override layer on top of the page's
  // policy files (or the sandbox), so only that subtask's `language` changes.
  function withLanguages(config) {
    const chosen = Object.entries(languages).filter(([id, language]) => language && language !== DEFAULT_LANGUAGE);
    if (!chosen.length) return config;
    const exercises = {'plain-text': Object.fromEntries(chosen.map(([id, language]) => [id, {language}]))};
    return {...config, pageLayers: [...(config.pageLayers || []), {exercises}]};
  }
  function publish() { if (original) window.__aiFeedbackPolicies = withLanguages(base); }

  // ---------- 1. Fill in ----------

  async function exists(url) {
    try { return (await fetch(url, {method: 'HEAD', cache: 'no-store'})).ok; } catch { return false; }
  }
  async function images(student, key) {
    const files = [];
    for (const name of [key, key + '-2', key + '-3']) {
      const url = new URL(student + '/' + name + '.png', ASSETS);
      const response = await fetch(url, {cache: 'no-store'}).catch(() => null);
      if (!response || !response.ok) { if (name === key) return []; break; }
      // A neutral file name: the model must not learn which student it is.
      files.push(new File([await response.blob()], 'answer-' + name + '.png', {type: 'image/png'}));
    }
    return files;
  }
  function reset(activity) {
    // ctm-libs resets the hint ladder, the response text and the images when
    // this event arrives with the activity's reset-on-variant name.
    document.dispatchEvent(new CustomEvent('math-exercise:variant-accepted', {detail: {label: activity.id + '-fyll'}}));
  }
  function answerFields(activity) {
    const cell = document.querySelector('.math-exercise-cell[data-label="' + activity.id + '-svar"]');
    return cell ? {cell, inputs: [...cell.querySelectorAll('input.math-input')]} : null;
  }
  function setAnswers(activity, values) {
    const fields = answerFields(activity);
    if (!fields) return;
    const toggle = fields.cell.querySelector('.math-exercise-toggle[aria-expanded="false"]');
    if (toggle && values.some(Boolean)) toggle.click();
    fields.inputs.forEach((input, i) => {
      input.value = values[i] || '';
      input.dispatchEvent(new Event('input', {bubbles: true}));
    });
  }
  async function fill(activity, student, label) {
    const status = activity.querySelector('.fyll-inn-status');
    status.textContent = T.loading;
    reset(activity);
    const files = await images(student, subtask(activity));
    if (!files.length) { status.textContent = T.missing(label); return false; }
    const upload = activity.querySelector('input[type="file"]');
    const transfer = new DataTransfer();
    files.forEach(file => transfer.items.add(file));
    upload.files = transfer.files;
    upload.dispatchEvent(new Event('change', {bubbles: true}));
    setAnswers(activity, ANSWERS[student]?.[subtask(activity)] || []);
    status.textContent = T.loaded(label);
    return true;
  }
  function clear(activity) {
    reset(activity);
    setAnswers(activity, []);
    activity.querySelector('.fyll-inn-status').textContent = '';
  }

  function languageMenu(activity) {
    const select = el('select', {class: 'form-select form-select-sm', 'aria-label': T.language.trim() + ' ' + activity.id},
      ...FEEDBACK_LANGUAGES.map(({value, label}) => el('option', {value}, label + (value === DEFAULT_LANGUAGE ? T.languageDefault : ''))));
    select.value = languages[activity.id] || DEFAULT_LANGUAGE;
    select.onchange = () => {
      if (select.value === DEFAULT_LANGUAGE) delete languages[activity.id]; else languages[activity.id] = select.value;
      try { localStorage.setItem(LANGUAGE_KEY, JSON.stringify(languages)); } catch {}
      publish();
    };
    return el('label', {class: 'feedback-sprak'}, T.language, select);
  }

  function addControls() {
    for (const activity of activities()) {
      const bar = el('div', {class: 'fyll-inn'});
      for (const [student, label] of STUDENTS) {
        const button = el('button', {type: 'button', class: 'btn btn-sm btn-outline-secondary', 'data-student': student}, T.fill(label));
        button.onclick = () => fill(activity, student, label);
        bar.append(button);
        exists(new URL(student + '/' + subtask(activity) + '.png', ASSETS)).then(ok => {
          if (!ok) { button.disabled = true; button.title = T.missing(label); }
        });
      }
      bar.append(el('span', {class: 'fyll-inn-status', 'aria-live': 'polite'}));
      const upload = activity.querySelector('input[type="file"]')?.closest('label');
      (upload || activity.querySelector('textarea')).after(bar, languageMenu(activity));
    }
    publish();
    const toolbar = document.getElementById('fyll-inn-verktoy');
    if (!toolbar) return;
    toolbar.className = 'fyll-inn-verktoy';
    toolbar.append(el('strong', {}, T.realAnswers));
    for (const [student, label] of STUDENTS) {
      toolbar.append(el('button', {type: 'button', class: 'btn btn-sm btn-primary', onclick: async () => {
        const results = await Promise.all(activities().map(activity => fill(activity, student, label)));
        toolbarStatus.textContent = T.filled(label, results.filter(Boolean).length);
      }}, T.fill(label)));
    }
    toolbar.append(el('button', {type: 'button', class: 'btn btn-sm btn-outline-secondary', onclick: () => {
      activities().forEach(clear); toolbarStatus.textContent = T.cleared;
    }}, T.clearAll));
    const toolbarStatus = el('span', {class: 'fyll-inn-status', 'aria-live': 'polite'});
    toolbar.append(toolbarStatus, el('p', {class: 'sandkasse-varsel', hidden: ''},
      T.sandboxActive, el('a', {href: '#prompt-sandkasse'}, T.goSandbox)));
  }

  // ---------- 2. Prompt sandbox ----------

  function load() { try { return JSON.parse(localStorage.getItem(SANDBOX_KEY) || 'null'); } catch { return null; } }
  function save(value) { try { value ? localStorage.setItem(SANDBOX_KEY, JSON.stringify(value)) : localStorage.removeItem(SANDBOX_KEY); } catch {} }
  function layer(text, name) {
    const doc = window.jsyaml.load(text) || {};
    const section = doc['ai-feedback'];
    if (!section || typeof section !== 'object') throw new Error(T.fileStart(name));
    return section;
  }
  // The page's policy-files are the last layers; the sandbox replaces them.
  function configuration(state) {
    const layers = original.layers.slice(0, Math.max(0, original.layers.length - FILES.length));
    return {...original, layers: [...layers, ...FILES.map((name, i) => layer(state.texts[i], name))],
      projectPolicy: {default: state.policy}};
  }
  function apply(state) {
    const config = configuration(state);
    for (const activity of activities()) window.AIFeedback.resolvePolicy('plain-text', LANG, {}, withLanguages(config), {exercise: activity.id});
    base = config;
    publish();
    document.querySelectorAll('.sandkasse-varsel').forEach(node => { node.hidden = false; });
  }
  function policyNames(text) {
    try { return Object.keys(layer(text, FILES[0]).policies || {}); } catch { return []; }
  }

  async function addSandbox() {
    if (!original || !window.jsyaml || !window.AIFeedback?.resolvePolicy) return;
    const repoTexts = await Promise.all(FILES.map(name => fetch(new URL(name, FEEDBACK_DIR), {cache: 'no-store'}).then(r => r.ok ? r.text() : '')));
    const saved = load();
    const defaultPolicy = original.projectPolicy?.default || '';
    const state = saved || {texts: repoTexts, policy: defaultPolicy};
    const areas = FILES.map(name => el('textarea', {rows: '18', spellcheck: 'false', 'aria-label': name}));
    areas.forEach((area, i) => { area.value = state.texts[i]; });
    const select = el('select', {class: 'form-select form-select-sm', 'aria-label': 'Policy'});
    const status = el('p', {class: 'sandkasse-status', 'aria-live': 'polite'});
    const preview = el('pre', {class: 'sandkasse-forhandsvisning'});
    const previewSelect = el('select', {class: 'form-select form-select-sm', 'aria-label': T.subtask.replace(/[: ]+$/, '')},
      ...activities().map(a => el('option', {value: a.id}, a.id)));
    function refreshPolicies() {
      const names = policyNames(areas[0].value);
      const current = select.value || state.policy;
      select.replaceChildren(...names.map(name => el('option', {value: name}, name)));
      if (names.includes(current)) select.value = current;
    }
    function current() { return {texts: areas.map(a => a.value), policy: select.value}; }
    function showPreview() {
      try {
        const config = withLanguages(configuration(current()));
        const policy = window.AIFeedback.resolvePolicy('plain-text', LANG, {}, config, {exercise: previewSelect.value});
        const steps = policy.steps.length
          ? policy.steps.map((step, i) => T.level + ' ' + (i + 1) + ' (' + T.maxWords + ' ' + (step['max-words'] || policy['max-words']) + ' ' + T.words
              + ((step['allow-full-solution'] ?? policy['allow-full-solution']) ? T.fullAllowed : '') + '):\n' + step['step-prompt']).join('\n\n')
          : T.noLevels(policy['max-words']);
        preview.textContent = T.previewHead(policy.language, policy['max-issues']) + '\n\n'
          + T.instructions + '\n' + policy.basePrompts.join('\n\n') + '\n\n' + T.ladder + '\n' + steps;
      } catch (error) { preview.textContent = T.error + error.message; }
    }
    refreshPolicies(); select.value = state.policy; areas[0].addEventListener('input', refreshPolicies);
    if (saved) { try { apply(saved); status.textContent = T.savedActive; } catch (error) { status.textContent = T.savedError + error.message; } }

    const button = (text, onclick, kind = 'outline-secondary') => el('button', {type: 'button', class: 'btn btn-sm btn-' + kind, onclick}, text);
    const copy = i => button(T.copy(FILES[i]), async () => {
      try { await navigator.clipboard.writeText(areas[i].value); status.textContent = T.copied(FILES[i]); }
      catch { areas[i].select(); status.textContent = T.copyManual; }
    });
    const details = el('details', {id: 'prompt-sandkasse', class: 'sandkasse'},
      el('summary', {}, T.summary),
      el('p', {}, T.intro, el('a', {href: GUIDE}, T.guide), ').'),
      el('label', {}, T.policy(FILES[0]), select),
      ...FILES.flatMap((name, i) => [el('h4', {}, new URL(name, FEEDBACK_DIR).pathname.replace(SITE.pathname, '')), areas[i]]),
      el('div', {class: 'sandkasse-knapper'},
        button(T.apply, () => {
          try { const next = current(); apply(next); save(next); status.textContent = T.applied; showPreview(); }
          catch (error) { status.textContent = T.notApplied + error.message; }
        }, 'primary'),
        button(T.reset, () => {
          save(null); base = original; publish();
          areas.forEach((area, i) => { area.value = repoTexts[i]; });
          refreshPolicies(); select.value = defaultPolicy;
          document.querySelectorAll('.sandkasse-varsel').forEach(node => { node.hidden = true; });
          status.textContent = T.resetDone; showPreview();
        }),
        copy(0), copy(1)),
      status,
      el('h4', {}, T.previewTitle),
      el('label', {}, T.subtask, previewSelect),
      button(T.show, showPreview),
      preview);
    previewSelect.onchange = showPreview;
    (document.querySelector('main') || document.body).append(details);
    showPreview();
  }

  function style() {
    document.head.append(el('style', {}, `
      .fyll-inn { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; margin:.4rem 0; }
      .feedback-sprak { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; margin:.2rem 0 .5rem; font-size:.95em; }
      .feedback-sprak select { display:inline-block; width:auto; }
      .fyll-inn-verktoy { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; padding:.6rem .8rem; margin:1rem 0;
        border:1px solid var(--bs-border-color, #ccc); border-radius:.4rem; background:var(--bs-tertiary-bg, #f6f7f9); }
      .fyll-inn-status { font-size:.9em; color:var(--bs-secondary-color, #555); }
      .sandkasse-varsel { flex-basis:100%; margin:0; color:#8a5300; font-weight:600; }
      .sandkasse { margin-top:2.5rem; padding:.8rem 1rem; border:1px dashed var(--bs-border-color, #bbb); border-radius:.4rem; }
      .sandkasse summary { font-weight:600; cursor:pointer; }
      .sandkasse textarea { width:100%; font-family:var(--bs-font-monospace, monospace); font-size:.82rem; }
      .sandkasse select { display:inline-block; width:auto; }
      .sandkasse-knapper { display:flex; flex-wrap:wrap; gap:.4rem; margin:.6rem 0; }
      .sandkasse-forhandsvisning { white-space:pre-wrap; max-height:28rem; overflow:auto; font-size:.82rem; }
    `));
  }

  function start() {
    style();
    addControls();
    addSandbox().catch(error => console.warn('handskrift: the prompt sandbox could not start.', error));
  }
  // ctm-libs builds the activities on DOMContentLoaded; wait until they exist.
  function ready() { if (activities().some(a => a.dataset.aiFeedbackReady)) start(); else setTimeout(ready, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
