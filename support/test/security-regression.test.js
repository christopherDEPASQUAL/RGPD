'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const testId = `${process.pid}-${Date.now()}`;
process.env.DB_FILE = path.join(os.tmpdir(), `wellwork-security-${testId}.json`);
process.env.LOG_FILE = path.join(os.tmpdir(), `wellwork-security-${testId}.log`);
process.env.LOG_STDOUT = '0';

const { createApp } = require('../src/app');
const db = require('../src/db');
const { issueToken } = require('../src/auth');
const { log } = require('../src/logger');

function writeDatabase() {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  fs.writeFileSync(process.env.DB_FILE, JSON.stringify({
    users: [
      { id: 1, email: 'employee@acme.example', company: 'ACME', tenantId: 'tenant-acme', tenantVerifiedAt: '2026-01-01T00:00:00.000Z', role: 'employee', passwordHash: 'unused', deleted: false },
      { id: 2, email: 'other@globex.example', company: 'Globex', tenantId: 'tenant-globex', tenantVerifiedAt: '2026-01-01T00:00:00.000Z', role: 'employee', passwordHash: 'unused', deleted: false },
      { id: 3, email: 'admin@wellwork.example', company: 'WellWork', role: 'admin', passwordHash: 'unused', deleted: false },
      { id: 4, email: 'rh@acme.example', company: 'ACME', tenantId: 'tenant-acme', tenantVerifiedAt: '2026-01-01T00:00:00.000Z', role: 'rh', passwordHash: 'unused', deleted: false },
      { id: 5, email: 'coach@wellwork.example', company: 'WellWork', role: 'coach', passwordHash: 'unused', deleted: false },
      { id: 6, email: 'unverified@example.test', company: 'ACME', tenantId: null, tenantVerifiedAt: null, role: 'employee', passwordHash: 'unused', deleted: false },
    ],
    sessions: [
      { token: 'employee-token', userId: 1, createdAt: new Date().toISOString(), expiresAt, revokedAt: null },
      { token: 'admin-token', userId: 3, createdAt: new Date().toISOString(), expiresAt, revokedAt: null },
      { token: 'rh-token', userId: 4, createdAt: new Date().toISOString(), expiresAt, revokedAt: null },
      { token: 'coach-token', userId: 5, createdAt: new Date().toISOString(), expiresAt, revokedAt: null },
      { token: 'unverified-token', userId: 6, createdAt: new Date().toISOString(), expiresAt, revokedAt: null },
    ],
    questionnaires: [{ id: 1, userId: 1, answers: { stress: 5 }, at: new Date().toISOString() }],
    messages: [], sessionsSport: [], exports: [], consents: [],
    coachAssignments: [{ id: 1, coachUserId: 5, employeeUserId: 1, tenantId: 'tenant-acme', verifiedAt: '2026-01-01T00:00:00.000Z', revokedAt: null }],
  }));
}

async function withServer(fn) {
  writeDatabase();
  const app = createApp();
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { await new Promise((resolve) => server.close(resolve)); }
}

async function waitForLog(pattern) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const contents = fs.existsSync(process.env.LOG_FILE) ? fs.readFileSync(process.env.LOG_FILE, 'utf8') : '';
    if (contents.includes(pattern)) return contents;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`log event not written: ${pattern}`);
}

test('SEC-01 refuse les expressions executables et accepte les filtres declares', async () => {
  await withServer(async (base) => {
    const headers = { authorization: 'Bearer rh-token' };
    const attack = encodeURIComponent("(row.auditProof='EXECUTED',row.id===1)");
    const rejected = await fetch(`${base}/api/users?filter=${attack}`, { headers });
    assert.equal(rejected.status, 400);

    const safe = await fetch(`${base}/api/users?role=employee`, { headers });
    assert.equal(safe.status, 200);
    const rows = await safe.json();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].company, 'ACME');
    assert.equal(Object.hasOwn(rows[0], 'auditProof'), false);
  });
});

test('SEC-02 refuse la modification des attributs proteges du compte', async () => {
  await withServer(async (base) => {
    const headers = { authorization: 'Bearer employee-token', 'content-type': 'application/json' };
    const escalation = await fetch(`${base}/api/me`, {
      method: 'PATCH', headers, body: JSON.stringify({ role: 'admin', company: 'Globex' }),
    });
    assert.equal(escalation.status, 400);

    const profileUpdate = await fetch(`${base}/api/me`, {
      method: 'PATCH', headers, body: JSON.stringify({ firstName: 'Alice' }),
    });
    assert.equal(profileUpdate.status, 200);
    const profile = await profileUpdate.json();
    assert.equal(profile.firstName, 'Alice');
    assert.equal(profile.role, 'employee');
    assert.equal(profile.company, 'ACME');

    const exportAttempt = await fetch(`${base}/api/exports/insurer`, { headers });
    assert.equal(exportAttempt.status, 403);
  });
});

test('SEC-03 impose des sessions aleatoires, expirables et revocables', async () => {
  await withServer(async (base) => {
    const user = db.raw().users[0];
    const first = issueToken(user);
    const second = issueToken(user);
    assert.notEqual(first, second);
    assert.match(first, /^[a-f0-9]{64}$/);

    const activeSession = db.raw().sessions.find((session) => session.token === first);
    assert.ok(Date.parse(activeSession.expiresAt) > Date.now());
    assert.equal((await fetch(`${base}/api/me`, { headers: { authorization: `Bearer ${first}` } })).status, 200);

    db.insert('sessions', {
      token: 'expired-token', userId: user.id,
      createdAt: new Date(Date.now() - 120_000).toISOString(),
      expiresAt: new Date(Date.now() - 60_000).toISOString(), revokedAt: null,
    });
    db.insert('sessions', {
      token: 'revoked-token', userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(), revokedAt: new Date().toISOString(),
    });
    assert.equal((await fetch(`${base}/api/me`, { headers: { authorization: 'Bearer expired-token' } })).status, 401);
    assert.equal((await fetch(`${base}/api/me`, { headers: { authorization: 'Bearer revoked-token' } })).status, 401);

    const oldSeedToken = Buffer.from('1.1.1709800000000').toString('base64');
    assert.equal((await fetch(`${base}/api/me`, { headers: { authorization: `Bearer ${oldSeedToken}` } })).status, 401);
  });
});

test('SEC-04 exclut les secrets des journaux', async () => {
  await withServer(async (base) => {
    const password = 'AUDIT_PASSWORD_SENTINEL';
    const email = 'sec04@acme.example';
    const response = await fetch(`${base}/api/register`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, company: 'ACME' }),
    });
    assert.equal(response.status, 201);

    log('info', 'central_redaction_test', { password, nested: { token: password } });
    const contents = await waitForLog('central_redaction_test');
    assert.equal(contents.includes(password), false);
    assert.match(contents, /"password":"\[REDACTED\]"/);
    assert.match(contents, /"token":"\[REDACTED\]"/);
  });
});

test('SEC-05 utilise scrypt et migre un ancien SHA-256 apres connexion valide', async () => {
  await withServer(async (base) => {
    const legacyPassword = 'LegacyPassword!';
    const legacyHash = crypto.createHash('sha256').update(legacyPassword).digest('hex');
    db.update('users', (user) => user.id === 1, { passwordHash: legacyHash });

    const rejected = await fetch(`${base}/api/login`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'employee@acme.example', password: 'wrong' }),
    });
    assert.equal(rejected.status, 401);
    assert.equal(db.raw().users[0].passwordHash, legacyHash);

    const accepted = await fetch(`${base}/api/login`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'employee@acme.example', password: legacyPassword }),
    });
    assert.equal(accepted.status, 200);
    const migrated = db.raw().users[0].passwordHash;
    assert.match(migrated, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    assert.notEqual(migrated, legacyHash);
    assert.equal(db.verifyPassword(legacyPassword, migrated).valid, true);

    const sharedPassword = 'SamePassword!';
    for (const email of ['salt-a@example.test', 'salt-b@example.test']) {
      const response = await fetch(`${base}/api/register`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password: sharedPassword }),
      });
      assert.equal(response.status, 201);
    }
    const hashes = db.raw().users.filter((user) => user.email.startsWith('salt-')).map((user) => user.passwordHash);
    assert.equal(hashes.length, 2);
    assert.notEqual(hashes[0], hashes[1]);
    assert.equal(hashes.every((hash) => db.verifyPassword(sharedPassword, hash).valid), true);
  });
});

test('PRIV-06 exclut les secrets derives de toutes les reponses utilisateur', async () => {
  await withServer(async (base) => {
    const registration = await fetch(`${base}/api/register`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'privacy@example.test', password: 'SecretPassword!' }),
    });
    assert.equal(registration.status, 201);
    const registered = await registration.json();
    const endpoints = [
      registered,
      await (await fetch(`${base}/api/me`, { headers: { authorization: `Bearer ${registered.token}` } })).json(),
      await (await fetch(`${base}/api/users`, { headers: { authorization: 'Bearer rh-token' } })).json(),
      await (await fetch(`${base}/api/users/1`, { headers: { authorization: 'Bearer coach-token' } })).json(),
      await (await fetch(`${base}/api/exports/insurer`, { headers: { authorization: 'Bearer admin-token' } })).json(),
    ];
    for (const payload of endpoints) {
      assert.equal(JSON.stringify(payload).includes('passwordHash'), false);
      assert.equal(JSON.stringify(payload).includes('passwordMigratedAt'), false);
    }
    assert.equal(db.raw().users.some((user) => typeof user.passwordHash === 'string'), true);
  });
});

test('PRIV-01/02/03 applique un refus par defaut et des habilitations verifiees', async () => {
  await withServer(async (base) => {
    const get = (pathName, token) => fetch(`${base}${pathName}`, { headers: { authorization: `Bearer ${token}` } });

    assert.equal((await get('/api/users/2', 'employee-token')).status, 403);
    assert.equal((await get('/api/users', 'employee-token')).status, 403);

    const rhProfile = await get('/api/users/1', 'rh-token');
    assert.equal(rhProfile.status, 200);
    assert.equal(Object.hasOwn(await rhProfile.json(), 'questionnaires'), false);
    assert.equal((await get('/api/users/2', 'rh-token')).status, 403);

    const coachProfile = await get('/api/users/1', 'coach-token');
    assert.equal(coachProfile.status, 200);
    assert.equal((await coachProfile.json()).questionnaires.length, 1);
    assert.equal((await get('/api/users/2', 'coach-token')).status, 403);

    assert.equal((await get('/api/users/1', 'unverified-token')).status, 403);
    assert.equal((await get('/api/users', 'unverified-token')).status, 403);

    db.update('users', (user) => user.id === 4, { tenantId: null, tenantVerifiedAt: null });
    assert.equal((await get('/api/users', 'rh-token')).status, 403);
  });
});

test('PRIV-03 ignore une entreprise declaree ou modifiee pour autoriser des tiers', async () => {
  await withServer(async (base) => {
    const registration = await fetch(`${base}/api/register`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'fake-acme@example.test', password: 'Password!', company: 'ACME' }),
    });
    const { token } = await registration.json();
    assert.equal(registration.status, 201);
    const created = db.raw().users.find((user) => user.email === 'fake-acme@example.test');
    assert.equal(created.tenantId, null);
    assert.equal((await fetch(`${base}/api/users/1`, { headers: { authorization: `Bearer ${token}` } })).status, 403);

    const changed = await fetch(`${base}/api/me`, {
      method: 'PATCH', headers: { authorization: 'Bearer employee-token', 'content-type': 'application/json' },
      body: JSON.stringify({ company: 'Globex' }),
    });
    assert.equal(changed.status, 400);
    assert.equal(db.raw().users.find((user) => user.id === 1).tenantId, 'tenant-acme');
  });
});

test.after(() => {
  for (const file of [process.env.DB_FILE, process.env.LOG_FILE]) {
    try { fs.unlinkSync(file); } catch { /* fichier absent ou encore ferme par Node */ }
  }
});
