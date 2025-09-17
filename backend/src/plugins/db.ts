import fp from "fastify-plugin";
import fastifyPostgres, { type PostgresDb } from "@fastify/postgres";
import type { PoolClient, QueryResult, QueryResultRow } from "pg";

export default fp(async (app) => {
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    app.log.error("DATABASE_URL is not set");
    throw new Error("DATABASE_URL is required");
  }

  await app.register(fastifyPostgres, {
    connectionString: conn,
    ssl:
      process.env.PGSSLMODE === "require"
        ? { rejectUnauthorized: false }
        : undefined,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

  // Set schema default agar bisa query tanpa prefix "app."
  app.pg.pool.on("connect", (client) => {
    client.query(`SET search_path TO app, public`);
  });

  // 🎯 Helper query sederhana
  const dbHelpers = {
    // SELECT/INSERT/UPDATE/DELETE umum
    query<T extends QueryResultRow = any>(
      text: string,
      params?: any[]
    ): Promise<QueryResult<T>> {
      return app.pg.query<T>(text, params);
    },

    // Ambil satu baris (atau null)
    async one<T extends QueryResultRow = any>(
      text: string,
      params?: any[]
    ): Promise<T | null> {
      const { rows } = await app.pg.query<T>(text, params);
      return rows[0] ?? null;
    },

    // Transaksi
    tx<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
      return app.pg.transact(fn);
    },

    // Pakai 1 client (tanpa transaksi) untuk beberapa query beruntun
    async withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
      const client = await app.pg.connect();
      try {
        return await fn(client);
      } finally {
        client.release();
      }
    },
  };

  app.decorate("db", dbHelpers);

  app.log.info("Success connect to database");
});

// 🔐 Augment type Fastify
declare module "fastify" {
  interface FastifyInstance {
    pg: PostgresDb & Record<string, PostgresDb>;
    db: {
      query<T extends QueryResultRow = any>(
        text: string,
        params?: any[]
      ): Promise<QueryResult<T>>;
      one<T extends QueryResultRow = any>(
        text: string,
        params?: any[]
      ): Promise<T | null>;
      tx<T>(fn: (client: import("pg").PoolClient) => Promise<T>): Promise<T>;
      withClient<T>(
        fn: (client: import("pg").PoolClient) => Promise<T>
      ): Promise<T>;
    };
  }
}
