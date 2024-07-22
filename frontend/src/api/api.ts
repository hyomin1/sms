import { AppDispatch } from "../app/store";
import axiosApi from "../axios";
import { setGroup } from "../features/group/groupSlice";
import { setId } from "../features/id/idSlice";
import { setUsers } from "../features/users/usersSlice";

export const fetchStudy = async (groupId: string, dispatch: AppDispatch) => {
  const res = await axiosApi.get(`/studyGroup/${groupId}`);

  dispatch(setGroup(res.data.group));
  dispatch(setId(res.data.id));
  const res2 = await axiosApi.post("/auth/users", {
    memberIds: res.data.group.members,
  });
  dispatch(setUsers(res2.data.users));
};
