import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../api";
import { useNavigate } from "react-router-dom";

interface IRegister {
  username: string;
  userId: string;
  password: string;
  confirmPassword: string;
  birth: Date;
  email: string;
  gender: "male" | "female";
  profileImg?: string;
}
function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IRegister>();

  const password = watch("password");

  const navigate = useNavigate();

  const userRegister = async (data: IRegister) => {
    const { userId, username, email, password, gender, birth, profileImg } =
      data;
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    const birthDate = new Date(birth);
    formData.append("birth", birthDate.toISOString());
    // 프로필 사진 등록한 경우
    if (profileImg && profileImg.length > 0) {
      formData.append("file", profileImg[0]);
    }
    const res = await axiosApi.post("/user/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 201) {
      setValue("username", "");
      setValue("email", "");
      setValue("userId", "");
      setValue("password", "");
      setValue("birth", new Date());
      setValue("gender", "male");

      navigate("/");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(userRegister)} className="flex flex-col">
        <input
          {...register("userId", { required: true, minLength: 6 })}
          placeholder="아이디"
        />
        {errors.userId && (
          <span className="text-center text-[red] font-bold">
            {errors.userId.type === "required" && "아이디를 입력해주세요"}
            {errors.userId.type === "minLength" &&
              "최소 6글자 이상 입력해주세요"}
          </span>
        )}
        <input
          {...register("username", { required: true })}
          placeholder="이름"
        />
        {errors.username && (
          <span className="text-center text-[red] font-bold">
            이름을 입력해주세요
          </span>
        )}
        <input
          type="password"
          {...register("password", { required: true, minLength: 8 })}
          placeholder="비밀번호"
        />
        {errors.password && (
          <span className="text-center text-[red] font-bold">
            {errors.password.type === "required" && "비밀번호를 입력해주세요"}
            {errors.password.type === "minLength" &&
              "최소 8글자 이상 입력해주세요"}
          </span>
        )}
        <input
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === password,
          })}
          placeholder="비밀번호 확인"
        />
        {errors.confirmPassword && (
          <span className="text-center text-[red] font-bold">
            {errors.confirmPassword.type === "required" &&
              "비밀번호를 한번 더 입력해주세요"}
            {errors.confirmPassword.type === "validate" &&
              "비밀번호가 일치 하지 않습니다."}
          </span>
        )}
        <input
          {...register("email", { required: true })}
          placeholder="이메일"
        />
        {errors.email && (
          <span className="text-center text-[red] font-bold">
            이메일을 입력해주세요
          </span>
        )}
        <div>
          <label>성별: </label>
          <div>
            <input
              type="radio"
              id="male"
              value="male"
              {...register("gender", { required: true })}
            />
            <label htmlFor="male">남성</label>
          </div>
          <div>
            <input
              type="radio"
              id="female"
              value="female"
              {...register("gender", { required: true })}
            />
            <label htmlFor="female">여성</label>
          </div>
          {errors.gender && (
            <span className="text-center text-[red] font-bold">
              성별을 선택해주세요
            </span>
          )}
        </div>
        <input
          type="date"
          {...register("birth", { required: true })}
          placeholder="생년월일"
        />
        {errors.birth && (
          <span className="text-center text-[red] font-bold">
            생일을 선택해주세요
          </span>
        )}
        <input type="file" {...register("profileImg")} placeholder="사진" />
        <button>회원가입</button>
      </form>
    </div>
  );
}

export default Register;
