import React from "react";
import { IStudyGroup } from "../interfaces/studygroup";

interface GroupList {
  studyGroups: IStudyGroup[];
}

function GroupListComponent({ studyGroups }: GroupList) {
  return (
    <div>
      {studyGroups?.length === 0 ? (
        <span>참여한 스터디가 없습니다</span>
      ) : (
        studyGroups?.map((group, index) => (
          <div key={index}>
            <span>{group.groupName}</span>
            <span>
              {group.members.length}/{group.maxCapacity}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupListComponent;
