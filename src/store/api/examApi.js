import { baseApi } from "./baseApi";

export const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminExams: builder.query({
      query: ({ search = "", page = 1, limit = 8 } = {}) => ({
        url: "/admin/exams",
        method: "GET",
        params: { search, page, limit },
      }),
      transformResponse: (response) => ({
        items: response?.data ?? [],
        pagination: response?.pagination ?? {
          total: 0,
          page: 1,
          limit: 8,
          totalPages: 1,
        },
      }),
      providesTags: ["Exam"],
    }),
  }),
});

export const { useGetAdminExamsQuery } = examApi;

