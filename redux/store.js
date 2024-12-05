import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/api/apiSlice.js";
import authReducer from "./slices/auth/authSlice.js";
import questionReducer from "./slices/question/questionSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    question: questionReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
});
