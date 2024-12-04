import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: { category: "", status: "", search: "", per_page: "10", page: 1, sort: "desc" },
  question: {},
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    updateQuestionQuery: (state, action) => {
      state.query = { ...state.query, ...action.payload };
    },

    setQuestion: (state, action) => {
      state.question = action.payload;
    },
  },
});

export const { updateQuestionQuery, setQuestion } = questionSlice.actions;
export default questionSlice.reducer;
