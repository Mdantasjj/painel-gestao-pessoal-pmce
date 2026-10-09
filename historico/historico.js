const $ = id => document.getElementById(id);
const number = value => Number(value || 0).toLocaleString('pt-BR');
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
let data, municipalities, map, layer;

function option(value, label) { const node = document.createElement('option'); node.value = value; node.textContent = label; return node; }
function set(id, value) { const node = $(id); if (node) node.textContent = value; }
function timeline(months, note) {
  const svg = $('timeline');
  if (!svg) return;
  if (!months.length) { svg.innerHTML = ''; set('timelineNote', note); return; }
  const maximum = Math.max(...months.map(item => item.total));
  const points = months.map((item, index) => `${index * (620 / (months.length - 1))},${212 - item.total / maximum * 170}`).join(' ');
  svg.innerHTML = `<defs><linearGradient id="line" x1="0" x2="1"><stop stop-color="#00ad72"/><stop offset=".55" stop-color="#00e6a8"/><stop offset="1" stop-color="#a8ff3e"/></linearGradient></defs><polyline points="${points}" fill="none" stroke="url(#line)" stroke-width="4" stroke-linecap="round"/>${months.map((item,index)=>`<circle class="point" data-month="${item.mes}" data-total="${item.total}" cx="${index * (620/(months.length-1))}" cy="${212-item.total/maximum*170}" r="4" fill="#ecfff6"/>`).join('')}`;
  set('timelineNote', note);
  document.querySelectorAll('.point').forEach(point => point.addEventListener('mouseenter', () => set('timelineNote', `${point.dataset.month} · ${number(point.dataset.total)} cancelamentos registrados.`)));
}

function configureFilters() {
  const event = $('event').value, period = $('period'), scope = $('scope');
  const priorPeriod = period.value, priorScope = scope.value;
  if (event.startsWith('cv')) {
    period.replaceChildren(option('todos', 'Todos os períodos'), ...data.cvp_cvli.periodos.map(item => option(item.id, item.label)));
    const ais = [...new Set(data.cvp_cvli.registros.map(item => item.ais))].sort((a,b) => Number(a.slice(3)) - Number(b.slice(3)));
    scope.replaceChildren(option('todos', 'Todas as AIS'), ...ais.map(item => option(item, item)));
  } else {
    period.replaceChildren(option('2026-jan-set', 'Jan — Set 2026'));
    scope.replaceChildren(option('ceara', 'Ceará · visão estadual'), option('fortaleza', 'Fortaleza'), option('interior', 'Interior · municípios'));
  }
  period.value = [...period.options].some(item => item.value === priorPeriod) ? priorPeriod : period.options[0].value;
  scope.value = [...scope.options].some(item => item.value === priorScope) ? priorScope : scope.options[0].value;
}

function color(total, max) {
  if (!total) return '#263f34';
  const ratio = total / max;
  if (ratio < .08) return '#2d7551';
  if (ratio < .22) return '#14a363';
  if (ratio < .50) return '#5bd66e';
  return '#c6ff5a';
}
function drawMap(totals, available, featureKey = feature => normalize(feature.properties.municipio), unitLabel = 'cancelamentos') {
  if (!map) map = L.map('cearaHeatMap', { zoomControl:false, attributionControl:false, preferCanvas:true, minZoom:6, maxZoom:11 });
  if (layer) map.removeLayer(layer);
  const max = Math.max(1, ...Object.values(totals));
  layer = L.geoJSON(municipalities, { style(feature) { const value = available ? (totals[featureKey(feature)] || 0) : 0; return {color:'#c5ffe2',weight:.65,fillColor:color(value,max),fillOpacity:value?.9:.52}; }, onEachFeature(feature, item) { const value=totals[featureKey(feature)]||0, ais=feature.properties.ais ? ` · ${feature.properties.ais}` : ''; item.bindTooltip(`<strong>${feature.properties.municipio}${ais}</strong><span>${available ? `${number(value)} ${unitLabel}` : 'Sem base municipal no recorte'}</span>`,{className:'municipal-heat-tooltip',sticky:true}); item.on({mouseover(){item.setStyle({color:'#a8ff3e',weight:1.6,fillOpacity:1});},mouseout(){layer.resetStyle(item);},click(){map.fitBounds(item.getBounds(),{padding:[24,24],maxZoom:9});}}); }}).addTo(map);
  map.fitBounds(layer.getBounds(), {padding:[12,12]}); setTimeout(()=>map.invalidateSize(),120);
}

function updateGeneral() {
  const event=$('event').value, period=$('period').value, scope=$('scope').value;
  if (event.startsWith('cv')) return updateCrime(event, period, scope);
  const cancellations = event === 'cancelamentos';
  const totals = cancellations ? Object.fromEntries(Object.entries(data.por_municipio).filter(([name]) => scope === 'ceara' || (scope === 'fortaleza' ? name === 'FORTALEZA' : name !== 'FORTALEZA'))) : {};
  const scopeName={ceara:'Ceará',fortaleza:'Fortaleza',interior:'Interior'}[scope];
  if (cancellations) {
    const total=scope==='ceara'?data.total_registros:Object.values(totals).reduce((sum,value)=>sum+value,0);
    set('metricMainLabel',scope==='ceara'?'CANCELAMENTOS':`CANCELAMENTOS · ${scopeName.toUpperCase()}`); set('metricMain',number(total)); set('metricMainNote',scope==='ceara'?'jan—set/2026 · registros recebidos':'somente registros com município informado');
    set('metricSecondaryLabel','OCORRÊNCIAS ATENDIDAS');set('metricVariation',number(data.ocorrencias_atendidas.total));set('metricSecondaryNote','base estadual · 34 AIS');set('metricRateLabel','RELAÇÃO SIMPLES');set('metricRate',`${(data.total_registros/data.ocorrencias_atendidas.total*100).toLocaleString('pt-BR',{maximumFractionDigits:1})}%`);set('metricRateNote','cancelamentos / ocorrências');
    set('mapTitle',`Mapa de calor · cancelamentos em ${scopeName}`);set('rankingTitle','MAIOR VOLUME ATENDIDO · AIS');$('aisRanking').innerHTML=data.ocorrencias_atendidas.por_ais.slice(0,2).map(item=>`${item.ais} · ${number(item.total)} ocorrências`).join('<br>');set('mapNote','Cores do mapa: cancelamentos por município.');set('zoneReadout',`${Object.keys(totals).length} municípios no recorte`);timeline(data.por_mes,'Série mensal estadual de cancelamentos: janeiro a setembro de 2026.');drawMap(totals,true);
  } else {
    set('metricMainLabel','OCORRÊNCIAS ATENDIDAS');set('metricMain',number(data.ocorrencias_atendidas.total));set('metricMainNote','jan—set/2026 · 34 AIS');set('metricSecondaryLabel','AIS COM DADOS');set('metricVariation',number(data.ocorrencias_atendidas.por_ais.length));set('metricSecondaryNote','distribuição por AIS disponível');set('metricRateLabel','SÉRIE MENSAL');set('metricRate','—');set('metricRateNote','não fornecida nesta carga');set('mapTitle','Mapa do Ceará · base municipal indisponível');set('rankingTitle','MAIOR VOLUME ATENDIDO · AIS');$('aisRanking').innerHTML=data.ocorrencias_atendidas.por_ais.slice(0,2).map(item=>`${item.ais} · ${number(item.total)} ocorrências`).join('<br>');set('mapNote','A carga possui AIS, mas não município. Não há intensidade territorial sem essa correspondência.');set('zoneReadout','34 AIS na carga');timeline([],'A carga de ocorrências atendidas não contém distribuição mensal.');drawMap({},false);
  }
  set('filterFeedback',`${cancellations?'Cancelamentos':'Ocorrências atendidas'} · ${scopeName}`);
}

function updateCrime(event, period, ais) {
  const indicator = event === 'cvp_cvli' ? 'todos' : event.toUpperCase();
  const rows=data.cvp_cvli.registros.filter(row=>(period==='todos'||row.periodo===period)&&(ais==='todos'||row.ais===ais)&&(indicator==='todos'||row.indicador===indicator));
  const total=rows.reduce((sum,row)=>sum+row.total,0), cvp=rows.filter(row=>row.indicador==='CVP').reduce((sum,row)=>sum+row.total,0), cvli=rows.filter(row=>row.indicador==='CVLI').reduce((sum,row)=>sum+row.total,0), byAis=rows.reduce((result,row)=>{result[row.ais]=(result[row.ais]||0)+row.total;return result;},{});
  const ranking=Object.entries(rows.reduce((out,row)=>{out[row.natureza]=(out[row.natureza]||0)+row.total;return out;},{})).sort(([,a],[,b])=>b-a).slice(0,2);
  set('metricMainLabel',indicator==='todos'?'CVP + CVLI':indicator);set('metricMain',number(total));set('metricMainNote',`${period==='todos'?'2022—2026':period} · ${ais==='todos'?'todas as AIS':ais}`);set('metricSecondaryLabel','CVP');set('metricVariation',number(cvp));set('metricSecondaryNote','no recorte selecionado');set('metricRateLabel','CVLI');set('metricRate',number(cvli));set('metricRateNote','no recorte selecionado');
  const label=indicator==='todos'?'CVP/CVLI':indicator;
  const mappedAis=new Set(municipalities.features.map(feature=>normalize(feature.properties.ais)).filter(value=>/^AIS\d{2}$/.test(value)));
  const missingAis=Object.keys(byAis).filter(value=>!mappedAis.has(value));
  set('mapTitle',`Mapa de calor · ${label} por AIS`);set('rankingTitle','PRINCIPAIS NATUREZAS');$('aisRanking').innerHTML=ranking.map(([name,value])=>`${name} · ${number(value)}`).join('<br>') || 'Sem dados para o recorte';set('mapNote',missingAis.length ? `Cores representam as ${Object.keys(byAis).length-missingAis.length} AIS com geometria disponível. ${missingAis.length} AIS sem polígono permanecem fora da intensidade.` : 'As cores representam o total da AIS e acompanham os filtros de período, evento e recorte.');set('zoneReadout',`${Object.keys(byAis).length-missingAis.length} AIS mapeadas · ${missingAis.length} sem polígono`);timeline([],'A planilha CVP/CVLI não possui série mensal; use Período, Evento e Recorte para filtrar os agregados.');drawMap(byAis,true,feature=>normalize(feature.properties.ais),label);set('filterFeedback',`${indicator==='todos'?'CVP + CVLI':indicator} · ${period==='todos'?'todos os períodos':period} · ${ais==='todos'?'todas as AIS':ais}`);
}

Promise.all([fetch('data/resumo_cancelamentos_2026.json').then(r=>r.json()),fetch('../mapa/data/municipios-ceara-2026.geojson').then(r=>r.json())]).then(([summary,geojson])=>{data=summary;municipalities=geojson;configureFilters();updateGeneral();$('mapLoading').classList.add('is-hidden');$('event').addEventListener('change',()=>{configureFilters();updateGeneral();});['period','scope'].forEach(id=>$(id).addEventListener('change',updateGeneral));$('applyFilters').addEventListener('click',updateGeneral);}).catch(()=>{set('timelineNote','Não foi possível carregar os arquivos locais. Use abrir_painel_local.cmd.');set('filterFeedback','Aguardando servidor local');$('mapLoading').textContent='ABRA PELO ARQUIVO abrir_painel_local.cmd';});
