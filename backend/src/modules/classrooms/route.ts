import type { FastifyInstance } from "fastify";
import { classroomsController } from "./controller";
import {
  ClassroomIdParamJSON,
  CreateClassroomInputJSON,
  JoinClassroomInputJSON,
  UpdateClassroomInputJSON,
} from "./validation";

// middleware
import { isStudent, isTeacher } from "../../plugins/jwt";

export default async function classroomsRoutes(app: FastifyInstance) {
  const ctrl = classroomsController(app.classroomsService);

  // All Classrooms
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
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
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

  // CLASSROOM EXAMS
  app.get(
    "/:id/exams",
    {
      schema: {
        tags: ["Classrooms - Exams"],
        summary: "Get classroom exams",
        params: ClassroomIdParamJSON,
      },
    },
    ctrl.getExams
  );

  // MEMBERS
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
      preValidation: [app.auth, isStudent],
      schema: {
        tags: ["Classrooms"],
        summary: "Join classroom with code",
        body: JoinClassroomInputJSON,
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
