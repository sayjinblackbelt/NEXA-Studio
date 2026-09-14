const assert = require('node:assert/strict');
const http = require('node:http');
const { server } = require('../backend/server');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: 3099, path, method, headers: { 'Content-Type': 'application/json' } }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  await new Promise((resolve) => server.listen(3099, resolve));
  try {
    let response = await request('GET', '/health');
    assert.equal(response.status, 200);

    response = await request('POST', '/api/v1/clients', { id: 'c-test', name: 'API Client' });
    assert.equal(response.status, 201);
    assert.equal(response.body.data.id, 'c-test');

    response = await request('GET', '/api/v1/clients/c-test');
    assert.equal(response.status, 200);

    response = await request('POST', '/api/v1/projects', { id: 'p-test', clientId: 'c-test', name: 'API Project' });
    assert.equal(response.status, 201);
    assert.equal(response.body.data.stage, 'BRIEFING');

    response = await request('POST', '/api/v1/projects/p-test/transition', { nextStage: 'DIAGNOSIS' });
    assert.equal(response.status, 200);
    assert.equal(response.body.data.stage, 'DIAGNOSIS');

    response = await request('POST', '/api/v1/projects/p-test/transition', { nextStage: 'DELIVERY' });
    assert.equal(response.status, 409);

    response = await request('POST', '/api/v1/projects', { id: 'p-invalid', clientId: 'missing', name: 'Invalid' });
    assert.equal(response.status, 404);

    console.log('PASS: API v1 Clients + Projects smoke tests');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
