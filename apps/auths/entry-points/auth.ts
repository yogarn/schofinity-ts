import type { NextFunction, Request, Response } from "express";
import { type LoginSchema, LoginRequest } from "../../users/domain/dto/LoginRequest";
import { type RegisterSchema, RegisterRequest } from "../../users/domain/dto/RegisterRequest";
import { create } from "../../users/domain/services/user";
import { authenticate } from "../domain/services/auth";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const loginRequest: LoginSchema = LoginRequest.parse(req.body);
    const response = await authenticate(loginRequest);
    res.status(200).json(response);
  } catch (error: unknown) {
    return next(error);
  }
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userRequest: RegisterSchema = RegisterRequest.parse(req.body);
    const user = await create(userRequest);
    res.status(201).json(user);
    return;
  } catch (error) {
    return next(error);
  }
};
