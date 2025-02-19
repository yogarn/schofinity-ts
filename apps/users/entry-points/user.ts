import type { NextFunction, Request, Response } from 'express';
import { LoginRequest, type LoginSchema } from '../domain/dto/LoginRequest';
import { PatchRequest, type PatchSchema } from '../domain/dto/PatchRequest';
import { RegisterRequest, type RegisterSchema } from '../domain/dto/RegisterRequest';
import { authenticate, create, deleteUserService, edit, readAllUser, readUser } from '../domain/services/user';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loginRequest: LoginSchema = LoginRequest.parse(req.body);
    const response = await authenticate(loginRequest);
    res.status(200).json(response);
  } catch (error: unknown) {
    return next(error);
  }
};

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

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params['userId'];
    const user = await deleteUserService(userId);
    res.status(200).json(user);
  } catch (error: unknown) {
    return next(error);
  }
};
