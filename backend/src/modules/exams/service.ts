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
  TStartExamInput,
  TJoinExamInput,
  TCreateAnswerInput,
} from "./validation";
import { generateCode } from "../../helper/generateCode";
import { transformExamDetail } from "./mapper";

export type ExamsRepo = ReturnType<typeof examsModel>;

export const examsService = (repo: ExamsRepo) => {
  return {
    // EXAMS
    list: (params: TListExamsQuery) => repo.findAll(params),

    getById: async (id: string): Promise<any> => {
      const e = await repo.findByIdWithDetailsFlat(id);

      if (!e) throw new Error("Exam not found");

      const a = await repo.findAttemptByExamId(id);

      const exam = transformExamDetail(e);

      exam.attempts = a ?? [];
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

    // QUESTIONS
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

    // OPTIONS
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

    // USER EXAMS / START
    getAttempt: async (examId: string) => {
      const attempt = await repo.findAttemptByExamId(examId);
      if (!attempt) throw new Error("Attempt not found");
      return attempt;
    },

    joinExam: async (data: TJoinExamInput, userId: string) => {
      const xm = await repo.findByCode(data.code);
      if (!xm) throw new Error("Exam not found");
      if (!xm.is_active) throw new Error("Exam is not active");

      const exs = await repo
        .findMemberByUserAndClassroom(xm.classroom_id, userId)
        .catch(() => null);

      if (!exs) throw new Error("Not a member of this classroom");

      const usxm = await repo
        .findUserExamByUserIdAndExamId(userId, xm.id)
        .catch(() => null);

      if (usxm) throw new Error("Already joined this exam");

      const jxm = await repo.joinExam({
        user_id: userId,
        exam_id: xm.id,
        score: 0,
        status: "in_progress",
        submit_time: null,
      });

      if (!jxm) throw new Error("Failed to join exam");

      return jxm;
    },
    startExam: async (data: TStartExamInput) => {
      const exam = await repo.findById(data.exam_id);
      if (!exam) throw new Error("Exam not found");

      data.status = "in_progress";
      data.score = 0;

      const userExam = await repo.startExam(data);
      if (!userExam) throw new Error("Failed to start exam");

      return userExam;
    },

    // USER ANSWERS
    createAnswer: async (data: TCreateAnswerInput) => {
      const exs = await repo.findUserExamByIdAndQuestionId(
        data.user_exam_id,
        data.question_id
      );

      if (exs) throw new Error("You have already answered this question");

      const o = await repo.findOptionById(data.option_id);
      if (!o) throw new Error("Option not found");

      if (o.question_id !== data.question_id)
        throw new Error("Option does not belong to question");

      const a = await repo.createAnswer(data);
      if (!a) throw new Error("Failed to create answer");

      return a;
    },
    getAnswer: async (userExamId: string) => {
      const va = await repo.viewAnswer(userExamId);
      if (!va) throw new Error("You have not answered this question");

      return va;
    },

    // EXAM-QUESTIONS LINK
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

    // USER EXAMS
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
