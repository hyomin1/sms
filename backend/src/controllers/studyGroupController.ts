import { Request, Response } from "express";
import StudyGroup from "../models/StudyGroup";
import User from "../models/User";
import Chat from "../models/Chat";

const ERROR_MESSAGES = {
  GROUP_NOT_FOUND: "그룹을 찾을 수 없습니다.",
  USER_NOT_FOUND: "해당 유저가 존재하지 않습니다.",
  ALREADY_MEMBER: "사용자가 이미 그룹에 포함되어 있습니다.",
  ALREADY_APPLIED: "사용자가 이미 그룹 신청을 했습니다",
  GENDER_MISMATCH: "성별이 맞지 않습니다.",
  AGE_MISMATCH: "나이가 맞지 않습니다.",
  APPLICATION_FAILED: "그룹 신청 실패",
  APPLICATION_SUCCESS: "신청이 완료되었습니다.",
  GROUP_CREATION_FAILED: "그룹 생성 실패",
  GROUP_CREATION_SUCCESS: "그룹 생성",
  GROUP_QUERY_FAILED: "그룹 조회 실패",
  GROUP_QUERY_SUCCESS: "그룹 조회 성공",
  GROUP_MANAGEMENT_FAILED: "그룹 관리 실패",
  GROUP_MANAGEMENT_SUCCESS: "그룹 관리 보기",
  GROUP_ACCEPTANCE_FAILED: "그룹 신청 수락 중 에러",
  GROUP_ACCEPTANCE_SUCCESS: "사용자가 그룹에 추가되었습니다.",
  GROUP_DENIAL_FAILED: "그룹 신청 거절 중 에러",
  GROUP_DENIAL_SUCCESS: "그룹 신청이 거절되었습니다.",
  NOT_AN_APPLICANT: "해당 유저가 신청자 목록에 존재하지 않습니다.",
  GROUP_DELETED_FAILED: "그룹 삭제 실패",
  GROUP_DELETED_SUCCESS: "그룹 삭제 성공",
  MEMBER_DELETED_FAILED: "멤버 삭제 실패",
  MEMBER_DELETED_SUCCESS: "멤버 삭제 성공",
};

const findStudyGroupById = async (groupId: string) => {
  return StudyGroup.findOne({ _id: groupId });
};

const findUserById = async (userId: string) => {
  return User.findOne({ _id: userId });
};

const findChatById = async (chatId: string) => {
  return Chat.findOne({ studyGroupId: chatId });
};

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

    const group = await StudyGroup.create({
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
    // 그룹 생성하면서 채팅방도 함께 생성
    await Chat.create({
      studyGroupId: group._id,
      members: [id],
      messages: [],
      lastActivity: new Date(),
    });
    res.json({ message: ERROR_MESSAGES.GROUP_CREATION_SUCCESS });
  } catch (error) {
    console.error("그룹 생성 중 에러 발생", error);
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_CREATION_FAILED });
  }
};

export const deleteStudyGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  try {
    const group = await findStudyGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: ERROR_MESSAGES.GROUP_NOT_FOUND });
    }
    // 그룹에 1명 남고 그 1명이 방장인 경우 삭제 하기
    if (group.members.length === 1 && group.members[0].equals(group.masterId)) {
      await StudyGroup.deleteOne({ _id: groupId });

      return res
        .status(200)
        .json({ message: ERROR_MESSAGES.GROUP_DELETED_SUCCESS });
    } else {
      return res
        .status(400)
        .json({ message: "그룹에 구성원이 남아 있습니다." });
    }
  } catch (error) {
    console.error("그룹 삭제 중 에러", error);
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_DELETED_FAILED });
  }
};

export const deleteGroupUser = async (req: Request, res: Response) => {
  const { groupId, userId } = req.params;
  const { id } = req.body;

  try {
    const [group, chat] = await Promise.all([
      findStudyGroupById(groupId),
      findChatById(groupId),
    ]);
    if (!group || !chat) {
      return res.status(404).json({ message: ERROR_MESSAGES.GROUP_NOT_FOUND });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }
    // 그룹장만 멤버 추방 가능
    if (!id.equals(group.masterId)) {
      return res.status(404).json({ message: "그룹장만 추방할 수 있습니다." });
    }
    // 그룹장은 추방 x
    if (group.masterId.equals(userId)) {
      return res.status(404).json({ message: "그룹장은 추방할 수 없습니다." });
    }
    // 멤버 추방
    group.members = group.members.filter((member) => !member.equals(userId));
    chat.members = chat.members.filter((member) => !member.equals(userId));
    await group.save();
    await chat.save();
    res.json({ message: ERROR_MESSAGES.MEMBER_DELETED_SUCCESS });
  } catch (error) {
    console.error("멤버 추방 중 에러 발생", error);
    res.status(500).json({ message: ERROR_MESSAGES.MEMBER_DELETED_FAILED });
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
      message: ERROR_MESSAGES.GROUP_QUERY_SUCCESS,
      createdStudyGroups,
      joinedStudyGroups,
      userId,
    });
  } catch (error) {
    console.error("그룹 조회 중 에러 발생", error);
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_QUERY_FAILED });
  }
};

export const getStudyGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const { id } = req.body;
  try {
    const group = await findStudyGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: ERROR_MESSAGES.GROUP_NOT_FOUND });
    }

    res.json({ message: ERROR_MESSAGES.GROUP_QUERY_SUCCESS, group, id });
  } catch (error) {
    console.error("그룹 조회 중 에러 발생", error);
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_QUERY_FAILED });
  }
};

export const searchGroup = async (req: Request, res: Response) => {
  try {
    const { isOnline, region, gender, category } = req.body;
    // 값 없는 경우 undefined
    let groups = await StudyGroup.find({});
    let online: boolean | undefined = undefined;

    switch (isOnline) {
      case "true":
        online = true;
        break;
      case "false":
        online = false;
        break;
    }

    if (online !== undefined) {
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
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_QUERY_FAILED });
  }
};

// 그룹 신청
export const joinStudyGroup = async (req: Request, res: Response) => {
  const { groupId, id } = req.body;
  try {
    const group = await findStudyGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: ERROR_MESSAGES.GROUP_NOT_FOUND });
    }
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    // 사용자가 이미 스터디 그룹 멤버일 경우
    if (group.members.includes(id)) {
      return res.status(400).json({ message: ERROR_MESSAGES.ALREADY_MEMBER });
    }
    // 이미 스터디 그룹 신청 한경우
    if (group.applicants.includes(id)) {
      return res.status(400).json({ message: ERROR_MESSAGES.ALREADY_APPLIED });
    }

    // 성별, 나이 맞지 않는 경우

    const year = user.birth.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    const isGenderMismatch =
      (group.gender === "남성" && user.gender === "여성") ||
      (group.gender === "여성" && user.gender === "남성");

    if (isGenderMismatch) {
      return res.status(400).json({ message: ERROR_MESSAGES.GENDER_MISMATCH });
    }
    if (age < group.ageRange.min || age > group.ageRange.max) {
      return res.status(400).json({ message: ERROR_MESSAGES.AGE_MISMATCH });
    }

    group.applicants.push(id);
    await group.save();
    res.json({ message: ERROR_MESSAGES.APPLICATION_SUCCESS });
  } catch (error) {
    console.error("그룹 신청 중 에러", error);
    res.status(500).json({ message: ERROR_MESSAGES.APPLICATION_FAILED });
  }
};

// 그룹 신청 현황 관리
export const manageGroup = async (req: Request, res: Response) => {
  const { groupId, id } = req.body;
  try {
    const group = await findStudyGroupById(groupId);

    const users = await User.find({ _id: group?.applicants }).select(
      "username birth gender profileImg"
    );

    res.json({ message: ERROR_MESSAGES.GROUP_MANAGEMENT_SUCCESS, users });
  } catch (error) {
    console.error("그룹 관리 에러");
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_MANAGEMENT_FAILED });
  }
};

// 사용자 그룹 신청 수락
export const acceptGroupUser = async (req: Request, res: Response) => {
  const { user_id, groupId } = req.body;
  try {
    const group = await findStudyGroupById(groupId);

    if (!group) {
      return res.status(404).json({ message: ERROR_MESSAGES.GROUP_NOT_FOUND });
    }
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: ERROR_MESSAGES.GROUP_NOT_FOUND });
    }

    // 스터디 그룹 신청 목록에서 해당 유저 제거
    const applicantIndex = group.applicants.indexOf(user._id);
    if (applicantIndex === -1) {
      return res.status(400).json({ message: ERROR_MESSAGES.NOT_AN_APPLICANT });
    }
    group.applicants.splice(applicantIndex, 1);

    //스터디 그룹 멤버에 해당 유저 추가
    if (!group.members.includes(user._id)) {
      group.members.push(user._id);
    }

    await group.save();
    // 신청자 정보 다시 내려주기
    const users = await User.find({ _id: group.applicants }).select(
      "username birth gender profileImg"
    );
    res
      .status(200)
      .json({ message: ERROR_MESSAGES.GROUP_ACCEPTANCE_SUCCESS, users });
  } catch (error) {
    console.error("그룹 신청 수락 중 에러", error);
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_ACCEPTANCE_FAILED });
  }
};

// 사용자 그룹 신청 거절
export const denyGroupUser = async (req: Request, res: Response) => {
  const { user_id, groupId } = req.body;
  const group = await findStudyGroupById(groupId);
  if (!group) {
    return res.status(404).json({ message: ERROR_MESSAGES.GROUP_NOT_FOUND });
  }
  const user = await findUserById(user_id);
  if (!user) {
    return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
  }

  // 스터디 그룹 신청 목록에서 해당 유저 제거
  const applicantIndex = group.applicants.indexOf(user._id);
  if (applicantIndex === -1) {
    return res.status(400).json({ message: ERROR_MESSAGES.NOT_AN_APPLICANT });
  }
  group.applicants.splice(applicantIndex, 1);

  await group.save();
  const users = await User.find({ _id: group.applicants }).select(
    "username birth gender profileImg"
  );

  res.status(200).json({ message: ERROR_MESSAGES.GROUP_DENIAL_SUCCESS, users });

  try {
  } catch (error) {
    console.error("그룹 신청 거절 중 에러", error);
    res.status(500).json({ message: ERROR_MESSAGES.GROUP_DENIAL_FAILED });
  }
};
