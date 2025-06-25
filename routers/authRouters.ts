import { login, register } from '@/apps/auths/entry-points/auth';
import express from 'express';

const authRouter = express.Router();
authRouter
  .post('/login', login)
  .post('/register', register)

export default authRouter;
