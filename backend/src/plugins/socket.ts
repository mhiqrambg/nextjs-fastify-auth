import fp from "fastify-plugin";
import { Server } from "socket.io";
import { FastifyInstance } from "fastify";

export default fp(async (app: FastifyInstance) => {
  const io = new Server(app.server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  app.decorate("io", io);
});

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}
