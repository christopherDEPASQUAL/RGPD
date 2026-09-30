'use strict';

// Configuration de l'application. Reprise telle quelle depuis l'environnement de recette.
module.exports = {
  appName: 'WellWork',
  sessionSecret: 'demo-inert-not-used',
  insurerApiKey: 'ins_demo_not_a_real_key',
  smtp: { host: 'smtp.invalid', user: 'noreply@wellwork.example', pass: 'demo-inert-not-used' },
  retentionDays: null, // pas de purge automatique pour l'instant
};
