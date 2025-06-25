import * as userDataAccess from "@/apps/users/data-access/user";
import type { LoginSchema } from "@/apps/users/domain/dto/LoginRequest";
import type { LoginResponse } from "@/apps/users/domain/dto/LoginResponse";
import config from "@/configs";
import { AppError } from "@/errors/AppError";
import errorManagement from "@/errors/errorManagement";
import { verifyPassword } from "@/libraries/authenticator/bcrypt";
import { signToken } from "@/libraries/authenticator/jwt";

export async function authenticate(loginRequest: LoginSchema): Promise<LoginResponse> {
  try {
    const expiry = config.get('jwt.expiry');
    const user = await userDataAccess.getByEmail(loginRequest.email);

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
