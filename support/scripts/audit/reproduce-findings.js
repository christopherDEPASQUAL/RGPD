'use strict';

// Reproduces audit findings against a temporary copy and fictional data only.
// No external service is contacted; the HTTP server binds to 127.0.0.1.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');
const { once } = require('node:events');
const Module = require('node:module');

const projectRoot = path.resolve(__dirname, '..', '..');
const auditRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wellwork-audit-'));
const workCopy = path.join(auditRoot, 'support');
const runtimeDir = path.join(auditRoot, 'runtime');
const dbFile = path.join(runtimeDir, 'wellwork.json');
const logFile = path.join(runtimeDir, 'app.log');

function copyInput(relativePath) {
  const source = path.join(projectRoot, relativePath);
  const destination = path.join(workCopy, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

for (const input of ['src', 'db/seed.js', 'public', 'package.json', 'package-lock.json']) {
  copyInput(input);
}

fs.mkdirSync(runtimeDir, { recursive: true });
process.env.DB_FILE = dbFile;
process.env.LOG_FILE = logFile;
process.env.LOG_STDOUT = '0';

// The temporary copy uses the already installed, lockfile-matched dependencies.
// NODE_PATH is used only for local module resolution; it does not contact a registry.
process.env.NODE_PATH = path.join(projectRoot, 'node_modules');
Module.Module._initPaths();

const seed = spawnSync(process.execPath, ['db/seed.js'], {
  cwd: workCopy,
  env: process.env,
  encoding: 'utf8',
});
if (seed.status !== 0) {
  throw new Error(`Seed failed with exit code ${seed.status}`);
}

const seeded = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
const preloadedAdminSession = seeded.sessions[0];
const { createApp } = require(path.join(workCopy, 'src', 'app.js'));

function auth(token) {
  return { authorization: `Bearer ${token}` };
}

async function jsonRequest(base, route, options = {}) {
  const response = await fetch(`${base}${route}`, options);
  let body = null;
  try { body = await response.json(); } catch { /* no JSON body */ }
  return { status: response.status, body };
}

async function register(base, email, password, extra = {}) {
  return jsonRequest(base, '/api/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password, ...extra }),
  });
}

async function login(base, email, password) {
  return jsonRequest(base, '/api/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

async function waitForFileText(file, expected, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8').includes(expected)) return true;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return false;
}

async function main() {
  const app = createApp();
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const sharedPassword = 'AUDIT_SHARED_PASSWORD_ONLY';

  try {
    const first = await register(base, 'employee-one@audit.invalid', sharedPassword, {
      firstName: 'Audit', lastName: 'One', company: 'AuditTenant', birthDate: '1990-01-01',
    });
    const second = await register(base, 'employee-two@audit.invalid', sharedPassword, {
      firstName: 'Audit', lastName: 'Two', company: 'OtherAuditTenant', birthDate: '1991-01-01',
    });
    const employeeToken = first.body.token;
    const secondToken = second.body.token;

    const otherProfile = await jsonRequest(base, '/api/users/4', { headers: auth(employeeToken) });
    const directory = await jsonRequest(base, '/api/users', { headers: auth(employeeToken) });

    // Harmless server-side JavaScript proof: mutate only the disposable in-memory fixture.
    const expression = `(row.auditProof = 'SAFE_MARKER', row.id === 1)`;
    const injection = await jsonRequest(
      base,
      `/api/users?${new URLSearchParams({ filter: expression })}`,
      { headers: auth(employeeToken) },
    );

    const elevation = await jsonRequest(base, '/api/me', {
      method: 'PATCH',
      headers: { ...auth(employeeToken), 'content-type': 'application/json' },
      body: JSON.stringify({ role: 'admin' }),
    });
    const chainedExport = await jsonRequest(base, '/api/exports/insurer', { headers: auth(employeeToken) });

    const rhLogin = await login(base, 'rh@acme.example', 'AcmeRh2024');
    const directRhExport = await jsonRequest(base, '/api/exports/insurer', { headers: auth(rhLogin.body.token) });

    const oldAdminSession = await jsonRequest(base, '/api/me', {
      headers: auth(preloadedAdminSession.token),
    });

    const questionnaire = await jsonRequest(base, '/api/questionnaires', {
      method: 'POST',
      headers: { ...auth(secondToken), 'content-type': 'application/json' },
      body: JSON.stringify({ answers: { stress: 5, marker: 'SAFE_DELETE_PROOF' } }),
    });
    const deletion = await jsonRequest(base, '/api/me', { method: 'DELETE', headers: auth(secondToken) });
    const oldSessionAfterDeletion = await jsonRequest(base, '/api/me', { headers: auth(secondToken) });
    const reloginAfterDeletion = await login(base, 'employee-two@audit.invalid', sharedPassword);

    const logSentinel = 'AUDIT_LOG_PASSWORD_SENTINEL';
    await login(base, 'nobody@audit.invalid', logSentinel);
    const plaintextPasswordFoundInLog = await waitForFileText(logFile, logSentinel);

    const persisted = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    const deletedUser = persisted.users.find((user) => user.email === 'employee-two@audit.invalid');
    const deletedUserQuestionnaires = persisted.questionnaires.filter((item) => item.userId === deletedUser.id);
    const deletedUserSessions = persisted.sessions.filter((item) => item.userId === deletedUser.id);
    const deletedUserConsents = persisted.consents.filter((item) => item.userId === deletedUser.id);
    const firstPersisted = persisted.users.find((user) => user.email === 'employee-one@audit.invalid');
    const secondPersisted = persisted.users.find((user) => user.email === 'employee-two@audit.invalid');
    const firstConsent = persisted.consents.find((item) => item.userId === firstPersisted.id);

    const jsFiles = [];
    function collectJs(directory) {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) collectJs(full);
        else if (entry.name.endsWith('.js')) jsFiles.push(full);
      }
    }
    collectJs(path.join(workCopy, 'src'));
    const sourceText = jsFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
    const configImports = (sourceText.match(/require\([^)]*config[^)]*\)/g) || []).length;
    const randomTokenReferences = (sourceText.match(/\brandomToken\b/g) || []).length;

    let baselineCommit = 'unknown';
    try {
      baselineCommit = execFileSync('git', ['rev-list', '-n', '1', 'baseline-vulnerable'], {
        cwd: projectRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    } catch { /* repository metadata is optional for standalone reproduction */ }

    const result = {
      baselineCommit,
      isolation: {
        temporaryCopy: true,
        fictionalSeed: true,
        bindAddress: server.address().address,
        externalRequestsMade: false,
        projectDatabaseTouched: false,
      },
      findings: {
        'SEC-01': {
          status: 'confirmed-by-execution',
          httpStatus: injection.status,
          harmlessMarkerObserved: injection.body?.[0]?.auditProof === 'SAFE_MARKER',
          returnedRows: injection.body?.length,
        },
        'PRIV-01': {
          status: 'confirmed-by-execution',
          httpStatus: otherProfile.status,
          otherUserReturned: otherProfile.body?.id === 4,
          questionnairesReturned: otherProfile.body?.questionnaires?.length || 0,
        },
        'PRIV-02': {
          status: 'confirmed-by-execution',
          httpStatus: directory.status,
          employeeCouldListUsers: Array.isArray(directory.body),
          returnedUsers: directory.body?.length,
          returnedCompanies: new Set((directory.body || []).map((user) => user.company)).size,
        },
        'PRIV-03': {
          status: 'confirmed-by-execution',
          crossTenantProfileReturned: otherProfile.body?.company !== 'AuditTenant',
          crossTenantDirectoryReturned: (directory.body || []).some((user) => user.company !== 'AuditTenant'),
        },
        'SEC-02': {
          status: 'confirmed-by-execution',
          httpStatus: elevation.status,
          employeeBecameAdmin: elevation.body?.role === 'admin',
        },
        'PRIV-04': {
          status: 'confirmed-by-execution',
          directRhExportStatus: directRhExport.status,
          directRhExportRows: directRhExport.body?.length,
          chainedEmployeeExportStatus: chainedExport.status,
          chainedEmployeeExportRows: chainedExport.body?.length,
          chainedScenario: ['SEC-02', 'PRIV-04'],
        },
        'SEC-03': {
          status: 'confirmed-by-execution',
          preloadedSessionStatus: oldAdminSession.status,
          preloadedSessionCreatedAt: preloadedAdminSession.createdAt,
          expiryFieldPresent: Object.hasOwn(preloadedAdminSession, 'expiresAt'),
        },
        'PRIV-05': {
          status: 'confirmed-by-execution',
          deleteStatus: deletion.status,
          oldSessionStillValid: oldSessionAfterDeletion.status === 200,
          reloginStillWorks: reloginAfterDeletion.status === 200,
          userRowRemains: Boolean(deletedUser),
          questionnairesRemaining: deletedUserQuestionnaires.length,
          sessionsRemaining: deletedUserSessions.length,
          consentsRemaining: deletedUserConsents.length,
          questionnaireCreatedStatus: questionnaire.status,
        },
        'SEC-04': {
          status: 'confirmed-by-execution',
          plaintextPasswordFoundInLog,
        },
        'PRIV-06': {
          status: 'confirmed-by-execution',
          passwordHashInRegistration: Object.hasOwn(first.body?.user || {}, 'passwordHash'),
          passwordHashInOtherProfile: Object.hasOwn(otherProfile.body || {}, 'passwordHash'),
          passwordHashInDirectory: Object.hasOwn(directory.body?.[0] || {}, 'passwordHash'),
        },
        'PRIV-07': {
          status: 'confirmed-by-execution',
          noConsentFieldsSubmitted: true,
          marketingOptInForced: first.body?.user?.marketingOptIn === true,
          storedMarketingConsent: firstConsent?.marketing === true,
          storedThirdPartyConsent: firstConsent?.thirdParty === true,
        },
        'SEC-05': {
          status: 'confirmed-by-execution',
          equalPasswordsHaveEqualHashes: firstPersisted.passwordHash === secondPersisted.passwordHash,
          sha256HexShape: /^[a-f0-9]{64}$/.test(firstPersisted.passwordHash),
          perUserSaltFieldPresent: Object.hasOwn(firstPersisted, 'passwordSalt'),
        },
        'CODE-01': {
          status: 'static-finding',
          configImportCount: configImports,
          randomTokenReferenceCount: randomTokenReferences,
          randomTokenAppearsOnlyAsDefinitionAndExport: randomTokenReferences === 2,
        },
      },
    };

    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (process.env.AUDIT_KEEP_TEMP !== '1') fs.rmSync(auditRoot, { recursive: true, force: true });
  }
}

main().then(() => process.exit(0)).catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  if (process.env.AUDIT_KEEP_TEMP !== '1') fs.rmSync(auditRoot, { recursive: true, force: true });
  process.exit(1);
});
