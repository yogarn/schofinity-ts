import * as userDataAccess from '@/apps/users/data-access/user';
import type { PatchSchema } from '@/apps/users/domain/dto/PatchRequest';
import { type RegisterSchema } from '@/apps/users/domain/dto/RegisterRequest';
import type { UserResponse } from '@/apps/users/domain/dto/UserResponse';
import type { User } from '@/apps/users/domain/entity/user';
import { AppError } from '@/errors/AppError';
import errorManagement from '@/errors/errorManagement';
import { hashPassword } from '@/libraries/authenticator/bcrypt';
import { ulid } from 'ulid';

export async function get(userId: string): Promise<UserResponse> {
  try {
    const user = await userDataAccess.get(userId);
    return userResponseBuilder(user);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while reading the user: ${error}`, false);
  }
};

export async function getAll(): Promise<UserResponse[]> {
  try {
    const users = await userDataAccess.getAll();
    const usersResponse = users.map((user) => {
      return userResponseBuilder(user);
    });
    return usersResponse;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while reading all users: ${error}`, false);
  }
};

export async function create(userRequest: RegisterSchema): Promise<UserResponse> {
  try {
    const user: User = {
      id: ulid(),
      ...userRequest,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;

    const insertedUser = await userDataAccess.create(user);
    return userResponseBuilder(insertedUser);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while creating the user: ${error}`, false);
  }
};

export async function update(userId: string, userRequest: PatchSchema): Promise<UserResponse> {
  try {
    const user: Partial<User> = { ...userRequest, updatedAt: new Date() };

    if (user.password) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    }

    const updatedUser = await userDataAccess.update(userId, user);
    return userResponseBuilder(updatedUser);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while editing the user: ${error}`, false);
  }
};

export async function remove(userId: string): Promise<UserResponse> {
  try {
    const deletedUser = await userDataAccess.remove(userId);
    return userResponseBuilder(deletedUser);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while deleting the user: ${error}`, false);
  }
};

const userResponseBuilder = (userRequest: User): UserResponse => {
  return {
    id: userRequest.id,
    username: userRequest.username,
    fullName: userRequest.fullName,
    email: userRequest.email,
    createdAt: userRequest.createdAt,
    updatedAt: userRequest.updatedAt,
  };
};
