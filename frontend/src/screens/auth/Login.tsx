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
    localStorage.setItem("accessToken", res.data.access_token);
  };

  const kakaoLogin = () => {
    window.location.href = "http://localhost:8080/auth/kakaoLogin";
  };
  return (
    <div className="">
      <form className="flex flex-col" onSubmit={handleSubmit(loginUser)}>
        <input
          {...register("userId", { required: true })}
          placeholder="아이디"
        />
        <input
          {...register("password", { required: true })}
          placeholder="비밀번호"
          type="password"
        />
        <div className="flex-col flex">
          <button>로그인</button>
          <button onClick={kakaoLogin}>카카오 로그인</button>
          <button>
            <Link to={"/register"}>회원가입</Link>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
