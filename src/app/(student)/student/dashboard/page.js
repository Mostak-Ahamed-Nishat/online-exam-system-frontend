"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { StudentExamCard } from "@/features/exams/components/student-exam-card";
import { StudentExamSearch } from "@/features/exams/components/student-exam-search";
import { StudentEmptyState } from "@/features/exams/components/student-empty-state";
import { StudentPagination } from "@/features/exams/components/student-pagination";
import { useGetStudentExamsQuery, useStartStudentExamMutation } from "@/store/api/examApi";
import {
  selectStudentDashboardPage,
  selectStudentDashboardPerPage,
  selectStudentDashboardSearch,
  setStudentDashboardPage,
  setStudentDashboardPerPage,
  setStudentDashboardSearch,
} from "@/store/slices/studentDashboardSlice";

function mapStudentExamCard(exam) {
  return {
    id: exam.examId,
    title: exam.title,
    duration: `${exam.durationMinutes || 0} min`,
    questions: exam.totalQuestionSet ?? 0,
    negativeMarking: exam.negativeMarking ?? "-0.25/wrong",
  };
}

export default function StudentDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const search = useSelector(selectStudentDashboardSearch);
  const page = useSelector(selectStudentDashboardPage);
  const perPage = useSelector(selectStudentDashboardPerPage);
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState(search);
  const [startingExamId, setStartingExamId] = useState(null);
  const [startStudentExam] = useStartStudentExamMutation();

  const { data, isLoading, isFetching, isError, refetch } = useGetStudentExamsQuery({
    search,
    page,
    limit: perPage,
  });

  const exams = data?.items ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: perPage,
    totalPages: 1,
  };
  const totalPages = Math.max(1, pagination.totalPages || 1);
  const isEmpty = !isLoading && !isError && exams.length === 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const nextSearch = searchInput.trim();
      if (nextSearch === search) return;
      dispatch(setStudentDashboardSearch(nextSearch));
      dispatch(setStudentDashboardPage(1));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [dispatch, search, searchInput]);

  useEffect(() => {
    if (page > totalPages) {
      dispatch(setStudentDashboardPage(totalPages));
    }
  }, [dispatch, page, totalPages]);

  const handleStartExam = async (examId) => {
    try {
      setStartingExamId(examId);
      await startStudentExam(examId).unwrap();
      router.push(`/student/exams/${examId}`);
    } catch (error) {
      const message =
        error?.data?.message || error?.error || error?.message || "Unable to start exam right now.";
      toast.error(message);
    } finally {
      setStartingExamId(null);
    }
  };

  if (!mounted) {
    return (
      <section>
        <div className="mt-8">
          <LoadingState message="Loading online tests..." />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <h1 className="text-2xl font-semibold leading-12 text-[var(--text-primary)]">Online Tests</h1>

        <StudentExamSearch
          value={searchInput}
          className="lg:w-[621px]"
          onChange={(value) => {
            setSearchInput(value);
            dispatch(setStudentDashboardPage(1));
          }}
        />
      </div>

      <div className="mt-8">
        {isLoading ? <LoadingState message="Loading online tests..." /> : null}

        {isError ? (
          <ErrorState message="Failed to load online tests." onRetry={refetch} retryLabel="Reload" />
        ) : null}

        {isEmpty ? (
          <StudentEmptyState />
        ) : !isLoading && !isError ? (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {exams.map((exam) => {
                const mappedExam = mapStudentExamCard(exam);

                return (
                  <StudentExamCard
                    key={mappedExam.id}
                    exam={mappedExam}
                    isStarting={startingExamId === mappedExam.id}
                    onStart={() => handleStartExam(mappedExam.id)}
                  />
                );
              })}
            </div>

            <StudentPagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPrev={() => dispatch(setStudentDashboardPage(Math.max(1, page - 1)))}
              onNext={() => dispatch(setStudentDashboardPage(Math.min(totalPages, page + 1)))}
              onPerPageChange={(nextValue) => {
                dispatch(setStudentDashboardPerPage(nextValue));
                dispatch(setStudentDashboardPage(1));
              }}
            />

            {isFetching ? (
              <LoadingState
                inline
                message="Updating..."
                className="mt-2"
                spinnerClassName="h-3 w-3"
                textClassName="text-xs"
              />
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

