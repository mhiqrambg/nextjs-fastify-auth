// migrations/1756149999999_create-otps-table.js
exports.up = (pgm) => {
  pgm.createTable("otps", {
    id: "id",
    phone_number: { type: "varchar(20)", notNull: true },
    code_hash: { type: "varchar(255)", notNull: true }, // hash OTP
    type: { type: "varchar(20)", notNull: true, default: "whatsapp" },
    expires_at: { type: "timestamptz", notNull: true },
    used_at: { type: "timestamptz" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("otps", "phone_number");
  pgm.createIndex("otps", "expires_at");
};

exports.down = (pgm) => {
  pgm.dropTable("otps");
};
