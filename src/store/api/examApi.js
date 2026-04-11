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
    getStudentExams: builder.query({
      async queryFn(args = {}, _api, _extraOptions, baseQuery) {
        const { search = "", page = 1, limit = 8 } = args;
        const result = await baseQuery({
          url: "/candidate/exams",
          method: "GET",
          params: { search, page, limit },
        });

        if (result.error) {
          if (result.error.status === 404) {
            return {
              data: {
                items: [],
                pagination: {
                  total: 0,
                  page,
                  limit,
                  totalPages: 1,
                },
              },
            };
          }

          return { error: result.error };
        }

        const response = result.data;
        return {
          data: {
            items: response?.data ?? [],
            pagination: response?.pagination ?? {
              total: 0,
              page: 1,
              limit: 8,
              totalPages: 1,
            },
          },
        };
      },
      providesTags: ["Exam"],
    }),
    createExamBasicInfo: builder.mutation({
      query: (payload) => ({
        url: "/admin/exams",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Exam"],
    }),
    addExamQuestion: builder.mutation({
      query: ({ examId, payload }) => ({
        url: `/admin/exams/${examId}/questions`,
        method: "POST",
        body: payload,
      }),
    }),
    deleteExam: builder.mutation({
      query: (examId) => ({
        url: `/admin/exams/${examId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam"],
    }),
    startStudentExam: builder.mutation({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/start`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetAdminExamsQuery,
  useGetStudentExamsQuery,
  useCreateExamBasicInfoMutation,
  useAddExamQuestionMutation,
  useDeleteExamMutation,
  useStartStudentExamMutation,
} = examApi;
