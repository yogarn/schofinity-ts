import * as userDataAccess from '@/apps/users/data-access/user';
import type { PatchSchema } from '@/apps/users/domain/dto/PatchRequest';
import type { RegisterSchema } from '@/apps/users/domain/dto/RegisterRequest';
import type { UserResponse } from '@/apps/users/domain/dto/UserResponse';
import type { User } from '@/apps/users/domain/entity/user';
import * as userService from '@/apps/users/domain/services/user';
import { AppError } from '@/errors/AppError';
import errorManagement from '@/errors/errorManagement';
import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { ulid } from 'ulid';

const id = ulid();
const createdAt = new Date();
const updatedAt = new Date();

describe('User Service Tests', () => {
  afterEach(() => {
    mock.restore();
  });

  test('get user by id', async () => {
    const user: User = {
      id: id,
      email: 'john@mail.com',
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'secret',
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    const getSpy = spyOn(userDataAccess, 'get')
      .mockImplementation(async (userId: string): Promise<User> => ({
        id: userId,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      );

    const getUser = await userService.get(user.id);

    const expectedUser: UserResponse = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    expect(getSpy).toHaveBeenCalled();
    expect(getUser).toMatchObject(expectedUser);
  });

  test('get user throws non-AppError', async () => {
    const getSpy = spyOn(userDataAccess, 'get')
      .mockImplementation(async (userId: string) => {
        throw new Error('something went wrong')
      });

    await expect(userService.get(id)).rejects.toThrow('unexpected error occurred while reading the user: Error: something went wrong');
    expect(getSpy).toHaveBeenCalled();
  });

  test('get user throws AppError', async () => {
    const appError = new AppError(errorManagement.commonErrors.InternalServerError, 'unexpected error occurred while reading the user', false);

    const getSpy = spyOn(userDataAccess, 'get')
      .mockImplementation(async (userId: string) => {
        throw appError;
      });

    await expect(userService.get(id)).rejects.toBe(appError);
    await expect(userService.get(id)).rejects.toBeInstanceOf(AppError);
    expect(getSpy).toHaveBeenCalled();
  });

  test('get all users', async () => {
    const user: User = {
      id: id,
      email: 'john@mail.com',
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'secret',
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    const getAllSpy = spyOn(userDataAccess, 'getAll')
      .mockImplementation(async (): Promise<User[]> => (
        [
          user,
          user
        ]
      )
      );

    const allUsers = await userService.getAll();

    const expectedUser: UserResponse = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    expect(getAllSpy).toHaveBeenCalled();
    expect(allUsers).toHaveLength(2);
    expect(allUsers).toMatchObject([
      expectedUser,
      expectedUser
    ]);
  });

  test('get all user throws non-AppError', async () => {
    const getSpy = spyOn(userDataAccess, 'getAll')
      .mockImplementation(async () => {
        throw new Error('something went wrong')
      });

    await expect(userService.getAll()).rejects.toThrow('unexpected error occurred while reading all users: Error: something went wrong');
    expect(getSpy).toHaveBeenCalled();
  });

  test('get all user throws AppError', async () => {
    const appError = new AppError(errorManagement.commonErrors.InternalServerError, 'unexpected error occurred while reading all users', false);

    const getSpy = spyOn(userDataAccess, 'getAll')
      .mockImplementation(async () => {
        throw appError;
      });

    await expect(userService.getAll()).rejects.toBe(appError);
    await expect(userService.getAll()).rejects.toBeInstanceOf(AppError);
    expect(getSpy).toHaveBeenCalled();
  });

  test('create user', async () => {
    const insertSpy = spyOn(userDataAccess, 'create')
      .mockImplementation(async (user: User): Promise<User> => ({
        ...user,
        id: id,
        createdAt: createdAt,
        updatedAt: updatedAt,
      }));

    const user: RegisterSchema = {
      email: 'john@mail.com',
      fullName: 'John Doe',
      password: 'secret',
      username: 'johndoe',
    };

    const createdUser = await userService.create(user);

    const expectedUser: UserResponse = {
      id: id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      createdAt,
      updatedAt,
    };

    expect(insertSpy).toHaveBeenCalled();
    expect(createdUser).toMatchObject(expectedUser);
  });

  test('create user throws non-AppError', async () => {
    const getSpy = spyOn(userDataAccess, 'create')
      .mockImplementation(async (user: User) => {
        throw new Error('something went wrong')
      });

    const user: RegisterSchema = {
      email: 'john@mail.com',
      fullName: 'John Doe',
      password: 'secret',
      username: 'johndoe',
    };

    await expect(userService.create(user)).rejects.toThrow('unexpected error occurred while creating the user: Error: something went wrong');
    expect(getSpy).toHaveBeenCalled();
  });

  test('create user throws AppError', async () => {
    const appError = new AppError(errorManagement.commonErrors.InternalServerError, 'unexpected error occurred while creating the user', false);

    const getSpy = spyOn(userDataAccess, 'create')
      .mockImplementation(async (user: User) => {
        throw appError;
      });

    const user: RegisterSchema = {
      email: 'john@mail.com',
      fullName: 'John Doe',
      password: 'secret',
      username: 'johndoe',
    };

    await expect(userService.create(user)).rejects.toBe(appError);
    await expect(userService.create(user)).rejects.toBeInstanceOf(AppError);
    expect(getSpy).toHaveBeenCalled();
  });

  test('update user', async () => {
    const editSpy = spyOn(userDataAccess, 'update')
      .mockImplementation(async (userId: string, user: Partial<User>): Promise<User> => ({
        id: userId,
        fullName: user.fullName!,
        username: user.username!,
        password: user.password!,
        email: user.email!,
        createdAt,
        updatedAt,
      })
      );

    const user: PatchSchema = {
      email: 'john@mail.com',
      fullName: 'John Doe',
      password: 'secret',
      username: 'johndoe',
    };

    const editedUser = await userService.update(id, user);

    const expectedUser: UserResponse = {
      id: id,
      email: user.email!,
      fullName: user.fullName!,
      username: user.username!,
      createdAt,
      updatedAt,
    };

    expect(editSpy).toHaveBeenCalled();
    expect(editedUser).toMatchObject(expectedUser);
  });

  test('update user throws non-AppError', async () => {
    const getSpy = spyOn(userDataAccess, 'update')
      .mockImplementation(async (userId: string, user: Partial<User>) => {
        throw new Error('something went wrong')
      });

    const user: PatchSchema = {
      email: 'john@mail.com',
      fullName: 'John Doe',
      password: 'secret',
      username: 'johndoe',
    };

    await expect(userService.update(id, user)).rejects.toThrow('unexpected error occurred while editing the user: Error: something went wrong');
    expect(getSpy).toHaveBeenCalled();
  });

  test('update user throws AppError', async () => {
    const appError = new AppError(errorManagement.commonErrors.InternalServerError, 'unexpected error occurred while editing the user', false);

    const getSpy = spyOn(userDataAccess, 'update')
      .mockImplementation(async (userId: string, user: Partial<User>) => {
        throw appError;
      });

    const user: PatchSchema = {
      email: 'john@mail.com',
      fullName: 'John Doe',
      password: 'secret',
      username: 'johndoe',
    };

    await expect(userService.update(id, user)).rejects.toBe(appError);
    await expect(userService.update(id, user)).rejects.toBeInstanceOf(AppError);
    expect(getSpy).toHaveBeenCalled();
  });

  test('delete user', async () => {
    const user: User = {
      id: id,
      email: 'john@mail.com',
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'secret',
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    const deleteSpy = spyOn(userDataAccess, 'remove')
      .mockImplementation(async (userId: string): Promise<User> => ({
        id: userId,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      );

    const deletedUser = await userService.remove(id);

    const expectedUser: UserResponse = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    expect(deleteSpy).toHaveBeenCalled();
    expect(deletedUser).toMatchObject(expectedUser);
  });

  test('delete user throws non-AppError', async () => {
    const getSpy = spyOn(userDataAccess, 'remove')
      .mockImplementation(async (userId: string) => {
        throw new Error('something went wrong')
      });

    await expect(userService.remove(id)).rejects.toThrow('unexpected error occurred while deleting the user: Error: something went wrong');
    expect(getSpy).toHaveBeenCalled();
  });

  test('delete user throws AppError', async () => {
    const appError = new AppError(errorManagement.commonErrors.InternalServerError, 'unexpected error occurred while deleting the user', false);

    const getSpy = spyOn(userDataAccess, 'remove')
      .mockImplementation(async (userId: string) => {
        throw appError;
      });

    await expect(userService.remove(id)).rejects.toBe(appError);
    await expect(userService.remove(id)).rejects.toBeInstanceOf(AppError);
    expect(getSpy).toHaveBeenCalled();
  });
});
