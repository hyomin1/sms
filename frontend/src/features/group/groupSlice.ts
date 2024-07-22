import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStudyGroup } from "../../interfaces/studygroup";

const initialState: IStudyGroup = {
  _id: "",
  masterId: "",
  groupName: "",
  description: "",
  gender: "성별 무관",
  maxCapacity: 0,
  ageRange: {
    min: 0,
    max: 0,
  },
  category: "",
  region: "",
  isOnline: false,
  applicants: [],
  members: [],
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<IStudyGroup>) => {
      return action.payload;
    },
  },
});

export const { setGroup } = groupSlice.actions;

export default groupSlice.reducer;
