import { apiSlice } from "../api/apiSlice";

const questionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: (query) => `questions${query}`,
    }),

    getQuestionById: builder.query({
      query: (id) => `questions/${id}`,
    }),

    updateQuestion: builder.mutation({
      query: ({ id, body }) => ({
        url: `questions/${id}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useGetQuestionsQuery, useGetQuestionByIdQuery, useUpdateQuestionMutation } = questionApi;
