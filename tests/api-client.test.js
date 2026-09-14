const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');

function startMockApi() {
  const server = http.createServer((req, res) => {
    const send = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
    if (req.method === 'GET' && req.url === '/health') return send(200, { status: 'ok' });
    if (req.method === 'GET' && req.url === '/api/v1/clients') return send(200, { data: [{ id: 'c1', name: 'Cliente API' }] });
    if (req.method === 'POST' && req.url === '/api/v1/clients') return send(201, { data: { id: 'c2', name: 'Novo Cliente' } });
    if (req.method === 'POST' && req.url === '/api/v1/projects/p1/transition') return send(200, { data: { id: 'p1', stage: 'DIAGNOSIS' } });
    if (req.method === 'GET' && req.url === '/api/v1/projects') return send(200, { data: [{ id: 'p1', name: 'Projeto API' }] });
    send(404, { error: { code: 'NOT_FOUND', message: 'Não encontrado' } });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port })));
}

(async () => {
  const { server, port } = await startMockApi();
  const store = new Map();
  const context = {
    console,
    fetch,
    localStorage: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    window: {}
  };
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'api-client.js'), 'utf8');
  vm.runInContext(source, context);
  const api = context.window.NEXA_API;
  api.setBaseUrl(`http://127.0.0.1:${port}`);

  assert.equal(api.getBaseUrl(), `http://127.0.0.1:${port}`);
  assert.deepEqual(await api.health(), { status: 'ok' });
  assert.deepEqual(await api.clients.list(), { data: [{ id: 'c1', name: 'Cliente API' }] });
  assert.deepEqual(await api.clients.create({ name: 'Novo Cliente' }), { data: { id: 'c2', name: 'Novo Cliente' } });
  assert.deepEqual(await api.projects.list(), { data: [{ id: 'p1', name: 'Projeto API' }] });
  assert.deepEqual(await api.projects.transition('p1', 'DIAGNOSIS'), { data: { id: 'p1', stage: 'DIAGNOSIS' } });

  await assert.rejects(() => api.clients.get('missing'), error => error.status === 404 && error.data.error.code === 'NOT_FOUND');
  server.close();
  console.log('api-client tests: PASS');
})().catch(error => { console.error(error); process.exitCode = 1; });
