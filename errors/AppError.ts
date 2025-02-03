export class AppError extends Error {
  public statusCode: number;
  public details: unknown;

  constructor(message: string, statusCode: number = 500, details: unknown = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
