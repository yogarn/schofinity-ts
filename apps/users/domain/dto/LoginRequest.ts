import { z } from 'zod';

export const LoginRequest = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password should be at least 6 characters'),
});

export type LoginSchema = z.infer<typeof LoginRequest>;
