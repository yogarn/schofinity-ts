import * as userEntryPoint from '@/apps/users/entry-points/user';
import * as authMiddleware from '@/libraries/authenticator/auth';
import express from 'express';

const userRouter = express.Router();
userRouter
  .get('/:userId', authMiddleware.authMiddleware, userEntryPoint.get)

  // TODO: implement middleware to check user ownerships / admin privileges
  .patch('/:userId', authMiddleware.authMiddleware, userEntryPoint.update)
  .delete('/:userId', userEntryPoint.remove)
  .get('/', authMiddleware.authMiddleware, userEntryPoint.getAll);

export default userRouter;
