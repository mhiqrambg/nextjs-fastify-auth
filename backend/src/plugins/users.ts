import fp from "fastify-plugin";
import { usersModel } from "../modules/users/model";
import { usersService } from "../modules/users/service";

export default fp(async (app) => {
  const repo = usersModel(app);
  const svc = usersService(repo);
  app.decorate("usersService", svc);
});

declare module "fastify" {
  interface FastifyInstance {
    usersService: ReturnType<typeof usersService>;
  }
}
