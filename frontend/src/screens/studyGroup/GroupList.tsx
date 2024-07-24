import React, { useEffect, useState } from "react";
import axiosApi from "../../axios";
import GroupListComponent from "../../components/GroupListComponent";
import { IStudyGroup } from "../../interfaces/studygroup";
import { useAppDispatch } from "../../app/hooks";
import { setId } from "../../features/id/idSlice";

function GroupList() {
  const [createdStudyGroups, setCreatedStudyGroups] = useState<IStudyGroup[]>();
  const [joinedStudyGroups, setJoinedStudyGroups] = useState<IStudyGroup[]>();

  const dispatch = useAppDispatch();

  const getStudyGroup = async () => {
    const res = await axiosApi.get("/studyGroup");
    dispatch(setId(res.data.id));

    setCreatedStudyGroups(res.data.createdStudyGroups);
    setJoinedStudyGroups(res.data.joinedStudyGroups);
  };
  useEffect(() => {
    getStudyGroup();
  }, []);

  return (
    <div className="flex justify-between h-screen p-4">
      <div className="flex flex-col  w-[48%] items-center">
        <h1 className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-3xl mb-4">
          내가 만든 스터디
        </h1>
        <div className="w-full overflow-y-auto">
          <GroupListComponent
            label="관리"
            studyGroups={createdStudyGroups || []}
          />
        </div>
      </div>
      <div className="flex flex-col  w-[48%] items-center">
        <h1 className="bg-gradient-to-r from-[#EE5757] to-[#FE904B] inline-block text-transparent bg-clip-text font-bold text-3xl mb-4">
          내가 참여한 스터디
        </h1>
        <div className="w-full overflow-y-auto">
          <GroupListComponent
            label="스터디"
            studyGroups={joinedStudyGroups || []}
          />
        </div>
      </div>
    </div>
  );
}

export default GroupList;
