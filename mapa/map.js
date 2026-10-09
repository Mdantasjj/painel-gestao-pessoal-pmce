const CRPM_COLORS = {
  '1º CRPM': '#42a5f5',
  '2º CRPM': '#ff7043',
  '3º CRPM': '#7e57c2',
  '4º CRPM': '#ef5350',
  '5º CRPM': '#26a69a',
  '6º CRPM': '#ec407a',
  '7º CRPM': '#66bb6a',
  '8º CRPM': '#ffca28'
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
map.createPane('crpmBordersPane');
map.getPane('crpmBordersPane').style.zIndex = 425;
map.getPane('crpmBordersPane').style.pointerEvents = 'none';
map.createPane('crpmLabelsPane');
map.getPane('crpmLabelsPane').style.zIndex = 440;
map.getPane('crpmLabelsPane').style.pointerEvents = 'none';
map.createPane('aisBordersPane');
map.getPane('aisBordersPane').style.zIndex = 435;
map.getPane('aisBordersPane').style.pointerEvents = 'none';
map.createPane('cancellationsPane');
map.getPane('cancellationsPane').style.zIndex = 410;

const state = {
  regions: null,
  regionLabels: null,
  aisRegions: null,
  cancellations: null,
  municipalities: null,
  neighborhoods: null,
  battalions: null,
  municipalityFeatures: new Map(),
  neighborhoodFeatures: new Map(),
  battalionMarkers: new Map(),
  searchItems: [],
  filterElements: new Set(),
  filterMarkers: new Set()
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

function formatPopulation(value) {
  return Number.isFinite(Number(value)) ? formatNumber(value) : 'Não disponível';
}

function formatIndex(value) {
  return Number.isFinite(Number(value))
    ? Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
    : 'Não disponível';
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
    fillOpacity: .72
  };
}

function neighborhoodStyle(feature) {
  return {
    color: '#ffffff',
    weight: .8,
    opacity: .8,
    fillColor: CRPM_COLORS[feature.properties.crpm] || '#cce4d6',
    fillOpacity: .72
  };
}

function municipalityTooltip(properties) {
  let territorialReference = `${properties.bpm} · ${properties.crpm}`;
  if (properties.municipio === 'Fortaleza') territorialReference = '10 BPMs territoriais · 1º e 5º CRPM';
  if (properties.municipio === 'Caucaia') territorialReference = '12º BPM e 26º BPM · 2º CRPM';
  return `<strong>${escapeHtml(properties.municipio)}</strong>
    <span>${escapeHtml(territorialReference)} · ${formatNumber(properties.area_km2)} km²</span>
    <span>População estimada (IBGE, 2026): <b>${formatPopulation(properties.populacao_estimada_2026)}</b></span>
    <span>IDHM (2010): <b>${formatIndex(properties.idhm_2010)}</b></span>`;
}

function neighborhoodTooltip(properties) {
  return `<strong>${escapeHtml(properties.bairro)}</strong>
    <span>${escapeHtml(properties.bpm)} · ${escapeHtml(properties.crpm)}</span>
    <span>População (Censo, 2010): <b>${formatPopulation(properties.populacao_2010)}</b></span>
    <span>IDH-B (2010): <b>${formatIndex(properties.idhb_2010)}</b></span>`;
}

function addCrpmRegions(data) {
  state.regionLabels = L.layerGroup();
  state.regions = L.geoJSON(data, {
    pane: 'crpmBordersPane',
    interactive: false,
    style: {
      color: '#203d32',
      weight: 1.8,
      opacity: .88,
      fill: false,
      lineCap: 'round',
      lineJoin: 'round'
    },
    onEachFeature(feature, layer) {
      const properties = feature.properties;
      state.searchItems.push({
        label: `${properties.crpm} · ${properties.quantidade_batalhoes} BPMs`,
        type: 'crpm',
        target: layer,
        properties
      });
      const [longitude, latitude] = properties.label_coordinates;
      L.marker([latitude, longitude], {
        pane: 'crpmLabelsPane',
        interactive: false,
        icon: L.divIcon({
          className: 'crpm-label-marker',
          html: `<span style="--crpm-color:${CRPM_COLORS[properties.crpm]};--crpm-text:${properties.crpm === '8º CRPM' ? '#443600' : '#fff'}">${escapeHtml(properties.crpm)}</span>`,
          iconSize: [72, 22],
          iconAnchor: [36, 11]
        })
      }).addTo(state.regionLabels);
    }
  }).addTo(map);
  state.regionLabels.addTo(map);
}

function addAisRegions(data) {
  state.aisRegions = L.geoJSON(data, {
    pane: 'aisBordersPane',
    style(feature) {
      const number = Number(String(feature.properties.ais).match(/\d+/)?.[0] || 0);
      const color = `hsl(${Math.round((number * 137.508) % 360)} 68% 43%)`;
      return {
        color,
        weight: 1.6,
        opacity: .96,
        fill: true,
        fillColor: color,
        fillOpacity: .18,
        lineCap: 'round',
        lineJoin: 'round'
      };
    },
    onEachFeature(feature, layer) {
      const properties = feature.properties;
      const scope = properties.bairros_fortaleza
        ? `${properties.bairros_fortaleza} bairros de Fortaleza`
        : `${properties.municipios} municípios`;
      state.searchItems.push({ label: `${properties.ais} · ${scope}`, type: 'ais', target: layer, properties });
      layer.bindTooltip(`<strong>${escapeHtml(properties.ais)}</strong><span>${escapeHtml(scope)}</span>`, { className: 'ais-tooltip', sticky: true, direction: 'top' });
    }
  });
}

function cancellationColor(total) {
  if (!total) return '#edf2ee';
  if (total <= 10) return '#fee8c8';
  if (total <= 50) return '#fdb863';
  if (total <= 200) return '#e76f51';
  return '#a61c3c';
}

function addCancellations(municipalities, neighborhoods, data) {
  const features = [
    ...municipalities.features.filter((feature) => feature.properties.municipio !== 'Fortaleza'),
    ...neighborhoods.features
  ];
  state.cancellations = L.geoJSON({ type: 'FeatureCollection', features }, {
    pane: 'cancellationsPane',
    style(feature) {
      const isNeighborhood = Boolean(feature.properties.bairro);
      const key = normalize(isNeighborhood ? feature.properties.bairro : feature.properties.municipio);
      const total = Number((isNeighborhood ? data.por_bairro_fortaleza[key] : data.por_municipio[key]) || 0);
      return { color: '#fff', weight: .75, opacity: .92, fillColor: cancellationColor(total), fillOpacity: total ? .84 : .22 };
    },
    onEachFeature(feature, layer) {
      const properties = feature.properties;
      const isNeighborhood = Boolean(properties.bairro);
      const key = normalize(isNeighborhood ? properties.bairro : properties.municipio);
      const total = Number((isNeighborhood ? data.por_bairro_fortaleza[key] : data.por_municipio[key]) || 0);
      const territorialDetails = isNeighborhood ? neighborhoodTooltip(properties) : municipalityTooltip(properties);
      layer.bindTooltip(`${territorialDetails}<span class="cancellation-count">Ocorrências canceladas (jan–set/2026): <b>${formatNumber(total)}</b></span>`, { className: 'cancellation-tooltip', sticky: true, direction: 'top' });
      layer.on({
        mouseover() { layer.setStyle({ color: '#5f1730', weight: 2, fillOpacity: .96 }); layer.bringToFront(); },
        mouseout() { state.cancellations.resetStyle(layer); },
        click() { map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: isNeighborhood ? 14 : 11 }); layer.openTooltip(); }
      });
    }
  });
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
      ${properties.ajuste_necessidade ? `<div><span>Ajuste da necessidade</span><strong>${signed(properties.ajuste_necessidade)}</strong></div>` : ''}
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
    style: neighborhoodStyle,
    onEachFeature(feature, layer) {
      state.neighborhoodFeatures.set(normalize(feature.properties.bairro), layer);
      state.searchItems.push({ label: `${feature.properties.bairro} · Fortaleza`, type: 'bairro', target: layer });
      layer.bindTooltip(neighborhoodTooltip(feature.properties), { className: 'neighborhood-tooltip', sticky: true, direction: 'top' });
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
    marker.filterProperties = properties;
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
    ['toggleRegions', 'regions'],
    ['toggleAis', 'aisRegions'],
    ['toggleCancellations', 'cancellations'],
    ['toggleMunicipalities', 'municipalities'],
    ['toggleNeighborhoods', 'neighborhoods'],
    ['toggleBattalions', 'battalions']
  ];
  controls.forEach(([id, key]) => {
    const control = document.querySelector(`#${id}`);
    const updateLayer = () => {
      const layer = state[key];
      if (!layer) return;
      if (control.checked) {
        layer.addTo(map);
        if (key === 'regions' && state.regionLabels) state.regionLabels.addTo(map);
      } else {
        map.removeLayer(layer);
        if (key === 'regions' && state.regionLabels) map.removeLayer(state.regionLabels);
      }
      if (state.battalions && map.hasLayer(state.battalions)) state.battalions.bringToFront?.();
    };
    control.addEventListener('change', updateLayer);
    updateLayer();
  });
}

function configureSearch() {
  const form = document.querySelector('#mapSearch');
  const input = document.querySelector('#mapSearchInput');
  const feedback = document.querySelector('#mapSearchFeedback');
  const typeLabels = { crpm: 'CRPMs', ais: 'AIS', batalhao: 'Batalhões', municipio: 'Municípios', bairro: 'Bairros de Fortaleza' };
  const typeOrder = ['crpm', 'ais', 'batalhao', 'municipio', 'bairro'];
  state.searchItems.forEach((item, index) => { item.filterKey = `${item.type}:${index}`; });
  input.innerHTML = '<option value="">Selecione um CRPM, batalhão, município ou bairro</option>'
    + typeOrder.map((type) => {
      const options = state.searchItems
        .filter((item) => item.type === type)
        .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { numeric: true }))
        .map((item) => `<option value="${item.filterKey}">${escapeHtml(item.label)}</option>`)
        .join('');
      return `<optgroup label="${typeLabels[type]}">${options}</optgroup>`;
    }).join('');
  let selectedLayer = null;
  let selectedGroup = null;
  let activeResult = null;
  const addFilterClass = (layer, className) => {
    const element = layer?.getElement?.();
    if (!element) return;
    element.classList.add(className);
    state.filterElements.add(element);
  };
  const clearFilterVisuals = () => {
    state.filterElements.forEach((element) => element.classList.remove('is-filter-selected', 'is-filter-related', 'is-filter-muted'));
    state.filterElements.clear();
    state.filterMarkers.forEach((marker) => marker.setOpacity?.(1));
    state.filterMarkers.clear();
  };
  const emphasizeResult = (result) => {
    if (result.type === 'crpm') {
      const selectedCrpm = result.properties.crpm;
      state.municipalities.eachLayer((layer) => addFilterClass(layer,
        layer.feature.properties.crpm === selectedCrpm ? 'is-filter-related' : 'is-filter-muted'));
      state.neighborhoods.eachLayer((layer) => addFilterClass(layer,
        layer.feature.properties.crpm === selectedCrpm ? 'is-filter-related' : 'is-filter-muted'));
      state.battalions.eachLayer((marker) => {
        marker.setOpacity(marker.filterProperties?.crpm === selectedCrpm ? 1 : .16);
        state.filterMarkers.add(marker);
      });
    } else if (result.type === 'ais') {
      const selectedAis = normalize(result.properties.ais);
      state.municipalities.eachLayer((layer) => addFilterClass(layer,
        normalize(layer.feature.properties.ais) === selectedAis ? 'is-filter-related' : 'is-filter-muted'));
      state.neighborhoods.eachLayer((layer) => addFilterClass(layer,
        normalize(layer.feature.properties.ais) === selectedAis ? 'is-filter-related' : 'is-filter-muted'));
    } else if (result.type === 'municipio') {
      state.municipalities.eachLayer((layer) => addFilterClass(layer, layer === result.target ? 'is-filter-selected' : 'is-filter-muted'));
    } else if (result.type === 'bairro') {
      state.neighborhoods.eachLayer((layer) => addFilterClass(layer, layer === result.target ? 'is-filter-selected' : 'is-filter-muted'));
    } else if (result.type === 'batalhao') {
      const coveredMunicipalities = new Set((result.properties.municipios_cobertos || []).map(normalize));
      state.municipalities.eachLayer((layer) => addFilterClass(layer,
        coveredMunicipalities.has(normalize(layer.feature.properties.municipio)) ? 'is-filter-related' : 'is-filter-muted'));
      state.battalions.eachLayer((marker) => {
        marker.setOpacity(marker === result.target ? 1 : .14);
        state.filterMarkers.add(marker);
      });
    }
    addFilterClass(result.target, 'is-filter-selected');
    result.target.bringToFront?.();
  };
  const clearSelection = () => {
    if (activeResult?.target?.closeTooltip) activeResult.target.closeTooltip();
    clearFilterVisuals();
    if (selectedLayer && selectedGroup) selectedGroup.resetStyle(selectedLayer);
    selectedLayer = null;
    selectedGroup = null;
    activeResult = null;
    feedback.classList.remove('is-visible');
    feedback.textContent = '';
  };
  const search = () => {
    const selectedKey = input.value;
    const query = normalize(selectedKey.split('·')[0]);
    clearSelection();
    if (!selectedKey) {
      map.fitBounds(state.municipalities.getBounds(), { padding: [18, 18] });
      return;
    }
    const keyed = state.searchItems.find((item) => item.filterKey === selectedKey);
    const exact = state.searchItems.find((item) => normalize(item.label.split('·')[0]) === query);
    const partial = state.searchItems.find((item) => normalize(item.label).includes(query));
    const result = keyed || exact || partial;
    if (!result) {
      feedback.textContent = 'Local não encontrado na base territorial.';
      feedback.classList.add('is-visible');
      return;
    }
    activeResult = result;
    const layerControls = {
      batalhao: 'toggleBattalions', crpm: 'toggleRegions', ais: 'toggleAis',
      municipio: 'toggleMunicipalities', bairro: 'toggleNeighborhoods'
    };
    const control = document.querySelector(`#${layerControls[result.type]}`);
    control.checked = true;
    control.dispatchEvent(new Event('change'));
    feedback.textContent = `Filtro ativo · ${result.label}`;
    feedback.classList.add('is-visible');
    if (result.type === 'batalhao') {
      const position = result.target.getLatLng();
      map.setView(position, result.properties.sede === 'Fortaleza' ? 12 : 10, { animate: false });
      state.battalions.zoomToShowLayer(result.target, () => {
        if (activeResult === result) {
          emphasizeResult(result);
          result.target.openTooltip();
        }
      });
    } else {
      selectedLayer = result.target;
      selectedGroup = result.type === 'crpm' ? state.regions
        : result.type === 'ais' ? state.aisRegions
          : result.type === 'bairro' ? state.neighborhoods : state.municipalities;
      const aisNumber = Number(String(result.target.feature.properties.ais || '').match(/\d+/)?.[0] || 0);
      const aisFill = `hsl(${Math.round((aisNumber * 137.508) % 360)} 68% 43%)`;
      result.target.setStyle({ color: '#0b4932', weight: 3, fill: true, fillOpacity: result.type === 'ais' ? .55 : .9,
        fillColor: result.type === 'ais' ? aisFill : CRPM_COLORS[result.target.feature.properties.crpm] || '#8fba9f' });
      emphasizeResult(result);
      map.fitBounds(result.target.getBounds(), { padding: [35, 35], maxZoom: result.type === 'bairro' ? 14 : 11 });
      if (result.type !== 'crpm') result.target.openTooltip();
    }
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    search();
  });
  input.addEventListener('change', search);
}

function addAttribution() {
  const attribution = document.createElement('div');
  attribution.className = 'map-attribution';
  attribution.innerHTML = 'Limites municipais: <a href="https://www.ipece.ce.gov.br/limites-municipais/" target="_blank" rel="noopener">IPECE 2026</a> · Bairros: <a href="https://mapas.fortaleza.ce.gov.br/mapa/21/bairros-de-fortaleza" target="_blank" rel="noopener">IPLANFOR 2023</a> · População municipal: <a href="https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html" target="_blank" rel="noopener">IBGE 2026</a> · IDHM/IDH-B: 2010 · Divisão territorial: DISTRI VTR';
  document.body.append(attribution);
}

async function initialize() {
  try {
    const responses = await Promise.all([
      fetch('data/crpm-regioes.geojson'),
      fetch('data/ais-regioes.geojson'),
      fetch('data/cancelamentos-2026.json'),
      fetch('data/municipios-ceara-2026.geojson'),
      fetch('data/bairros-fortaleza.geojson'),
      fetch('data/batalhoes-situacao.geojson')
    ]);
    if (responses.some((response) => !response.ok)) throw new Error('Falha ao obter os dados geográficos.');
    const [regions, aisRegions, cancellations, municipalities, neighborhoods, battalions] = await Promise.all(responses.map((response) => response.json()));
    addCrpmRegions(regions);
    addAisRegions(aisRegions);
    addMunicipalities(municipalities);
    addNeighborhoods(neighborhoods);
    addCancellations(municipalities, neighborhoods, cancellations);
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
