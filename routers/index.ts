import express from 'express';

import authRouter from '@/routers/authRouters';
import userRouter from '@/routers/userRouters';

const router = express.Router();

router.use('/auths', authRouter);
router.use('/users', userRouter);

export default router;
