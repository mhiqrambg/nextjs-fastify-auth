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
  pgm.addColumn("users", {
    phone_number: {
      type: "varchar(20)",
      notNull: false,
    },
    phone_verified_at: {
      type: "timestamptz",
      notNull: false,
    },
    email_verified_at: {
      type: "timestamptz",
      notNull: false,
    },
  });

  pgm.createIndex("users", "phone_number");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumn("users", "phone_verified_at");
  pgm.dropColumn("users", "email_verified_at");
  pgm.dropColumn("users", "phone_number");
};
