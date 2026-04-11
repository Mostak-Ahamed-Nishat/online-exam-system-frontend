import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Access token handling can be added later (e.g., from redux/persist).
      headers.set("content-type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Auth", "Exam", "QuestionBank", "Attempt", "Result", "Analytics"],
  endpoints: () => ({}),
});

