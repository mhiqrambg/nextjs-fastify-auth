// src/modules/auth/service.ts

import { authModel, refreshModel } from "./model";
import {
  SignUpInput,
  SignInInput,
  RefreshTokenInput,
  VerifyOtpInput,
} from "./validation";
import { getExpiry, hashRefresh, sha256, verifyRefresh } from "../../utils";
import { otpWaha } from "../../utils/otpWaha";

export type AuthRepo = ReturnType<typeof authModel>;
export type RefreshRepo = ReturnType<typeof refreshModel>;

export const authService = (repo: AuthRepo) => ({
  signup: async (data: SignUpInput) => {
    const existingUser = await repo.findUserByEmailOrPhone(
      data.email,
      data.phone_number
    );

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error("Email already exists");
      }
      if (existingUser.phone_number === data.phone_number) {
        throw new Error("Phone number already exists");
      }
    }

    const hashedPassword = await hashRefresh(data.password);

    const user = await repo.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone_number: data.phone_number,
    });

    return user;
  },

  async createOtp(phone_number: string, type: string, userId: string) {
    const otpRondom = otpWaha.generateOtp();
    const codeHash = await hashRefresh(otpRondom);
    const expiresAt = getExpiry(Number(process.env.OTP_EXPIRY) || 5);

    try {
      const otp = await repo.createOtp(phone_number, codeHash, expiresAt, type);
      if (!otp) throw new Error("Failed to create OTP");

      const result = await this.sendOtp(phone_number, otpRondom);
      if (!result) throw new Error("Failed to send OTP");

      return { otp, expiresAt };
    } catch (err) {
      console.log("error :", err);
      await repo.deleteUser(userId);
      throw err;
    }
  },

  async sendOtp(phone_number: string, otp: string) {
    const text = `Pendaftaran Akun Baru\nKode OTP Anda adalah ${otp}`;
    const chatId = `${phone_number}@c.us`;

    const result = await otpWaha.sendText(chatId, text);
    return result;
  },

  verifyOtp: async (data: VerifyOtpInput) => {
    const dataOtp = await repo.findOtpByPhone(data.phone_number);

    if (!dataOtp) throw new Error("Invalid OTP");

    if (dataOtp.used_at) throw new Error("OTP already used");

    if (new Date(dataOtp.expires_at) < new Date()) {
      throw new Error("OTP expired");
    }

    const isValid = await verifyRefresh(dataOtp.code_hash, data.otp);
    if (!isValid) throw new Error("Invalid OTP");

    const [userUpdated, otpUpdated] = await Promise.all([
      repo.verifyOtpStatus("whatsapp", data.phone_number),
      repo.updateOtp(dataOtp.id),
    ]);

    return {
      user: userUpdated,
      otp: otpUpdated,
    };
  },

  signin: async (data: SignInInput) => {
    const user = await repo.findUserByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await verifyRefresh(user.password, data.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tv: user.tv,
    };
  },

  saveRefreshToken: async (id: string, data: RefreshTokenInput) => {
    const tokenHash = await hashRefresh(data.refreshToken);
    const tokenHint = sha256(data.refreshToken);

    const result = await repo.saveRefreshToken(id, {
      ...data,
      refreshToken: tokenHash,
      tokenHint,
    });

    return result;
  },

  deleteUser: async (id: string) => {
    const result = await repo.deleteUser(id);

    return result;
  },
});

export const refreshService = (repo: RefreshRepo) => ({
  refresh: async (refreshToken: string) => {
    const tokenHint = sha256(refreshToken);
    const result = await repo.findRefreshToken(tokenHint);

    if (!result) {
      throw new Error("Invalid refresh token");
    }

    // Verifikasi token
    const match = await verifyRefresh(result.token_hash, refreshToken);

    if (!match) {
      throw new Error("Invalid refresh token");
    }

    return result;
  },
});

export type AuthService = ReturnType<typeof authService>;
export type RefreshService = ReturnType<typeof refreshService>;
