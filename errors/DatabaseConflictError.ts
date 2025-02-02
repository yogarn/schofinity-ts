import { AppError } from "./AppError";

export class DatabaseConflictError extends AppError {
    constructor(message: string, details: string = '') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = 409;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
