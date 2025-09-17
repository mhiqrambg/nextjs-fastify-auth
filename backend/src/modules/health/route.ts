import type { FastifyPluginAsync } from "fastify";

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get("/", {
    schema: {
      tags: ["Health"],
      response: {
        200: { type: "object", properties: { status: { type: "string" } } },
      },
    },
    handler: async () => ({ status: "ok" }),
  });
};

export default healthRoute;
