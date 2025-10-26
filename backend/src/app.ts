// src/app.ts

// fastify
import Fastify, { FastifyServerOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import sensible from "@fastify/sensible";

// plugins
import cors from "./plugins/cors";
import swagger from "./plugins/swagger";
import jwtPlugin from "./plugins/jwt";
import db from "./plugins/db";
import users from "./plugins/users";
import auth from "./plugins/auth";
import exams from "./plugins/exams";
import classrooms from "./plugins/classrooms";
import errorHandler from "./plugins/errorHandler";
import opsRoute from "./modules/routes/ops";
import socket from "./plugins/socket";

// jobs
import { registerRefreshCleanup } from "./jobs/cleanup-refresh-tokens";

// modular routes
import healthRoute from "./modules/health/route";
import usersRoute from "./modules/users/route";
import authRoute from "./modules/auth/route";
import examsRoute from "./modules/exams/route";
import classroomsRoute from "./modules/classrooms/route";

export function buildApp(opts: FastifyServerOptions = {}) {
  const app = Fastify({
    ...opts,
    // trustProxy: true, // for load balancer
    disableRequestLogging: true,
    allowErrorHandlerOverride: true,
  }).withTypeProvider<ZodTypeProvider>();

  // plugins
  app.register(sensible);
  app.register(swagger);
  app.register(jwtPlugin);
  app.register(db);
  app.register(users);
  app.register(exams);
  app.register(classrooms);
  app.register(auth);
  app.register(errorHandler);
  app.register(opsRoute);
  app.register(cors);
  app.register(socket);
  registerRefreshCleanup(app);

  // root
  app.get("/", async () => ({ ok: true, service: "node-fastify-reactjs" }));

  // register per-modul
  app.register(healthRoute, { prefix: "/health" });
  app.register(usersRoute, { prefix: "/user" });
  app.register(authRoute, { prefix: "/auth" });
  app.register(examsRoute, { prefix: "/exams" });
  app.register(classroomsRoute, { prefix: "/classrooms" });

  return app;
}
