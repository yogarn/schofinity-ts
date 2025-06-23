import bcrypt from 'bcrypt';
import config from '../../configs';
import { AppError } from '../../errors/AppError';
import errorManagement from '../../errors/errorManagement';

const saltRounds = config.get('bcrypt.saltRound');

export async function hashPassword(plainText: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(plainText, saltRounds);
    return hashedPassword;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.bcryptErrors.InvalidPassword, 'unable to hash the user password', true);
  }
};

export async function verifyPassword(plainText: string, hashedPassword: string): Promise<boolean> {
  try {
    const result = await bcrypt.compare(plainText, hashedPassword);
    return result;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(errorManagement.bcryptErrors.InvalidPassword, 'unable to verify the user password', true);
  }
};
