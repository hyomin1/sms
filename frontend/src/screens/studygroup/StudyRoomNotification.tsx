import React, { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { useAppSelector } from "../../app/hooks";
import { ISocket } from "../../interfaces/studygroup";

function StudyRoomNotification({ group, groupId, socket }: ISocket) {
  const [notifications, setNotifications] = useState<string[]>([]);
  const id = useAppSelector((state) => state.id);

  useEffect(() => {
    if (socket?.connected) {
      socket.emit("notificationHistory", groupId);
      socket.on("notificationHistory", (history) => {
        setNotifications(history);
      });
    }
  }, [socket, groupId]);

  const postNotification = () => {
    const input = prompt("공지사항 입력");
    if (input && socket) {
      socket.emit("notification", input);

      setNotifications((prev) => [...prev, input]);
      // todo 모델 만들기
    }
  };
  return (
    <div className="border-2 border-black rounded-xl w-[44%] h-[200px] p-2">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">공지 사항</span>
        {group?.masterId === id && (
          <FaPencil
            onClick={postNotification}
            className="hover:opacity-60 w-6 h-6"
          />
        )}
      </div>
      <div className="">
        {notifications.map((notification, index) => (
          <ul key={index}>
            <li>{notification}</li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default StudyRoomNotification;
