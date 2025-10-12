// src/modules/users/service.ts

import { usersModel } from "./model";
import type {
  TCreateUserInput,
  TListUsersQuery,
  TUpdateUserInput,
  TUserRow,
} from "./validation";
import { hashRefresh } from "../../utils";

export type UsersRepo = ReturnType<typeof usersModel>;

export const usersService = (repo: UsersRepo) => {
  return {
    list: (params: TListUsersQuery) => repo.findAll(params),

    create: async (data: TCreateUserInput): Promise<TUserRow> => {
      const existingUser = await repo.findUserByEmail(data.email);
      if (existingUser) throw new Error("Email already exists");

      const hashedPassword = await hashRefresh(data.password);

      const user = await repo.create({
        ...data,
        password: hashedPassword,
      });

      if (!user) throw new Error("Failed to create user");

      return user;
    },

    update: async (id: string, data: TUpdateUserInput): Promise<TUserRow> => {
      const user = await repo.findById(id);
      if (!user) throw new Error("User not found");
      const updatedUser = await repo.update(id, data);
      if (!updatedUser) throw new Error("Failed to update user");
      return updatedUser;
    },

    delete: async (id: string) => {
      const user = await repo.findById(id);
      if (!user) throw new Error("User not found");
      const result = await repo.delete(id);
      if (!result) throw new Error("Failed to delete user");
      return result;
    },

    findUser: async (id: string) => {
      const user = await repo.findById(id);

      if (!user) throw new Error("User not found");

      const newUser = {
        ...user,
        password: undefined,
      };

      return newUser;
    },
  };
};

export type UsersService = ReturnType<typeof usersService>;
