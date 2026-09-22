```{.jsxgraph width="680" height="650" style="width:100%;max-width:680px;height:650px;border:0;"}
// The extension isolates this document in a sandboxed iframe. Keep both
// controls and their CSS here; board coordinates are only for mathematics.
document.documentElement.lang = 'en';
var graph = document.querySelector('.jxgbox');
var labStyle = document.createElement('style');
labStyle.textContent = `
  html, body { margin: 0; width: 100%; height: 100%; font-family: system-ui, sans-serif; color: #243447; }
  * { box-sizing: border-box; }
  .week5-lab { height: 100%; padding: 16px; display: flex; flex-direction: column; gap: 12px;
    border: 1px solid #d4dde5; border-radius: 12px; background: #fff; }
  .week5-lab fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
  .week5-lab legend { padding: 0; margin-bottom: 8px; font-weight: 650; font-size: 16px; }
  .week5-presets { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .week5-lab button { min-height: 44px; padding: 8px; border: 1px solid #a8b6c4; border-radius: 7px;
    background: #fff; color: #243447; font: inherit; font-size: 15px; cursor: pointer; }
  .week5-lab button:hover { background: #f0f4f8; }
  .week5-lab button[aria-pressed="true"] { background: #fff1df; border: 2px solid #a04a00; font-weight: 700; }
  .week5-lab button:focus-visible { outline: 3px solid #1565c0; outline-offset: 2px; }
  .week5-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .week5-lab .week5-main-step { min-height: 48px; background: #1557a0; border-color: #1557a0;
    color: #fff; font-size: 18px; font-weight: 700; }
  .week5-lab .week5-main-step:hover { background: #10457f; }
  .week5-graph-slot { flex: 1 1 auto; min-height: 180px; position: relative; }
  .week5-graph-slot .jxgbox { position: absolute; inset: 0; width: 100% !important; height: 100% !important; border: 0; }
  .week5-readout { flex: 0 0 auto; padding: 12px; border-radius: 8px; background: #f3f6fa; }
  .week5-readout p { margin: 0; line-height: 1.5; }
  .week5-start-key { color: #854000; font-size: 14px; }
  .week5-formula { color: #1557a0; font-size: clamp(16px, 3vw, 20px); font-weight: 650; overflow-wrap: anywhere; }
  .week5-coordinates { font-size: 15px; font-variant-numeric: tabular-nums; }
  @media (max-width: 380px) { .week5-lab { padding: 10px; gap: 10px; } .week5-readout { padding: 10px; } .week5-actions { grid-template-columns: 1fr; } }
`;
document.head.appendChild(labStyle);
var lab = document.createElement('section');
lab.className = 'week5-lab';
lab.setAttribute('aria-label', 'Repeated matrix multiplication');
lab.innerHTML = `
  <fieldset><legend>Choose a starting direction</legend><div class="week5-presets"></div></fieldset>
  <div class="week5-actions">
    <button type="button" class="week5-main-step">One step</button>
    <button type="button" class="week5-reset">Reset to starting vector</button>
  </div>
  <div class="week5-graph-slot"></div>
  <div class="week5-readout">
    <p class="week5-start-key"></p>
    <p class="week5-start-key">Drag the orange ring to choose your own starting vector.</p>
    <div role="status" aria-live="polite" aria-atomic="true">
      <p class="week5-formula"></p>
      <p class="week5-coordinates"></p>
    </div>
  </div>
`;
graph.parentNode.insertBefore(lab, graph);
lab.querySelector('.week5-graph-slot').appendChild(graph);
var formula = lab.querySelector('.week5-formula');
var coordinates = lab.querySelector('.week5-coordinates');
var startKey = lab.querySelector('.week5-start-key');
var selectedStart = '(1, 0)';
var presets = [[1, 0, '(1, 0)'], [-1, 0, '(−1, 0)'], [1, 1, '(1, 1)'],
  [1, -1, '(1, −1)'], [0, 1, '(0, 1)'], [1, -0.9, '(1, −0.9)']];
var presetButtons = [];
var bounds = [-1.3, 1.3, 1.3, -1.3];
var board = JXG.JSXGraph.initBoard(BOARDID, {
  boundingbox: bounds, axis: true, pan: {enabled: false}, zoom: {enabled: false},
  showCopyright: false, showNavigation: false, keepaspectratio: true
});
var origin = board.create('point', [0, 0], {visible: false, fixed: true});
var circle = board.create('circle', [origin, 1], {strokeColor: '#aab6c1', dash: 2, fixed: true, highlight: false});
var start = board.create('glider', [1, 0, circle], {
  name: '', withLabel: false, size: 9, strokeWidth: 3, strokeColor: '#a04a00',
  fillColor: '#fff', fillOpacity: 0, highlightFillOpacity: 0, highlightStrokeColor: '#a04a00', layer: 9
});
board.create('arrow', [origin, start], {strokeColor: '#a04a00', strokeWidth: 2, dash: 2, fixed: true, highlight: false});
var current = [1, 0], count = 0;
var end = board.create('point', [function(){return current[0];}, function(){return current[1];}],
  {name: '', withLabel: false, fixed: true, size: 3, color: '#1565c0', highlight: false, layer: 8});
board.create('arrow', [origin, end], {strokeColor: '#1565c0', strokeWidth: 3, fixed: true, highlight: false});
// Keep the normalized iterate identifiable next to the blue endpoint.
// The compact fraction fits inside the board even for starts near its edges.
function canvasFormula() {
  var power = 'A<sup>'+count+'</sup>x<sub>0</sub>';
  return '<span style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;' +
    'background:rgba(255,255,255,.94);padding:3px 5px;border-radius:4px;color:#1565c0">' +
    '<span>x<sub>'+count+'</sub> =</span>' +
    '<span style="display:inline-flex;flex-direction:column;text-align:center;line-height:1.25">' +
    '<span style="border-bottom:1px solid #1565c0;padding:0 3px">'+power+'</span>' +
    '<span>‖'+power+'‖<sub>2</sub></span></span>';
}
// Use a DOM overlay inside the plotting area so JSXGraph's text renderer
// does not process or hide the HTML fraction.
var iterateLabel = document.createElement('div');
iterateLabel.className = 'week5-canvas-label';
iterateLabel.style.cssText = 'position:absolute;z-index:20;pointer-events:none;font-size:14px;line-height:1.25;';
lab.querySelector('.week5-graph-slot').appendChild(iterateLabel);
function positionIterateLabel() {
  var width = graph.clientWidth, height = graph.clientHeight;
  if (!(width > 0 && height > 0)) return;
  var px = board.origin.scrCoords[1] + current[0] * board.unitX;
  var py = board.origin.scrCoords[2] - current[1] * board.unitY;
  var labelWidth = iterateLabel.offsetWidth;
  var labelHeight = iterateLabel.offsetHeight;
  var left = Math.max(6, Math.min(width-labelWidth-6, px+12));
  var top = py-labelHeight-12;
  if (top < 6) top = py+12;
  top = Math.max(6, Math.min(height-labelHeight-6, top));
  iterateLabel.style.left = left+'px';
  iterateLabel.style.top = top+'px';
}
function formatCoordinate(value) { return (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3); }
function updateReadout() {
  iterateLabel.innerHTML = canvasFormula();
  positionIterateLabel();
  startKey.textContent = 'Orange ring · '+(selectedStart || 'Custom starting vector')+': x₀ = ('+
    formatCoordinate(start.X())+', '+formatCoordinate(start.Y())+')';
  formula.innerHTML = 'Blue: x<sub>'+count+'</sub> = A<sup>'+count+'</sup>x<sub>0</sub>' +
    ' / ‖A<sup>'+count+'</sup>x<sub>0</sub>‖<sub>2</sub>';
  var rounded = current.map(formatCoordinate);
  coordinates.textContent = 'Step '+count+' · ('+rounded[0]+', '+rounded[1]+')';
}
function reset() {
  current = [start.X(), start.Y()]; count = 0; board.update(); updateReadout();
}
function choose(a, b, selected) {
  var length = Math.hypot(a, b);
  start.moveTo([a/length, b/length]);
  selectedStart = selected ? selected.textContent : null;
  presetButtons.forEach(function(button) { button.setAttribute('aria-pressed', String(button === selected)); });
  reset();
}
presets.forEach(function(preset) {
  var button = document.createElement('button');
  button.type = 'button'; button.textContent = preset[2];
  button.setAttribute('aria-pressed', String(presetButtons.length === 0));
  button.addEventListener('click', function() { choose(preset[0], preset[1], button); });
  presetButtons.push(button); lab.querySelector('.week5-presets').appendChild(button);
});
start.on('drag', function() {
  selectedStart = null;
  presetButtons.forEach(function(button) { button.setAttribute('aria-pressed', 'false'); });
  reset();
});
lab.querySelector('.week5-main-step').addEventListener('click', function() {
  var y = [2*current[0]+current[1], current[0]+2*current[1]];
  var length = Math.hypot(y[0], y[1]);
  current = [y[0]/length, y[1]/length]; count++; board.update(); updateReadout();
});
lab.querySelector('.week5-reset').addEventListener('click', reset);
// Re-measure on width changes and when the containing Quarto tab becomes visible.
// Ignore zero dimensions while hidden; retain CSS ownership of the graph size.
function resizeGraph() {
  var width = graph.clientWidth, height = graph.clientHeight;
  if (!(width > 0 && height > 0)) return;
  board.resizeContainer(width, height, true);
  board.setBoundingBox(bounds, true); board.fullUpdate();
  positionIterateLabel();
}
if (typeof ResizeObserver !== 'undefined') {
  var graphObserver = new ResizeObserver(resizeGraph);
  graphObserver.observe(graph);
}
window.addEventListener('resize', resizeGraph);
window.addEventListener('pageshow', resizeGraph);
updateReadout(); resizeGraph();
```
