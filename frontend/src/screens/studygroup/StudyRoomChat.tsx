import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../../api/api";
import { useAppSelector } from "../../app/hooks";

interface IGRoupId {
  groupId: string;
}
interface IChatHistory {
  senderName: string;
  content: string;
  createdAt: Date;
}

function StudyRoomChat({ groupId }: IGRoupId) {
  const userId = useAppSelector((state) => state.id);
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IChatHistory[]>([]);

  useEffect(() => {
    socketRef.current = io(BASE_URL);
    const socket = socketRef.current;
    socket.on("connect", () => {
      socket.emit("joinRoom", groupId, userId.id);
    });

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });
    socket.on("new_message", (message) => {
      setMessages(message);
    });

    return () => {
      if (socket) {
        socket.emit("leaveRoom", groupId);
        socket.disconnect();
      }
    };
  }, [groupId, userId]);
  console.log(messages);
  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const socket = socketRef.current;
    if (socket) {
      socket.emit("new_message", message, groupId, userId.id);
      setMessage("");
    }
  };

  return (
    <div className="w-[22%] border border-black flex flex-col items-center">
      <span className="font-bold text-lg">채팅</span>
      {messages?.map((message, index) => (
        <div key={index}>
          {message.senderName} :{message.content}
        </div>
      ))}

      <form onSubmit={sendChat} className="border border-black">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="채팅 입력"
        />
        <button>전송</button>
      </form>
    </div>
  );
}

export default StudyRoomChat;
