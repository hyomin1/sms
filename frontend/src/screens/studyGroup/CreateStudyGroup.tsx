import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../api";
import { useNavigate } from "react-router-dom";
import InputComponent from "../../components/InputComponent";
import RadioComponent from "../../components/RadioComponent";

interface IStudyGroup {
  groupName: string;
  region: string;
  gender: "male" | "female" | "any";
  maxCapacity: number;
  minAge: number;
  maxAge: number;
  isOnline: boolean;
  category: string;
}

function CreateStudyGroup() {
  const { register, handleSubmit } = useForm<IStudyGroup>();
  const navigate = useNavigate();

  const createGroup = async (data: IStudyGroup) => {
    const {
      groupName,
      region,
      gender,
      maxCapacity,
      isOnline,
      minAge,
      maxAge,
      category,
    } = data;

    const res = await axiosApi.post("/studyGroup/create", {
      groupName,
      region,
      gender,
      maxCapacity,
      isOnline,
      minAge,
      maxAge,
      category,
    });
    if (res.status === 200) {
      navigate("/home");
    }
  };
  return (
    <div>
      <div className="flex justify-center w-[100%]">
        <form
          onSubmit={handleSubmit(createGroup)}
          className="flex flex-col w-[70%] items-center"
        >
          <InputComponent
            id="groupName"
            label="스터디 이름"
            type="text"
            register={register}
          />
          <InputComponent
            id="region"
            label="스터디 장소"
            type="text"
            register={register}
          />
          <InputComponent
            id="category"
            label="스터디 주제"
            type="text"
            register={register}
          />
          <RadioComponent
            label="성별"
            id="gender"
            options={[
              { value: "male", label: "남성" },
              { value: "female", label: "여성" },
              { value: "any", label: "성별 무관" },
            ]}
            register={register}
          />

          <RadioComponent
            label="온/오프라인"
            id="isOnline"
            options={[
              { value: "true", label: "온라인" },
              { value: "false", label: "오프라인" },
            ]}
            register={register}
          />

          <InputComponent
            id="maxCapacity"
            label="최대 인원"
            type="number"
            register={register}
          />
          <InputComponent
            id="minAge"
            label="최소 나이"
            type="number"
            register={register}
          />
          <InputComponent
            id="maxAge"
            label="최대 나이"
            type="number"
            register={register}
          />

          <button className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[60%] h-12 rounded-md hover:opacity-60 text-white font-bold text-sm mb-2">
            생성
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateStudyGroup;
