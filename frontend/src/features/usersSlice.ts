import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicantUsers } from "../interfaces/users";

const initialState: ApplicantUsers[] = [];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<ApplicantUsers[]>) => {
      return action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;
