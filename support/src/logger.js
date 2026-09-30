'use strict';

const fs = require('node:fs');
const path = require('node:path');

const LOG_FILE = process.env.LOG_FILE || path.join(__dirname, '..', 'logs', 'app.log');
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
const stream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

const SENSITIVE_KEY = /(password|passwordHash|token|authorization|cookie|secret)/i;

function redact(value, key = '') {
  if (SENSITIVE_KEY.test(key)) return '[REDACTED]';
  if (Array.isArray(value)) return value.map((item) => redact(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, redact(childValue, childKey)]));
  }
  return value;
}

// Journalisation applicative. On trace largement pour faciliter le support client.
function log(level, event, payload = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...redact(payload) });
  stream.write(line + '\n');
  if (process.env.LOG_STDOUT !== '0') process.stdout.write(line + '\n');
}

module.exports = { log };
