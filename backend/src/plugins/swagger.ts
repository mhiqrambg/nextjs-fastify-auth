// src/plugins/swagger.ts

import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

const isProd = process.env.NODE_ENV === "production";

export default fp(async function swaggerPlugin(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "NODE-FASTIFY-REACTJS API",
        description: "API documentation for NODE-FASTIFY-REACTJS backend",
        version: "1.0.0",
      },
      servers: [
        {
          url: process.env.API_BASE_URL || "http://localhost:3000",
          description: "Current server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      tags: [
        {
          name: "Health",
          description: "Health check endpoints",
        },
        {
          name: "Auth",
          description: "Authentication endpoints",
        },
        {
          name: "Users",
          description: "User management",
        },
      ],
    },
  });

  if (!isProd) {
    await app.register(swaggerUI, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
        displayOperationId: false,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    });
  }
});
