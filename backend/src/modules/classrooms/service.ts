import { generateCode } from "@/helper/generateCode";
import { classroomsModel } from "@/modules/classrooms/model";
import type {
  TClassroomRow,
  TCreateClassroomInput,
  TUpdateClassroomInput,
  TListClassroomsQuery,
  TJoinClassroomInput,
  TAddMemberInput,
  TRemoveMemberInput,
} from "@/modules/classrooms/validation";
import type { FastifyInstance } from "fastify/types/instance";

export type ClassroomsRepo = ReturnType<typeof classroomsModel>;

export const classroomsService = (repo: ClassroomsRepo) => {
  return {
    // CLASSROOMS
    list: (params: TListClassroomsQuery, userId?: string) =>
      repo.findAll(params, userId),

    getById: async (id: string): Promise<TClassroomRow | null> => {
      const classroom = await repo.findById(id);
      if (!classroom) throw new Error("Classroom not found");

      return classroom;
    },

    create: async (
      app: FastifyInstance,
      data: TCreateClassroomInput,
      userId: string
    ): Promise<TClassroomRow> => {
      const code = await generateCode(app, "classrooms");
      const classroom = await repo.create({ ...data, code }, userId);
      if (!classroom) throw new Error("Failed to create classroom");
      return classroom;
    },

    update: async (
      id: string,
      data: TUpdateClassroomInput
    ): Promise<TClassroomRow> => {
      const classroom = await repo.findById(id);
      if (!classroom) throw new Error("Classroom not found");

      const updatedClassroom = await repo.update(id, data);
      if (!updatedClassroom) throw new Error("Failed to update classroom");

      return updatedClassroom;
    },

    delete: async (id: string) => {
      const classroom = await repo.findById(id);
      if (!classroom) throw new Error("Classroom not found");

      const result = await repo.delete(id);
      if (!result) throw new Error("Failed to delete classroom");
      return result;
    },

    // MEMBERS
    getMembers: async (classroomId: string) => {
      const c = await repo.findById(classroomId);
      if (!c) throw new Error("Classroom not found");
      const m = await repo.findMembers(classroomId);

      return m;
    },

    joinClassroom: async (data: TJoinClassroomInput, userId: string) => {
      const c = await repo.findByCode(data.code);
      if (!c) throw new Error("Classroom not found with this code");

      const existingMember = await repo
        .findMemberByUserAndClassroom(c.id, userId)
        .catch(() => null);

      if (existingMember) {
        throw new Error("Already a member of this classroom");
      }

      const m = await repo.addMember({
        classroom_id: c.id,
        user_id: userId,
      });

      if (!m) throw new Error("Failed to join classroom");

      return { c, m };
    },

    addMember: async (data: TAddMemberInput) => {
      const classroom = await repo.findById(data.classroom_id);
      if (!classroom) throw new Error("Classroom not found");

      const existingMember = await repo
        .findMemberByUserAndClassroom(data.classroom_id, data.user_id)
        .then((res) => null);

      if (existingMember) {
        throw new Error("User is already a member of this classroom");
      }

      const member = await repo.addMember(data);
      if (!member) throw new Error("Failed to add member");

      return member;
    },

    removeMember: async (data: TRemoveMemberInput) => {
      const classroom = await repo.findById(data.classroom_id);
      if (!classroom) throw new Error("Classroom not found");

      const member = await repo.findMemberByUserAndClassroom(
        data.classroom_id,
        data.user_id
      );
      if (!member) throw new Error("Member not found");

      const result = await repo.removeMember(data.classroom_id, data.user_id);
      if (!result) throw new Error("Failed to remove member");

      return result;
    },

    // CLASSROOM EXAMS
    getExams: async (classroomId: string) => {
      return repo.findExamsByClassroomId(classroomId);
    },
  };
};

export type ClassroomsService = ReturnType<typeof classroomsService>;
