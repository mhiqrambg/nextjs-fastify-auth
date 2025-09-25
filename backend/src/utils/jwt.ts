// src/utils/token.ts
import type { FastifyInstance } from "fastify";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface RefreshTokenPayload {
  id: string;
  tv: number;
}

export function createAccessToken(app: FastifyInstance, payload: TokenPayload) {
  return app.jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      type: "access",
    },
    { expiresIn: "1h" }
  );
}

export function createRefreshToken(
  app: FastifyInstance,
  payload: RefreshTokenPayload
) {
  return app.jwt.sign(
    { id: payload.id, tv: payload.tv, type: "refresh" },
    { expiresIn: "7d" }
  );
}
