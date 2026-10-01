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
    { name: 'Demissões · outros concursos', color: '#1b8258', values: [6, 2, 0, 7, 143, 76, 14, 2] },
    { name: 'Exonerações · outros concursos', color: '#c1a253', values: [10, 7, 7, 24, 22, 6, 12, 0] }
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
    <div class="chart-source-note">A série mensal considera 338 lançamentos brutos de 2026 após excluir dois registros do BPGEP. Depois da consolidação dos NUPs repetidos, permanecem 324 registros únicos considerados. O indicador geral consolida 1.111 registros de fontes e naturezas diferentes.</div>`;
}

function renderPromotions() {
  const promotionTotal = 767;
  const segments = [
    { label: 'Acesso ao oficialato', value: 611, color: '#698342' },
    { label: 'Entre postos de oficiais', value: 156, color: '#3b7e9d' }
  ];
  let current = 0;
  const stops = segments.map((segment) => {
    const start = current;
    current += (segment.value / promotionTotal) * 100;
    return `${segment.color} ${start}% ${current}%`;
  }).join(',');
  document.querySelector('#donutChart').style.background = `conic-gradient(${stops})`;
  document.querySelector('#donutTotal').textContent = String(promotionTotal);
  document.querySelector('#donutLegend').innerHTML = segments.map((segment) => {
    const share = ((segment.value / promotionTotal) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    return `<li><i class="legend-swatch" style="--swatch:${segment.color}"></i><span>${segment.label}</span><strong>${segment.value} · ${share}%</strong></li>`;
  }).join('');
}

const originByOpm = [
  ['12º BPM', 17],
  ['17º BPM', 14],
  ['18º BPM', 14],
  ['6º BPM', 14],
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

function renderHorizontalBars(target, rows, total, color, showTerritory = false) {
  const maximum = Math.max(...rows.map(([, value]) => value));
  document.querySelector(target).innerHTML = rows.map(([label, value], index) => {
    const width = Math.max((value / maximum) * 100, 3);
    const share = ((value / total) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    const territory = showTerritory ? getPogTerritory(label) : null;
    const unitLabel = territory
      ? `<span class="horizontal-unit-label"><strong>${formatPogUnitName(label)}</strong></span>`
      : `<strong>${label}</strong>`;
    return `<div class="horizontal-bar-row">
      <span class="horizontal-rank">${String(index + 1).padStart(2, '0')}</span>
      ${unitLabel}
      <div class="horizontal-track"><i style="width:${width}%;--origin-color:${color}"></i></div>
      <span class="horizontal-value">${value} <small>${share}%</small></span>
    </div>`;
  }).join('');
}

function renderOrigins() {
  renderHorizontalBars('#opmOriginChart', originByOpm, 230, '#1b8258', true);
  renderHorizontalBars('#cityOriginChart', originByCity, 326, '#3b7e9d');
}

const battalionCompanyStrengths = {
  '1º BPM': [178, 116], '2º BPM': [305, 121, 160, 1], '3º BPM': [112, 96, 81, 117],
  '4º BPM': [159, 81], '5º BPM': [245, 63, 77], '6º BPM': [126, 105, 109],
  '7º BPM': [150, 73, 89], '8º BPM': [229, 92], '9º BPM': [108, 59, 92, 66],
  '10º BPM': [148, 47], '11º BPM': [202, 102, 109], '12º BPM': [232, 130],
  '13º BPM': [76, 38, 40], '14º BPM': [209, 148], '15º BPM': [144, 105],
  '16º BPM': [177, 136, 90], '17º BPM': [209, 172], '18º BPM': [219, 165],
  '19º BPM': [158, 149, 148], '20º BPM': [145, 134, 121], '21º BPM': [117, 243],
  '22º BPM': [140, 114], '23º BPM': [118, 82, 60, 66], '24º BPM': [180, 144],
  '25º BPM': [136, 81], '26º BPM': [142, 144], '27º BPM': [136, 76],
  '28º BPM': [101, 72], '29º BPM': [146, 94], '30º BPM': [117, 70],
  '31º BPM': [110, 51], '32º BPM': [155, 67], '33º BPM': [90, 35], '34º BPM': [120, 71]
};

const battalionCompanyCities = {
  '1º BPM': ['Russas', 'Limoeiro do Norte'], '2º BPM': ['Juazeiro do Norte', 'Barbalha', 'Crato', null],
  '3º BPM': ['Sobral', 'Forquilha', 'Massapê', 'Sobral'], '4º BPM': ['Canindé', 'Boa Viagem'],
  '5º BPM': ['Fortaleza', 'Fortaleza', 'Fortaleza'], '6º BPM': ['Fortaleza', 'Fortaleza', 'Fortaleza'],
  '7º BPM': ['Crateús', 'Nova Russas', 'Santa Quitéria'], '8º BPM': ['Fortaleza', 'Fortaleza'],
  '9º BPM': ['Quixadá', 'Senador Pompeu', 'Morada Nova', 'Quixeramobim'], '10º BPM': ['Iguatu', 'Jucás'],
  '11º BPM': ['Itapipoca', 'Pentecoste', 'Acaraú'], '12º BPM': ['Caucaia', 'Caucaia'],
  '13º BPM': ['Tauá', 'Parambu', 'Mombaça'], '14º BPM': ['Maracanaú', 'Maracanaú'],
  '15º BPM': ['Eusébio', 'Cascavel'], '16º BPM': ['Fortaleza', 'Fortaleza', 'Fortaleza'],
  '17º BPM': ['Fortaleza', 'Fortaleza'], '18º BPM': ['Fortaleza', 'Fortaleza'],
  '19º BPM': ['Fortaleza', 'Fortaleza', 'Fortaleza'], '20º BPM': ['Fortaleza', 'Fortaleza', 'Fortaleza'],
  '21º BPM': ['Fortaleza', 'Fortaleza'], '22º BPM': ['Fortaleza', 'Fortaleza'],
  '23º BPM': ['Paraipaba', 'São Gonçalo do Amarante', 'São Gonçalo do Amarante', 'Trairi'],
  '24º BPM': ['Maranguape', 'Pacatuba'], '25º BPM': ['Horizonte', 'Pacajus'],
  '26º BPM': ['Caucaia', 'Caucaia'], '27º BPM': ['Tianguá', 'São Benedito'],
  '28º BPM': ['Camocim', 'Granja'], '29º BPM': ['Baturité', 'Guaramiranga'],
  '30º BPM': ['Aracati', 'Beberibe'], '31º BPM': ['Jaguaribe', 'Alto Santo'],
  '32º BPM': ['Brejo Santo', 'Mauriti'], '33º BPM': ['Campos Sales', 'Assaré'],
  '34º BPM': ['Icó', 'Várzea Alegre']
};

const battalionHeadquartersCities = {
  '1º BPM': 'Russas', '2º BPM': 'Juazeiro do Norte', '3º BPM': 'Sobral', '4º BPM': 'Canindé',
  '5º BPM': 'Fortaleza', '6º BPM': 'Fortaleza', '7º BPM': 'Crateús', '8º BPM': 'Fortaleza',
  '9º BPM': 'Quixadá', '10º BPM': 'Iguatu', '11º BPM': 'Itapipoca', '12º BPM': 'Caucaia',
  '13º BPM': 'Tauá', '14º BPM': 'Maracanaú', '15º BPM': 'Eusébio', '16º BPM': 'Fortaleza',
  '17º BPM': 'Fortaleza', '18º BPM': 'Fortaleza', '19º BPM': 'Fortaleza', '20º BPM': 'Fortaleza',
  '21º BPM': 'Fortaleza', '22º BPM': 'Fortaleza', '23º BPM': 'Paracuru', '24º BPM': 'Maranguape',
  '25º BPM': 'Horizonte', '26º BPM': 'Caucaia', '27º BPM': 'Tianguá', '28º BPM': 'Camocim',
  '29º BPM': 'Baturité', '30º BPM': 'Aracati', '31º BPM': 'Jaguaribe', '32º BPM': 'Brejo Santo',
  '33º BPM': 'Campos Sales', '34º BPM': 'Icó'
};

const capitalBattalionNeighborhoods = {
  '5º BPM': ['Centro', 'Carlito Pamplona'],
  '6º BPM': ['Parangaba', 'Bairro de Fátima'],
  '8º BPM': ['Aldeota', 'Vicente Pinzón'],
  '16º BPM': ['Messejana', 'Jangurussu'],
  '17º BPM': ['Conjunto Ceará', 'Bom Jardim'],
  '18º BPM': ['Antônio Bezerra', 'Parquelândia'],
  '19º BPM': ['Cambeba', 'Aerolândia'],
  '20º BPM': ['Pirambu', 'Barra do Ceará'],
  '21º BPM': ['Conjunto Esperança', 'Maraponga'],
  '22º BPM': ['Papicu', 'Dionísio Torres']
};

const caucaiaBattalionNeighborhoods = {
  '12º BPM': ['Centro', 'Cumbuco'],
  '26º BPM': ['Jurema', 'Nova Metrópole']
};

const battalionTerritoriesFromAddresses = Object.fromEntries(
  Object.entries(battalionCompanyCities).map(([battalion, cities]) => [
    battalion,
    capitalBattalionNeighborhoods[battalion]
      ?? caucaiaBattalionNeighborhoods[battalion]
      ?? [...new Set(cities.slice(0, 2).filter(Boolean))]
  ])
);

const battalionTotalsFromCompanies = Object.fromEntries(
  Object.entries(battalionCompanyStrengths).map(([battalion, strengths]) => [
    battalion,
    strengths.reduce((sum, strength) => sum + strength, 0)
  ])
);

const companyCountByBattalion = Object.fromEntries(
  Object.entries(battalionCompanyStrengths).map(([battalion, strengths]) => [battalion, strengths.length])
);

const battalionCrpmByUnit = {
  '1º BPM': '8º CRPM', '2º BPM': '4º CRPM', '3º BPM': '3º CRPM', '4º BPM': '7º CRPM',
  '5º BPM': '1º CRPM', '6º BPM': '1º CRPM', '7º BPM': '3º CRPM', '8º BPM': '5º CRPM',
  '9º BPM': '8º CRPM', '10º BPM': '4º CRPM', '11º BPM': '7º CRPM', '12º BPM': '2º CRPM',
  '13º BPM': '4º CRPM', '14º BPM': '6º CRPM', '15º BPM': '6º CRPM', '16º BPM': '5º CRPM',
  '17º BPM': '1º CRPM', '18º BPM': '1º CRPM', '19º BPM': '5º CRPM', '20º BPM': '1º CRPM',
  '21º BPM': '1º CRPM', '22º BPM': '5º CRPM', '23º BPM': '2º CRPM', '24º BPM': '6º CRPM',
  '25º BPM': '6º CRPM', '26º BPM': '2º CRPM', '27º BPM': '3º CRPM', '28º BPM': '3º CRPM',
  '29º BPM': '7º CRPM', '30º BPM': '8º CRPM', '31º BPM': '8º CRPM', '32º BPM': '4º CRPM',
  '33º BPM': '4º CRPM', '34º BPM': '4º CRPM'
};

const crpmTotalsFromCompanies = Object.entries(battalionTotalsFromCompanies).reduce((totals, [battalion, strength]) => {
  const crpm = battalionCrpmByUnit[battalion];
  totals[crpm] = (totals[crpm] || 0) + strength;
  return totals;
}, {});

const metricDetails = {
  exits: {
    accent: '#23845b',
    eyebrow: 'Memória de cálculo · perda de efetivo',
    title: '1.111 registros considerados na análise de perdas',
    total: '1.111',
    unit: 'registros considerados',
    description: '',
    stats: [
      ['Exonerações de 2025–2026 · outros concursos', '145', '64 processos de 2025 + 81 registros únicos de 2026'],
      ['Demissões de 2025–2026 · outros concursos', '259', '16 processos de 2025 + 243 registros considerados de 2026'],
      ['Requeridas de 2025', '504', '320 nos BPMs · 184 em outras OPMs'],
      ['Requeridas de 2026', '203', '110 nos BPMs · 93 em outras OPMs']
    ],
    breakdown: [
      ['Demissões · outros concursos · processos 2025', 16 / 1111 * 100, '16 · 1,4%', '#145c40'],
      ['Exonerações · outros concursos · processos 2025', 64 / 1111 * 100, '64 · 5,8%', '#3d9065'],
      ['Demissões · outros concursos 2026', 243 / 1111 * 100, '243 · 21,9%', '#28734e'],
      ['Exonerações · outros concursos 2026', 81 / 1111 * 100, '81 · 7,3%', '#55a477'],
      ['Requeridas · 2025–2026', 707 / 1111 * 100, '707 · 63,6%', '#698342']
    ],
    sectionTitle: 'Conciliação dos registros considerados',
    sectionSubtitle: 'Os processos de 2025 são agregados por ano e não foram atribuídos a batalhões.',
    tableColumns: ['Etapa de validação', 'Exonerações · outros concursos', 'Demissões · outros concursos', 'Requeridas', 'Total'],
    tableRows: [
      ['Processos agregados de 2025', '64', '16', '0', '80'],
      ['Saídas únicas de 2026 · sem BPGEP', '81', '243', '0', '324'],
      ['Requeridas de 2025–2026 · sem BPGEP', '0', '0', '707', '707'],
      ['Total combinado de registros', '145', '259', '707', '1.111'],
      ['Recorte atribuível aos 34 BPMs', '60', '170', '430', '660']
    ],
    unitScope: {
      summary: [
        ['Unidades operacionais', '810', '34 BPMs territoriais e 18 especializadas'],
        ['Administrativas e demais OPMs', '221', 'Comandos, diretorias, apoio e outras unidades'],
        ['Sem OPM individualizada', '80', 'Processos agregados de 2025']
      ],
      unitLists: [
        ['Operacionais consideradas', ['1º ao 34º BPM', 'RAIO - 1º ao 9º BPM', 'BEPI', 'BOPE', 'BPCHOQUE', 'BPMA', 'BPRE', 'BPTUR', 'COTAM', 'COPAC', 'RPMONT']],
        ['Administrativas, comandos e apoio identificados', ['AGCG', 'ASCOI', 'ASINT', 'CCS/QCG', 'CGO', 'CGP', 'COGEIC', 'COLOG', 'CSASR', 'DPGO/DPGI', 'DS', 'HGPM', 'QCG/CBMPM', 'SUBCOMANDO-GERAL', 'CRPMs', 'CCPM/Colégios', 'CPGs', 'Outras OPMs']]
      ],
      tableColumns: ['Natureza da unidade', 'Escopo considerado', 'Exonerações', 'Demissões', 'Requeridas'],
      tableRows: [
        ['Operacional territorial', '34 BPMs', '60', '170', '430'],
        ['Operacional especializada', '18 unidades especializadas', '13', '43', '94'],
        ['Administrativa e demais OPMs', 'Comandos, diretorias, apoio e outras unidades', '8', '30', '183'],
        ['Sem OPM individualizada', 'Processos agregados de 2025', '64', '16', '0'],
        ['TOTAL DOS REGISTROS EXIBIDOS', 'Todas as parcelas apresentadas', '145', '259', '707']
      ]
    },
    note: ''
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
    accent: '#216f4c',
    eyebrow: 'Memória de cálculo · POG + COTAM/BPTUR',
    title: '1.007 policiais entre déficit e implementação operacional',
    total: '1.007',
    unit: 'policiais',
    description: 'Indicador consolidado que reúne o déficit de 847 policiais nos BPMs do POG e a necessidade adicional de 160 policiais para implementação da COTAM e da 6ª Cia/BPTUR.',
    stats: [
      ['Déficit de efetivo do POG para as unidades especializadas', '847', 'Déficit localizado nos BPMs territoriais'],
      ['COTAM - Necessidade de efetivo pronta resposta', '110', '10 oficiais · 100 praças'],
      ['BPTUR (Cariri e Guaramiranga)', '50', '02 oficiais · 48 praças'],
      ['Total consolidado', '1.007', '847 POG · 110 COTAM · 50 BPTUR']
    ],
    hideBreakdown: true,
    breakdown: [],
    pogBreakdown: [
      ['12º BPM', 40.4, '342 · 40,4%', '#145c40'],
      ['3º BPM', 7.6, '64 · 7,6%', '#23794f'],
      ['10º BPM', 7.1, '60 · 7,1%', '#368a60'],
      ['2º BPM', 6.1, '52 · 6,1%', '#4c9b70'],
      ['16º BPM', 4.8, '41 · 4,8%', '#65aa82'],
      ['Demais 14 BPMs', 34.0, '288 · 34,0%', '#84b99a']
    ],
    sectionTitle: 'Batalhões com maior saldo negativo',
    sectionSubtitle: 'Ranking das dez maiores perdas dentro do déficit acumulado de 847 policiais nos BPMs.',
    tableColumns: ['Posição', 'Batalhão', 'Origem', 'Destino', 'Participação', 'Saldo'],
    tableRows: [
      ['1', '12º BPM', '627', '285', '40,4%', '-342'], ['2', '3º BPM', '422', '358', '7,6%', '-64'],
      ['3', '10º BPM', '226', '166', '7,1%', '-60'], ['4', '2º BPM', '179', '127', '6,1%', '-52'],
      ['5', '16º BPM', '232', '191', '4,8%', '-41'], ['6', '1º BPM', '223', '184', '4,6%', '-39'],
      ['7', '11º BPM', '104', '67', '4,4%', '-37'], ['8', '14º BPM', '133', '97', '4,3%', '-36'],
      ['9', '18º BPM', '187', '155', '3,8%', '-32'], ['10', '21º BPM', '209', '179', '3,5%', '-30']
    ],
    implementationUnits: [
      {
        tag: 'Implementação 01',
        title: 'Companhia Pronta-Resposta (COTAM)',
        subtitle: 'Estrutura operacional de pronta resposta',
        total: '110',
        officers: '10',
        enlisted: '100',
        territory: 'Pronta resposta'
      },
      {
        tag: 'Implementação 02',
        title: '6ª Cia/BPTUR',
        subtitle: 'Atuação turística no Cariri e em Guaramiranga',
        total: '50',
        officers: '02',
        enlisted: '48',
        territory: 'Cariri',
        note: 'Pelotão destacado em Guaramiranga'
      }
    ],
    units: [
      ['10º BPM', 226, 166, -60], ['11º BPM', 104, 67, -37], ['12º BPM', 627, 285, -342],
      ['13º BPM', 66, 76, 10], ['14º BPM', 133, 97, -36], ['15º BPM', 141, 143, 2],
      ['16º BPM', 232, 191, -41], ['17º BPM', 176, 172, -4], ['18º BPM', 187, 155, -32],
      ['19º BPM', 205, 210, 5], ['1º BPM', 223, 184, -39], ['20º BPM', 294, 270, -24],
      ['21º BPM', 209, 179, -30], ['22º BPM', 114, 92, -22], ['23º BPM', 137, 132, -5],
      ['24º BPM', 75, 65, -10], ['25º BPM', 158, 165, 7], ['26º BPM', 533, 826, 293],
      ['27º BPM', 265, 282, 17], ['28º BPM', 290, 323, 33], ['29º BPM', 198, 198, 0],
      ['2º BPM', 179, 127, -52], ['30º BPM', 271, 288, 17], ['31º BPM', 203, 232, 29],
      ['32º BPM', 263, 288, 25], ['33º BPM', 191, 213, 22], ['34º BPM', 172, 245, 73],
      ['3º BPM', 422, 358, -64], ['4º BPM', 50, 36, -14], ['5º BPM', 196, 196, 0],
      ['6º BPM', 167, 164, -3], ['7º BPM', 78, 88, 10], ['8º BPM', 116, 94, -22],
      ['9º BPM', 167, 157, -10]
    ],
    territories: battalionTerritoriesFromAddresses,
    companyCitiesByBattalion: battalionCompanyCities,
    companyStrengthByBattalion: battalionCompanyStrengths,
    companyCountByBattalion,
    note: ''
  },
  restructuring: {
    accent: '#557c45',
    eyebrow: 'Memória de cálculo · interior e litoral',
    title: '',
    total: '',
    unit: 'policiais necessários - Dec.: 34.820/2022 para o Dec.: 36.491/2025',
    description: '',
    stats: [],
    breakdownTitle: 'Distribuição do reforço por batalhão',
    breakdownSubtitle: '',
    hideBreakdown: true,
    breakdown: [],
    units: [],
    sectionTitle: 'Distribuição do efetivo adicional por batalhão',
    sectionSubtitle: '',
    tableColumns: ['Posição', '<span class="column-title-line">Batalhão /</span><span class="column-title-line">localidades</span>', 'Efetivo atual', 'Referência inteira', 'Situação', 'Perdas', '<span class="column-title-line">Efetivo adicional</span><span class="column-title-line">necessário</span>'],
    tableRows: [],
    note: ''
  },
  battalions: {
    accent: '#145c40',
    eyebrow: 'Análise consolidada · batalhões',
    title: 'BATALHÕES - Análise situacional de Efetivo',
    total: '',
    unit: 'necessidade consolidada apurada',
    description: '',
    stats: [
      ['Unidades analisadas', '52', '34 BPMs · 18 unidades especializadas'],
      ['Exonerações e demissões · outros concursos', '73 + 213', '286 saídas discriminadas nas unidades da tabela'],
      ['Necessidade nas especializadas', '170', 'Resultado apurado nas 18 unidades especializadas']
    ],
    breakdownTitle: 'Situação integrada dos 34 batalhões',
    breakdownSubtitle: 'Distribuição dos BPMs após incorporar exonerações e demissões relacionadas a outros concursos, além das requeridas, ao saldo das movimentações.',
    hideBreakdown: true,
    breakdown: [
      ['Déficit', 73.53, '25 · 73,5%', '#145c40'],
      ['Saldo positivo', 23.53, '8 · 23,5%', '#3d9065'],
      ['Em equilíbrio', 2.94, '1 · 2,9%', '#83b99a']
    ],
    sectionTitle: 'Visão geral por batalhão e unidade especializada',
    sectionSubtitle: '',
    tableColumns: ['Posição', 'Unidade / cidades', '<span class="column-title-line">Efetivo da</span><span class="column-title-line">unidade</span>', 'Exonerações · outros concursos', 'Demissões · outros concursos', 'Requeridas', 'Movimentações', 'Perdas', 'Reestruturação.', '<span class="column-title-line">Necessidade de</span><span class="column-title-line">efetivo</span>'],
    tableRows: [],
    battalionTotals: battalionTotalsFromCompanies,
    crpmByUnit: battalionCrpmByUnit,
    crpmTotals: crpmTotalsFromCompanies,
    administrativeExits: {
      '1º BPM': [0, 6], '2º BPM': [4, 3], '3º BPM': [2, 3], '4º BPM': [3, 5],
      '5º BPM': [1, 3], '6º BPM': [1, 13], '7º BPM': [0, 3], '8º BPM': [3, 6],
      '9º BPM': [0, 7], '10º BPM': [0, 4], '11º BPM': [0, 4], '12º BPM': [9, 8],
      '13º BPM': [1, 3], '14º BPM': [1, 9], '15º BPM': [1, 2], '16º BPM': [2, 5],
      '17º BPM': [2, 12], '18º BPM': [3, 11], '19º BPM': [4, 8], '20º BPM': [3, 8],
      '21º BPM': [1, 5], '22º BPM': [1, 4], '23º BPM': [1, 6], '24º BPM': [1, 9],
      '25º BPM': [5, 3], '26º BPM': [1, 6], '27º BPM': [0, 2], '28º BPM': [0, 4],
      '29º BPM': [1, 1], '30º BPM': [1, 1], '31º BPM': [2, 0], '32º BPM': [0, 1],
      '33º BPM': [1, 4], '34º BPM': [5, 1]
    },
    requiredPromotions2025: {
      '1º BPM': 14, '2º BPM': 25, '3º BPM': 13, '4º BPM': 17,
      '5º BPM': 11, '6º BPM': 13, '7º BPM': 9, '8º BPM': 3,
      '9º BPM': 13, '10º BPM': 10, '11º BPM': 23, '12º BPM': 4,
      '13º BPM': 5, '14º BPM': 8, '15º BPM': 5, '16º BPM': 6,
      '17º BPM': 7, '18º BPM': 8, '19º BPM': 5, '20º BPM': 9,
      '21º BPM': 9, '22º BPM': 4, '23º BPM': 7, '24º BPM': 9,
      '25º BPM': 8, '26º BPM': 6, '27º BPM': 9, '28º BPM': 9,
      '29º BPM': 16, '30º BPM': 13, '31º BPM': 1, '32º BPM': 9,
      '33º BPM': 7, '34º BPM': 5
    },
    requiredPromotions2026: {
      '1º BPM': 3, '2º BPM': 10, '3º BPM': 5, '4º BPM': 7,
      '5º BPM': 3, '6º BPM': 2, '7º BPM': 6, '8º BPM': 4,
      '9º BPM': 4, '10º BPM': 4, '11º BPM': 10, '12º BPM': 1,
      '13º BPM': 1, '14º BPM': 0, '15º BPM': 4, '16º BPM': 4,
      '17º BPM': 1, '18º BPM': 2, '19º BPM': 3, '20º BPM': 3,
      '21º BPM': 3, '22º BPM': 3, '23º BPM': 3, '24º BPM': 7,
      '25º BPM': 1, '26º BPM': 0, '27º BPM': 4, '28º BPM': 3,
      '29º BPM': 2, '30º BPM': 1, '31º BPM': 0, '32º BPM': 1,
      '33º BPM': 2, '34º BPM': 3
    },
    specializedUnits: [
      { name: 'RAIO - 1º BPM', strength: 572, exonerations: 0, dismissals: 0, required2025: 3, required2026: 1, movementBalance: -3 },
      { name: 'RAIO - 2º BPM', strength: 261, exonerations: 1, dismissals: 1, required2025: 5, required2026: 0, movementBalance: -3 },
      { name: 'RAIO - 3º BPM', strength: 294, exonerations: 0, dismissals: 1, required2025: 0, required2026: 1, movementBalance: 0 },
      { name: 'RAIO - 4º BPM', strength: 376, exonerations: 0, dismissals: 3, required2025: 2, required2026: 0, movementBalance: -3 },
      { name: 'RAIO - 5º BPM', strength: 522, exonerations: 1, dismissals: 5, required2025: 3, required2026: 2, movementBalance: 0 },
      { name: 'RAIO - 6º BPM', strength: 450, exonerations: 0, dismissals: 0, required2025: 0, required2026: 0, movementBalance: 3 },
      { name: 'RAIO - 7º BPM', strength: 254, exonerations: 0, dismissals: 0, required2025: 0, required2026: 0, movementBalance: -1 },
      { name: 'RAIO - 8º BPM', strength: 233, exonerations: 0, dismissals: 0, required2025: 0, required2026: 0, movementBalance: -1 },
      { name: 'RAIO - 9º BPM', strength: 179, exonerations: 0, dismissals: 0, required2025: 0, required2026: 0, movementBalance: 0 },
      { name: 'BEPI', strength: 479, exonerations: 0, dismissals: 0, required2025: 3, required2026: 1, movementBalance: 2 },
      { name: 'BOPE', strength: 75, exonerations: 0, dismissals: 0, required2025: 0, required2026: 1, movementBalance: 2 },
      { name: 'BPCHOQUE', strength: 412, exonerations: 2, dismissals: 4, required2025: 11, required2026: 11, movementBalance: 33 },
      { name: 'BPMA', strength: 266, exonerations: 2, dismissals: 5, required2025: 5, required2026: 1, movementBalance: -27 },
      { name: 'BPRE', strength: 614, exonerations: 0, dismissals: 1, required2025: 11, required2026: 4, movementBalance: 10 },
      { name: 'BPTUR', strength: 559, exonerations: 5, dismissals: 8, required2025: 6, required2026: 6, movementBalance: 0 },
      { name: 'COTAM', strength: 189, exonerations: 2, dismissals: 0, required2025: 3, required2026: 1, movementBalance: -10 },
      { name: 'COPAC', strength: 374, exonerations: 0, dismissals: 13, required2025: 5, required2026: 2, movementBalance: -5 },
      { name: 'RPMONT', strength: 141, exonerations: 0, dismissals: 2, required2025: 6, required2026: 0, movementBalance: -8 }
    ],
    healthLeaveTotals: {
      '1º BPM': 14, '2º BPM': 29, '3º BPM': 19, '4º BPM': 8, '5º BPM': 53,
      '6º BPM': 46, '7º BPM': 11, '8º BPM': 29, '9º BPM': 15, '10º BPM': 6,
      '11º BPM': 13, '12º BPM': 25, '13º BPM': 5, '14º BPM': 26, '15º BPM': 19,
      '16º BPM': 30, '17º BPM': 43, '18º BPM': 29, '19º BPM': 34, '20º BPM': 45,
      '21º BPM': 48, '22º BPM': 37, '23º BPM': 20, '24º BPM': 24, '25º BPM': 18,
      '26º BPM': 12, '27º BPM': 7, '28º BPM': 7, '29º BPM': 14, '30º BPM': 14,
      '31º BPM': 9, '32º BPM': 12, '33º BPM': 2, '34º BPM': 3
    },
    note: ''
  },
  copac: {
    accent: '#2f855a',
    eyebrow: 'Memória de cálculo · COPAC/PReVio',
    title: '360 policiais de efetivo mínimo projetado',
    total: '360',
    unit: 'policiais',
    description: 'Projeção bruta do efetivo mínimo para o funcionamento de 12 bases cidadãs do PReVio, considerando 30 policiais por unidade.',
    stats: [
      ['Fases propostas', '03', 'Quatro bases previstas em cada etapa'],
      ['Bases projetadas', '12', 'Municípios e bases identificados pelo COPAC'],
      ['Efetivo e frota', '360 PM · 36 VTR', '30 policiais e três viaturas por base']
    ],
    breakdownTitle: 'Composição funcional do efetivo',
    breakdownSubtitle: 'Quantitativo consolidado para as 12 bases e participação no total de 360 policiais.',
    breakdown: [
      ['Guarda', 26.7, '96 · 26,7%', '#145c40'],
      ['Reserva de armamento', 13.3, '48 · 13,3%', '#23794f'],
      ['GAVV', 10, '36 · 10,0%', '#2f855a'],
      ['GSC', 10, '36 · 10,0%', '#3d9065'],
      ['GPF', 10, '36 · 10,0%', '#4c9b70'],
      ['Administrativo', 10, '36 · 10,0%', '#5daa7d'],
      ['GSE A', 6.7, '24 · 6,7%', '#73b78e'],
      ['GSE B', 6.7, '24 · 6,7%', '#89c29f'],
      ['Mediação de conflitos', 6.7, '24 · 6,7%', '#a0cdb0']
    ],
    resources: [
      ['Coletes balísticos', '384', '32 por base'],
      ['Pistolas', '384', '32 por base'],
      ['Escopetas calibre 12', '36', '03 por base'],
      ['Carabinas .40', '36', '03 por base'],
      ['Dispositivos SPARK', '48', '04 por base'],
      ['Rádios fixos', '24', '02 por base'],
      ['Rádios portáteis HT', '60', '05 por base'],
      ['Viaturas', '36', '03 por base']
    ],
    sectionTitle: 'Bases cidadãs previstas',
    sectionSubtitle: 'As 12 unidades recebem o mesmo padrão mínimo de 30 policiais e três viaturas.',
    tableColumns: ['Nº', 'Unidade/base', 'Localização', 'Viaturas', 'Comunicação', 'Necessidade'],
    tableRows: [
      ['1', 'Fortaleza — Jóquei', 'Fortaleza', '03', '02 fixos · 05 HT', '30'],
      ['2', 'Caucaia 1', 'Caucaia', '03', '02 fixos · 05 HT', '30'],
      ['3', 'Caucaia 2', 'Caucaia', '03', '02 fixos · 05 HT', '30'],
      ['4', 'Maracanaú 1', 'Maracanaú', '03', '02 fixos · 05 HT', '30'],
      ['5', 'Maracanaú 2', 'Maracanaú', '03', '02 fixos · 05 HT', '30'],
      ['6', 'Maranguape', 'Maranguape', '03', '02 fixos · 05 HT', '30'],
      ['7', 'Itapipoca', 'Itapipoca', '03', '02 fixos · 05 HT', '30'],
      ['8', 'Sobral', 'Sobral', '03', '02 fixos · 05 HT', '30'],
      ['9', 'Quixadá', 'Quixadá', '03', '02 fixos · 05 HT', '30'],
      ['10', 'Juazeiro do Norte', 'Juazeiro do Norte', '03', '02 fixos · 05 HT', '30'],
      ['11', 'Crato', 'Crato', '03', '02 fixos · 05 HT', '30'],
      ['12', 'Iguatu', 'Iguatu', '03', '02 fixos · 05 HT', '30']
    ],
    phases: [
      {
        id: 'fase-1',
        name: 'Fase 1',
        model: 'Implantação inicial · Região Metropolitana',
        bases: 4,
        total: 120,
        vehicles: 12,
        vests: 128,
        pistols: 128,
        sparks: 16,
        fixedRadios: 8,
        handheldRadios: 20,
        rows: [
          ['1', 'Fortaleza — Jóquei', 'Fortaleza', '03', '02 fixos · 05 HT', '30'],
          ['2', 'Caucaia 1', 'Caucaia', '03', '02 fixos · 05 HT', '30'],
          ['4', 'Maracanaú 1', 'Maracanaú', '03', '02 fixos · 05 HT', '30'],
          ['6', 'Maranguape', 'Maranguape', '03', '02 fixos · 05 HT', '30']
        ]
      },
      {
        id: 'fase-2',
        name: 'Fase 2',
        model: 'Expansão complementar · RMF e Norte',
        bases: 4,
        total: 120,
        vehicles: 12,
        vests: 128,
        pistols: 128,
        sparks: 16,
        fixedRadios: 8,
        handheldRadios: 20,
        rows: [
          ['3', 'Caucaia 2', 'Caucaia', '03', '02 fixos · 05 HT', '30'],
          ['5', 'Maracanaú 2', 'Maracanaú', '03', '02 fixos · 05 HT', '30'],
          ['7', 'Itapipoca', 'Itapipoca', '03', '02 fixos · 05 HT', '30'],
          ['8', 'Sobral', 'Sobral', '03', '02 fixos · 05 HT', '30']
        ]
      },
      {
        id: 'fase-3',
        name: 'Fase 3',
        model: 'Consolidação territorial · Centro-Sul',
        bases: 4,
        total: 120,
        vehicles: 12,
        vests: 128,
        pistols: 128,
        sparks: 16,
        fixedRadios: 8,
        handheldRadios: 20,
        rows: [
          ['9', 'Quixadá', 'Quixadá', '03', '02 fixos · 05 HT', '30'],
          ['10', 'Juazeiro do Norte', 'Juazeiro do Norte', '03', '02 fixos · 05 HT', '30'],
          ['11', 'Crato', 'Crato', '03', '02 fixos · 05 HT', '30'],
          ['12', 'Iguatu', 'Iguatu', '03', '02 fixos · 05 HT', '30']
        ]
      }
    ],
    note: 'Fonte: resposta oficial do COPAC de 08/09/2026. O total de 360 representa o efetivo mínimo bruto para funcionamento das 12 bases (12 × 30), não um déficit líquido, pois o documento não informa efetivo já disponível para aproveitamento. A divisão em três fases é uma proposta estratégica de planejamento baseada na distribuição territorial das bases; não constitui cronograma oficial do COPAC/PReVio. O COPAC informa não dispor do cronograma das obras, datas de inauguração ou disponibilização do mobiliário; essas informações devem ser obtidas junto ao PReVio.'
  }
};

const battalionRestructuringAdjustments = {
  '27º BPM': -40,
  '28º BPM': -40,
  '29º BPM': -30,
  '30º BPM': -20,
  '31º BPM': -30,
  '32º BPM': 20,
  '33º BPM': -50
};

const battalionLossAdjustments = {
  '13º BPM': 48
};

function recalculateRestructuringFromConsolidatedStrength() {
  const study = metricDetails.restructuring;
  const consolidated = metricDetails.battalions;
  const regionCounts = Object.values(consolidated.crpmByUnit).reduce((counts, region) => {
    counts[region] = (counts[region] || 0) + 1;
    return counts;
  }, {});
  const units = [26, 27, 28, 29, 30, 31, 32, 33, 34].map((number) => {
    const name = `${number}º BPM`;
    const current = consolidated.battalionTotals[name];
    const region = consolidated.crpmByUnit[name];
    const regionalAverage = consolidated.crpmTotals[region] / regionCounts[region];
    const reference = Math.ceil(regionalAverage);
    const baseAdditional = Math.max(0, reference - current);
    const manualAdjustment = battalionRestructuringAdjustments[name] ?? 0;
    const additional = baseAdditional + manualAdjustment;
    const movementBalance = metricDetails.pog.units.find(([unitName]) => unitName === name)?.[3] ?? 0;
    const [exonerations = 0, dismissals = 0] = consolidated.administrativeExits[name] || [];
    const requiredPromotions = (consolidated.requiredPromotions2025[name] ?? 0) + (consolidated.requiredPromotions2026[name] ?? 0);
    const losses = Math.max(0, exonerations + dismissals + requiredPromotions - movementBalance);
    return [name, current, reference, additional, region, regionalAverage, losses, baseAdditional, manualAdjustment];
  }).sort((a, b) => b[3] - a[3]);
  const currentTotal = units.reduce((sum, [, current]) => sum + current, 0);
  const additionalTotal = units.reduce((sum, [, , , additional]) => sum + additional, 0);
  const targetTotal = currentTotal + additionalTotal;
  const format = (number) => number.toLocaleString('pt-BR');
  const battalionStrengthTotal = Object.values(consolidated.battalionTotals).reduce((sum, strength) => sum + strength, 0);
  const battalionSituationalNeed = metricDetails.pog.units.reduce((sum, [name, , , balance]) => {
    const [exonerations = 0, dismissals = 0] = consolidated.administrativeExits[name] || [];
    const required = (consolidated.requiredPromotions2025[name] ?? 0) + (consolidated.requiredPromotions2026[name] ?? 0);
    return sum + Math.max(0, exonerations + dismissals + required - balance) + (battalionLossAdjustments[name] ?? 0);
  }, 0);
  const specializedNeed = consolidated.specializedUnits.reduce((sum, unit) => {
    const required = unit.required2025 + unit.required2026;
    return sum + Math.max(0, unit.exonerations + unit.dismissals + required - unit.movementBalance);
  }, 0);
  const battalionCombinedNeed = battalionSituationalNeed + additionalTotal;
  const consolidatedNeed = battalionCombinedNeed + specializedNeed;

  study.units = units;
  study.totalNumber = additionalTotal;
  study.regionalCounts = regionCounts;
  study.total = format(additionalTotal);
  study.title = `Reestruturação do interior e litoral: ${format(additionalTotal)} policiais necessários - Dec.: 34.820/2022 para o Dec.: 36.491/2025`;
  study.description = '';
  study.stats = [
    ['Efetivo atual', format(currentTotal), 'Policiais nos nove batalhões analisados'],
    ['Efetivo adicional necessário', format(additionalTotal), 'Reforço ajustado manualmente entre os nove batalhões'],
    ['Efetivo após implementação', format(targetTotal), `${format(currentTotal)} atuais + ${format(additionalTotal)} adicionais`]
  ];
  study.breakdownSubtitle = `Participação de cada BPM nos ${format(additionalTotal)} policiais necessários à transição do Dec. 34.820/2022 para o Dec. 36.491/2025.`;
  study.sectionSubtitle = 'O 26º BPM exibe os bairros Jurema e Nova Metrópole; do 27º ao 34º BPM, aparecem respectivamente as cidades da 1ª e da 2ª Cias. A referência matemática permanece visível, enquanto a necessidade incorpora os ajustes manuais da reestruturação.';
  study.tableRows = units.map(([name, current, reference, additional, , , losses], index) => [
    String(index + 1), name, format(current), format(reference),
    additional > 0 ? 'Abaixo da média' : 'Na média ou acima', format(losses), additional > 0 ? `-${format(additional)}` : '0'
  ]);
  study.note = '';

  consolidated.total = format(consolidatedNeed);
  consolidated.description = '';
  consolidated.note = '';

  const card = document.querySelector('.metric-card[data-detail="restructuring"]');
  if (card) {
    card.querySelector('.metric-main strong').textContent = study.total;
    card.querySelector('.metric-foot span').textContent = `Reforço para os ${units.length} batalhões analisados`;
    card.setAttribute('aria-label', `Detalhar os ${study.total} policiais necessários à transição do Decreto 34.820 de 2022 para o Decreto 36.491 de 2025`);
  }
  const battalionCard = document.querySelector('.metric-card[data-detail="battalions"]');
  if (battalionCard) {
    battalionCard.querySelector('.metric-main strong').textContent = consolidated.total;
    battalionCard.querySelector('.metric-foot span').textContent = `${format(battalionSituationalNeed)} BPMs + ${format(additionalTotal)} reestruturação + ${format(specializedNeed)} especializadas`;
    battalionCard.setAttribute('aria-label', `Detalhar a necessidade consolidada apurada de ${consolidated.total} policiais nos 34 batalhões e nas unidades especializadas`);
  }
}

recalculateRestructuringFromConsolidatedStrength();

const workforceProjectOverview = {
  accent: '#216f4c',
  eyebrow: 'Planejamento estratégico · 2027–2030',
  title: 'PROJETO DE EFETIVO 2027–2030'
};

const workforceProjectStudies = [
  {
    key: 'pog',
    eyebrow: 'Eixo 01 · policiamento e pronta resposta',
    title: 'POG + COTAM + BPTUR',
    description: 'Déficit localizado do POG e necessidades adicionais para implantação da COTAM e da 6ª Cia/BPTUR.',
    value: '1.007',
    unit: 'policiais',
    meta: '847 POG · 110 COTAM · 50 BPTUR',
    image: 'assets/icone-deficit-efetivo.png',
    imageAlt: 'Ícone do eixo POG, COTAM e BPTUR'
  },
  {
    key: 'raio',
    eyebrow: 'Eixo 02 · expansão territorial',
    title: 'RAIO — 20 bases satélites',
    description: 'Necessidade projetada em três níveis de implementação e 31 municípios satélite.',
    value: '912',
    unit: 'policiais',
    meta: '20 bases · três níveis',
    image: 'assets/emblema-raio.jpeg',
    imageAlt: 'Emblema do RAIO PMCE'
  },
  {
    key: 'copac',
    eyebrow: 'Eixo 03 · bases cidadãs',
    title: 'COPAC/PReVio — 12 bases cidadãs',
    description: 'Efetivo mínimo bruto organizado em três fases estratégicas de implantação.',
    value: '360',
    unit: 'policiais',
    meta: '12 bases · três fases',
    image: 'assets/icone-copac-previo.jpeg',
    imageAlt: 'Policiais do COPAC em base cidadã do PReVio'
  },
  {
    key: 'mariaPenhaPog',
    eyebrow: 'Eixo 04 · proteção especializada',
    title: 'MARIA DA PENHA - POG',
    description: 'Eixo destinado à organização territorial de duas opções do projeto no Policiamento Ostensivo Geral, com uma equipe fixa de três policiais por município: serviço de segunda a sexta e folga no sábado e domingo.',
    value: '21 ou 60',
    unit: 'policiais',
    meta: '7 ou 20 municípios',
    scenarios: [
      ['21', 'policiais para 7 municípios'],
      ['60', 'policiais para 20 municípios']
    ],
    image: 'assets/icone-reestruturacao-batalhoes.jpeg',
    imageAlt: 'Ícone provisório do eixo Maria da Penha - POG',
    stats: [
      ['OPÇÃO 1', '21', 'POLICIAIS PARA 7 MUNICÍPIOS'],
      ['OPÇÃO 2', '60', 'POLICIAIS PARA 20 MUNICÍPIOS'],
      ['Escala semanal', 'Regime 5 × 2', 'Serviço de segunda a sexta · folga sábado e domingo'],
      ['Impacto total projetado', '2.300 ou 2.339', 'Base de 2.279 + opção escolhida']
    ]
  }
];

const mariaDaPenhaProjects = [
  {
    id: 'opcao1',
    name: 'OPÇÃO 1',
    status: 'Municípios informados',
    cities: ['Barbalha', 'Crato', 'Itaitinga', 'Quixeramobim', 'Nova Russas', 'Pacatuba', 'Juazeiro do Norte']
  },
  {
    id: 'opcao2',
    name: 'OPÇÃO 2',
    status: 'Municípios informados',
    cities: ['Aquiraz', 'Barbalha', 'Boa Viagem', 'Crato', 'Eusébio', 'Granja', 'Ipu', 'Itaitinga', 'Limoeiro do Norte', 'Missão Velha', 'Nova Russas', 'Quixeramobim', 'Pacajus', 'Pacatuba', 'Paracuru', 'Russas', 'São Benedito', 'São Gonçalo do Amarante', 'Viçosa do Ceará', 'Juazeiro do Norte']
  }
];

const battalionSortLabels = {
  unit: 'UNIDADE, ORDEM ALFANUMÉRICA',
  battalionStrength: 'EFETIVO DA UNIDADE',
  movementBalance: 'MOVIMENTAÇÕES',
  restructuringNeed: 'REESTRUTURAÇÃO - DEC. 36.491/2025',
  totalNeed: 'NECESSIDADE FINAL DE EFETIVO'
};
let battalionSortState = { field: 'totalNeed', direction: 'desc' };

const battalionsPerCrpm = Object.values(metricDetails.battalions.crpmByUnit).reduce((counts, crpm) => {
  counts[crpm] = (counts[crpm] || 0) + 1;
  return counts;
}, {});

function getBattalionTableRecords() {
  const battalionRecords = metricDetails.pog.units.map(([name, , , balance]) => {
    const crpm = metricDetails.battalions.crpmByUnit[name];
    const [exonerations = 0, dismissals = 0] = metricDetails.battalions.administrativeExits[name] || [];
    const requiredPromotions2025 = metricDetails.battalions.requiredPromotions2025[name] ?? 0;
    const requiredPromotions2026 = metricDetails.battalions.requiredPromotions2026[name] ?? 0;
    const requiredPromotions = requiredPromotions2025 + requiredPromotions2026;
    const grossLosses = exonerations + dismissals + requiredPromotions;
    const situation = balance - grossLosses;
    const baseLosses = Math.max(0, -situation);
    const manualLossAdjustment = battalionLossAdjustments[name] ?? 0;
    const losses = baseLosses + manualLossAdjustment;
    const calculatedDeficit = losses;
    const restructuringUnit = metricDetails.restructuring.units.find(([unitName]) => unitName === name);
    const restructuringNeed = restructuringUnit ? restructuringUnit[3] : null;
    return {
      name,
      battalionStrength: metricDetails.battalions.battalionTotals[name] ?? null,
      crpm,
      crpmStrength: metricDetails.battalions.crpmTotals[crpm] ?? null,
      crpmAverage: Math.round(metricDetails.battalions.crpmTotals[crpm] / battalionsPerCrpm[crpm]),
      healthLeave: metricDetails.battalions.healthLeaveTotals[name] ?? null,
      movementBalance: balance,
      situation,
      exonerations,
      dismissals,
      requiredPromotions2025,
      requiredPromotions2026,
      requiredPromotions,
      grossLosses,
      baseLosses,
      manualLossAdjustment,
      losses,
      calculatedDeficit,
      restructuringNeed,
      totalNeed: calculatedDeficit + (restructuringNeed ?? 0)
    };
  });

  const specializedRecords = metricDetails.battalions.specializedUnits.map((unit) => {
    const requiredPromotions = unit.required2025 + unit.required2026;
    const grossLosses = unit.exonerations + unit.dismissals + requiredPromotions;
    const hasMovementBalance = unit.movementBalance != null;
    const situation = hasMovementBalance ? unit.movementBalance - grossLosses : null;
    const losses = hasMovementBalance ? Math.max(0, -situation) : null;
    return {
      name: unit.name,
      unitType: 'specialized',
      battalionStrength: unit.strength,
      movementBalance: unit.movementBalance,
      situation,
      exonerations: unit.exonerations,
      dismissals: unit.dismissals,
      requiredPromotions2025: unit.required2025,
      requiredPromotions2026: unit.required2026,
      requiredPromotions,
      grossLosses,
      losses,
      calculatedDeficit: losses,
      restructuringNeed: null,
      totalNeed: losses
    };
  });

  return [...battalionRecords, ...specializedRecords];
}

function compareBattalionRecords(a, b, field, direction) {
  const aValue = field === 'unit' ? a.name : a[field];
  const bValue = field === 'unit' ? b.name : b[field];
  if (aValue == null && bValue == null) return a.name.localeCompare(b.name, 'pt-BR', { numeric: true });
  if (aValue == null) return 1;
  if (bValue == null) return -1;
  const comparison = field === 'unit'
    ? aValue.localeCompare(bValue, 'pt-BR', { numeric: true })
    : aValue - bValue;
  if (comparison === 0) return a.name.localeCompare(b.name, 'pt-BR', { numeric: true });
  return direction === 'asc' ? comparison : -comparison;
}

function renderBattalionStrengthValue(total, note) {
  return total == null
    ? `<span class="battalion-strength-value is-unavailable"><strong>Não informado</strong><small>${note}</small></span>`
    : `<span class="battalion-strength-value"><strong>${total.toLocaleString('pt-BR')}</strong><small>${note}</small></span>`;
}

function renderBattalionAverageValue(total, note) {
  const formatted = total.toLocaleString('pt-BR');
  return `<span class="battalion-strength-value"><strong>${formatted}</strong><small>${note}</small></span>`;
}

function renderBattalionExitValue(total, note, unavailable = false) {
  return unavailable
    ? `<span class="battalion-exit-value is-unavailable"><strong>—</strong><small>${note}</small></span>`
    : `<span class="battalion-exit-value"><strong>${total.toLocaleString('pt-BR')}</strong><small>${note}</small></span>`;
}

function renderBattalionSignedValue(total, note) {
  if (total == null) return '<span class="battalion-exit-value is-unavailable"><strong>—</strong><small>não individualizado</small></span>';
  const value = total > 0 ? `+${total.toLocaleString('pt-BR')}` : total.toLocaleString('pt-BR');
  return `<span class="battalion-exit-value"><strong>${value}</strong><small>${note}</small></span>`;
}

function renderBattalionOptionalValue(total, note) {
  return total == null
    ? '<span class="battalion-exit-value is-unavailable"><strong>—</strong></span>'
    : renderBattalionExitValue(total, note);
}

function renderBattalionLossValue(record) {
  if (record.losses == null) return renderBattalionExitValue(0, 'após movimentações', true);
  if (Object.hasOwn(battalionLossAdjustments, record.name)) return renderBattalionExitValue(record.losses, 'Perdas anteriores');
  return renderBattalionExitValue(record.losses, 'após movimentações');
}

function buildBattalionTableRows(field = 'situation', direction = 'asc') {
  const records = getBattalionTableRecords();
  const battalionRecords = records.filter((record) => record.unitType !== 'specialized');
  const specializedRecords = records.filter((record) => record.unitType === 'specialized');
  const sumField = (items, fieldName) => items.reduce((sum, record) => sum + (record[fieldName] ?? 0), 0);
  const battalionStrength = sumField(battalionRecords, 'battalionStrength');
  const battalionLosses = sumField(battalionRecords, 'losses');
  const restructuringNeed = metricDetails.restructuring.totalNumber;
  const battalionNeed = battalionLosses + restructuringNeed;
  const specializedStrength = sumField(specializedRecords, 'battalionStrength');
  const specializedLosses = sumField(specializedRecords, 'losses');
  const consolidatedNeed = battalionNeed + specializedLosses;
  const rows = [...records]
    .sort((a, b) => compareBattalionRecords(a, b, field, direction))
    .map((record, index) => [
      String(index + 1),
      record.name,
      renderBattalionStrengthValue(record.battalionStrength, record.battalionStrength == null ? 'sem dado na fonte' : 'policiais'),
      renderBattalionExitValue(record.exonerations, 'saídas'),
      renderBattalionExitValue(record.dismissals, 'saídas'),
      renderBattalionExitValue(record.requiredPromotions, `2025: ${record.requiredPromotions2025} · 2026: ${record.requiredPromotions2026}`),
      renderBattalionSignedValue(record.movementBalance, 'saldo'),
      renderBattalionLossValue(record),
      renderBattalionOptionalValue(record.restructuringNeed, 'interior e litoral'),
      renderBattalionExitValue(record.totalNeed, 'necessidade total', record.totalNeed == null)
    ]);
  rows.push([
    '—',
    'REQUERIDAS DE OUTRAS OPMs',
    '—',
    '—',
    '—',
    renderBattalionExitValue(183, '2025: 121 · 2026: 62'),
    '—',
    renderBattalionExitValue(183, 'fora dos BPMs e especializadas listadas'),
    '—',
    '—'
  ]);
  rows.push([
    '—',
    'TOTAL DOS 34 BPMs',
    renderBattalionStrengthValue(battalionStrength, 'policiais'),
    renderBattalionExitValue(sumField(battalionRecords, 'exonerations'), 'saídas'),
    renderBattalionExitValue(sumField(battalionRecords, 'dismissals'), 'saídas'),
    renderBattalionExitValue(sumField(battalionRecords, 'requiredPromotions'), '2025: 320 · 2026: 110'),
    renderBattalionSignedValue(sumField(battalionRecords, 'movementBalance'), 'saldo'),
    renderBattalionExitValue(battalionLosses, 'perdas locais'),
    renderBattalionExitValue(restructuringNeed, '26º ao 34º BPM'),
    renderBattalionExitValue(battalionNeed, `${battalionLosses.toLocaleString('pt-BR')} + ${restructuringNeed.toLocaleString('pt-BR')}`)
  ]);
  rows.push([
    '—',
    'TOTAL DAS UNIDADES ESPECIALIZADAS',
    renderBattalionStrengthValue(specializedStrength, 'policiais'),
    renderBattalionExitValue(sumField(specializedRecords, 'exonerations'), 'saídas'),
    renderBattalionExitValue(sumField(specializedRecords, 'dismissals'), 'saídas'),
    renderBattalionExitValue(sumField(specializedRecords, 'requiredPromotions'), '2025: 111 · 2026: 43'),
    renderBattalionSignedValue(sumField(specializedRecords, 'movementBalance'), 'saldo das 18 unidades individualizadas'),
    renderBattalionExitValue(specializedLosses, 'perdas locais apuráveis'),
    '—',
    renderBattalionExitValue(specializedLosses, 'necessidade apurável')
  ]);
  rows.push([
    '—',
    'TOTAL CONSOLIDADO',
    renderBattalionStrengthValue(battalionStrength + specializedStrength, '34 BPMs + 18 especializadas'),
    renderBattalionExitValue(sumField(records, 'exonerations'), 'saídas'),
    renderBattalionExitValue(sumField(records, 'dismissals'), 'saídas'),
    renderBattalionExitValue(sumField(records, 'requiredPromotions'), 'unidades discriminadas'),
    renderBattalionSignedValue(sumField(records, 'movementBalance'), 'saldo conhecido'),
    renderBattalionExitValue(battalionLosses + specializedLosses, 'perdas locais apuráveis'),
    renderBattalionExitValue(restructuringNeed, '26º ao 34º BPM'),
    renderBattalionExitValue(consolidatedNeed, `${(battalionLosses + specializedLosses).toLocaleString('pt-BR')} + ${restructuringNeed.toLocaleString('pt-BR')}`)
  ]);
  return rows;
}

metricDetails.battalions.tableRows = buildBattalionTableRows(battalionSortState.field, battalionSortState.direction);

const metricModal = document.querySelector('#metricDetailModal');
const metricDialog = metricModal.querySelector('.metric-dialog');
const metricDetailTitle = document.querySelector('#metricDetailTitle');
const metricDetailEyebrow = document.querySelector('#metricDetailEyebrow');
const metricDetailContent = document.querySelector('#metricDetailContent');
const metricDetailBack = document.querySelector('#metricDetailBack');
const metricCards = [...document.querySelectorAll('.metric-card[data-detail]')];
let detailTrigger = null;

function getPogTerritory(unitName) {
  const cities = metricDetails.pog.territories[unitName];
  if (!cities) return null;
  return { cities };
}

function formatPogUnitName(unitName) {
  const territory = getPogTerritory(unitName);
  return territory ? `${unitName} — ${territory.cities.join(' · ')}` : unitName;
}

function renderPogUnitLabel(unitName) {
  return `<span class="pog-opm-label"><strong>${formatPogUnitName(unitName)}</strong></span>`;
}

function formatCompanyStructure(companyCount) {
  const labels = Array.from({ length: companyCount }, (_, index) => `${index + 1}ª`);
  return labels.length === 2
    ? `${labels[0]} e ${labels[1]} Cias`
    : `${labels.slice(0, -1).join(', ')} e ${labels.at(-1)} Cias`;
}

function renderBattalionUnitLabel(unitName) {
  const isSpecialized = metricDetails.battalions.specializedUnits.some((unit) => unit.name === unitName);
  const companyCount = metricDetails.pog.companyCountByBattalion[unitName];
  const structureLabel = companyCount
    ? `<small class="battalion-company-structure">Estrutura: ${formatCompanyStructure(companyCount)}</small>`
    : '';
  const complementaryLabel = isSpecialized ? '<small>Unidade especializada</small>' : structureLabel;
  return `<span class="pog-opm-label${isSpecialized ? ' specialized-unit-label' : ''}"><strong>${formatPogUnitName(unitName)}</strong>${complementaryLabel}</span>`;
}

function renderDetailTable(data, detailKey = '') {
  const head = data.tableColumns.map((column) => `<th scope="col">${column}</th>`).join('');
  const rows = data.tableRows.map((row) => {
    const rowClass = detailKey === 'battalions' && row[1] === 'REQUERIDAS DE OUTRAS OPMs'
      ? ' class="battalion-unallocated-row"'
      : detailKey === 'battalions' && String(row[1]).startsWith('TOTAL')
        ? ' class="battalion-total-row"'
        : '';
    return `<tr${rowClass}>${row.map((cell, index) => {
    const content = detailKey === 'battalions' && index === 1
      ? renderBattalionUnitLabel(cell)
      : ['pog', 'restructuring'].includes(detailKey) && index === 1 ? renderPogUnitLabel(cell) : cell;
    return `<td>${content}</td>`;
  }).join('')}</tr>`;
  }).join('');
  return `<div class="detail-table-wrap"><table class="detail-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderBattalionSortControls() {
  const buttons = Object.entries(battalionSortLabels).map(([field, label], index) => `
    <button class="battalion-sort-button${field === battalionSortState.field ? ' is-active' : ''}" type="button" data-battalion-sort="${field}" aria-pressed="${field === battalionSortState.field}">
      <span>${String(index + 1).padStart(2, '0')}</span>${label}
    </button>`).join('');
  return `
    <div class="battalion-sort-toolbar" aria-label="Controles de classificação da tabela">
      <div class="battalion-sort-heading">
        <div><span>Controle de classificação e filtro</span><strong>Escolha uma coluna para classificar / filtrar a tabela</strong></div>
        <button class="battalion-sort-direction" type="button" data-battalion-direction="${battalionSortState.direction}" aria-label="Inverter ordem da classificação">
          <b>${battalionSortState.direction === 'asc' ? '↑' : '↓'}</b>
          <span>${battalionSortState.direction === 'asc' ? 'Menor → maior' : 'Maior → menor'}</span>
        </button>
      </div>
      <div class="battalion-sort-options" role="group" aria-label="Escolher coluna para classificação">${buttons}</div>
      <p class="battalion-sort-status" id="battalionSortStatus" aria-live="polite">Ordem atual: ${battalionSortLabels[battalionSortState.field]} · ${battalionSortState.direction === 'asc' ? 'menor para maior' : 'maior para menor'}</p>
    </div>`;
}

function updateBattalionTable() {
  const tableResult = document.querySelector('#battalionTableResult');
  if (!tableResult) return;
  metricDetails.battalions.tableRows = buildBattalionTableRows(battalionSortState.field, battalionSortState.direction);
  tableResult.innerHTML = renderDetailTable(metricDetails.battalions, 'battalions');
  metricDetailContent.querySelectorAll('[data-battalion-sort]').forEach((button) => {
    const isActive = button.dataset.battalionSort === battalionSortState.field;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  const directionButton = metricDetailContent.querySelector('[data-battalion-direction]');
  if (directionButton) {
    directionButton.dataset.battalionDirection = battalionSortState.direction;
    directionButton.querySelector('b').textContent = battalionSortState.direction === 'asc' ? '↑' : '↓';
    directionButton.querySelector('span').textContent = battalionSortState.direction === 'asc' ? 'Menor → maior' : 'Maior → menor';
  }
  const status = document.querySelector('#battalionSortStatus');
  if (status) status.textContent = `Ordem atual: ${battalionSortLabels[battalionSortState.field]} · ${battalionSortState.direction === 'asc' ? 'menor para maior' : 'maior para menor'}`;
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

function renderCopacPhaseSelector(data) {
  const buttons = data.phases.map((phase) => `
    <button class="raio-level-button" type="button" data-copac-phase="${phase.id}" aria-pressed="false" aria-controls="copacPhaseDetail">
      <span>${phase.name}</span>
      <strong>${phase.model}</strong>
      <b>${phase.total} <small>policiais</small></b>
      <em>${phase.bases} bases · ${phase.vehicles} viaturas</em>
    </button>`).join('');
  return `
    <section class="detail-section raio-level-section copac-phase-section">
      <div class="detail-section-heading">
        <div><h3>Escolha a fase para aprofundar</h3><p>Os três botões apresentam os totais comparativos da proposta de implantação.</p></div>
        <span>Seleção por fase</span>
      </div>
      <div class="raio-level-selector">${buttons}</div>
      <div class="raio-level-detail copac-phase-detail" id="copacPhaseDetail" aria-live="polite">
        <div class="raio-level-empty"><strong>Selecione uma das fases acima</strong><span>Serão exibidas as bases, localizações e necessidades de efetivo, frota, proteção e comunicação da etapa escolhida.</span></div>
      </div>
    </section>`;
}

function renderCopacPhaseDetail(phaseId) {
  const data = metricDetails.copac;
  const phase = data.phases.find((item) => item.id === phaseId);
  const detail = document.querySelector('#copacPhaseDetail');
  if (!phase || !detail) return;
  metricDetailContent.querySelectorAll('[data-copac-phase]').forEach((button) => {
    const isActive = button.dataset.copacPhase === phaseId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  const summary = [
    ['Bases', phase.bases],
    ['Efetivo', phase.total],
    ['Viaturas', phase.vehicles],
    ['Coletes', phase.vests],
    ['Pistolas', phase.pistols],
    ['SPARK', phase.sparks],
    ['Rádios fixos', phase.fixedRadios],
    ['Rádios HT', phase.handheldRadios]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
  const table = renderDetailTable({
    tableColumns: data.tableColumns,
    tableRows: phase.rows
  }, 'copac');
  detail.innerHTML = `
    <div class="raio-level-heading copac-phase-heading">
      <div><span>${phase.name}</span><h4>${phase.model}</h4></div>
      <strong>${phase.total} policiais</strong>
    </div>
    <div class="raio-level-summary">${summary}</div>
    <div class="raio-cities-heading"><strong>Bases e necessidades da fase</strong><span>${phase.bases} bases · ${phase.vehicles} viaturas · 30 policiais por base</span></div>
    ${table}`;
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderPogBreakdown(rows) {
  return rows.map(([label, share, value, rowColor]) => {
    const formattedLabel = label.includes('BPM') ? formatPogUnitName(label) : label;
    return `
      <div class="detail-breakdown-row">
        <span class="detail-breakdown-label"><strong>${formattedLabel}</strong></span>
        <div class="detail-breakdown-track"><i style="width:${share}%;--row-color:${rowColor}"></i></div>
        <strong>${value}</strong>
      </div>`;
  }).join('');
}

function renderPogDeficitOverview(data) {
  const deficit = data.units.reduce((sum, [, , , balance]) => sum + Math.max(0, -balance), 0);
  const negative = data.units.filter(([, , , balance]) => balance < 0).length;
  const positive = data.units.filter(([, , , balance]) => balance > 0).length;
  const balanced = data.units.length - negative - positive;
  return `
    <section class="detail-section pog-separated-section pog-deficit-overview-section">
      <div class="pog-separated-heading">
        <span>Bloco 01 · Déficit de efetivo</span>
        <h3>POG — Policiamento Ostensivo Geral</h3>
        <p>Atendimento de ocorrências e maior visibilidade à sociedade</p>
      </div>
      <div class="pog-separated-content">
        <div class="pog-separated-kpis">
          <div><span>Déficit localizado</span><strong>${deficit.toLocaleString('pt-BR')}</strong><small>policiais</small></div>
          <div><span>BPMs analisados</span><strong>34</strong><small>batalhões territoriais</small></div>
          <div><span>Saldo negativo</span><strong>${negative}</strong><small>BPMs com perda líquida</small></div>
          <div><span>Demais situações</span><strong>${positive + balanced}</strong><small>${positive} com ganho · ${balanced} em equilíbrio</small></div>
        </div>
        <div class="pog-separated-breakdown">
          <div class="detail-section-heading">
            <div><h3>Concentração do déficit do POG</h3><p>Participação dos batalhões no déficit localizado de ${deficit.toLocaleString('pt-BR')} policiais.</p></div>
            <span>Somente POG</span>
          </div>
          <div class="detail-breakdown">${renderPogBreakdown(data.pogBreakdown)}</div>
        </div>
      </div>
    </section>`;
}

function renderPogImplementations(data) {
  const implementationCards = data.implementationUnits.map((unit) => `
    <article class="pog-implementation-card">
      <header>
        <span>${unit.tag}</span>
        <h4>${unit.title}</h4>
        <p>${unit.subtitle}</p>
      </header>
      <div class="pog-implementation-values">
        <div><span>Efetivo necessário</span><strong>${unit.total}</strong><small>policiais</small></div>
        <div><span>Oficiais</span><strong>${unit.officers}</strong><small>policiais</small></div>
        <div><span>Praças</span><strong>${unit.enlisted}</strong><small>policiais</small></div>
      </div>
      <div class="pog-implementation-territory">
        <span>Área de atuação</span><strong>${unit.territory}</strong>
        ${unit.note ? `<small>${unit.note}</small>` : ''}
      </div>
    </article>`).join('');
  return `
    <section class="detail-section pog-separated-section pog-implementation-section">
      <div class="pog-separated-heading">
        <span>Bloco 02 · Necessidade de implementação</span>
        <h3>Companhia Pronta-Resposta (COTAM) + BPTUR</h3>
        <p>Cariri e Guaramiranga · efetivo adicional para duas estruturas operacionais</p>
      </div>
      <div class="pog-separated-content">
        <div class="pog-implementation-total">
          <div><span>Total consolidado das implementações</span><strong>160 <small>policiais adicionais</small></strong></div>
          <p><b>110</b> para a COTAM <i>+</i> <b>50</b> para a 6ª Cia/BPTUR</p>
        </div>
        <div class="pog-implementation-grid">${implementationCards}</div>
        <p class="pog-implementation-note">Os quantitativos da COTAM e da 6ª Cia/BPTUR são apresentados separadamente. O total de 160 representa apenas a soma das duas necessidades de implementação.</p>
      </div>
    </section>`;
}

function renderRestructuringUnitExplorer(data) {
  const options = data.units.map(([name]) => `<option value="${name}"${name === '33º BPM' ? ' selected' : ''}>${formatPogUnitName(name)}</option>`).join('');
  return `
    <section class="detail-section restructuring-unit-section">
      <div class="detail-section-heading">
        <div><h3>Consultar efetivo necessário por batalhão</h3><p>Selecione um dos nove BPMs para ver o efetivo atual, a referência e quantos policiais precisam ser acrescentados.</p></div>
        <span>Consulta individual</span>
      </div>
      <label class="pog-unit-control" for="restructuringUnitSelect">
        <span>Batalhão</span>
        <select id="restructuringUnitSelect">${options}</select>
      </label>
      <div class="pog-unit-result" id="restructuringUnitResult" aria-live="polite"></div>
    </section>`;
}

function renderRestructuringUnitDetail(unitName) {
  const unit = metricDetails.restructuring.units.find(([name]) => name === unitName);
  const result = document.querySelector('#restructuringUnitResult');
  if (!unit || !result) return;
  const [name, current, reference, difference, region, regionalAverage] = unit;
  const coverage = current / reference * 100;
  const belowAverage = difference > 0;
  const operationalDifference = difference;
  const status = belowAverage ? 'Abaixo da referência' : current === reference ? 'Na referência' : 'Acima da referência';
  const statusClass = belowAverage ? 'is-loss' : 'is-gain';
  const formatNumber = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const share = belowAverage ? operationalDifference / metricDetails.restructuring.totalNumber * 100 : 0;
  const regionalTotal = metricDetails.battalions.crpmTotals[region];
  const regionalCount = metricDetails.restructuring.regionalCounts[region];
  const calculation = `${region}: ${formatNumber(regionalTotal)} policiais ÷ ${regionalCount} BPMs = média atual de ${formatNumber(regionalAverage)}; referência matemática inteira de ${formatNumber(reference)}.`;
  const interpretation = belowAverage
    ? `Aplicar o reforço ajustado de ${formatNumber(operationalDifference)} policiais a este BPM. Com o reforço, seu efetivo passa de ${formatNumber(current)} para ${formatNumber(current + operationalDifference)} policiais. Esta unidade representa ${formatNumber(share)}% dos ${metricDetails.restructuring.total} necessários após os ajustes manuais. ${calculation}`
    : `Este BPM não precisa de reforço neste recorte. ${calculation}`;
  result.innerHTML = `
    <div class="pog-unit-result-heading">
      <div><span>Batalhão selecionado</span><strong>${formatPogUnitName(name)}</strong></div>
      <b class="${statusClass}">${status}</b>
    </div>
    <div class="pog-unit-values">
      <div><span>Efetivo atual</span><strong>${formatNumber(current)}</strong><small>Policiais registrados na unidade</small></div>
      <div><span>Referência inteira</span><strong>${formatNumber(reference)}</strong><small>Média convertida em efetivo policial inteiro</small></div>
      <div class="${belowAverage ? 'is-loss' : ''}"><span>Efetivo adicional necessário</span><strong>${formatNumber(operationalDifference)}</strong><small>Policiais a acrescentar nesta unidade</small></div>
      <div><span>Cobertura da média</span><strong>${formatNumber(coverage)}%</strong><small>Efetivo atual em relação à referência</small></div>
    </div>
    <p class="pog-unit-source-note">${interpretation}</p>`;
}

function renderRestructuringTopFive(data) {
  const rankedUnits = [...data.units]
    .filter(([, , , difference]) => difference > 0)
    .sort((a, b) => b[3] - a[3])
    .slice(0, 5);
  const maximum = Math.ceil(rankedUnits[0][3]);
  const topFiveShare = rankedUnits.reduce((sum, [, , , additional]) => sum + additional, 0) / data.totalNumber * 100;
  const rows = rankedUnits.map(([name, , , difference], index) => {
    const operationalDifference = Math.ceil(difference);
    const width = operationalDifference / maximum * 100;
    const share = operationalDifference / data.totalNumber * 100;
    const formattedDifference = operationalDifference.toLocaleString('pt-BR');
    const formattedShare = share.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `
      <div class="restructuring-rank-row">
        <span class="restructuring-rank-position">${String(index + 1).padStart(2, '0')}</span>
        <span class="restructuring-rank-unit"><strong>${formatPogUnitName(name)}</strong></span>
        <div class="restructuring-rank-track"><i style="width:${width}%"></i></div>
        <span class="restructuring-rank-value"><strong>${formattedDifference}</strong><small>${formattedShare}% do total</small></span>
      </div>`;
  }).join('');
  return `
    <section class="detail-section restructuring-ranking-section">
      <div class="detail-section-heading">
        <div><h3>Top 5 maiores necessidades de efetivo</h3><p>Batalhões com os maiores reforços após os ajustes manuais da reestruturação.</p></div>
        <span>${topFiveShare.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% dos ${data.total} policiais</span>
      </div>
      <div class="restructuring-ranking">${rows}</div>
    </section>`;
}

function renderCopacResources(data) {
  const resources = data.resources.map(([label, total, reference]) => `
    <div class="copac-resource-card">
      <span>${label}</span>
      <strong>${total}</strong>
      <small>${reference}</small>
    </div>`).join('');
  return `
    <section class="detail-section copac-resource-section">
      <div class="detail-section-heading">
        <div><h3>Logística mínima consolidada</h3><p>Projeção dos recursos informados pelo COPAC para o funcionamento das 12 bases.</p></div>
        <span>12 bases cidadãs</span>
      </div>
      <div class="copac-resource-grid">${resources}</div>
      <p class="copac-fleet-note"><strong>Emprego das viaturas por base:</strong> 01 para GAVV/GSE/GPF, 01 para GSE e 01 para reforço operacional/DRSO/reserva.</p>
    </section>`;
}

function renderProjectStudySelector() {
  const cards = workforceProjectStudies.map((study, index) => {
    const total = study.scenarios
      ? `<span class="project-study-card-total project-study-card-total--scenarios">${study.scenarios.map(([value, label]) => `<span><b>${value}</b><small>${label}</small></span>`).join('')}</span>`
      : `<span class="project-study-card-total"><b>${study.value}</b><small>${study.unit}</small></span>`;
    return `
      <button class="project-study-card${index === 0 ? ' is-active' : ''}" type="button" role="tab" id="projectStudyTab-${study.key}" data-project-study="${study.key}" aria-controls="projectStudyPanel-${study.key}" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}">
        <span class="project-study-card-icon"><img src="${study.image}" alt="${study.imageAlt}"></span>
        <span class="project-study-card-copy"><small>${study.eyebrow}</small><strong>${study.title}</strong><em>${study.meta}</em></span>
        ${total}
        <span class="project-study-card-action">Abrir estudo <b>→</b></span>
      </button>`;
  }).join('');
  return `
    <section class="detail-section project-study-selector-section">
      <div class="detail-section-heading">
        <div><h3>Escolha um eixo para aprofundar</h3><p>Os quatro subcards mantêm separados os universos, as premissas e os cálculos de cada estudo.</p></div>
        <span>Estudos separados</span>
      </div>
      <div class="project-study-selector" role="tablist" aria-label="Eixos do Projeto de Efetivo 2027 a 2030">${cards}</div>
    </section>`;
}

function renderProjectStudySummary(studyKey) {
  const study = workforceProjectStudies.find((item) => item.key === studyKey);
  const data = metricDetails[studyKey];
  const stats = (data?.stats || study.stats || []).map(([label, value, note]) => `
    <div class="project-study-stat"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
  return `
    <section class="project-study-summary">
      <div class="project-study-summary-heading">
        <span>${study.eyebrow}</span>
        <h3>${study.title}</h3>
        <p>${study.description}</p>
      </div>
      <div class="project-study-summary-total"><strong>${study.value}</strong><span>${study.unit}</span></div>
      <div class="project-study-stat-grid">${stats}</div>
    </section>`;
}

function buildMariaDaPenhaProjectDetail(projectId) {
  const project = mariaDaPenhaProjects.find((item) => item.id === projectId);
  if (!project) return '';
  const optionName = `Opção ${mariaDaPenhaProjects.findIndex((item) => item.id === projectId) + 1}`;
  if (!project.cities.length) {
    return `<div class="project-pending-message"><strong>${project.name}</strong><span>A estrutura está reservada e aguarda os municípios e quantitativos do estudo.</span></div>`;
  }
  const policePerPatrol = 3;
  const fixedPatrols = project.cities.length;
  const weeklyPolice = fixedPatrols * policePerPatrol;
  const currentProjectTotal = 2279;
  const projectedProjectTotal = currentProjectTotal + weeklyPolice;
  const effectiveItems = project.cities.map((city, index) => `
    <div class="maria-effective-item">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <strong>${city}</strong>
      <b>3<small>policiais</small></b>
    </div>`).join('');
  return `
    <div class="maria-project-detail-heading">
      <div><strong>${optionName}</strong></div>
      <b>${project.cities.length} municípios</b>
    </div>
    <div class="maria-project-kpis">
      <div><span>Patrulhas fixas</span><strong>${fixedPatrols}</strong><small>Uma por município</small></div>
      <div><span>Policiais por patrulha</span><strong>${policePerPatrol}</strong><small>Composição informada</small></div>
      <div><span>Efetivo semanal</span><strong>${weeklyPolice}</strong><small>Policiais fixos no projeto</small></div>
      <div><span>Regime de trabalho</span><strong>5 × 2</strong><small>Seg–sex · folga sáb–dom</small></div>
      <div class="is-impact"><span>Impacto total projetado</span><strong>${projectedProjectTotal.toLocaleString('pt-BR')}</strong><small>2.279 + ${weeklyPolice} policiais</small></div>
    </div>
    <div class="maria-schedule-heading"><strong>Efetivo por município</strong><span>Equipe fixa: serviço segunda–sexta · folga sábado–domingo</span></div>
    <div class="maria-effective-grid">${effectiveItems}</div>
    <div class="maria-effective-total">
      <span>Total da opção</span>
      <strong>${weeklyPolice}</strong>
      <small>policiais fixos em ${fixedPatrols} patrulhas</small>
    </div>
    <p class="maria-project-note"><strong>Critério:</strong> cada município recebe uma patrulha fixa com três policiais. Os mesmos três policiais trabalham de segunda a sexta e folgam no sábado e domingo; portanto, não há multiplicação do efetivo pelos cinco dias úteis. Reserva técnica para férias, licenças ou substituições ainda não foi incorporada. Como as opções 1 e 2 são alternativas, o impacto consolidado é de ${projectedProjectTotal.toLocaleString('pt-BR')} policiais para a opção selecionada; os dois modelos não são somados entre si.</p>`;
}

function renderMariaDaPenhaStudy() {
  const study = workforceProjectStudies.find((item) => item.key === 'mariaPenhaPog');
  const options = mariaDaPenhaProjects.map((project, index) => `
    <button class="maria-project-option${index === 0 ? ' is-active' : ''}" type="button" data-maria-project="${project.id}" aria-pressed="${index === 0}">
      <span>PROJETO MARIA DA PENHA</span>
      <strong>${project.name}</strong>
      <small>${project.cities.length ? `${project.cities.length * 3} policiais para ${project.cities.length} municípios` : project.status}</small>
    </button>`).join('');
  return `
    <div class="project-study-panel" id="projectStudyPanel-mariaPenhaPog" data-project-study-panel="mariaPenhaPog" role="tabpanel" aria-labelledby="projectStudyTab-mariaPenhaPog" hidden>
      ${renderProjectStudySummary(study.key)}
      <section class="detail-section maria-project-section">
        <div class="detail-section-heading">
          <div><h3>Escolha uma opção do projeto</h3><p>As opções 1 e 2 permanecem separadas para facilitar a leitura e a futura memória de cálculo.</p></div>
          <span>Maria da Penha - POG</span>
        </div>
        <div class="maria-project-options">${options}</div>
        <div class="maria-project-detail" id="mariaProjectDetail" aria-live="polite">${buildMariaDaPenhaProjectDetail('opcao1')}</div>
      </section>
    </div>`;
}

function selectMariaDaPenhaProject(projectId) {
  const detail = document.querySelector('#mariaProjectDetail');
  if (!detail) return;
  metricDetailContent.querySelectorAll('[data-maria-project]').forEach((button) => {
    const isActive = button.dataset.mariaProject === projectId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  detail.innerHTML = buildMariaDaPenhaProjectDetail(projectId);
}

function renderProjectBreakdown(data, detailKey) {
  if (data.hideBreakdown) return '';
  const rows = data.breakdown.map(([label, share, value, rowColor]) => {
    const hasTerritory = ['pog', 'restructuring'].includes(detailKey) && getPogTerritory(label);
    const breakdownLabel = hasTerritory
      ? `<span class="detail-breakdown-label"><strong>${formatPogUnitName(label)}</strong></span>`
      : `<span>${label}</span>`;
    return `
      <div class="detail-breakdown-row">
        ${breakdownLabel}
        <div class="detail-breakdown-track"><i style="width:${share}%;--row-color:${rowColor}"></i></div>
        <strong>${value}</strong>
      </div>`;
  }).join('');
  return `
    <section class="detail-section">
      <div class="detail-section-heading"><div><h3>${data.breakdownTitle || 'Composição do indicador'}</h3><p>${data.breakdownSubtitle || 'Participação de cada componente no total ou no recorte analisado.'}</p></div><span>Leitura percentual</span></div>
      <div class="detail-breakdown">${rows}</div>
    </section>`;
}

function renderExitUnitScope(data) {
  const scope = data.unitScope;
  if (!scope) return '';
  const summary = scope.summary.map(([label, value, note]) => `
    <div class="exit-unit-summary-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>`).join('');
  const unitLists = scope.unitLists.map(([title, units]) => `
    <div class="exit-unit-list">
      <strong>${title}</strong>
      <div>${units.map((unit) => `<span>${unit}</span>`).join('')}</div>
    </div>`).join('');
  return `
    <section class="detail-section exit-unit-scope-section">
      <div class="detail-section-heading">
        <div><h3>Unidades administrativas e operacionais</h3><p>Classificação exclusiva deste estudo, sem alterar os cálculos ou as tabelas dos demais cards.</p></div>
        <span>Recorte por natureza da OPM</span>
      </div>
      <div class="exit-unit-summary-grid">${summary}</div>
      <div class="exit-unit-lists">${unitLists}</div>
      ${renderDetailTable(scope, 'exits')}
    </section>`;
}

function renderProjectPogTable(data) {
  return `
    <section class="detail-section">
      <div class="detail-section-heading"><div><h3>${data.sectionTitle}</h3><p>${data.sectionSubtitle}</p></div><span>Dados discriminados</span></div>
      ${renderDetailTable(data, 'pog')}
    </section>`;
}

function renderWorkforceProjectDetail() {
  const overview = workforceProjectOverview;
  const pog = metricDetails.pog;
  const raio = metricDetails.raio;
  const copac = metricDetails.copac;
  metricModal.style.setProperty('--detail-accent', overview.accent);
  metricDialog.dataset.detail = 'pog';
  metricDetailContent.dataset.detail = 'pog';
  metricDetailEyebrow.textContent = overview.eyebrow;
  metricDetailTitle.textContent = overview.title;
  metricDetailContent.innerHTML = `
    <p id="metricDetailDescription" hidden>Detalhamento dos quatro eixos do Projeto de Efetivo 2027–2030.</p>
    ${renderProjectStudySelector()}
    <div class="project-study-panel" id="projectStudyPanel-pog" data-project-study-panel="pog" role="tabpanel" aria-labelledby="projectStudyTab-pog">
      ${renderProjectStudySummary('pog')}
      ${renderPogDeficitOverview(pog)}
      ${renderProjectPogTable(pog)}
      ${renderPogImplementations(pog)}
      <p class="detail-methodology">${pog.note}</p>
    </div>
    <div class="project-study-panel" id="projectStudyPanel-raio" data-project-study-panel="raio" role="tabpanel" aria-labelledby="projectStudyTab-raio" hidden>
      ${renderProjectStudySummary('raio')}
      ${renderRaioLevelSelector(raio)}
      ${renderProjectBreakdown(raio, 'raio')}
      <p class="detail-methodology">${raio.note}</p>
    </div>
    <div class="project-study-panel" id="projectStudyPanel-copac" data-project-study-panel="copac" role="tabpanel" aria-labelledby="projectStudyTab-copac" hidden>
      ${renderProjectStudySummary('copac')}
      ${renderCopacPhaseSelector(copac)}
      ${renderProjectBreakdown(copac, 'copac')}
      ${renderCopacResources(copac)}
      <p class="detail-methodology">${copac.note}</p>
    </div>
    ${renderMariaDaPenhaStudy()}`;
}

function selectProjectStudy(studyKey) {
  const selectedPanel = metricDetailContent.querySelector(`[data-project-study-panel="${studyKey}"]`);
  if (!selectedPanel) return;
  metricDetailContent.querySelectorAll('[data-project-study]').forEach((button) => {
    const isActive = button.dataset.projectStudy === studyKey;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  metricDetailContent.querySelectorAll('[data-project-study-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.projectStudyPanel !== studyKey;
  });
  metricDetailContent.dataset.projectStudy = studyKey;
}

function renderMetricDetail(key) {
  if (key === 'pog') {
    renderWorkforceProjectDetail();
    return;
  }
  const data = metricDetails[key];
  if (!data) return;
  metricModal.style.setProperty('--detail-accent', data.accent);
  metricDialog.dataset.detail = key;
  metricDetailContent.dataset.detail = key;
  metricDetailEyebrow.textContent = data.eyebrow;
  metricDetailTitle.textContent = data.title;
  const stats = data.stats.map(([label, value, note]) => `<div class="detail-stat"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
  const breakdown = data.breakdown.map(([label, share, value, rowColor]) => {
    const hasTerritory = ['pog', 'restructuring'].includes(key) && getPogTerritory(label);
    const breakdownLabel = hasTerritory
      ? `<span class="detail-breakdown-label"><strong>${formatPogUnitName(label)}</strong></span>`
      : `<span>${label}</span>`;
    return `
    <div class="detail-breakdown-row">
      ${breakdownLabel}
      <div class="detail-breakdown-track"><i style="width:${share}%;--row-color:${rowColor}"></i></div>
      <strong>${value}</strong>
    </div>`;
  }).join('');
  const breakdownSection = data.hideBreakdown ? '' : `
    <section class="detail-section">
      <div class="detail-section-heading"><div><h3>${data.breakdownTitle || 'Composição do indicador'}</h3><p>${data.breakdownSubtitle || 'Participação de cada componente no total ou no recorte analisado.'}</p></div><span>Leitura percentual</span></div>
      <div class="detail-breakdown">${breakdown}</div>
    </section>`;
  const levelSelector = key === 'raio' ? renderRaioLevelSelector(data) : '';
  const copacPhaseSelector = key === 'copac' ? renderCopacPhaseSelector(data) : '';
  const pogDeficitOverview = key === 'pog' ? renderPogDeficitOverview(data) : '';
  const pogImplementations = key === 'pog' ? renderPogImplementations(data) : '';
  const restructuringUnitExplorer = key === 'restructuring' ? renderRestructuringUnitExplorer(data) : '';
  const restructuringTopFive = key === 'restructuring' ? renderRestructuringTopFive(data) : '';
  const copacResources = key === 'copac' ? renderCopacResources(data) : '';
  const battalionSortControls = key === 'battalions' ? renderBattalionSortControls() : '';
  const exitUnitScope = key === 'exits' ? renderExitUnitScope(data) : '';
  const detailTable = renderDetailTable(data, key);
  const discriminatedHeading = key === 'battalions'
    ? `<div class="detail-section-heading"><div><h3>${data.sectionTitle}</h3></div></div>`
    : `<div class="detail-section-heading"><div><h3>${data.sectionTitle}</h3><p>${data.sectionSubtitle}</p></div><span>Dados discriminados</span></div>`;
  const discriminatedTable = ['exits', 'raio', 'copac'].includes(key) ? '' : `
    <section class="detail-section">
      ${discriminatedHeading}
      ${battalionSortControls}
      ${key === 'battalions' ? `<div id="battalionTableResult">${detailTable}</div>` : detailTable}
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
    ${copacPhaseSelector}
    ${pogDeficitOverview}
    ${restructuringUnitExplorer}
    ${restructuringTopFive}
    ${breakdownSection}
    ${exitUnitScope}
    ${copacResources}
    ${discriminatedTable}
    ${pogImplementations}
    ${data.note ? `<p class="detail-methodology">${data.note}</p>` : ''}`;
  if (key === 'restructuring') renderRestructuringUnitDetail('33º BPM');
}

function openMetricDetail(card) {
  detailTrigger = card;
  renderMetricDetail(card.dataset.detail);
  metricCards.forEach((item) => item.setAttribute('aria-expanded', item === card ? 'true' : 'false'));
  metricModal.classList.add('is-open');
  metricModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => metricDetailBack.focus());
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

metricDetailBack.addEventListener('click', closeMetricDetail);
metricModal.querySelector('[data-modal-close]').addEventListener('click', closeMetricDetail);
metricDetailContent.addEventListener('click', (event) => {
  const projectStudyButton = event.target.closest('[data-project-study]');
  if (projectStudyButton) selectProjectStudy(projectStudyButton.dataset.projectStudy);
  const mariaProjectButton = event.target.closest('[data-maria-project]');
  if (mariaProjectButton) selectMariaDaPenhaProject(mariaProjectButton.dataset.mariaProject);
  const raioButton = event.target.closest('[data-raio-level]');
  if (raioButton) renderRaioLevelDetail(raioButton.dataset.raioLevel);
  const copacButton = event.target.closest('[data-copac-phase]');
  if (copacButton) renderCopacPhaseDetail(copacButton.dataset.copacPhase);
  const battalionSortButton = event.target.closest('[data-battalion-sort]');
  if (battalionSortButton) {
    const field = battalionSortButton.dataset.battalionSort;
    if (field !== battalionSortState.field) {
      battalionSortState.field = field;
      battalionSortState.direction = ['battalionStrength', 'exonerations', 'dismissals', 'requiredPromotions', 'restructuringNeed', 'totalNeed'].includes(field) ? 'desc' : 'asc';
    }
    updateBattalionTable();
  }
  const battalionDirectionButton = event.target.closest('[data-battalion-direction]');
  if (battalionDirectionButton) {
    battalionSortState.direction = battalionSortState.direction === 'asc' ? 'desc' : 'asc';
    updateBattalionTable();
  }
});
metricDetailContent.addEventListener('keydown', (event) => {
  const projectStudyButton = event.target.closest('[data-project-study]');
  if (!projectStudyButton || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const buttons = [...metricDetailContent.querySelectorAll('[data-project-study]')];
  const currentIndex = buttons.indexOf(projectStudyButton);
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? buttons.length - 1
      : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
  event.preventDefault();
  buttons[nextIndex].focus();
  selectProjectStudy(buttons[nextIndex].dataset.projectStudy);
});
metricDetailContent.addEventListener('change', (event) => {
  if (event.target.matches('#restructuringUnitSelect')) {
    renderRestructuringUnitDetail(event.target.value);
  }
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
setInterval(updateDateTime, 30000);
