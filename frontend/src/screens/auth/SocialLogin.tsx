import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../../api";
import InputComponent from "../../components/InputComponent";
import RadioComponent from "../../components/RadioComponent";

interface IAddInform {
  email: string;
  gender: "남성" | "여성";
  birth: Date;
}
interface User {
  userId: string;
  username: string;
  profileImg: string;
}
function SocialLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(true);
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IAddInform>();

  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<User>({
    userId: "",
    username: "",
    profileImg: "",
  });

  useEffect(() => {
    setIsNew(params.get("isNew") === "true");
  }, [location.search, params]);

  useEffect(() => {
    if (!isNew) {
      const state = params.get("state") || "";
      const { access_token } = JSON.parse(decodeURIComponent(state));
      localStorage.setItem("access_token", access_token);
      navigate("/home");
    } else {
      setUser({
        userId: params.get("userId") || "",
        username: params.get("username") || "",
        profileImg: params.get("profileImg") || "",
      });
    }
  }, [isNew, navigate, params]);

  const completeForm = async (data: IAddInform) => {
    const { email, gender, birth } = data;
    const res = await axiosApi.post("/auth/addInform", {
      userId: user.userId,
      username: user.username,
      profileImg: user.profileImg,
      email,
      gender,
      birth,
    });
    if (res.status === 200) {
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-between items-center h-screen">
      <div className="flex items-center justify-center w-[50%] h-[100%]">
        <div className="w-40 h-40 bg-slate-800"></div>
      </div>
      <div className="w-[50%]">
        <div className="flex flex-col">
          <span className="font-extrabold text-[#0E4A67] text-3xl">
            추가 정보 입력
          </span>
        </div>

        <form
          className="flex flex-col mt-8"
          onSubmit={handleSubmit(completeForm)}
        >
          <InputComponent
            id="email"
            label="이메일"
            type="text"
            register={register}
          />
          {errors.email && (
            <span className="text-center text-[red] font-bold">
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

          {errors.gender && (
            <span className="text-center text-[red] font-bold">
              성별을 선택해주세요
            </span>
          )}
          <InputComponent
            id="birth"
            label="생년월일"
            type="date"
            register={register}
          />

          {errors.birth && (
            <span className="text-center text-[red] font-bold">
              생일을 선택해주세요
            </span>
          )}
          <button className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[60%] h-12 rounded-sm hover:opacity-60 text-white font-bold text-sm mt-2">
            제출
          </button>
        </form>
      </div>
    </div>
  );
}

export default SocialLogin;
