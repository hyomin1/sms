import React, { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { useAppSelector } from "../../app/hooks";
import { IPost, ISocket } from "../../interfaces/studygroup";
import { calDay } from "../../api/api";
import { FaTrash } from "react-icons/fa";

function StudyRoomNotification({ group, groupId, socket }: ISocket) {
  const [notifications, setNotifications] = useState<IPost[]>([]);
  const id = useAppSelector((state) => state.id);

  useEffect(() => {
    if (socket?.connected) {
      socket.emit("notificationHistory", groupId);

      socket.on("notificationHistory", (history) => {
        setNotifications(history);
      });

      socket.on("newNotification", (history) => {
        setNotifications((prev) => [...prev, history]);
      });

      socket.on("updateNotification", (history) => {
        setNotifications(history);
      });
    }
  }, [socket, groupId]);

  const postNotification = () => {
    const content = prompt("공지사항 입력");
    if (content && socket) {
      socket.emit("newNotification", groupId, content);
    }
  };

  const deleteNotification = (index: number) => {
    const isConfirm = window.confirm("해당 공지사항을 삭제하시겠습니까?");
    if (isConfirm) {
      socket?.emit("deleteNotification", groupId, index);
    }
  };
  return (
    <div className="border-2 border-black rounded-xl w-[44%] h-[200px] p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">공지 사항</span>
        {group?.masterId === id && (
          <FaPencil
            onClick={postNotification}
            className="hover:opacity-60 w-6 h-6"
          />
        )}
      </div>
      <div className="overflow-y-auto h-[80%] ">
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="flex justify-between mb-4">
              <div className="flex flex-col items-start">
                <li className="font-bold">{notification.content}</li>
                <span className="mr-2 text-[0.55rem]">
                  {calDay(notification.createdAt)}
                </span>
              </div>
              {group?.masterId === id && (
                <FaTrash
                  onClick={() => deleteNotification(index)}
                  className="hover:opacity-60"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudyRoomNotification;
