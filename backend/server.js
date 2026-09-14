const http = require('node:http');
const { randomUUID } = require('node:crypto');
const { MemoryRepository } = require('./repositories/memory-repository');
const { ProjectService } = require('./services/project-service');
const { DomainError, ValidationError } = require('./domain/errors');

const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const clients = new MemoryRepository();
const projects = new MemoryRepository();
const projectService = new ProjectService(projects, clients);

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new ValidationError('Request body too large'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(new ValidationError('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function resourceId(pathname, resource) {
  const match = pathname.match(new RegExp(`^/api/v1/${resource}/([^/]+)$`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const { pathname } = url;

  if (req.method === 'GET' && pathname === '/health') {
    return json(res, 200, { status: 'ok', service: 'nexa-api', phase: '4.4' });
  }

  if (!pathname.startsWith('/api/v1/')) {
    return json(res, 404, { error: { code: 'NOT_FOUND', message: 'Route not found' } });
  }

  const body = ['POST', 'PATCH'].includes(req.method) ? await parseBody(req) : {};

  if (req.method === 'GET' && pathname === '/api/v1/clients') {
    return json(res, 200, { data: clients.list() });
  }
  if (req.method === 'POST' && pathname === '/api/v1/clients') {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) throw new ValidationError('Client name is required');
    const client = clients.create({ id: body.id || randomUUID(), name: body.name.trim() });
    return json(res, 201, { data: client });
  }

  const clientId = resourceId(pathname, 'clients');
  if (clientId) {
    if (req.method === 'GET') return json(res, 200, { data: clients.get(clientId) });
    if (req.method === 'PATCH') {
      if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) throw new ValidationError('Client name must be a non-empty string');
      return json(res, 200, { data: clients.update(clientId, body) });
    }
  }

  if (req.method === 'GET' && pathname === '/api/v1/projects') {
    return json(res, 200, { data: projectService.list() });
  }
  if (req.method === 'POST' && pathname === '/api/v1/projects') {
    const project = {
      id: body.id || randomUUID(),
      clientId: body.clientId,
      name: body.name,
      stage: body.stage || 'BRIEFING',
      health: body.health || 'ON_TRACK',
    };
    return json(res, 201, { data: projectService.create(project) });
  }

  const transitionMatch = pathname.match(/^\/api\/v1\/projects\/([^/]+)\/transition$/);
  if (req.method === 'POST' && transitionMatch) {
    const id = decodeURIComponent(transitionMatch[1]);
    return json(res, 200, { data: projectService.transition(id, body.nextStage) });
  }

  const projectId = resourceId(pathname, 'projects');
  if (projectId) {
    if (req.method === 'GET') return json(res, 200, { data: projectService.get(projectId) });
    if (req.method === 'PATCH') return json(res, 200, { data: projectService.update(projectId, body) });
  }

  return json(res, 404, { error: { code: 'NOT_FOUND', message: 'Route not found' } });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    if (error instanceof DomainError) {
      const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'CONFLICT' ? 409 : 400;
      return json(res, status, { error: { code: error.code, message: error.message, details: error.details } });
    }
    console.error(error);
    return json(res, 500, { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`NEXA API listening on port ${PORT}`));
}

module.exports = { server, clients, projects, projectService, handle };
