import { AppDispatch } from "../app/store";
import axiosApi from "../axios";
import { setGroup } from "../features/groupSlice";
import { setId } from "../features/idSlice";
import { setUsers } from "../features/usersSlice";

export const BASE_URL = "http://localhost:8080";

export const fetchStudy = async (groupId: string, dispatch: AppDispatch) => {
  const res = await axiosApi.get(`/studyGroup/${groupId}`);

  dispatch(setGroup(res.data.group));
  dispatch(setId(res.data.id));
  const res2 = await axiosApi.post("/auth/users", {
    memberIds: res.data.group.members,
  });
  dispatch(setUsers(res2.data.users));
};

export const calDay = (date: Date) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  const hour = new Date(date).getHours();
  const minute = new Date(date).getMinutes() + 1;
  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
};
