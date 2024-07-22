import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosApi from "../../api";
import { IStudyGroup } from "../../interfaces/studygroup";
import { ApplicantUsers } from "../../interfaces/users";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setGroup } from "../../features/group/groupSlice";
import StudyRoomUsers from "./StudyRoomUsers";
function StudyRoom() {
  const params = useParams();
  const { groupId } = params;

  const group = useAppSelector((state) => state.group);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<ApplicantUsers[]>();
  const fetchStudy = async () => {
    const res = await axiosApi.get(`/studyGroup/${groupId}`);
    //setGroup(res.data.group);
    dispatch(setGroup(res.data.group));
    const res2 = await axiosApi.post("/auth/users", {
      memberIds: res.data.group.members,
    });
    setUsers(res2.data.users);
  };
  useEffect(() => {
    fetchStudy();
  }, []);

  const deleteMember = async (userId: string) => {
    const isConfirmed = window.confirm(
      "정말로 이 사용자를 그룹에서 제거하시겠습니까?"
    );
    if (isConfirmed) {
      const res = await axiosApi.delete(`/studyGroup/${groupId}/${userId}`);
      alert(res.data.message);
      if (res.status === 200) {
        fetchStudy();
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex flex-col items-center">
        <span className="mb-2 bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-4xl">
          {group?.groupName}
        </span>
        <span className="font-semibold text-sm mb-2">{group?.description}</span>
      </div>
      <div className="flex justify-between w-full">
        <div className="border border-black w-[22%] flex flex-col items-center">
          <span className="font-bold text-lg">멤버 정보</span>
          <StudyRoomUsers />
          {users?.map((user, index) => (
            <div key={index} className="border border-black w-full px-1">
              <div className="flex justify-start">
                <img
                  className="w-12 h-12 rounded-xl"
                  alt="profile"
                  src={user.profileImg}
                />
                <span className="mx-2">{user.username}</span>
                <span>{user.gender}</span>
                <span className="mx-2">
                  {new Date().getFullYear() -
                    new Date(user.birth).getFullYear()}
                  세
                </span>
              </div>
              <div className="flex justify-between">
                {group?.masterId !== user._id && (
                  <button onClick={() => deleteMember(user._id)}>
                    멤버 추방
                  </button>
                )}
                <button>정보 보기</button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-[50%] border border-black flex flex-col items-center">
          <span className="font-bold text-lg">할 일</span>
        </div>
        <div className="w-[22%] border border-black flex flex-col items-center">
          <span className="font-bold text-lg">채팅</span>
        </div>
      </div>
    </div>
  );
}

export default StudyRoom;
