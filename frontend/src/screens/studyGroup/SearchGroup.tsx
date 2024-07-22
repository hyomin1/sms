import React, { useState } from "react";
import SelectBoxComponent from "../../components/SelectBoxComponent";
import axiosApi from "../../axios";
import { IStudyGroup } from "../../interfaces/studygroup";
import GroupListComponent from "../../components/GroupListComponent";
import { regionOptions } from "../../constants/regions";
import { IoSearchOutline } from "react-icons/io5";

function SearchGroup() {
  const genderOptions = ["남성", "여성", "성별 무관"];
  const onlineOptions = ["온라인", "오프라인"];

  const [gender, setGender] = useState<string>();
  const [isOnline, setIsOnline] = useState<string>();
  const [region, setRegion] = useState<string>();
  const [category, setCategory] = useState<string>();

  const [groups, setGroups] = useState<IStudyGroup[]>();
  const searchGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axiosApi.post("/studyGroup/search", {
      gender,
      isOnline,
      region,
      category,
    });
    setGroups(res.data.groups);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    switch (value) {
      case "남성":
        setGender("남성");
        break;
      case "여성":
        setGender("여성");
        break;
      case "성별 무관":
        setGender("성별 무관");
        break;
      default:
        setGender(undefined);
        break;
    }
  };

  const handleOnlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "온라인") {
      setIsOnline("true");
    } else if (value === "오프라인") setIsOnline("false");
    else setIsOnline(undefined);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
    if (e.target.value === "선택안함") setRegion(undefined);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <form
        onSubmit={searchGroup}
        className="flex w-[50%] mt-16 border-2 border-[#207198] rounded-xl p-3"
      >
        <input
          className="w-full focus:outline-none"
          placeholder="카테고리 입력"
          onChange={handleCategoryChange}
          required
          value={category}
        />
        <button type="submit">
          <IoSearchOutline className="w-6 h-6 hover:opacity-60" />
        </button>
      </form>
      <div className="flex w-[50%]">
        <SelectBoxComponent
          label="성별"
          options={genderOptions}
          onChange={handleGenderChange}
        />
        <SelectBoxComponent
          label="온/오프라인"
          options={onlineOptions}
          onChange={handleOnlineChange}
        />
        <SelectBoxComponent
          label="지역"
          options={regionOptions}
          onChange={handleRegionChange}
        />
      </div>
      <div className="w-[50%] overflow-y-auto">
        <GroupListComponent label="신청" studyGroups={groups || []} />
      </div>
    </div>
  );
}

export default SearchGroup;
