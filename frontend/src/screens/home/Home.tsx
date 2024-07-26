import KaKaoMap from "./KaKaoMap";
import { Link, useNavigate } from "react-router-dom";
import axiosApi from "../../axios";

function Home() {
  const navigate = useNavigate();
  const getProfile = async () => {
    const res = await axiosApi.get("/auth/profile");
    navigate("/profile", {
      state: {
        user: res.data.user,
      },
    });
  };
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
          나의 그룹
        </Link>

        <button
          onClick={getProfile}
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
