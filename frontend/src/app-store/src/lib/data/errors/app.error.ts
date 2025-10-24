import { DomainError } from './domain.error';

export namespace AppErrors {
  export class NotAuthorized extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'You are not authorized.');
      this.message = message || 'You are not authorized.';
    }
  }

  export class InvalidCredentials extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'Incorrect  email or password.');
      this.message = message || 'Incorrect email or password.';
    }
  }

  export class IncorrectIdpCredentials extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'Incorrect credentials.');
      this.message = message || 'Incorrect credentials.';
    }
  }

  export class UnexpectedError extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'Something went wrong. Please try again later.');
      this.message = message || 'Something went wrong. Please try again later.';
    }
  }

  export class UserNotFound extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'This email is not found.');
      this.message = message || 'This email is not found.';
    }
  }

  export class EmailRequired extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'Email is required.');
      this.message = message || 'Email is required.';
    }
  }

  export class NotFoundError extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'Not found.');
      this.message = message || 'Not found.';
    }
  }

  export class ForbiddenError extends Error implements DomainError {
    override readonly message: string;

    constructor(message?: string) {
      super(message || 'You do not have access.');
      this.message = message || 'You do not have access.';
    }
  }
}
