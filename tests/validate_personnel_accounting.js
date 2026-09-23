const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'presentation.js'), 'utf8');
const first = source.indexOf('const metricDetails =');
const last = source.indexOf('const metricModal =');
assert(first >= 0 && last > first, 'Dashboard data block not found');

const sandbox = { document: { querySelector: () => null } };
vm.runInNewContext(
  source.slice(first, last) +
    ';globalThis.audit = { details: metricDetails, records: getBattalionTableRecords() };',
  sandbox
);
const { details, records } = sandbox.audit;
const number = text => Number(String(text).replaceAll('.', ''));
const total = (items, getter) => items.reduce((sum, item) => sum + getter(item), 0);

const expectedStrength = {
  '1º BPM': 277, '2º BPM': 536, '3º BPM': 405, '4º BPM': 213,
  '5º BPM': 366, '6º BPM': 312, '7º BPM': 299, '8º BPM': 317,
  '9º BPM': 310, '10º BPM': 183, '11º BPM': 398, '12º BPM': 334,
  '13º BPM': 151, '14º BPM': 375, '15º BPM': 273, '16º BPM': 402,
  '17º BPM': 378, '18º BPM': 364, '19º BPM': 425, '20º BPM': 383,
  '21º BPM': 334, '22º BPM': 248, '23º BPM': 332, '24º BPM': 302,
  '25º BPM': 208, '26º BPM': 275, '27º BPM': 212, '28º BPM': 180,
  '29º BPM': 260, '30º BPM': 201, '31º BPM': 163, '32º BPM': 224,
  '33º BPM': 126, '34º BPM': 190
};
const expectedRegionalStrength = {
  '1º CRPM': 2137, '2º CRPM': 941, '3º CRPM': 1096, '4º CRPM': 1410,
  '5º CRPM': 1392, '6º CRPM': 1158, '7º CRPM': 871, '8º CRPM': 951
};
assert.equal(Object.keys(details.battalions.battalionTotals).length, 34);
for (const [name, expected] of Object.entries(expectedStrength)) {
  assert.equal(details.battalions.battalionTotals[name], expected, `BPM strength mismatch: ${name}`);
}
for (const [name, expected] of Object.entries(expectedRegionalStrength)) {
  assert.equal(details.battalions.crpmTotals[name], expected, `CRPM strength mismatch: ${name}`);
}
assert.equal(total(Object.values(details.battalions.battalionTotals), value => value), 9956);
assert.equal(total(Object.values(details.battalions.crpmTotals), value => value), 9956);
for (const [region, expected] of Object.entries(details.battalions.crpmTotals)) {
  const actual = total(
    Object.entries(details.battalions.battalionTotals)
      .filter(([unit]) => details.battalions.crpmByUnit[unit] === region),
    ([, value]) => value
  );
  assert.equal(actual, expected, `Regional total mismatch: ${region}`);
}

const expectedRestructuring = {
  '26º BPM': [275, 314, 39],
  '27º BPM': [212, 274, 62],
  '28º BPM': [180, 274, 94],
  '29º BPM': [260, 291, 31],
  '30º BPM': [201, 238, 37],
  '31º BPM': [163, 238, 75],
  '32º BPM': [224, 235, 11],
  '33º BPM': [126, 235, 109],
  '34º BPM': [190, 235, 45]
};
const restructuring = details.restructuring;
assert.equal(restructuring.units.length, 9);
for (const [name, current, reference, additional, region, average] of restructuring.units) {
  assert.deepEqual([current, reference, additional], expectedRestructuring[name], name);
  assert.equal(average, details.battalions.crpmTotals[region] / restructuring.regionalCounts[region]);
  assert.equal(reference, Math.ceil(average), `Reference mismatch: ${name}`);
  assert.equal(additional, Math.max(0, reference - current), `Additional need mismatch: ${name}`);
  const row = restructuring.tableRows.find((item) => item[1] === name);
  assert(row, `Table row missing: ${name}`);
  assert.equal(number(row[5]), additional, `Table need mismatch: ${name}`);
}
assert.equal(total(restructuring.units, ([, current]) => current), 1831);
assert.equal(total(restructuring.units, ([, , , additional]) => additional), 503);
assert.equal(restructuring.totalNumber, 503);
assert.equal(total(restructuring.units, ([, current, , additional]) => current + additional), 2334);
assert.equal(total(restructuring.units.slice(0, 5), ([, , , additional]) => additional), 385);

assert.equal(records.length, 34);
for (const [field, expected] of Object.entries({
  requiredPromotions2025: 320,
  requiredPromotions2026: 110,
  requiredPromotions: 430,
  movementBalance: 90,
  exonerations: 62,
  dismissals: 170,
  situation: -572,
  calculatedDeficit: 587,
  restructuringNeed: 503,
  totalNeed: 1090
})) {
  assert.equal(total(records, record => record[field]), expected, field);
}
for (const record of records) {
  const expected = expectedRestructuring[record.name]?.[2] ?? null;
  assert.equal(record.restructuringNeed, expected, `Integrated restructuring mismatch: ${record.name}`);
  assert.equal(record.totalNeed, record.calculatedDeficit + (expected ?? 0), `Consolidated need mismatch: ${record.name}`);
}
const unaffectedTableRow = details.battalions.tableRows.find(row => row[1] === '1º BPM');
const affectedTableRow = details.battalions.tableRows.find(row => row[1] === '26º BPM');
const battalionTotalRow = details.battalions.tableRows.at(-1);
assert(unaffectedTableRow[7].includes('<strong>—</strong>'), 'Unaffected BPM must show a hyphen');
assert(affectedTableRow[7].includes('<strong>39</strong>'), '26º BPM restructuring value missing');
assert(affectedTableRow[8].includes('<strong>61</strong>'), '26º BPM consolidated need mismatch');
assert(battalionTotalRow[7].includes('<strong>503</strong>'), 'Restructuring table total mismatch');
assert(battalionTotalRow[8].includes('<strong>1.090</strong>'), 'Consolidated table total mismatch');
assert.equal(records.filter(record => record.situation < 0).length, 29);
assert.equal(records.filter(record => record.situation > 0).length, 3);
assert.equal(records.filter(record => record.situation === 0).length, 2);

const csv = fs.readFileSync(path.join(root, 'data', 'saidas_batalhoes_2026.csv'), 'utf8').trim().split(/\r?\n/);
assert.equal(csv.length, 36);
for (const line of csv.slice(1, -1)) {
  const [name, ...values] = line.split(',');
  const record = records.find(item => item.name === name);
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

assert.equal(number(details.exits.total), 16 + 64 + 245 + 83 + 552 + 215);
assert.equal(number(details.exits.stats[0][1]), 16);
assert.equal(number(details.exits.stats[1][1]), 64);
assert.equal(number(details.pog.total), 111 + 110 + 50);
assert.equal(number(details.pog.total) + number(details.raio.total) + number(details.copac.total), 1543);
assert.equal(number(details.battalions.total), 1090);

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
for (const [key, expected] of Object.entries({ exits: 1175, pog: 1543, restructuring: 503, battalions: 1090 })) {
  const match = html.match(new RegExp(`data-detail="${key}"[\\s\\S]*?<div class="metric-main"><strong>([\\d.]+)</strong>`));
  assert(match, `Card not found: ${key}`);
  assert.equal(number(match[1]), expected, `Card total mismatch: ${key}`);
}

console.log('Validated 34 BPMs, 8 CRPMs, 9 restructuring units, POG, RAIO, COPAC, all four cards and the BPM CSV.');
