import express from 'express';
import { patchUser, register } from '../apps/users/entry-points/user';

const userRouter = express.Router();
userRouter
  // .post('/login', login)
  .post('/register', register)
  // .get('/', getAllUser)
  // .get('/:userId', getUser)

  // TODO: implement middleware to check user ownerships / admin privileges
  .patch('/:userId', patchUser);
// .delete('/:userId', deleteUser)

export default userRouter;
