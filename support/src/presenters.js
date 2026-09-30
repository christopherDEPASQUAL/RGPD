'use strict';

function userWithoutSecrets(user) {
  if (!user) return user;
  const safe = { ...user };
  delete safe.passwordHash;
  delete safe.passwordMigratedAt;
  return safe;
}

module.exports = { userWithoutSecrets };
