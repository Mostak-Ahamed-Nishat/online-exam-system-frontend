"use client";

import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

export function AdminPagination({
  page,
  totalPages,
  perPage,
  onPrev,
  onNext,
  onPerPageChange,
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[var(--border-inputfield)] bg-[var(--background-white)] text-[var(--icon-gray)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-7 text-center text-[14px] font-medium text-[var(--text-primary)]">
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

      <div className="inline-flex items-center gap-2 text-[14px] font-normal text-[var(--test-subtext)]">
        <span>Online Test Per Page</span>
        <button
          type="button"
          onClick={onPerPageChange}
          className="inline-flex h-7 min-w-10 cursor-pointer items-center justify-center gap-1 rounded-md border border-[var(--border-inputfield)] bg-[var(--background-white)] px-2 text-[14px] font-medium text-[var(--text-primary)]"
          aria-label="Change items per page"
        >
          {perPage}
          <ChevronUp className="h-3.5 w-3.5 text-[var(--icon-gray)]" />
        </button>
      </div>
    </div>
  );
}

