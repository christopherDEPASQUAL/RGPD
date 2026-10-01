'use strict';

// Evaluate observations, never the old harness's hard-coded status strings.
const checks = {
  'SEC-01': (f) => f.httpStatus === 200 && f.harmlessMarkerObserved === true,
  'PRIV-01': (f) => f.httpStatus === 200 && f.otherUserReturned === true && f.questionnairesReturned > 0,
  'PRIV-02': (f) => f.httpStatus === 200 && f.employeeCouldListUsers === true && f.returnedUsers > 1 && f.returnedCompanies > 1,
  'PRIV-03': (f) => f.crossTenantProfileReturned === true && f.crossTenantDirectoryReturned === true,
  'SEC-02': (f) => f.httpStatus === 200 && f.employeeBecameAdmin === true,
  'PRIV-04': (f) => f.directRhExportStatus === 200 && f.directRhExportRows > 0 && f.chainedEmployeeExportStatus === 200 && f.chainedEmployeeExportRows > 0,
  'SEC-03': (f) => f.preloadedSessionStatus === 200 && f.expiryFieldPresent === false,
  'PRIV-05': (f) => f.deleteStatus === 200 && f.questionnaireCreatedStatus === 201 && f.oldSessionStillValid === true && f.reloginStillWorks === true && f.userRowRemains === true && f.questionnairesRemaining > 0 && f.sessionsRemaining > 0 && f.consentsRemaining > 0,
  'SEC-04': (f) => f.plaintextPasswordFoundInLog === true,
  'PRIV-06': (f) => f.passwordHashInRegistration === true && f.passwordHashInOtherProfile === true && f.passwordHashInDirectory === true,
  'PRIV-07': (f) => f.noConsentFieldsSubmitted === true && f.marketingOptInForced === true && f.storedMarketingConsent === true && f.storedThirdPartyConsent === true,
  'SEC-05': (f) => f.equalPasswordsHaveEqualHashes === true && f.sha256HexShape === true && f.perUserSaltFieldPresent === false,
  'CODE-01': (f) => f.configImportCount === 0 && f.randomTokenReferenceCount === 2 && f.randomTokenAppearsOnlyAsDefinitionAndExport === true,
};

function validateObservations(observed) {
  const findings = {};
  const failed = [];
  for (const [id, check] of Object.entries(checks)) {
    const value = observed?.[id];
    const finding = value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
    const confirmed = Boolean(check(finding));
    finding.status = confirmed ? (id === 'CODE-01' ? 'confirmed-by-static-analysis' : 'confirmed-by-execution') : 'not-reproduced';
    findings[id] = finding;
    if (!confirmed) failed.push(id);
  }
  return { findings, failed };
}

module.exports = { validateObservations };
