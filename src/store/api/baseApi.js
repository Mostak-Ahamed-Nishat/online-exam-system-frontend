import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, setCredentials } from "../slices/authSlice";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  "https://ibos-online-test-backend.vercel.app/api";

const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseUrl = /\/api$/i.test(trimmedBaseUrl)
  ? trimmedBaseUrl
  : `${trimmedBaseUrl}/api`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set("content-type", "application/json");
    const accessToken = getState()?.auth?.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions,
    );

    const refreshedAccessToken = refreshResult?.data?.tokens?.accessToken;
    if (refreshedAccessToken) {
      api.dispatch(setCredentials({ accessToken: refreshedAccessToken }));
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", refreshedAccessToken);
        document.cookie = `auth_access=${encodeURIComponent(refreshedAccessToken)}; path=/; samesite=lax`;
      }
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuth());
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        document.cookie = "auth_access=; path=/; max-age=0; samesite=lax";
        document.cookie = "app_session=; path=/; max-age=0; samesite=lax";
        document.cookie = "panel=; path=/; max-age=0; samesite=lax";
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Exam", "QuestionBank", "Attempt", "Result", "Analytics"],
  endpoints: () => ({}),
});
