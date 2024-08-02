import { Server } from "socket.io";
import {
  AuthenticatedSocket,
  authenticateSocket,
} from "../middleware/authSocket";
import StudyGroup from "../models/StudyGroup";
import User from "../models/User";
import Chat from "../models/Chat";
import { findToDoById } from "../api/api";

export const todoSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log("user todo connected");

    socket.on("disconnect", () => {});

    socket.on("notificationHistory", async (groupId) => {
      const chat = await findToDoById(groupId);
      socket.emit("notification");
    });

    socket.on("notification", async (content) => {
      console.log(content);
    });
  });
};
