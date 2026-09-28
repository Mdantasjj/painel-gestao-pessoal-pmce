const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __filename === '[stdin]' ? process.cwd() : path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'presentation.js'), 'utf8');
const first = source.indexOf('const battalionCompanyStrengths =');
const last = source.indexOf('const metricModal =');
assert(first >= 0 && last > first, 'Dashboard data block not found');

const sandbox = { document: { querySelector: () => null } };
vm.runInNewContext(
  source.slice(first, last) +
    ';globalThis.audit = { details: metricDetails, records: getBattalionTableRecords() };',
  sandbox
);
const { details, records } = sandbox.audit;
const battalionRecords = records.filter(record => record.unitType !== 'specialized');
const specializedRecords = records.filter(record => record.unitType === 'specialized');
const number = text => Number(String(text).replaceAll('.', ''));
const total = (items, getter) => items.reduce((sum, item) => sum + getter(item), 0);

const expectedStrength = {
  '1º BPM': 294, '2º BPM': 587, '3º BPM': 406, '4º BPM': 240,
  '5º BPM': 385, '6º BPM': 340, '7º BPM': 312, '8º BPM': 321,
  '9º BPM': 325, '10º BPM': 195, '11º BPM': 413, '12º BPM': 362,
  '13º BPM': 154, '14º BPM': 357, '15º BPM': 249, '16º BPM': 403,
  '17º BPM': 381, '18º BPM': 384, '19º BPM': 455, '20º BPM': 400,
  '21º BPM': 360, '22º BPM': 254, '23º BPM': 326, '24º BPM': 324,
  '25º BPM': 217, '26º BPM': 286, '27º BPM': 212, '28º BPM': 173,
  '29º BPM': 240, '30º BPM': 187, '31º BPM': 161, '32º BPM': 222,
  '33º BPM': 125, '34º BPM': 191
};
const expectedRegionalStrength = {
  '1º CRPM': 2250, '2º CRPM': 974, '3º CRPM': 1103, '4º CRPM': 1474,
  '5º CRPM': 1433, '6º CRPM': 1147, '7º CRPM': 893, '8º CRPM': 967
};
assert.equal(Object.keys(details.battalions.battalionTotals).length, 34);
for (const [name, expected] of Object.entries(expectedStrength)) {
  assert.equal(details.battalions.battalionTotals[name], expected, `BPM strength mismatch: ${name}`);
}
for (const [name, expected] of Object.entries(expectedRegionalStrength)) {
  assert.equal(details.battalions.crpmTotals[name], expected, `CRPM strength mismatch: ${name}`);
}
assert.equal(total(Object.values(details.battalions.battalionTotals), value => value), 10241);
assert.equal(total(Object.values(details.battalions.crpmTotals), value => value), 10241);
for (const [region, expected] of Object.entries(details.battalions.crpmTotals)) {
  const actual = total(
    Object.entries(details.battalions.battalionTotals)
      .filter(([unit]) => details.battalions.crpmByUnit[unit] === region),
    ([, value]) => value
  );
  assert.equal(actual, expected, `Regional total mismatch: ${region}`);
}

const expectedRestructuring = {
  '26º BPM': [286, 325, 39],
  '27º BPM': [212, 276, 64],
  '28º BPM': [173, 276, 103],
  '29º BPM': [240, 298, 58],
  '30º BPM': [187, 242, 55],
  '31º BPM': [161, 242, 81],
  '32º BPM': [222, 246, 24],
  '33º BPM': [125, 246, 121],
  '34º BPM': [191, 246, 55]
};
const restructuring = details.restructuring;
assert.equal(restructuring.units.length, 9);
for (const [name, current, reference, additional, region, average, losses] of restructuring.units) {
  assert.deepEqual([current, reference, additional], expectedRestructuring[name], name);
  assert.equal(average, details.battalions.crpmTotals[region] / restructuring.regionalCounts[region]);
  assert.equal(reference, Math.ceil(average), `Reference mismatch: ${name}`);
  assert.equal(additional, Math.max(0, reference - current), `Additional need mismatch: ${name}`);
  assert.equal(losses, records.find(record => record.name === name).losses, `Restructuring losses mismatch: ${name}`);
  const row = restructuring.tableRows.find((item) => item[1] === name);
  assert(row, `Table row missing: ${name}`);
  assert.equal(number(row[5]), losses, `Table losses mismatch: ${name}`);
  assert.equal(number(row[6]), -additional, `Table need display mismatch: ${name}`);
}
assert.equal(total(restructuring.units, ([, current]) => current), 1797);
assert.equal(total(restructuring.units, ([, , , additional]) => additional), 600);
assert.equal(restructuring.totalNumber, 600);
assert.equal(total(restructuring.units, ([, current, , additional]) => current + additional), 2397);
assert.equal(total(restructuring.units.slice(0, 5), ([, , , additional]) => additional), 427);

assert.equal(records.length, 53);
assert.equal(battalionRecords.length, 34);
assert.equal(specializedRecords.length, 19);
for (const [field, expected] of Object.entries({
  requiredPromotions2025: 320,
  requiredPromotions2026: 110,
  requiredPromotions: 430,
  movementBalance: 90,
  exonerations: 62,
  dismissals: 170,
  grossLosses: 662,
  losses: 587,
  situation: -572,
  calculatedDeficit: 587,
  restructuringNeed: 600,
  totalNeed: 1187
})) {
  assert.equal(total(battalionRecords, record => record[field]), expected, field);
}
for (const record of battalionRecords) {
  assert.equal(record.grossLosses, record.exonerations + record.dismissals + record.requiredPromotions, `Gross losses mismatch: ${record.name}`);
  assert.equal(record.losses, Math.max(0, record.grossLosses - record.movementBalance), `Losses mismatch: ${record.name}`);
  const expected = expectedRestructuring[record.name]?.[2] ?? null;
  assert.equal(record.restructuringNeed, expected, `Integrated restructuring mismatch: ${record.name}`);
  assert.equal(record.totalNeed, record.calculatedDeficit + (expected ?? 0), `Consolidated need mismatch: ${record.name}`);
}
const unaffectedTableRow = details.battalions.tableRows.find(row => row[1] === '1º BPM');
const affectedTableRow = details.battalions.tableRows.find(row => row[1] === '26º BPM');
const battalionTotalRow = details.battalions.tableRows.find(row => row[1] === 'TOTAL DOS 34 BPMs');
assert(unaffectedTableRow[8].includes('<strong>—</strong>'), 'Unaffected BPM must show a hyphen');
assert(affectedTableRow[8].includes('<strong>39</strong>'), '26º BPM restructuring value missing');
assert(affectedTableRow[9].includes('<strong>61</strong>'), '26º BPM consolidated need mismatch');
assert(battalionTotalRow[7].includes('<strong>587</strong>'), 'Losses table total mismatch');
assert(battalionTotalRow[8].includes('<strong>600</strong>'), 'Restructuring table total mismatch');
assert(battalionTotalRow[9].includes('<strong>1.187</strong>'), 'Consolidated table total mismatch');
assert.equal(battalionRecords.filter(record => record.situation < 0).length, 29);
assert.equal(battalionRecords.filter(record => record.situation > 0).length, 3);
assert.equal(battalionRecords.filter(record => record.situation === 0).length, 2);

assert.equal(Object.keys(details.pog.companyStrengthByBattalion).length, 34);
assert.equal(Object.keys(details.pog.companyCitiesByBattalion).length, 34);
assert.equal(Object.keys(details.pog.territories).length, 34);
assert.equal(Object.keys(details.pog.companyCountByBattalion).length, 34);
assert.equal(total(Object.values(details.pog.companyCountByBattalion), value => value), 84);
assert.equal(total(Object.values(details.pog.companyStrengthByBattalion), values => total(values, value => value)), 10241);
for (let number = 1; number <= 34; number += 1) {
  const battalion = `${number}º BPM`;
  assert.equal(details.pog.companyCitiesByBattalion[battalion].length, details.pog.companyStrengthByBattalion[battalion].length, `Company/city mismatch: ${battalion}`);
}
assert.equal(total(Object.values(details.pog.companyCitiesByBattalion), cities => cities.filter(city => city == null).length), 1);
assert.equal(details.pog.companyCitiesByBattalion['2º BPM'][3], null);
assert.deepEqual(Array.from(details.pog.territories['3º BPM']), ['Sobral', 'Forquilha', 'Massapê']);
assert.deepEqual(Array.from(details.pog.territories['5º BPM']), ['Centro', 'Carlito Pamplona']);
assert.deepEqual(Array.from(details.pog.territories['6º BPM']), ['Parangaba', 'Bairro de Fátima']);
assert.deepEqual(Array.from(details.pog.territories['8º BPM']), ['Aldeota', 'Vicente Pinzón']);
assert.deepEqual(Array.from(details.pog.territories['16º BPM']), ['Messejana', 'Jangurussu']);
assert.deepEqual(Array.from(details.pog.territories['17º BPM']), ['Conjunto Ceará', 'Bom Jardim']);
assert.deepEqual(Array.from(details.pog.territories['18º BPM']), ['Antônio Bezerra', 'Parquelândia']);
assert.deepEqual(Array.from(details.pog.territories['19º BPM']), ['Cambeba', 'Aerolândia']);
assert.deepEqual(Array.from(details.pog.territories['20º BPM']), ['Pirambu', 'Barra do Ceará']);
assert.deepEqual(Array.from(details.pog.territories['21º BPM']), ['Conjunto Esperança', 'Maraponga']);
assert.deepEqual(Array.from(details.pog.territories['22º BPM']), ['Papicu', 'Dionísio Torres']);
assert.deepEqual(Array.from(details.pog.territories['23º BPM']), ['Paracuru', 'Paraipaba', 'São Gonçalo do Amarante', 'Trairi']);
assert.deepEqual(Array.from(details.pog.territories['25º BPM']), ['Horizonte', 'Pacajus']);
assert.deepEqual(Array.from(details.pog.territories['32º BPM']), ['Brejo Santo', 'Mauriti']);

const csv = fs.readFileSync(path.join(root, 'data', 'saidas_batalhoes_2026.csv'), 'utf8').trim().split(/\r?\n/);
assert.equal(csv.length, 36);
for (const line of csv.slice(1, -1)) {
  const [name, ...values] = line.split(',');
  const record = battalionRecords.find(item => item.name === name);
  assert(record, `CSV BPM missing: ${name}`);
  assert.deepEqual(values.map(Number), [
    record.exonerations,
    record.dismissals,
    record.requiredPromotions2025,
    record.requiredPromotions2026,
    record.requiredPromotions,
    record.movementBalance,
    record.situation,
    record.calculatedDeficit,
    record.restructuringNeed ?? 0,
    record.totalNeed
  ], `CSV mismatch: ${name}`);
}

assert.equal(number(details.exits.total), 16 + 64 + 245 + 83 + 552 + 215 + 374);
assert.equal(number(details.exits.stats[0][1]), 16);
assert.equal(number(details.exits.stats[1][1]), 64);
assert.equal(number(details.pog.total), 111 + 110 + 50);
assert.equal(number(details.pog.total) + number(details.raio.total) + number(details.copac.total), 1543);
assert.equal(number(details.battalions.total), 1353);

const pogUnits = details.pog.units;
assert.equal(pogUnits.length, 34);
assert.equal(total(pogUnits, ([, origin]) => origin), 1459);
assert.equal(total(pogUnits, ([, , destination]) => destination), 1549);
for (const [name, origin, destination, balance] of pogUnits) {
  assert.equal(destination - origin, balance, `POG movement mismatch: ${name}`);
}
assert.equal(total(pogUnits, ([, , , balance]) => Math.max(0, -balance)), 111);

const raioLevels = details.raio.levels;
assert.equal(total(raioLevels, level => level.bases), 20);
assert.equal(total(raioLevels, level => level.cities), 31);
assert.equal(total(raioLevels, level => level.total), 912);
assert.equal(total(raioLevels, level => level.officers), 20);
assert.equal(total(raioLevels, level => level.enlisted), 892);
for (const level of raioLevels) {
  assert.equal(level.rows.length, level.bases, `RAIO bases mismatch: ${level.name}`);
  assert.equal(level.officers + level.enlisted, level.total, `RAIO officers/enlisted mismatch: ${level.name}`);
  assert.equal(level.administrative + level.guard + level.operational, level.enlisted, `RAIO functions mismatch: ${level.name}`);
  assert.equal(total(level.rows, row => number(row[7])), level.total, `RAIO table mismatch: ${level.name}`);
}

assert.equal(details.copac.tableRows.length, 12);
assert.equal(total(details.copac.tableRows, row => number(row[5])), 360);
assert.equal(total(details.copac.phases, phase => phase.total), 360);
assert.equal(total(details.copac.phases, phase => phase.bases), 12);
for (const phase of details.copac.phases) {
  assert.equal(phase.rows.length, phase.bases, `COPAC bases mismatch: ${phase.name}`);
  assert.equal(total(phase.rows, row => number(row[5])), phase.total, `COPAC table mismatch: ${phase.name}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [key, expected] of Object.entries({ exits: 1549, pog: 1543, restructuring: 600, battalions: 1353 })) {
  const match = html.match(new RegExp(`data-detail="${key}"[\\s\\S]*?<div class="metric-main"><strong>([\\d.]+)</strong>`));
  assert(match, `Card not found: ${key}`);
  assert.equal(number(match[1]), expected, `Card total mismatch: ${key}`);
}

console.log('Validated 34 BPMs, 8 CRPMs, 9 restructuring units, POG, RAIO, COPAC, all four cards and the BPM CSV.');
