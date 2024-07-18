import { Request, Response } from "express";
import User from "../models/User";
import StudyGroup from "../models/StudyGroup";

export const createStudyGroup = async (req: Request, res: Response) => {
  const {
    id: userId,
    groupName,
    region,
    gender,
    isOnline,
    maxCapacity,
  } = req.body;
  const user = await User.findOne({ userId });

  await StudyGroup.create({
    masterId: user?._id,
    groupName,
    region,
    gender,
    isOnline,
    maxCapacity,
  });
  res.json({ message: "그룹 생성" });
};
