import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../api";

interface IRegister {
  username: string;
  userId: string;
  password: string;
  birth: Date;
  email: string;
  gender: "male" | "female";
  profileImg?: string;
}
function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>();

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
      // } else {
      //    프로필 사진 등록 안한 경우
      //   formData.append("profileImg", "defaultProfileImg.png");
      // }
    }
    await axiosApi.post("/user/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(userRegister)} className="flex flex-col">
        <input
          {...register("userId", { required: true })}
          placeholder="아이디"
        />
        <input
          {...register("username", { required: true })}
          placeholder="이름"
        />
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="비밀번호"
        />
        <input
          {...register("email", { required: true })}
          placeholder="이메일"
        />
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
        </div>
        <input
          type="date"
          {...register("birth", { required: true })}
          placeholder="생년월일"
        />
        <input type="file" {...register("profileImg")} placeholder="사진" />
        <button>회원가입</button>
      </form>
    </div>
  );
}

export default Register;
