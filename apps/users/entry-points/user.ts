import type { NextFunction, Request, Response } from 'express';
import { PatchRequest, type PatchSchema } from '../domain/dto/PatchRequest';
import { RegisterRequest, type RegisterSchema } from '../domain/dto/RegisterRequest';
import { create, edit, readAllUser, readUser } from '../domain/services/user';

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

export const getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await readAllUser();
    res.status(200).json(users);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params['userId'];
    const user = await readUser(userId);
    res.status(200).json(user);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

export const patchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params['userId'];
    const userRequest: PatchSchema = PatchRequest.parse(req.body);
    const user = await edit(userId, userRequest);
    res.status(200).json(user);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

// export async function deleteUser(req, res) {}
