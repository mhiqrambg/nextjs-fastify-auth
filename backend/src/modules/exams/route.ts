import type { FastifyInstance } from "fastify";
import { examsController } from "./controller";
import {
  IDUUIDJSON,
  CreateExamInputJSON,
  UpdateExamInputJSON,
  CreateAnswerInputJSON,
  StartExamInputJSON,
  JoinExamInputJSON,
} from "./validation";

// middleware
import { isStudent, isTeacher } from "../../plugins/jwt";

export default async function examsRoutes(app: FastifyInstance) {
  const ctrl = examsController(app.examsService);

  // EXAMS
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
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
      schema: {
        tags: ["Exams"],
        summary: "Delete exam",
        params: IDUUIDJSON,
      },
    },
    ctrl.delete
  );

  // QUESTIONS
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
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
      schema: {
        tags: ["Exams - Questions"],
        summary: "Delete question",
        params: IDUUIDJSON,
      },
    },
    ctrl.deleteQuestion
  );

  // OPTIONS
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
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
      schema: {
        tags: ["Exams - Options"],
        summary: "Delete option",
        params: IDUUIDJSON,
      },
    },
    ctrl.deleteOption
  );

  // USER EXAMS

  app.get(
    "/:id/attempt",
    {
      schema: {
        tags: ["Exams - User Exams"],
        summary: "Get attempt by exam id",
        params: IDUUIDJSON,
      },
    },
    ctrl.getAttempt
  );

  app.post(
    "/start",
    {
      preValidation: [app.auth, isStudent],
      schema: {
        tags: ["Exams - User Exams"],
        summary: "Start exam",
        body: StartExamInputJSON,
      },
    },
    ctrl.startExam
  );

  app.post(
    "/join",
    {
      preValidation: [app.auth, isStudent],
      schema: {
        tags: ["Exams - User Exams"],
        summary: "Join exam",
        body: JoinExamInputJSON,
      },
    },
    ctrl.joinExam
  );

  // USER ANSWERS
  app.post(
    "/answers",
    {
      preValidation: [app.auth, isStudent],
      schema: {
        tags: ["Exams - Answers"],
        summary: "Create answer",
        body: CreateAnswerInputJSON,
      },
    },
    ctrl.createAnswer
  );

  app.get(
    "/answers/:id",
    {
      preValidation: [app.auth, isStudent],
      schema: {
        tags: ["Exams - Answers"],
        summary: "Get all answers by user exam id",
        params: IDUUIDJSON,
      },
    },
    ctrl.getAnswer
  );

  // EXAM-QUESTIONS LINK
  app.post(
    "/link-question",
    {
      preValidation: [app.auth, isTeacher],
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
      preValidation: [app.auth, isTeacher],
      schema: {
        tags: ["Exams"],
        summary: "Unlink question from exam",
      },
    },
    ctrl.unlinkQuestion
  );

  // SUBMIT & LEADERBOARD
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
