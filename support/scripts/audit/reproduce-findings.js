'use strict';

// Pin the application under audit without changing its historical scenarios.
// historical-harness.js is the original script, preserved byte for byte.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync, execFileSync } = require('node:child_process');
const { createBaselineSnapshot } = require('./baseline-snapshot');
const { validateObservations } = require('./validate-observations');

const root = path.resolve(__dirname, '..', '..');
const HARNESS_BLOB = 'f27089f1231551c9e0c0fc933b46b2e8ade43a0c';

function main() {
  const snapshot = createBaselineSnapshot(root);
  try {
    const harness = fs.readFileSync(path.join(__dirname, 'historical-harness.js'));
    const normalized = Buffer.from(harness.toString('utf8').replace(/\r\n/g, '\n'));
    const digest = (bytes) => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    const verifiedHarness = [harness, normalized].find((bytes) => digest(bytes) === HARNESS_BLOB);
    if (!verifiedHarness) throw new Error('Historical harness changed; review its provenance before executing it');
    const readLock = (directory) => JSON.stringify(JSON.parse(fs.readFileSync(path.join(directory, 'package-lock.json'), 'utf8')));
    if (readLock(root) !== readLock(snapshot.workCopy)) throw new Error('Baseline and installed-project lockfiles differ; use a separate baseline-compatible clone');
    const modules = path.join(root, 'node_modules');
    if (!fs.existsSync(modules)) throw new Error('Run npm ci --ignore-scripts in support/ first');
    fs.symlinkSync(modules, path.join(snapshot.workCopy, 'node_modules'), 'junction');
    const runner = path.join(snapshot.workCopy, 'scripts', 'audit', 'historical-harness.js');
    fs.mkdirSync(path.dirname(runner), { recursive: true });
    fs.writeFileSync(runner, verifiedHarness);
    const child = spawnSync(process.execPath, [runner], {
      cwd: snapshot.workCopy,
      env: { ...process.env, AUDIT_KEEP_TEMP: '0' },
      encoding: 'utf8', timeout: 60_000, maxBuffer: 2 * 1024 * 1024,
    });
    if (child.error || child.status !== 0) throw new Error(`Historical harness failed: ${child.error?.message || child.status}; no findings are confirmed`);
    let original;
    try { original = JSON.parse(child.stdout); } catch { throw new Error('Historical harness did not produce valid JSON; no findings are confirmed'); }
    const { findings, failed } = validateObservations(original.findings);
    const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    const result = {
      baselineCommit: snapshot.baselineCommit,
      sourceMode: 'verified-git-objects',
      sourceFiles: snapshot.sourceFiles,
      harnessBlob: HARNESS_BLOB,
      runner: { commit: git(['rev-parse', 'HEAD']), trackedChangesPresent: Boolean(git(['status', '--porcelain', '--untracked-files=no'])) },
      executedAt: new Date().toISOString(),
      runtime: { node: process.version, platform: process.platform },
      isolation: original.isolation,
      findings,
      summary: { expectedDynamicFindings: 12, expectedStaticFindings: 1, failed },
    };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = failed.length ? 1 : 0;
  } finally {
    fs.rmSync(snapshot.auditRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
}

try { main(); } catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
