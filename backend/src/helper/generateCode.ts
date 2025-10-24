import { FastifyInstance } from "fastify/types/instance";

export const generateCode = async (
  app: FastifyInstance,
  type: "classrooms" | "exams"
): Promise<string> => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 8;

  const tableName = type === "classrooms" ? "classrooms" : "exams";
  const field = type === "classrooms" ? "ROOM" : "EXAM";

  while (true) {
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existing = await app.db.one<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM ${tableName} WHERE code = $1) as exists`,
      [code]
    );

    if (!existing?.exists) {
      return `${field + code}`;
    }
  }
};
