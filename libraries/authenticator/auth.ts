import { AppError } from '@/errors/AppError';
import errorManagement from '@/errors/errorManagement';
import { verifyToken } from '@/libraries/authenticator/jwt';
import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader: string | undefined = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(errorManagement.commonErrors.Unauthorized, 'failed to verify bearer token', true);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (typeof decoded === 'string') {
      throw new AppError(errorManagement.jwtErrors.InvalidJwtFormat, 'unable to process payload', true);
    }

    res.locals.users = decoded as JwtPayload;
    return next();
  } catch (error: unknown) {
    return next(error instanceof AppError ? error : new AppError(errorManagement.jwtErrors.InvalidJwt, 'invalid jwt', true));
  }
};
