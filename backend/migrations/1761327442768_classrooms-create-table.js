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
  pgm.createTable("classrooms", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "CASCADE",
      notNull: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    code: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    image_url: {
      type: "varchar(255)",
    },
    is_active: {
      type: "boolean",
      default: true,
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

  pgm.createTable("classroom_members", {
    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "CASCADE",
      primaryKey: true,
      notNull: true,
    },
    classroom_id: {
      type: "uuid",
      references: "classrooms",
      onDelete: "CASCADE",
      primaryKey: true,
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("classroom_members");
  pgm.dropTable("classrooms");
};
