const { ConflictError, NotFoundError, ValidationError } = require('../domain/errors');

function assertUuid(id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new ValidationError('Persistent repository requires UUID ids', { id });
  }
}

function mapRow(row, table) {
  if (!row) return row;
  if (table === 'clients') return { id: row.id, name: row.name };
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    type: row.type,
    stage: row.stage,
    health: row.health,
  };
}

class PostgresRepository {
  constructor({ pool, table }) {
    if (!pool || !table) throw new ValidationError('PostgresRepository requires pool and table');
    if (!['clients', 'projects'].includes(table)) throw new ValidationError('Unsupported repository table', { table });
    this.pool = pool;
    this.table = table;
  }

  async list() {
    const { rows } = await this.pool.query(`select * from ${this.table} order by created_at asc`);
    return rows.map((row) => mapRow(row, this.table));
  }

  async get(id) {
    assertUuid(id);
    const { rows } = await this.pool.query(`select * from ${this.table} where id = $1`, [id]);
    if (!rows[0]) throw new NotFoundError(this.table === 'clients' ? 'Client' : 'Project', id);
    return mapRow(rows[0], this.table);
  }

  async create(record) {
    assertUuid(record.id);
    try {
      if (this.table === 'clients') {
        const { rows } = await this.pool.query(
          'insert into clients (id, name) values ($1, $2) returning *',
          [record.id, record.name],
        );
        return mapRow(rows[0], this.table);
      }
      const { rows } = await this.pool.query(
        `insert into projects (id, client_id, name, type, stage, health)
         values ($1, $2, $3, $4, $5, $6) returning *`,
        [record.id, record.clientId, record.name, record.type || 'GENERAL', record.stage || 'BRIEFING', record.health || 'ON_TRACK'],
      );
      return mapRow(rows[0], this.table);
    } catch (error) {
      if (error.code === '23505') throw new ConflictError('Resource id already exists', { id: record.id });
      if (error.code === '23503') throw new NotFoundError('Related resource', record.clientId);
      throw error;
    }
  }

  async update(id, patch) {
    assertUuid(id);
    const current = await this.get(id);
    const allowed = this.table === 'clients' ? ['name'] : ['clientId', 'name', 'stage', 'health'];
    const fields = allowed.filter((key) => Object.prototype.hasOwnProperty.call(patch, key));
    if (!fields.length) return current;

    const columnMap = { clientId: 'client_id', name: 'name', stage: 'stage', health: 'health' };
    const values = fields.map((key) => patch[key]);
    const assignments = fields.map((key, index) => `${columnMap[key] || key} = $${index + 1}`);
    values.push(id);

    try {
      const { rows } = await this.pool.query(
        `update ${this.table} set ${assignments.join(', ')}, updated_at = now() where id = $${values.length} returning *`,
        values,
      );
      return mapRow(rows[0], this.table) || current;
    } catch (error) {
      if (error.code === '23503') throw new NotFoundError('Related resource', patch.clientId);
      throw error;
    }
  }

  async delete(id) {
    assertUuid(id);
    const current = await this.get(id);
    await this.pool.query(`delete from ${this.table} where id = $1`, [id]);
    return current;
  }
}

module.exports = { PostgresRepository, assertUuid };
