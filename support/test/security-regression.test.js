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
      { id: 1, email: 'employee@acme.example', company: 'ACME', role: 'employee', passwordHash: 'unused', deleted: false },
      { id: 2, email: 'other@globex.example', company: 'Globex', role: 'employee', passwordHash: 'unused', deleted: false },
    ],
    sessions: [{ token: 'employee-token', userId: 1, createdAt: new Date().toISOString(), expiresAt }],
    questionnaires: [], messages: [], sessionsSport: [], exports: [], consents: [],
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
    const headers = { authorization: 'Bearer employee-token' };
    const attack = encodeURIComponent("(row.auditProof='EXECUTED',row.id===1)");
    const rejected = await fetch(`${base}/api/users?filter=${attack}`, { headers });
    assert.equal(rejected.status, 400);

    const safe = await fetch(`${base}/api/users?company=ACME`, { headers });
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

test.after(() => {
  for (const file of [process.env.DB_FILE, process.env.LOG_FILE]) {
    try { fs.unlinkSync(file); } catch { /* fichier absent ou encore ferme par Node */ }
  }
});
