/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export const up = (pgm) => {
  // percepat cleanup revoked + retention by created_at
  pgm.createIndex("refresh_tokens", "created_at", {
    name: "refresh_tokens_revoked_created_idx",
    where: "revoked_at IS NOT NULL",
    ifNotExists: true,
  });

  // percepat filter expires_at < now()
  pgm.createIndex("refresh_tokens", ["expires_at", "created_at"], {
    name: "refresh_tokens_exp_expcreated_idx",
    ifNotExists: true,
  });
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export const down = (pgm) => {
  pgm.dropIndex("refresh_tokens", null, {
    name: "refresh_tokens_revoked_created_idx",
    ifExists: true,
  });
  pgm.dropIndex("refresh_tokens", null, {
    name: "refresh_tokens_exp_expcreated_idx",
    ifExists: true,
  });
};
