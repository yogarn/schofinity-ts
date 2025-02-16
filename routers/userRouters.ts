import express from 'express';
import { getAllUser, getUser, login, patchUser, register } from '../apps/users/entry-points/user';
import { authMiddleware } from '../libraries/authenticator/auth';

const userRouter = express.Router();
userRouter
  .post('/login', login)
  .post('/register', register)
  .get('/:userId', authMiddleware, getUser)

  // TODO: implement middleware to check user ownerships / admin privileges
  .patch('/:userId', authMiddleware, patchUser)
  // .delete('/:userId', deleteUser)
  .get('/', authMiddleware, getAllUser);

export default userRouter;
