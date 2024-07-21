import React from "react";
import { IStudyGroup } from "../interfaces/studygroup";
import axiosApi from "../api";
import { useNavigate } from "react-router-dom";

interface GroupList {
  studyGroups: IStudyGroup[];
  label: string;
}

function GroupListComponent({ studyGroups, label }: GroupList) {
  const navigate = useNavigate();
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
      navigate(`/study/${group._id}`);
    }
  };

  return (
    <div className="border-2 border-[#207198] rounded-md p-2 w-full overflow-y-auto">
      {studyGroups?.length === 0 ? (
        <span>스터디가 없습니다</span>
      ) : (
        studyGroups?.map((group, index) => (
          <div key={index} className="border border-black mb-2 p-2 rounded-md">
            <div className="flex justify-between">
              <span className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-md">
                {group.groupName}
              </span>
              <span className="font-semibold">
                {group.members.length}/{group.maxCapacity}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-xs">
                  {group.description}
                </span>
                <div className="flex justify-around">
                  <span className="mr-4">{group.region}</span>
                  <span className="mr-4">{group.gender}</span>
                  <span>
                    {group.ageRange.min}세~{group.ageRange.max}세
                  </span>
                </div>
              </div>
              <button
                onClick={() => applyGroup(group)}
                className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] w-[20%] h-6 rounded-sm hover:opacity-60 text-white font-bold text-sm mt-2"
              >
                {label}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupListComponent;
