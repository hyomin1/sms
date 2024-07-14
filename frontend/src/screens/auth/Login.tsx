import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../api";

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
  const loginUser = async (data: ILogin) => {
    const { userId, password } = data;
    const res = await axiosApi.post("/user/login", {
      userId,
      password,
    });
    localStorage.setItem("accessToken", res.data.access_token);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(loginUser)}>
        <input
          {...register("userId", { required: true })}
          placeholder="아이디"
        />
        <input
          {...register("password", { required: true })}
          placeholder="비밀번호"
          type="password"
        />
        <button>로그인</button>
      </form>
    </div>
  );
}

export default Login;
