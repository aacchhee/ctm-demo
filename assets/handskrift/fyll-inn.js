// Testverktøy for siden «Håndskrift og KI» (kun for utprøving, ikke en
// CTM-funksjon):
//  1. «Fyll inn student N» laster en ekte besvarelse inn i opplastingsfeltet
//     (og sluttsvarene inn i svarfeltene), så ingen må laste opp selv.
//  2. Prompt-sandkassen lar lærere prøve endrede YAML-prompter i sin egen
//     nettleser uten å bygge siden på nytt.
// Skriptet går inn i DOM-en til CTM-komponentene; brekker det etter en
// CTM-oppdatering, er det dette skriptet som må rettes.
(function () {
  'use strict';

  const ASSETS = new URL('./', document.currentScript.src);
  const FEEDBACK_DIR = new URL('../../feedback/handskrift/', document.currentScript.src);
  const STUDENTS = [['student1', 'Student 1'], ['student2', 'Student 2']];
  // Bilder: assets/handskrift/<student>/<deloppgave>.png, eventuelt også
  // <deloppgave>-2.png og <deloppgave>-3.png. Legg til en fil = ny besvarelse.
  // Sluttsvarene studentene skrev, lest av bildene, i svarfeltenes rekkefølge.
  // Tom streng = ikke besvart.
  const ANSWERS = {
    student1: {'1a': ['0.6', '3.3'], '1c': ['4.9'], '2a': [''], '2b': ['4.2*10^18'], '3a': ['', '2.2'],
               '3b': ['87.6'], '4a': ['205'], '4b': ['1.6'], '4c': ['4.1']},
    student2: {'1a': ['0.6', '3.3'], '1c': ['4.87'], '2a': ['465'], '2b': ['4.2*10^10'], '3a': ['175', '2.3'],
               '3b': [''], '4a': ['11.2'], '4b': ['7.53'], '4c': ['2.8']}
  };
  const SANDBOX_KEY = 'handskrift-sandkasse-v1';
  const FILES = ['veileder.yml', 'oppgaver.yml'];

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

  // ---------- 1. Fyll inn ----------

  async function exists(url) {
    try { return (await fetch(url, {method: 'HEAD', cache: 'no-store'})).ok; } catch { return false; }
  }
  async function images(student, key) {
    const files = [];
    for (const name of [key, key + '-2', key + '-3']) {
      const url = new URL(student + '/' + name + '.png', ASSETS);
      const response = await fetch(url, {cache: 'no-store'}).catch(() => null);
      if (!response || !response.ok) { if (name === key) return []; break; }
      files.push(new File([await response.blob()], 'besvarelse-' + name + '.png', {type: 'image/png'}));
    }
    return files;
  }
  function reset(activity) {
    // ctm-libs nullstiller hintstigen, svarteksten og bildene når denne
    // hendelsen kommer med aktivitetens reset-on-variant-navn.
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
    status.textContent = 'Laster inn …';
    reset(activity);
    const files = await images(student, subtask(activity));
    if (!files.length) { status.textContent = label + ' har ikke levert denne deloppgaven.'; return false; }
    const upload = activity.querySelector('input[type="file"]');
    const transfer = new DataTransfer();
    files.forEach(file => transfer.items.add(file));
    upload.files = transfer.files;
    upload.dispatchEvent(new Event('change', {bubbles: true}));
    setAnswers(activity, ANSWERS[student]?.[subtask(activity)] || []);
    status.textContent = 'Besvarelsen til ' + label + ' er lastet inn. Velg Tilbakemelding.';
    return true;
  }
  function clear(activity) {
    reset(activity);
    setAnswers(activity, []);
    activity.querySelector('.fyll-inn-status').textContent = '';
  }

  function addButtons() {
    for (const activity of activities()) {
      const bar = el('div', {class: 'fyll-inn'});
      for (const [student, label] of STUDENTS) {
        const button = el('button', {type: 'button', class: 'btn btn-sm btn-outline-secondary', 'data-student': student}, 'Fyll inn ' + label.toLowerCase());
        button.onclick = () => fill(activity, student, label);
        bar.append(button);
        exists(new URL(student + '/' + subtask(activity) + '.png', ASSETS)).then(ok => {
          if (!ok) { button.disabled = true; button.title = label + ' har ikke levert denne deloppgaven.'; }
        });
      }
      bar.append(el('span', {class: 'fyll-inn-status', 'aria-live': 'polite'}));
      const upload = activity.querySelector('input[type="file"]')?.closest('label');
      (upload || activity.querySelector('textarea')).after(bar);
    }
    const toolbar = document.getElementById('fyll-inn-verktoy');
    if (!toolbar) return;
    toolbar.className = 'fyll-inn-verktoy';
    toolbar.append(el('strong', {}, 'Ekte besvarelser: '));
    for (const [student, label] of STUDENTS) {
      toolbar.append(el('button', {type: 'button', class: 'btn btn-sm btn-primary', onclick: async () => {
        const results = await Promise.all(activities().map(activity => fill(activity, student, label)));
        toolbarStatus.textContent = label + ': ' + results.filter(Boolean).length + ' deloppgaver lastet inn (oppgave 1–4).';
      }}, 'Fyll inn ' + label.toLowerCase()));
    }
    toolbar.append(el('button', {type: 'button', class: 'btn btn-sm btn-outline-secondary', onclick: () => {
      activities().forEach(clear); toolbarStatus.textContent = 'Alt er tømt.';
    }}, 'Tøm alt'));
    const toolbarStatus = el('span', {class: 'fyll-inn-status', 'aria-live': 'polite'});
    toolbar.append(toolbarStatus, el('p', {class: 'sandkasse-varsel', hidden: ''},
      'Sandkasse-prompter er aktive i denne nettleseren. ', el('a', {href: '#prompt-sandkasse'}, 'Gå til sandkassen')));
  }

  // ---------- 2. Prompt-sandkasse ----------

  const original = window.__aiFeedbackPolicies;
  function load() { try { return JSON.parse(localStorage.getItem(SANDBOX_KEY) || 'null'); } catch { return null; } }
  function save(value) { try { value ? localStorage.setItem(SANDBOX_KEY, JSON.stringify(value)) : localStorage.removeItem(SANDBOX_KEY); } catch {} }
  function layer(text, name) {
    const doc = window.jsyaml.load(text) || {};
    const section = doc['ai-feedback'];
    if (!section || typeof section !== 'object') throw new Error(name + ': filen må starte med «ai-feedback:».');
    return section;
  }
  // Sidens policy-files er de to siste lagene; sandkassen bytter dem ut.
  function configuration(state) {
    const layers = original.layers.slice(0, Math.max(0, original.layers.length - FILES.length));
    return {...original, layers: [...layers, ...FILES.map((name, i) => layer(state.texts[i], name))],
      projectPolicy: {default: state.policy}};
  }
  function apply(state) {
    const config = configuration(state);
    for (const activity of activities()) window.AIFeedback.resolvePolicy('plain-text', 'nb', {}, config, {exercise: activity.id});
    window.__aiFeedbackPolicies = config;
    document.querySelectorAll('.sandkasse-varsel').forEach(node => { node.hidden = false; });
  }
  function policyNames(text) {
    try { return Object.keys(layer(text, FILES[0]).policies || {}); } catch { return []; }
  }

  async function addSandbox() {
    if (!original || !window.jsyaml || !window.AIFeedback?.resolvePolicy) return;
    const repoTexts = await Promise.all(FILES.map(name => fetch(new URL(name, FEEDBACK_DIR), {cache: 'no-store'}).then(r => r.ok ? r.text() : '')));
    const saved = load();
    const state = saved || {texts: repoTexts, policy: original.projectPolicy?.default || 'handskrift'};
    const areas = FILES.map((name, i) => el('textarea', {rows: '18', spellcheck: 'false', 'aria-label': name}));
    areas.forEach((area, i) => { area.value = state.texts[i]; });
    const select = el('select', {class: 'form-select form-select-sm', 'aria-label': 'Policy'});
    const status = el('p', {class: 'sandkasse-status', 'aria-live': 'polite'});
    const preview = el('pre', {class: 'sandkasse-forhandsvisning'});
    const previewSelect = el('select', {class: 'form-select form-select-sm', 'aria-label': 'Deloppgave'},
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
        const config = configuration(current());
        const policy = window.AIFeedback.resolvePolicy('plain-text', 'nb', {}, config, {exercise: previewSelect.value});
        const steps = policy.steps.length
          ? policy.steps.map((step, i) => 'Nivå ' + (i + 1) + ' (maks ' + (step['max-words'] || policy['max-words']) + ' ord'
              + ((step['allow-full-solution'] ?? policy['allow-full-solution']) ? ', fullstendig løsning tillatt' : '') + '):\n' + step['step-prompt']).join('\n\n')
          : 'Ingen nivåer: én vurdering per klikk (maks ' + policy['max-words'] + ' ord).';
        preview.textContent = 'Språk: ' + policy.language + ', maks ' + policy['max-issues'] + ' punkter\n\n'
          + '— Instruksjoner (veileder + deloppgave) —\n' + policy.basePrompts.join('\n\n') + '\n\n— Hintstige —\n' + steps;
      } catch (error) { preview.textContent = 'Feil: ' + error.message; }
    }
    refreshPolicies(); select.value = state.policy; areas[0].addEventListener('input', refreshPolicies);
    if (saved) { try { apply(saved); status.textContent = 'Lagrede sandkasse-prompter er aktive.'; } catch (error) { status.textContent = 'Lagrede sandkasse-prompter har en feil: ' + error.message; } }

    const button = (text, onclick, kind = 'outline-secondary') => el('button', {type: 'button', class: 'btn btn-sm btn-' + kind, onclick}, text);
    const copy = i => button('Kopier ' + FILES[i], async () => {
      try { await navigator.clipboard.writeText(areas[i].value); status.textContent = FILES[i] + ' er kopiert. Lim den inn i filen på GitHub.'; }
      catch { areas[i].select(); status.textContent = 'Kopier markert tekst med Ctrl+C / Cmd+C.'; }
    });
    const details = el('details', {id: 'prompt-sandkasse', class: 'sandkasse'},
      el('summary', {}, 'Prompt-sandkasse (for lærere)'),
      el('p', {}, 'Rediger promptene her og velg «Bruk i denne nettleseren». Endringen gjelder bare deg, i denne nettleseren, til du tilbakestiller. Når du er fornøyd, kopierer du teksten inn i filen i repoet (se ',
        el('a', {href: 'handskrift-ki-prompter.html'}, 'Spill med promptene'), ').'),
      el('label', {}, 'Aktiv policy (fra veileder.yml): ', select),
      ...FILES.flatMap((name, i) => [el('h4', {}, 'feedback/handskrift/' + name), areas[i]]),
      el('div', {class: 'sandkasse-knapper'},
        button('Bruk i denne nettleseren', () => {
          try { const next = current(); apply(next); save(next); status.textContent = 'Sandkasse-promptene er aktive. Neste klikk på Tilbakemelding bruker dem (hintstigen starter på nytt).'; showPreview(); }
          catch (error) { status.textContent = 'Ikke brukt, YAML-en har en feil: ' + error.message; }
        }, 'primary'),
        button('Tilbakestill til repo-versjonen', () => {
          save(null); window.__aiFeedbackPolicies = original;
          areas.forEach((area, i) => { area.value = repoTexts[i]; });
          refreshPolicies(); select.value = original.projectPolicy?.default || 'handskrift';
          document.querySelectorAll('.sandkasse-varsel').forEach(node => { node.hidden = true; });
          status.textContent = 'Promptene fra repoet er aktive igjen.'; showPreview();
        }),
        copy(0), copy(1)),
      status,
      el('h4', {}, 'Hva KI-en får vite om en deloppgave'),
      el('label', {}, 'Deloppgave: ', previewSelect),
      button('Vis', showPreview),
      preview);
    previewSelect.onchange = showPreview;
    (document.querySelector('main') || document.body).append(details);
    showPreview();
  }

  function style() {
    document.head.append(el('style', {}, `
      .fyll-inn { display:flex; flex-wrap:wrap; gap:.4rem; align-items:center; margin:.4rem 0; }
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
    addButtons();
    addSandbox().catch(error => console.warn('handskrift: prompt-sandkassen kunne ikke starte.', error));
  }
  // ctm-libs bygger aktivitetene ved DOMContentLoaded; vent til de finnes.
  function ready() { if (activities().some(a => a.dataset.aiFeedbackReady)) start(); else setTimeout(ready, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
