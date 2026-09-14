class DomainError extends Error {
  constructor(code, message, details = undefined) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.details = details;
  }
}

class ValidationError extends DomainError {
  constructor(message, details = undefined) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends DomainError {
  constructor(resource, id) {
    super('NOT_FOUND', `${resource} not found`, { resource, id });
    this.name = 'NotFoundError';
  }
}

class ConflictError extends DomainError {
  constructor(message, details = undefined) {
    super('CONFLICT', message, details);
    this.name = 'ConflictError';
  }
}

module.exports = { DomainError, ValidationError, NotFoundError, ConflictError };
