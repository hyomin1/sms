import React, { useState } from "react";
import SelectBoxComponent from "../../components/SelectBoxComponent";
import axiosApi from "../../api";
import { IStudyGroup } from "../../interfaces/studygroup";
import GroupListComponent from "../../components/GroupListComponent";

function SearchGroup() {
  const genderOptions = ["남", "여", "성별무관"];
  const onlineOptions = ["온라인", "오프라인"];
  const regionOptions = [
    "서울특별시",
    "부산광역시",
    "대구광역시",
    "인천광역시",
    "광주광역시",
    "대전광역시",
    "울산광역시",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주도",
  ];
  const [gender, setGender] = useState<string>();
  const [isOnline, setIsOnline] = useState<string>();
  const [region, setRegion] = useState<string>();
  const [category, setCategory] = useState<string>();

  const [groups, setGroups] = useState<IStudyGroup[]>();
  const searchGroup = async () => {
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
      case "남":
        setGender("male");
        break;
      case "여":
        setGender("female");
        break;
      default:
        setGender("any");
        break;
    }
  };
  const handleOnlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "온라인") {
      setIsOnline("true");
    } else if (value === "오프라인") setIsOnline("false");
    else setIsOnline("");
  };
  console.log(category);
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };
  return (
    <div className="flex flex-col">
      <div className="flex">
        <input
          placeholder="카테고리 입력"
          onChange={handleCategoryChange}
          required
          value={category}
        />
        <button onClick={searchGroup}>검색</button>
      </div>
      <div className="flex">
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
        <GroupListComponent studyGroups={groups || []} />
      </div>
    </div>
  );
}

export default SearchGroup;
