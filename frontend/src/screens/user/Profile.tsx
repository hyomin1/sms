import React, { useEffect, useState } from "react";
import { ApplicantUsers } from "../../interfaces/users";
import axiosApi from "../../api";

interface User extends ApplicantUsers {
  email: string;
  userId: string;
  createdAt: Date; // 가입일자
}
function Profile() {
  const [user, setUser] = useState<User>();
  const fetchUserProfile = async () => {
    const res = await axiosApi.get("/auth/profile");
    setUser(res.data.user);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      <div>
        <span>내정보</span>
      </div>
      <div>
        <img className="w-20 h-20" alt="Profile" src={user?.profileImg} />
        <span>{user?.email}</span>
        <span>{user?.username}</span>
        <span>{user?.userId}</span>
        <span>{user?.gender}</span>
      </div>
    </div>
  );
}

export default Profile;
