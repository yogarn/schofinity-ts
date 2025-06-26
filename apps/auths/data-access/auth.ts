import sql from '@/databases/postgres';
import { AppError } from '@/errors/AppError';
import errorManagement from '@/errors/errorManagement';
import type { Session } from '../domain/entity/session';

export async function getSession(userId: string, refreshToken: string): Promise<Session | null> {
  try {
    const [sessions] = await sql<Session[]>`
      SELECT id, token, user_id, created_at, expires_at FROM sessions
      WHERE user_id = ${userId} AND token = ${refreshToken} AND expires_at > NOW()
      LIMIT 1
    `;

    if (!sessions) {
      return null;
    }

    return sessions;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while checking sessions: ${error}`, false);
  }
}

export async function createSession(session: Session): Promise<Session> {
  try {
    const [insertedSession] = await sql<Session[]>`
      INSERT INTO sessions
        ${sql(session)}
      RETURNING id, token, user_id
    `;

    return insertedSession;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while creating session: ${error}`, false);
  }
}
