// src/jobs/cleanup-refresh-tokens.ts

import type { FastifyInstance } from "fastify";
import cron from "node-cron";

const RETENTION_DAYS = Number(process.env.REFRESH_CLEANUP_RETENTION_DAYS ?? 30);
const BATCH_SIZE = Number(process.env.REFRESH_CLEANUP_BATCH_SIZE ?? 1000);
const MAX_SECONDS = Number(process.env.REFRESH_CLEANUP_MAX_SECONDS ?? 30);
const LOCK_KEY_1 = 4242,
  LOCK_KEY_2 = 777;

// fungsi one-shot (return jumlah row terhapus)
export async function runRefreshCleanupOnce(
  app: FastifyInstance,
  opts?: { retentionDays?: number; batchSize?: number; maxSeconds?: number }
) {
  const retentionDays = opts?.retentionDays ?? RETENTION_DAYS;
  const batchSize = opts?.batchSize ?? BATCH_SIZE;
  const maxSeconds = opts?.maxSeconds ?? MAX_SECONDS;

  const client = await app.pg.connect();
  const started = Date.now();
  let totalDeleted = 0;

  try {
    const { rows } = await client.query(
      "SELECT pg_try_advisory_lock($1, $2) AS locked",
      [LOCK_KEY_1, LOCK_KEY_2]
    );
    if (!rows[0]?.locked) {
      app.log.info("[cleanup] skipped (another instance is running)");
      return 0;
    }

    while ((Date.now() - started) / 1000 < maxSeconds) {
      // opsional: kecilkan timeout per batch agar tidak ketahan lock
      await client.query("BEGIN");
      await client.query(
        `SET LOCAL lock_timeout = '2s'; SET LOCAL statement_timeout = '25s';`
      );

      const { rowCount } = await client.query(
        `
        WITH del AS (
          SELECT id
          FROM refresh_tokens
          WHERE (revoked_at IS NOT NULL OR expires_at < now())
            AND created_at < now() - make_interval(days => $2)
          ORDER BY created_at ASC, id ASC
          LIMIT $1
          -- OPTIONAL kalau sering ada row-level lock:
          -- FOR UPDATE SKIP LOCKED
        )
        DELETE FROM refresh_tokens rt
        USING del
        WHERE rt.id = del.id
        RETURNING rt.id
        `,
        [batchSize, retentionDays]
      );

      await client.query("COMMIT");

      totalDeleted += rowCount ?? 0;
      if (!rowCount) break;
    }

    app.log.info({ totalDeleted, retentionDays }, "[cleanup] done");
    return totalDeleted;
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock($1, $2)", [
        LOCK_KEY_1,
        LOCK_KEY_2,
      ]);
    } catch {}
    client.release();
  }
}

// scheduler (jalan tiap 03:00 WIB)
export function registerRefreshCleanup(app: FastifyInstance) {
  const task = cron.schedule("0 4 * * *", () => runRefreshCleanupOnce(app), {
    timezone: "Asia/Jakarta",
  });
  app.addHook("onReady", async () => task.start());
  app.addHook("onClose", async () => task.stop());
}
