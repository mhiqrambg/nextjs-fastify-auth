import type { FastifyInstance } from "fastify";
import type { TCreateUserInput, TUserRow } from "../users/validation";
import { RefreshTokenInput, VerifyOtpInput, OTPRow } from "./validation";

export const authModel = (app: FastifyInstance) => ({
  findUserByEmail: async (email: string): Promise<TUserRow | null> => {
    const user = await app.pg.query<TUserRow>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (!user.rows.length) {
      return null;
    }

    return user.rows[0];
  },

  findUserByPhone: async (phone_number: string) => {
    const user = await app.pg.query<TUserRow>(
      `SELECT * FROM users WHERE phone_number = $1`,
      [phone_number]
    );

    if (!user.rows.length) {
      return null;
    }

    return user.rows[0];
  },

  findUserByEmailOrPhone: async (email: string, phone_number: string) => {
    const user = await app.pg.query<TUserRow>(
      `SELECT * FROM users WHERE email = $1 OR phone_number = $2 LIMIT 1`,
      [email, phone_number]
    );

    if (!user.rows.length) {
      return null;
    }

    return user.rows[0] ?? null;
  },

  // Memperbarui fungsi untuk mencari OTP yang valid dan terbaru
  findOtpByPhone: async (phone_number: string) => {
    const otpQuery = `
    SELECT * 
    FROM otps
    WHERE phone_number = $1 
      AND used_at IS NULL  -- Hanya yang belum digunakan
      AND expires_at > NOW()  -- Hanya yang belum kadaluarsa
    ORDER BY expires_at DESC  -- Urutkan berdasarkan waktu kadaluarsa (terbaru di atas)
    LIMIT 1;  -- Ambil hanya 1 OTP yang valid dan terbaru
  `;

    // Menjalankan query untuk mencari OTP
    const otp = await app.pg.query<OTPRow>(otpQuery, [phone_number]);

    // Mengembalikan OTP yang ditemukan (atau null jika tidak ada yang valid)
    return otp.rows[0] ?? null;
  },

  createUser: async (data: TCreateUserInput) => {
    const user = await app.pg.query<TUserRow>(
      `INSERT INTO users (name, password, phone_number, email) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, data.password, data.phone_number, data.email]
    );

    // remove password
    const newUser = {
      ...user.rows[0],
      password: undefined,
    };

    return newUser;
  },

  deleteUser: async (id: string) => {
    const result = await app.pg.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result.rows[0];
  },

  updateOtp: async (id: string) => {
    const { rows } = await app.pg.query(
      `UPDATE otps SET used_at = now() WHERE id = $1 RETURNING id, used_at`,
      [id]
    );
    return rows[0] ?? null;
  },

  createOtp: async (
    phone_number: string,
    codeHash: string,
    expiresAt: Date,
    type: string
  ) => {
    await app.pg.query(
      `INSERT INTO otps (phone_number, code_hash, expires_at, type) VALUES ($1, $2, $3, $4)`,
      [phone_number, codeHash, expiresAt, type]
    );
    return codeHash;
  },

  verifyOtpStatus: async (type: "whatsapp" | "email", value: string) => {
    const column =
      type === "whatsapp"
        ? "phone_verified_at"
        : type === "email"
        ? "email_verified_at"
        : null;

    if (!column) {
      throw app.httpErrors.badRequest("Invalid verification type");
    }

    const query = `
      UPDATE users
      SET ${column} = now()
      WHERE ${type === "whatsapp" ? "phone_number" : "email"} = $1
      RETURNING id, ${column}
    `;

    const { rows } = await app.pg.query(query, [value]);

    return rows[0] ?? null;
  },

  saveRefreshToken: async (userId: string, data: RefreshTokenInput) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const result = await app.pg.query(
      `INSERT INTO refresh_tokens 
         (user_id, token_hash, expires_at, user_agent, ip_address, token_hint) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, expires_at, user_agent, ip_address, token_hint`,
      [userId, data.refreshToken, expiresAt, data.ua, data.ip, data.tokenHint]
    );

    return result.rows[0];
  },

  findRefreshToken: async (tokenHint: string) => {
    const { rows } = await app.pg.query(
      `SELECT rt.id as refresh_token_id, u.id, rt.user_id, rt.token_hash, rt.expires_at, rt.revoked_at,
              u.email, u.role, u.tv
         FROM refresh_tokens rt
         JOIN users u ON u.id = rt.user_id
        WHERE rt.token_hint = $1
          AND rt.revoked_at IS NULL
          AND rt.expires_at > now()
        FOR UPDATE`,
      [tokenHint]
    );

    return rows[0] ?? null;
  },

  revokeRefreshToken: async (id: string) => {
    const { rows } = await app.pg.query(
      `UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1 RETURNING id, revoked_at`,
      [id]
    );
    return rows[0] ?? null;
  },
});

export const refreshModel = (app: FastifyInstance) => ({
  findRefreshToken: async (tokenHint: string) => {
    const { rows } = await app.pg.query(
      `SELECT rt.id as refresh_token_id, u.id, rt.user_id, rt.token_hash, rt.expires_at, rt.revoked_at,
              u.email, u.role, u.tv
         FROM refresh_tokens rt
         JOIN users u ON u.id = rt.user_id
        WHERE rt.token_hint = $1
          AND rt.revoked_at IS NULL
          AND rt.expires_at > now()
        FOR UPDATE`,
      [tokenHint]
    );

    return rows[0] ?? null;
  },
});
