import { buildApp } from "./app";

const app = buildApp({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { translateTime: "HH:MM:ss", singleLine: true },
    },
    level: "info",
  },
  disableRequestLogging: true,
});

app.listen({ port: 3000, host: "127.0.0.1" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
