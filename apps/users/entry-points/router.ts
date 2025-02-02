import express from 'express';
import { login, register, getAllUser, getUser, updateUser, deleteUser } from './api/user';

const userRouter = express.Router();
userRouter
    .post('/login', login)
    .post('/register', register)
    .get('/', getAllUser)
    .get('/:userId', getUser)

    // TODO: implement middleware to check user ownerships / admin privileges
    .patch('/:userId', updateUser)
    .delete('/:userId', deleteUser);

export default userRouter;
