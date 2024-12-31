import { apiSlice } from "../api/apiSlice";

const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (query) => ({
        url: `/categories${query}`,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
