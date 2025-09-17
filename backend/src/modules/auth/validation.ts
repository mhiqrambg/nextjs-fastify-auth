// src/modules/auth/validation.ts

import { z } from "zod";

export const TOtpRow = z.object({
  id: z.uuid(),
  phone_number: z.string(),
  code_hash: z.string(),
  type: z.enum(["whatsapp", "email", "sms", "signup"]),
  expires_at: z.string(),
  used_at: z.string(),
});

export const SignInSchema = z.object({
  email: z.email({ error: "Invalid email or password" }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])()(?=.*[^A-Za-z0-9]).{5,}$/, {
      error: "Invalid email or password",
    }),
});

export const ResendOtpSchema = z.object({
  id: z.uuid(),
  phone_number: z
    .string()
    .min(10, { error: "Nomor telepon minimal 10 karakter" }),
});

export const VerifyOtpSchema = z.object({
  id: z.uuid(),
  phone_number: z
    .string()
    .min(10, { error: "Nomor telepon minimal 10 karakter" }),
  otp: z
    .string()
    .min(4, { message: "OTP minimal 4 karakter" })
    .max(6, { message: "OTP maksimal 6 karakter" }),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(20, { error: "Refresh token is required" }),
  ua: z.string().nullable().optional(),
  ip: z.string().nullable().optional(),
  tokenHint: z.string().nullable().optional(),
});

export const RefreshTokenMetaSchema = z.object({
  ua: z.string().nullable().optional(),
  ip: z.string().nullable().optional(),
});

export const SignUpSchema = z
  .object({
    name: z.string().min(4, { error: "Nama minimal 4 karakter" }),
    email: z.email({ error: "Email tidak valid" }),
    phone_number: z
      .string()
      .min(10, { error: "Nomor telepon minimal 10 karakter" }),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])()(?=.*[^A-Za-z0-9]).{5,}$/),
    re_password: z.string().min(5),
  })
  .refine((d) => d.password === d.re_password, {
    path: ["re_password"],
    error: "Passwords do not match",
  });

export const VerifyOtpSchemaJSON = z.toJSONSchema(VerifyOtpSchema, {
  target: "draft-7",
  io: "input",
});

export const ResendOtpSchemaJSON = z.toJSONSchema(ResendOtpSchema, {
  target: "draft-7",
  io: "input",
});

export const SignInSchemaJSON = z.toJSONSchema(SignInSchema, {
  target: "draft-7",
  io: "input",
});
export const SignUpSchemaJSON = z.toJSONSchema(SignUpSchema, {
  target: "draft-7",
  io: "input",
});

export const RefreshSchemaJSON = z.toJSONSchema(RefreshTokenSchema, {
  target: "draft-7",
  io: "input",
});

export type OTPRow = z.infer<typeof TOtpRow>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type RefreshTokenMeta = z.infer<typeof RefreshTokenMetaSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof ResendOtpSchema>;
