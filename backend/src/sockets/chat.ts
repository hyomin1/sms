import { Server, Socket } from "socket.io";
import Chat from "../models/Chat";
import mongoose from "mongoose";

export const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("user connected");

    socket.on("disconnect", () => {
      console.log("client disconnect");
    });

    socket.on("joinRoom", async (groupId, userId) => {
      let chat = await Chat.findOne({ studyGroupId: groupId });
      // 채팅 방 없는 경우
      if (!chat) {
        chat = new Chat({
          studyGroupId: groupId,
          messages: [],
          lastActivity: new Date(),
        });
        if (userId) {
          chat.members.push(userId);
        }
      } else {
        if (userId && !chat.members.includes(userId)) {
          chat.members.push(userId);
        }
        chat.lastActivity = new Date();
      }
      await chat.save();

      socket.emit("chatHistory", chat.messages);
    });

    socket.on("new_message", async (msg, groupId, userId) => {
      const message = {
        sender: userId,
        content: msg,
        createdAt: new Date(),
      };
      const chat = await Chat.findOne({ studyGroupId: groupId });
      if (chat) {
        chat.messages.push(message);
        await chat.save();
        socket.emit("chatHistory", chat.messages);
      }
    });
  });
};
