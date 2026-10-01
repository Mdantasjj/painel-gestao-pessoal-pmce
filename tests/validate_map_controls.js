const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    checked: true, value: '', textContent: '', innerHTML: '', handlers: {},
    classList: { add() {}, remove() {} },
    addEventListener(type, handler) { this.handlers[type] = handler; },
    dispatchEvent(event) { this.handlers[event.type]?.({ target: this, preventDefault() {} }); }
  });
  return elements.get(id);
}
const visible = new Set();
const views = [];
const map = {
  createPane() {}, getPane() { return { style: {} }; },
  hasLayer(layer) { return visible.has(layer); }, removeLayer(layer) { visible.delete(layer); },
  fitBounds(bounds) { views.push(['bounds', bounds]); },
  setView(position, zoom) { views.push(['position', position, zoom]); }, closeTooltip() {}
};
const context = vm.createContext({
  console, Event: class { constructor(type) { this.type = type; } },
  document: { querySelector: (id) => element(id) },
  L: { map: () => map, control: { zoom: () => ({ addTo() {} }) } }
});
const source = fs.readFileSync(path.join(__dirname, '../mapa/map.js'), 'utf8');
vm.runInContext(source.replace(/initialize\(\);\s*$/, ''), context);
function group() {
  return { layers: [], addTo() { visible.add(this); }, resetStyle(layer) { layer.style = null; },
    eachLayer(callback) { this.layers.forEach(callback); },
    getBounds() { return 'state'; }, zoomToShowLayer(marker, callback) { callback(); } };
}
function target(bounds) {
  const classes = new Set();
  return { feature: { properties: { crpm: '3º CRPM' } }, style: null, tooltip: false,
    getBounds() { return bounds; }, getLatLng() { return [-3.8, -40]; },
    getElement() { return { classList: { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)) } }; },
    setStyle(style) { this.style = style; }, setOpacity(value) { this.opacity = value; },
    bringToFront() {}, openTooltip() { this.tooltip = true; } };
}
context.groups = Object.fromEntries(['regions', 'regionLabels', 'municipalities', 'neighborhoods', 'battalions'].map(key => [key, group()]));
const region = target('regional');
const municipality = target('sobral');
const battalion = target('bpm');
const neighborhood = target('centro');
context.items = [
  { label: '3º CRPM · 3 BPMs', type: 'crpm', target: region, properties: { crpm: '3º CRPM' } },
  { label: 'Sobral', type: 'municipio', target: municipality },
  { label: '3º BPM · Sobral', type: 'batalhao', target: battalion, properties: { sede: 'Sobral' } },
  { label: 'Centro · Fortaleza', type: 'bairro', target: neighborhood }
];
context.groups.regions.layers = [region];
context.groups.municipalities.layers = [municipality];
context.groups.neighborhoods.layers = [neighborhood];
context.groups.battalions.layers = [battalion];
battalion.filterProperties = { crpm: '3º CRPM' };
// A checkbox changed during data loading must be respected when controls initialize.
element('#toggleMunicipalities').checked = false;
vm.runInContext('Object.assign(state, groups); state.searchItems = items; configureLayerControls(); configureSearch();', context);
assert(!visible.has(context.groups.municipalities));
element('#toggleRegions').checked = false;
element('#toggleRegions').dispatchEvent({ type: 'change' });
assert(!visible.has(context.groups.regions) && !visible.has(context.groups.regionLabels));

const input = element('#mapSearchInput');
input.value = 'crpm:0';
input.dispatchEvent({ type: 'change' });
assert(visible.has(context.groups.regions) && visible.has(context.groups.regionLabels));
assert.equal(views.at(-1)[1], 'regional');
assert.equal(region.style.fillOpacity, .9);

input.value = 'municipio:1';
input.dispatchEvent({ type: 'change' });
assert(visible.has(context.groups.municipalities));
assert.equal(views.at(-1)[1], 'sobral');
assert.equal(region.style, null, 'Previous highlight must be reset');
assert(municipality.tooltip);

element('#toggleBattalions').checked = false;
element('#toggleBattalions').dispatchEvent({ type: 'change' });
input.value = 'batalhao:2';
element('#mapSearch').dispatchEvent({ type: 'submit' });
assert(visible.has(context.groups.battalions));
assert.equal(views.at(-1)[0], 'position');
assert(battalion.tooltip, 'Clustered marker must be revealed before opening its tooltip');

input.value = 'bairro:3';
input.dispatchEvent({ type: 'change' });
assert.equal(views.at(-1)[1], 'centro');
assert(input.innerHTML.includes('<optgroup label="CRPMs">'));
assert(input.innerHTML.includes('Centro · Fortaleza'));
input.value = '';
input.dispatchEvent({ type: 'change' });
assert.equal(views.at(-1)[1], 'state');
assert.equal(neighborhood.style, null);
input.value = 'local inexistente';
input.dispatchEvent({ type: 'change' });
assert.equal(element('#mapSearchFeedback').textContent, 'Local não encontrado na base territorial.');
console.log('Validated map search, automatic selection, layer toggles, clustered markers and reset.');
