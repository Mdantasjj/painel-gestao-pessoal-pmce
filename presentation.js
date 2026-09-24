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
    { name: 'Demissões · outros concursos', color: '#1b8258', values: [8, 2, 0, 7, 143, 76, 14, 2] },
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
    <div class="chart-source-note">A série mensal mostra 340 lançamentos brutos de 2026, antes da retirada de 12 duplicidades. O indicador geral usa os 328 registros deduplicados, mais 80 processos agregados de 2025 e 767 promoções requeridas de 2025–2026: 1.175 registros de fontes e naturezas diferentes.</div>`;
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
  renderHorizontalBars('#opmOriginChart', originByOpm, 232, '#1b8258', true);
  renderHorizontalBars('#cityOriginChart', originByCity, 326, '#3b7e9d');
}

const metricDetails = {
  exits: {
    accent: '#23845b',
    eyebrow: 'Memória de cálculo · perda de efetivo',
    title: '1.175 registros considerados na análise de perdas',
    total: '1.175',
    unit: 'registros considerados',
    description: 'Indicador combinado: 80 processos de demissão/exoneração relacionados a outros concursos informados para 2025, 328 saídas administrativas deduplicadas de 2026 também classificadas como outros concursos e 767 promoções requeridas de 2025–2026. Processo e promoção não comprovam baixa institucional nem pessoa única.',
    stats: [
      ['Demissões de 2025 · outros concursos', '16', 'Processos informados · sem OPM identificada'],
      ['Exonerações de 2025 · outros concursos', '64', 'Processos informados · sem OPM identificada'],
      ['Demissões de 2026 · outros concursos', '245', 'Registros deduplicados da base de 2026'],
      ['Exonerações de 2026 · outros concursos', '83', 'Registros deduplicados da base de 2026'],
      ['Requeridas de 2025', '552', '320 nos BPMs · 232 em outras OPMs'],
      ['Requeridas de 2026', '215', '110 nos BPMs · 105 em outras OPMs'],
      ['Impactos atribuídos aos 34 BPMs', '662', '232 saídas de 2026 · 430 requeridas; 2025 sem rateio']
    ],
    breakdown: [
      ['Demissões · outros concursos · processos 2025', 16 / 1175 * 100, '16 · 1,4%', '#145c40'],
      ['Exonerações · outros concursos · processos 2025', 64 / 1175 * 100, '64 · 5,4%', '#3d9065'],
      ['Demissões · outros concursos 2026', 245 / 1175 * 100, '245 · 20,9%', '#28734e'],
      ['Exonerações · outros concursos 2026', 83 / 1175 * 100, '83 · 7,1%', '#55a477'],
      ['Requeridas · 2025–2026', 767 / 1175 * 100, '767 · 65,3%', '#698342']
    ],
    sectionTitle: 'Conciliação dos registros considerados',
    sectionSubtitle: 'Os processos de 2025 são agregados por ano e não foram atribuídos a batalhões.',
    tableColumns: ['Etapa de validação', 'Exonerações · outros concursos', 'Demissões · outros concursos', 'Requeridas', 'Total'],
    tableRows: [
      ['Processos agregados de 2025', '64', '16', '0', '80'],
      ['Saídas deduplicadas de 2026', '83', '245', '0', '328'],
      ['Requeridas de 2025–2026', '0', '0', '767', '767'],
      ['Total combinado de registros', '147', '261', '767', '1.175'],
      ['Recorte atribuível aos 34 BPMs', '62', '170', '430', '662']
    ],
    note: 'A aba “total_demissao_exoneracao” da planilha “MOVIMENTAÇÕES PMS 2025 - 2026.xlsx” informa 16 processos de demissão e 64 de exoneração em 2025, total de 80. Ela não discrimina batalhão, data do ato ou confirmação do desligamento; por isso, os 80 entram apenas no total geral, sem alterar a necessidade calculada por BPM. A mesma aba traz um subtotal parcial de 2026 (12 demissões e 63 exonerações), que NÃO foi somado novamente: para 2026 prevalece a relação mais abrangente usada no estudo, com 340 lançamentos e 328 registros após retirar 12 duplicidades (245 demissões e 83 exonerações). A planilha de promoções por OPM contém 552 requeridas detalhadas em 2025 (458 acessos ao oficialato e 94 promoções de oficiais) e 215 em 2026 (153 acessos e 62 promoções de oficiais), somando 767. Em 2025, a célula rotulada TOTAL mostra 458 porque sua fórmula soma apenas a seção de subtenentes. Das 767 requeridas, 430 têm vínculo direto com os 34 BPMs (320 em 2025 e 110 em 2026), e 337 pertencem a outras OPMs. O total de 1.175 combina fontes e naturezas distintas, sem comprovação de pessoas únicas ou baixas institucionais. Dos registros de 2026, 232 pertencem aos BPMs e 96 ficam fora — 94 de outras OPMs e duas sem vínculo nominal extraível.'
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
      ['Déficit de efetivo do POG para as unidades especializadas', '111', 'Déficit localizado nos BPMs territoriais'],
      ['COTAM - Necessidade de efetivo pronta resposta', '110', '10 oficiais · 100 praças'],
      ['BPTUR (Cariri e Guaramiranga)', '50', '02 oficiais · 48 praças'],
      ['Total consolidado', '271', '111 POG · 110 COTAM · 50 BPTUR']
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
      '1º BPM': ['Russas', 'Limoeiro'], '2º BPM': ['Juazeiro do Norte'], '3º BPM': ['Sobral', 'Coreaú'], '4º BPM': ['Canindé', 'Boa Viagem'],
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
    title: '',
    total: '',
    unit: 'policiais adicionais necessários',
    description: '',
    stats: [],
    breakdownTitle: 'Distribuição do reforço por batalhão',
    breakdownSubtitle: '',
    hideBreakdown: true,
    breakdown: [],
    units: [],
    sectionTitle: 'Distribuição do efetivo adicional por batalhão',
    sectionSubtitle: '',
    tableColumns: ['Posição', 'Batalhão / cidade', 'Efetivo atual', 'Referência inteira', 'Situação', '<span class="column-title-line">Efetivo adicional</span><span class="column-title-line">necessário</span>'],
    tableRows: [],
    note: ''
  },
  battalions: {
    accent: '#145c40',
    eyebrow: 'Análise consolidada · batalhões',
    title: 'BATALHÕES - Análise situacional de Efetivo',
    total: '1.090',
    unit: 'necessidade consolidada dos BPMs',
    description: 'Cenário consolidado: 587 policiais da necessidade situacional dos 34 BPMs mais 503 policiais da reestruturação do interior e do litoral, vinculados ao 26º–34º BPM. As necessidades locais não são compensadas por saldos de outras unidades.',
    stats: [
      ['Batalhões analisados', '34', '29 com necessidade · 3 com saldo positivo · 2 em equilíbrio'],
      ['Exonerações e demissões · outros concursos', '62 + 170', '232 saídas administrativas nos 34 BPMs'],
      ['Requeridas nos BPMs', '430', '320 em 2025 · 110 em 2026']
    ],
    breakdownTitle: 'Situação integrada dos 34 batalhões',
    breakdownSubtitle: 'Distribuição dos BPMs após incorporar exonerações e demissões relacionadas a outros concursos, além das requeridas, ao saldo das movimentações.',
    hideBreakdown: true,
    breakdown: [
      ['Déficit', 85.29, '29 · 85,3%', '#145c40'],
      ['Saldo positivo', 8.82, '3 · 8,8%', '#3d9065'],
      ['Em equilíbrio', 5.88, '2 · 5,9%', '#83b99a']
    ],
    sectionTitle: 'Visão geral por batalhão',
    sectionSubtitle: 'A necessidade consolidada soma a necessidade situacional de cada BPM à parcela da reestruturação do interior e do litoral. Nos batalhões fora desse segundo estudo, a penúltima coluna apresenta apenas um hífen.',
    tableColumns: ['Posição', 'Batalhão / cidades', '<span class="column-title-line">Efetivo do</span><span class="column-title-line">batalhão</span>', 'Exonerações · outros concursos', 'Demissões · outros concursos', 'Requeridas', 'Movimentações', 'Perdas', 'Reestruturação.', '<span class="column-title-line">Necessidade de</span><span class="column-title-line">efetivo</span>'],
    tableRows: [],
    battalionTotals: {
      '1º BPM': 277, '2º BPM': 536, '3º BPM': 405, '4º BPM': 213, '5º BPM': 366,
      '6º BPM': 312, '7º BPM': 299, '8º BPM': 317, '9º BPM': 310, '10º BPM': 183,
      '11º BPM': 398, '12º BPM': 334, '13º BPM': 151, '14º BPM': 375, '15º BPM': 273,
      '16º BPM': 402, '17º BPM': 378, '18º BPM': 364, '19º BPM': 425, '20º BPM': 383,
      '21º BPM': 334, '22º BPM': 248, '23º BPM': 332, '24º BPM': 302, '25º BPM': 208,
      '26º BPM': 275, '27º BPM': 212, '28º BPM': 180, '29º BPM': 260, '30º BPM': 201,
      '31º BPM': 163, '32º BPM': 224, '33º BPM': 126, '34º BPM': 190
    },
    crpmByUnit: {
      '1º BPM': '8º CRPM', '2º BPM': '4º CRPM', '3º BPM': '3º CRPM', '4º BPM': '7º CRPM',
      '5º BPM': '1º CRPM', '6º BPM': '1º CRPM', '7º BPM': '3º CRPM', '8º BPM': '5º CRPM',
      '9º BPM': '8º CRPM', '10º BPM': '4º CRPM', '11º BPM': '7º CRPM', '12º BPM': '2º CRPM',
      '13º BPM': '4º CRPM', '14º BPM': '6º CRPM', '15º BPM': '6º CRPM', '16º BPM': '5º CRPM',
      '17º BPM': '1º CRPM', '18º BPM': '1º CRPM', '19º BPM': '5º CRPM', '20º BPM': '1º CRPM',
      '21º BPM': '1º CRPM', '22º BPM': '5º CRPM', '23º BPM': '2º CRPM', '24º BPM': '6º CRPM',
      '25º BPM': '6º CRPM', '26º BPM': '2º CRPM', '27º BPM': '3º CRPM', '28º BPM': '3º CRPM',
      '29º BPM': '7º CRPM', '30º BPM': '8º CRPM', '31º BPM': '8º CRPM', '32º BPM': '4º CRPM',
      '33º BPM': '4º CRPM', '34º BPM': '4º CRPM'
    },
    crpmTotals: {
      '1º CRPM': 2137,
      '2º CRPM': 941,
      '3º CRPM': 1096,
      '4º CRPM': 1410,
      '5º CRPM': 1392,
      '6º CRPM': 1158,
      '7º CRPM': 871,
      '8º CRPM': 951
    },
    administrativeExits: {
      '1º BPM': [0, 6], '2º BPM': [4, 3], '3º BPM': [2, 3], '4º BPM': [3, 5],
      '5º BPM': [1, 3], '6º BPM': [1, 13], '7º BPM': [0, 3], '8º BPM': [3, 6],
      '9º BPM': [0, 7], '10º BPM': [0, 4], '11º BPM': [0, 4], '12º BPM': [9, 8],
      '13º BPM': [1, 3], '14º BPM': [1, 9], '15º BPM': [3, 2], '16º BPM': [2, 5],
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
    healthLeaveTotals: {
      '1º BPM': 14, '2º BPM': 29, '3º BPM': 19, '4º BPM': 8, '5º BPM': 53,
      '6º BPM': 46, '7º BPM': 11, '8º BPM': 29, '9º BPM': 15, '10º BPM': 6,
      '11º BPM': 13, '12º BPM': 25, '13º BPM': 5, '14º BPM': 26, '15º BPM': 19,
      '16º BPM': 30, '17º BPM': 43, '18º BPM': 29, '19º BPM': 34, '20º BPM': 45,
      '21º BPM': 48, '22º BPM': 37, '23º BPM': 20, '24º BPM': 24, '25º BPM': 18,
      '26º BPM': 12, '27º BPM': 7, '28º BPM': 7, '29º BPM': 14, '30º BPM': 14,
      '31º BPM': 9, '32º BPM': 12, '33º BPM': 2, '34º BPM': 3
    },
    note: 'A base consolidada informa 9.956 policiais nos 34 BPMs e oito CRPMs. Para cada BPM, a situação é calculada por saldo das movimentações − exonerações − demissões − promoções requeridas de 2025 e 2026 vinculadas à unidade. A soma dos resultados negativos é 587 policiais. Conforme orientação de planejamento, a coluna final incorpora também os 503 policiais da reestruturação do interior e do litoral: 39 no 26º BPM, 62 no 27º, 94 no 28º, 31 no 29º, 37 no 30º, 75 no 31º, 11 no 32º, 109 no 33º e 45 no 34º. Assim, a necessidade consolidada apresentada é 1.090 policiais (587 + 503). Os dois estudos possuem métodos diferentes; a soma é um cenário integrado solicitado para planejamento, não comprovação de pessoas únicas nem efetivo já autorizado.'
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
    const additional = Math.max(0, reference - current);
    return [name, current, reference, additional, region, regionalAverage];
  }).sort((a, b) => b[3] - a[3]);
  const currentTotal = units.reduce((sum, [, current]) => sum + current, 0);
  const additionalTotal = units.reduce((sum, [, , , additional]) => sum + additional, 0);
  const targetTotal = currentTotal + additionalTotal;
  const format = (number) => number.toLocaleString('pt-BR');

  study.units = units;
  study.totalNumber = additionalTotal;
  study.regionalCounts = regionCounts;
  study.total = format(additionalTotal);
  study.title = `Reestruturação do interior e litoral: ${format(additionalTotal)} policiais adicionais para implementação`;
  study.description = `Com os efetivos consolidados mais recentes, os nove batalhões do recorte estão abaixo da média atual de seus CRPMs. Para levá-los à referência inteira, são necessários ${format(additionalTotal)} policiais adicionais. O conjunto passa de ${format(currentTotal)} para ${format(targetTotal)} policiais. É uma comparação com a média atual, não uma nova média recalculada após o reforço.`;
  study.stats = [
    ['Efetivo atual', format(currentTotal), 'Policiais nos nove batalhões analisados'],
    ['Efetivo adicional necessário', format(additionalTotal), 'Reforço distribuído entre os nove batalhões'],
    ['Efetivo após implementação', format(targetTotal), `${format(currentTotal)} atuais + ${format(additionalTotal)} adicionais`]
  ];
  study.breakdownSubtitle = `Participação de cada BPM nos ${format(additionalTotal)} policiais adicionais necessários.`;
  study.sectionSubtitle = 'Cada referência é a média atual do CRPM arredondada para cima; necessidade = referência inteira − efetivo atual.';
  study.tableRows = units.map(([name, current, reference, additional], index) => [
    String(index + 1), name, format(current), format(reference),
    additional > 0 ? 'Abaixo da média' : 'Na média ou acima', format(additional)
  ]);
  study.note = `Escopo: nove BPMs numerados (26º a 34º) identificados na aba “Resumo Executivo” da planilha de reorganização; 6º a 9º BPRAIO continuam fora. Os efetivos atuais e totais regionais foram atualizados pela base consolidada posterior dos 34 BPMs e oito CRPMs, que totaliza 9.956 policiais e substitui os valores antigos da planilha de reorganização. Para cada unidade, a média atual do CRPM é calculada por efetivo regional ÷ número de BPMs do comando; a meta é arredondada para cima antes de subtrair o efetivo da unidade. Os nove acréscimos inteiros somam ${format(additionalTotal)} policiais. Esse é um cenário de nivelamento à média de referência atual, não efetivo já autorizado nem meta recalculada após a alocação. Na visão consolidada dos 34 BPMs, esses valores são incorporados à parcela situacional de cada unidade conforme orientação de planejamento.`;

  const card = document.querySelector('.metric-card[data-detail="restructuring"]');
  if (card) {
    card.querySelector('.metric-main strong').textContent = study.total;
    card.querySelector('.metric-foot span').textContent = `Reforço para os ${units.length} batalhões analisados`;
    card.setAttribute('aria-label', `Detalhar os ${study.total} policiais adicionais necessários à implementação da reestruturação dos batalhões do interior e do litoral`);
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
    value: '271',
    unit: 'policiais',
    meta: '111 POG · 110 COTAM · 50 BPTUR',
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
  }
];

const battalionSortLabels = {
  unit: 'Batalhão',
  battalionStrength: 'Efetivo do batalhão',
  exonerations: 'Exonerações · outros concursos',
  dismissals: 'Demissões · outros concursos',
  requiredPromotions: 'Requeridas',
  movementBalance: 'Movimentações',
  losses: 'Perdas',
  restructuringNeed: 'Reestruturação.',
  totalNeed: 'Necessidade de efetivo'
};
let battalionSortState = { field: 'totalNeed', direction: 'desc' };

const battalionsPerCrpm = Object.values(metricDetails.battalions.crpmByUnit).reduce((counts, crpm) => {
  counts[crpm] = (counts[crpm] || 0) + 1;
  return counts;
}, {});

function getBattalionTableRecords() {
  return metricDetails.pog.units.map(([name, , , balance]) => {
    const crpm = metricDetails.battalions.crpmByUnit[name];
    const [exonerations = 0, dismissals = 0] = metricDetails.battalions.administrativeExits[name] || [];
    const requiredPromotions2025 = metricDetails.battalions.requiredPromotions2025[name] ?? 0;
    const requiredPromotions2026 = metricDetails.battalions.requiredPromotions2026[name] ?? 0;
    const requiredPromotions = requiredPromotions2025 + requiredPromotions2026;
    const grossLosses = exonerations + dismissals + requiredPromotions;
    const situation = balance - grossLosses;
    const losses = Math.max(0, -situation);
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
      losses,
      calculatedDeficit,
      restructuringNeed,
      totalNeed: calculatedDeficit + (restructuringNeed ?? 0)
    };
  });
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
  const value = total > 0 ? `+${total.toLocaleString('pt-BR')}` : total.toLocaleString('pt-BR');
  return `<span class="battalion-exit-value"><strong>${value}</strong><small>${note}</small></span>`;
}

function renderBattalionOptionalValue(total, note) {
  return total == null
    ? '<span class="battalion-exit-value is-unavailable"><strong>—</strong></span>'
    : renderBattalionExitValue(total, note);
}

function buildBattalionTableRows(field = 'situation', direction = 'asc') {
  const rows = getBattalionTableRecords()
    .sort((a, b) => compareBattalionRecords(a, b, field, direction))
    .map((record, index) => [
      String(index + 1),
      record.name,
      renderBattalionStrengthValue(record.battalionStrength, record.battalionStrength == null ? 'sem dado na fonte' : 'policiais'),
      renderBattalionExitValue(record.exonerations, 'saídas'),
      renderBattalionExitValue(record.dismissals, 'saídas'),
      renderBattalionExitValue(record.requiredPromotions, `2025: ${record.requiredPromotions2025} · 2026: ${record.requiredPromotions2026}`),
      renderBattalionSignedValue(record.movementBalance, 'saldo'),
      renderBattalionExitValue(record.losses, 'após movimentações'),
      renderBattalionOptionalValue(record.restructuringNeed, 'interior e litoral'),
      renderBattalionExitValue(record.totalNeed, 'necessidade total')
    ]);
  rows.push([
    '—',
    'REQUERIDAS DE OUTRAS OPMs',
    '—',
    '—',
    '—',
    renderBattalionExitValue(337, '2025: 232 · 2026: 105'),
    '—',
    renderBattalionExitValue(337, 'fora dos BPMs'),
    '—',
    '—'
  ]);
  rows.push([
    '—',
    'TOTAL DOS 34 BPMs',
    renderBattalionStrengthValue(9956, 'policiais'),
    renderBattalionExitValue(62, 'saídas'),
    renderBattalionExitValue(170, 'saídas'),
    renderBattalionExitValue(430, '2025: 320 · 2026: 110'),
    renderBattalionSignedValue(90, 'saldo'),
    renderBattalionExitValue(587, 'perdas locais'),
    renderBattalionExitValue(503, '26º ao 34º BPM'),
    renderBattalionExitValue(1090, '587 + 503')
  ]);
  return rows;
}

metricDetails.battalions.tableRows = buildBattalionTableRows(battalionSortState.field, battalionSortState.direction);

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
  const rows = data.tableRows.map((row) => `<tr${detailKey === 'battalions' && row[1] === 'REQUERIDAS DE OUTRAS OPMs' ? ' class="battalion-unallocated-row"' : ''}>${row.map((cell, index) => {
    const content = ['pog', 'restructuring', 'battalions'].includes(detailKey) && index === 1 ? renderPogUnitLabel(cell) : cell;
    return `<td>${content}</td>`;
  }).join('')}</tr>`).join('');
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
        <div><span>Controle de classificação</span><strong>Escolha uma coluna para organizar a tabela</strong></div>
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
  const calculation = `${region}: ${formatNumber(regionalTotal)} policiais ÷ ${regionalCount} BPMs = média atual de ${formatNumber(regionalAverage)}; meta inteira de ${formatNumber(reference)}.`;
  const interpretation = belowAverage
    ? `Acrescentar ${formatNumber(operationalDifference)} policiais a este BPM para atingir a referência atual. Com o reforço, seu efetivo passa de ${formatNumber(current)} para ${formatNumber(current + operationalDifference)} policiais. Esta unidade representa ${formatNumber(share)}% dos ${metricDetails.restructuring.total} necessários. ${calculation}`
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
        <div><h3>Top 5 maiores necessidades de efetivo</h3><p>Batalhões que receberiam o maior reforço para atingir a referência de seus comandos.</p></div>
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
  const cards = workforceProjectStudies.map((study, index) => `
    <button class="project-study-card${index === 0 ? ' is-active' : ''}" type="button" role="tab" id="projectStudyTab-${study.key}" data-project-study="${study.key}" aria-controls="projectStudyPanel-${study.key}" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}">
      <span class="project-study-card-icon"><img src="${study.image}" alt="${study.imageAlt}"></span>
      <span class="project-study-card-copy"><small>${study.eyebrow}</small><strong>${study.title}</strong><em>${study.meta}</em></span>
      <span class="project-study-card-total"><b>${study.value}</b><small>${study.unit}</small></span>
      <span class="project-study-card-action">Abrir estudo <b>→</b></span>
    </button>`).join('');
  return `
    <section class="detail-section project-study-selector-section">
      <div class="detail-section-heading">
        <div><h3>Escolha um eixo para aprofundar</h3><p>Os três subcards mantêm separados os universos, as premissas e os cálculos de cada estudo.</p></div>
        <span>Estudos separados</span>
      </div>
      <div class="project-study-selector" role="tablist" aria-label="Eixos do Projeto de Efetivo 2027 a 2030">${cards}</div>
    </section>`;
}

function renderProjectStudySummary(studyKey) {
  const study = workforceProjectStudies.find((item) => item.key === studyKey);
  const data = metricDetails[studyKey];
  const stats = data.stats.map(([label, value, note]) => `
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
    <p id="metricDetailDescription" hidden>Detalhamento dos três eixos do Projeto de Efetivo 2027–2030.</p>
    ${renderProjectStudySelector()}
    <div class="project-study-panel" id="projectStudyPanel-pog" data-project-study-panel="pog" role="tabpanel" aria-labelledby="projectStudyTab-pog">
      ${renderProjectStudySummary('pog')}
      ${renderPogDeficitOverview(pog)}
      ${renderPogUnitExplorer(pog)}
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
    </div>`;
  renderPogUnitDetail('12º BPM');
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
  const pogUnitExplorer = key === 'pog' ? renderPogUnitExplorer(data) : '';
  const pogImplementations = key === 'pog' ? renderPogImplementations(data) : '';
  const battalionRankings = key === 'battalions' ? renderBattalionRankings() : '';
  const restructuringUnitExplorer = key === 'restructuring' ? renderRestructuringUnitExplorer(data) : '';
  const restructuringTopFive = key === 'restructuring' ? renderRestructuringTopFive(data) : '';
  const copacResources = key === 'copac' ? renderCopacResources(data) : '';
  const battalionSortControls = key === 'battalions' ? renderBattalionSortControls() : '';
  const detailTable = renderDetailTable(data, key);
  const discriminatedTable = ['exits', 'raio', 'copac'].includes(key) ? '' : `
    <section class="detail-section">
      <div class="detail-section-heading"><div><h3>${data.sectionTitle}</h3><p>${data.sectionSubtitle}</p></div><span>Dados discriminados</span></div>
      ${battalionSortControls}
      ${key === 'battalions' ? `<div id="battalionTableResult">${detailTable}</div>` : detailTable}
      ${key === 'battalions' ? '<p class="battalion-table-source-note"><strong>Requeridas em 2025–2026:</strong> 552 + 215 = 767 registros detalhados por OPM. A linha TOTAL da aba de 2025 mostra 458 porque soma apenas subtenentes; 94 promoções de oficiais também foram incluídas. Desses 767, 430 estão vinculados aos 34 BPMs (320 em 2025 e 110 em 2026), e 337 pertencem a outras OPMs. <strong>Leitura da necessidade:</strong> os resultados negativos da parcela situacional somam 587 policiais; a penúltima coluna acrescenta 503 da reestruturação ao 26º–34º BPM, resultando em 1.090 na coluna consolidada. Promoção não é baixa institucional; as fontes e os dois métodos têm naturezas distintas.</p>' : ''}
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
  const projectStudyButton = event.target.closest('[data-project-study]');
  if (projectStudyButton) selectProjectStudy(projectStudyButton.dataset.projectStudy);
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
  if (event.target.matches('#pogUnitSelect')) {
    renderPogUnitDetail(event.target.value);
  }
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
