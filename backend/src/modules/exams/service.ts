import { FastifyInstance } from "fastify/types/instance";
import { examsModel } from "./model";
import type {
  TExamRow,
  TCreateExamInput,
  TUpdateExamInput,
  TListExamsQuery,
  TQuestionRow,
  TCreateQuestionInput,
  TUpdateQuestionInput,
  TCreateOptionInput,
  TUpdateOptionInput,
  TLinkQuestionInput,
  TSubmitExamInput,
  TLeaderboardQuery,
} from "./validation";
import { generateCode } from "../../helper/generateCode";

export type ExamsRepo = ReturnType<typeof examsModel>;

export const examsService = (repo: ExamsRepo) => {
  return {
    // ==========================
    // EXAMS
    // ==========================
    list: (params: TListExamsQuery) => repo.findAll(params),

    getById: async (id: string): Promise<TExamRow | null> => {
      const exam = await repo.findById(id);
      return exam;
    },

    getByCode: async (code: string): Promise<TExamRow | null> => {
      const exam = await repo.findByCode(code);
      return exam;
    },

    create: async (
      app: FastifyInstance,
      data: TCreateExamInput,
      userId: string
    ): Promise<TExamRow> => {
      const code = await generateCode(app, "exams");
      const exam = await repo.create({ ...data, code }, userId);
      if (!exam) throw new Error("Failed to create exam");
      return exam;
    },

    update: async (id: string, data: TUpdateExamInput): Promise<TExamRow> => {
      const exam = await repo.findById(id);
      if (!exam) throw new Error("Exam not found");

      const updatedExam = await repo.update(id, data);
      if (!updatedExam) throw new Error("Failed to update exam");

      return updatedExam;
    },

    delete: async (id: string) => {
      const exam = await repo.findById(id);
      if (!exam) throw new Error("Exam not found");

      const result = await repo.delete(id);
      if (!result) throw new Error("Failed to delete exam");
      return result;
    },

    // ==========================
    // QUESTIONS
    // ==========================
    getQuestion: async (id: string): Promise<TQuestionRow | null> => {
      const question = await repo.findQuestionById(id);
      return question;
    },

    getQuestionsByExamId: async (examId: string): Promise<TQuestionRow[]> => {
      const exam = await repo.findById(examId);
      if (!exam) throw new Error("Exam not found");

      return repo.findQuestionsByExamId(examId);
    },

    createQuestion: async (
      data: TCreateQuestionInput
    ): Promise<TQuestionRow> => {
      const question = await repo.createQuestion(data);
      if (!question) throw new Error("Failed to create question");
      return question;
    },

    updateQuestion: async (
      id: string,
      data: TUpdateQuestionInput
    ): Promise<TQuestionRow> => {
      const question = await repo.findQuestionById(id);
      if (!question) throw new Error("Question not found");

      const updatedQuestion = await repo.updateQuestion(id, data);
      if (!updatedQuestion) throw new Error("Failed to update question");

      return updatedQuestion;
    },

    deleteQuestion: async (id: string) => {
      const question = await repo.findQuestionById(id);
      if (!question) throw new Error("Question not found");

      const result = await repo.deleteQuestion(id);
      if (!result) throw new Error("Failed to delete question");

      return result;
    },

    // ==========================
    // OPTIONS
    // ==========================
    getOptionsByQuestionId: async (questionId: string) => {
      const question = await repo.findQuestionById(questionId);
      if (!question) throw new Error("Question not found");

      return repo.findOptionsByQuestionId(questionId);
    },

    createOption: async (data: TCreateOptionInput) => {
      const question = await repo.findQuestionById(data.question_id);
      if (!question) throw new Error("Question not found");

      const option = await repo.createOption(data);
      if (!option) throw new Error("Failed to create option");

      return option;
    },

    updateOption: async (id: string, data: TUpdateOptionInput) => {
      const option = await repo.findOptionById(id);
      if (!option) throw new Error("Option not found");

      const updatedOption = await repo.updateOption(id, data);
      if (!updatedOption) throw new Error("Failed to update option");

      return updatedOption;
    },

    deleteOption: async (id: string) => {
      const option = await repo.findOptionById(id);
      if (!option) throw new Error("Option not found");

      const result = await repo.deleteOption(id);
      if (!result) throw new Error("Failed to delete option");

      return result;
    },

    // ==========================
    // EXAM-QUESTIONS LINK
    // ==========================
    linkQuestion: async (data: TLinkQuestionInput) => {
      const exam = await repo.findById(data.exam_id);
      if (!exam) throw new Error("Exam not found");

      const question = await repo.findQuestionById(data.question_id);
      if (!question) throw new Error("Question not found");

      await repo.linkQuestion(data);
      return { success: true };
    },

    unlinkQuestion: async (examId: string, questionId: string) => {
      const exam = await repo.findById(examId);
      if (!exam) throw new Error("Exam not found");

      const question = await repo.findQuestionById(questionId);
      if (!question) throw new Error("Question not found");

      await repo.unlinkQuestion(examId, questionId);
      return { success: true };
    },

    // ==========================
    // USER EXAMS (SUBMIT & LEADERBOARD)
    // ==========================
    submitExam: async (data: TSubmitExamInput, userId: string) => {
      const exam = await repo.findById(data.exam_id);
      if (!exam) throw new Error("Exam not found");

      // Get all questions for the exam with their options
      const questions = await repo.findQuestionsByExamId(data.exam_id);

      let correctAnswers = 0;
      let totalQuestions = questions.length;

      // Calculate score
      for (const question of questions) {
        const userAnswer = data.answers[question.id];
        if (!userAnswer) continue;

        // Get the correct option
        const options = await repo.findOptionsByQuestionId(question.id);
        const correctOption = options.find((opt) => opt.is_correct);

        if (correctOption && correctOption.id === userAnswer) {
          correctAnswers++;
        }
      }

      const score =
        totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0;

      // Save to users_exams
      await repo.submitExam(userId, data.exam_id, score);

      return {
        exam_id: data.exam_id,
        user_id: userId,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score,
        percentage: score,
      };
    },

    getLeaderboard: async (params: TLeaderboardQuery) => {
      const exam = await repo.findById(params.exam_id);
      if (!exam) throw new Error("Exam not found");

      return repo.getLeaderboard(params);
    },

    getUserScore: async (userId: string, examId: string) => {
      const exam = await repo.findById(examId);
      if (!exam) throw new Error("Exam not found");

      try {
        return await repo.getUserScore(userId, examId);
      } catch (err) {
        return null; // User hasn't submitted yet
      }
    },
  };
};

export type ExamsService = ReturnType<typeof examsService>;
