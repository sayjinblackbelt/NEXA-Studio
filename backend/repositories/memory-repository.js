const { ConflictError, NotFoundError } = require('../domain/errors');

class MemoryRepository {
  constructor() {
    this.records = new Map();
  }

  list() {
    return [...this.records.values()].map((record) => ({ ...record }));
  }

  get(id) {
    const record = this.records.get(id);
    if (!record) throw new NotFoundError('Resource', id);
    return { ...record };
  }

  create(record) {
    if (this.records.has(record.id)) {
      throw new ConflictError('Resource id already exists', { id: record.id });
    }
    this.records.set(record.id, { ...record });
    return { ...record };
  }

  update(id, patch) {
    const current = this.get(id);
    const updated = { ...current, ...patch, id };
    this.records.set(id, updated);
    return { ...updated };
  }

  delete(id) {
    this.get(id);
    this.records.delete(id);
  }
}

module.exports = { MemoryRepository };
