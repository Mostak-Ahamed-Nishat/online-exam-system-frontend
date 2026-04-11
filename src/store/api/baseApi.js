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

const clearClientAuthState = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_user");
  document.cookie = "auth_access=; path=/; max-age=0; samesite=lax";
  document.cookie = "app_session=; path=/; max-age=0; samesite=lax";
  document.cookie = "panel=; path=/; max-age=0; samesite=lax";
};

const redirectToLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.location.replace("/login");
};

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

      if (result?.error?.status === 401) {
        api.dispatch(clearAuth());
        clearClientAuthState();
        redirectToLogin();
      }
    } else {
      api.dispatch(clearAuth());
      clearClientAuthState();
      redirectToLogin();
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 60,
  refetchOnReconnect: true,
  tagTypes: ["Auth", "Exam", "QuestionBank", "Attempt", "Result", "Analytics"],
  endpoints: () => ({}),
});
