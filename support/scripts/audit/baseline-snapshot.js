'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');

const BASELINE_COMMIT = 'e16cedcf0f8adb359621240366c8f0cbb251b8c9';
const INPUTS = ['src', 'db/seed.js', 'public', 'package.json', 'package-lock.json'];

// Read immutable Git objects, never the current application files. No checkout,
// fetch, reset, worktree mutation or read of the user's database is performed.
function createBaselineSnapshot(projectRoot, commit = BASELINE_COMMIT) {
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('An explicit 40-character commit SHA is required');
  const git = (args, encoding = 'utf8') => execFileSync('git', args, {
    cwd: projectRoot, encoding, maxBuffer: 8 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let resolved;
  try {
    resolved = git(['rev-parse', '--verify', `${commit}^{commit}`]).trim();
  } catch {
    throw new Error(`Baseline commit ${commit} is unavailable. Use a Git clone containing its history; no current-code fallback is allowed.`);
  }
  if (resolved !== commit) throw new Error('Resolved baseline does not match the requested commit');
  const prefix = git(['rev-parse', '--show-prefix']).trim();
  const entries = git(['ls-tree', '-r', '-z', '--full-tree', commit, '--', ...INPUTS.map((input) => `${prefix}${input}`)])
    .split('\0').filter(Boolean);
  const auditRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wellwork-baseline-'));
  const workCopy = path.join(auditRoot, 'support');
  const manifest = [];
  try {
    for (const entry of entries) {
      const tab = entry.indexOf('\t');
      const [mode, type, blob] = entry.slice(0, tab).split(' ');
      const repositoryPath = entry.slice(tab + 1);
      const relative = repositoryPath.slice(prefix.length);
      if (tab < 0 || type !== 'blob' || !['100644', '100755'].includes(mode)
          || !repositoryPath.startsWith(prefix) || relative.includes('\\')
          || relative.split('/').some((part) => !part || part === '.' || part === '..')
          || !INPUTS.some((input) => relative === input || relative.startsWith(`${input}/`))) {
        throw new Error('Unsupported file in the selected baseline inputs');
      }
      const bytes = git(['cat-file', 'blob', blob], null);
      const digest = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
      if (digest !== blob) throw new Error(`Git blob verification failed for ${relative}`);
      const destination = path.join(workCopy, ...relative.split('/'));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, bytes);
      manifest.push({ path: repositoryPath, blobSha: blob });
    }
    for (const input of ['src/app.js', 'src/db.js', 'src/auth.js', 'db/seed.js', 'public/index.html', 'package.json', 'package-lock.json']) {
      if (!fs.existsSync(path.join(workCopy, input))) throw new Error(`Baseline input missing: ${input}`);
    }
    return { auditRoot, workCopy, baselineCommit: resolved, sourceFiles: manifest };
  } catch (error) {
    fs.rmSync(auditRoot, { recursive: true, force: true });
    throw error;
  }
}

module.exports = { BASELINE_COMMIT, createBaselineSnapshot };
