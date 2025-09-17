import fp from "fastify-plugin";
import { authModel, refreshModel } from "../modules/auth/model";
import { authService, refreshService } from "../modules/auth/service";

export default fp(async (app) => {
  const authRepo = authModel(app);
  const refreshRepo = refreshModel(app);

  const authSvc = authService(authRepo);
  const refreshSvc = refreshService(refreshRepo);

  app.decorate("authService", authSvc);
  app.decorate("refreshService", refreshSvc);
});

declare module "fastify" {
  interface FastifyInstance {
    authService: ReturnType<typeof authService>;
    refreshService: ReturnType<typeof refreshService>;
  }
}
