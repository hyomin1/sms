import { Server } from "socket.io";
import {
  AuthenticatedSocket,
  authenticateSocket,
} from "../middleware/authSocket";

export const todoSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log("user todo connected");

    socket.on("disconnect", () => {});
  });
};
