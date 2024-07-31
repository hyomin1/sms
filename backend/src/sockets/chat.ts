import { Server } from "socket.io";
import Chat from "../models/Chat";
import mongoose from "mongoose";
import User from "../models/User";
import {
  AuthenticatedSocket,
  authenticateSocket,
} from "../middleware/authSocket";
import StudyGroup from "../models/StudyGroup";

const defaultImg =
  "https://image-sms.s3.ap-northeast-2.amazonaws.com/defaultProfileImg.png";

export const chatSocket = (io: Server) => {
  io.use(authenticateSocket);
  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log("user connected");

    socket.on("disconnect", () => {
      console.log("client disconnect", socket.id);
    });

    socket.on("joinRoom", async (groupId) => {
      if (!socket.user) {
        return socket.emit("error", "Authentication required");
      }
      try {
        const userId = new mongoose.Types.ObjectId(socket.user.id);
        const chat = await Chat.findOne({ studyGroupId: groupId });
        const group = await StudyGroup.findOne({ _id: groupId });
        // 채팅 방 없는 경우
        if (!chat) {
          return socket.emit("error", "not found chat");
        }
        const isGroup = group?.members.includes(userId);
        if (!isGroup) {
          return socket.emit("error", "not group members");
        }
        const isMember = chat.members.includes(userId);
        if (!isMember) {
          chat.members.push(userId);
          const user = await User.findById(userId);
          const message = {
            senderName: "notification",
            profile: "notification",
            content: `${user?.username}님이 입장하였습니다.`,
            createdAt: new Date(),
            userId: socket.user.id,
          };
          chat.messages.push(message);

          io.to(groupId).emit("welcome", message);
        }
        chat.lastActivity = new Date();

        await chat.save();

        socket.emit("chatHistory", chat.messages, socket.user.id);
        socket.join(groupId);
      } catch (error) {
        console.error("Error in joinRoom", error);
        socket.emit("error", "Failed to joinRoom");
      }
    });

    socket.on("new_message", async (msg, groupId) => {
      if (!socket.user) {
        return socket.emit("error", "Authentication required");
      }
      const userId = new mongoose.Types.ObjectId(socket.user.id);
      const user = await User.findOne({ _id: userId });
      if (user) {
        const message = {
          senderName: user.username,
          profile: user.profileImg || defaultImg,
          content: msg,
          createdAt: new Date(),
          userId: socket.user.id,
        };
        const chat = await Chat.findOne({ studyGroupId: groupId });
        if (chat) {
          chat.messages.push(message);
          await chat.save();
          io.to(groupId).emit("new_message", message);
        }
      }
    });
  });
};
