import { RegisterRequest, RegisterSchema } from '../domain/dto/registerRequest';
import { create } from '../domain/services/user';

// export async function login(req, res) {}

export const register = async (req, res, next): Promise<void> => {
  try {
    const userRequest: RegisterSchema = RegisterRequest.parse(req.body);
    const user = await create(userRequest);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};

// export async function getAllUser(req, res) {}

// export async function getUser(req, res) {}

// export async function updateUser(req, res) {}

// export async function deleteUser(req, res) {}
