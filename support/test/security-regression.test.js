'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const testId = `${process.pid}-${Date.now()}`;
process.env.DB_FILE = path.join(os.tmpdir(), `wellwork-security-${testId}.json`);
process.env.LOG_FILE = path.join(os.tmpdir(), `wellwork-security-${testId}.log`);
process.env.LOG_STDOUT = '0';

const { createApp } = require('../src/app');

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

test.after(() => {
  for (const file of [process.env.DB_FILE, process.env.LOG_FILE]) {
    try { fs.unlinkSync(file); } catch { /* fichier absent ou encore ferme par Node */ }
  }
});
