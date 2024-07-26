import { Server, Socket } from "socket.io";
import Chat from "../models/Chat";
import mongoose from "mongoose";
import User from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
  };
}
const defaultImg =
  "https://image-sms.s3.ap-northeast-2.amazonaws.com/defaultProfileImg.png";

export const chatSocket = (io: Server) => {
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error : Token missing"));
    }

    jwt.verify(token, JWT_SECRET_KEY, (err: any, user: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new Error("Authentication error : Token expired"));
        }
        return next(new Error("Authentication error: Invalid token"));
      }
      socket.user = user;
      next();
    });
  });
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
            const user = await User.findById(userId);
            io.to(groupId).emit("welcome", user?.username);
          }
          chat.lastActivity = new Date();
        }
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
      console.log(user?.profileImg);
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
          io.to(groupId).emit("new_message", chat.messages);
        }
      }
    });
  });
};
