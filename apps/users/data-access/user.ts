import sql from '../../../databases/postgres';
import { AppError } from '../../../errors/AppError';
import { DatabaseConflictError } from '../../../errors/DatabaseConflictError';
import type { User } from '../domain/entity/user';

export const insert = async (user: User): Promise<User> => {
  try {
    const [insertedUser] = await sql<User[]>`
        insert into users
            (id, full_name, username, password, email, created_at, updated_at)
        values
            (${user.id}, ${user.fullName}, ${user.username}, ${user.password}, ${user.email}, ${user.createdAt}, ${user.updatedAt})
        returning full_name, username, password, email, created_at, updated_at
        `;

    return insertedUser;
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error) {
      const err = error as { code: string };

      if (err.code === '23505') {
        throw new DatabaseConflictError('username or email already exists', null);
      }
    }

    throw new AppError('unexpected error occured while inserting the user', 500, error);
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

    return updatedUser;
  } catch (error: unknown) {
    throw new AppError('unexpected error occured while updating the user', 500, error);
  }
};
