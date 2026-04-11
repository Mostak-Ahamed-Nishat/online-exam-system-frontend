"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function QuestionModalFooterActions({
  isSubmitting,
  onSave,
  onSaveAndAddMore,
}) {
  return (
    <div className="mt-4 flex flex-col-reverse gap-3 border-t border-[var(--border-disabled)] pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-end sm:pt-5">
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={onSave}
        className={cn(
          "h-12 w-full rounded-xl border-[var(--border-primary)] bg-[var(--background-white)] px-6 text-lg font-normal text-[var(--button-primary)] hover:bg-[var(--button-lightblue)] sm:min-w-[124px] sm:w-auto sm:text-xl",
        )}
      >
        <span className="inline-flex items-center gap-2">
          {isSubmitting ? <Spinner className="h-4 w-4" /> : null}
          {isSubmitting ? "Saving..." : "Save"}
        </span>
      </Button>
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={onSaveAndAddMore}
        className="h-12 w-full rounded-xl bg-[var(--button-primary)] px-6 text-md font-normal text-[var(--button-white)] hover:opacity-95 sm:min-w-[180px] sm:w-auto sm:text-xl"
      >
        <span className="inline-flex items-center gap-2">
          {isSubmitting ? <Spinner className="h-4 w-4" /> : null}
          {isSubmitting ? "Saving..." : "Save & Add More"}
        </span>
      </Button>
    </div>
  );
}
