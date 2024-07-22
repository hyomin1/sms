import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Id {
  id: string;
}

const initialState: Id = {
  id: "",
};

export const idSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setId } = idSlice.actions;

export default idSlice.reducer;
