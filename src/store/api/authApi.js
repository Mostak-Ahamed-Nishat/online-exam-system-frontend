import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response) => ({
        message: response?.message ?? "",
        verificationLink: response?.verificationLink ?? null,
      }),
    }),
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

export const {
  useRegisterMutation,
  useMeQuery,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
