// src/modules/users/model.ts

import type { FastifyInstance } from "fastify";
import type {
  TUserRow,
  TCreateUserInput,
  TListUsersQuery,
  TUpdateUserInput,
} from "./validation";

export const usersModel = (app: FastifyInstance) => ({
  findAll: async (
    params: TListUsersQuery
  ): Promise<{ rows: TUserRow[]; total: number }> => {
    const { q, page, pageSize, sort, order } = params;
    const offset = (page - 1) * pageSize;

    const sortCol = sort === "name" ? "name" : "created_at";
    const orderDir = order === "ASC" ? "ASC" : "DESC";

    const countSql = `
      SELECT COUNT(*)::int AS count
      FROM users
      WHERE ($1::text IS NULL OR name ILIKE '%'||$1||'%' OR email ILIKE '%'||$1||'%')
    `;
    const countRes = await app.db.query<{ count: number }>(countSql, [
      q ?? null,
    ]);
    const total = countRes.rows[0]?.count ?? 0;

    const dataSql = `
      SELECT id, name, email, role, created_at, updated_at
      FROM users
      WHERE ($1::text IS NULL OR name ILIKE '%'||$1||'%' OR email ILIKE '%'||$1||'%')
      ORDER BY ${sortCol} ${orderDir}
      LIMIT $2 OFFSET $3
    `;
    const dataRes = await app.db.query<TUserRow>(dataSql, [
      q ?? null,
      pageSize,
      offset,
    ]);

    return { rows: dataRes.rows, total };
  },

  create: (data: TCreateUserInput) => {
    return app.db.one<TUserRow>(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, password`,
      [data.name, data.email, data.password]
    );
  },

  findById: (id: string) => {
    return app.db.one<TUserRow>(`SELECT * FROM users WHERE id = $1`, [id]);
  },

  findUserByEmail: async (email: string): Promise<TUserRow | null> => {
    const user = await app.pg.query<TUserRow>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (!user.rows.length) {
      return null;
    }

    return user.rows[0];
  },

  update: async (id: string, data: Partial<TUpdateUserInput>) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.name) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.email) {
      fields.push(`email = $${idx++}`);
      values.push(data.email);
    }
    if (data.password) {
      fields.push(`password = $${idx++}`);
      values.push(data.password);
    }

    values.push(id);

    const sql = `
      UPDATE users 
      SET ${fields.join(", ")} 
      WHERE id = $${idx}
      RETURNING id, name, email, password
    `;

    return app.db.one<TUserRow>(sql, values);
  },

  delete: (id: string) => {
    return app.db.query(`DELETE FROM users WHERE id = $1`, [id]);
  },
});
