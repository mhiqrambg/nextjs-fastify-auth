// src/modules/auth/route.ts

import type { FastifyInstance } from "fastify";
import { authController, refreshController } from "./controller";
import {
  RefreshSchemaJSON,
  SignInSchemaJSON,
  SignUpSchemaJSON,
  VerifyOtpSchemaJSON,
  ResendOtpSchemaJSON,
} from "./validation";

export default async function authRoutes(app: FastifyInstance) {
  const ctrl = authController(app.authService);
  app.post(
    "/signin",
    {
      attachValidation: true,
      schema: {
        body: SignInSchemaJSON,
        tags: ["Auth"],
        summary: "Sign in",
      },
    },
    ctrl.signin
  );
  app.post(
    "/signup",
    {
      schema: {
        body: SignUpSchemaJSON,
        tags: ["Auth"],
        summary: "Sign up",
      },
    },
    ctrl.signup
  );

  app.post(
    "/verify-otp",
    {
      schema: {
        body: VerifyOtpSchemaJSON,
      },
    },
    ctrl.verifyOtp
  );

  app.post(
    "/resend-otp",
    {
      schema: {
        body: ResendOtpSchemaJSON,
      },
    },
    ctrl.resendOtp
  );

  // refresh token
  const refreshCtrl = refreshController(app.refreshService, app.authService);
  app.post(
    "/refresh",
    {
      schema: {
        body: RefreshSchemaJSON,
        tags: ["Auth"],
        summary: "Refresh token",
      },
    },
    refreshCtrl.refresh
  );
}
