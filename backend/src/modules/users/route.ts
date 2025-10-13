// src/modules/users/route.ts

import type { FastifyInstance } from "fastify";
import { usersController } from "./controller";
import { ParamsUserSchemaJSON } from "./validation";

export default async function usersRoutes(app: FastifyInstance) {
  const ctrl = usersController(app.usersService);
  app.get(
    "/me",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Users"],
        summary: "Me",
      },
    },
    ctrl.me
  );
  app.get(
    "/",
    {
      schema: { tags: ["Users"], summary: "List users" },
    },
    ctrl.list
  );
  app.post(
    "/",
    {
      schema: { tags: ["Users"], summary: "Create user" },
    },
    ctrl.create
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: ParamsUserSchemaJSON,
        tags: ["Users"],
        summary: "Delete user",
      },
    },
    ctrl.delete
  );
  app.put(
    "/",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Users"],
        summary: "Update user",
      },
    },
    ctrl.update
  );
  app.get(
    "/dashboard",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Users"],
        summary: "Dashboard",
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    ctrl.dashboard
  );
}
