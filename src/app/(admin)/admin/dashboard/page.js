"use client";

import { useEffect, useState } from "react";
import { AdminExamSearch } from "@/features/exams/components/admin-exam-search";
import { AdminExamCard } from "@/features/exams/components/admin-exam-card";
import { AdminEmptyState } from "@/features/exams/components/admin-empty-state";
import { AdminPagination } from "@/features/exams/components/admin-pagination";
import { Button } from "@/components/ui/button";
import { useGetAdminExamsQuery } from "@/store/api/examApi";

export default function AdminDashboardPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const { data, isLoading, isFetching, isError } = useGetAdminExamsQuery({
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
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <section>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <h1 className="text-[40px] font-normal leading-[48px] text-[var(--text-primary)]">
          Online Tests
        </h1>

        <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center lg:gap-4">
          <AdminExamSearch
            value={search}
            className="lg:w-[621px]"
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <Button className="h-11 rounded-[12px] px-6 text-[14px] font-semibold">
            Create Online Test
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <section className="w-full rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 py-10 md:px-8 md:py-14">
            <p className="text-center text-[14px] font-normal text-[var(--test-subtext)]">
              Loading online tests...
            </p>
          </section>
        ) : null}

        {isError ? (
          <section className="w-full rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 py-10 md:px-8 md:py-14">
            <p className="text-center text-[14px] font-normal text-[var(--button-warning)]">
              Failed to load online tests.
            </p>
          </section>
        ) : null}

        {isEmpty ? (
          <AdminEmptyState />
        ) : !isLoading && !isError ? (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {exams.map((exam) => (
                <AdminExamCard
                  key={exam.id}
                  exam={{
                    id: exam.id,
                    title: exam.title,
                    candidates: exam.totalCandidates ?? "Not Set",
                    questionSet: exam.totalQuestionSet ?? "Not Set",
                    examSlots: exam.totalSlots ?? "Not Set",
                  }}
                />
              ))}
            </div>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
              onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              onPerPageChange={(nextValue) => {
                setPerPage(nextValue);
                setPage(1);
              }}
            />
            {isFetching ? (
              <p className="mt-2 text-[12px] font-normal text-[var(--test-subtext)]">
                Updating...
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
