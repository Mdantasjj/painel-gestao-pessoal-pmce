const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const municipalities = readJson('mapa/data/municipios-ceara-2026.geojson');
const neighborhoods = readJson('mapa/data/bairros-fortaleza.geojson');
const battalions = readJson('mapa/data/batalhoes-situacao.geojson');
const regions = readJson('mapa/data/crpm-regioes.geojson');
const sum = (field) => battalions.features.reduce((total, feature) => total + Number(feature.properties[field] || 0), 0);

assert.equal(municipalities.features.length, 184, 'A malha deve conter os 184 municípios do Ceará');
assert.equal(neighborhoods.features.length, 121, 'A camada deve conter os 121 bairros oficiais de Fortaleza');
assert.equal(battalions.features.length, 34, 'O mapa deve conter os 34 BPMs territoriais');
assert.equal(regions.features.length, 8, 'O mapa deve conter as oito divisões de CRPM');
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

for (const feature of neighborhoods.features) {
  const properties = feature.properties;
  assert(properties.bairro && properties.ais && properties.bpm && properties.crpm, `Bairro incompleto: ${properties.bairro}`);
  assert(['1º CRPM', '5º CRPM'].includes(properties.crpm), `CRPM inválido em Fortaleza: ${properties.bairro}`);
}

const neighborhoodsPerCrpm = neighborhoods.features.reduce((counts, feature) => {
  counts[feature.properties.crpm] = (counts[feature.properties.crpm] || 0) + 1;
  return counts;
}, {});
assert.deepEqual(neighborhoodsPerCrpm, { '1º CRPM': 72, '5º CRPM': 49 }, 'Divisão dos bairros de Fortaleza divergente');
assert.deepEqual(
  regions.features.map(feature => feature.properties.crpm).sort(),
  ['1º CRPM', '2º CRPM', '3º CRPM', '4º CRPM', '5º CRPM', '6º CRPM', '7º CRPM', '8º CRPM'],
  'Relação de CRPMs divergente'
);
assert.equal(regions.features.reduce((total, feature) => total + feature.properties.quantidade_batalhoes, 0), 34, 'BPMs dos CRPMs divergentes');
assert.equal(regions.features.reduce((total, feature) => total + feature.properties.municipios_integrais, 0), 183, 'Municípios integrais dos CRPMs divergentes');
assert.equal(regions.features.reduce((total, feature) => total + feature.properties.bairros_fortaleza, 0), 121, 'Bairros dos CRPMs divergentes');
for (const feature of regions.features) {
  assert(['Polygon', 'MultiPolygon'].includes(feature.geometry.type), `Geometria regional inválida: ${feature.properties.crpm}`);
  assert.equal(feature.properties.label_coordinates.length, 2, `Rótulo regional inválido: ${feature.properties.crpm}`);
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  assert.equal(polygons.reduce((total, polygon) => total + Math.max(0, polygon.length - 1), 0), 0, `Microfrestas internas no contorno: ${feature.properties.crpm}`);
}

const html = fs.readFileSync(path.join(root, 'mapa/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'mapa/map.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'mapa/map.js'), 'utf8');
assert(html.includes('map.js') && html.includes('vendor/leaflet.js'), 'Dependências da página do mapa ausentes');
assert(html.includes('vendor/leaflet.markercluster.js'), 'Agrupamento dos batalhões ausente');
assert(html.includes('toggleRegions') && html.includes('Divisão territorial · CRPM'), 'Controles e legenda dos CRPMs ausentes');
assert(script.includes("fetch('data/crpm-regioes.geojson')"), 'Camada geográfica dos CRPMs ausente');
assert(script.includes("weight: 1.8") && script.includes("lineJoin: 'round'"), 'Acabamento dos contornos dos CRPMs divergente');
const officialCrpmColors = {
  '1º CRPM': '#42a5f5', '2º CRPM': '#ff7043', '3º CRPM': '#7e57c2', '4º CRPM': '#ef5350',
  '5º CRPM': '#26a69a', '6º CRPM': '#ec407a', '7º CRPM': '#66bb6a', '8º CRPM': '#ffca28'
};
for (const [crpm, color] of Object.entries(officialCrpmColors)) {
  assert(script.includes(`'${crpm}': '${color}'`), `Cor oficial divergente: ${crpm}`);
  assert(html.includes(`--legend-color:${color}`), `Cor da legenda divergente: ${crpm}`);
}
assert(css.includes('*, *::before, *::after {') && css.includes('font-family: "Montserrat", "Segoe UI", Arial, sans-serif !important;'), 'Montserrat não aplicada globalmente ao mapa');

console.log('Validated Ceará map: 8 CRPMs, 184 municipalities, 121 Fortaleza neighborhoods and 34 BPMs.');
