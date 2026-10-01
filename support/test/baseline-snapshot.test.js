'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createBaselineSnapshot } = require('../scripts/audit/baseline-snapshot');

function withRepository(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'wellwork-snapshot-test-'));
  const support = path.join(root, 'support');
  const git = (...args) => execFileSync('git', args, {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_AUTHOR_NAME: 'Audit test', GIT_AUTHOR_EMAIL: 'audit@example.invalid', GIT_COMMITTER_NAME: 'Audit test', GIT_COMMITTER_EMAIL: 'audit@example.invalid' },
  }).trim();
  try {
    git('init', '-q');
    for (const name of ['src/app.js', 'src/db.js', 'src/auth.js', 'db/seed.js', 'public/index.html', 'package.json', 'package-lock.json']) {
      const file = path.join(support, name);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, `baseline:${name}\n`);
    }
    // Even tracked data outside the input allowlist must not be extracted.
    fs.writeFileSync(path.join(support, 'db/wellwork.json'), 'private-fixture\n');
    git('add', 'support');
    git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'baseline fixture');
    run({ root, support, git, commit: git('rev-parse', 'HEAD') });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('audit snapshot reads the specified commit despite later commits and dirty files', () => {
  withRepository(({ support, git, commit }) => {
    const app = path.join(support, 'src/app.js');
    fs.writeFileSync(app, 'corrected version\n');
    git('add', 'support/src/app.js');
    git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'later fixture');
    fs.writeFileSync(app, 'uncommitted version\n');
    const headBefore = git('rev-parse', 'HEAD');
    const statusBefore = git('status', '--porcelain');
    const snapshot = createBaselineSnapshot(support, commit);
    try {
      assert.equal(snapshot.baselineCommit, commit);
      assert.equal(fs.readFileSync(path.join(snapshot.workCopy, 'src/app.js'), 'utf8'), 'baseline:src/app.js\n');
      assert.equal(snapshot.sourceFiles.length, 7);
      assert.ok(snapshot.sourceFiles.every(({ blobSha }) => /^[a-f0-9]{40}$/.test(blobSha)));
      assert.equal(fs.existsSync(path.join(snapshot.workCopy, 'db/wellwork.json')), false);
      assert.equal(fs.readFileSync(app, 'utf8'), 'uncommitted version\n');
      assert.equal(git('rev-parse', 'HEAD'), headBefore);
      assert.equal(git('status', '--porcelain'), statusBefore);
    } finally {
      fs.rmSync(snapshot.auditRoot, { recursive: true, force: true });
    }
  });
});

test('audit snapshot refuses missing commits instead of using current files', () => {
  withRepository(({ support }) => {
    assert.throws(() => createBaselineSnapshot(support, '0'.repeat(40)), /unavailable/);
    assert.throws(() => createBaselineSnapshot(support, 'HEAD'), /explicit 40-character/);
  });
});

test('audit snapshot rejects symbolic-link entries', () => {
  withRepository(({ support, git }) => {
    const blob = git('hash-object', '-w', 'support/src/app.js');
    git('update-index', '--add', '--cacheinfo', `120000,${blob},support/src/link.js`);
    git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'symlink fixture');
    const commit = git('rev-parse', 'HEAD');
    assert.throws(() => createBaselineSnapshot(support, commit), /Unsupported file/);
  });
});
