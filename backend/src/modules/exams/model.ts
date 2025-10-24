import type { FastifyInstance } from "fastify";
import type {
  TExamRow,
  TCreateExamInput,
  TUpdateExamInput,
  TListExamsQuery,
  TQuestionRow,
  TCreateQuestionInput,
  TUpdateQuestionInput,
  TOptionRow,
  TCreateOptionInput,
  TUpdateOptionInput,
  TLinkQuestionInput,
  TLeaderboardQuery,
} from "./validation";

export const examsModel = (app: FastifyInstance) => ({
  // ==========================
  // EXAMS
  // ==========================
  findAll: async (
    params: TListExamsQuery
  ): Promise<{ rows: TExamRow[]; total: number }> => {
    const { q, page, pageSize, sort, order } = params;
    const offset = (page - 1) * pageSize;

    const sortCol = sort === "title" ? "title" : "created_at";
    const orderDir = order === "ASC" ? "ASC" : "DESC";

    let whereClauses: string[] = ["is_active = true"];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (q) {
      whereClauses.push(
        `(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
      );
      queryParams.push(`%${q}%`);
      paramIndex++;
    }

    const whereClause = whereClauses.join(" AND ");

    const countSql = `
      SELECT COUNT(*)::int AS count
      FROM exams
      WHERE ${whereClause}
    `;
    const countRes = await app.db.query<{ count: number }>(
      countSql,
      queryParams
    );
    const total = countRes.rows[0]?.count ?? 0;

    const dataSql = `
      SELECT id, user_id, classroom_id, title, description, duration_minutes, passing_score, code, is_active, created_at, updated_at
      FROM exams
      WHERE ${whereClause}
      ORDER BY ${sortCol} ${orderDir}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataRes = await app.db.query<TExamRow>(dataSql, [
      ...queryParams,
      pageSize,
      offset,
    ]);

    return { rows: dataRes.rows, total };
  },

  findById: (id: string) => {
    return app.db.one<TExamRow>(
      `SELECT id, user_id, classroom_id, title, description, duration_minutes, passing_score, code, is_active, created_at, updated_at
       FROM exams WHERE id = $1`,
      [id]
    );
  },

  findByCode: (code: string) => {
    return app.db.one<TExamRow>(
      `SELECT id, user_id, classroom_id, title, description, duration_minutes, passing_score, code, is_active, created_at, updated_at
       FROM exams WHERE code = $1`,
      [code]
    );
  },

  create: async (data: TCreateExamInput & { code: string }, userId: string) => {
    return app.db.one<TExamRow>(
      `INSERT INTO exams (user_id, classroom_id, title, description, passing_score, duration_minutes, code)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, classroom_id, title, description, passing_score, duration_minutes, code, created_at, updated_at`,
      [
        userId,
        data.classroom_id,
        data.title,
        data.description,
        data.passing_score,
        data.duration_minutes,
        data.code,
      ]
    );
  },

  update: async (id: string, data: Partial<TUpdateExamInput>) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description);
    }
    if (data.classroom_id !== undefined) {
      fields.push(`classroom_id = $${idx++}`);
      values.push(data.classroom_id);
    }
    if (data.duration_minutes !== undefined) {
      fields.push(`duration_minutes = $${idx++}`);
      values.push(data.duration_minutes);
    }
    if (data.passing_score !== undefined) {
      fields.push(`passing_score = $${idx++}`);
      values.push(data.passing_score);
    }
    if (data.is_active !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(data.is_active);
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const sql = `
      UPDATE exams 
      SET ${fields.join(", ")} 
      WHERE id = $${idx}
      RETURNING id, user_id, classroom_id, title, description, duration_minutes, passing_score, code, is_active, created_at, updated_at
    `;

    return app.db.one<TExamRow>(sql, values);
  },

  delete: (id: string) => {
    return app.db.query(`DELETE FROM exams WHERE id = $1`, [id]);
  },

  // ==========================
  // QUESTIONS
  // ==========================
  findQuestionById: (id: string) => {
    return app.db.one<TQuestionRow>(
      `SELECT id, text, is_active, created_at, updated_at
       FROM questions WHERE id = $1`,
      [id]
    );
  },

  findQuestionsByExamId: async (examId: string): Promise<TQuestionRow[]> => {
    const sql = `
      SELECT q.id, q.text, q.is_active, q.created_at, q.updated_at
      FROM questions q
      INNER JOIN exam_questions eq ON q.id = eq.question_id
      WHERE eq.exam_id = $1 AND q.is_active = true
      ORDER BY q.created_at ASC
    `;
    const res = await app.db.query<TQuestionRow>(sql, [examId]);
    return res.rows;
  },

  createQuestion: (data: TCreateQuestionInput) => {
    return app.db.one<TQuestionRow>(
      `INSERT INTO questions (text, is_active)
       VALUES ($1, $2)
       RETURNING id, text, is_active, created_at, updated_at`,
      [data.text, data.is_active]
    );
  },

  updateQuestion: async (id: string, data: Partial<TUpdateQuestionInput>) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.text !== undefined) {
      fields.push(`text = $${idx++}`);
      values.push(data.text);
    }
    if (data.is_active !== undefined) {
      fields.push(`is_active = $${idx++}`);
      values.push(data.is_active);
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const sql = `
      UPDATE questions 
      SET ${fields.join(", ")} 
      WHERE id = $${idx}
      RETURNING id, text, is_active, created_at, updated_at
    `;

    return app.db.one<TQuestionRow>(sql, values);
  },

  deleteQuestion: (id: string) => {
    return app.db.query(`DELETE FROM questions WHERE id = $1`, [id]);
  },

  // ==========================
  // OPTIONS
  // ==========================
  findOptionsByQuestionId: async (
    questionId: string
  ): Promise<TOptionRow[]> => {
    const sql = `
      SELECT id, question_id, text, is_correct, created_at, updated_at
      FROM options
      WHERE question_id = $1
      ORDER BY created_at ASC
    `;
    const res = await app.db.query<TOptionRow>(sql, [questionId]);
    return res.rows;
  },

  findOptionById: (id: string) => {
    return app.db.one<TOptionRow>(
      `SELECT id, question_id, text, is_correct, created_at, updated_at
       FROM options WHERE id = $1`,
      [id]
    );
  },

  createOption: (data: TCreateOptionInput) => {
    return app.db.one<TOptionRow>(
      `INSERT INTO options (question_id, text, is_correct)
       VALUES ($1, $2, $3)
       RETURNING id, question_id, text, is_correct, created_at, updated_at`,
      [data.question_id, data.text, data.is_correct]
    );
  },

  updateOption: async (id: string, data: Partial<TUpdateOptionInput>) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.text !== undefined) {
      fields.push(`text = $${idx++}`);
      values.push(data.text);
    }
    if (data.is_correct !== undefined) {
      fields.push(`is_correct = $${idx++}`);
      values.push(data.is_correct);
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const sql = `
      UPDATE options 
      SET ${fields.join(", ")} 
      WHERE id = $${idx}
      RETURNING id, question_id, text, is_correct, created_at, updated_at
    `;

    return app.db.one<TOptionRow>(sql, values);
  },

  deleteOption: (id: string) => {
    return app.db.query(`DELETE FROM options WHERE id = $1`, [id]);
  },

  // ==========================
  // EXAM-QUESTIONS LINK
  // ==========================
  linkQuestion: (data: TLinkQuestionInput) => {
    return app.db.query(
      `INSERT INTO exam_questions (exam_id, question_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [data.exam_id, data.question_id]
    );
  },

  unlinkQuestion: (examId: string, questionId: string) => {
    return app.db.query(
      `DELETE FROM exam_questions WHERE exam_id = $1 AND question_id = $2`,
      [examId, questionId]
    );
  },

  // ==========================
  // USER EXAMS (LEADERBOARD)
  // ==========================
  submitExam: async (userId: string, examId: string, score: number) => {
    return app.db.query(
      `INSERT INTO users_exams (user_id, exam_id, score, submit_time)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id, exam_id) 
       DO UPDATE SET score = $3, submit_time = now(), updated_at = now()`,
      [userId, examId, score]
    );
  },

  getLeaderboard: async (params: TLeaderboardQuery) => {
    const sql = `
      SELECT ue.user_id, ue.exam_id, ue.score, ue.submit_time, u.name as user_name
      FROM users_exams ue
      INNER JOIN users u ON ue.user_id = u.id
      WHERE ue.exam_id = $1
      ORDER BY ue.score DESC, ue.submit_time ASC
      LIMIT $2
    `;
    const res = await app.db.query(sql, [params.exam_id, params.limit]);
    return res.rows;
  },

  getUserScore: async (userId: string, examId: string) => {
    return app.db.one(
      `SELECT user_id, exam_id, score, submit_time, updated_at
       FROM users_exams
       WHERE user_id = $1 AND exam_id = $2`,
      [userId, examId]
    );
  },
});
