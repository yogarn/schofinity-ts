import { AppError } from './AppError';

export class DatabaseConflictError extends AppError {
  constructor(message: string, details: unknown) {
    super(message, 409, details);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
