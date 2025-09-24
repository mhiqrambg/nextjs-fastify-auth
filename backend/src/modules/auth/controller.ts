// src/modules/auth/controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import {
  SignUpSchema,
  SignInSchema,
  RefreshTokenSchema,
  VerifyOtpSchema,
  ResendOtpSchema,
} from "./validation";
import type { AuthService, RefreshService } from "./service";
import { createAccessToken, createRefreshToken } from "../../utils/jwt";
import { formatPhoneNumber } from "../../utils";

export const authController = (svc: AuthService) => ({
  signup: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const data = SignUpSchema.parse(req.body);
    const formattedPhoneNumber = formatPhoneNumber(data.phone_number);
    try {
      const result = await svc.signup({
        ...data,
        phone_number: formattedPhoneNumber,
      });

      const otp =
        result &&
        (await svc.createOtp(formattedPhoneNumber, "whatsapp", result.id));

      if (!otp) throw app.httpErrors.badRequest("Failed to send OTP");

      reply.send({
        message: "OTP sent successfully",
        data: {
          id: result.id,
          name: result.name,
          email: result.email,
          phone_number: result.phone_number,
        },
      });
    } catch (err: any) {
      throw app.httpErrors.createError(
        err.response?.status || 400,
        err.response?.data?.message || err.message
      );
    }
  },

  signin: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const data = SignInSchema.parse(req.body);
    const userAgent = req.headers["user-agent"] || null;
    const ipAddress = req.ip || null;

    try {
      const result = await svc.signin(data);

      const token = createAccessToken(app, result);
      const refreshToken = createRefreshToken(app, result);

      if (refreshToken) {
        await svc.saveRefreshToken(result.id, {
          refreshToken,
          ua: userAgent,
          ip: ipAddress,
        });
      }
      reply.send({
        message: "Sign in successful",
        accessToken: token,
        refreshToken,
      });
    } catch (err: any) {
      throw app.httpErrors.unauthorized(err.message);
    }
  },

  verifyOtp: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const data = VerifyOtpSchema.parse(req.body);

    try {
      await svc.verifyOtp(data);

      reply.send({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (err: any) {
      throw app.httpErrors.unauthorized(err.message);
    }
  },

  resendOtp: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const data = ResendOtpSchema.parse(req.body);
    const formattedPhoneNumber = formatPhoneNumber(data.phone_number);

    try {
      const otp = await svc.createOtp(
        formattedPhoneNumber,
        "whatsapp",
        data.id
      );

      reply.send({
        message: "OTP sent successfully",
        expired_at: otp.expiresAt,
      });
    } catch (err: any) {
      throw app.httpErrors.unauthorized(err.message);
    }
  },
});

export const refreshController = (
  svc: RefreshService,
  authSvc: AuthService
) => ({
  refresh: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { refreshToken } = RefreshTokenSchema.parse(req.body);
    const meta = {
      ua: (req.headers["user-agent"] as string) ?? null,
      ip: req.ip ?? null,
    };

    try {
      const result = await svc.refresh(refreshToken);
      if (!result) {
        throw app.httpErrors.unauthorized("Invalid refresh token");
      }

      const token = createAccessToken(app, result);
      const newRefreshToken = createRefreshToken(app, result);

      if (newRefreshToken) {
        await authSvc.saveRefreshToken(result.user_id, {
          refreshToken: newRefreshToken,
          ua: meta.ua,
          ip: meta.ip,
        });
      }

      reply.send({
        message: "Refresh token successful",
        accessToken: token,
        refreshToken: newRefreshToken,
        accessTokenExpiresIn: new Date(
          Date.now() + 60 * 60 * 1000
        ).toISOString(),
        refreshTokenExpiresIn: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    } catch (err: any) {
      throw app.httpErrors.unauthorized(err.message);
    }
  },
});
