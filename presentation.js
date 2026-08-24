const dateElement = document.querySelector('#currentDate');
const timeElement = document.querySelector('#currentTime');
const fullscreenButton = document.querySelector('#fullscreenButton');
const toast = document.querySelector('#toast');
let toastTimer;

function updateDateTime() {
  const now = new Date();
  dateElement.textContent = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });
  timeElement.textContent = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function renderDismissalsChart() {
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
  const series = [
    { name: 'Demissões', color: '#1b8258', values: [8, 2, 0, 7, 143, 76, 14, 2] },
    { name: 'Exonerações', color: '#c1a253', values: [10, 7, 7, 24, 22, 6, 12, 0] }
  ];
  const maxValue = 143;
  const key = series.map((item) => `<span><i style="background:${item.color}"></i>${item.name}</span>`).join('');
  const groups = labels.map((label, index) => {
    const bars = series.map((item) => {
      const value = item.values[index];
      const height = value === 0 ? 1.5 : Math.max((value / maxValue) * 84, 4);
      return `<div class="data-bar" style="height:${height}%;--bar-color:${item.color}"><span>${value}</span></div>`;
    }).join('');
    return `<div class="bar-group"><div class="bar-cluster">${bars}</div><span class="bar-label">${label}</span></div>`;
  }).join('');

  document.querySelector('#mainChart').innerHTML = `
    <div class="chart-key">${key}</div>
    <div class="bar-stage" style="--count:8">${groups}</div>
    <div class="chart-source-note">Esta série detalha 340 das 547 saídas. Maio concentrou 165 demissões/exonerações, ou 48,5% desse recorte.</div>`;
}

function renderStaffNeeds() {
  document.querySelector('#detailContent').innerHTML = `
    <div class="staff-demand-grid">
      <div class="staff-demand-item" style="--demand-color:#3b7e9d">
        <span>RAIO · Bases satélites</span>
        <div><strong>912</strong><small>policiais</small></div>
        <p>20 bases, 31 municípios satélite e 85,9% do efetivo em atividade operacional.</p>
      </div>
      <div class="staff-demand-item" style="--demand-color:#b58e35">
        <span>Policiamento Ostensivo Geral (POG)</span>
        <div><strong>304</strong><small>policiais</small></div>
        <p>22 das 88 OPM analisadas apresentam saldo negativo nas movimentações.</p>
      </div>
      <div class="staff-demand-item" style="--demand-color:#2b8982">
        <span>COPAC · Necessidade PReVio</span>
        <div><strong>229</strong><small>policiais</small></div>
        <p>Complemento para 12 bases, equivalente a 63,6% do padrão total projetado.</p>
      </div>
    </div>
    <div class="analysis-warning">No Policiamento Ostensivo Geral (POG), 304 é a soma dos saldos negativos após excluir COGEIC, CGP e marcadores não OPM; o déficit real exige comparar efetivo previsto e atual.</div>`;
}

function renderPromotions() {
  const segments = [
    { label: 'Acesso ao oficialato', value: 153, color: '#698342' },
    { label: 'Entre postos de oficiais', value: 54, color: '#3b7e9d' }
  ];
  let current = 0;
  const stops = segments.map((segment) => {
    const start = current;
    current += (segment.value / 207) * 100;
    return `${segment.color} ${start}% ${current}%`;
  }).join(',');
  document.querySelector('#donutChart').style.background = `conic-gradient(${stops})`;
  document.querySelector('#donutTotal').textContent = '207';
  document.querySelector('#donutLegend').innerHTML = segments.map((segment) => {
    const share = ((segment.value / 207) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    return `<li><i class="legend-swatch" style="--swatch:${segment.color}"></i><span>${segment.label}</span><strong>${segment.value} · ${share}%</strong></li>`;
  }).join('');
}

const originByOpm = [
  ['CPRAIO', 17],
  ['12º BPM', 17],
  ['17º BPM', 14],
  ['18º BPM', 14],
  ['6º BPM', 14],
  ['BPTUR', 13],
  ['COPAC', 13],
  ['19º BPM', 12],
  ['20º BPM', 11],
  ['24º BPM', 10]
];

const originByCity = [
  ['Fortaleza', 153],
  ['Caucaia', 27],
  ['Maracanaú', 12],
  ['Maranguape', 8],
  ['Juazeiro do Norte', 8],
  ['Quixadá', 7],
  ['Eusébio', 6],
  ['Sobral', 6]
];

function renderHorizontalBars(target, rows, total, color) {
  const maximum = Math.max(...rows.map(([, value]) => value));
  document.querySelector(target).innerHTML = rows.map(([label, value], index) => {
    const width = Math.max((value / maximum) * 100, 3);
    const share = ((value / total) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    return `<div class="horizontal-bar-row">
      <span class="horizontal-rank">${String(index + 1).padStart(2, '0')}</span>
      <strong>${label}</strong>
      <div class="horizontal-track"><i style="width:${width}%;--origin-color:${color}"></i></div>
      <span class="horizontal-value">${value} <small>${share}%</small></span>
    </div>`;
  }).join('');
}

function renderOrigins() {
  renderHorizontalBars('#opmOriginChart', originByOpm, 326, '#1b8258');
  renderHorizontalBars('#cityOriginChart', originByCity, 326, '#3b7e9d');
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    showToast('Use a tecla F11 do navegador para ativar a tela cheia.');
  }
}

fullscreenButton.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  fullscreenButton.title = document.fullscreenElement ? 'Sair da tela cheia' : 'Exibir em tela cheia';
});

updateDateTime();
renderDismissalsChart();
renderStaffNeeds();
renderPromotions();
renderOrigins();
setInterval(updateDateTime, 30000);
