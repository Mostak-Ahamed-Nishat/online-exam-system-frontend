import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query({
      query: () => ({ url: "/auth/me", method: "GET" }),
      transformResponse: (response) => response?.data ?? null,
      providesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response) => ({
        accessToken: response?.tokens?.accessToken ?? null,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useMeQuery, useLazyMeQuery, useLoginMutation, useLogoutMutation } = authApi;
