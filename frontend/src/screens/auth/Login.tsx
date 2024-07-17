import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../api";
import { Link, useNavigate } from "react-router-dom";

interface ILogin {
  userId: string;
  password: string;
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const navigate = useNavigate();

  const loginUser = async (data: ILogin) => {
    const { userId, password } = data;
    const res = await axiosApi.post("/auth/login", {
      userId,
      password,
    });

    if (res.status === 201) {
      // 로그인 성공 시 홈으로 이동
      navigate("/home");
    }
    localStorage.setItem("access_token", res.data.access_token);
  };

  const kakaoLogin = () => {
    window.location.href = "http://localhost:8080/auth/kakaoLogin";
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/auth/googleLogin";
  };
  return (
    <div className="flex justify-between items-center h-screen">
      <div className="flex items-center justify-center w-[50%] h-[100%]">
        <div className="w-40 h-40 bg-slate-800">사진</div>
      </div>
      <div className="w-[50%]">
        <div className="flex flex-col">
          <span className="font-extrabold text-[#0E4A67] text-3xl">로그인</span>
          <span className="text-[#37677E] text-xs mt-2 font-semibold">
            계정이 없으신가요?{" "}
            <Link to={"/register"} className="text-[#FE904B] hover:opacity-60">
              회원가입 하러가기
            </Link>
          </span>
        </div>
        <form className="flex flex-col mt-8" onSubmit={handleSubmit(loginUser)}>
          <label
            htmlFor="userId"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            아이디
          </label>
          <input
            id="userId"
            className="w-[60%] border-2 border-[#207198] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
            {...register("userId", { required: true })}
          />
          {errors.userId && (
            <span className="w-[60%] text-center text-[red] font-bold">
              {errors.userId.type === "required" && "아이디를 입력해주세요"}
            </span>
          )}
          <label
            htmlFor="pw"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            비밀번호
          </label>
          <input
            id="pw"
            className="w-[60%] border-2 border-[#207198] px-2 py-2 mb-4 rounded-md focus:outline-none focus:border-blue-500 text-md"
            {...register("password", { required: true })}
            type="password"
          />
          {errors.userId && (
            <span className="text-center text-[red] font-bold w-[60%]">
              {errors.userId.type === "required" && "비밀번호를 입력해주세요"}
            </span>
          )}
          <div className="flex-col flex">
            <button className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[60%] h-12 rounded-sm hover:opacity-60 text-white font-bold text-sm mb-2">
              로그인
            </button>
            <button
              onClick={kakaoLogin}
              className="w-[60%] h-10 hover:opacity-60 mb-4"
            >
              <img
                alt="KaKaoLogin"
                src={"/images/kakao_login.png"}
                className="w-[100%] h-12"
              />
            </button>
            <button
              onClick={googleLogin}
              className="w-[60%] h-10 hover:opacity-60"
            >
              <img
                alt="GoogleLogin"
                src={"/images/google_login.png"}
                className="w-[100%] h-12"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
