import type { NextFunction, Request, Response } from 'express';
import { RegisterRequest, type RegisterSchema } from '../domain/dto/registerRequest';
import { create } from '../domain/services/user';

// export async function login(req, res) {}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRequest: RegisterSchema = RegisterRequest.parse(req.body);
    const user = await create(userRequest);
    res.status(201).json(user);
    return;
  } catch (error) {
    return next(error);
  }
};

// export async function getAllUser(req, res) {}

// export async function getUser(req, res) {}

// export async function updateUser(req, res) {}

// export async function deleteUser(req, res) {}
