/* eslint-disable max-classes-per-file */

class ExtendedError extends Error {
  constructor(message, name, code, details) {
    super(message);
    this.name = name || 'Extended Error';
    this.code = code || 500;
    this.details = details || undefined;
  }
}

class ValidationError extends ExtendedError {
  constructor(message, details) {
    super(message, 'ValidationError', 400, details);
  }
}

class ForbiddenError extends ExtendedError {
  constructor(message) {
    super(message, 'ForbiddenError', 403);
  }
}

class AuthenticationError extends ExtendedError {
  constructor(message) {
    super(message, 'AuthenticationError', 401);
  }
}

class MissingError extends ExtendedError {
  constructor(message) {
    super(message, 'MissingError', 404);
  }
}

class UniquenessError extends ExtendedError {
  constructor(message) {
    super(message, 'UniquenessError', 400);
  }
}

module.exports = {
  ExtendedError,
  ValidationError,
  ForbiddenError,
  AuthenticationError,
  MissingError,
  UniquenessError,
};
