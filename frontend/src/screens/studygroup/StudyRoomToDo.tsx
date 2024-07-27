import React, { useEffect } from "react";
import { ISocket } from "../../interfaces/studygroup";

function StudyRoomToDo({ groupId, socket }: ISocket) {
  // 스터디 할일 작성
  useEffect(() => {
    if (socket?.connected) {
      socket.emit("todo", groupId);
    }
  }, []);
  return (
    <div className="w-[50%] border border-black flex flex-col items-center">
      <span className="font-bold text-lg">할 일</span>
    </div>
  );
}

export default StudyRoomToDo;
