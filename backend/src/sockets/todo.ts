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
      const todo = await findToDoById(groupId);
      if (!todo) {
        socket.emit("error", "not found todo");
      }
      socket.emit("notificationHistory", todo?.notifications);
    });

    socket.on("newNotification", async (groupId, content) => {
      const todo = await findToDoById(groupId);
      if (!todo) {
        return socket.emit("error", "not found todo");
      }

      todo.notifications.push({
        content,
        createdAt: new Date(),
      });

      await todo.save();
      io.to(groupId).emit("newNotification", {
        content,
        createdAt: new Date(),
      });
    });

    socket.on("deleteNotification", async (groupId, index) => {
      try {
        const todo = await findToDoById(groupId);
        if (!todo) {
          return socket.emit("error", "not found todo");
        }
        todo.notifications.splice(index, 1);
        await todo.save();
        io.to(groupId).emit("updateNotification", todo.notifications);
      } catch (error) {
        socket.emit("error", error);
      }
    });
  });
};
