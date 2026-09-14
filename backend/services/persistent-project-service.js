const { ValidationError } = require('../domain/errors');
const { assertProjectShape, transitionProject } = require('../domain/project-rules');

class PersistentProjectService {
  constructor(projectRepository, clientRepository) {
    this.projects = projectRepository;
    this.clients = clientRepository;
  }

  async list() {
    return this.projects.list();
  }

  async get(id) {
    return this.projects.get(id);
  }

  async create(project) {
    assertProjectShape(project);
    await this.clients.get(project.clientId);
    return this.projects.create(project);
  }

  async update(id, patch) {
    const current = await this.projects.get(id);
    const candidate = { ...current, ...patch, id: current.id };
    assertProjectShape(candidate);
    if (patch.clientId && patch.clientId !== current.clientId) await this.clients.get(patch.clientId);
    return this.projects.update(id, patch);
  }

  async transition(id, nextStage) {
    if (!nextStage || typeof nextStage !== 'string') throw new ValidationError('nextStage is required');
    const current = await this.projects.get(id);
    const updated = transitionProject(current, nextStage);
    return this.projects.update(id, { stage: updated.stage });
  }
}

module.exports = { PersistentProjectService };
