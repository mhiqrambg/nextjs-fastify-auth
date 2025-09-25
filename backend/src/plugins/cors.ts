// src/plugins/cors.ts
import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (app) => {
  const ALLOW = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim()); // buang spasi biar exact match

  await app.register(cors, {
    origin: (origin, cb) => {
      // kalau request tanpa Origin (misalnya curl / healthcheck), tetap diizinkan
      if (!origin) return cb(null, true);

      if (ALLOW.includes(origin)) {
        return cb(null, true);
      }

      return cb(new Error(`Not allowed by CORS: ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
});
