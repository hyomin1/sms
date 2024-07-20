import { Request, Response } from "express";
import StudyGroup from "../models/StudyGroup";
import User from "../models/User";

export const createStudyGroup = async (req: Request, res: Response) => {
  try {
    const {
      id,
      groupName,
      region,
      gender,
      isOnline,
      maxCapacity,
      description,
      minAge,
      maxAge,
      category,
    } = req.body;
    const ageRange = {
      min: minAge,
      max: maxAge,
    };

    await StudyGroup.create({
      masterId: id,
      groupName,
      description,
      region,
      gender,
      isOnline,
      maxCapacity,
      ageRange,
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
    let groups = await StudyGroup.find({});
    let online;

    switch (isOnline) {
      case "true":
        online = true;
        break;
      case "false":
        online = false;
        break;
    }
    if (online) {
      groups = groups.filter((group) => group.isOnline === online);
    }
    if (region) {
      groups = groups.filter((group) => group.region === region);
    }
    if (gender) {
      groups = groups.filter((group) => group.gender === gender);
    }
    if (category) {
      groups = groups.filter((group) => group.category.includes(category));
    }
    res.json({ message: "검색 성공", groups });
  } catch (error) {
    console.error("그룹 검색 중 에러", error);
    res.status(500).json({ message: "그룹 검색 실패" });
  }
};

// 그룹 신청
export const joinStudyGroup = async (req: Request, res: Response) => {
  const { groupId, id } = req.body;
  try {
    const group = await StudyGroup.findOne({ _id: groupId });
    if (!group) {
      return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
    }

    // 사용자가 이미 스터디 그룹 멤버일 경우
    if (group.members.includes(id)) {
      return res
        .status(400)
        .json({ message: "사용자가 이미 그룹에 포함되어 있습니다." });
    }

    // 성별, 나이 맞지 않는 경우

    // 이미 스터디 그룹 신청 한경우
    if (group.applicants.includes(id)) {
      return res
        .status(400)
        .json({ message: "사용자가 이미 그룹 신청을 했습니다" });
    }
    group.applicants.push(id);
    await group.save();
    res.json({ message: "신청이 완료되었습니다." });
  } catch (error) {
    console.error("그룹 신청 중 에러", error);
    res.status(500).json({ message: "그룹 신청 실패" });
  }
};

// 그룹 신청 현황 관리
export const manageGroup = async (req: Request, res: Response) => {
  const { groupId, id } = req.body;
  try {
    const group = await StudyGroup.findOne({ _id: groupId });
    console.log(group?.applicants);

    const users = await User.find({ _id: group?.applicants }).select(
      "username birth gender profileImg"
    );

    res.json({ message: "그룹 관리 보기", users });
  } catch (error) {
    console.error("그룹 관리 에러");
    res.status(500).json({ message: "그룹 관리 실패" });
  }
};

const removeApplicantsUser = (userId: string) => {};

// 사용자 그룹 신청 수락
export const acceptGroupUser = async (req: Request, res: Response) => {
  const { user_id, groupId } = req.body;
  try {
    const group = await StudyGroup.findOne({ _id: groupId });
    if (!group) {
      return res.status(404).json({ message: "해당 그룹을 찾을 수 없습니다." });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({ message: "해당 유저를 찾을 수 없습니다." });
    }

    // 스터디 그룹 신청 목록에서 해당 유저 제거
    const applicantIndex = group.applicants.indexOf(user._id);
    if (applicantIndex > -1) {
      group.applicants.splice(applicantIndex, 1);
    } else {
      return res
        .status(400)
        .json({ message: "해당 유저가 신청자 목록에 존재하지 않습니다." });
    }
    // 스터디 그룹 멤버에 해당 유저 추가
    if (!group.members.includes(user._id)) {
      group.members.push(user._id);
    }

    await group.save();
    // 신청자 정보 다시 내려주기
    const users = await User.find({ _id: group.applicants }).select(
      "username birth gender profileImg"
    );
    res.status(200).json({ message: "사용자가 그룹에 추가되었습니다.", users });
  } catch (error) {
    console.error("그룹 신청 수락 중 에러", error);
    res.status(500).json({ message: "그룹 신청 수락 중 에러" });
  }
};

// 사용자 그룹 신청 거절
export const denyGroupUser = async (req: Request, res: Response) => {
  const { user_id, groupId } = req.body;
  const group = await StudyGroup.findOne({ _id: groupId });
  if (!group) {
    return res.status(404).json({ message: "해당 그룹을 찾을 수 없습니다." });
  }
  const user = await User.findOne({ _id: user_id });
  if (!user) {
    return res.status(404).json({ message: "해당 유저를 찾을 수 없습니다." });
  }

  // 스터디 그룹 신청 목록에서 해당 유저 제거
  const applicantIndex = group.applicants.indexOf(user._id);
  if (applicantIndex > -1) {
    group.applicants.splice(applicantIndex, 1);
  } else {
    return res
      .status(400)
      .json({ message: "해당 유저가 신청자 목록에 존재하지 않습니다." });
  }
  await group.save();
  const users = await User.find({ _id: group.applicants }).select(
    "username birth gender profileImg"
  );

  res.status(200).json({ message: "그룹 신청이 거절되었습니다.", users });

  try {
  } catch (error) {
    console.error("그룹 신청 거절 중 에러", error);
    res.status(500).json({ message: "그룹 신청 거절 중 에러" });
  }
};
