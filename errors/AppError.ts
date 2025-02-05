export class AppError extends Error {
  public error: { message: string; status: number };
  public statusCode: number;
  public isOperational: boolean;

  constructor(error: { message: string; status: number }, message?: string, isOperational: boolean = true) {
    super(message || error.message);
    this.error = error;
    this.statusCode = error.status;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
