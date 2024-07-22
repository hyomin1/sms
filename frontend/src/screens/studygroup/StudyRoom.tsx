import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import StudyRoomUsers from "./StudyRoomUsers";
import { fetchStudy } from "../../api/api";
function StudyRoom() {
  const params = useParams();
  const { groupId } = params;

  const group = useAppSelector((state) => state.group);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (groupId) {
      fetchStudy(groupId, dispatch);
    }
  }, [groupId, dispatch]);

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex flex-col items-center">
        <span className="mb-2 bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-4xl">
          {group?.groupName}
        </span>
        <span className="font-semibold text-sm mb-2">{group?.description}</span>
      </div>
      <div className="flex justify-between w-full">
        <StudyRoomUsers />
        <div className="w-[50%] border border-black flex flex-col items-center">
          <span className="font-bold text-lg">할 일</span>
        </div>
        <div className="w-[22%] border border-black flex flex-col items-center">
          <span className="font-bold text-lg">채팅</span>
        </div>
      </div>
    </div>
  );
}

export default StudyRoom;
