import { z } from 'zod';

export const RefreshRequest = z.object({
  email: z.string().email('Invalid email format'),
});

export type RefreshSchema = z.infer<typeof RefreshRequest>;
