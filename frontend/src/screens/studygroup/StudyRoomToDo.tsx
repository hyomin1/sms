import React, { useEffect, useState } from "react";
import { ISocket } from "../../interfaces/studygroup";
import { useAppSelector } from "../../app/hooks";
import "react-calendar/dist/Calendar.css";
import StudyCalendar from "./StudyCalendar";

function StudyRoomToDo({ groupId, socket, group }: ISocket) {
  // 스터디 할일 작성

  const id = useAppSelector((state) => state.id);
  useEffect(() => {
    if (socket?.connected) {
      socket.emit("todo", groupId);
    }
  }, [socket, groupId]);

  return (
    <div className="w-[50%] border-2 border-black flex flex-col items-center p-2 rounded-xl">
      <div className="w-full flex flex-col h-[100%]">
        <div className="flex justify-between items-center"></div>
        <div className="border border-black">
          <StudyCalendar />
        </div>
      </div>
    </div>
  );
}

export default StudyRoomToDo;
