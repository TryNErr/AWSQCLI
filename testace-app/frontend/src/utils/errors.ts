export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class MathValidationError extends ValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'MathValidationError';
  }
}

export class LogicalValidationError extends ValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'LogicalValidationError';
  }
}

export class LanguageValidationError extends ValidationError {
  constructor(message: string) {
    super(message);
    this.name = 'LanguageValidationError';
  }
}
