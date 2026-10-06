const svg = document.querySelector('#timeline');
function renderTimeline(months) {
  const values = months.map(item => item.total);
  const max = Math.max(...values);
  const points = values.map((value, index) => `${index * (620 / (values.length - 1))},${212 - (value / max) * 170}`).join(' ');
  svg.innerHTML = `<defs><linearGradient id="line" x1="0" x2="1"><stop stop-color="#7561dc"/><stop offset=".55" stop-color="#dc6293"/><stop offset="1" stop-color="#ef7255"/></linearGradient><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#7561dc" stop-opacity=".45"/><stop offset="1" stop-color="#7561dc" stop-opacity="0"/></linearGradient></defs><path d="M ${points} L 620,230 L 0,230 Z" fill="url(#fill)"/><polyline points="${points}" fill="none" stroke="url(#line)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${months.map((item,index)=>`<circle class="point" data-month="${item.mes}" data-total="${item.total}" cx="${index * (620 / (values.length - 1))}" cy="${212 - (item.total / max) * 170}" r="4" fill="#fff"/>`).join('')}`;
  document.querySelectorAll('.point').forEach(point => point.addEventListener('mouseenter', () => document.querySelector('#timelineNote').textContent = `${point.dataset.month} · ${Number(point.dataset.total).toLocaleString('pt-BR')} cancelamentos registrados.`));
}

fetch('data/resumo_cancelamentos_2026.json').then(response => response.json()).then(data => {
  renderTimeline(data.por_mes);
  document.querySelector('#metricMain').textContent = data.total_registros.toLocaleString('pt-BR');
  document.querySelector('#metricVariation').textContent = data.ocorrencias_unicas.toLocaleString('pt-BR');
  document.querySelector('#aisRanking').innerHTML = data.por_ais.slice(0, 2).map(item => `${item.ais} · ${item.total.toLocaleString('pt-BR')} cancelamentos`).join('<br>');
  document.querySelector('#zoneReadout').textContent = `${data.por_ais.length} AIS na carga`;
}).catch(() => renderTimeline([]));
document.querySelector('#simulate').addEventListener('click', () => { document.querySelector('#zoneReadout').textContent = 'recorte atual · cancelamentos'; });
document.querySelector('#themeButton').addEventListener('click', () => document.body.classList.toggle('alt'));
document.querySelector('#heatMap').addEventListener('mousemove', event => { const x = Math.round((event.offsetX / event.currentTarget.clientWidth) * 100); const y = Math.round((event.offsetY / event.currentTarget.clientHeight) * 100); document.querySelector('#zoneReadout').textContent = `zona conceitual · ${x}:${y}`; });
