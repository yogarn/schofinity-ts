import * as authService from "@/apps/auths/domain/services/auth";
import { type LoginSchema, LoginRequest } from "@/apps/users/domain/dto/LoginRequest";
import { type RegisterSchema, RegisterRequest } from "@/apps/users/domain/dto/RegisterRequest";
import * as userService from "@/apps/users/domain/services/user";
import type { NextFunction, Request, Response } from "express";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const loginRequest: LoginSchema = LoginRequest.parse(req.body);
    const response = await authService.authenticate(loginRequest);
    res.status(200).json(response);
  } catch (error: unknown) {
    return next(error);
  }
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userRequest: RegisterSchema = RegisterRequest.parse(req.body);
    const user = await userService.create(userRequest);
    res.status(201).json(user);
    return;
  } catch (error) {
    return next(error);
  }
};
