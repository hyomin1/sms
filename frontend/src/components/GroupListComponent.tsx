import React from "react";
import { IStudyGroup } from "../interfaces/studygroup";
import axiosApi from "../axios";
import { useNavigate } from "react-router-dom";

interface GroupList {
  studyGroups: IStudyGroup[];
  label: string;
}

function GroupListComponent({ studyGroups, label }: GroupList) {
  const navigate = useNavigate();

  const goStudy = (groupId: string) => {
    navigate(`/study/${groupId}`);
  };
  const applyGroup = async (group: IStudyGroup) => {
    if (label === "신청") {
      const res = await axiosApi.post("/studyGroup/join", {
        groupId: group._id,
      });
      alert(res.data.message);
    } else if (label === "관리") {
      const res = await axiosApi.post("/studyGroup/manage", {
        groupId: group._id,
      });
      if (res.status === 200) {
        navigate("/manageUser", {
          state: { users: res.data.users, groupId: group._id },
        });
      }
    } else if (label === "스터디") {
      goStudy(group._id);
    }
  };

  return (
    <div className="border-2 border-[#207198] rounded-md p-2 w-full ">
      {studyGroups?.length === 0 ? (
        <div className="flex justify-center items-center">
          <span className="font-bold text-sm">스터디가 존재하지 않습니다</span>
        </div>
      ) : (
        studyGroups?.map((group, index) => (
          <div key={index} className="border border-black mb-2 p-2 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-md">
                {group.groupName}
              </span>
              <span className="font-semibold">
                {group.members.length}/{group.maxCapacity}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-xs">
                    {group.description}
                  </span>
                  <span className="font-semibold text-xs">
                    {group.isOnline === true ? "온라인" : "오프라인"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex justify-around font-semibold">
                    <span className="mr-1 ">{group.region}</span>
                    <span className="mr-1">{group.gender}</span>
                    <span>
                      {group.ageRange.min}세~{group.ageRange.max}세
                    </span>
                  </div>
                  <button
                    onClick={() => applyGroup(group)}
                    className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[20%] h-6 rounded-sm hover:opacity-60 text-white font-bold text-sm mt-2"
                  >
                    {label}
                  </button>
                  {label === "관리" && (
                    <button
                      onClick={() => goStudy(group._id)}
                      className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[20%] h-6 rounded-sm hover:opacity-60 text-white font-bold text-sm mt-2"
                    >
                      스터디
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupListComponent;
