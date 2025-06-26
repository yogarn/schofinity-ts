import * as authService from "@/apps/auths/domain/services/auth";
import { type LoginSchema, LoginRequest } from "@/apps/users/domain/dto/LoginRequest";
import { type RegisterSchema, RegisterRequest } from "@/apps/users/domain/dto/RegisterRequest";
import * as userService from "@/apps/users/domain/services/user";
import config from "@/configs";
import { AppError } from "@/errors/AppError";
import errorManagement from "@/errors/errorManagement";
import type { NextFunction, Request, Response } from "express";
import { type RefreshSchema, RefreshRequest } from "../domain/dto/RefreshRequest";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const expiry = config.get('token.expiry');
    const refreshExpiry = config.get('token.refreshExpiry');
    const httpOnly = config.get('token.httpOnly');
    const secure = config.get('token.secure');

    const loginRequest: LoginSchema = LoginRequest.parse(req.body);
    const response = await authService.authenticate(loginRequest);

    res.cookie('token', response.jwt, {
      maxAge: expiry * 1000,
      httpOnly: httpOnly,
      secure: secure,
    });

    res.cookie('refreshToken', response.refreshToken, {
      maxAge: refreshExpiry * 1000,
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

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshRequest: RefreshSchema = RefreshRequest.parse(req.body);
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(errorManagement.commonErrors.Unauthorized, 'invalid refresh token', true);
    }

    const response = await authService.refreshSession(refreshRequest.email, refreshToken);

    res.cookie('token', response.jwt, {
      maxAge: config.get('token.expiry') * 1000,
      httpOnly: config.get('token.httpOnly'),
      secure: config.get('token.secure'),
    });

    res.cookie('refreshToken', response.refreshToken, {
      expires: response.expiresAt,
      httpOnly: config.get('token.httpOnly'),
      secure: config.get('token.secure'),
    });

    res.status(200).json({
      message: 'session refreshed successfully',
    });
  } catch (error) {
    return next(error);
  }
};
