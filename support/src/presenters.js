'use strict';

const SELF_PROFILE_FIELDS = [
  'id', 'email', 'firstName', 'lastName', 'company', 'birthDate',
  'role', 'marketingOptIn', 'createdAt',
];
const DIRECTORY_PROFILE_FIELDS = ['id', 'email', 'firstName', 'lastName', 'company', 'role'];

function selectFields(value, fields) {
  if (!value) return value;
  return Object.fromEntries(fields
    .filter((field) => Object.hasOwn(value, field))
    .map((field) => [field, value[field]]));
}

function userWithoutSecrets(user) {
  return selectFields(user, SELF_PROFILE_FIELDS);
}

function directoryUser(user) {
  return selectFields(user, DIRECTORY_PROFILE_FIELDS);
}

module.exports = { userWithoutSecrets, directoryUser };
