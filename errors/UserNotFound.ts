import { AppError } from './AppError';

export class UserNotFound extends AppError {
  constructor(message: string, details: unknown) {
    super(message, 404, details);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
