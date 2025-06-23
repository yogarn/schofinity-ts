import type { NextFunction, Request, Response } from 'express';
import { PatchRequest, type PatchSchema } from '../domain/dto/PatchRequest';
import { deleteUserService, edit, readAllUser, readUser } from '../domain/services/user';

export async function getAllUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await readAllUser();
    res.status(200).json(users);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId: string = req.params['userId'];
    const user = await readUser(userId);
    res.status(200).json(user);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

export async function patchUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId: string = req.params['userId'];
    const user = await deleteUserService(userId);
    res.status(200).json(user);
  } catch (error: unknown) {
    return next(error);
  }
};
