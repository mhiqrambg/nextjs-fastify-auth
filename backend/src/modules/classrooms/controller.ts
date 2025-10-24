import type { FastifyRequest, FastifyReply } from "fastify";
import type { ClassroomsService } from "./service";
import {
  CreateClassroomInput,
  UpdateClassroomInput,
  ClassroomIdParam,
  ListClassroomsQuery,
  JoinClassroomInput,
  AddMemberInput,
  RemoveMemberInput,
} from "./validation";

export const classroomsController = (svc: ClassroomsService) => ({
  // ==========================
  // CLASSROOMS
  // ==========================
  list: async (req: FastifyRequest, reply: FastifyReply) => {
    const query = ListClassroomsQuery.parse(req.query);
    const userId = req.user?.id;
    const { rows, total } = await svc.list(query, userId);
    return reply.send({
      data: rows,
      pagination: { page: query.page, pageSize: query.pageSize, total },
    });
  },

  getById: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = ClassroomIdParam.parse(req.params);

    try {
      const classroom = await svc.getById(id);
      if (!classroom) {
        throw app.httpErrors.notFound("Classroom not found");
      }
      return reply.send({ message: "Success", data: classroom });
    } catch (err: any) {
      req.log.error(err);
      throw err;
    }
  },

  create: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id: userId } = ClassroomIdParam.parse(req.user);
    const body = CreateClassroomInput.parse(req.body);

    try {
      const classroom = await svc.create(app, body, userId);
      reply.code(201).send({
        message: "Classroom created successfully",
        data: classroom,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  update: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = ClassroomIdParam.parse(req.params);

    const body = UpdateClassroomInput.parse(req.body);

    try {
      const classroom = await svc.update(id, body);
      reply.send({
        message: "Classroom updated successfully",
        data: classroom,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  delete: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = ClassroomIdParam.parse(req.params);

    try {
      await svc.delete(id);
      return reply.send({ message: "Classroom deleted successfully" });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  // ==========================
  // MEMBERS
  // ==========================
  getMembers: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id: classroomId } = ClassroomIdParam.parse(req.params);

    try {
      const members = await svc.getMembers(classroomId);
      return reply.send({ message: "Success", data: members });
    } catch (err: any) {
      req.log.error(err);
      throw app.httpErrors.notFound(err.message);
    }
  },

  joinClassroom: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = JoinClassroomInput.parse(req.body);
    const { id: userId } = req.user;

    try {
      const result = await svc.joinClassroom(body, userId);
      reply.code(201).send({
        message: "Successfully joined classroom",
        data: result,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  addMember: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = AddMemberInput.parse(req.body);

    try {
      const member = await svc.addMember(body);
      reply.code(201).send({
        message: "Member added successfully",
        data: member,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  removeMember: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = RemoveMemberInput.parse(req.body);

    try {
      await svc.removeMember(body);
      return reply.send({ message: "Member removed successfully" });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },
});
