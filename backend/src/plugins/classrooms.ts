import fp from "fastify-plugin";
import { classroomsModel } from "../modules/classrooms/model";
import { classroomsService } from "../modules/classrooms/service";

export default fp(async (app) => {
  const repo = classroomsModel(app);
  const svc = classroomsService(repo);
  app.decorate("classroomsService", svc);
});

declare module "fastify" {
  interface FastifyInstance {
    classroomsService: ReturnType<typeof classroomsService>;
  }
}
