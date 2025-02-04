import { ulid } from 'ulid';
import { AppError } from '../../../../errors/AppError';
import { DatabaseConflictError } from '../../../../errors/DatabaseConflictError';
import { insert, update } from '../../data-access/user';
import type { PatchSchema } from '../dto/PatchRequest';
import { type RegisterSchema } from '../dto/RegisterRequest';
import type { UserResponse } from '../dto/UserResponse';
import type { User } from '../entity/user';

export const create = async (userRequest: RegisterSchema): Promise<UserResponse> => {
  try {
    const user: User = {
      id: ulid(),
      ...userRequest,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertedUser = await insert(user);
    return userResponseBuilder(insertedUser);
  } catch (error) {
    if (error instanceof DatabaseConflictError) {
      throw error;
    }

    throw new AppError('unexpected error occured while creating the user', 500, error);
  }
};

export const edit = async (userId: string, userRequest: PatchSchema): Promise<UserResponse> => {
  try {
    const user: Partial<User> = { ...userRequest, updatedAt: new Date() };
    const updatedUser = await update(userId, user);
    return userResponseBuilder(updatedUser);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('unexpected error occured while editing the user', 500, error);
  }
};

const userResponseBuilder = (userRequest: User): UserResponse => {
  return {
    username: userRequest.username,
    fullName: userRequest.fullName,
    email: userRequest.email,
    createdAt: userRequest.createdAt,
    updatedAt: userRequest.updatedAt,
  };
};
