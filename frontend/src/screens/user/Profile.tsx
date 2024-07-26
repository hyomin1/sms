import React, { useEffect, useState } from "react";
import { ApplicantUsers } from "../../interfaces/users";
import axiosApi from "../../axios";
import UserInformComponent from "../../components/UserInformComponent";
import { useLocation } from "react-router-dom";

interface User extends ApplicantUsers {
  email: string;
  userId: string;
  createdAt: Date; // 가입일자
}
function Profile() {
  const [user, setUser] = useState<User>();
  const location = useLocation();
  useEffect(() => {
    setUser(location.state.user);
  }, [location]);

  if (!user) {
    return <div>로딩 중...</div>;
  }
  const createDate = `${new Date(user.createdAt).getFullYear()}년 ${
    new Date(user.createdAt).getMonth() + 1
  }월 ${new Date(user.createdAt).getDate()}일`;

  return (
    <div className="px-12">
      <div className="flex justify-center mt-8">
        <span className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-4xl">
          프로필 정보
        </span>
      </div>
      <div className="flex justify-center flex-col items-center mt-8 border border-black rounded-lg py-4">
        <img
          className="w-24 h-24 rounded-xl mb-4"
          alt="Profile"
          src={user?.profileImg}
        />
        <UserInformComponent label="유저명" content={user.username} />
        <UserInformComponent label="이메일" content={user.email} />

        <UserInformComponent label="성별" content={user.gender} />
        <UserInformComponent label="가입 일자" content={createDate} />
      </div>
    </div>
  );
}

export default Profile;
