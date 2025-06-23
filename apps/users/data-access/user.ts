import sql from '../../../databases/postgres';
import { AppError } from '../../../errors/AppError';
import errorManagement from '../../../errors/errorManagement';
import type { User } from '../domain/entity/user';

export async function getByEmail(email: string): Promise<User> {
  try {
    const [selectedUser] = await sql<User[]>`
      SELECT id, full_name, username, password, email, created_at, updated_at FROM users
      WHERE email = ${email}
    `;

    if (!selectedUser) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    return selectedUser;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error while selecting the user: ${error}`, false);
  }
};

export async function get(userId: string): Promise<User> {
  try {
    const [selectedUser] = await sql<User[]>`
      SELECT id, full_name, username, password, email, created_at, updated_at FROM users
      WHERE id = ${userId}
    `;

    if (!selectedUser) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    return selectedUser;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error while selecting the user: ${error}`, false);
  }
};

export async function getAll(): Promise<User[]> {
  try {
    const selectedUsers = await sql<User[]>`
      SELECT id, full_name, username, password, email, created_at, updated_at FROM users
    `;

    if (!selectedUsers) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    return selectedUsers;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error while selecting the user: ${error}`, false);
  }
};

export async function create(user: User): Promise<User> {
  try {
    const [insertedUser] = await sql<User[]>`
        INSERT INTO users
            ${sql(user)}
        RETURNING id, full_name, username, password, email, created_at, updated_at
        `;

    return insertedUser;
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error) {
      const err = error as { code: string };

      if (err.code === '23505') {
        throw new AppError(errorManagement.commonErrors.Conflict, 'username or email already used', true);
      }
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occured while inserting the user: ${error}`, false);
  }
};

export async function update(userId: string, user: Partial<User>): Promise<User> {
  try {
    const [updatedUser] = await sql<User[]>`
      UPDATE users
      SET ${sql(user)}
      WHERE id = ${userId}
      RETURNING id, full_name, username, password, email, created_at, updated_at
    `;

    if (!updatedUser) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    return updatedUser;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.NotFound, `unexpected error occured while updating the user: ${error}`, false);
  }
};

export async function remove(userId: string): Promise<User> {
  try {
    const [deletedUser] = await sql<User[]>`
      DELETE FROM users
      WHERE id = ${userId}
      RETURNING id, full_name, username, password, email, created_at, updated_at
    `;

    if (!deletedUser) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    return deletedUser;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.NotFound, `unexpected error occured while deleting the user: ${error}`, false);
  }
};
