const assert = require('node:assert/strict');
const { PostgresRepository } = require('../backend/repositories/postgres-repository');

function mockPool() {
  const calls = [];
  return {
    calls,
    async query(text, params = []) {
      calls.push({ text, params });
      if (text.startsWith('select * from clients where id')) return { rows: [{ id: params[0], name: 'Client DB' }] };
      if (text.startsWith('select * from projects where id')) return { rows: [{ id: params[0], client_id: '11111111-1111-4111-8111-111111111111', name: 'Project DB', type: 'GENERAL', stage: 'BRIEFING', health: 'ON_TRACK' }] };
      if (text.startsWith('select * from clients order')) return { rows: [] };
      if (text.startsWith('select * from projects order')) return { rows: [] };
      if (text.startsWith('insert into clients')) return { rows: [{ id: params[0], name: params[1] }] };
      if (text.startsWith('insert into projects')) return { rows: [{ id: params[0], client_id: params[1], name: params[2], type: params[3], stage: params[4], health: params[5] }] };
      if (text.startsWith('update clients')) return { rows: [{ id: params[1], name: params[0] }] };
      if (text.startsWith('update projects')) return { rows: [{ id: params[params.length - 1], client_id: '11111111-1111-4111-8111-111111111111', name: 'Updated', type: 'GENERAL', stage: 'DIAGNOSIS', health: 'ON_TRACK' }] };
      if (text.startsWith('delete from')) return { rows: [] };
      throw new Error(`Unexpected query: ${text}`);
    },
  };
}

(async () => {
  const pool = mockPool();
  const repo = new PostgresRepository({ pool, table: 'clients' });
  const id = '11111111-1111-4111-8111-111111111111';

  assert.deepEqual(await repo.get(id), { id, name: 'Client DB' });
  assert.deepEqual(await repo.create({ id, name: 'Client DB' }), { id, name: 'Client DB' });
  assert.deepEqual(await repo.update(id, { name: 'Updated' }), { id, name: 'Updated' });
  await repo.delete(id);
  assert.ok(pool.calls.length >= 4);

  await assert.rejects(() => repo.get('c-test'), /UUID ids/);

  const projectRepo = new PostgresRepository({ pool, table: 'projects' });
  const project = await projectRepo.create({ id, clientId: id, name: 'Project DB', stage: 'BRIEFING', health: 'ON_TRACK' });
  assert.equal(project.clientId, id);
  assert.equal(project.stage, 'BRIEFING');

  console.log('PASS: PostgreSQL repository contract tests');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
