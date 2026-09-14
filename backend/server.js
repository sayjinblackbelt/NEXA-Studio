const http = require('node:http');
const { randomUUID } = require('node:crypto');
const { MemoryRepository } = require('./repositories/memory-repository');
const { ProjectService } = require('./services/project-service');
const { DomainError, ValidationError } = require('./domain/errors');
const { STAGES, HEALTH } = require('./domain/project-rules');

const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const MAX_BODY_BYTES = 1_000_000;
const clients = new MemoryRepository();
const projects = new MemoryRepository();
const projectService = new ProjectService(projects, clients);

const CLIENT_CREATE_FIELDS = new Set(['id', 'name']);
const CLIENT_PATCH_FIELDS = new Set(['name']);
const PROJECT_CREATE_FIELDS = new Set(['id', 'clientId', 'name', 'stage', 'health']);
const PROJECT_PATCH_FIELDS = new Set(['clientId', 'name', 'stage', 'health']);

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function assertPlainObject(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError('Request body must be a JSON object');
  }
}

function assertAllowedFields(body, allowed) {
  const unknown = Object.keys(body).filter((key) => !allowed.has(key));
  if (unknown.length) {
    throw new ValidationError('Unknown request field(s)', { fields: unknown });
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new ValidationError('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!size) return resolve({});
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        const parsed = JSON.parse(raw);
        assertPlainObject(parsed);
        resolve(parsed);
      } catch (error) {
        if (error instanceof ValidationError) reject(error);
        else reject(new ValidationError('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function resourceId(pathname, resource) {
  const match = pathname.match(new RegExp(`^/api/v1/${resource}/([^/]+)$`));
  return match ? decodeURIComponent(match[1]) : null;
}

function requireJsonContentType(req) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw new ValidationError('Content-Type must be application/json');
  }
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const { pathname } = url;
  const hasBody = ['POST', 'PATCH'].includes(req.method);

  if (req.method === 'GET' && pathname === '/health') {
    return json(res, 200, { status: 'ok', service: 'nexa-api', phase: '4.5' });
  }

  if (!pathname.startsWith('/api/v1/')) {
    return json(res, 404, { error: { code: 'NOT_FOUND', message: 'Route not found' } });
  }

  if (hasBody) requireJsonContentType(req);
  const body = hasBody ? await parseBody(req) : {};

  if (req.method === 'GET' && pathname === '/api/v1/clients') {
    return json(res, 200, { data: clients.list() });
  }
  if (req.method === 'POST' && pathname === '/api/v1/clients') {
    assertAllowedFields(body, CLIENT_CREATE_FIELDS);
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      throw new ValidationError('Client name is required');
    }
    if (body.id !== undefined && (typeof body.id !== 'string' || !body.id.trim())) {
      throw new ValidationError('Client id must be a non-empty string');
    }
    const client = clients.create({ id: body.id || randomUUID(), name: body.name.trim() });
    return json(res, 201, { data: client });
  }

  const clientId = resourceId(pathname, 'clients');
  if (clientId) {
    if (req.method === 'GET') return json(res, 200, { data: clients.get(clientId) });
    if (req.method === 'PATCH') {
      assertAllowedFields(body, CLIENT_PATCH_FIELDS);
      if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
        throw new ValidationError('Client name must be a non-empty string');
      }
      if (Object.keys(body).length === 0) throw new ValidationError('At least one field is required');
      if (body.name !== undefined) body.name = body.name.trim();
      return json(res, 200, { data: clients.update(clientId, body) });
    }
  }

  if (req.method === 'GET' && pathname === '/api/v1/projects') {
    return json(res, 200, { data: projectService.list() });
  }
  if (req.method === 'POST' && pathname === '/api/v1/projects') {
    assertAllowedFields(body, PROJECT_CREATE_FIELDS);
    if (body.id !== undefined && (typeof body.id !== 'string' || !body.id.trim())) {
      throw new ValidationError('Project id must be a non-empty string');
    }
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
    assertAllowedFields(body, new Set(['nextStage']));
    const id = decodeURIComponent(transitionMatch[1]);
    return json(res, 200, { data: projectService.transition(id, body.nextStage) });
  }

  const projectId = resourceId(pathname, 'projects');
  if (projectId) {
    if (req.method === 'GET') return json(res, 200, { data: projectService.get(projectId) });
    if (req.method === 'PATCH') {
      assertAllowedFields(body, PROJECT_PATCH_FIELDS);
      if (Object.keys(body).length === 0) throw new ValidationError('At least one field is required');
      if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
        throw new ValidationError('Project name must be a non-empty string');
      }
      if (body.clientId !== undefined && (typeof body.clientId !== 'string' || !body.clientId.trim())) {
        throw new ValidationError('Project clientId must be a non-empty string');
      }
      if (body.stage !== undefined && !STAGES.includes(body.stage)) {
        throw new ValidationError('Invalid project stage', { stage: body.stage });
      }
      if (body.health !== undefined && !HEALTH.includes(body.health)) {
        throw new ValidationError('Invalid project health', { health: body.health });
      }
      if (body.name !== undefined) body.name = body.name.trim();
      if (body.clientId !== undefined) body.clientId = body.clientId.trim();
      return json(res, 200, { data: projectService.update(projectId, body) });
    }
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
