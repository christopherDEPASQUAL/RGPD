'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { BASELINE_COMMIT } = require('../scripts/audit/baseline-snapshot');

const root = path.resolve(__dirname, '..');
const documents = ['partie-a', 'partie-b'].flatMap((part) => {
  const directory = path.join(root, 'docs', 'dossier', part);
  return fs.readdirSync(directory).filter((name) => name.endsWith('.md')).map((name) => ({
    name: `${part}/${name}`,
    contents: fs.readFileSync(path.join(directory, name), 'utf8'),
  }));
});
const links = documents.flatMap((doc) => [...doc.contents.matchAll(/\]\(([^)]+)\)/g)]
  .map((match) => ({ document: doc.name, target: match[1] })));

test('historical A/B evidence has no relative links to current application sources', () => {
  for (const link of links) {
    assert.doesNotMatch(link.target, /^(?:\.\.\/)+(?:src|public|db)\//, link.document);
  }
});

test('historical A/B source links pin the baseline and valid Git line ranges', () => {
  const sourceLinks = links.filter(({ target }) => (
    target.startsWith('https://github.com/christopherDEPASQUAL/RGPD/blob/')
    && /\/support\/(?:src|public|db)\//.test(target)
  ));
  assert.ok(sourceLinks.length > 0, 'Source references must not silently disappear');
  const sources = new Map();
  for (const link of sourceLinks) {
    const match = link.target.match(/^https:\/\/github\.com\/christopherDEPASQUAL\/RGPD\/blob\/([a-f0-9]{40})\/(support\/(?:src|public|db)\/[^#]+)#L(\d+)(?:-L(\d+))?$/);
    assert.ok(match, `${link.document}: missing immutable commit or line anchor`);
    const [, commit, file, from, through] = match;
    assert.equal(commit, BASELINE_COMMIT, link.document);
    if (!sources.has(file)) {
      const source = execFileSync('git', ['show', `${commit}:${file}`], {
        cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      });
      sources.set(file, source.trimEnd().split(/\r?\n/));
    }
    const start = Number(from);
    const end = Number(through || from);
    assert.ok(start >= 1 && end >= start && end <= sources.get(file).length, `${link.document}: ${link.target}`);
    assert.ok(sources.get(file).slice(start - 1, end).join('').trim(), 'Range must contain source text');
  }
});
