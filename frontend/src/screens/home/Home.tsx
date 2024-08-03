import KaKaoMap from "./KaKaoMap";
import { Link, useNavigate } from "react-router-dom";
import axiosApi from "../../axios";
import { useEffect, useState } from "react";
import { ApplicantUsers } from "../../interfaces/users";

interface User extends ApplicantUsers {
  email: string;
  userId: string;
  createdAt: Date; // 가입일자
}

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const fetchProfile = async () => {
    const res = await axiosApi.get("/auth/profile");
    setUser(res.data.user);
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const goProfile = async () => {
    navigate("/profile", {
      state: {
        user,
      },
    });
  };

  const logout = async () => {
    const isConfirm = window.confirm("로그아웃 하시겠습니까?");
    if (isConfirm) {
      const res = await axiosApi.get("/auth/logout");
      if (res.status === 200) {
        localStorage.removeItem("access_token");
        navigate("/");
      }
    }
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center my-4 h-[10%] px-4">
        <div onClick={goProfile} className="flex items-center hover:opacity-60">
          <img
            className="w-6 h-6 rounded-lg mr-1"
            alt="profile"
            src={user?.profileImg}
          />
          <span className="font-bold">{user?.username}</span>
        </div>
        <h1 className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-4xl">
          SMS
        </h1>
        <span onClick={logout} className="font-bold hover:opacity-60">
          로그아웃
        </span>
      </div>

      <div className="flex justify-between  h-[10%]">
        <Link
          to={"/createGroup"}
          className="w-[25%] flex justify-center items-center  hover:opacity-60 font-bold border border-black"
        >
          그룹 생성
        </Link>
        <Link
          to={"/groupList"}
          className="w-[25%] flex justify-center items-center  hover:opacity-60 font-bold border border-black"
        >
          나의 그룹
        </Link>

        <button
          onClick={goProfile}
          className="w-[25%] flex justify-center items-center  hover:opacity-60 font-bold border border-black"
        >
          내 정보
        </button>

        <Link
          to={"/searchGroup"}
          className="w-[25%] flex justify-center items-center  hover:opacity-60 font-bold border border-black"
        >
          검색
        </Link>
      </div>

      <div className="h-[80%]">
        <KaKaoMap />
      </div>
    </div>
  );
}

export default Home;
