const svg = document.querySelector('#timeline');
function renderTimeline(months) {
  const values = months.map(item => item.total);
  const max = Math.max(...values);
  const points = values.map((value, index) => `${index * (620 / (values.length - 1))},${212 - (value / max) * 170}`).join(' ');
  svg.innerHTML = `<defs><linearGradient id="line" x1="0" x2="1"><stop stop-color="#7561dc"/><stop offset=".55" stop-color="#dc6293"/><stop offset="1" stop-color="#ef7255"/></linearGradient><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#7561dc" stop-opacity=".45"/><stop offset="1" stop-color="#7561dc" stop-opacity="0"/></linearGradient></defs><path d="M ${points} L 620,230 L 0,230 Z" fill="url(#fill)"/><polyline points="${points}" fill="none" stroke="url(#line)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${months.map((item,index)=>`<circle class="point" data-month="${item.mes}" data-total="${item.total}" cx="${index * (620 / (values.length - 1))}" cy="${212 - (item.total / max) * 170}" r="4" fill="#fff"/>`).join('')}`;
  document.querySelectorAll('.point').forEach(point => point.addEventListener('mouseenter', () => document.querySelector('#timelineNote').textContent = `${point.dataset.month} · ${Number(point.dataset.total).toLocaleString('pt-BR')} cancelamentos registrados.`));
}

function normalize(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function heatColor(total, maximum) {
  if (!total) return '#cbd5e8';
  const ratio = Math.sqrt(total / maximum);
  const hue = 215 - ratio * 195;
  const lightness = 82 - ratio * 33;
  return `hsl(${hue} 76% ${lightness}%)`;
}

function renderCearaMap(geojson, totals) {
  const map = L.map('cearaHeatMap', { zoomControl: false, attributionControl: false, preferCanvas: true, minZoom: 6, maxZoom: 11 });
  const maximum = Math.max(...Object.values(totals));
  const layer = L.geoJSON(geojson, {
    style(feature) {
      const total = totals[normalize(feature.properties.municipio)] || 0;
      return { color: '#ffffff', weight: .65, fillColor: heatColor(total, maximum), fillOpacity: total ? .9 : .56 };
    },
    onEachFeature(feature, featureLayer) {
      const municipality = feature.properties.municipio;
      const total = totals[normalize(municipality)] || 0;
      featureLayer.bindTooltip(`<strong>${municipality}</strong><span>${total.toLocaleString('pt-BR')} cancelamentos</span>`, { className: 'municipal-heat-tooltip', sticky: true, direction: 'top' });
      featureLayer.on({
        mouseover() { featureLayer.setStyle({ color: '#172246', weight: 1.6, fillOpacity: 1 }); featureLayer.bringToFront(); },
        mouseout() { layer.resetStyle(featureLayer); },
        click() { map.fitBounds(featureLayer.getBounds(), { padding: [24, 24], maxZoom: 9 }); }
      });
    }
  }).addTo(map);
  map.fitBounds(layer.getBounds(), { padding: [12, 12] });
}

Promise.all([fetch('data/resumo_cancelamentos_2026.json').then(response => response.json()), fetch('../mapa/data/municipios-ceara-2026.geojson').then(response => response.json())]).then(([data, municipalities]) => {
  renderTimeline(data.por_mes);
  document.querySelector('#metricMain').textContent = data.ocorrencias_atendidas.total.toLocaleString('pt-BR');
  document.querySelector('#metricVariation').textContent = data.total_registros.toLocaleString('pt-BR');
  document.querySelector('#metricRate').textContent = `${(data.total_registros / data.ocorrencias_atendidas.total * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
  document.querySelector('#aisRanking').innerHTML = data.ocorrencias_atendidas.por_ais.slice(0, 2).map(item => `${item.ais} · ${item.total.toLocaleString('pt-BR')} ocorrências`).join('<br>');
  document.querySelector('#zoneReadout').textContent = `${Object.keys(data.por_municipio).length} municípios com registro`;
  renderCearaMap(municipalities, data.por_municipio);
}).catch(() => { document.querySelector('#timelineNote').textContent = 'Não foi possível carregar a camada territorial.'; });
document.querySelector('#simulate').addEventListener('click', () => { document.querySelector('#zoneReadout').textContent = 'recorte atual · cancelamentos'; });
document.querySelector('#themeButton').addEventListener('click', () => document.body.classList.toggle('alt'));
