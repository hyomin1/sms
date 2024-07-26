import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../../api/api";

interface IId {
  groupId: string;
}
interface IChatHistory {
  senderName: string;
  content: string;
  createdAt: Date;
  profile: string;
  userId: string;
}

function StudyRoomChat({ groupId }: IId) {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IChatHistory[]>([]);
  const [myId, setMyId] = useState();

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    if (!socketRef.current?.connected) {
      socketRef.current = io(BASE_URL, {
        auth: {
          token,
        },
      });
      const socket = socketRef.current;
      socket.on("connect", () => {
        socket.emit("joinRoom", groupId);
      });
      console.log(socket);

      socket.on("welcome", (name) => {
        console.log(name);
        alert(name);
      });

      socket.on("chatHistory", (history, userId) => {
        setMessages(history);
        setMyId(userId);
      });

      socket.on("new_message", (message) => {
        setMessages(message);
      });

      socket.on("error", (error) => {
        alert(error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveRoom", groupId);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const socket = socketRef.current;
    if (socket) {
      socket.emit("new_message", message, groupId);
      setMessage("");
    }
  };

  const calDay = (date: Date) => {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();
    const hour = new Date(date).getHours();
    const minute = new Date(date).getMinutes() + 1;
    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  };

  return (
    <div className="w-[22%] border border-black flex flex-col items-center h-[100%]">
      <span className="font-bold text-lg">채팅</span>
      <div className="border border-black flex flex-col overflow-y-auto h-[90%] w-full p-1 bg-yellow-300">
        {messages?.map((message, index) => {
          const isMyMessage = myId === message.userId;
          console.log(isMyMessage);
          return (
            <div
              key={index}
              className={`flex mb-2 ${
                isMyMessage ? "justify-end" : "justify-start"
              }`}
            >
              {!isMyMessage && (
                <img
                  alt="profile"
                  src={message.profile}
                  className="w-8 h-8 rounded-xl mr-2"
                />
              )}
              <div
                className={`text-xs flex flex-col ${
                  isMyMessage ? "items-end" : "items-start"
                }`}
              >
                {!isMyMessage && (
                  <span className="font-bold text-xs mb-1">
                    {message.senderName}
                  </span>
                )}
                <div className="flex items-end">
                  {isMyMessage && (
                    <span className="text-[0.5rem] mr-1">
                      {calDay(message.createdAt)}
                    </span>
                  )}
                  <div
                    className={`border rounded-md p-1 flex ${
                      isMyMessage ? "bg-blue-200" : "bg-white"
                    }`}
                  >
                    <span>{message.content}</span>
                  </div>
                  {!isMyMessage && (
                    <span className="text-[0.5rem] ml-1">
                      {calDay(message.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={sendChat}
        className="border border-black w-full h-[10%] flex"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="채팅 입력"
          className="w-[80%] h-full p-2"
        />
        <button className="border border-black w-[20%] font-bold hover:opacity-60">
          전송
        </button>
      </form>
    </div>
  );
}

export default StudyRoomChat;
