import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import type { IExamAttempt, IExamResult, IQuestion } from "@/types/Exam";

// Exam service - Real API calls
export const examService = {
  // Get all available exams
  getExams: async (params?: {
    q?: string;
    page?: number;
    pageSize?: number;
    category?: string;
    difficulty?: string;
    sort?: string;
    order?: string;
  }) => {
    const response = await instance.get(endpoint.EXAMS, { params });
    return response.data;
  },

  // Get exam by ID
  getExamById: async (id: string) => {
    const response = await instance.get(`${endpoint.EXAMS}/${id}`);
    return response.data;
  },

  // Get questions for an exam
  getExamQuestions: async (examId: string): Promise<{ data: IQuestion[] }> => {
    const response = await instance.get(
      `${endpoint.EXAMS}/${examId}/questions`,
    );
    return response.data;
  },

  // Create exam
  createExam: async (data: {
    title: string;
    description?: string;
    duration: number;
    passing_score?: number;
    difficulty?: "easy" | "medium" | "hard";
    category: string;
    is_active?: boolean;
  }) => {
    const response = await instance.post(endpoint.EXAMS, data);
    return response.data;
  },

  // Update exam
  updateExam: async (
    id: string,
    data: Partial<{
      title: string;
      description?: string;
      duration: number;
      passing_score: number;
      difficulty: "easy" | "medium" | "hard";
      category: string;
      is_active: boolean;
    }>,
  ) => {
    const response = await instance.put(`${endpoint.EXAMS}/${id}`, data);
    return response.data;
  },

  // Delete exam
  deleteExam: async (id: string) => {
    const response = await instance.delete(`${endpoint.EXAMS}/${id}`);
    return response.data;
  },

  // Create question
  createQuestion: async (data: {
    exam_id: string;
    question: string;
    options: Array<{ id: string; text: string; value: string }>;
    correct_answer: string;
    explanation?: string;
    points?: number;
    order_num: number;
  }) => {
    const response = await instance.post(`${endpoint.EXAMS}/questions`, data);
    return response.data;
  },

  // Update question
  updateQuestion: async (
    id: string,
    data: Partial<{
      question: string;
      options: Array<{ id: string; text: string; value: string }>;
      correct_answer: string;
      explanation?: string;
      points: number;
      order_num: number;
    }>,
  ) => {
    const response = await instance.put(
      `${endpoint.EXAMS}/questions/${id}`,
      data,
    );
    return response.data;
  },

  // Delete question
  deleteQuestion: async (id: string) => {
    const response = await instance.delete(`${endpoint.EXAMS}/questions/${id}`);
    return response.data;
  },

  // Start an exam attempt
  startExamAttempt: async (examId: string): Promise<{ data: IExamAttempt }> => {
    const response = await instance.post(`${endpoint.EXAMS}/start`, {
      exam_id: examId,
    });
    return response.data;
  },

  // Get attempt by ID
  getAttempt: async (attemptId: string) => {
    const response = await instance.get(
      `${endpoint.EXAMS}/attempts/${attemptId}`,
    );
    return response.data;
  },

  // Get user attempts
  getUserAttempts: async () => {
    const response = await instance.get(`${endpoint.EXAMS}/attempts`);
    return response.data;
  },

  // Save answer
  saveAnswer: async (data: {
    attempt_id: string;
    question_id: string;
    selected_answer: string;
  }) => {
    const response = await instance.post(`${endpoint.EXAMS}/answers`, data);
    return response.data;
  },

  // Submit exam attempt
  submitExamAttempt: async (
    attemptId: string,
    answers: Record<string, string>,
  ): Promise<{ data: IExamResult }> => {
    const response = await instance.post(`${endpoint.EXAMS}/submit`, {
      attempt_id: attemptId,
      answers,
    });
    return response.data;
  },
};
