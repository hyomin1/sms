import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../../api";

interface IAddInform {
  email: string;
  gender: "male" | "female";
  birth: Date;
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
      setUserId(params.get("userId") || "");
    }
  }, [isNew, navigate, params]);

  const completeForm = async (data: IAddInform) => {
    const { email, gender, birth } = data;
    const res = await axiosApi.post("/auth/addInform", {
      userId,
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
    <div>
      <form onSubmit={handleSubmit(completeForm)}>
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
        <button>제출 완료</button>
      </form>
    </div>
  );
}

export default SocialLogin;
