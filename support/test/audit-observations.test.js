'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateObservations } = require('../scripts/audit/validate-observations');

test('audit rejects missing observations and ignores a hard-coded confirmation', () => {
  const empty = validateObservations(undefined);
  assert.equal(empty.failed.length, 13);
  const result = validateObservations({ 'SEC-01': { status: 'confirmed-by-execution', httpStatus: 403, harmlessMarkerObserved: false } });
  assert.equal(result.findings['SEC-01'].status, 'not-reproduced');
  assert.ok(result.failed.includes('SEC-01'));
});

test('audit confirms observed conditions without trusting the old status', () => {
  const input = {
    'SEC-01': { status: 'not-reproduced', httpStatus: 200, harmlessMarkerObserved: true },
    'CODE-01': { configImportCount: 0, randomTokenReferenceCount: 2, randomTokenAppearsOnlyAsDefinitionAndExport: true },
  };
  const result = validateObservations(input);
  assert.equal(result.findings['SEC-01'].status, 'confirmed-by-execution');
  assert.equal(result.findings['CODE-01'].status, 'confirmed-by-static-analysis');
  assert.equal(result.failed.length, 11);
  assert.equal(input['SEC-01'].status, 'not-reproduced');
});
