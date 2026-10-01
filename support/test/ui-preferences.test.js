'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('interface recharge et reinitialise les preferences lors des changements de compte', async () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);

  const elements = Object.fromEntries([
    'email', 'password', 'marketing', 'thirdParty', 'out',
  ].map((id) => [id, { value: '', checked: false, textContent: '' }]));
  const listeners = {};
  const storage = new Map([['token', 'returning-token']]);
  const preferenceByToken = {
    'returning-token': { marketing: true, thirdParty: true },
    'first-token': { marketing: true, thirdParty: false },
    'second-token': { marketing: false, thirdParty: true },
  };

  const context = {
    console,
    JSON,
    document: { getElementById: (id) => elements[id] },
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
    window: { addEventListener: (event, callback) => { listeners[event] = callback; } },
    fetch: async (url, options = {}) => {
      if (url === '/api/login') {
        const email = JSON.parse(options.body).email;
        return { json: async () => ({ token: email.startsWith('first') ? 'first-token' : 'second-token' }) };
      }
      if (url === '/api/preferences') {
        const currentToken = options.headers.authorization.replace('Bearer ', '');
        if (currentToken === 'second-token') {
          assert.equal(elements.marketing.checked, false);
          assert.equal(elements.thirdParty.checked, false);
        }
        return { json: async () => preferenceByToken[currentToken] };
      }
      throw new Error(`unexpected request: ${url}`);
    },
  };
  vm.runInNewContext(script, context, { filename: 'public/index.html' });

  await listeners.DOMContentLoaded();
  assert.equal(elements.marketing.checked, true);
  assert.equal(elements.thirdParty.checked, true);

  elements.email.value = 'first@example.test';
  await context.login();
  assert.equal(storage.get('token'), 'first-token');
  assert.equal(elements.marketing.checked, true);
  assert.equal(elements.thirdParty.checked, false);

  elements.email.value = 'second@example.test';
  await context.login();
  assert.equal(storage.get('token'), 'second-token');
  assert.equal(elements.marketing.checked, false);
  assert.equal(elements.thirdParty.checked, true);
});
