'use strict';

function userWithoutSecrets(user) {
  if (!user) return user;
  const safe = { ...user };
  delete safe.passwordHash;
  delete safe.passwordMigratedAt;
  delete safe.tenantId;
  delete safe.tenantVerifiedAt;
  return safe;
}

function directoryUser(user) {
  const safe = userWithoutSecrets(user);
  return {
    id: safe.id,
    email: safe.email,
    firstName: safe.firstName,
    lastName: safe.lastName,
    company: safe.company,
    role: safe.role,
  };
}

module.exports = { userWithoutSecrets, directoryUser };
