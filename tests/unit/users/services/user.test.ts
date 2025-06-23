import { expect, spyOn, test } from 'bun:test';
import { ulid } from 'ulid';
import * as userDataAccess from '../../../../apps/users/data-access/user';
import type { PatchSchema } from '../../../../apps/users/domain/dto/PatchRequest';
import type { RegisterSchema } from '../../../../apps/users/domain/dto/RegisterRequest';
import type { UserResponse } from '../../../../apps/users/domain/dto/UserResponse';
import type { User } from '../../../../apps/users/domain/entity/user';
import * as userService from '../../../../apps/users/domain/services/user';

const id = ulid();
const createdAt = new Date();
const updatedAt = new Date();

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

test('edit user', async () => {
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
