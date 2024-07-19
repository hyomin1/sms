import { Request, Response } from "express";
import StudyGroup from "../models/StudyGroup";

export const createStudyGroup = async (req: Request, res: Response) => {
  const { id, groupName, region, gender, isOnline, maxCapacity } = req.body;

  await StudyGroup.create({
    masterId: id,
    groupName,
    region,
    gender,
    isOnline,
    maxCapacity,
    members: [id], // 생성 시 생성한 사람도 멤버에 포함됨
  });
  res.json({ message: "그룹 생성" });
};

export const getStudyGroups = async (req: Request, res: Response) => {
  res.json({ message: "조회 성공" });
};
