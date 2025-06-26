import * as userDataAccess from "@/apps/users/data-access/user";
import type { LoginSchema } from "@/apps/users/domain/dto/LoginRequest";
import type { LoginResponse } from "@/apps/users/domain/dto/LoginResponse";
import { AppError } from "@/errors/AppError";
import errorManagement from "@/errors/errorManagement";
import { verifyPassword } from "@/libraries/authenticator/bcrypt";
import { signToken } from "@/libraries/authenticator/jwt";

export async function authenticate(loginRequest: LoginSchema): Promise<LoginResponse> {
  try {
    const user = await userDataAccess.getByEmail(loginRequest.email);

    const verifyStatus = await verifyPassword(loginRequest.password, user.password);
    if (!verifyStatus) {
      throw new AppError(errorManagement.bcryptErrors.InvalidCredentials, 'invalid credentials', true);
    }

    const token = signToken(user.id, 1);
    const loginResponse: LoginResponse = {
      jwt: token,
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
