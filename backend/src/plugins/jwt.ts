// src/plugins/jwt.ts

import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      role: string;
      email: string;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    auth: (request: any, reply: any) => Promise<void>;
  }
  interface FastifyRequest {
    jwt: any;
    user: {
      id: string;
      role: string;
      email: string;
    };
  }
}

export default fp(async (app) => {
  app.register(jwt, { secret: process.env.JWT_SECRET || "dev_secret" });

  app.decorate("auth", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });
});

export const isAdmin = async (request: any, reply: any) => {
  if ((request.user as any).role !== "admin") {
    throw request.server.httpErrors.forbidden(
      "Only admin can access this route"
    );
  }
};
