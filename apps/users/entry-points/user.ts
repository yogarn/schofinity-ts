import type { NextFunction, Request, Response } from 'express';
import { PatchRequest, type PatchSchema } from '../domain/dto/PatchRequest';
import * as userService from '../domain/services/user';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

export async function get(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId: string = req.params['userId'];
    const user = await userService.get(userId);
    res.status(200).json(user);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId: string = req.params['userId'];
    const userRequest: PatchSchema = PatchRequest.parse(req.body);
    const user = await userService.update(userId, userRequest);
    res.status(200).json(user);
    return;
  } catch (error: unknown) {
    return next(error);
  }
};

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId: string = req.params['userId'];
    const user = await userService.remove(userId);
    res.status(200).json(user);
  } catch (error: unknown) {
    return next(error);
  }
};
