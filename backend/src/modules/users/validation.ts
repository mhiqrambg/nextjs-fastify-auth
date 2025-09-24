import { z } from "zod";

export const UserRow = z.object({
  id: z.uuid(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
  tv: z.number(),
  email: z.string(),
  password: z.string(),
  phone_number: z.string(),
  phone_verified_at: z.string(),
  email_verified_at: z.string(),
  updated_at: z.string(),
});

export const CreateUserInput = z.object({
  name: z.string().min(1),
  password: z.string().min(5),
  phone_number: z.string(),
  email: z.email(),
});

export const UpdateUserParams = z.object({
  id: z.uuid(),
});

export const UpdateUserBody = z
  .object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(5).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export const ListUsersQuery = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["created_at", "name"]).default("created_at"),
  order: z.enum(["ASC", "DESC"]).default("DESC"),
});

export const ListUsersResp = z.object({
  data: z.array(UserRow),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
  }),
});

//Schema JSON Swagger
export const ParamsUserSchemaJSON = z.toJSONSchema(UpdateUserParams, {
  target: "draft-7",
  io: "output",
});

export const UpdateUserSchemaJSON = z.toJSONSchema(UpdateUserBody, {
  target: "draft-7",
  io: "output",
});

// Types
export type TUserRow = z.infer<typeof UserRow>;
export type TCreateUserInput = z.infer<typeof CreateUserInput>;
export type TUpdateUserInput = z.infer<typeof UpdateUserBody>;
export type TListUsersQuery = z.infer<typeof ListUsersQuery>;
