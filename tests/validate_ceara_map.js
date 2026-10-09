const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const municipalities = readJson('mapa/data/municipios-ceara-2026.geojson');
const neighborhoods = readJson('mapa/data/bairros-fortaleza.geojson');
const battalions = readJson('mapa/data/batalhoes-situacao.geojson');
const regions = readJson('mapa/data/crpm-regioes.geojson');
const aisRegions = readJson('mapa/data/ais-regioes.geojson');
const cancellations = readJson('mapa/data/cancelamentos-2026.json');
const averageTimes = readJson('mapa/data/tempos-medios-2026.json');
const sum = (field) => battalions.features.reduce((total, feature) => total + Number(feature.properties[field] || 0), 0);

assert.equal(municipalities.features.length, 184, 'A malha deve conter os 184 municípios do Ceará');
assert.equal(neighborhoods.features.length, 121, 'A camada deve conter os 121 bairros oficiais de Fortaleza');
assert.equal(battalions.features.length, 34, 'O mapa deve conter os 34 BPMs territoriais');
assert.equal(regions.features.length, 8, 'O mapa deve conter as oito divisões de CRPM');
assert.equal(aisRegions.features.length, 33, 'A camada AIS deve conter as 33 regiões com geometria disponível');
assert.equal(cancellations.total_registros, 23816, 'Total de cancelamentos divergente');
assert.equal(cancellations.ocorrencias_unicas, 23491, 'Total de ocorrências canceladas únicas divergente');
assert.equal(Object.keys(cancellations.por_ais).length, 34, 'Cobertura AIS dos cancelamentos divergente');
assert.equal(Object.values(cancellations.por_ais).reduce((total, value) => total + value, 0), 23816, 'Soma dos cancelamentos por AIS divergente');
assert.equal(Object.keys(cancellations.por_municipio).length, 120, 'Cobertura municipal dos cancelamentos divergente');
assert.equal(averageTimes.total_ocorrencias_analisadas, 37814, 'Total analisado dos tempos médios divergente');
assert.equal(averageTimes.quantidade_ais, 34, 'Cobertura AIS dos tempos médios divergente');
assert.equal(Object.keys(averageTimes.por_ais).length, 34, 'Agregados AIS dos tempos médios divergentes');
assert(averageTimes.tempo_estadual.resposta_min > 0 && averageTimes.tempo_estadual.resposta_min < 60, 'Tempo médio estadual inválido');
assert.equal(new Set(municipalities.features.map(feature => feature.properties.codigo_ibge)).size, 184, 'Códigos IBGE municipais duplicados');
assert.equal(new Set(battalions.features.map(feature => feature.properties.batalhao)).size, 34, 'Batalhões duplicados');
assert.equal(sum('efetivo'), 10241, 'Total do efetivo dos BPMs divergente');
assert.equal(sum('exoneracoes'), 60, 'Total de exonerações divergente');
assert.equal(sum('demissoes'), 170, 'Total de demissões divergente');
assert.equal(sum('requeridas'), 430, 'Total de requeridas divergente');
assert.equal(sum('movimentacoes'), -304, 'Saldo das movimentações divergente');
assert.equal(sum('perdas'), 1139, 'Necessidade situacional divergente');
assert.equal(sum('reestruturacao'), 410, 'Reestruturação divergente');
assert.equal(sum('ajuste_necessidade'), -111, 'Ajustes da necessidade dos BPMs divergentes');
assert.equal(sum('necessidade'), 1438, 'Necessidade consolidada ajustada dos 34 BPMs divergente');

for (const feature of municipalities.features) {
  const properties = feature.properties;
  assert(properties.municipio && properties.codigo_ibge && properties.bpm && properties.crpm, `Município incompleto: ${properties.municipio}`);
  assert(['Polygon', 'MultiPolygon'].includes(feature.geometry.type), `Geometria municipal inválida: ${properties.municipio}`);
  assert(Number.isInteger(properties.populacao_estimada_2026) && properties.populacao_estimada_2026 > 0, `População 2026 inválida: ${properties.municipio}`);
  assert(properties.idhm_2010 > 0 && properties.idhm_2010 < 1, `IDHM 2010 inválido: ${properties.municipio}`);
}

for (const feature of battalions.features) {
  const properties = feature.properties;
  assert.equal(feature.geometry.type, 'Point', `Marcador inválido: ${properties.batalhao}`);
  assert.equal(properties.necessidade, properties.perdas + properties.reestruturacao + properties.ajuste_necessidade, `Necessidade divergente: ${properties.batalhao}`);
  assert(Number.isInteger(properties.efetivo) && Number.isInteger(properties.necessidade), `Efetivo fracionário: ${properties.batalhao}`);
}

for (const feature of neighborhoods.features) {
  const properties = feature.properties;
  assert(properties.bairro && properties.ais && properties.bpm && properties.crpm, `Bairro incompleto: ${properties.bairro}`);
  assert(['1º CRPM', '5º CRPM'].includes(properties.crpm), `CRPM inválido em Fortaleza: ${properties.bairro}`);
}

const neighborhoodsWithPopulation = neighborhoods.features.filter(feature => Number.isInteger(feature.properties.populacao_2010));
const neighborhoodsWithIdhb = neighborhoods.features.filter(feature => Number.isFinite(feature.properties.idhb_2010));
assert.equal(neighborhoodsWithPopulation.length, 116, 'Cobertura da população de bairros de Fortaleza divergente');
assert.equal(neighborhoodsWithIdhb.length, 116, 'Cobertura do IDH-B de Fortaleza divergente');
assert(neighborhoodsWithPopulation.every(feature => feature.properties.populacao_2010 > 0), 'População de bairro inválida');
assert(neighborhoodsWithIdhb.every(feature => feature.properties.idhb_2010 > 0 && feature.properties.idhb_2010 < 1), 'IDH-B de bairro inválido');

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

assert.equal(new Set(aisRegions.features.map(feature => feature.properties.ais)).size, 33, 'AIS duplicadas na camada territorial');
assert(!aisRegions.features.some(feature => feature.properties.ais === 'AIS 12'), 'A AIS 12 não deve receber polígono inventado');
for (const feature of aisRegions.features) {
  assert(['Polygon', 'MultiPolygon'].includes(feature.geometry.type), `Geometria AIS inválida: ${feature.properties.ais}`);
  assert.equal(feature.properties.label_coordinates.length, 2, `Rótulo AIS inválido: ${feature.properties.ais}`);
}

const html = fs.readFileSync(path.join(root, 'mapa/index.html'), 'utf8');
const dashboardHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'mapa/map.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'mapa/map.js'), 'utf8');
assert(html.includes('map.js') && html.includes('vendor/leaflet.js'), 'Dependências da página do mapa ausentes');
assert(html.includes('vendor/leaflet.markercluster.js'), 'Agrupamento dos batalhões ausente');
assert(html.includes('toggleRegions') && html.includes('Divisão territorial · CRPM'), 'Controles e legenda dos CRPMs ausentes');
assert(html.includes('<select id="mapSearchInput"') && script.includes("input.addEventListener('change', search)"), 'Filtro de seleção direta ausente');
assert(script.includes('is-filter-selected') && css.includes('@keyframes filter-marker-pulse'), 'Destaque visual do filtro ausente');
assert(!html.includes('class="map-back"'), 'Botão de retorno ainda presente no mapa');
assert(script.includes("fetch('data/crpm-regioes.geojson')"), 'Camada geográfica dos CRPMs ausente');
assert(script.includes("fetch('data/ais-regioes.geojson')") && script.includes('toggleAis'), 'Camada geográfica das AIS ausente');
assert(html.includes('toggleCancellations') && script.includes("fetch('data/cancelamentos-2026.json')") && script.includes('addCancellations'), 'Camada de ocorrências canceladas ausente');
assert(html.includes('toggleAverageTimes') && script.includes("fetch('data/tempos-medios-2026.json')") && script.includes('addAverageTimes'), 'Camada de tempos médios ausente');
assert(script.includes('averageTimeDetails') && script.includes('formatMinutes'), 'Detalhes dos tempos médios não foram preservados nos tooltips territoriais');
assert(script.includes("getPane('aisBordersPane').style.pointerEvents = 'none'") && script.includes('territorialDetails'), 'Camadas sobrepostas não preservam os dados territoriais');
assert(script.includes('População estimada (IBGE, 2026)') && script.includes('IDHM (2010)'), 'Indicadores municipais socioeconômicos ausentes');
assert(script.includes('População (Censo, 2010)') && script.includes('IDH-B (2010)'), 'Indicadores por bairro ausentes');
assert(dashboardHtml.includes('id="icon-map"'), 'Ícone do mapa ausente no painel');
assert(dashboardHtml.includes('class="situational-map-button"') && dashboardHtml.includes('href="mapa/"'), 'Atalho do painel para o mapa ausente');
assert(dashboardHtml.includes('target="_blank"') && dashboardHtml.includes('ANÁLISE SITUACIONAL'), 'Atalho do mapa deve abrir o ambiente em nova aba');
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
