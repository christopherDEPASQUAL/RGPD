'use strict';

const crypto = require('node:crypto');
const db = require('./db');

const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);

// Emission d'un jeton de session.
function issueToken(user) {
  const now = new Date();
  const token = crypto.randomBytes(32).toString('hex');
  db.insert('sessions', {
    token,
    userId: user.id,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
    revokedAt: null,
  });
  return token;
}

function currentUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const s = db.query('sessions', (row) => row.token === token)[0];
  if (!s || s.revokedAt || !s.expiresAt || Date.parse(s.expiresAt) <= Date.now()) return null;
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

module.exports = { issueToken, currentUser, requireAuth, requireAdmin, revokeUserSessions };
