import type { FastifyInstance } from "fastify";
import type {
  TClassroomRow,
  TCreateClassroomInput,
  TUpdateClassroomInput,
  TListClassroomsQuery,
  TClassroomMemberRow,
  TAddMemberInput,
} from "./validation";
import { TExamRow } from "../exams/validation";

export const classroomsModel = (app: FastifyInstance) => ({
  // All CLASSROOMS
  findAll: async (
    params: TListClassroomsQuery,
    userId?: string
  ): Promise<{ rows: TClassroomRow[]; total: number }> => {
    const { q, page, pageSize, sort, order } = params;
    const offset = (page - 1) * pageSize;

    const sortCol = sort === "name" ? "name" : "created_at";
    const orderDir = order === "ASC" ? "ASC" : "DESC";

    let whereClauses: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (userId) {
      whereClauses.push(
        `(user_id = $${paramIndex} OR id IN (SELECT classroom_id FROM classroom_members WHERE user_id = $${paramIndex}))`
      );
      queryParams.push(userId);
      paramIndex++;
    }

    if (q) {
      whereClauses.push(
        `(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR code ILIKE $${paramIndex})`
      );
      queryParams.push(`%${q}%`);
      paramIndex++;
    }

    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*)::int AS count
      FROM classrooms
      ${whereClause}
    `;
    const countRes = await app.db.query<{ count: number }>(
      countSql,
      queryParams
    );
    const total = countRes.rows[0]?.count ?? 0;

    const dataSql = `
    SELECT id, user_id, name, description, code, image_url, created_at, updated_at
    FROM classrooms
    ${whereClause}
    ORDER BY ${sortCol} ${orderDir}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

    const dataRes = await app.db.query<TClassroomRow>(dataSql, [
      ...queryParams,
      pageSize,
      offset,
    ]);

    return { rows: dataRes.rows, total };
  },

  findById: async (id: string) => {
    const res = await app.db.one<TClassroomRow>(
      `SELECT 
       c.id, c.user_id, c.name, c.description, c.code, c.image_url, c.created_at, c.updated_at,
       u.id AS teacher_id, u.name AS teacher_name, u.email AS teacher_email, u.image_url AS teacher_image_url
       
       FROM classrooms c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1
       `,
      [id]
    );

    return res;
  },

  //   findByIdWithMembersRaw: async (classroomId: string): Promise<TRawClassroomMemberData[]> => {
  //     const dataSql = `
  //         SELECT
  //             c.id AS classroom_id, c.name AS classroom_name,
  //             u.id AS member_id, u.name AS member_name, u.role AS member_role,
  //             cm.total AS member_total_score
  //         FROM
  //             Classroom c
  //         -- JOIN untuk mendapatkan Anggota Kelas
  //         JOIN
  //             Classroom_members cm ON c.id = cm.classroom_id
  //         -- JOIN untuk mendapatkan detail User Anggota
  //         JOIN
  //             Users u ON cm.user_id = u.id
  //         WHERE
  //             c.id = $1
  //     `;

  //     // Menggunakan .query atau .many() karena hasilnya pasti array
  //     const res = await app.db.query<TRawClassroomMemberData>(dataSql, [classroomId]);

  //     return res.rows; // Mengembalikan array baris
  // },

  findByCode: (code: string) => {
    return app.db.one<TClassroomRow>(
      `SELECT id, user_id, name, description, code, image_url, created_at, updated_at
       FROM classrooms WHERE code = $1`,
      [code]
    );
  },

  create: async (data: TCreateClassroomInput, userId: string) => {
    return app.db.one<TClassroomRow>(
      `INSERT INTO classrooms (user_id, name, description, code, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, name, description, code, image_url, created_at, updated_at`,
      [userId, data.name, data.description, data.code, data.image_url]
    );
  },

  update: async (id: string, data: Partial<TUpdateClassroomInput>) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(data.image_url);
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const sql = `
      UPDATE classrooms 
      SET ${fields.join(", ")} 
      WHERE id = $${idx}
      RETURNING id, user_id, name, description, code, image_url, created_at, updated_at
    `;

    return app.db.one<TClassroomRow>(sql, values);
  },

  delete: (id: string) => {
    return app.db.query(`DELETE FROM classrooms WHERE id = $1`, [id]);
  },

  // MEMBERS
  findMembers: async (classroomId: string): Promise<TClassroomMemberRow[]> => {
    const sql = `
      SELECT 
        cm.user_id, 
        cm.classroom_id, 
        u.id AS member_id, 
        u.name AS member_name, 
        u.email AS member_email, 
        u.image_url AS member_image_url
      FROM 
        classroom_members cm  -- Memberi alias cm
      JOIN 
        users u ON cm.user_id = u.id
      WHERE 
        cm.classroom_id = $1
    `;
    const res = await app.db.query<TClassroomMemberRow>(sql, [classroomId]);
    return res.rows;
  },

  findMemberByUserAndClassroom: (classroomId: string, userId: string) => {
    return app.db.one<TClassroomMemberRow>(
      `SELECT user_id, classroom_id
       FROM classroom_members 
       WHERE classroom_id = $1 AND user_id = $2`,
      [classroomId, userId]
    );
  },

  addMember: (data: TAddMemberInput) => {
    return app.db.one<TClassroomMemberRow>(
      `INSERT INTO classroom_members (classroom_id, user_id)
       VALUES ($1, $2)
       RETURNING user_id, classroom_id`,
      [data.classroom_id, data.user_id]
    );
  },

  removeMember: (classroomId: string, userId: string) => {
    return app.db.query(
      `DELETE FROM classroom_members WHERE classroom_id = $1 AND user_id = $2`,
      [classroomId, userId]
    );
  },

  getMemberCount: async (classroomId: string): Promise<number> => {
    const sql = `
      SELECT COUNT(*)::int AS count
      FROM classroom_members
      WHERE classroom_id = $1
    `;
    const res = await app.db.query<{ count: number }>(sql, [classroomId]);
    return res.rows[0]?.count ?? 0;
  },

  // CLASSROOM EXAMS
  findExamsByClassroomId: async (classroomId: string) => {
    const sql = `
      SELECT * FROM exams WHERE classroom_id = $1 AND is_active = true
    `;
    const res = await app.db.many<TExamRow>(sql, [classroomId]);
    return res;
  },
});
