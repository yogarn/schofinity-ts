export class AppError extends Error {
  public statusCode: number;
  public details: string;

  constructor(message: string, statusCode: number = 500, details: string = '') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
