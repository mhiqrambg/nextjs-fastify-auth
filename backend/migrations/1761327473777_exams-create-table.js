/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const up = (pgm) => {
  // Exams
  pgm.createTable("exams", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    classroom_id: {
      type: "uuid",
      notNull: true,
      references: "classrooms",
      onDelete: "CASCADE",
    },
    title: { type: "varchar(255)", notNull: true },
    description: { type: "text", notNull: true },
    duration_minutes: { type: "integer", notNull: true },
    passing_score: {
      type: "integer",
      notNull: true,
      default: 80,
    },
    code: { type: "varchar(255)", notNull: true, unique: true },
    is_active: { type: "boolean", notNull: true, default: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Questions
  pgm.createTable("questions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    text: { type: "text", notNull: true },
    is_active: { type: "boolean", notNull: true, default: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Exam-Questions (Pivot)
  pgm.createTable("exam_questions", {
    exam_id: {
      type: "uuid",
      references: "exams",
      onDelete: "CASCADE",
      primaryKey: true,
      notNull: true,
    },
    question_id: {
      type: "uuid",
      references: "questions",
      onDelete: "CASCADE",
      primaryKey: true,
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Options
  pgm.createTable("options", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    question_id: {
      type: "uuid",
      references: "questions",
      onDelete: "CASCADE",
      notNull: true,
    },
    text: { type: "text", notNull: true },
    is_correct: { type: "boolean", notNull: true, default: false },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  //Leaderboard
  pgm.createTable("users_exams", {
    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "CASCADE",
      notNull: true,
    },
    exam_id: {
      type: "uuid",
      references: "exams",
      onDelete: "CASCADE",
      notNull: true,
    },
    score: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    submit_time: {
      type: "timestamptz",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Indexes
  pgm.createIndex("exam_questions", "exam_id");
  pgm.createIndex("exam_questions", "question_id");
  pgm.createIndex("options", "question_id");
  pgm.createIndex("exams", "classroom_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const down = (pgm) => {
  pgm.dropTable("users_exams", { ifExists: true });
  pgm.dropTable("options", { ifExists: true });
  pgm.dropTable("exam_questions", { ifExists: true });
  pgm.dropTable("questions", { ifExists: true });
  pgm.dropTable("exams", { ifExists: true });
  pgm.dropIndex("exams", "classroom_id", { ifExists: true });
};
