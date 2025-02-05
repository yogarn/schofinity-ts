import sql from '../../../databases/postgres';
import { AppError } from '../../../errors/AppError';
import errorManagement from '../../../errors/errorManagement';
import type { User } from '../domain/entity/user';

export const insert = async (user: User): Promise<User> => {
  try {
    const [insertedUser] = await sql<User[]>`
        INSERT INTO users
            ${sql(user)}
        RETURNING full_name, username, password, email, created_at, updated_at
        `;

    return insertedUser;
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error) {
      const err = error as { code: string };

      if (err.code === '23505') {
        throw new AppError(errorManagement.commonErrors.Conflict, 'username or email already used', true);
      }
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, 'unexpected error occured while inserting the user', false);
  }
};

export const update = async (userId: string, user: Partial<User>): Promise<User> => {
  try {
    const [updatedUser] = await sql<User[]>`
      UPDATE users
      SET ${sql(user)}
      WHERE id = ${userId}
      RETURNING full_name, username, password, email, created_at, updated_at
    `;

    if (!updatedUser) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    return updatedUser;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.NotFound, 'unexpected error occured while updating the user', false);
  }
};
