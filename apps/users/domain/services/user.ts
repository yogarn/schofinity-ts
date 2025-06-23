import { ulid } from 'ulid';
import config from '../../../../configs';
import { AppError } from '../../../../errors/AppError';
import errorManagement from '../../../../errors/errorManagement';
import { hashPassword, verifyPassword } from '../../../../libraries/authenticator/bcrypt';
import { signToken } from '../../../../libraries/authenticator/jwt';
import { deleteUser, insert, selectAllUser, selectUser, selectUserByEmail, update } from '../../data-access/user';
import type { LoginSchema } from '../dto/LoginRequest';
import type { LoginResponse } from '../dto/LoginResponse';
import type { PatchSchema } from '../dto/PatchRequest';
import { type RegisterSchema } from '../dto/RegisterRequest';
import type { UserResponse } from '../dto/UserResponse';
import type { User } from '../entity/user';

export async function authenticate(loginRequest: LoginSchema): Promise<LoginResponse> {
  try {
    const expiry = config.get('jwt.expiry');
    const user = await selectUserByEmail(loginRequest.email);

    if (!user) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    const verifyStatus = await verifyPassword(loginRequest.password, user.password);
    if (!verifyStatus) {
      throw new AppError(errorManagement.bcryptErrors.InvalidPassword, 'invalid password', true);
    }

    const token = await signToken(user.id, 1);
    const loginResponse: LoginResponse = {
      email: loginRequest.email,
      jwt: token,
      expiredIn: expiry,
    };

    return loginResponse;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occured while authenticate the user: ${error}`, false);
  }
};

export async function readUser(userId: string): Promise<UserResponse> {
  try {
    const user = await selectUser(userId);
    return userResponseBuilder(user);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occured while reading the user: ${error}`, false);
  }
};

export async function readAllUser(): Promise<UserResponse[]> {
  try {
    const users = await selectAllUser();
    const usersResponse = users.map((user) => {
      return userResponseBuilder(user);
    });
    return usersResponse;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occured while reading all users: ${error}`, false);
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

    const insertedUser = await insert(user);
    return userResponseBuilder(insertedUser);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occured while creating the user: ${error}`, false);
  }
};

export async function edit(userId: string, userRequest: PatchSchema): Promise<UserResponse> {
  try {
    const user: Partial<User> = { ...userRequest, updatedAt: new Date() };

    if (user.password) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    }

    const updatedUser = await update(userId, user);
    return userResponseBuilder(updatedUser);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occured while editing the user: ${error}`, false);
  }
};

export async function deleteUserService(userId: string): Promise<UserResponse> {
  try {
    const deletedUser = await deleteUser(userId);
    return userResponseBuilder(deletedUser);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occured while deleting the user: ${error}`, false);
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
