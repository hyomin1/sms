import React, { useEffect, useState } from "react";
import axiosApi from "../../api";
import GroupListComponent from "../../components/GroupListComponent";
import { IStudyGroup } from "../../interfaces/studygroup";

function GroupList() {
  const [createdStudyGroups, setCreatedStudyGroups] = useState<IStudyGroup[]>();
  const [joinedStudyGroups, setJoinedStudyGroups] = useState<IStudyGroup[]>();
  const getStudyGroup = async () => {
    const res = await axiosApi.get("/studyGroup");

    setCreatedStudyGroups(res.data.createdStudyGroups);
    setJoinedStudyGroups(res.data.joinedStudyGroups);
  };
  useEffect(() => {
    getStudyGroup();
  }, []);
  return (
    <div className="flex justify-between h-screen">
      <div className="flex flex-col border border-black w-[50%] items-center">
        <h1>내가 만든 스터디</h1>
        <div>
          <span>스터디 목록</span>
          <GroupListComponent studyGroups={createdStudyGroups || []} />
        </div>
      </div>
      <div className="flex flex-col border border-black w-[50%] items-center">
        내가 참여한 스터디
        <div>
          <span>스터디 목록</span>
          <GroupListComponent studyGroups={joinedStudyGroups || []} />
        </div>
      </div>
    </div>
  );
}

export default GroupList;
