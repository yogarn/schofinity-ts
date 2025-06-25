import { afterEach, describe, expect, mock, test } from "bun:test";
import { ulid } from 'ulid';
import * as userDataAccess from "../../../../apps/users/data-access/user";
import type { User } from "../../../../apps/users/domain/entity/user";

const id = ulid();
const createdAt = new Date();
const updatedAt = new Date();

const user: User = {
  id: id,
  email: 'john@mail.com',
  fullName: 'John Doe',
  username: 'johndoe',
  password: 'secret',
  createdAt: createdAt,
  updatedAt: updatedAt,
};

describe('User Data Access Tests', () => {
  afterEach(() => {
    mock.restore();
  });

  test('get user by email', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
        return [user];
      };
      return { default: sql };
    });

    const getUserByEmail = await userDataAccess.getByEmail(user.email);
    const expectedUser: User = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    expect(getUserByEmail).toEqual(expectedUser);
  });

  test('get user by email throws not found', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        return [];
      };
      return { default: sql };
    });

    await expect(userDataAccess.getByEmail(user.email)).rejects.toThrow('user not found');
  });

  test('get user by email throws unknown error', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        throw new Error('internal server error') as any;
      };
      return { default: sql };
    });

    await expect(userDataAccess.getByEmail(user.email)).rejects.toThrow('unexpected error while selecting the user: Error: internal server error');
  });

  test('get user', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
        return [user];
      };
      return { default: sql };
    });

    const getUser = await userDataAccess.get(user.id);
    const expectedUser: User = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    expect(getUser).toEqual(expectedUser);
  });

  test('get user throws not found', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        return [];
      };
      return { default: sql };
    });

    await expect(userDataAccess.get(user.id)).rejects.toThrow('user not found');
  });

  test('get user throws unknown error', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        throw new Error('internal server error') as any;
      };
      return { default: sql };
    });

    await expect(userDataAccess.get(user.id)).rejects.toThrow('unexpected error while selecting the user: Error: internal server error');
  });

  test('get all user', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
        return [user, user];
      };
      return { default: sql };
    });

    const getAllUser = await userDataAccess.getAll();
    const expectedUser: User = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    expect(getAllUser).toEqual([expectedUser, expectedUser]);
  });

  test('get all user throws not found', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        return [];
      };
      return { default: sql };
    });

    await expect(userDataAccess.getAll()).rejects.toThrow('user not found');
  });

  test('get all user throws unknown error', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        throw new Error('internal server error') as any;
      };
      return { default: sql };
    });

    await expect(userDataAccess.getAll()).rejects.toThrow('unexpected error while selecting the user: Error: internal server error');
  });

  test('create user', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
        return [user];
      };
      return { default: sql };
    });

    const createdUser = await userDataAccess.create(user);
    expect(createdUser).toEqual(user);
  });

  test('create user throws Conflict on duplicate', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        const err = new Error('constraint failed') as any;
        err.code = '23505';
        throw err;
      };
      return { default: sql };
    });

    await expect(userDataAccess.create(user)).rejects.toThrow('username or email already used');
  });

  test('create user throws non-Conflict code error', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        const err = new Error('constraint failed') as any;
        err.code = '00000';
        throw err;
      };
      return { default: sql };
    });

    await expect(userDataAccess.create(user)).rejects.toThrow('username or email already used');
  });

  test('create user throws unknown error', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        throw new Error('internal server error');
      };
      return { default: sql };
    });

    await expect(
      userDataAccess.create(user)
    ).rejects.toThrow('unexpected error occured while inserting the user: Error: internal server error');
  });

  test('update user', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
        return [user];
      };
      return { default: sql };
    });

    const updatedUser = await userDataAccess.update(id, user);
    expect(updatedUser).toEqual(user);
  });

  test('update user throws not found', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        return [];
      };
      return { default: sql };
    });

    await expect(userDataAccess.update(user.id, user)).rejects.toThrow('user not found');
  });

  test('update user throws unknown error', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        throw new Error('internal server error') as any;
      };
      return { default: sql };
    });

    await expect(userDataAccess.update(user.id, user)).rejects.toThrow('unexpected error while selecting the user: Error: internal server error');
  });

  test('remove user', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
        return [user];
      };
      return { default: sql };
    });

    const removedUser = await userDataAccess.remove(user.id);
    expect(removedUser).toEqual(user);
  });

  test('remove user throws not found', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        return [];
      };
      return { default: sql };
    });

    await expect(userDataAccess.remove(user.id)).rejects.toThrow('user not found');
  });

  test('remove user throws unknown error', async () => {
    mock.module('../../../../databases/postgres', () => {
      const sql = (strings: TemplateStringsArray, ...values: any[]) => {
        throw new Error('internal server error') as any;
      };
      return { default: sql };
    });

    await expect(userDataAccess.remove(user.id)).rejects.toThrow('unexpected error while selecting the user: Error: internal server error');
  });
});
