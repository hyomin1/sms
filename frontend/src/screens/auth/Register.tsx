import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../api";
import { Link, useNavigate } from "react-router-dom";

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
    const res = await axiosApi.post("/auth/register", formData, {
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
    <div className="flex flex-col items-center h-screen w-screen">
      <div className="flex flex-col border border-black">
        <span className="font-extrabold text-[#0E4A67] text-3xl">회원가입</span>
        <span className="text-[#37677E] text-xs mt-2 font-semibold">
          이미 계정이 있으신가요?
          <Link to={"/"} className="text-[#FE904B] hover:opacity-60">
            로그인 하러가기
          </Link>
        </span>
      </div>
      <form
        onSubmit={handleSubmit(userRegister)}
        className="flex border border-black"
      >
        <div className="w-[50%]">
          <div className="flex flex-col">
            <label
              htmlFor="userId"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              아이디
            </label>

            <input
              id="userId"
              className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("userId", { required: true, minLength: 6 })}
            />
            {errors.userId && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                {errors.userId.type === "required" && "아이디를 입력해주세요"}
                {errors.userId.type === "minLength" &&
                  "최소 6글자 이상 입력해주세요"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              이름
            </label>

            <input
              id="username"
              className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                이름을 입력해주세요
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                {errors.password.type === "required" &&
                  "비밀번호를 입력해주세요"}
                {errors.password.type === "minLength" &&
                  "최소 8글자 이상 입력해주세요"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              비밀번호 확인
            </label>

            <input
              id="confirmPassword"
              type="password"
              className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === password,
              })}
            />
            {errors.confirmPassword && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                {errors.confirmPassword.type === "required" &&
                  "비밀번호를 한번 더 입력해주세요"}
                {errors.confirmPassword.type === "validate" &&
                  "비밀번호가 일치 하지 않습니다."}
              </span>
            )}
          </div>
        </div>
        <div className="w-[50%]">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              이메일
            </label>

            <input
              id="email"
              {...register("email", { required: true })}
              className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                이메일을 입력해주세요
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="birth"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              생년월일
            </label>

            <input
              id="birth"
              type="date"
              className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("birth", { required: true })}
            />
            {errors.birth && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                생일을 선택해주세요
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              성별
            </label>
            <div>
              <input
                type="radio"
                id="male"
                value="male"
                {...register("gender", { required: true })}
              />
              <label htmlFor="male">남성</label>

              <input
                type="radio"
                id="female"
                value="female"
                {...register("gender", { required: true })}
              />
              <label htmlFor="female">여성</label>
            </div>

            {errors.gender && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                성별을 선택해주세요
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="profileImg"
              className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
            >
              프로필 이미지
            </label>

            <input
              id="profileImg"
              type="file"
              className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("profileImg")}
              placeholder="사진"
            />
          </div>
        </div>
      </form>
      <button className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[60%] h-12 rounded-sm hover:opacity-60 text-white font-bold text-sm mb-2">
        회원가입
      </button>
    </div>
  );
}

export default Register;
