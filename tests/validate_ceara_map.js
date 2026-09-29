const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const municipalities = readJson('mapa/data/municipios-ceara-2026.geojson');
const neighborhoods = readJson('mapa/data/bairros-fortaleza.geojson');
const battalions = readJson('mapa/data/batalhoes-situacao.geojson');
const sum = (field) => battalions.features.reduce((total, feature) => total + Number(feature.properties[field] || 0), 0);

assert.equal(municipalities.features.length, 184, 'A malha deve conter os 184 municípios do Ceará');
assert.equal(neighborhoods.features.length, 121, 'A camada deve conter os 121 bairros oficiais de Fortaleza');
assert.equal(battalions.features.length, 34, 'O mapa deve conter os 34 BPMs territoriais');
assert.equal(new Set(municipalities.features.map(feature => feature.properties.codigo_ibge)).size, 184, 'Códigos IBGE municipais duplicados');
assert.equal(new Set(battalions.features.map(feature => feature.properties.batalhao)).size, 34, 'Batalhões duplicados');
assert.equal(sum('efetivo'), 10241, 'Total do efetivo dos BPMs divergente');
assert.equal(sum('exoneracoes'), 60, 'Total de exonerações divergente');
assert.equal(sum('demissoes'), 170, 'Total de demissões divergente');
assert.equal(sum('requeridas'), 430, 'Total de requeridas divergente');
assert.equal(sum('movimentacoes'), 90, 'Saldo das movimentações divergente');
assert.equal(sum('perdas'), 633, 'Necessidade situacional divergente');
assert.equal(sum('reestruturacao'), 410, 'Reestruturação divergente');
assert.equal(sum('necessidade'), 1043, 'Necessidade consolidada dos 34 BPMs divergente');

for (const feature of municipalities.features) {
  const properties = feature.properties;
  assert(properties.municipio && properties.codigo_ibge && properties.bpm && properties.crpm, `Município incompleto: ${properties.municipio}`);
  assert(['Polygon', 'MultiPolygon'].includes(feature.geometry.type), `Geometria municipal inválida: ${properties.municipio}`);
}

for (const feature of battalions.features) {
  const properties = feature.properties;
  assert.equal(feature.geometry.type, 'Point', `Marcador inválido: ${properties.batalhao}`);
  assert.equal(properties.necessidade, properties.perdas + properties.reestruturacao, `Necessidade divergente: ${properties.batalhao}`);
  assert(Number.isInteger(properties.efetivo) && Number.isInteger(properties.necessidade), `Efetivo fracionário: ${properties.batalhao}`);
}

const html = fs.readFileSync(path.join(root, 'mapa/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'mapa/map.css'), 'utf8');
assert(html.includes('map.js') && html.includes('vendor/leaflet.js'), 'Dependências da página do mapa ausentes');
assert(html.includes('vendor/leaflet.markercluster.js'), 'Agrupamento dos batalhões ausente');
assert(css.includes('font-family: "Montserrat"'), 'Montserrat não aplicada ao mapa');

console.log('Validated Ceará map: 184 municipalities, 121 Fortaleza neighborhoods and 34 BPMs.');
