"use client";

import { useMemo, useState } from "react";
import { AdminExamSearch } from "@/features/exams/components/admin-exam-search";
import { AdminExamCard } from "@/features/exams/components/admin-exam-card";
import { AdminEmptyState } from "@/features/exams/components/admin-empty-state";
import { AdminPagination } from "@/features/exams/components/admin-pagination";
import { Button } from "@/components/ui/button";

const EXAMS = [
  {
    id: "1",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: "10,000",
    questionSet: "3",
    examSlots: "3",
  },
  {
    id: "2",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: "10,000",
    questionSet: "3",
    examSlots: "3",
  },
  {
    id: "3",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: "Not Set",
    questionSet: "Not Set",
    examSlots: "Not Set",
  },
  {
    id: "4",
    title: "Psychometric Test for Management Trainee Officer",
    candidates: "10,000",
    questionSet: "3",
    examSlots: "3",
  },
];

export default function AdminDashboardPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const filteredExams = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return EXAMS;
    return EXAMS.filter((exam) => exam.title.toLowerCase().includes(q));
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / perPage));
  const start = (page - 1) * perPage;
  const visibleExams = filteredExams.slice(start, start + perPage);
  const isEmpty = filteredExams.length === 0;

  return (
    <section>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <h1 className="text-[40px] font-normal leading-[48px] text-[var(--text-primary)]">
          Online Tests
        </h1>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
          <AdminExamSearch value={search} onChange={setSearch} />
          <Button className="h-11 rounded-[12px] px-6 text-[14px] font-semibold">
            Create Online Test
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {isEmpty ? (
          <AdminEmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {visibleExams.map((exam) => (
                <AdminExamCard key={exam.id} exam={exam} />
              ))}
            </div>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
              onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              onPerPageChange={() => {
                const next = perPage === 8 ? 12 : perPage === 12 ? 16 : 8;
                setPerPage(next);
                setPage(1);
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
