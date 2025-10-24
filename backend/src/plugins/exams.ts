import fp from "fastify-plugin";
import { examsModel } from "../modules/exams/model";
import { examsService } from "../modules/exams/service";

export default fp(async (app) => {
  const repo = examsModel(app);
  const svc = examsService(repo);
  app.decorate("examsService", svc);
});

declare module "fastify" {
  interface FastifyInstance {
    examsService: ReturnType<typeof examsService>;
  }
}
