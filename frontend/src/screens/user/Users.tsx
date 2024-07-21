import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ApplicantUsers } from "../../interfaces/users";
import axiosApi from "../../api";

function Users() {
  const location = useLocation();
  const [users, setUsers] = useState<ApplicantUsers[]>();
  const [groupId, setGroupId] = useState<string>();
  const acceptUser = async (user: ApplicantUsers) => {
    const res = await axiosApi.post("/studyGroup/accept", {
      user_id: user._id,
      groupId,
    });
    setUsers(res.data.users);
  };

  const denyUser = async (user: ApplicantUsers) => {
    const res = await axiosApi.post("/studyGroup/deny", {
      user_id: user._id,
      groupId,
    });
    setUsers(res.data.users);
  };

  const deleteGroup = async () => {
    const res = await axiosApi.delete(`/studyGroup/${groupId}`);
    console.log(res.data);
  };

  useEffect(() => {
    setUsers(location.state.users);
    setGroupId(location.state.groupId);
  }, [location.state]);
  if (!users) return <div>사용자 데이터 불러오기 실패</div>;

  return (
    <div className="flex flex-col items-center py-4">
      <span className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-4xl mb-4">
        신청자 목록
      </span>

      {users.map((user, index) => (
        <div
          key={index}
          className="flex flex-col mb-8 border w-[70%] border-black p-3"
        >
          <div className="flex">
            <img
              className="w-20 h-20 rounded-2xl"
              alt="Profile"
              src={user.profileImg}
            />
            <span className="ml-4">{user.username}</span>
            <span className="ml-4">{user.gender}</span>
          </div>
          <div className="flex justify-between">
            <button>채팅</button>
            <button onClick={() => acceptUser(user)}>수락</button>
            <button onClick={() => denyUser(user)}>거절</button>
          </div>
        </div>
      ))}
      <button onClick={deleteGroup}>그룹 삭제</button>
    </div>
  );
}

export default Users;
