import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import type {
  IClassroom,
  IClassroomMember,
  IClassroomExam,
  ICreateClassroomInput,
  IUpdateClassroomInput,
  IJoinClassroomInput,
  IAddMemberInput,
  IUpdateMemberProgressInput,
  IAssignExamInput,
  IUnassignExamInput,
} from "@/types/Classroom";

export const classroomService = {
  // Get all classrooms
  getClassrooms: async (params?: {
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: string;
  }) => {
    const response = await instance.get(endpoint.CLASSROOMS, { params });
    return response.data;
  },

  // Get classroom by ID
  getClassroomById: async (id: string) => {
    const response = await instance.get(`${endpoint.CLASSROOMS}/${id}`);
    return response.data;
  },

  // Create classroom
  createClassroom: async (data: ICreateClassroomInput) => {
    const response = await instance.post(endpoint.CLASSROOMS, data);
    return response.data;
  },

  // Update classroom
  updateClassroom: async (id: string, data: IUpdateClassroomInput) => {
    const response = await instance.put(`${endpoint.CLASSROOMS}/${id}`, data);
    return response.data;
  },

  // Delete classroom
  deleteClassroom: async (id: string) => {
    const response = await instance.delete(`${endpoint.CLASSROOMS}/${id}`);
    return response.data;
  },

  // Get classroom members
  getClassroomMembers: async (classroomId: string) => {
    const response = await instance.get(
      `${endpoint.CLASSROOMS}/${classroomId}/members`,
    );
    return response.data;
  },

  // Join classroom with code
  joinClassroom: async (data: IJoinClassroomInput) => {
    const response = await instance.post(`${endpoint.CLASSROOMS}/join`, data);
    return response.data;
  },

  // Add member to classroom
  addMember: async (data: IAddMemberInput) => {
    const response = await instance.post(
      `${endpoint.CLASSROOMS}/members`,
      data,
    );
    return response.data;
  },

  // Remove member from classroom
  removeMember: async (classroomId: string, userId: string) => {
    const response = await instance.delete(
      `${endpoint.CLASSROOMS}/${classroomId}/members`,
      {
        params: { userId },
      },
    );
    return response.data;
  },

  // Update member progress
  updateMemberProgress: async (data: IUpdateMemberProgressInput) => {
    const response = await instance.put(
      `${endpoint.CLASSROOMS}/members/progress`,
      data,
    );
    return response.data;
  },

  // Get classroom exams
  getClassroomExams: async (classroomId: string) => {
    const response = await instance.get(
      `${endpoint.CLASSROOMS}/${classroomId}/exams`,
    );
    return response.data;
  },

  // Assign exam to classroom
  assignExam: async (data: IAssignExamInput) => {
    const response = await instance.post(
      `${endpoint.CLASSROOMS}/exams/assign`,
      data,
    );
    return response.data;
  },

  // Unassign exam from classroom
  unassignExam: async (data: IUnassignExamInput) => {
    const response = await instance.post(
      `${endpoint.CLASSROOMS}/exams/unassign`,
      data,
    );
    return response.data;
  },
};

export default classroomService;
