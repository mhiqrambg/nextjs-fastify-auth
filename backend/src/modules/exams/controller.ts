import type { FastifyRequest, FastifyReply } from "fastify";
import type { ExamsService } from "./service";
import {
  CreateExamInput,
  UpdateExamInput,
  ListExamsQuery,
  CreateQuestionInput,
  UpdateQuestionInput,
  CreateOptionInput,
  UpdateOptionInput,
  LinkQuestionInput,
  SubmitExamInput,
  LeaderboardQuery,
  IDUUID,
} from "./validation";

export const examsController = (svc: ExamsService) => ({
  // ==========================
  // EXAMS
  // ==========================
  list: async (req: FastifyRequest, reply: FastifyReply) => {
    const query = ListExamsQuery.parse(req.query);
    const { rows, total } = await svc.list(query);
    return reply.send({
      data: rows,
      pagination: { page: query.page, pageSize: query.pageSize, total },
    });
  },

  getById: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = IDUUID.parse(req.params);

    try {
      const exam = await svc.getById(id);
      if (!exam) {
        throw app.httpErrors.notFound("Exam not found");
      }
      return reply.send({ message: "Success", data: exam });
    } catch (err: any) {
      req.log.error(err);
      throw err;
    }
  },

  create: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id: userId } = IDUUID.parse(req.user);
    const data = CreateExamInput.parse(req.body);

    try {
      const exam = await svc.create(app, data, userId);
      reply.code(201).send({
        message: "Exam created successfully",
        data: exam,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  update: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = IDUUID.parse(req.params);
    const body = UpdateExamInput.parse(req.body);

    try {
      const exam = await svc.update(id, body);
      reply.send({ message: "Exam updated successfully", data: exam });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  delete: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = IDUUID.parse(req.params);

    try {
      await svc.delete(id);
      return reply.send({ message: "Exam deleted successfully" });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  // ==========================
  // QUESTIONS
  // ==========================
  getQuestions: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id: examId } = IDUUID.parse(req.params);

    try {
      const questions = await svc.getQuestionsByExamId(examId);
      return reply.send({ message: "Success", data: questions });
    } catch (err: any) {
      req.log.error(err);
      throw app.httpErrors.notFound(err.message);
    }
  },

  createQuestion: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = CreateQuestionInput.parse(req.body);

    try {
      const question = await svc.createQuestion(body);
      reply.code(201).send({
        message: "Question created successfully",
        data: question,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  updateQuestion: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = IDUUID.parse(req.params);
    const body = UpdateQuestionInput.parse(req.body);

    try {
      const question = await svc.updateQuestion(id, body);
      reply.send({
        message: "Question updated successfully",
        data: question,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  deleteQuestion: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = IDUUID.parse(req.params);

    try {
      await svc.deleteQuestion(id);
      return reply.send({ message: "Question deleted successfully" });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  // ==========================
  // OPTIONS
  // ==========================
  getOptions: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id: questionId } = IDUUID.parse(req.params);

    try {
      const options = await svc.getOptionsByQuestionId(questionId);
      return reply.send({ message: "Success", data: options });
    } catch (err: any) {
      req.log.error(err);
      throw app.httpErrors.notFound(err.message);
    }
  },

  createOption: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = CreateOptionInput.parse(req.body);

    try {
      const option = await svc.createOption(body);
      reply.code(201).send({
        message: "Option created successfully",
        data: option,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  updateOption: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = IDUUID.parse(req.params);
    const body = UpdateOptionInput.parse(req.body);

    try {
      const option = await svc.updateOption(id, body);
      reply.send({
        message: "Option updated successfully",
        data: option,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  deleteOption: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id } = IDUUID.parse(req.params);

    try {
      await svc.deleteOption(id);
      return reply.send({ message: "Option deleted successfully" });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  // ==========================
  // EXAM-QUESTIONS LINK
  // ==========================
  linkQuestion: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = LinkQuestionInput.parse(req.body);

    try {
      const result = await svc.linkQuestion(body);
      reply.send({ message: "Question linked successfully", data: result });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  unlinkQuestion: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { examId, questionId } = req.body as {
      examId: string;
      questionId: string;
    };

    try {
      const result = await svc.unlinkQuestion(examId, questionId);
      reply.send({ message: "Question unlinked successfully", data: result });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  // ==========================
  // SUBMIT & LEADERBOARD
  // ==========================
  submitExam: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const body = SubmitExamInput.parse(req.body);
    const { id: userId } = req.user;

    try {
      const result = await svc.submitExam(body, userId);
      reply.send({
        message: "Exam submitted successfully",
        data: result,
      });
    } catch (err: any) {
      throw app.httpErrors.badRequest(err.message);
    }
  },

  getLeaderboard: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const query = LeaderboardQuery.parse(req.query);

    try {
      const leaderboard = await svc.getLeaderboard(query);
      return reply.send({ message: "Success", data: leaderboard });
    } catch (err: any) {
      req.log.error(err);
      throw app.httpErrors.notFound(err.message);
    }
  },

  getUserScore: async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server;
    const { id: examId } = IDUUID.parse(req.params);
    const { id: userId } = req.user;

    try {
      const score = await svc.getUserScore(userId, examId);
      return reply.send({ message: "Success", data: score });
    } catch (err: any) {
      req.log.error(err);
      throw app.httpErrors.notFound("Score not found");
    }
  },
});
