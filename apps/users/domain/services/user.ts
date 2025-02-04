import { ulid } from 'ulid';
import { AppError } from '../../../../errors/AppError';
import { DatabaseConflictError } from '../../../../errors/DatabaseConflictError';
import { insert } from '../../data-access/user';
import { type RegisterSchema } from '../dto/RegisterRequest';
import type { UserResponse } from '../dto/UserResponse';
import type { User } from '../entity/user';

export const create = async (userRequest: RegisterSchema): Promise<UserResponse> => {
  try {
    const user: User = {
      id: ulid(),
      username: userRequest.username,
      fullName: userRequest.fullName,
      email: userRequest.email,
      password: userRequest.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertedUser = await insert(user);

    const userRespone: UserResponse = {
      username: insertedUser.username,
      fullName: insertedUser.fullName,
      email: insertedUser.email,
      createdAt: insertedUser.createdAt,
      updatedAt: insertedUser.updatedAt,
    };
    return userRespone;
  } catch (error) {
    if (error instanceof DatabaseConflictError) {
      throw error;
    }

    throw new AppError('unexpected error occured while creating the user', 500, error);
  }
};
