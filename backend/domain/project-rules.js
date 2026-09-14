const { ValidationError, ConflictError } = require('./errors');

const STAGES = Object.freeze([
  'BRIEFING',
  'DIAGNOSIS',
  'PROPOSAL',
  'PRODUCTION',
  'QA',
  'DELIVERY',
  'COMPLETED',
]);

const HEALTH = Object.freeze(['ON_TRACK', 'ATTENTION', 'BLOCKED', 'ARCHIVED']);

const ALLOWED_TRANSITIONS = Object.freeze({
  BRIEFING: ['DIAGNOSIS'],
  DIAGNOSIS: ['PROPOSAL'],
  PROPOSAL: ['PRODUCTION'],
  PRODUCTION: ['QA'],
  QA: ['DELIVERY', 'PRODUCTION'],
  DELIVERY: ['COMPLETED'],
  COMPLETED: [],
});

function assertProjectShape(project) {
  if (!project || typeof project !== 'object') {
    throw new ValidationError('Project must be an object');
  }
  if (!project.id || typeof project.id !== 'string') {
    throw new ValidationError('Project id is required');
  }
  if (!project.clientId || typeof project.clientId !== 'string') {
    throw new ValidationError('Project clientId is required');
  }
  if (!project.name || typeof project.name !== 'string' || !project.name.trim()) {
    throw new ValidationError('Project name is required');
  }
  if (!STAGES.includes(project.stage)) {
    throw new ValidationError('Invalid project stage', { stage: project.stage });
  }
  if (project.health !== undefined && !HEALTH.includes(project.health)) {
    throw new ValidationError('Invalid project health', { health: project.health });
  }
}

function assertTransition(from, to) {
  if (!STAGES.includes(from) || !STAGES.includes(to)) {
    throw new ValidationError('Invalid project stage transition', { from, to });
  }
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new ConflictError('Project stage transition is not allowed', { from, to });
  }
}

function transitionProject(project, nextStage) {
  assertProjectShape(project);
  assertTransition(project.stage, nextStage);
  return { ...project, stage: nextStage };
}

module.exports = { STAGES, HEALTH, ALLOWED_TRANSITIONS, assertProjectShape, assertTransition, transitionProject };
