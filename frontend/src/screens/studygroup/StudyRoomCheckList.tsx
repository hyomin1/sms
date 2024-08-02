import React from "react";
import { ISocket } from "../../interfaces/studygroup";

function StudyRoomCheckList({ group, groupId, socket }: ISocket) {
  return (
    <div className="border-2 border-black rounded-xl w-[44%] p-2 h-[200px]">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">체크 리스트</span>
      </div>
    </div>
  );
}

export default StudyRoomCheckList;
