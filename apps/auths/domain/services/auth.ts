import * as authDataAccess from "@/apps/auths/data-access/auth";
import * as userDataAccess from "@/apps/users/data-access/user";
import type { LoginSchema } from "@/apps/users/domain/dto/LoginRequest";
import type { LoginResponse } from "@/apps/users/domain/dto/LoginResponse";
import config from "@/configs";
import { AppError } from "@/errors/AppError";
import errorManagement from "@/errors/errorManagement";
import { verifyPassword } from "@/libraries/authenticator/bcrypt";
import { signToken } from "@/libraries/authenticator/jwt";
import crypto from 'crypto';
import { ulid } from "ulid";
import type { RefreshResponse } from "../dto/RefreshResponse";
import type { Session } from "../entity/session";

export async function authenticate(loginRequest: LoginSchema): Promise<LoginResponse> {
  try {
    const user = await userDataAccess.getByEmail(loginRequest.email);

    const verifyStatus = await verifyPassword(loginRequest.password, user.password);
    if (!verifyStatus) {
      throw new AppError(errorManagement.bcryptErrors.InvalidCredentials, 'invalid credentials', true);
    }

    const token = signToken(user.id, 1);
    const refreshToken = crypto.randomBytes(16).toString('base64url');
    const refreshExpiry = config.get('token.refreshExpiry');

    const userSession: Session = {
      id: ulid(),
      token: refreshToken,
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + refreshExpiry * 1000),
    }

    await authDataAccess.createSession(userSession);

    const loginResponse: LoginResponse = {
      jwt: token,
      refreshToken: refreshToken,
    };

    return loginResponse;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      if (error.statusCode === 404) {
        throw new AppError(errorManagement.bcryptErrors.InvalidCredentials, 'invalid credentials', true);
      }

      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while authenticate the user: ${error}`, false);
  }
};

export async function refreshSession(email: string, refreshToken: string): Promise<RefreshResponse> {
  try {
    const user = await userDataAccess.getByEmail(email);
    if (!user) {
      throw new AppError(errorManagement.commonErrors.NotFound, 'user not found', true);
    }

    const currentSession = await authDataAccess.getSession(user.id, refreshToken);
    if (!currentSession) {
      throw new AppError(errorManagement.commonErrors.Unauthorized, 'invalid refresh token', true);
    }

    const jwt = signToken(user.id, 1);

    return {
      jwt,
      refreshToken: currentSession.token,
      expiresAt: currentSession.expiresAt
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.commonErrors.InternalServerError, `unexpected error occurred while refreshing session: ${error}`, false);
  }
}
