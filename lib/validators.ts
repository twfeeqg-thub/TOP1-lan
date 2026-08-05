import { z } from 'zod';
import { isYemeniPhoneNumber } from '@/lib/phone';

export const phoneSchema = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .refine(isYemeniPhoneNumber, { message: 'Invalid phone number format' });
export const nameSchema = z.string().min(2).max(100).optional();

export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[a-zA-Z]/, 'Must include letters')
  .regex(/\d/, 'Must include numbers');

export const loginPasswordSchema = z.string().min(1).max(128);

export const registerSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
  name: nameSchema,
  service: z.string().optional(),
  push_token: z.string().optional(),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: loginPasswordSchema,
  push_token: z.string().optional(),
});

export const checkPhoneSchema = z.object({
  phone: phoneSchema,
});

export const updateProfileSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema.optional(),
    password: passwordSchema.optional(),
    current_password: z.string().min(1).optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.phone !== undefined || data.password !== undefined,
    { message: 'No fields to update' }
  )
  .refine((data) => !data.password || !!data.current_password, {
    message: 'Current password is required to change the password',
  });
