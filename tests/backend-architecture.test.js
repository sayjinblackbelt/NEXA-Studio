const assert = require('node:assert/strict');
const { MemoryRepository } = require('../backend/repositories/memory-repository');
const { ProjectService } = require('../backend/services/project-service');
const { ConflictError, ValidationError } = require('../backend/domain/errors');

const clients = new MemoryRepository();
const projects = new MemoryRepository();
clients.create({ id: 'client-1', name: 'Demo Client' });
const service = new ProjectService(projects, clients);

service.create({ id: 'project-1', clientId: 'client-1', name: 'NEXA Demo', stage: 'BRIEFING', health: 'ON_TRACK' });
assert.equal(service.get('project-1').stage, 'BRIEFING');
service.transition('project-1', 'DIAGNOSIS');
assert.equal(service.get('project-1').stage, 'DIAGNOSIS');

assert.throws(() => service.transition('project-1', 'DELIVERY'), ConflictError);
assert.throws(() => service.create({ id: 'project-2', clientId: 'missing', name: 'Invalid', stage: 'BRIEFING' }), /not found/);
assert.throws(() => service.create({ id: 'project-3', clientId: 'client-1', name: '', stage: 'BRIEFING' }), ValidationError);

console.log('PASS: backend domain rules and service boundary');
