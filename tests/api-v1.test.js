const assert = require('node:assert/strict');
const http = require('node:http');
const { server } = require('../backend/server');

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const requestHeaders = { ...headers };
    if (body !== undefined && !requestHeaders['Content-Type']) requestHeaders['Content-Type'] = 'application/json';
    const req = http.request({ hostname: '127.0.0.1', port: 3099, path, method, headers: requestHeaders }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = { raw }; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body !== undefined) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

(async () => {
  await new Promise((resolve) => server.listen(3099, resolve));
  try {
    let response = await request('GET', '/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.phase, '4.5');

    response = await request('POST', '/api/v1/clients', { id: 'c-test', name: 'API Client' });
    assert.equal(response.status, 201);

    response = await request('POST', '/api/v1/clients', { id: 'c-test', name: 'Duplicate' });
    assert.equal(response.status, 409);

    response = await request('POST', '/api/v1/clients', { name: 'Unknown Field', role: 'ADMIN' });
    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');

    response = await request('PATCH', '/api/v1/clients/c-test', { id: 'cannot-overwrite' });
    assert.equal(response.status, 400);

    response = await request('PATCH', '/api/v1/clients/c-test', {});
    assert.equal(response.status, 400);

    response = await request('GET', '/api/v1/clients/c-test');
    assert.equal(response.status, 200);

    response = await request('POST', '/api/v1/projects', { id: 'p-test', clientId: 'c-test', name: 'API Project' });
    assert.equal(response.status, 201);
    assert.equal(response.body.data.stage, 'BRIEFING');

    response = await request('POST', '/api/v1/projects', { id: 'p-bad-stage', clientId: 'c-test', name: 'Bad', stage: 'NOPE' });
    assert.equal(response.status, 400);

    response = await request('POST', '/api/v1/projects', { id: 'p-bad-health', clientId: 'c-test', name: 'Bad', health: 'NOPE' });
    assert.equal(response.status, 400);

    response = await request('POST', '/api/v1/projects', { id: 'p-invalid', clientId: 'missing', name: 'Invalid' });
    assert.equal(response.status, 404);

    response = await request('POST', '/api/v1/projects/p-test/transition', { nextStage: 'DIAGNOSIS' });
    assert.equal(response.status, 200);

    response = await request('POST', '/api/v1/projects/p-test/transition', { nextStage: 'DELIVERY' });
    assert.equal(response.status, 409);

    response = await request('POST', '/api/v1/projects/p-test/transition', { nextStage: 'DIAGNOSIS', extra: true });
    assert.equal(response.status, 400);

    response = await request('PATCH', '/api/v1/projects/p-test', { id: 'cannot-overwrite' });
    assert.equal(response.status, 400);

    response = await request('PATCH', '/api/v1/projects/p-test', { health: 'INVALID' });
    assert.equal(response.status, 400);

    response = await request('PATCH', '/api/v1/projects/p-test', { clientId: 'missing' });
    assert.equal(response.status, 404);

    response = await request('POST', '/api/v1/clients', { name: 'Wrong Content Type' }, { 'Content-Type': 'text/plain' });
    assert.equal(response.status, 400);

    response = await request('POST', '/api/v1/clients', '{invalid-json');
    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');

    response = await request('GET', '/api/v1/clients/c-missing');
    assert.equal(response.status, 404);

    console.log('PASS: API v1 phase 4.5 validation/security tests');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
