// src/utils/index.ts

import crypto from "crypto";
import argon2 from "argon2";

export const sha256 = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex");

export const hashRefresh = (raw: string) => argon2.hash(raw);

export const verifyRefresh = (hash: string, raw: string) =>
  argon2.verify(hash, raw);

export const minutesFromNow = (min: number) =>
  new Date(Date.now() + min * 60 * 1000);

export function getExpiry(minutes = 5): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function formatPhoneNumber(phone: string): string {
  let normalized = phone.replace(/\D/g, "");

  if (normalized.startsWith("0")) {
    normalized = "62" + normalized.substring(1);
  } else if (!normalized.startsWith("62")) {
    normalized = "62" + normalized;
  }

  return normalized;
}

export function getDateNow() {
  return new Date();
}
