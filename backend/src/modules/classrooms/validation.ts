import { z } from "zod";

// Classroom schemas
export const ClassroomRow = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  name: z.string(),
  description: z.string(),
  code: z.string(),
  image_url: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateClassroomInput = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image_url: z.string().optional(),
  code: z.string().min(1).optional(),
});

export const UpdateClassroomInput = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    image_url: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const ClassroomIdParam = z.object({
  id: z.uuid(),
});

export const ListClassroomsQuery = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["created_at", "name"]).default("created_at"),
  order: z.enum(["ASC", "DESC"]).default("DESC"),
});

export const JoinClassroomInput = z.object({
  code: z.string().min(1),
});

// Classroom member schemas
export const ClassroomMemberRow = z.object({
  user_id: z.uuid(),
  classroom_id: z.uuid(),
});

export const AddMemberInput = z.object({
  classroom_id: z.uuid(),
  user_id: z.uuid(),
});

export const RemoveMemberInput = z.object({
  classroom_id: z.uuid(),
  user_id: z.uuid(),
});

// Schema JSON for Swagger
export const ClassroomIdParamJSON = z.toJSONSchema(ClassroomIdParam, {
  target: "draft-7",
  io: "output",
});

export const CreateClassroomInputJSON = z.toJSONSchema(CreateClassroomInput, {
  target: "draft-7",
  io: "output",
});

export const UpdateClassroomInputJSON = z.toJSONSchema(UpdateClassroomInput, {
  target: "draft-7",
  io: "output",
});

export const JoinClassroomInputJSON = z.toJSONSchema(JoinClassroomInput, {
  target: "draft-7",
  io: "output",
});

// Types
export type TClassroomRow = z.infer<typeof ClassroomRow>;
export type TCreateClassroomInput = z.infer<typeof CreateClassroomInput>;
export type TUpdateClassroomInput = z.infer<typeof UpdateClassroomInput>;
export type TListClassroomsQuery = z.infer<typeof ListClassroomsQuery>;
export type TJoinClassroomInput = z.infer<typeof JoinClassroomInput>;
export type TClassroomMemberRow = z.infer<typeof ClassroomMemberRow>;
export type TAddMemberInput = z.infer<typeof AddMemberInput>;
export type TRemoveMemberInput = z.infer<typeof RemoveMemberInput>;
export type TJoinClassroomInputJSON = z.infer<typeof JoinClassroomInputJSON>;
