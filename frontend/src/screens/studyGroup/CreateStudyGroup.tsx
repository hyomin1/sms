import React from "react";
import { useForm } from "react-hook-form";
import axiosApi from "../../api";

interface IStudyGroup {
  groupName: string;
  region: string;
  gender: "male" | "female" | "any";
  maxCapacity: number;
  minAge: number;
  maxAge: number;
  isOnline: boolean;
}

function CreateStudyGroup() {
  const { register, handleSubmit } = useForm<IStudyGroup>();
  const createGroup = async (data: IStudyGroup) => {
    const { groupName, region, gender, maxCapacity, isOnline } = data;
    console.log(data);
    const res = await axiosApi.post("/studyGroup/create", {
      groupName,
      region,
      gender,
      maxCapacity,
      isOnline,
    });
    console.log(res.data);
  };
  return (
    <div>
      <div>스터디 생성</div>
      <div>
        <form onSubmit={handleSubmit(createGroup)} className="flex flex-col">
          <label
            htmlFor="groupName"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            스터디 이름
          </label>

          <input
            className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
            id="groupName"
            {...register("groupName")}
          />
          <label
            htmlFor="region"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            스터디 장소
          </label>
          <input
            className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
            id="region"
            {...register("region")}
          />
          <label
            htmlFor="region"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            성별
          </label>
          <div className="flex justify-between w-[60%] border-2 px-2 py-2 mb-2 rounded-md border-[#6FCF97]">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                value="male"
                {...register("gender", { required: true })}
              />
              <label
                htmlFor="male"
                className="font-semibold text-sm ml-1 text-[#207198]"
              >
                남성
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                value="female"
                {...register("gender", { required: true })}
              />
              <label
                htmlFor="female"
                className="font-semibold text-sm ml-1 text-[#207198]"
              >
                여성
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="any"
                value="any"
                {...register("gender", { required: true })}
              />
              <label
                htmlFor="any"
                className="font-semibold text-sm ml-1 text-[#207198]"
              >
                성별 무관
              </label>
            </div>
          </div>
          <label
            htmlFor="maxCapacity"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            최대 인원
          </label>
          <input
            type="number"
            className="w-[60%] border-2 border-[#6FCF97] px-2 py-2 mb-2 rounded-md focus:outline-none focus:border-blue-500"
            id="maxCapacity"
            {...register("maxCapacity")}
          />
          <label
            htmlFor="maxCapacity"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            온라인/오프라인
          </label>
          <div className="flex justify-between w-[60%] border-2 px-2 py-2 mb-2 rounded-md border-[#6FCF97]">
            <div className="flex items-center">
              <input
                type="radio"
                id="online"
                value={1}
                {...register("isOnline", { required: true })}
              />
              <label
                htmlFor="online"
                className="font-semibold text-sm ml-1 text-[#207198]"
              >
                온라인
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="offline"
                value={0}
                {...register("isOnline", { required: true })}
              />
              <label
                htmlFor="offline"
                className="font-semibold text-sm ml-1 text-[#207198]"
              >
                오프라인
              </label>
            </div>
          </div>
          <label
            htmlFor="minAge"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            최소나이
          </label>

          <label
            htmlFor="maxAge"
            className="text-xs text-[#207198] font-bold mb-1 ml-1 hover:opacity-60"
          >
            최대나이
          </label>

          <button className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[60%] h-12 rounded-sm hover:opacity-60 text-white font-bold text-sm mb-2">
            생성
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateStudyGroup;
