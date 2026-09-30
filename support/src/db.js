'use strict';

// Couche d'acces aux donnees (SQLite, sans dependance native : sql.js en memoire persiste sur fichier).
// NOTE PEDAGOGIQUE : ce projet est un support d'audit. Le code reflete des pratiques
// courantes d'une equipe qui a livre vite. Ne pas s'en inspirer pour de la production.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'db', 'wellwork.json');

const COLLECTIONS = ['users', 'sessions', 'questionnaires', 'messages', 'sessionsSport', 'exports', 'consents', 'coachAssignments'];
let data = Object.fromEntries(COLLECTIONS.map((collection) => [collection, []]));

function load() {
  if (fs.existsSync(DB_FILE)) {
    const loaded = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    data = Object.fromEntries(COLLECTIONS.map((collection) => [collection, Array.isArray(loaded[collection]) ? loaded[collection] : []]));
    const invalidatedAt = new Date().toISOString();
    let changed = false;
    for (const consent of data.consents) {
      if (!consent.status) {
        consent.status = 'invalidated';
        consent.invalidatedAt = invalidatedAt;
        consent.invalidationReason = 'legacy-record-without-verifiable-choice';
        changed = true;
      }
    }
    for (const user of data.users) {
      const decisions = data.consents.filter((consent) => consent.userId === user.id && consent.status === 'recorded');
      const latest = decisions.at(-1);
      const expectedMarketing = latest ? latest.marketing : false;
      if (user.marketingOptIn !== expectedMarketing) {
        user.marketingOptIn = expectedMarketing;
        changed = true;
      }
    }
    if (changed) save();
  }
}
function save() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const SCRYPT_KEY_LENGTH = 64;

function hashPassword(pwd) {
  if (typeof pwd !== 'string' || !pwd) throw new TypeError('password must be a non-empty string');
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(pwd, salt, SCRYPT_KEY_LENGTH);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

function verifyPassword(pwd, stored) {
  if (typeof pwd !== 'string' || typeof stored !== 'string') return { valid: false, needsMigration: false };
  if (/^[a-f0-9]{64}$/i.test(stored)) {
    const candidate = crypto.createHash('sha256').update(pwd).digest();
    const legacy = Buffer.from(stored, 'hex');
    return { valid: crypto.timingSafeEqual(candidate, legacy), needsMigration: true };
  }
  const [scheme, saltHex, derivedHex, extra] = stored.split('$');
  if (scheme !== 'scrypt' || extra || !/^[a-f0-9]{32}$/i.test(saltHex) || !/^[a-f0-9]{128}$/i.test(derivedHex)) {
    return { valid: false, needsMigration: false };
  }
  const candidate = crypto.scryptSync(pwd, Buffer.from(saltHex, 'hex'), SCRYPT_KEY_LENGTH);
  const expected = Buffer.from(derivedHex, 'hex');
  return { valid: crypto.timingSafeEqual(candidate, expected), needsMigration: false };
}

// Recherche interne avec un predicat construit par le serveur.
// Les entrees HTTP ne doivent jamais etre interpretees comme du code.
function query(collection, predicate) {
  const rows = data[collection] || [];
  if (!predicate) return rows;
  if (typeof predicate !== 'function') throw new TypeError('query predicate must be a function');
  return rows.filter(predicate);
}

function insert(collection, row) {
  data[collection].push(row);
  save();
  return row;
}
function update(collection, predicate, patch) {
  let n = 0;
  for (const row of data[collection]) {
    if (predicate(row)) { Object.assign(row, patch); n++; }
  }
  save();
  return n;
}
function remove(collection, predicate) {
  const rows = data[collection] || [];
  const retained = rows.filter((row) => !predicate(row));
  const removed = rows.length - retained.length;
  data[collection] = retained;
  save();
  return removed;
}
function nextId(collection) {
  const rows = data[collection] || [];
  return rows.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
}

module.exports = { load, save, query, insert, update, remove, nextId, hashPassword, verifyPassword, raw: () => data, DB_FILE };
