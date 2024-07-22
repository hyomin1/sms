import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "../features/group/groupSlice";
import usersReducer from "../features/users/usersSlice";
import idReducer from "../features/id/idSlice";

export const store = configureStore({
  reducer: {
    group: groupReducer,
    users: usersReducer,
    id: idReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
