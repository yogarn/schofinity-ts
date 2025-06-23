import express from 'express';
import { deleteUserHandler, getAllUser, getUser, patchUser } from '../apps/users/entry-points/user';
import { authMiddleware } from '../libraries/authenticator/auth';

const userRouter = express.Router();
userRouter
  .get('/:userId', authMiddleware, getUser)

  // TODO: implement middleware to check user ownerships / admin privileges
  .patch('/:userId', authMiddleware, patchUser)
  .delete('/:userId', deleteUserHandler)
  .get('/', authMiddleware, getAllUser);

export default userRouter;
