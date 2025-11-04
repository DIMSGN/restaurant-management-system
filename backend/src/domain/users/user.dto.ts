import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.WAITER),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
