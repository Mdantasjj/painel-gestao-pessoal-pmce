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
        <span>POG · Policiamento Ordinário</span>
        <div><strong>304</strong><small>policiais</small></div>
        <p>Déficit concentrado nas principais unidades militares analisadas.</p>
      </div>
      <div class="staff-demand-item" style="--demand-color:#2b8982">
        <span>COPAC · Necessidade PReVio</span>
        <div><strong>229</strong><small>policiais</small></div>
        <p>Necessidade para compor 10 bases, sendo 04 prioritárias em 2026.</p>
      </div>
    </div>
    <div class="analysis-warning">No POG — Policiamento Ordinário, 304 é a soma dos saldos negativos após excluir COGEIC, CGP e marcadores não OPM; o déficit real exige comparar efetivo previsto e atual.</div>`;
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

const metricDetails = {
  exits: {
    accent: '#23845b',
    eyebrow: 'Memória de cálculo · saídas de efetivo',
    title: '547 saídas de efetivo',
    total: '547',
    unit: 'saídas',
    description: 'Indicador estratégico que reúne demissões, exonerações e aposentadorias para dimensionar a redução potencial do efetivo.',
    stats: [
      ['Demissões', '252', '46,1% do total estratégico'],
      ['Exonerações', '88', '16,1% do total estratégico'],
      ['Aposentadorias', '207', '37,8% · referência: promoções requeridas']
    ],
    breakdown: [
      ['Demissões', 46.1, '252 · 46,1%', '#1b8258'],
      ['Exonerações', 16.1, '88 · 16,1%', '#c1a253'],
      ['Aposentadorias', 37.8, '207 · 37,8%', '#698342']
    ],
    sectionTitle: 'Distribuição mensal disponível',
    sectionSubtitle: 'O recorte mensal cobre as 340 demissões e exonerações registradas de janeiro a agosto de 2026.',
    tableColumns: ['Mês', 'Demissões', 'Exonerações', 'Total mensal'],
    tableRows: [
      ['Janeiro', '8', '10', '18'], ['Fevereiro', '2', '7', '9'], ['Março', '0', '7', '7'], ['Abril', '7', '24', '31'],
      ['Maio', '143', '22', '165'], ['Junho', '76', '6', '82'], ['Julho', '14', '12', '26'], ['Agosto', '2', '0', '2']
    ],
    note: 'Os 207 registros foram classificados como aposentadorias por orientação do projeto, usando a aba de promoções requeridas como referência. Eles não possuem distribuição mensal ou OPM de origem na base atual.'
  },
  raio: {
    accent: '#3b7e9d',
    eyebrow: 'Memória de cálculo · RAIO',
    title: '912 policiais para as bases satélites',
    total: '912',
    unit: 'policiais',
    description: 'Efetivo projetado para compor 20 bases satélites, distribuídas em três níveis de implementação e 31 municípios satélite.',
    stats: [
      ['Bases previstas', '20', '11 no nível 1 · 7 no nível 2 · 2 no nível 3'],
      ['Municípios satélite', '31', 'Cobertura vinculada às bases projetadas'],
      ['Oficiais e praças', '20 + 892', 'Total consolidado de 912 policiais']
    ],
    breakdown: [
      ['Emprego operacional', 85.9, '783 · 85,9%', '#1b8258'],
      ['Guarda', 6.6, '60 · 6,6%', '#3b7e9d'],
      ['Administrativo', 5.4, '49 · 5,4%', '#c1a253'],
      ['Oficiais', 2.2, '20 · 2,2%', '#698342']
    ],
    sectionTitle: 'Três níveis de implementação',
    sectionSubtitle: 'Distribuição das bases, municípios e efetivo total por modelo de implantação.',
    tableColumns: ['Nível', 'Bases', 'Municípios satélite', 'Oficiais', 'Praças', 'Efetivo total'],
    tableRows: [
      ['Nível 1 · Polo + 1', '11', '11', '11', '418', '429'],
      ['Nível 2 · Polo + 2', '7', '14', '7', '350', '357'],
      ['Nível 3 · Polo + 3', '2', '6', '2', '124', '126'],
      ['Total', '20', '31', '20', '892', '912']
    ],
    levels: [
      {
        id: 'nivel-1',
        name: 'Nível 1',
        model: 'Polo + 1 satélite',
        bases: 11,
        cities: 11,
        officers: 11,
        enlisted: 418,
        administrative: 22,
        guard: 33,
        operational: 363,
        total: 429,
        rows: [
          ['Chaval', 'Barroquinha', '1', '38', '2', '3', '33', '39'],
          ['Cariús', 'Jucás', '1', '38', '2', '3', '33', '39'],
          ['Penaforte', 'Jati', '1', '38', '2', '3', '33', '39'],
          ['Palhano', 'Itaiçaba', '1', '38', '2', '3', '33', '39'],
          ['São Luís do Curu', 'Umirim', '1', '38', '2', '3', '33', '39'],
          ['Capistrano', 'Itapiúna', '1', '38', '2', '3', '33', '39'],
          ['Tururu', 'Uruburetama', '1', '38', '2', '3', '33', '39'],
          ['Meruoca', 'Alcântaras', '1', '38', '2', '3', '33', '39'],
          ['Aratuba', 'Mulungu', '1', '38', '2', '3', '33', '39'],
          ['Iracema', 'Ererê', '1', '38', '2', '3', '33', '39'],
          ['Alto Santo', 'Potiretama', '1', '38', '2', '3', '33', '39']
        ]
      },
      {
        id: 'nivel-2',
        name: 'Nível 2',
        model: 'Polo + 2 satélites',
        bases: 7,
        cities: 14,
        officers: 7,
        enlisted: 350,
        administrative: 21,
        guard: 21,
        operational: 308,
        total: 357,
        rows: [
          ['Nova Olinda', 'Santana do Cariri; Altaneira', '1', '50', '3', '3', '44', '51'],
          ['Mucambo', 'Pacujá; Graça', '1', '50', '3', '3', '44', '51'],
          ['Ararendá', 'Poranga; Ipaporanga', '1', '50', '3', '3', '44', '51'],
          ['Milhã', 'Solonópole; Deputado Irapuan Pinheiro', '1', '50', '3', '3', '44', '51'],
          ['Baixio', 'Umari; Ipaumirim', '1', '50', '3', '3', '44', '51'],
          ['Assaré', 'Antonina do Norte; Tarrafas', '1', '50', '3', '3', '44', '51'],
          ['Guaramiranga', 'Palmácia; Pacoti', '1', '50', '3', '3', '44', '51']
        ]
      },
      {
        id: 'nivel-3',
        name: 'Nível 3',
        model: 'Polo + 3 satélites',
        bases: 2,
        cities: 6,
        officers: 2,
        enlisted: 124,
        administrative: 6,
        guard: 6,
        operational: 112,
        total: 126,
        rows: [
          ['Cariré', 'Groaíras; Varjota; Reriutaba', '1', '62', '3', '3', '56', '63'],
          ['General Sampaio', 'Tejuçuoca; Apuiarés; Paramoti', '1', '62', '3', '3', '56', '63']
        ]
      }
    ],
    note: 'O quantitativo representa necessidade projetada para implantação. Não deve ser interpretado como efetivo já incorporado ou disponível.'
  },
  pog: {
    accent: '#b58e35',
    eyebrow: 'Memória de cálculo · POG',
    title: '304 policiais em déficit acumulado',
    total: '304',
    unit: 'policiais',
    description: 'Soma dos valores absolutos dos saldos negativos encontrados nas principais unidades militares incluídas no estudo de movimentações.',
    stats: [
      ['OPMs analisadas', '88', 'Após as exclusões metodológicas'],
      ['Saldo negativo', '22 OPM', 'Unidades que compõem o déficit de 304'],
      ['Ganho líquido', '64 OPM', 'Duas outras OPM ficaram em equilíbrio']
    ],
    breakdown: [
      ['1º CRPM', 47.7, '145 · 47,7%', '#9b7626'],
      ['12º BPM', 12.2, '37 · 12,2%', '#b58e35'],
      ['8º BPM', 7.6, '23 · 7,6%', '#c8a850'],
      ['Demais 19 OPM', 32.5, '99 · 32,5%', '#d8c58d']
    ],
    sectionTitle: 'Principais unidades com saldo negativo',
    sectionSubtitle: 'Ranking das dez maiores perdas dentro do déficit acumulado de 304 policiais.',
    tableColumns: ['Posição', 'OPM', 'Origem', 'Destino', 'Saldo', 'Participação'],
    tableRows: [
      ['1', '1º CRPM', '154', '9', '-145', '47,7%'], ['2', '12º BPM', '96', '59', '-37', '12,2%'],
      ['3', '8º BPM', '66', '43', '-23', '7,6%'], ['4', '2º CRPM', '14', '1', '-13', '4,3%'],
      ['5', 'BPMA', '29', '17', '-12', '3,9%'], ['6', '22º BPM', '51', '41', '-10', '3,3%'],
      ['7', '26º BPM', '57', '48', '-9', '3,0%'], ['8', '5º BPM', '54', '45', '-9', '3,0%'],
      ['9', '23º BPM', '42', '34', '-8', '2,6%'], ['10', '3º CRPM', '7', '1', '-6', '2,0%']
    ],
    note: 'Foram excluídos COGEIC, CGP e os marcadores não OPM “-” e “(vazio)”. O indicador mede perdas nas movimentações; o déficit estrutural exige comparar efetivo previsto e efetivo atual.'
  },
  copac: {
    accent: '#2b8982',
    eyebrow: 'Memória de cálculo · COPAC/PReVio',
    title: '229 policiais de necessidade complementar',
    total: '229',
    unit: 'policiais',
    description: 'Indicador de necessidade complementar associado à implantação das bases do Policiamento Preventivo de Base Comunitária.',
    stats: [
      ['Escopo estratégico', '10 bases', 'Conforme título definido para o card'],
      ['Prioridade 2026', '04 bases', 'Unidades prioritárias ainda não identificadas na fonte'],
      ['Base quantitativa', '12 unidades', 'Planilha que sustenta o total atual de 229']
    ],
    breakdown: [
      ['Abril', 32.8, '75 · 32,8%', '#2b8982'],
      ['Maio', 6.6, '15 · 6,6%', '#4aa099'],
      ['Junho', 21.4, '49 · 21,4%', '#75b6b0'],
      ['Julho', 39.3, '90 · 39,3%', '#176a64']
    ],
    sectionTitle: 'Unidades existentes na base quantitativa',
    sectionSubtitle: 'Detalhamento das 12 unidades que, somadas, produzem o indicador atual de 229 policiais.',
    tableColumns: ['Nº', 'Unidade/base', 'Entrega', 'Padrão mínimo', 'Necessidade', 'Situação'],
    tableRows: [
      ['1', 'Itapipoca', 'Abril', '30', '30', 'Integral'], ['2', 'Quixadá', 'Abril', '30', '30', 'Integral'],
      ['3', 'Maranguape', 'Abril', '30', '15', 'Parcial'], ['4', 'Caucaia 1', 'Maio', '30', '0', 'Sem complemento'],
      ['5', 'Fortaleza', 'Maio', '30', '15', 'Parcial'], ['6', 'Iguatu', 'Junho', '30', '30', 'Integral'],
      ['7', 'Juazeiro do Norte', 'Junho', '30', '2', 'Parcial'], ['8', 'Maracanaú 1', 'Junho', '30', '15', 'Parcial'],
      ['9', 'Sobral', 'Junho', '30', '2', 'Parcial'], ['10', 'Caucaia 2', 'Julho', '30', '30', 'Integral'],
      ['11', 'Crato', 'Julho', '30', '30', 'Integral'], ['12', 'Maracanaú 2', 'Julho', '30', '30', 'Integral']
    ],
    note: 'Ponto de atenção: o título estratégico menciona 10 bases e 04 prioritárias, mas a planilha disponível contém 12 unidades e não identifica as quatro prioridades. Para recalcular o total de 229 no novo escopo, é necessário indicar quais duas unidades serão retiradas e quais quatro são prioritárias.'
  }
};

const metricModal = document.querySelector('#metricDetailModal');
const metricDialog = metricModal.querySelector('.metric-dialog');
const metricDetailTitle = document.querySelector('#metricDetailTitle');
const metricDetailEyebrow = document.querySelector('#metricDetailEyebrow');
const metricDetailContent = document.querySelector('#metricDetailContent');
const metricDetailClose = document.querySelector('#metricDetailClose');
const metricCards = [...document.querySelectorAll('.metric-card[data-detail]')];
let detailTrigger = null;

function renderDetailTable(data) {
  const head = data.tableColumns.map((column) => `<th scope="col">${column}</th>`).join('');
  const rows = data.tableRows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('');
  return `<div class="detail-table-wrap"><table class="detail-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderRaioLevelSelector(data) {
  const buttons = data.levels.map((level) => `
    <button class="raio-level-button" type="button" data-raio-level="${level.id}" aria-pressed="false" aria-controls="raioLevelDetail">
      <span>${level.name}</span>
      <strong>${level.model}</strong>
      <b>${level.total} <small>policiais</small></b>
      <em>${level.bases} bases · ${level.cities} municípios satélites</em>
    </button>`).join('');
  return `
    <section class="detail-section raio-level-section">
      <div class="detail-section-heading">
        <div><h3>Escolha o nível para aprofundar</h3><p>Os três botões já apresentam os totais comparativos para facilitar a decisão.</p></div>
        <span>Seleção por nível</span>
      </div>
      <div class="raio-level-selector">${buttons}</div>
      <div class="raio-level-detail" id="raioLevelDetail" aria-live="polite">
        <div class="raio-level-empty"><strong>Selecione um dos níveis acima</strong><span>Serão exibidos os nomes das cidades-polo, dos municípios satélites e a composição do efetivo de cada base.</span></div>
      </div>
    </section>`;
}

function renderRaioLevelDetail(levelId) {
  const data = metricDetails.raio;
  const level = data.levels.find((item) => item.id === levelId);
  const detail = document.querySelector('#raioLevelDetail');
  if (!level || !detail) return;
  metricDetailContent.querySelectorAll('[data-raio-level]').forEach((button) => {
    const isActive = button.dataset.raioLevel === levelId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  const summary = [
    ['Bases', level.bases],
    ['Municípios satélites', level.cities],
    ['Oficiais', level.officers],
    ['Praças', level.enlisted],
    ['Administrativo', level.administrative],
    ['Guarda', level.guard],
    ['Operacional', level.operational],
    ['Efetivo total', level.total]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
  const table = renderDetailTable({
    tableColumns: ['Cidade-polo / sede', 'Município(s) satélite(s)', 'Oficiais', 'Praças', 'Adm.', 'Guarda', 'Operacional', 'Total'],
    tableRows: level.rows
  });
  detail.innerHTML = `
    <div class="raio-level-heading">
      <div><span>${level.name}</span><h4>${level.model}</h4></div>
      <strong>${level.total} policiais</strong>
    </div>
    <div class="raio-level-summary">${summary}</div>
    <div class="raio-cities-heading"><strong>Cidades e efetivo por base</strong><span>${level.bases} cidades-polo · ${level.cities} municípios satélites</span></div>
    ${table}`;
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderMetricDetail(key) {
  const data = metricDetails[key];
  if (!data) return;
  metricModal.style.setProperty('--detail-accent', data.accent);
  metricDetailContent.dataset.detail = key;
  metricDetailEyebrow.textContent = data.eyebrow;
  metricDetailTitle.textContent = data.title;
  const stats = data.stats.map(([label, value, note]) => `<div class="detail-stat"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
  const breakdown = data.breakdown.map(([label, share, value, rowColor]) => `
    <div class="detail-breakdown-row">
      <span>${label}</span>
      <div class="detail-breakdown-track"><i style="width:${share}%;--row-color:${rowColor}"></i></div>
      <strong>${value}</strong>
    </div>`).join('');
  const levelSelector = key === 'raio' ? renderRaioLevelSelector(data) : '';
  const discriminatedTable = key === 'raio' ? '' : `
    <section class="detail-section">
      <div class="detail-section-heading"><div><h3>${data.sectionTitle}</h3><p>${data.sectionSubtitle}</p></div><span>Dados discriminados</span></div>
      ${renderDetailTable(data)}
    </section>`;
  metricDetailContent.innerHTML = `
    <div class="detail-hero-grid">
      <div class="detail-total-card" style="--detail-accent:${data.accent}">
        <span>Total apresentado</span><div><strong>${data.total}</strong><small>${data.unit}</small></div>
        <p id="metricDetailDescription">${data.description}</p>
      </div>
      <div class="detail-stat-grid">${stats}</div>
    </div>
    ${levelSelector}
    <section class="detail-section">
      <div class="detail-section-heading"><div><h3>Composição do indicador</h3><p>Participação de cada componente no total ou no recorte analisado.</p></div><span>Leitura percentual</span></div>
      <div class="detail-breakdown">${breakdown}</div>
    </section>
    ${discriminatedTable}
    <p class="detail-methodology">${data.note}</p>`;
}

function openMetricDetail(card) {
  detailTrigger = card;
  renderMetricDetail(card.dataset.detail);
  metricCards.forEach((item) => item.setAttribute('aria-expanded', item === card ? 'true' : 'false'));
  metricModal.classList.add('is-open');
  metricModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => metricDetailClose.focus());
}

function closeMetricDetail() {
  if (!metricModal.classList.contains('is-open')) return;
  metricModal.classList.remove('is-open');
  metricModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  metricCards.forEach((item) => item.setAttribute('aria-expanded', 'false'));
  if (detailTrigger) detailTrigger.focus();
}

metricCards.forEach((card) => {
  card.setAttribute('aria-expanded', 'false');
  card.addEventListener('click', () => openMetricDetail(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMetricDetail(card);
    }
  });
});

metricDetailClose.addEventListener('click', closeMetricDetail);
metricModal.querySelector('[data-modal-close]').addEventListener('click', closeMetricDetail);
metricDetailContent.addEventListener('click', (event) => {
  const button = event.target.closest('[data-raio-level]');
  if (button) renderRaioLevelDetail(button.dataset.raioLevel);
});
metricModal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMetricDetail();
  if (event.key !== 'Tab') return;
  const focusable = [...metricDialog.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')].filter((item) => !item.disabled);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

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
