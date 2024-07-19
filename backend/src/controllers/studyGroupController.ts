import { Request, Response } from "express";
import StudyGroup from "../models/StudyGroup";
import { addInform } from "./userController";

export const createStudyGroup = async (req: Request, res: Response) => {
  try {
    const {
      id,
      groupName,
      region,
      gender,
      isOnline,
      maxCapacity,
      minAge,
      maxAge,
      category,
    } = req.body;

    await StudyGroup.create({
      masterId: id,
      groupName,
      region,
      gender,
      isOnline,
      maxCapacity,
      minAge,
      maxAge,
      category,
      members: [id], // 생성 시 생성한 사람도 멤버에 포함됨
    });
    res.json({ message: "그룹 생성" });
  } catch (error) {
    console.error("그룹 생성 중 에러 발생", error);
    res.status(500).json({ message: "그룹 생성 실패" });
  }
};

export const getStudyGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.body.id;
    // 모든 스터디 그룹 조회
    const allGroups = await StudyGroup.find({});
    // 내가 생성한 그룹 필터링
    const createdStudyGroups = allGroups.filter((group) =>
      group.masterId.equals(userId)
    );
    // 내가 참여한 그룹 필터링
    const joinedStudyGroups = allGroups.filter(
      (group) =>
        group.members.includes(userId) && !group.masterId.equals(userId)
    );
    res.json({
      message: "그룹 조회 성공",
      createdStudyGroups,
      joinedStudyGroups,
    });
  } catch (error) {
    console.error("그룹 조회 중 에러 발생", error);
    res.status(500).json({ message: "그룹 조회 실패" });
  }
};

export const searchGroup = async (req: Request, res: Response) => {
  try {
    const { isOnline, region, gender, category } = req.body;
    // 값 없는 경우 undefined
    console.log(isOnline, region, gender, category);
    let groups = await StudyGroup.find({});
    // if (isOnline) {
    //   const online = new Boolean(isOnline);
    //   groups = groups.filter((group) => group.isOnline === online);
    // }
    if (region) {
      groups = groups.filter((group) => group.region === region);
    }
    if (gender) {
      groups = groups.filter((group) => group.gender === gender);
    }
    if (category) {
      groups = groups.filter((group) => group.category.includes(category));
    }
    console.log(groups);
    res.json({ message: "검색 성공", groups });
  } catch (error) {
    console.error("그룹 검색 중 에러", error);
    res.status(500).json({ message: "그룹 검색 실패" });
  }
};
