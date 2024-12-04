import { apiSlice } from "../api/apiSlice";

const questionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: (query) => `questions${query}`,
      providesTags: ["Question"],
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
      invalidatesTags: ["Question"],
    }),
  }),
});

export const { useGetQuestionsQuery, useGetQuestionByIdQuery, useUpdateQuestionMutation } = questionApi;
