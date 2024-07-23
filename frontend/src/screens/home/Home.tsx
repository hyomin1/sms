import React, { useEffect } from "react";
import KaKaoMap from "./KaKaoMap";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { io } from "socket.io-client";

function Home() {
  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on("connect", () => {
      console.log("front sock connect");
    });

    // 홈 화면 언마운트시 연결 종료
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center items-center my-4 h-[10%]">
        <h1 className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-4xl">
          SMS
        </h1>
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
          그룹 관리
        </Link>

        <Link
          to={"/profile"}
          className="w-[25%] flex justify-center items-center  hover:opacity-60 font-bold border border-black"
        >
          내 정보
        </Link>

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
