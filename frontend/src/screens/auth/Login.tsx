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
    const res = await axiosApi.post("/user/login", {
      userId,
      password,
    });
    console.log(res.data);
    if (res.status === 201) {
      // 로그인 성공 시 홈으로 이동
      navigate("/home");
    }
    localStorage.setItem("accessToken", res.data.access_token);
  };
  return (
    <div className="">
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
        <button>
          <Link to={"/register"}>회원가입</Link>
        </button>
      </form>
    </div>
  );
}

export default Login;
