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
  pgm.dropColumn("user_answers", "id", { ifExists: true });
  pgm.addConstraint("user_answers", "user_answers_user_exam_fk", {
    foreignKeys: {
      columns: "user_exam_id",
      references: "users_exams",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("user_answers", "user_answers_question_fk", {
    foreignKeys: {
      columns: "question_id",
      references: "questions",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("user_answers", "user_answers_pk", {
    primaryKey: ["user_exam_id", "question_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const down = (pgm) => {
  pgm.dropConstraint("user_answers", "user_answers_user_exam_fk", {
    ifExists: true,
  });
  pgm.dropConstraint("user_answers", "user_answers_question_fk", {
    ifExists: true,
  });

  pgm.dropConstraint("user_answers", "user_answers_pk", { ifExists: true });

  pgm.addColumn("user_answers", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
      notNull: true,
    },
  });
};
