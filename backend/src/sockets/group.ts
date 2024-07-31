import { Server } from "socket.io";
import {
  AuthenticatedSocket,
  authenticateSocket,
} from "../middleware/authSocket";

import StudyGroup from "../models/StudyGroup";
import User from "../models/User";
import Chat from "../models/Chat";

const findStudyGroupById = async (groupId: string) => {
  return StudyGroup.findOne({ _id: groupId });
};

const findUserById = async (userId: string) => {
  return User.findOne({ _id: userId });
};

const findChatById = async (chatId: string) => {
  return Chat.findOne({ studyGroupId: chatId });
};

export const groupSocket = (io: Server) => {
  io.use(authenticateSocket);

  io.on("connection", (socket: AuthenticatedSocket) => {
    socket.on("disconnect", () => {});

    // 사용자 그룹 탈퇴
    socket.on("quitGroup", async (groupId) => {
      try {
        const userId = socket.user?.id;
        if (!userId) {
          return socket.emit("error", "User not found");
        }
        const [group, chat, user] = await Promise.all([
          findStudyGroupById(groupId),
          findChatById(groupId),
          findUserById(userId),
        ]);
        if (!group || !chat || !user) {
          return socket.emit("error", "not found group or chat or user");
        }
        group.members = group.members.filter(
          (member) => !member.equals(userId)
        );
        chat.members = chat.members.filter((member) => !member.equals(userId));

        const message = {
          senderName: "notification",
          profile: "notification",
          content: `${user.username}님이 퇴장하였습니다.`,
          createdAt: new Date(),
          userId: userId,
        };
        chat.messages.push(message);

        await Promise.all([group.save(), chat.save()]);
        io.to(groupId).emit("success_quitGroup");
        io.to(groupId).emit("welcome", message);
      } catch (error) {
        console.error("Error in quitGroup", error);
        socket.emit("error", "Error in quitGroup");
      }
    });

    socket.on("deleteMember", async (groupId, userId) => {
      try {
        const reqId = socket.user?.id;
        const [group, chat, user] = await Promise.all([
          findStudyGroupById(groupId),
          findChatById(groupId),
          findUserById(userId),
        ]);
        if (!group || !chat || !user || !reqId) {
          return socket.emit("error", "not found group or chat or user");
        }
        if (reqId !== group.masterId.toString()) {
          return socket.emit("error", "그룹장만 추방할 수 있습니다.");
        }
        if (group.masterId.toString() === userId) {
          return socket.emit("error", "그룹장은 추방할 수 없습니다.");
        }
        const message = {
          senderName: "notification",
          profile: "notification",
          content: `${user.username}님이 퇴장하였습니다.`,
          createdAt: new Date(),
          userId: userId,
        };
        io.to(groupId).emit("success_quitGroup");
        io.to(groupId).emit("success_deleteMember", userId);
        io.to(groupId).emit("welcome", message);

        group.members = group.members.filter(
          (member) => !member.equals(userId)
        );
        chat.members = chat.members.filter((member) => !member.equals(userId));

        chat.messages.push(message);

        await Promise.all([group.save(), chat.save()]);
      } catch (error) {
        console.error("Error in quitGroup", error);
        socket.emit("error", "Error in quitGroup");
      }
    });

    socket.on("check_member", async (userId, groupId) => {
      const group = await findStudyGroupById(groupId);
      if (!group) {
        return socket.emit("error", "not found group");
      }
      const isMember = group.members.includes(userId);
      socket.emit("check_member", isMember);
    });
  });
};
