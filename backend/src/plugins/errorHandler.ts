import fp from "fastify-plugin";
import { ZodError } from "zod";

export default fp(async (app) => {
  app.setErrorHandler((error, request, reply) => {
    // Munculkan error di terminal / server
    request.log.error(
      { err: error, url: request.url, id: request.id },
      "request error"
    );

    // Konfigurasi tampilan error ke klien
    const isProd = process.env.NODE_ENV === "production";
    const isDebug = request.headers["x-debug"] === "1"; // bisa diaktifkan saat perlu

    if (error instanceof ZodError) {
      const details = error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return reply.code(400).send({
        success: false,
        statusCode: 400,
        message: "Validation failed",
        details,
      });
    }

    if ((error as any).code === "FST_ERR_VALIDATION") {
      const details = (error as any).validation?.map((v: any) => ({
        path:
          (v.instancePath || "").replace(/^\//, "") ||
          v.params?.missingProperty ||
          "",
        message: v.message,
      })) ?? [{ message: error.message }];
      return reply.code(400).send({
        success: false,
        statusCode: 400,
        message: "Validation failed",
        details,
      });
    }

    // Fastify-JWT header kosong
    if ((error as any).code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER") {
      return reply.code(401).send({
        success: false,
        statusCode: 401,
        message: "Authorization header is missing",
      });
    }

    // JSONWebTokenError
    if ((error as any).name === "JsonWebTokenError") {
      return reply.code(401).send({
        success: false,
        statusCode: 401,
        message: "Invalid token",
      });
    }

    // httpErrors.* dari @fastify/sensible, atau error umum
    const status = (error as any).statusCode ?? 500;
    const isServerErr = status >= 500;

    // Di production, sembunyikan detail server error
    const message =
      isProd && isServerErr
        ? "Internal Server Error"
        : error.message || "Internal Server Error";

    const payload: Record<string, any> = {
      success: false,
      statusCode: status,
      message,
    };

    // Sertakan code untuk client-side handling (kecuali 5xx)
    if ((error as any).code && !isServerErr) {
      payload.code = (error as any).code;
    }

    // Opsional: hanya jika butuh debug manual
    if (!isProd && isDebug && (error as any).stack) {
      payload.stack = (error as any).stack;
    }

    reply.code(status).send(payload);
  });

  // 404 konsisten
  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({
      success: false,
      statusCode: 404,
      message: "Route not found",
      path: req.url,
    });
  });
});
