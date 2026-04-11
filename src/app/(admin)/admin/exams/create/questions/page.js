import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateQuestionSetsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <h1 className="text-[40px] leading-[48px] text-[var(--text-primary)]">Manage Online Test</h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--button-primary)] text-[var(--button-white)]">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-[14px] font-normal text-[var(--text-primary)]">Basic Info</span>
              <span className="h-px w-14 bg-[var(--text-primary)]" />
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--button-primary)] text-[var(--button-white)]">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-[14px] font-normal text-[var(--text-primary)]">Questions Sets</span>
            </div>
          </div>

          <Link
            href="/admin/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 rounded-[12px] border-[var(--border-disabled)] px-6 text-[14px] font-semibold",
            )}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[954px] rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
        <button
          type="button"
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[14px] bg-[var(--button-primary)] text-[36px] font-normal leading-[44px] text-[var(--button-white)] transition-colors duration-300 ease-out hover:opacity-95"
        >
          Add Question
        </button>
      </div>
    </section>
  );
}

