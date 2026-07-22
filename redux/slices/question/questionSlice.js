import { createSlice } from "@reduxjs/toolkit";

export const initialQuestionQuery = {
  category: "",
  status: "",
  grade: "",
  difficulty: "",
  search: "",
  hint: "",
  explanation: "",
  per_page: "10",
  page: 1,
  sort: "desc",
};

const initialState = {
  query: initialQuestionQuery,
  question: {},
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    updateQuestionQuery: (state, action) => {
      state.query = { ...state.query, ...action.payload };
    },

    resetQuestionQuery: (state) => {
      state.query = initialQuestionQuery;
    },

    setQuestion: (state, action) => {
      state.question = action.payload;
    },
  },
});

export const { updateQuestionQuery, resetQuestionQuery, setQuestion } = questionSlice.actions;
export default questionSlice.reducer;
