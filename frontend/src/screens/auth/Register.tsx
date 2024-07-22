import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import InputComponent from "../../components/InputComponent";
import RadioComponent from "../../components/RadioComponent";

interface IRegister {
  username: string;
  userId: string;
  password: string;
  confirmPassword: string;
  birth: Date;
  email: string;
  gender: "남성" | "여성";
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
    console.log(userId);
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
      setValue("gender", "남성");

      navigate("/");
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen px-4 py-10">
      <div className="flex flex-col w-screen mb-4">
        <span className="font-extrabold text-[#0E4A67] text-3xl">회원가입</span>
        <span className="text-[#37677E] text-xs mt-2 font-semibold">
          이미 계정이 있으신가요?
          <Link to={"/"} className="text-[#FE904B] hover:opacity-60">
            로그인 하러가기
          </Link>
        </span>
      </div>

      <form onSubmit={handleSubmit(userRegister)}>
        <div className="flex w-[100%] border border-black mt-8 justify-between">
          <div className="w-[50%] flex flex-col">
            <InputComponent
              id="userId"
              label="아이디"
              type="text"
              register={register}
            />
            {errors.userId && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                {errors.userId.type === "required" && "아이디를 입력해주세요"}
                {errors.userId.type === "minLength" &&
                  "최소 6글자 이상 입력해주세요"}
              </span>
            )}
            <InputComponent
              id="username"
              label="이름"
              type="text"
              register={register}
            />
            {errors.username && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                이름을 입력해주세요
              </span>
            )}
            <InputComponent
              id="password"
              label="비밀번호"
              type="password"
              register={register}
            />
            {errors.password && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                {errors.password.type === "required" &&
                  "비밀번호를 입력해주세요"}
                {errors.password.type === "minLength" &&
                  "최소 8글자 이상 입력해주세요"}
              </span>
            )}
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
            <InputComponent
              id="email"
              label="이메일"
              type="text"
              register={register}
            />
            {errors.email && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                이메일을 입력해주세요
              </span>
            )}
            <RadioComponent
              id="gender"
              label="성별"
              options={[
                { value: "남성", label: "남성" },
                { value: "여성", label: "여성" },
              ]}
              register={register}
            />
            <InputComponent
              id="birth"
              label="생년월일"
              type="date"
              register={register}
            />
            {errors.birth && (
              <span className="text-center text-[red] font-bold w-[60%] text-sm">
                생일을 선택해주세요
              </span>
            )}
            {errors.gender && (
              <span className="text-center text-[red] font-bold">
                성별을 선택해주세요
              </span>
            )}
            <InputComponent
              id="profileImg"
              type="file"
              label="프로필 이미지"
              register={register}
              required={false}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Register;
