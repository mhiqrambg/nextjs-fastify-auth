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
  pgm.addColumns("refresh_tokens", {
    token_hint: { type: "text", notNull: true },
  });

  pgm.addConstraint("refresh_tokens", "refresh_tokens_token_hint_unique", {
    unique: ["token_hint"],
  });
};

/**a
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const down = (pgm) => {
  pgm.dropConstraint("refresh_tokens", "refresh_tokens_token_hint_unique");
  pgm.dropColumn("refresh_tokens", "token_hint");
};
