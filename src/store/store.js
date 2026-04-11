import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { authApi } from "./api/authApi";
import { examApi } from "./api/examApi";
import { authReducer } from "./slices/authSlice";
import { examDraftReducer } from "./slices/examDraftSlice";
import { studentDashboardReducer } from "./slices/studentDashboardSlice";
import { saveExamDraftToStorage } from "@/features/exams/utils/exam-draft-storage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    examDraft: examDraftReducer,
    studentDashboard: studentDashboardReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    saveExamDraftToStorage(store.getState().examDraft);
  });
}

// Ensure RTK Query endpoints are registered.
void authApi;
void examApi;
