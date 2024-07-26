import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axiosApi from "../../axios";
import { fetchStudy } from "../../api/api";
import { useNavigate } from "react-router-dom";

function StudyRoomUsers() {
  const group = useAppSelector((state) => state.group);
  const users = useAppSelector((state) => state.users);
  const id = useAppSelector((state) => state.id);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const getProfile = async (userId: string) => {
    const res = await axiosApi.get(`/auth/profile/${userId}`);
    console.log(res.data);
    navigate("/profile", {
      state: {
        user: res.data.user,
      },
    });
  };

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
    <div className="border-2 border-black w-[22%] flex flex-col items-center rounded-xl">
      <span className="font-bold text-lg">멤버 정보</span>
      <div className="w-full overflow-y-auto">
        {users?.map((user, index) => (
          <div key={index} className="w-full px-1 mb-2">
            <div className="flex items-start border border-black p-2 rounded-lg">
              <img
                className="w-12 h-12 rounded-xl"
                alt="profile"
                src={user.profileImg}
              />
              <div>
                <div className="mx-2 flex justify-between items-center w-full">
                  <span>{user.username}</span>
                  <span className="text-sm">{user.gender}</span>
                  <span className="text-sm">
                    {new Date().getFullYear() -
                      new Date(user.birth).getFullYear()}
                    세
                  </span>
                  <span className="font-bold text-xs">
                    {group.masterId === user._id ? "그룹장" : "멤버"}
                  </span>
                </div>
                <div className="flex justify-between mx-2 w-full text-sm mt-2">
                  <button
                    onClick={() => getProfile(user._id)}
                    className="border border-black p-1 rounded-md hover:opacity-60"
                  >
                    정보 보기
                  </button>
                  {group?.masterId !== user._id && group.masterId === id.id && (
                    <button
                      className="border border-black p-1 rounded-md hover:opacity-60"
                      onClick={() => deleteMember(user._id)}
                    >
                      멤버 추방
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyRoomUsers;
