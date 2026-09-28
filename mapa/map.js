const CRPM_COLORS = {
  '1º CRPM': '#d7eadf',
  '2º CRPM': '#c8e1d2',
  '3º CRPM': '#b7d6c4',
  '4º CRPM': '#a5cbb5',
  '5º CRPM': '#91bea5',
  '6º CRPM': '#7caf96',
  '7º CRPM': '#659f83',
  '8º CRPM': '#4d8d70'
};

const NEED_COLORS = {
  zero: '#8fba9f',
  low: '#4c9a70',
  medium: '#23734f',
  high: '#0b4932'
};

const map = L.map('map', {
  zoomControl: false,
  attributionControl: false,
  preferCanvas: true,
  minZoom: 6,
  maxZoom: 16,
  zoomSnap: .25
});

L.control.zoom({ position: 'topleft', zoomInTitle: 'Aproximar', zoomOutTitle: 'Afastar' }).addTo(map);

const state = {
  municipalities: null,
  neighborhoods: null,
  battalions: null,
  municipalityFeatures: new Map(),
  neighborhoodFeatures: new Map(),
  battalionMarkers: new Map(),
  searchItems: []
};

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]/g, '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('pt-BR');
}

function signed(value) {
  const number = Number(value || 0);
  return `${number > 0 ? '+' : ''}${formatNumber(number)}`;
}

function needLevel(value) {
  const number = Number(value || 0);
  if (number === 0) return 'zero';
  if (number < 40) return 'low';
  if (number < 80) return 'medium';
  return 'high';
}

function municipalityStyle(feature) {
  return {
    color: '#ffffff',
    weight: .85,
    opacity: .96,
    fillColor: CRPM_COLORS[feature.properties.crpm] || '#d8e7de',
    fillOpacity: .88
  };
}

function municipalityTooltip(properties) {
  let territorialReference = `${properties.bpm} · ${properties.crpm}`;
  if (properties.municipio === 'Fortaleza') territorialReference = '10 BPMs territoriais · Capital';
  if (properties.municipio === 'Caucaia') territorialReference = '12º BPM e 26º BPM · 2º CRPM';
  return `<strong>${escapeHtml(properties.municipio)}</strong><span>${escapeHtml(territorialReference)} · ${formatNumber(properties.area_km2)} km²</span>`;
}

function battalionTooltip(properties) {
  const locations = properties.localidades_referencia.join(' · ');
  const coverage = properties.quantidade_municipios === 1
    ? properties.municipios_cobertos[0]
    : `${properties.quantidade_municipios} municípios na base territorial`;
  return `
    <div class="tooltip-head">
      <span>${escapeHtml(properties.crpm)} · ANÁLISE SITUACIONAL 2025–2026</span>
      <strong>${escapeHtml(properties.batalhao)}</strong>
      <small>${escapeHtml(locations)} · ${escapeHtml(coverage)}</small>
    </div>
    <div class="tooltip-summary">
      <div><span>Efetivo da unidade</span><strong>${formatNumber(properties.efetivo)}</strong></div>
      <div><span>Companhias</span><strong>${formatNumber(properties.companhias)}</strong></div>
      <div><span>Saldo situacional</span><strong>${signed(properties.situacao)}</strong></div>
    </div>
    <div class="tooltip-grid">
      <div><span>Exonerações</span><strong>${formatNumber(properties.exoneracoes)}</strong></div>
      <div><span>Demissões</span><strong>${formatNumber(properties.demissoes)}</strong></div>
      <div><span>Requeridas</span><strong>${formatNumber(properties.requeridas)}</strong></div>
      <div><span>Movimentações</span><strong>${signed(properties.movimentacoes)}</strong></div>
      <div><span>Perdas</span><strong>${formatNumber(properties.perdas)}</strong></div>
      <div><span>Reestruturação</span><strong>${properties.reestruturacao ? formatNumber(properties.reestruturacao) : '—'}</strong></div>
      <div><span>Requeridas 2025</span><strong>${formatNumber(properties.requeridas_2025)}</strong></div>
      <div><span>Requeridas 2026</span><strong>${formatNumber(properties.requeridas_2026)}</strong></div>
    </div>
    <div class="tooltip-need"><span>Necessidade de efetivo</span><strong>${formatNumber(properties.necessidade)} policiais</strong></div>
    <div class="tooltip-foot">Posição do marcador: ${escapeHtml(properties.ancora)} (${escapeHtml(properties.tipo_ancora)}). Promoção requerida representa impacto de recomposição, não baixa institucional confirmada.</div>`;
}

function createBattalionIcon(properties) {
  const level = needLevel(properties.necessidade);
  return L.divIcon({
    className: '',
    html: `<div class="battalion-marker" style="--marker-color:${NEED_COLORS[level]}"><span>${properties.numero}º</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 28],
    tooltipAnchor: [0, -25]
  });
}

function addMunicipalities(data) {
  state.municipalities = L.geoJSON(data, {
    style: municipalityStyle,
    onEachFeature(feature, layer) {
      state.municipalityFeatures.set(normalize(feature.properties.municipio), layer);
      state.searchItems.push({ label: feature.properties.municipio, type: 'municipio', target: layer });
      layer.bindTooltip(municipalityTooltip(feature.properties), { className: 'municipality-tooltip', sticky: true, direction: 'top' });
      layer.on({
        mouseover() { layer.setStyle({ color: '#0e5a3c', weight: 2, fillOpacity: 1 }); layer.bringToFront(); },
        mouseout() { state.municipalities.resetStyle(layer); },
        click() { map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 11 }); }
      });
    }
  }).addTo(map);
  const bounds = state.municipalities.getBounds();
  map.fitBounds(bounds, { padding: [18, 18] });
  map.setMaxBounds(bounds.pad(.18));
}

function addNeighborhoods(data) {
  state.neighborhoods = L.geoJSON(data, {
    style: { color: '#0d5a3b', weight: 1, opacity: .75, fillColor: '#cce4d6', fillOpacity: .12 },
    onEachFeature(feature, layer) {
      state.neighborhoodFeatures.set(normalize(feature.properties.bairro), layer);
      state.searchItems.push({ label: `${feature.properties.bairro} · Fortaleza`, type: 'bairro', target: layer });
      layer.bindTooltip(`<strong>${escapeHtml(feature.properties.bairro)}</strong>`, { className: 'neighborhood-tooltip', sticky: true, direction: 'top' });
      layer.on({
        mouseover() { layer.setStyle({ color: '#0b4932', weight: 2, fillOpacity: .28 }); layer.bringToFront(); },
        mouseout() { state.neighborhoods.resetStyle(layer); },
        click() { map.fitBounds(layer.getBounds(), { padding: [35, 35], maxZoom: 14 }); }
      });
    }
  }).addTo(map);
}

function addBattalions(data) {
  state.battalions = L.markerClusterGroup({
    maxClusterRadius: 34,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    spiderfyDistanceMultiplier: 1.25,
    zoomToBoundsOnClick: true,
    chunkedLoading: true,
    iconCreateFunction(cluster) {
      const count = cluster.getChildCount();
      const size = count >= 10 ? 44 : 38;
      return L.divIcon({
        className: 'battalion-cluster',
        html: `<span>${count}</span>`,
        iconSize: [size, size]
      });
    }
  }).addTo(map);
  data.features.forEach((feature) => {
    const properties = feature.properties;
    const [longitude, latitude] = feature.geometry.coordinates;
    const marker = L.marker([latitude, longitude], {
      icon: createBattalionIcon(properties),
      riseOnHover: true,
      keyboard: true,
      title: properties.batalhao,
      alt: `${properties.batalhao} — ${properties.localidades_referencia.join(' e ')}`
    });
    marker.bindTooltip(battalionTooltip(properties), {
      className: 'battalion-tooltip',
      direction: 'top',
      opacity: 1,
      interactive: true
    });
    marker.on('click', () => {
      map.flyTo([latitude, longitude], Math.max(map.getZoom(), properties.sede === 'Fortaleza' ? 12 : 10), { duration: .55 });
      marker.openTooltip();
    });
    marker.addTo(state.battalions);
    state.battalionMarkers.set(normalize(properties.batalhao), marker);
    state.searchItems.push({ label: `${properties.batalhao} · ${properties.localidades_referencia.join(' · ')}`, type: 'batalhao', target: marker, properties });
  });
}

function configureLayerControls() {
  const controls = [
    ['toggleMunicipalities', 'municipalities'],
    ['toggleNeighborhoods', 'neighborhoods'],
    ['toggleBattalions', 'battalions']
  ];
  controls.forEach(([id, key]) => {
    document.querySelector(`#${id}`).addEventListener('change', (event) => {
      const layer = state[key];
      if (!layer) return;
      if (event.target.checked) layer.addTo(map);
      else map.removeLayer(layer);
      if (state.battalions && map.hasLayer(state.battalions)) state.battalions.bringToFront?.();
    });
  });
}

function configureSearch() {
  const form = document.querySelector('#mapSearch');
  const input = document.querySelector('#mapSearchInput');
  const feedback = document.querySelector('#mapSearchFeedback');
  const datalist = document.querySelector('#mapSearchOptions');
  datalist.innerHTML = state.searchItems
    .filter((item) => item.type === 'batalhao' || item.type === 'municipio')
    .map((item) => `<option value="${escapeHtml(item.label)}"></option>`)
    .join('');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = normalize(input.value.split('·')[0]);
    if (!query) return;
    const exact = state.searchItems.find((item) => normalize(item.label.split('·')[0]) === query);
    const partial = state.searchItems.find((item) => normalize(item.label).includes(query));
    const result = exact || partial;
    feedback.classList.remove('is-visible');
    if (!result) {
      feedback.textContent = 'Local não encontrado na base territorial.';
      feedback.classList.add('is-visible');
      return;
    }
    if (result.type === 'batalhao') {
      const position = result.target.getLatLng();
      map.flyTo(position, result.properties.sede === 'Fortaleza' ? 12 : 10, { duration: .7 });
      window.setTimeout(() => result.target.openTooltip(), 650);
    } else {
      map.fitBounds(result.target.getBounds(), { padding: [35, 35], maxZoom: result.type === 'bairro' ? 14 : 11 });
      window.setTimeout(() => result.target.openTooltip(), 450);
    }
  });
}

function addAttribution() {
  const attribution = document.createElement('div');
  attribution.className = 'map-attribution';
  attribution.innerHTML = 'Limites municipais: <a href="https://www.ipece.ce.gov.br/limites-municipais/" target="_blank" rel="noopener">IPECE 2026</a> · Bairros: <a href="https://mapas.fortaleza.ce.gov.br/mapa/21/bairros-de-fortaleza" target="_blank" rel="noopener">IPLANFOR 2023</a> · Análise: PMCE 2025–2026';
  document.body.append(attribution);
}

async function initialize() {
  try {
    const responses = await Promise.all([
      fetch('data/municipios-ceara-2026.geojson'),
      fetch('data/bairros-fortaleza.geojson'),
      fetch('data/batalhoes-situacao.geojson')
    ]);
    if (responses.some((response) => !response.ok)) throw new Error('Falha ao obter os dados geográficos.');
    const [municipalities, neighborhoods, battalions] = await Promise.all(responses.map((response) => response.json()));
    addMunicipalities(municipalities);
    addNeighborhoods(neighborhoods);
    addBattalions(battalions);
    configureLayerControls();
    configureSearch();
    addAttribution();
    document.querySelector('#mapLoading').hidden = true;
  } catch (error) {
    document.querySelector('#mapLoading').hidden = true;
    document.querySelector('#mapError').hidden = false;
    console.error(error);
  }
}

initialize();
