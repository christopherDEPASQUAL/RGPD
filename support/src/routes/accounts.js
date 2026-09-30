'use strict';

const express = require('express');
const db = require('../db');
const { log } = require('../logger');
const { issueToken, requireAuth, revokeUserSessions } = require('../auth');
const { userWithoutSecrets } = require('../presenters');

const router = express.Router();

// Inscription d'un salarie.
router.post('/register', (req, res) => {
  const { email, password, firstName, lastName, company, birthDate } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  log('info', 'register_attempt', { email, company });

  if (db.query('users', (row) => row.email === email).length) {
    return res.status(409).json({ error: 'email already used' });
  }
  const user = {
    id: db.nextId('users'),
    email,
    passwordHash: db.hashPassword(password),
    firstName, lastName, company,
    tenantId: null,
    tenantVerifiedAt: null,
    birthDate,
    role: 'employee',
    marketingOptIn: true,
    createdAt: new Date().toISOString(),
    deleted: false,
  };
  db.insert('users', user);
  db.insert('consents', { id: db.nextId('consents'), userId: user.id, marketing: true, thirdParty: true, at: user.createdAt });
  const token = issueToken(user);
  res.status(201).json({ token, user: userWithoutSecrets(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  log('info', 'login_attempt', { email });
  const user = db.query('users', (row) => row.email === email)[0];
  const verification = user && !user.deleted ? db.verifyPassword(password, user.passwordHash) : { valid: false };
  if (!verification.valid) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  if (verification.needsMigration) {
    db.update('users', (row) => row.id === user.id, {
      passwordHash: db.hashPassword(password),
      passwordMigratedAt: new Date().toISOString(),
    });
  }
  const token = issueToken(user);
  res.json({ token, user: userWithoutSecrets(user) });
});

// Profil courant.
router.get('/me', requireAuth, (req, res) => res.json(userWithoutSecrets(req.user)));

// Mise a jour des seuls champs de profil en libre-service.
router.patch('/me', requireAuth, (req, res) => {
  const allowedFields = new Set(['firstName', 'lastName', 'birthDate']);
  const requestedFields = Object.keys(req.body || {});
  if (!requestedFields.length || requestedFields.some((field) => !allowedFields.has(field))) {
    return res.status(400).json({ error: 'unsupported profile field' });
  }
  const patch = Object.fromEntries(requestedFields.map((field) => [field, req.body[field]]));
  db.update('users', (r) => r.id === req.user.id, patch);
  const fresh = db.query('users', (row) => row.id === req.user.id)[0];
  log('info', 'profile_updated', { userId: req.user.id, fields: Object.keys(patch) });
  res.json(userWithoutSecrets(fresh));
});

// Suppression du compte demandee par l'utilisateur.
router.delete('/me', requireAuth, (req, res) => {
  const userId = req.user.id;
  revokeUserSessions(userId);
  db.remove('sessions', (row) => row.userId === userId);
  db.remove('questionnaires', (row) => row.userId === userId);
  db.remove('consents', (row) => row.userId === userId);
  db.remove('messages', (row) => row.from === userId || row.to === userId);
  db.remove('sessionsSport', (row) => row.userId === userId);
  db.remove('coachAssignments', (row) => row.coachUserId === userId || row.employeeUserId === userId);
  db.remove('exports', (row) => row.by === userId);
  db.remove('users', (row) => row.id === userId);
  log('info', 'account_deleted', { userId });
  return res.json({ status: 'account deleted' });
});

module.exports = router;
