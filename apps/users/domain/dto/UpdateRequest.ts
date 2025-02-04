import { z } from 'zod';

export const UpdateRequest = z
  .object({
    fullName: z.string().min(5, 'Full name should be at least 5 characters').optional(),
    username: z.string().min(3, 'Username should be at least 3 characters').optional(),
    password: z.string().min(6, 'Password should be at least 6 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateSchema = z.infer<typeof UpdateRequest>;
