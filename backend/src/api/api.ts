import Chat from "../models/Chat";
import StudyGroup from "../models/StudyGroup";
import ToDo from "../models/ToDo";
import User from "../models/User";

export const findStudyGroupById = async (groupId: string) => {
  return StudyGroup.findOne({ _id: groupId });
};

export const findUserById = async (userId: string) => {
  return User.findOne({ _id: userId });
};

export const findChatById = async (chatId: string) => {
  return Chat.findOne({ studyGroupId: chatId });
};

export const findToDoById = async (groupId: string) => {
  return ToDo.findOne({ studyGroupId: groupId });
};
