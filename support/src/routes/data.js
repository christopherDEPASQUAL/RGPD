'use strict';

const express = require('express');
const db = require('../db');
const { log } = require('../logger');
const { requireAuth, requireAdmin } = require('../auth');
const { userWithoutSecrets, directoryUser } = require('../presenters');

const router = express.Router();

function hasVerifiedTenant(user) {
  return Boolean(user?.tenantId && user?.tenantVerifiedAt);
}

function sharesVerifiedTenant(actor, target) {
  return hasVerifiedTenant(actor) && hasVerifiedTenant(target) && actor.tenantId === target.tenantId;
}

function hasVerifiedCoachAssignment(coach, target) {
  if (coach?.role !== 'coach' || !hasVerifiedTenant(target)) return false;
  return db.query('coachAssignments', (assignment) => (
    assignment.coachUserId === coach.id
    && assignment.employeeUserId === target.id
    && assignment.tenantId === target.tenantId
    && Boolean(assignment.verifiedAt)
    && !assignment.revokedAt
  )).length > 0;
}

// Questionnaire de sante rempli par le salarie.
router.post('/questionnaires', requireAuth, (req, res) => {
  const q = {
    id: db.nextId('questionnaires'),
    userId: req.user.id,
    answers: req.body.answers || {}, // poids, sommeil, stress, antecedents, traitements...
    at: new Date().toISOString(),
  };
  db.insert('questionnaires', q);
  res.status(201).json(q);
});

// Consultation d'un utilisateur par identifiant.
router.get('/users/:id', requireAuth, (req, res) => {
  const requestedId = Number(req.params.id);
  const u = db.query('users', (row) => row.id === requestedId)[0];
  if (!u) return res.status(404).json({ error: 'not found' });
  const isSelf = req.user.id === u.id;
  const rhAccess = req.user.role === 'rh' && sharesVerifiedTenant(req.user, u);
  const coachAccess = hasVerifiedCoachAssignment(req.user, u);
  if (!isSelf && !rhAccess && !coachAccess) return res.status(403).json({ error: 'forbidden' });

  const response = userWithoutSecrets(u);
  if (isSelf || coachAccess) {
    response.questionnaires = db.query('questionnaires', (row) => row.userId === requestedId);
  }
  return res.json(response);
});

// Recherche annuaire pour les coachs et les RH.
router.get('/users', requireAuth, (req, res) => {
  const allowedFilters = new Set(['role']);
  const requestedFilters = Object.keys(req.query);
  if (requestedFilters.some((key) => !allowedFilters.has(key))) {
    return res.status(400).json({ error: 'unsupported filter' });
  }
  let rows;
  if (req.user.role === 'rh' && hasVerifiedTenant(req.user)) {
    rows = db.query('users', (row) => !row.deleted && sharesVerifiedTenant(req.user, row));
  } else if (req.user.role === 'coach') {
    const assignedIds = new Set(db.query('coachAssignments', (assignment) => (
      assignment.coachUserId === req.user.id && Boolean(assignment.verifiedAt) && !assignment.revokedAt
    )).map((assignment) => assignment.employeeUserId));
    rows = db.query('users', (row) => !row.deleted && assignedIds.has(row.id) && hasVerifiedCoachAssignment(req.user, row));
  } else {
    return res.status(403).json({ error: 'forbidden' });
  }
  const filtered = rows.filter((row) => requestedFilters.every((key) => row[key] === req.query[key]));
  return res.json(filtered.map(directoryUser));
});

// Messagerie coach / salarie.
router.post('/messages', requireAuth, (req, res) => {
  const m = { id: db.nextId('messages'), from: req.user.id, to: Number(req.body.to), body: req.body.body, at: new Date().toISOString() };
  db.insert('messages', m);
  res.status(201).json(m);
});
router.get('/messages', requireAuth, (req, res) => {
  res.json(db.query('messages', (row) => row.to === req.user.id || row.from === req.user.id));
});

// Export vers l'assureur partenaire.
router.get('/exports/insurer', requireAuth, requireAdmin, (req, res) => {
  const rows = db.raw().users.map((u) => ({
    ...userWithoutSecrets(u),
    questionnaires: db.query('questionnaires', (row) => row.userId === u.id),
  }));
  db.insert('exports', { id: db.nextId('exports'), by: req.user.id, at: new Date().toISOString(), count: rows.length });
  log('info', 'insurer_export', { by: req.user.id, count: rows.length });
  res.json(rows);
});

module.exports = router;
