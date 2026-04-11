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
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex items-center gap-2 self-start sm:self-auto">
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

      <div className="inline-flex w-full items-center justify-between gap-3 text-[14px] font-normal text-[var(--test-subtext)] sm:w-auto sm:justify-start">
        <span className="whitespace-nowrap">Tests per page</span>
        <SimpleSelect
          value={perPage}
          onChange={(nextValue) => onPerPageChange(Number(nextValue))}
          options={[
            { label: "8", value: 8 },
            { label: "12", value: 12 },
            { label: "16", value: 16 },
          ]}
          className="min-w-[64px] shrink-0"
          triggerClassName="h-7 rounded-md px-2 py-0 text-[14px] font-medium"
          panelClassName="min-w-[72px]"
        />
      </div>
    </div>
  );
}
