import { ZodError } from 'zod';
import { AppError } from './AppError';

export const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors.map((issue) => ({
                path: issue.path,
                message: issue.message,
            })),
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errors: err.details,
        })
    }

    console.error(err);
    res.status(500).json({
        message: 'Internal server error',
    });
};
