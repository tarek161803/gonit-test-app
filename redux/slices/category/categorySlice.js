import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  grade: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    changeGrade: (state, action) => {
      state.grade = action.payload;
    },
  },
});

export const { changeGrade } = categorySlice.actions;
export default categorySlice.reducer;
