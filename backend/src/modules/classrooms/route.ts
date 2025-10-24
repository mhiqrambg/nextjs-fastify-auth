import type { FastifyInstance } from "fastify";
import { classroomsController } from "./controller";
import {
  ClassroomIdParamJSON,
  CreateClassroomInputJSON,
  UpdateClassroomInputJSON,
} from "./validation";

export default async function classroomsRoutes(app: FastifyInstance) {
  const ctrl = classroomsController(app.classroomsService);

  // ==========================
  // CLASSROOMS
  // ==========================
  app.get(
    "/",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "List all classrooms",
      },
    },
    ctrl.list
  );

  app.get(
    "/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Get classroom by ID",
        params: ClassroomIdParamJSON,
      },
    },
    ctrl.getById
  );

  app.post(
    "/",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Create classroom",
        body: CreateClassroomInputJSON,
      },
    },
    ctrl.create
  );

  app.put(
    "/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Update classroom",
        params: ClassroomIdParamJSON,
        body: UpdateClassroomInputJSON,
      },
    },
    ctrl.update
  );

  app.delete(
    "/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Delete classroom",
        params: ClassroomIdParamJSON,
      },
    },
    ctrl.delete
  );

  // ==========================
  // MEMBERS
  // ==========================
  app.get(
    "/:id/members",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Get classroom members",
        params: ClassroomIdParamJSON,
      },
    },
    ctrl.getMembers
  );

  app.post(
    "/join",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Join classroom with code",
      },
    },
    ctrl.joinClassroom
  );

  app.post(
    "/members",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Add member to classroom",
      },
    },
    ctrl.addMember
  );

  app.delete(
    "/members",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Classrooms"],
        summary: "Remove member from classroom",
      },
    },
    ctrl.removeMember
  );
}
