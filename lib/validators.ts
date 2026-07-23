import { z } from 'zod';

export const phoneSchema = z.string().min(8).max(20);
export const passwordSchema = z.string().min(6).max(128);
export const nameSchema = z.string().min(2).max(100).optional();

export const registerSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
  name: nameSchema,
  service: z.string().optional(),
  push_token: z.string().optional(),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
  push_token: z.string().optional(),
});

export const checkPhoneSchema = z.object({
  phone: z.string().min(8).max(20),
});
