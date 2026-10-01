'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'wellwork-followup-'));
process.env.DB_FILE = path.join(root, 'db.json');
process.env.LOG_FILE = path.join(root, 'app.log');
process.env.LOG_STDOUT = '0';
const { createApp } = require('../src/app');
const db = require('../src/db');
const { log } = require('../src/logger');

async function withServer(run) {
  fs.writeFileSync(process.env.DB_FILE, JSON.stringify({
    users: [], sessions: [], questionnaires: [], messages: [], sessionsSport: [],
    exports: [], consents: [], coachAssignments: [],
  }));
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}

async function request(base, route, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers['content-type'] = 'application/json';
  const response = await fetch(`${base}${route}`, {
    method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, body: await response.json() };
}

async function flushedLogs(marker) {
  // A later marker on the same stream is a bounded flush barrier for earlier events.
  log('info', marker, {});
  for (let attempt = 0; attempt < 100; attempt++) {
    const contents = fs.existsSync(process.env.LOG_FILE) ? fs.readFileSync(process.env.LOG_FILE, 'utf8') : '';
    if (contents.includes(marker)) return contents;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error('Log barrier was not written within one second');
}

function assertNoPrivateProperties(value) {
  if (!value || typeof value !== 'object') return;
  const forbidden = new Set(['password', 'passwordHash', 'passwordMigratedAt', 'tenantId', 'tenantVerifiedAt']);
  for (const [key, child] of Object.entries(value)) {
    assert.equal(forbidden.has(key), false, `Private property leaked: ${key}`);
    assertNoPrivateProperties(child);
  }
}

test('SEC-04 keeps passwords out of successful and failed authentication logs', async () => {
  await withServer(async (base) => {
    const email = 'log-followup@example.invalid';
    const correct = 'FOLLOWUP_CORRECT_SENTINEL';
    const wrong = 'FOLLOWUP_WRONG_SENTINEL';
    const absent = 'FOLLOWUP_ABSENT_USER_SENTINEL';
    const registration = await request(base, '/api/register', { method: 'POST', body: { email, password: correct } });
    assert.equal(registration.status, 201);
    const success = await request(base, '/api/login', { method: 'POST', body: { email, password: correct } });
    assert.equal(success.status, 200);
    const failure = await request(base, '/api/login', { method: 'POST', body: { email, password: wrong } });
    assert.equal(failure.status, 401);
    const unknown = await request(base, '/api/login', { method: 'POST', body: { email: 'missing@example.invalid', password: absent } });
    assert.equal(unknown.status, 401);
    const contents = await flushedLogs('followup_authentication_complete');
    assert.match(contents, /register_attempt/);
    assert.ok((contents.match(/login_attempt/g) || []).length >= 3);
    for (const sentinel of [correct, wrong, absent]) assert.equal(contents.includes(sentinel), false);
  });
});

test('PRIV-06 excludes private fields from successful login, self-profile and profile-update responses', async () => {
  await withServer(async (base) => {
    const email = 'output-followup@example.invalid';
    const password = 'FOLLOWUP_OUTPUT_SENTINEL';
    const registration = await request(base, '/api/register', { method: 'POST', body: { email, password } });
    assert.equal(registration.status, 201);
    const userId = registration.body.user.id;
    assertNoPrivateProperties(registration.body);
    // Ensure exclusions are meaningful: the source really has the private fields.
    db.update('users', (row) => row.id === userId, {
      tenantId: 'test-only-tenant', tenantVerifiedAt: '2026-01-01T00:00:00.000Z',
      passwordMigratedAt: '2026-01-01T00:00:00.000Z',
    });
    const login = await request(base, '/api/login', { method: 'POST', body: { email, password } });
    assert.equal(login.status, 200);
    assert.equal(login.body.user.id, userId);
    assert.ok(login.body.token);
    assertNoPrivateProperties(login.body);
    const token = login.body.token;
    for (const route of ['/api/me', `/api/users/${userId}`]) {
      const profile = await request(base, route, { token });
      assert.equal(profile.status, 200);
      assert.equal(profile.body.id, userId);
      assert.equal(profile.body.email, email);
      assertNoPrivateProperties(profile.body);
    }
    const updated = await request(base, '/api/me', { method: 'PATCH', token, body: { firstName: 'Audit' } });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.id, userId);
    assert.equal(updated.body.firstName, 'Audit');
    assertNoPrivateProperties(updated.body);
    const stored = db.raw().users.find((row) => row.id === userId);
    assert.match(stored.passwordHash, /^scrypt\$/);
    assert.equal(stored.tenantId, 'test-only-tenant');
    assert.ok(stored.passwordMigratedAt);
  });
});

test.after(() => {
  fs.rmSync(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
});
