import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function StepItem({ tone = "inactive", number, label }) {
  const isDone = tone === "done";
  const isActive = tone === "active";

  return (
    <>
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
          isActive || isDone
            ? "bg-[var(--button-primary)] text-[var(--button-white)]"
            : "bg-[var(--border-disabled)] text-[var(--test-subtext)]",
        )}
      >
        {isDone ? <Check className="h-3 w-3" /> : number}
      </span>
      <span
        className={cn(
          "text-sm",
          isActive
            ? "font-medium text-[var(--button-primary)]"
            : tone === "done"
              ? "font-normal text-[var(--text-primary)]"
              : "font-normal text-[var(--test-subtext)]",
        )}
      >
        {label}
      </span>
    </>
  );
}

export function ManageOnlineTestHeader({ step = "basic", backDisabled = false }) {
  const isQuestionsStep = step === "questions";

  return (
    <div className="mx-auto w-full max-w-[1280px] rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-5">
          <h1 className="text-[20px] font-medium leading-[30px] text-[var(--text-primary)]">
            Manage Online Test
          </h1>
          <div className="flex items-center gap-3">
            <StepItem
              number={1}
              label="Basic Info"
              tone={isQuestionsStep ? "done" : "active"}
            />
            <span
              className={cn(
                "h-px w-14",
                isQuestionsStep ? "bg-[var(--text-primary)]" : "bg-[var(--border-disabled)]",
              )}
            />
            <StepItem
              number={2}
              label={isQuestionsStep ? "Questions Sets" : "Questions"}
              tone={isQuestionsStep ? "done" : "inactive"}
            />
          </div>
        </div>

        <Link
          href="/admin/dashboard"
          aria-disabled={backDisabled}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 rounded-xl border-[var(--border-disabled)] px-6 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-primary)] hover:text-[var(--button-primary)]",
            backDisabled ? "pointer-events-none opacity-50" : "",
          )}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

