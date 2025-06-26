import * as authDataAccess from '@/apps/auths/data-access/auth';
import type { Session } from '@/apps/auths/domain/entity/session';
import * as authService from '@/apps/auths/domain/services/auth';
import * as userDataAccess from '@/apps/users/data-access/user';
import type { LoginResponse } from '@/apps/users/domain/dto/LoginResponse';
import type { User } from '@/apps/users/domain/entity/user';
import { AppError } from '@/errors/AppError';
import errorManagement from '@/errors/errorManagement';
import * as bcrypt from '@/libraries/authenticator/bcrypt';
import * as jwt from '@/libraries/authenticator/jwt';
import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { ulid } from 'ulid';

describe('Auth Service Tests', () => {
  afterEach(() => {
    mock.restore();
  });

  const token = 'mocked-jwt-token';
  const refreshToken = 'mocked-refresh-token';
  const expiry = 600;
  const refreshExpiry = 3600;

  const user: User = {
    id: ulid(),
    email: 'john@mail.com',
    fullName: 'John Doe',
    username: 'johndoe',
    password: 'secret',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const expectedResponse: LoginResponse = {
    jwt: token,
    refreshToken: refreshToken
  };

  const session: Session = {
    id: ulid(),
    token: refreshToken,
    userId: user.id,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + refreshExpiry * 1000),
  };

  test('authenticate user with valid credentials', async () => {
    mock.module('crypto', () => {
      return {
        default: {
          randomBytes: (n: number) => ({
            toString: (enc: string) => refreshToken,
          }),
        }
      };
    });

    const getByEmailSpy = spyOn(userDataAccess, 'getByEmail')
      .mockImplementation(async (email: string): Promise<User> => user);

    const verifyPasswordSpy = spyOn(bcrypt, 'verifyPassword')
      .mockImplementation(async (password: string, hashedPassword: string): Promise<boolean> => true);

    const signTokenSpy = spyOn(jwt, 'signToken')
      .mockImplementation((userId: string, roleId: number): string => token);

    const createSessionSpy = spyOn(authDataAccess, 'createSession')
      .mockImplementation(async (session: Session): Promise<Session> => session);

    const result = await authService.authenticate({
      email: user.email,
      password: user.password,
    });

    expect(getByEmailSpy).toHaveBeenCalled();
    expect(verifyPasswordSpy).toHaveBeenCalled();
    expect(signTokenSpy).toHaveBeenCalled();
    expect(createSessionSpy).toHaveBeenCalled();

    expect(result).toEqual(expectedResponse);
  });

  test('authenticate user with invalid email', async () => {
    const appError = new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);

    const getByEmailSpy = spyOn(userDataAccess, 'getByEmail')
      .mockImplementation(async (email: string): Promise<User> => {
        throw appError;
      });

    await expect(authService.authenticate({
      email: user.email,
      password: user.password,
    })).rejects.toThrow('invalid credentials');

    expect(getByEmailSpy).toHaveBeenCalled();
  });

  test('authenticate user with invalid password', async () => {
    const getByEmailSpy = spyOn(userDataAccess, 'getByEmail')
      .mockImplementation(async (email: string): Promise<User> => user);

    const verifyPasswordSpy = spyOn(bcrypt, 'verifyPassword')
      .mockImplementation(async (password: string, hashedPassword: string): Promise<boolean> => false);

    await expect(authService.authenticate({
      email: user.email,
      password: user.password,
    })).rejects.toThrow('invalid credentials');

    expect(getByEmailSpy).toHaveBeenCalled();
    expect(verifyPasswordSpy).toHaveBeenCalled();
  });

  test('authenticate user throws AppError', async () => {
    const appError = new AppError(errorManagement.commonErrors.InternalServerError, 'internal server error', false);

    const getByEmailSpy = spyOn(userDataAccess, 'getByEmail')
      .mockImplementation(async (email: string): Promise<User> => {
        throw appError;
      });

    await expect(authService.authenticate({
      email: user.email,
      password: user.password,
    })).rejects.toThrow('internal server error');

    expect(getByEmailSpy).toHaveBeenCalled();
  });


  test('authenticate user throws unknown error', async () => {
    const error = new Error('internal server error') as any;;

    const getByEmailSpy = spyOn(userDataAccess, 'getByEmail')
      .mockImplementation(async (email: string): Promise<User> => {
        throw error;
      });

    await expect(authService.authenticate({
      email: user.email,
      password: user.password,
    })).rejects.toThrow('unexpected error occurred while authenticate the user: Error: internal server error');

    expect(getByEmailSpy).toHaveBeenCalled();
  });
});
