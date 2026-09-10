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
  renderHorizontalBars('#opmOriginChart', originByOpm, 326, '#1b8258', true);
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
      ['Exonerações — outros concursos', 16.1, '88 · 16,1%', '#c1a253'],
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
    accent: '#216f4c',
    eyebrow: 'Memória de cálculo · POG + COTAM/BPTUR',
    title: '271 policiais entre déficit e implementação operacional',
    total: '271',
    unit: 'policiais',
    description: 'Indicador consolidado que reúne o déficit de 111 policiais nos BPMs do POG e a necessidade adicional de 160 policiais para implementação da COTAM e da 6ª Cia/BPTUR.',
    stats: [
      ['Bloco POG', '111', 'Déficit localizado nos BPMs territoriais'],
      ['Bloco COTAM/BPTUR', '160', 'Necessidade adicional para implementação'],
      ['Total consolidado', '271', '111 de déficit · 160 de implementação']
    ],
    hideBreakdown: true,
    breakdown: [],
    pogBreakdown: [
      ['12º BPM', 33.3, '37 · 33,3%', '#145c40'],
      ['8º BPM', 20.7, '23 · 20,7%', '#23794f'],
      ['22º BPM', 9.0, '10 · 9,0%', '#368a60'],
      ['26º BPM', 8.1, '9 · 8,1%', '#4c9b70'],
      ['5º BPM', 8.1, '9 · 8,1%', '#65aa82'],
      ['Demais 7 BPMs', 20.7, '23 · 20,7%', '#84b99a']
    ],
    implementationBreakdown: [
      ['Companhia Pronta-Resposta (COTAM)', 68.75, '110 · 68,8%', '#145c40'],
      ['6ª Cia/BPTUR · Cariri e Guaramiranga', 31.25, '50 · 31,3%', '#4c9b70']
    ],
    sectionTitle: 'Batalhões com maior saldo negativo',
    sectionSubtitle: 'Ranking das dez maiores perdas dentro do déficit acumulado de 111 policiais nos BPMs.',
    tableColumns: ['Posição', 'Batalhão', 'Origem', 'Destino', 'Participação', 'Saldo'],
    tableRows: [
      ['1', '12º BPM', '96', '59', '33,3%', '-37'], ['2', '8º BPM', '66', '43', '20,7%', '-23'],
      ['3', '22º BPM', '51', '41', '9,0%', '-10'], ['4', '26º BPM', '57', '48', '8,1%', '-9'],
      ['5', '5º BPM', '54', '45', '8,1%', '-9'], ['6', '23º BPM', '42', '34', '7,2%', '-8'],
      ['7', '17º BPM', '53', '49', '3,6%', '-4'], ['8', '24º BPM', '33', '29', '3,6%', '-4'],
      ['9', '27º BPM', '13', '10', '2,7%', '-3'], ['10', '11º BPM', '56', '54', '1,8%', '-2']
    ],
    implementationSectionTitle: 'Efetivo para implementação da COTAM e da 6ª Cia/BPTUR',
    implementationSectionSubtitle: 'Distribuição adicional entre oficiais e praças nas duas estruturas operacionais.',
    implementationTableColumns: ['Posição', 'Implementação', 'Área de atuação', 'Oficiais', 'Praças', 'Necessidade'],
    implementationTableRows: [
      ['1', 'Companhia Pronta-Resposta (COTAM)', 'Pronta resposta', '10', '100', '110'],
      ['2', '6ª Cia/BPTUR', 'Cariri · Pelotão destacado em Guaramiranga', '02', '48', '50'],
      ['—', 'Total da implementação', 'Duas estruturas operacionais', '12', '148', '160']
    ],
    units: [
      ['10º BPM', 9, 27, 18], ['11º BPM', 56, 54, -2], ['12º BPM', 96, 59, -37],
      ['13º BPM', 17, 28, 11], ['14º BPM', 45, 51, 6], ['15º BPM', 38, 37, -1],
      ['16º BPM', 103, 106, 3], ['17º BPM', 53, 49, -4], ['18º BPM', 77, 85, 8],
      ['19º BPM', 57, 70, 13], ['1º BPM', 27, 50, 23], ['20º BPM', 76, 80, 4],
      ['21º BPM', 81, 84, 3], ['22º BPM', 51, 41, -10], ['23º BPM', 42, 34, -8],
      ['24º BPM', 33, 29, -4], ['25º BPM', 46, 45, -1], ['26º BPM', 57, 48, -9],
      ['27º BPM', 13, 10, -3], ['28º BPM', 14, 19, 5], ['29º BPM', 28, 28, 0],
      ['2º BPM', 50, 78, 28], ['30º BPM', 16, 22, 6], ['31º BPM', 10, 22, 12],
      ['32º BPM', 8, 17, 9], ['33º BPM', 6, 18, 12], ['34º BPM', 14, 15, 1],
      ['3º BPM', 76, 79, 3], ['4º BPM', 21, 21, 0], ['5º BPM', 54, 45, -9],
      ['6º BPM', 43, 47, 4], ['7º BPM', 34, 37, 3], ['8º BPM', 66, 43, -23],
      ['9º BPM', 42, 71, 29]
    ],
    territories: {
      '1º BPM': ['Russas', 'Limoeiro'], '2º BPM': ['Juazeiro do Norte', 'Missão Velha'], '3º BPM': ['Sobral', 'Coreaú'], '4º BPM': ['Canindé', 'Boa Viagem'],
      '5º BPM': ['Centro', 'Carlito Pamplona'], '6º BPM': ['Parangaba', 'Bairro de Fátima'], '7º BPM': ['Crateús', 'Santa Quitéria'], '8º BPM': ['Aldeota', 'Vicente Pinzón'],
      '9º BPM': ['Quixadá', 'Senador Pompeu'], '10º BPM': ['Iguatu', 'Acopiara'], '11º BPM': ['Itapipoca', 'Acaraú'], '12º BPM': ['Caucaia (Centro · Cumbuco)'],
      '13º BPM': ['Tauá', 'Mombaça'], '14º BPM': ['Maracanaú (Jereissati · Acaracuzinho)'], '15º BPM': ['Eusébio', 'Aquiraz'], '16º BPM': ['Messejana', 'Jangurussu'],
      '17º BPM': ['Conjunto Ceará', 'Bom Jardim'], '18º BPM': ['Antônio Bezerra', 'Parquelândia'], '19º BPM': ['Cambeba', 'Aerolândia'], '20º BPM': ['Pirambu', 'Barra do Ceará'],
      '21º BPM': ['Conjunto Esperança', 'Maraponga'], '22º BPM': ['Papicu', 'Dionísio Torres'], '23º BPM': ['Paracuru', 'São Gonçalo do Amarante'], '24º BPM': ['Maranguape', 'Pacatuba'],
      '25º BPM': ['Horizonte', 'Chorozinho'], '26º BPM': ['Caucaia (Jurema · Nova Metrópole)'], '27º BPM': ['Tianguá', 'Viçosa do Ceará'], '28º BPM': ['Camocim', 'Granja'],
      '29º BPM': ['Baturité', 'Redenção'], '30º BPM': ['Aracati', 'Beberibe'], '31º BPM': ['Jaguaribe', 'Alto Santo'], '32º BPM': ['Penaforte', 'Brejo Santo'],
      '33º BPM': ['Campos Sales', 'Assaré'], '34º BPM': ['Icó', 'Várzea Alegre']
    },
    note: 'O total de 271 reúne duas naturezas distintas: 111 policiais de déficit acumulado nos 12 BPMs do POG com saldo negativo e 160 policiais de necessidade adicional para implementação operacional. No POG, o recorte apresenta exclusivamente os 34 BPMs numerados, com 1.459 registros na origem, 1.549 no destino e saldo conjunto de +90. Comandos regionais e demais unidades foram retirados, pois a fonte não permite redistribuir seus registros entre batalhões. Para a implementação, foram informados 10 oficiais e 100 praças para a COTAM e 02 oficiais e 48 praças para a 6ª Cia/BPTUR. Os 160 policiais não foram descontados nem redistribuídos dos batalhões analisados.'
  },
  restructuring: {
    accent: '#557c45',
    eyebrow: 'Memória de cálculo · interior e litoral',
    title: '521 policiais necessários para a reestruturação do interior e do litoral',
    total: '521',
    unit: 'policiais',
    description: 'Efetivo inteiro necessário para que os oito batalhões do interior abaixo da média alcancem a referência dos respectivos comandos. O resultado matemático de 520,5 foi arredondado para cima.',
    stats: [
      ['Abaixo da média', '8 BPM', '88,9% dos batalhões analisados'],
      ['Acima da média', '1 BPM', '29º BPM — Baturité · Redenção · 12,3 acima da média'],
      ['Base matemática', '520,5', 'Resultado das médias · arredondado para 521 policiais']
    ],
    breakdownTitle: 'Concentração do saldo por batalhão',
    breakdownSubtitle: 'Participação de cada BPM no saldo acumulado de 520,5 policiais.',
    hideBreakdown: true,
    breakdown: [
      ['33º BPM', 22.2, '115,5 · 22,2%', '#145c40'],
      ['28º BPM', 18.3, '95,25 · 18,3%', '#23794f'],
      ['31º BPM', 17.1, '89,25 · 17,1%', '#3d9065'],
      ['27º BPM', 12.2, '63,25 · 12,2%', '#65a982'],
      ['Demais 4 BPM', 30.2, '157,25 · 30,2%', '#83b99a']
    ],
    units: [
      ['33º BPM', 138, 253.5, 115.5],
      ['28º BPM', 202, 297.25, 95.25],
      ['31º BPM', 168, 257.25, 89.25],
      ['27º BPM', 234, 297.25, 63.25],
      ['34º BPM', 202, 253.5, 51.5],
      ['26º BPM', 294, 335, 41],
      ['30º BPM', 217, 257.25, 40.25],
      ['32º BPM', 229, 253.5, 24.5],
      ['29º BPM', 281, 268.6666666667, -12.3333333333]
    ],
    sectionTitle: 'Batalhões ordenados pelo maior saldo',
    sectionSubtitle: 'Efetivo atual comparado à média do respectivo comando.',
    tableColumns: ['Posição', 'Batalhão / cidade', 'Efetivo atual', 'Média do comando', 'Situação', 'Saldo'],
    tableRows: [
      ['1', '33º BPM', '138', '253,5', 'Abaixo da média', '115,5'],
      ['2', '28º BPM', '202', '297,25', 'Abaixo da média', '95,25'],
      ['3', '31º BPM', '168', '257,25', 'Abaixo da média', '89,25'],
      ['4', '27º BPM', '234', '297,25', 'Abaixo da média', '63,25'],
      ['5', '34º BPM', '202', '253,5', 'Abaixo da média', '51,5'],
      ['6', '26º BPM', '294', '335', 'Abaixo da média', '41'],
      ['7', '30º BPM', '217', '257,25', 'Abaixo da média', '40,25'],
      ['8', '32º BPM', '229', '253,5', 'Abaixo da média', '24,5'],
      ['9', '29º BPM', '281', '268,67', 'Acima da média', '-12,33']
    ],
    note: 'Fonte: aba “Resumo Executivo” da planilha de reestruturação do efetivo das unidades criadas. Foram excluídas as quatro unidades vinculadas ao CPRAIO: 6º, 7º, 8º e 9º BPRAIO. O saldo corresponde à média do comando menos o efetivo atual. A soma matemática é 520,5; como efetivo representa pessoas inteiras, o card adota 521 policiais, com arredondamento para cima. Os nove batalhões somam 1.965 policiais no efetivo atual.'
  },
  battalions: {
    accent: '#145c40',
    eyebrow: 'Análise consolidada · batalhões',
    title: 'Análise geral efetivo dos batalhões',
    total: '34',
    unit: 'batalhões analisados',
    description: 'Visão geral dos 34 BPMs territoriais no estudo de movimentações, complementada pelo recorte de efetivo atual e saldo dos nove batalhões do interior.',
    stats: [
      ['Saldo conjunto', '+90', '1.549 registros no destino menos 1.459 na origem'],
      ['Déficit localizado', '111', 'Soma das perdas dos 12 BPMs com saldo negativo'],
      ['Reestruturação interior e litoral', '521', 'Efetivo necessário nos oito batalhões abaixo da média']
    ],
    breakdownTitle: 'Situação dos 34 batalhões nas movimentações',
    breakdownSubtitle: 'Distribuição dos BPMs conforme o saldo entre registros de destino e origem.',
    breakdown: [
      ['Ganho líquido', 58.82, '20 · 58,8%', '#145c40'],
      ['Perda líquida', 35.29, '12 · 35,3%', '#3d9065'],
      ['Em equilíbrio', 5.88, '2 · 5,9%', '#83b99a']
    ],
    sectionTitle: 'Visão geral por batalhão',
    sectionSubtitle: 'Os 34 BPMs estão ordenados da maior perda para o maior ganho no período analisado.',
    tableColumns: ['Posição', 'Batalhão / cidades', 'Origem', 'Destino', 'Situação', 'Saldo'],
    tableRows: [],
    note: 'A tabela apresenta movimentações, e não o efetivo atual completo dos 34 BPMs. O PDF consolidado permite calcular origem, destino e saldo por batalhão, mas não contém o efetivo existente em cada unidade. A informação de efetivo atual está disponível apenas no recorte dos nove batalhões do interior e do litoral da aba “Resumo Executivo”, que totaliza 1.965 policiais e sustenta o indicador de 521 policiais necessários para reestruturação.'
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

metricDetails.battalions.tableRows = [...metricDetails.pog.units]
  .sort((a, b) => a[3] - b[3] || a[0].localeCompare(b[0], 'pt-BR', { numeric: true }))
  .map(([name, origin, destination, balance], index) => [
    String(index + 1),
    name,
    String(origin),
    String(destination),
    balance < 0 ? 'Perda líquida' : balance > 0 ? 'Ganho líquido' : 'Equilíbrio',
    balance > 0 ? `+${balance}` : String(balance)
  ]);

const metricModal = document.querySelector('#metricDetailModal');
const metricDialog = metricModal.querySelector('.metric-dialog');
const metricDetailTitle = document.querySelector('#metricDetailTitle');
const metricDetailEyebrow = document.querySelector('#metricDetailEyebrow');
const metricDetailContent = document.querySelector('#metricDetailContent');
const metricDetailClose = document.querySelector('#metricDetailClose');
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

function renderDetailTable(data, detailKey = '') {
  const head = data.tableColumns.map((column) => `<th scope="col">${column}</th>`).join('');
  const rows = data.tableRows.map((row) => `<tr>${row.map((cell, index) => {
    const content = ['pog', 'restructuring', 'battalions'].includes(detailKey) && index === 1 ? renderPogUnitLabel(cell) : cell;
    return `<td>${content}</td>`;
  }).join('')}</tr>`).join('');
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

function renderPogUnitExplorer(data) {
  const options = [...data.units]
    .sort((a, b) => a[0].localeCompare(b[0], 'pt-BR', { numeric: true }))
    .map(([name]) => `<option value="${name}"${name === '12º BPM' ? ' selected' : ''}>${formatPogUnitName(name)}</option>`)
    .join('');
  return `
    <section class="detail-section pog-unit-section">
      <div class="detail-section-heading">
        <div><h3>Consultar perdas por batalhão</h3><p>Selecione um dos 34 BPMs para discriminar saídas, entradas, saldo e perda líquida.</p></div>
        <span>Consulta individual</span>
      </div>
      <label class="pog-unit-control" for="pogUnitSelect">
        <span>Batalhão</span>
        <select id="pogUnitSelect">${options}</select>
      </label>
      <div class="pog-unit-result" id="pogUnitResult" aria-live="polite"></div>
    </section>`;
}

function renderPogUnitDetail(unitName) {
  const unit = metricDetails.pog.units.find(([name]) => name === unitName);
  const result = document.querySelector('#pogUnitResult');
  if (!unit || !result) return;
  const [name, exits, entries, balance] = unit;
  const netLoss = Math.max(0, -balance);
  const status = balance < 0 ? 'Perda líquida' : balance > 0 ? 'Ganho líquido' : 'Equilíbrio';
  const statusClass = balance < 0 ? 'is-loss' : balance > 0 ? 'is-gain' : 'is-balanced';
  const signedBalance = balance > 0 ? `+${balance}` : String(balance);
  const share = netLoss ? `${(netLoss / 111 * 100).toFixed(1).replace('.', ',')}% do déficit acumulado` : 'Não compõe o déficit acumulado';
  const sourceNote = 'O PDF fornece totais consolidados por BPM. Ele não identifica o militar nem o pareamento individual entre unidade de origem e unidade de destino. Comandos regionais e demais unidades não integram este recorte por batalhão.';
  result.innerHTML = `
    <div class="pog-unit-result-heading">
      <div><span>Batalhão selecionado</span><strong>${formatPogUnitName(name)}</strong></div>
      <b class="${statusClass}">${status}</b>
    </div>
    <div class="pog-unit-values">
      <div><span>Saídas registradas</span><strong>${exits.toLocaleString('pt-BR')}</strong><small>Total lançado na coluna Origem</small></div>
      <div><span>Entradas registradas</span><strong>${entries.toLocaleString('pt-BR')}</strong><small>Total lançado na coluna Destino</small></div>
      <div><span>Saldo da unidade</span><strong>${signedBalance}</strong><small>${entries} entradas − ${exits} saídas</small></div>
      <div class="${netLoss ? 'is-loss' : ''}"><span>Perda líquida</span><strong>${netLoss}</strong><small>${share}</small></div>
    </div>
    <p class="pog-unit-source-note">${sourceNote}</p>`;
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
  return `
    <section class="detail-section pog-separated-section pog-deficit-overview-section">
      <div class="pog-separated-heading">
        <span>Bloco 01 · Déficit de efetivo</span>
        <h3>POG — Policiamento Ostensivo Geral</h3>
        <p>Atendimento de ocorrências e maior visibilidade à sociedade</p>
      </div>
      <div class="pog-separated-content">
        <div class="pog-separated-kpis">
          <div><span>Déficit localizado</span><strong>111</strong><small>policiais</small></div>
          <div><span>BPMs analisados</span><strong>34</strong><small>batalhões territoriais</small></div>
          <div><span>Saldo negativo</span><strong>12</strong><small>BPMs com perda líquida</small></div>
          <div><span>Demais situações</span><strong>22</strong><small>20 com ganho · 2 em equilíbrio</small></div>
        </div>
        <div class="pog-separated-breakdown">
          <div class="detail-section-heading">
            <div><h3>Concentração do déficit do POG</h3><p>Participação dos batalhões no déficit localizado de 111 policiais.</p></div>
            <span>Somente POG</span>
          </div>
          <div class="detail-breakdown">${renderPogBreakdown(data.pogBreakdown)}</div>
        </div>
      </div>
    </section>`;
}

function renderPogImplementations(data) {
  return `
    <section class="detail-section pog-separated-section pog-implementation-section">
      <div class="pog-separated-heading">
        <span>Bloco 02 · Necessidade de implementação</span>
        <h3>Companhia Pronta-Resposta (COTAM) + BPTUR</h3>
        <p>Cariri e Guaramiranga · efetivo adicional para duas estruturas operacionais</p>
      </div>
      <div class="pog-separated-content">
        <div class="pog-separated-kpis">
          <div><span>Necessidade total</span><strong>160</strong><small>policiais adicionais</small></div>
          <div><span>Oficiais</span><strong>12</strong><small>10 COTAM · 02 BPTUR</small></div>
          <div><span>Praças</span><strong>148</strong><small>100 COTAM · 48 BPTUR</small></div>
        </div>
        <div class="pog-separated-breakdown">
          <div class="detail-section-heading">
            <div><h3>${data.implementationSectionTitle}</h3><p>${data.implementationSectionSubtitle}</p></div>
            <span>Somente COTAM/BPTUR</span>
          </div>
          <div class="detail-breakdown">${renderPogBreakdown(data.implementationBreakdown)}</div>
        </div>
        ${renderDetailTable({
          tableColumns: data.implementationTableColumns,
          tableRows: data.implementationTableRows
        }, 'pog')}
      </div>
    </section>`;
}

function renderBattalionRankings() {
  const units = metricDetails.pog.units;
  const rankingGroups = [
    {
      title: 'Top 5 maiores perdas líquidas',
      subtitle: '88 dos 111 policiais do déficit localizado',
      total: 111,
      rows: [...units].filter(([, , , balance]) => balance < 0).sort((a, b) => a[3] - b[3]).slice(0, 5)
    },
    {
      title: 'Top 5 maiores ganhos líquidos',
      subtitle: '111 dos 201 policiais recebidos acima das saídas',
      total: 201,
      rows: [...units].filter(([, , , balance]) => balance > 0).sort((a, b) => b[3] - a[3]).slice(0, 5)
    }
  ];
  const groups = rankingGroups.map((group) => {
    const rows = group.rows.map(([name, , , balance], index) => {
      const value = Math.abs(balance);
      const share = (value / group.total * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      return `
        <div class="battalion-rank-row">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${formatPogUnitName(name)}</strong>
          <b>${balance > 0 ? '+' : '−'}${value}<small>${share}%</small></b>
        </div>`;
    }).join('');
    return `
      <div class="battalion-rank-card">
        <div><strong>${group.title}</strong><span>${group.subtitle}</span></div>
        <div class="battalion-rank-list">${rows}</div>
      </div>`;
  }).join('');
  return `
    <section class="detail-section battalion-ranking-section">
      <div class="detail-section-heading">
        <div><h3>Concentração das movimentações por batalhão</h3><p>Unidades com os maiores saldos negativos e positivos no período analisado.</p></div>
        <span>Ranking comparativo</span>
      </div>
      <div class="battalion-rank-grid">${groups}</div>
    </section>`;
}

function renderBattalionStructuralStudy() {
  const units = metricDetails.restructuring.units;
  const currentTotal = units.reduce((sum, [, current]) => sum + current, 0);
  const referenceTotal = units.reduce((sum, [, , reference]) => sum + reference, 0);
  const coverage = currentTotal / referenceTotal * 100;
  const formatNumber = (value, digits = 2) => value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: digits });
  const summary = [
    ['Batalhões no recorte', '9', 'Unidades do interior com efetivo atual disponível'],
    ['Efetivo atual', formatNumber(currentTotal, 0), 'Soma do efetivo das nove unidades'],
    ['Referência agregada', formatNumber(referenceTotal), 'Soma das médias dos respectivos comandos'],
    ['Cobertura da referência', `${formatNumber(coverage, 1)}%`, 'Relação entre o efetivo atual e a referência agregada']
  ].map(([label, value, note]) => `<div><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
  const rows = [...units]
    .sort((a, b) => b[3] - a[3])
    .map(([name, current, reference, difference], index) => [
      String(index + 1),
      name,
      formatNumber(current, 0),
      formatNumber(reference),
      `${formatNumber(current / reference * 100, 1)}%`,
      formatNumber(difference)
    ]);
  return `
    <section class="detail-section battalion-structural-section">
      <div class="detail-section-heading">
        <div><h3>Recorte estrutural dos batalhões do interior</h3><p>Efetivo atual comparado à média de referência nas nove unidades com dados disponíveis.</p></div>
        <span>1.965 policiais atuais</span>
      </div>
      <div class="battalion-structural-summary">${summary}</div>
      ${renderDetailTable({
        tableColumns: ['Posição', 'Batalhão / cidades', 'Efetivo atual', 'Média de referência', 'Cobertura', 'Saldo calculado'],
        tableRows: rows
      }, 'battalions')}
      <p class="battalion-rounding-note"><strong>Leitura do planejamento:</strong> a soma dos saldos positivos é 520,5. O painel apresenta 521 policiais necessários após arredondamento do total para cima.</p>
    </section>`;
}

function renderRestructuringUnitExplorer(data) {
  const options = data.units.map(([name]) => `<option value="${name}"${name === '33º BPM' ? ' selected' : ''}>${formatPogUnitName(name)}</option>`).join('');
  return `
    <section class="detail-section restructuring-unit-section">
      <div class="detail-section-heading">
        <div><h3>Consultar detalhamento por batalhão</h3><p>Selecione um dos nove BPMs para comparar efetivo atual, média, saldo e cobertura.</p></div>
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
  const [name, current, reference, difference] = unit;
  const coverage = current / reference * 100;
  const belowAverage = difference > 0;
  const status = belowAverage ? 'Abaixo da média' : 'Acima da média';
  const statusClass = belowAverage ? 'is-loss' : 'is-gain';
  const formatNumber = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const share = belowAverage ? difference / 520.5 * 100 : 0;
  const interpretation = belowAverage
    ? `Necessidade de ${formatNumber(difference)} policiais para alcançar a média de referência. O batalhão representa ${formatNumber(share)}% do saldo acumulado de 520,5.`
    : `O efetivo atual está ${formatNumber(Math.abs(difference))} policiais acima da média de referência e não compõe o saldo acumulado.`;
  result.innerHTML = `
    <div class="pog-unit-result-heading">
      <div><span>Batalhão selecionado</span><strong>${formatPogUnitName(name)}</strong></div>
      <b class="${statusClass}">${status}</b>
    </div>
    <div class="pog-unit-values">
      <div><span>Efetivo atual</span><strong>${formatNumber(current)}</strong><small>Policiais registrados na unidade</small></div>
      <div><span>Média de referência</span><strong>${formatNumber(reference)}</strong><small>Média informada na aba Resumo Executivo</small></div>
      <div class="${belowAverage ? 'is-loss' : ''}"><span>Saldo</span><strong>${formatNumber(difference)}</strong><small>Média menos efetivo atual</small></div>
      <div><span>Cobertura da média</span><strong>${formatNumber(coverage)}%</strong><small>Efetivo atual em relação à referência</small></div>
    </div>
    <p class="pog-unit-source-note">${interpretation}</p>`;
}

function renderRestructuringTopFive(data) {
  const rankedUnits = [...data.units]
    .filter(([, , , difference]) => difference > 0)
    .sort((a, b) => b[3] - a[3])
    .slice(0, 5);
  const maximum = rankedUnits[0][3];
  const rows = rankedUnits.map(([name, , , difference], index) => {
    const width = difference / maximum * 100;
    const share = difference / 520.5 * 100;
    const formattedDifference = difference.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
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
        <div><h3>Top 5 maiores saldos</h3><p>Batalhões que concentram as maiores diferenças entre o efetivo atual e a média de referência.</p></div>
        <span>79,7% do saldo</span>
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

function renderMetricDetail(key) {
  const data = metricDetails[key];
  if (!data) return;
  metricModal.style.setProperty('--detail-accent', data.accent);
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
  const pogUnitExplorer = key === 'pog' ? renderPogUnitExplorer(data) : '';
  const pogImplementations = key === 'pog' ? renderPogImplementations(data) : '';
  const battalionRankings = key === 'battalions' ? renderBattalionRankings() : '';
  const battalionStructuralStudy = key === 'battalions' ? renderBattalionStructuralStudy() : '';
  const restructuringUnitExplorer = key === 'restructuring' ? renderRestructuringUnitExplorer(data) : '';
  const restructuringTopFive = key === 'restructuring' ? renderRestructuringTopFive(data) : '';
  const copacResources = key === 'copac' ? renderCopacResources(data) : '';
  const discriminatedTable = ['raio', 'copac'].includes(key) ? '' : `
    <section class="detail-section">
      <div class="detail-section-heading"><div><h3>${data.sectionTitle}</h3><p>${data.sectionSubtitle}</p></div><span>Dados discriminados</span></div>
      ${renderDetailTable(data, key)}
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
    ${pogUnitExplorer}
    ${restructuringUnitExplorer}
    ${restructuringTopFive}
    ${breakdownSection}
    ${battalionRankings}
    ${battalionStructuralStudy}
    ${copacResources}
    ${discriminatedTable}
    ${pogImplementations}
    <p class="detail-methodology">${data.note}</p>`;
  if (key === 'pog') renderPogUnitDetail('12º BPM');
  if (key === 'restructuring') renderRestructuringUnitDetail('33º BPM');
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
  const raioButton = event.target.closest('[data-raio-level]');
  if (raioButton) renderRaioLevelDetail(raioButton.dataset.raioLevel);
  const copacButton = event.target.closest('[data-copac-phase]');
  if (copacButton) renderCopacPhaseDetail(copacButton.dataset.copacPhase);
});
metricDetailContent.addEventListener('change', (event) => {
  if (event.target.matches('#pogUnitSelect')) renderPogUnitDetail(event.target.value);
  if (event.target.matches('#restructuringUnitSelect')) renderRestructuringUnitDetail(event.target.value);
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
