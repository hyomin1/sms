import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axiosApi from "../../axios";
import { fetchStudy } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ISocket } from "../../interfaces/studygroup";

function StudyRoomUsers({ groupId, socket }: ISocket) {
  const group = useAppSelector((state) => state.group);
  const users = useAppSelector((state) => state.users);
  const id = useAppSelector((state) => state.id);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const manageGroup = async () => {
    const res = await axiosApi.post("/studyGroup/manage", {
      groupId: group._id,
    });
    if (res.status === 200) {
      navigate("/manageUser", {
        state: { users: res.data.users, groupId: group._id },
      });
    }
  };

  const getProfile = async (userId: string) => {
    const res = await axiosApi.get(`/auth/profile/${userId}`);
    console.log(res.data);
    navigate("/profile", {
      state: {
        user: res.data.user,
      },
    });
  };

  const deleteMember = async (userId: string) => {
    const isConfirmed = window.confirm(
      "정말로 이 사용자를 그룹에서 제거하시겠습니까?"
    );
    if (isConfirmed && socket) {
      socket.emit("deleteMember", groupId, userId);
      socket.on("success_quitGroup", () => {
        console.log("멤버 추방", id, userId);
        if (id === userId) {
          navigate("/home");
        }
      });
    }
  };

  useEffect(() => {
    if (socket?.connected) {
      socket.on("success_quitGroup", () => {
        fetchStudy(group._id, dispatch);
      });
      socket.on("success_deleteMember", (userId) => {
        if (id === userId) {
          navigate("/home");
        }
      });
      if (id && groupId) {
        socket.emit("check_member", id, groupId);
        socket.on("check_member", (isMember) => {
          if (!isMember) {
            alert("그룹의 멤버가 아닙니다.");
            navigate("/home");
          }
        });
      }
    }
  }, [socket, dispatch, group, id, navigate, groupId]);

  // 그룹 탈퇴랑 사용자 제거 로직 비슷함 웹소켓으로 엮어서 로직 수정하기
  const quitGroup = () => {
    const isConfirmed = window.confirm("정말로 이 그룹에서 나가시겠습니까?");
    if (isConfirmed && socket) {
      if (socket) {
        socket.emit("quitGroup", groupId);
        socket.on("success_quitGroup", () => {
          navigate("/home");
        });
      }
      //navigate("/home");
    }
  };

  return (
    <div className="border-2 border-black w-[22%] flex flex-col items-center rounded-xl">
      <div className="flex justify-between items-center w-full p-2">
        <span className="font-bold text-lg">멤버 정보</span>
        {group.masterId === id ? (
          <button
            className="border border-black p-1 rounded-md hover:opacity-60"
            onClick={manageGroup}
          >
            그룹 관리
          </button>
        ) : (
          <button
            onClick={quitGroup}
            className="border border-black p-1 rounded-md hover:opacity-60"
          >
            그룹 나가기
          </button>
        )}
      </div>
      <div className="w-full overflow-y-auto">
        {users?.map((user, index) => (
          <div key={index} className="w-full px-1 mb-2">
            <div className="flex items-start border border-black p-2 rounded-lg">
              <img
                className="w-12 h-12 rounded-xl"
                alt="profile"
                src={user.profileImg}
              />
              <div>
                <div className="mx-2 flex justify-between items-center w-full">
                  <span>{user.username}</span>
                  <span className="text-sm">{user.gender}</span>
                  <span className="text-sm">
                    {new Date().getFullYear() -
                      new Date(user.birth).getFullYear()}
                    세
                  </span>
                  <span className="font-bold text-xs">
                    {group.masterId === user._id ? "그룹장" : "멤버"}
                  </span>
                </div>
                <div className="flex justify-between mx-2 w-full text-sm mt-2">
                  <button
                    onClick={() => getProfile(user._id)}
                    className="border border-black p-1 rounded-md hover:opacity-60"
                  >
                    정보 보기
                  </button>
                  {group?.masterId !== user._id && group.masterId === id && (
                    <button
                      className="border border-black p-1 rounded-md hover:opacity-60"
                      onClick={() => deleteMember(user._id)}
                    >
                      멤버 추방
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyRoomUsers;
