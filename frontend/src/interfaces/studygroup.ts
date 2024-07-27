import { Socket } from "socket.io-client";

export interface IStudyGroup {
  _id: string;
  masterId: string;
  groupName: string;
  description: string;
  gender: "남성" | "여성" | "성별 무관";
  maxCapacity: number;
  ageRange: {
    min: number;
    max: number;
  };
  category: string;
  region: string;
  isOnline: boolean;
  applicants: string[];
  members: string[];
}

export interface ISocket {
  groupId: string;
  socket: Socket | null;
}
