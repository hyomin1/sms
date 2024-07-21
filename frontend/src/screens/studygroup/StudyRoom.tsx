import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosApi from "../../api";
import { IStudyGroup } from "../../interfaces/studygroup";
import { ApplicantUsers } from "../../interfaces/users";

function StudyRoom() {
  const params = useParams();
  const { groupId } = params;
  const [group, setGroup] = useState<IStudyGroup>();
  const [users, setUsers] = useState<ApplicantUsers>();
  const fetchStudy = async () => {
    const res = await axiosApi.get(`/studyGroup/${groupId}`);
    setGroup(res.data.group);
    const res2 = await axiosApi.post("/auth/users", {
      memberIds: res.data.group.members,
    });
    setUsers(res2.data.users);
  };
  useEffect(() => {
    fetchStudy();
  }, []);
  return (
    <div className="flex flex-col items-center">
      <span>{group?.groupName}</span>
      <span>{group?.description}</span>
      <div></div>
    </div>
  );
}

export default StudyRoom;
