'use strict';

const crypto = require('node:crypto');
const db = require('./db');

const DEFAULT_SESSION_TTL_MS = 60 * 60 * 1000;
const MAX_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function sessionTtlMs() {
  const configured = process.env.SESSION_TTL_MS;
  const ttl = configured === undefined ? DEFAULT_SESSION_TTL_MS : Number(configured);
  if (!Number.isSafeInteger(ttl) || ttl <= 0 || ttl > MAX_SESSION_TTL_MS) {
    throw new RangeError(`SESSION_TTL_MS must be an integer between 1 and ${MAX_SESSION_TTL_MS}`);
  }
  return ttl;
}

function validateSessionConfiguration() {
  sessionTtlMs();
}

// Emission d'un jeton de session.
function issueToken(user) {
  const now = new Date();
  const token = crypto.randomBytes(32).toString('hex');
  db.insert('sessions', {
    token,
    userId: user.id,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + sessionTtlMs()).toISOString(),
    revokedAt: null,
  });
  return token;
}

function currentUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const s = db.query('sessions', (row) => row.token === token)[0];
  const expiresAt = s?.expiresAt ? Date.parse(s.expiresAt) : Number.NaN;
  if (!s || s.revokedAt || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
  const user = db.query('users', (row) => row.id === s.userId)[0];
  return user && !user.deleted ? user : null;
}

function requireAuth(req, res, next) {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });
  req.user = user;
  next();
}

// Verifie le role administrateur.
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'authentication required' });
  if (req.user.role !== 'admin' && req.user.role !== 'rh') {
    return res.status(403).json({ error: 'forbidden' });
  }
  next();
}

function revokeUserSessions(userId) {
  return db.update(
    'sessions',
    (session) => session.userId === userId && !session.revokedAt,
    { revokedAt: new Date().toISOString() },
  );
}

module.exports = { issueToken, currentUser, requireAuth, requireAdmin, revokeUserSessions, validateSessionConfiguration };
