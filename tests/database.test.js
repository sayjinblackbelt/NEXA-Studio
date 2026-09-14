const assert = require('node:assert/strict');
const { createDataLayer } = require('../backend/database');

const memory = createDataLayer({});
assert.equal(memory.mode, 'memory');
assert.equal(memory.pool, null);
assert.equal(typeof memory.clients.create, 'function');
assert.equal(typeof memory.projectService.transition, 'function');

const persistent = createDataLayer({ DATABASE_URL: 'postgresql://test:test@localhost:5432/test' });
assert.equal(persistent.mode, 'postgres');
assert.ok(persistent.pool);
assert.equal(typeof persistent.clients.create, 'function');
assert.equal(typeof persistent.projectService.transition, 'function');
persistent.pool.end();

console.log('PASS: database mode selection and repository wiring');
