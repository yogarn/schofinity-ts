import { login, refresh, register } from '@/apps/auths/entry-points/auth';
import express from 'express';

const authRouter = express.Router();
authRouter
  .post('/login', login)
  .post('/register', register)
  .post('/refresh', refresh)

export default authRouter;
