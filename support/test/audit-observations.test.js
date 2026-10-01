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

function crossTenantObservations() {
  return {
    'PRIV-01': { httpStatus: 200, otherUserReturned: true, questionnairesReturned: 3 },
    'PRIV-02': { httpStatus: 200, employeeCouldListUsers: true, returnedUsers: 65, returnedCompanies: 6 },
    'PRIV-03': { crossTenantProfileReturned: true, crossTenantDirectoryReturned: true },
  };
}

test('audit confirms cross-tenant access only with corroborated successful responses', () => {
  const input = crossTenantObservations();
  const before = structuredClone(input);
  const result = validateObservations(input);
  assert.equal(result.findings['PRIV-03'].status, 'confirmed-by-execution');
  assert.equal(result.failed.includes('PRIV-03'), false);
  assert.deepEqual(input, before);
});

test('audit rejects the historical cross-tenant false positive from an error response', () => {
  const input = crossTenantObservations();
  const deniedProfile = { status: 403, body: { error: 'forbidden' } };
  input['PRIV-01'] = { httpStatus: deniedProfile.status, otherUserReturned: false, questionnairesReturned: 0 };
  // Reproduce the exact historical expression, without editing the pinned harness.
  input['PRIV-03'].crossTenantProfileReturned = deniedProfile.body?.company !== 'AuditTenant';
  assert.equal(input['PRIV-03'].crossTenantProfileReturned, true);
  const result = validateObservations(input);
  assert.equal(result.findings['PRIV-03'].status, 'not-reproduced');
  assert.ok(result.failed.includes('PRIV-03'));
});

test('audit rejects missing or inconsistent profile/directory corroboration', () => {
  const cases = [
    ['PRIV-01', undefined], ['PRIV-01', null], ['PRIV-01', []],
    ['PRIV-01', { httpStatus: 404, otherUserReturned: true, questionnairesReturned: 3 }],
    ['PRIV-01', { httpStatus: 200, otherUserReturned: false, questionnairesReturned: 3 }],
    ['PRIV-02', undefined], ['PRIV-02', []],
    ['PRIV-02', { httpStatus: 403, employeeCouldListUsers: true, returnedUsers: 65, returnedCompanies: 6 }],
    ['PRIV-02', { httpStatus: 200, employeeCouldListUsers: false, returnedUsers: 65, returnedCompanies: 6 }],
    ['PRIV-02', { httpStatus: 200, employeeCouldListUsers: true, returnedUsers: 65, returnedCompanies: 1 }],
  ];
  for (const [id, value] of cases) {
    const input = crossTenantObservations();
    input[id] = value;
    const result = validateObservations(input);
    assert.equal(result.findings['PRIV-03'].status, 'not-reproduced', `${id}: ${JSON.stringify(value)}`);
    assert.ok(result.failed.includes('PRIV-03'));
  }
});
