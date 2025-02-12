import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { gracefulShutdown } from '..';
import { generateTraceId } from '../libraries/logger/tracer';
import logger from '../libraries/logger/winston';
import { AppError } from './AppError';

export const globalErrorHandler = async (err: unknown, req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const traceId = generateTraceId();

  if (err instanceof ZodError) {
    logger.error('validation failed', { details: err, traceId, stack: err.stack });
    res.status(400).json({
      message: 'validation failed',
      errors: traceId,
    });
    return;
  }

  if (err instanceof AppError) {
    logger.error(err.message, { details: err, traceId, stack: err.stack });
    res.status(err.statusCode).json({
      message: err.message,
      errors: traceId,
    });

    if (!err.isOperational) {
      logger.error('non-operational error detected, gracefully shutting down');
      gracefulShutdown();
    }
    return;
  }

  logger.error('internal server error', { details: err, traceId });
  res.status(500).json({
    message: 'Internal server error',
    errors: traceId,
  });

  logger.error('unexpected error detected, gracefully shutting down');
  gracefulShutdown();
  return;
};
