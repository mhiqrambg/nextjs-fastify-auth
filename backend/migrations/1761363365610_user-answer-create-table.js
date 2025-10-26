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
  pgm.createType(
    "status",
    ["in_progress", "completed", "abandoned", "timed_out"],
    { ifNotExists: true }
  );

  pgm.alterColumn("users_exams", "submit_time", {
    notNull: false,
  });

  pgm.addColumn("users_exams", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    status: {
      type: "status",
      notNull: true,
      default: "in_progress",
    },
  });

  pgm.createTable("user_answers", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    user_exam_id: {
      type: "uuid",
      notNull: true,
      references: "users_exams",
      onDelete: "CASCADE",
    },
    question_id: {
      type: "uuid",
      notNull: true,
      references: "questions",
      onDelete: "CASCADE",
    },
    option_id: {
      type: "uuid",
      notNull: true,
      references: "options",
      onDelete: "CASCADE",
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

  pgm.createIndex("user_answers", "user_exam_id");
  pgm.createIndex("user_answers", "question_id");
  pgm.createIndex("user_answers", "option_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const down = (pgm) => {
  pgm.dropTable("user_answers", { ifExists: true });
  pgm.dropColumn("users_exams", "id", { ifExists: true });
  pgm.dropColumn("users_exams", "status", { ifExists: true });
  pgm.dropIndex("user_answers", "question_id", { ifExists: true });
  pgm.dropIndex("user_answers", "option_id", { ifExists: true });
  pgm.dropType("status", { ifExists: true });
  pgm.alterColumn("users_exams", "submit_time", {
    notNull: true,
  });
};
