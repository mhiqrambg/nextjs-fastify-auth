import { z } from "zod";

// Exam schemas
export const ExamRow = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  classroom_id: z.uuid(),
  title: z.string(),
  description: z.string(),
  duration_minutes: z.number(),
  passing_score: z.number().min(1).max(100),
  code: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateExamInput = z.object({
  classroom_id: z.uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  passing_score: z.number().min(1).max(100),
  duration_minutes: z.number().min(1),
});

export const UpdateExamInput = z
  .object({
    classroom_id: z.uuid().optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    passing_score: z.number().min(1).max(100).optional(),
    duration_minutes: z.number().min(1).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const IDUUID = z.object({
  id: z.uuid(),
});

export const ListExamsQuery = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["created_at", "title"]).default("created_at"),
  order: z.enum(["ASC", "DESC"]).default("DESC"),
});

// Question schemas
export const QuestionRow = z.object({
  id: z.uuid(),
  text: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateQuestionInput = z.object({
  text: z.string().min(1),
  is_active: z.boolean().default(true),
});

export const UpdateQuestionInput = z
  .object({
    text: z.string().min(1).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// Option schemas
export const OptionRow = z.object({
  id: z.uuid(),
  question_id: z.uuid(),
  text: z.string(),
  is_correct: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateOptionInput = z.object({
  question_id: z.uuid(),
  text: z.string().min(1),
  is_correct: z.boolean().default(false),
});

export const UpdateOptionInput = z
  .object({
    text: z.string().min(1).optional(),
    is_correct: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// Exam-Question link schemas
export const LinkQuestionInput = z.object({
  exam_id: z.uuid(),
  question_id: z.uuid(),
});

// User exam (leaderboard) schemas
export const UserExamRow = z.object({
  user_id: z.uuid(),
  exam_id: z.uuid(),
  score: z.number(),
  submit_time: z.string(),
  updated_at: z.string(),
});

export const SubmitExamInput = z.object({
  exam_id: z.uuid(),
  answers: z.record(z.uuid(), z.uuid()), // question_id -> option_id
});

export const LeaderboardQuery = z.object({
  exam_id: z.uuid(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Schema JSON for Swagger
export const IDUUIDJSON = z.toJSONSchema(IDUUID, {
  target: "draft-7",
  io: "output",
});

export const CreateExamInputJSON = z.toJSONSchema(CreateExamInput, {
  target: "draft-7",
  io: "output",
});

export const UpdateExamInputJSON = z.toJSONSchema(UpdateExamInput, {
  target: "draft-7",
  io: "output",
});

// Types
export type TExamRow = z.infer<typeof ExamRow>;
export type TCreateExamInput = z.infer<typeof CreateExamInput>;
export type TUpdateExamInput = z.infer<typeof UpdateExamInput>;
export type TListExamsQuery = z.infer<typeof ListExamsQuery>;
export type TQuestionRow = z.infer<typeof QuestionRow>;
export type TCreateQuestionInput = z.infer<typeof CreateQuestionInput>;
export type TUpdateQuestionInput = z.infer<typeof UpdateQuestionInput>;
export type TOptionRow = z.infer<typeof OptionRow>;
export type TCreateOptionInput = z.infer<typeof CreateOptionInput>;
export type TUpdateOptionInput = z.infer<typeof UpdateOptionInput>;
export type TLinkQuestionInput = z.infer<typeof LinkQuestionInput>;
export type TUserExamRow = z.infer<typeof UserExamRow>;
export type TSubmitExamInput = z.infer<typeof SubmitExamInput>;
export type TLeaderboardQuery = z.infer<typeof LeaderboardQuery>;
