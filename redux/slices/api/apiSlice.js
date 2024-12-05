import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import { setUserInfo } from "../auth/authSlice.js";
const localUrl = "http://127.0.0.1:8080/api";
const productionUrl = "https://goldfish-app-fwiva.ondigitalocean.app/api";
const baseUrl = productionUrl;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("token");
    api.dispatch(setUserInfo(null));
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
