import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { authApi } from "./api/authApi";
import { examApi } from "./api/examApi";
import { authReducer } from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Ensure RTK Query endpoints are registered.
void authApi;
void examApi;
