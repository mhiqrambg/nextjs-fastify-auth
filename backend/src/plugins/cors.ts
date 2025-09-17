// src/plugins/cors.ts
import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (app) => {
  await app.register(cors, {
    origin: (origin, cb) => {
      const ALLOW = (process.env.CORS_ORIGIN || "http://localhost:3000").split(
        ","
      );
      if (!origin || ALLOW.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  });
});
