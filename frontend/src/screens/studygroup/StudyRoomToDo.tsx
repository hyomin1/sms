import React, { useEffect, useState } from "react";
import { ISocket } from "../../interfaces/studygroup";
import { FaPencil } from "react-icons/fa6";

function StudyRoomToDo({ groupId, socket }: ISocket) {
  // 스터디 할일 작성

  const [notifications, setNotifications] = useState<string[]>([]);
  useEffect(() => {
    if (socket?.connected) {
      socket.emit("todo", groupId);
    }
  }, []);

  const postNotification = () => {
    const input = prompt("공지사항 입력");
    if (input) {
      setNotifications((prev) => [...prev, input]);
      // todo 모델 만들기
    }
  };
  return (
    <div className="w-[50%] border-2 border-black flex flex-col items-center p-4 rounded-lg">
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">공지 사항</span>
          <FaPencil
            onClick={postNotification}
            className="hover:opacity-60 w-8 h-8"
          />
        </div>
        {notifications.map((notification, index) => (
          <ul key={index}>
            <li>{notification}</li>
          </ul>
        ))}
      </div>
      <div>달력</div>
    </div>
  );
}

export default StudyRoomToDo;
