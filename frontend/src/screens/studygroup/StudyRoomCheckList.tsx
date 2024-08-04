import React, { useEffect, useState } from "react";
import { IPost, ISocket } from "../../interfaces/studygroup";
import { FaCheckCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

function StudyRoomCheckList({ group, groupId, socket }: ISocket) {
  const [checkLists, setCheckLists] = useState<IPost[]>([]);
  useEffect(() => {
    if (socket?.connected) {
      // 체크리스트 정보 요청
      socket.emit("checkListHistory", groupId);

      socket.on("checkListHistory", (checkList) => {
        setCheckLists(checkList);
      });

      socket.on("newCheckList", (checkList) => {
        setCheckLists((prev) => [...prev, checkList]);
      });
    }
  }, [socket, groupId]);

  const postCheckList = () => {
    const content = prompt("체크리스트 입력");
    if (content && socket) {
      socket.emit("newCheckList", groupId, content);
    }
  };

  const deleteCheckList = (index: number) => {
    const isConfirm = window.confirm("해당 체크리스트를 삭제하시겠습니까?");
    if (isConfirm) {
      socket?.emit("deleteCheckList", groupId, index);
    }
  };

  return (
    <div className="border-2 border-black rounded-xl w-[44%] p-2 h-[200px]">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold mb-2">체크 리스트</span>
        <FaPencil
          onClick={postCheckList}
          className="hover:opacity-60 w-6 h-6"
        />
      </div>
      {checkLists.map((checkList, index) => (
        <div key={index} className="flex items-center">
          <FaCheckCircle className="mr-2" />
          <span>{checkList.content}</span>
        </div>
      ))}
    </div>
  );
}

export default StudyRoomCheckList;
