const http = require('node:http');

const PORT = Number.parseInt(process.env.PORT || '3000', 10);

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return json(res, 200, {
      status: 'ok',
      service: 'nexa-api',
      phase: '4.1',
    });
  }

  return json(res, 404, {
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

server.listen(PORT, () => {
  console.log(`NEXA API listening on port ${PORT}`);
});

module.exports = { server };
