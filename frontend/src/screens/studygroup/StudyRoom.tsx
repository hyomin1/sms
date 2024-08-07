import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import StudyRoomUsers from "./StudyRoomUsers";
import { BASE_URL, fetchStudy } from "../../api/api";
import StudyRoomChat from "./StudyRoomChat";
import { io, Socket } from "socket.io-client";
import StudyRoomToDo from "./StudyRoomToDo";
import StudyRoomNotification from "./StudyRoomNotification";
import StudyRoomCheckList from "./StudyRoomCheckList";
function StudyRoom() {
  const params = useParams();
  const { groupId } = params;

  const group = useAppSelector((state) => state.group);
  const dispatch = useAppDispatch();

  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const newSocket = io(BASE_URL, {
      auth: {
        token: localStorage.getItem("access_token"),
      },
    });
    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (groupId) {
      fetchStudy(groupId, dispatch);
    }
  }, [groupId, dispatch]);

  return (
    <div className="flex flex-col items-center p-2 h-screen">
      <div className="flex flex-col items-center h-[20%]">
        <span className="mb-2 bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-4xl">
          {group?.groupName}
        </span>
        <span className="font-semibold text-sm mb-2">{group?.description}</span>
      </div>
      <div className="flex flex-col h-screen overflow-y-auto">
        <div className="flex justify-between mb-4">
          <StudyRoomNotification
            group={group}
            groupId={groupId || ""}
            socket={socket}
          />
          <StudyRoomCheckList
            group={group}
            groupId={groupId || ""}
            socket={socket}
          />
        </div>
        <div className="flex justify-between h-[88%]">
          {socket && <StudyRoomUsers groupId={groupId || ""} socket={socket} />}
          {socket && (
            <StudyRoomToDo
              groupId={groupId || ""}
              group={group}
              socket={socket}
            />
          )}
          {socket && <StudyRoomChat groupId={groupId || ""} socket={socket} />}
        </div>
      </div>
    </div>
  );
}

export default StudyRoom;
