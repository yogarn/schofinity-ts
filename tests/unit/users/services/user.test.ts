import { expect, spyOn, test } from 'bun:test';
import { ulid } from 'ulid';
import * as userDataAccess from '../../../../apps/users/data-access/user';
import type { PatchSchema } from '../../../../apps/users/domain/dto/PatchRequest';
import type { RegisterSchema } from '../../../../apps/users/domain/dto/RegisterRequest';
import type { User } from '../../../../apps/users/domain/entity/user';
import { create, edit } from '../../../../apps/users/domain/services/user';

const id = ulid();
const createdAt = new Date();
const updatedAt = new Date();

test('create user', async () => {
  const insertSpy = spyOn(userDataAccess, 'insert').mockImplementation(async (user: User) => ({
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

  const createdUser = await create(user);

  expect(insertSpy).toHaveBeenCalled();
  expect(createdUser).toMatchObject({
    email: 'john@mail.com',
    fullName: 'John Doe',
    username: 'johndoe',
    createdAt: createdAt,
    updatedAt: updatedAt,
  });
});

test('edit user', async () => {
  const editSpy = spyOn(userDataAccess, 'update').mockImplementation(
    async (userId: string, user: Partial<User>): Promise<User> => ({
      id: userId,
      fullName: user.fullName ?? '',
      username: user.username ?? '',
      password: user.password ?? '',
      email: user.email ?? '',
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

  const editedUser = await edit(id, user);

  expect(editSpy).toHaveBeenCalled();
  expect(editedUser).toMatchObject({
    email: 'john@mail.com',
    fullName: 'John Doe',
    username: 'johndoe',
    createdAt: createdAt,
    updatedAt: new Date(),
  });
});
