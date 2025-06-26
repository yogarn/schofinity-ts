import * as authService from "@/apps/auths/domain/services/auth";
import { type LoginSchema, LoginRequest } from "@/apps/users/domain/dto/LoginRequest";
import { type RegisterSchema, RegisterRequest } from "@/apps/users/domain/dto/RegisterRequest";
import * as userService from "@/apps/users/domain/services/user";
import config from "@/configs";
import type { NextFunction, Request, Response } from "express";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const expiry = config.get('token.expiry');
    const httpOnly = config.get('token.httpOnly');
    const secure = config.get('token.secure');

    const loginRequest: LoginSchema = LoginRequest.parse(req.body);
    const response = await authService.authenticate(loginRequest);

    res.cookie('token', response.jwt, {
      maxAge: expiry * 1000,
      httpOnly: httpOnly,
      secure: secure,
    });

    res.status(200).json({
      message: 'login successfully',
    });
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
