import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { authApi } from "./api/authApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Ensure RTK Query endpoints are registered.
void authApi;
