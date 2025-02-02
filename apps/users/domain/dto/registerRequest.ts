import { z } from 'zod';

export const RegisterRequest = z.object({
    fullName: z.string().min(5, "Full name should be at least 5 characters"),
    username: z.string().min(3, "Username should be at least 3 characters"),
    password: z.string().min(6, "Password should be at least 6 characters"),
    email: z.string().email("Invalid email format"),
});

export type RegisterSchema = z.infer<typeof RegisterRequest>;
