import express from 'express';

import authRouter from './authRouters';
import userRouter from './userRouters';

const router = express.Router();

router.use('/auths', authRouter);
router.use('/users', userRouter);

export default router;
