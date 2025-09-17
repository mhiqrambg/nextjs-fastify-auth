// src/routes/ops.ts
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { runRefreshCleanupOnce } from "../../jobs/cleanup-refresh-tokens";

export default async function opsRoutes(app: FastifyInstance) {
  if (process.env.NODE_ENV !== "development") return;

  app.post(
    "/_ops/cleanup-refresh",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const deleted = await runRefreshCleanupOnce(app, {
        retentionDays: Number((req.query as { days?: string })["days"] ?? 30),
        batchSize: Number((req.query as { batch?: string })["batch"] ?? 1000),
        maxSeconds: Number((req.query as { max?: string })["max"] ?? 30),
      });
      return reply.send({ deleted });
    }
  );

  app.get("/_ops/db-time", async () => {
    const { rows } = await app.pg.query(`
      SELECT
        current_setting('TimeZone') AS timezone,
        now() AS now_tx,
        statement_timestamp() AS stmt_ts,
        clock_timestamp() AS wallclock,
        to_char(now() AT TIME ZONE 'Asia/Jakarta',
          'YYYY-MM-DD"T"HH24:MI:SS.MS') AS wib_text
    `);
    return rows[0];
  });
}
