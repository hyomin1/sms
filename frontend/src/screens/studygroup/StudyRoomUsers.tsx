import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axiosApi from "../../axios";
import { fetchStudy } from "../../api/api";

function StudyRoomUsers() {
  const group = useAppSelector((state) => state.group);
  const users = useAppSelector((state) => state.users);
  const id = useAppSelector((state) => state.id);
  const dispatch = useAppDispatch();

  const deleteMember = async (userId: string) => {
    const isConfirmed = window.confirm(
      "정말로 이 사용자를 그룹에서 제거하시겠습니까?"
    );
    if (isConfirmed) {
      const res = await axiosApi.delete(`/studyGroup/${group._id}/${userId}`);
      if (res.status === 200) {
        alert(res.data.message);
        fetchStudy(group._id, dispatch);
      }
    }
  };
  return (
    <div className="border border-black w-[22%] flex flex-col items-center">
      <span className="font-bold text-lg">멤버 정보</span>

      {users?.map((user, index) => (
        <div key={index} className="border border-black w-full px-1">
          <div className="flex items-start border border-black">
            <img
              className="w-12 h-12 rounded-xl"
              alt="profile"
              src={user.profileImg}
            />
            <span className="mx-2">{user.username}</span>
            <span>{user.gender}</span>
            <span className="mx-2">
              {new Date().getFullYear() - new Date(user.birth).getFullYear()}세
            </span>
            <span className="font-bold text-xs">
              {group.masterId === user._id ? "그룹장" : "멤버"}
            </span>
          </div>
          <div className="flex justify-between">
            {group?.masterId !== user._id && group.masterId === id.id && (
              <button onClick={() => deleteMember(user._id)}>멤버 추방</button>
            )}
            <button>정보 보기</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudyRoomUsers;
