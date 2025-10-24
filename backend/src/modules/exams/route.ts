import type { FastifyInstance } from "fastify";
import { examsController } from "./controller";
import {
  IDUUIDJSON,
  CreateExamInputJSON,
  UpdateExamInputJSON,
} from "./validation";

export default async function examsRoutes(app: FastifyInstance) {
  const ctrl = examsController(app.examsService);

  // ==========================
  // EXAMS
  // ==========================
  app.get(
    "/",
    {
      schema: {
        tags: ["Exams"],
        summary: "List all exams",
      },
    },
    ctrl.list
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Exams"],
        summary: "Get exam by ID",
        params: IDUUIDJSON,
      },
    },
    ctrl.getById
  );

  app.post(
    "/",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams"],
        summary: "Create exam",
        body: CreateExamInputJSON,
      },
    },
    ctrl.create
  );

  app.put(
    "/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams"],
        summary: "Update exam",
        params: IDUUIDJSON,
        body: UpdateExamInputJSON,
      },
    },
    ctrl.update
  );

  app.delete(
    "/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams"],
        summary: "Delete exam",
        params: IDUUIDJSON,
      },
    },
    ctrl.delete
  );

  // ==========================
  // QUESTIONS
  // ==========================
  app.get(
    "/:id/questions",
    {
      schema: {
        tags: ["Exams"],
        summary: "Get exam questions",
        params: IDUUIDJSON,
      },
    },
    ctrl.getQuestions
  );

  app.post(
    "/questions",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams - Questions"],
        summary: "Create question",
      },
    },
    ctrl.createQuestion
  );

  app.put(
    "/questions/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams - Questions"],
        summary: "Update question",
        params: IDUUIDJSON,
      },
    },
    ctrl.updateQuestion
  );

  app.delete(
    "/questions/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams - Questions"],
        summary: "Delete question",
        params: IDUUIDJSON,
      },
    },
    ctrl.deleteQuestion
  );

  // ==========================
  // OPTIONS
  // ==========================
  app.get(
    "/questions/:id/options",
    {
      schema: {
        tags: ["Exams - Options"],
        summary: "Get question options",
        params: IDUUIDJSON,
      },
    },
    ctrl.getOptions
  );

  app.post(
    "/options",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams - Options"],
        summary: "Create option",
      },
    },
    ctrl.createOption
  );

  app.put(
    "/options/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams - Options"],
        summary: "Update option",
        params: IDUUIDJSON,
      },
    },
    ctrl.updateOption
  );

  app.delete(
    "/options/:id",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams - Options"],
        summary: "Delete option",
        params: IDUUIDJSON,
      },
    },
    ctrl.deleteOption
  );

  // ==========================
  // EXAM-QUESTIONS LINK
  // ==========================
  app.post(
    "/link-question",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams"],
        summary: "Link question to exam",
      },
    },
    ctrl.linkQuestion
  );

  app.post(
    "/unlink-question",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams"],
        summary: "Unlink question from exam",
      },
    },
    ctrl.unlinkQuestion
  );

  // ==========================
  // SUBMIT & LEADERBOARD
  // ==========================
  app.post(
    "/submit",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams"],
        summary: "Submit exam",
      },
    },
    ctrl.submitExam
  );

  app.get(
    "/leaderboard",
    {
      schema: {
        tags: ["Exams"],
        summary: "Get exam leaderboard",
      },
    },
    ctrl.getLeaderboard
  );

  app.get(
    "/:id/my-score",
    {
      preValidation: [app.auth],
      schema: {
        tags: ["Exams"],
        summary: "Get my score for an exam",
        params: IDUUIDJSON,
      },
    },
    ctrl.getUserScore
  );
}
