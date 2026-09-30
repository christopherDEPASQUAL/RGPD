'use strict';

// Offline verification of the Part B CVSS 3.1 BASE scores, not a v4 calculator.
// Equations and rounding: https://www.first.org/cvss/v3.1/specification-document
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function roundup(value) {
  const scaled = Math.round(value * 100000);
  return scaled % 10000 === 0 ? scaled / 100000 : (Math.floor(scaled / 10000) + 1) / 10;
}

function baseScore(vector) {
  const parts = vector.split('/');
  assert.equal(parts.shift(), 'CVSS:3.1');
  const allowed = { AV: 'NALP', AC: 'LH', PR: 'NLH', UI: 'NR', S: 'UC', C: 'NLH', I: 'NLH', A: 'NLH' };
  const metrics = {};
  for (const part of parts) {
    const pair = part.split(':');
    assert.equal(pair.length, 2);
    const [key, value] = pair;
    assert.ok(Object.hasOwn(allowed, key) && value.length === 1 && allowed[key].includes(value));
    assert.ok(!Object.hasOwn(metrics, key), 'Duplicate metric');
    metrics[key] = value;
  }
  assert.equal(Object.keys(metrics).length, 8, 'All base metrics required');
  const changed = metrics.S === 'C';
  const cia = { N: 0, L: 0.22, H: 0.56 };
  const iss = 1 - (1 - cia[metrics.C]) * (1 - cia[metrics.I]) * (1 - cia[metrics.A]);
  const impact = changed ? 7.52 * (iss - 0.029) - 3.25 * ((iss - 0.02) ** 15) : 6.42 * iss;
  if (impact <= 0) return 0;
  const av = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[metrics.AV];
  const ac = { L: 0.77, H: 0.44 }[metrics.AC];
  const pr = { N: 0.85, L: changed ? 0.68 : 0.62, H: changed ? 0.5 : 0.27 }[metrics.PR];
  const ui = { N: 0.85, R: 0.62 }[metrics.UI];
  return roundup(Math.min((impact + 8.22 * av * ac * pr * ui) * (changed ? 1.08 : 1), 10));
}

// Reference examples: FIRST v3.1 examples, Shellshock, VMware escape, SearchBlox CSRF.
assert.equal(baseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'), 9.8);
assert.equal(baseScore('CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H'), 9.9);
assert.equal(baseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H'), 8.8);
assert.equal(baseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N'), 0);
assert.equal(roundup(4.02), 4.1);
assert.equal(roundup(4), 4);
assert.throws(() => baseScore('CVSS:3.1/AV:N/AC:L'));
assert.throws(() => baseScore('CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N/AV:N'));

const report = fs.readFileSync(path.join(__dirname, '../../docs/dossier/partie-b/01-constats-securite.md'), 'utf8');
const rows = [...report.matchAll(/^\| ([^|]+) \| (\d+\.\d) \| `(CVSS:3\.1\/[^`]+)` \|$/gm)];
assert.equal(rows.length, 10, 'Expected ten scored finding rows');
for (const [, id, declared, vector] of rows) {
  const computed = baseScore(vector);
  assert.equal(computed, Number(declared), `${id.trim()}: score mismatch`);
  process.stdout.write(`${id.trim()}: ${computed.toFixed(1)} OK\n`);
}
process.stdout.write('FIRST examples, rounding, invalid vectors and 10 report scores verified. No network or file writes.\n');
