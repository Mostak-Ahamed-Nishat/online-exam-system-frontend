"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SimpleSelect } from "@/components/ui/simple-select";

export function AdminPagination({
  page,
  totalPages,
  perPage,
  onPrev,
  onNext,
  onPerPageChange,
}) {
  return (
    <div className="mt-4 grid grid-cols-2 items-center gap-3 md:flex md:items-center md:justify-between">
      <div className="inline-flex items-center gap-2 justify-self-start">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[var(--border-inputfield)] bg-[var(--background-white)] text-[var(--icon-gray)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-7 text-center text-sm font-medium text-[var(--text-primary)]">
          {page}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[var(--border-inputfield)] bg-[var(--background-white)] text-[var(--icon-gray)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="inline-flex items-center justify-self-end gap-2 text-sm font-normal text-[var(--test-subtext)] md:w-auto md:justify-start md:gap-3">
        <span className="hidden whitespace-nowrap md:inline">Tests per page</span>
        <SimpleSelect
          value={perPage}
          onChange={(nextValue) => onPerPageChange(Number(nextValue))}
          options={[
            { label: "2", value: 2 },
            { label: "5", value: 5 },
            { label: "10", value: 10 },
            { label: "15", value: 15 },
            { label: "20", value: 20 },
            { label: "25", value: 25 },
            { label: "30", value: 30 },
            { label: "35", value: 35 },
          ]}
          className="min-w-16 shrink-0"
          triggerClassName="h-7 rounded-md px-2 py-0 text-sm font-medium"
          panelClassName="min-w-[72px]"
        />
      </div>
    </div>
  );
}
