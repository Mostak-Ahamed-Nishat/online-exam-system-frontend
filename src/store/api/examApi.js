import { baseApi } from "./baseApi";

export const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminExams: builder.query({
      query: ({ search = "", page = 1, limit = 5 } = {}) => ({
        url: "/admin/exams",
        method: "GET",
        params: { search, page, limit },
      }),
      transformResponse: (response) => ({
        items: response?.data ?? [],
        pagination: response?.pagination ?? {
          total: 0,
          page: 1,
          limit: 5,
          totalPages: 1,
        },
      }),
      keepUnusedDataFor: 120,
      providesTags: ["Exam"],
    }),
    getStudentExams: builder.query({
      async queryFn(args = {}, _api, _extraOptions, baseQuery) {
        const { search = "", page = 1, limit = 5 } = args;
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
              limit: 5,
              totalPages: 1,
            },
          },
        };
      },
      keepUnusedDataFor: 120,
      providesTags: ["Exam"],
    }),
    getStudentExamInstructions: builder.query({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/instructions`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
      keepUnusedDataFor: 300,
    }),
    getStudentExamSession: builder.query({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/session`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
      keepUnusedDataFor: 0,
    }),
    getStudentCurrentQuestion: builder.query({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/questions/current`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
      keepUnusedDataFor: 0,
    }),
    updateStudentCurrentQuestion: builder.mutation({
      query: ({ examId, payload }) => ({
        url: `/candidate/exams/${examId}/questions/current`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response) => response?.data ?? null,
    }),
    getStudentQuestionNavigation: builder.query({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/navigation`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
      keepUnusedDataFor: 0,
    }),
    submitStudentExam: builder.mutation({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/submit`,
        method: "POST",
      }),
      transformResponse: (response) => response?.data ?? null,
    }),
    timeoutSubmitStudentExam: builder.mutation({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/timeout-submit`,
        method: "POST",
      }),
      transformResponse: (response) => response?.data ?? null,
    }),
    syncStudentOfflineAnswers: builder.mutation({
      query: ({ examId, payload }) => ({
        url: `/candidate/exams/${examId}/offline-sync`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response?.data ?? null,
    }),
    getStudentOfflineSyncState: builder.query({
      query: (examId) => ({
        url: `/candidate/exams/${examId}/offline-sync`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
      keepUnusedDataFor: 0,
    }),
    reportStudentIntegrityEvent: builder.mutation({
      query: ({ examId, payload }) => ({
        url: `/candidate/exams/${examId}/integrity-events`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response?.data ?? null,
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
      transformResponse: (response) => response?.data ?? null,
    }),
  }),
});

export const {
  useGetAdminExamsQuery,
  useGetStudentExamsQuery,
  useGetStudentExamInstructionsQuery,
  useLazyGetStudentExamSessionQuery,
  useLazyGetStudentCurrentQuestionQuery,
  useUpdateStudentCurrentQuestionMutation,
  useLazyGetStudentQuestionNavigationQuery,
  useSubmitStudentExamMutation,
  useTimeoutSubmitStudentExamMutation,
  useSyncStudentOfflineAnswersMutation,
  useLazyGetStudentOfflineSyncStateQuery,
  useReportStudentIntegrityEventMutation,
  useCreateExamBasicInfoMutation,
  useAddExamQuestionMutation,
  useDeleteExamMutation,
  useStartStudentExamMutation,
} = examApi;
