const { Pool } = require('pg');
const { MemoryRepository } = require('./repositories/memory-repository');
const { PostgresRepository } = require('./repositories/postgres-repository');
const { ProjectService } = require('./services/project-service');
const { PersistentProjectService } = require('./services/persistent-project-service');

function createDataLayer(env = process.env) {
  if (!env.DATABASE_URL) {
    const clients = new MemoryRepository();
    const projects = new MemoryRepository();
    return {
      mode: 'memory',
      clients,
      projects,
      projectService: new ProjectService(projects, clients),
      pool: null,
      close: async () => {},
    };
  }

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: Number.parseInt(env.DATABASE_POOL_MAX || '5', 10),
    idleTimeoutMillis: Number.parseInt(env.DATABASE_IDLE_TIMEOUT_MS || '10000', 10),
    connectionTimeoutMillis: Number.parseInt(env.DATABASE_CONNECTION_TIMEOUT_MS || '5000', 10),
    ssl: env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  });
  const clients = new PostgresRepository({ pool, table: 'clients' });
  const projects = new PostgresRepository({ pool, table: 'projects' });
  return {
    mode: 'postgres',
    clients,
    projects,
    projectService: new PersistentProjectService(projects, clients),
    pool,
    close: () => pool.end(),
  };
}

module.exports = { createDataLayer };
