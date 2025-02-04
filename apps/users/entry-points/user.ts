import type { NextFunction, Request, Response } from 'express';
import { PatchRequest, type PatchSchema } from '../domain/dto/PatchRequest';
import { RegisterRequest, type RegisterSchema } from '../domain/dto/RegisterRequest';
import { create, edit } from '../domain/services/user';

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

export const patchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params['userId'];
    const userRequest: PatchSchema = PatchRequest.parse(req.body);
    const user = await edit(userId, userRequest);
    res.status(200).json(user);
  } catch (error: unknown) {
    return next(error);
  }
};

// export async function deleteUser(req, res) {}
