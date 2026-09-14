const { ValidationError } = require('../domain/errors');
const { assertProjectShape, transitionProject } = require('../domain/project-rules');

class ProjectService {
  constructor(projectRepository, clientRepository) {
    this.projects = projectRepository;
    this.clients = clientRepository;
  }

  list() {
    return this.projects.list();
  }

  get(id) {
    return this.projects.get(id);
  }

  create(project) {
    assertProjectShape(project);
    this.clients.get(project.clientId);
    return this.projects.create(project);
  }

  update(id, patch) {
    const current = this.projects.get(id);
    const candidate = { ...current, ...patch, id: current.id };
    assertProjectShape(candidate);
    if (patch.clientId && patch.clientId !== current.clientId) {
      this.clients.get(patch.clientId);
    }
    return this.projects.update(id, patch);
  }

  transition(id, nextStage) {
    if (!nextStage || typeof nextStage !== 'string') {
      throw new ValidationError('nextStage is required');
    }
    const current = this.projects.get(id);
    const updated = transitionProject(current, nextStage);
    return this.projects.update(id, { stage: updated.stage });
  }
}

module.exports = { ProjectService };
