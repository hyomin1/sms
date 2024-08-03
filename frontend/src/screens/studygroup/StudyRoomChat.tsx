import React, { useEffect, useState } from "react";
import axiosApi from "../../axios";
import { useNavigate } from "react-router-dom";
import { ISocket } from "../../interfaces/studygroup";
import { calDay } from "../../api/api";

interface IChatHistory {
  senderName: string;
  content: string;
  createdAt: Date;
  profile: string;
  userId: string;
}

function StudyRoomChat({ groupId, socket }: ISocket) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IChatHistory[]>([]);
  const [myId, setMyId] = useState();

  const navigate = useNavigate();

  const handleMessage = (message: IChatHistory) => {
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (socket?.connected) {
      socket.emit("joinRoom", groupId);

      socket.on("welcome", handleMessage);

      socket.on("chatHistory", (history, userId) => {
        setMessages(history);
        setMyId(userId);
      });

      socket.on("new_message", handleMessage);

      socket.on("error", (error) => {
        alert(error);
      });
    }
    return () => {
      if (socket) {
        socket.emit("leaveRoom", groupId);
        socket.off("welcome", handleMessage);
        socket.off("new_message", handleMessage);
      }
    };
  }, [socket, groupId]);

  const getProfile = async (userId: string) => {
    const res = await axiosApi.get(`/auth/profile/${userId}`);
    console.log(res.data);
    navigate("/profile", {
      state: {
        user: res.data.user,
      },
    });
  };

  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (socket) {
      socket.emit("new_message", message, groupId);
      setMessage("");
    }
  };

  return (
    <div className="w-[22%] border-2 border-black rounded-xl flex flex-col items-center h-[100%]">
      <span className="font-bold text-lg">채팅</span>
      <div className="border border-black flex flex-col overflow-y-auto h-[90%] w-full p-1 bg-yellow-300">
        {messages?.map((message, index) => {
          const isMyMessage = myId === message.userId;
          const isNotification = message.senderName === "notification";
          return (
            <div
              key={index}
              className={`flex mb-2 ${
                isNotification
                  ? "justify-center"
                  : isMyMessage
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {!isMyMessage && !isNotification && (
                <img
                  onClick={() => getProfile(message.userId)}
                  alt="profile"
                  src={message.profile}
                  className="w-8 h-8 rounded-xl mr-2 hover:opacity-60"
                />
              )}
              <div
                className={`text-xs flex flex-col ${
                  isNotification
                    ? "items-center"
                    : isMyMessage
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {!isMyMessage && !isNotification && (
                  <span className="font-bold text-xs mb-1">
                    {message.senderName}
                  </span>
                )}
                <div className="flex items-end">
                  {isMyMessage && !isNotification && (
                    <span className="text-[0.5rem] mr-1">
                      {calDay(message.createdAt)}
                    </span>
                  )}
                  <div
                    className={`border rounded-md p-1 flex ${
                      isNotification
                        ? "bg-gray-200"
                        : isMyMessage
                        ? "bg-blue-200"
                        : "bg-white"
                    }`}
                  >
                    <span>{message.content}</span>
                  </div>
                  {!isMyMessage && !isNotification && (
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

      <form onSubmit={sendChat} className="w-full h-[10%] flex rounded-xl">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="채팅 입력"
          className="w-[80%] h-full p-2 rounded-xl text-sm"
        />
        <button className="border border-black text-sm rounded-md w-[20%] font-bold hover:opacity-60">
          전송
        </button>
      </form>
    </div>
  );
}

export default StudyRoomChat;
