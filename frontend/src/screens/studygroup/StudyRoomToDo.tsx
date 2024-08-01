import React, { useEffect, useState } from "react";
import { ISocket } from "../../interfaces/studygroup";
import { FaPencil } from "react-icons/fa6";
import { useAppSelector } from "../../app/hooks";
import "react-calendar/dist/Calendar.css";
import StudyCalendar from "./StudyCalendar";

function StudyRoomToDo({ groupId, socket, group }: ISocket) {
  // 스터디 할일 작성

  const [notifications, setNotifications] = useState<string[]>([]);
  const id = useAppSelector((state) => state.id);
  useEffect(() => {
    if (socket?.connected) {
      socket.emit("todo", groupId);
    }
  }, [socket, groupId]);

  const postNotification = () => {
    const input = prompt("공지사항 입력");
    if (input) {
      setNotifications((prev) => [...prev, input]);
      // todo 모델 만들기
    }
  };
  return (
    <div className="w-[50%] border-2 border-black flex flex-col items-center p-4 rounded-lg">
      <div className="w-full flex flex-col h-[100%]">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">공지 사항</span>
          {group?.masterId === id && (
            <FaPencil
              onClick={postNotification}
              className="hover:opacity-60 w-6 h-6"
            />
          )}
        </div>
        <div className="border border-black h-[30%] overflow-y-auto">
          {notifications.map((notification, index) => (
            <ul key={index}>
              <li>{notification}</li>
            </ul>
          ))}
        </div>
        <div className="border border-black">
          <StudyCalendar />
        </div>
      </div>
    </div>
  );
}

export default StudyRoomToDo;
