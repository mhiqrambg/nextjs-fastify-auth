// src/modules/users/controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserBody,
  UpdateUserParams,
} from "./validation";
import type { UsersService } from "./service";
import argon2 from "argon2";

export const usersController = (svc: UsersService) => ({
  list: async (req: FastifyRequest, reply: FastifyReply) => {
    const query = ListUsersQuery.parse(req.query);
    const { rows, total } = await svc.list(query);
    return reply.send({
      data: rows,
      pagination: { page: query.page, pageSize: query.pageSize, total },
    });
  },

  create: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = CreateUserInput.parse(req.body);
    try {
      const user = await svc.create(body);
      reply.code(201).send({
        message: "User created successfully",
        data: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  update: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = req.user;

    const body = UpdateUserBody.parse(req.body);

    try {
      if (body.password) {
        body.password = await argon2.hash(body.password);
      }
      const user = await svc.update(id, body);
      reply.send({ message: "User updated successfully", data: user });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  delete: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = UpdateUserParams.parse(req.params);

    try {
      await svc.delete(id);
      return reply.send({ message: "User deleted successfully" });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  dashboard: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = req.user;

    try {
      const user = await svc.findUser(id);
      if (!user) {
        throw app.httpErrors.notFound("User not found");
      }

      return reply.send({
        message: "Successfully get dashboard data",
        data: {
          name: user.name,
          id: user.id,
          email: user.email,
        },
      });
    } catch (err: any) {
      req.log.error(err);
      throw err;
    }
  },

  me: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = req.user;

    try {
      const user = await svc.findUser(id);
      if (!user) {
        throw app.httpErrors.notFound("User not found");
      }

      return reply.send({ message: "Successfully get user data", data: user });
    } catch (err: any) {
      req.log.error(err);

      throw err;
    }
  },
});
