import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "../features/groupSlice";
import usersReducer from "../features/usersSlice";
import idReducer from "../features/idSlice";

export const store = configureStore({
  reducer: {
    group: groupReducer,
    users: usersReducer,
    id: idReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
