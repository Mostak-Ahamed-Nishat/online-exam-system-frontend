import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateBasicInfoForm } from "@/features/exams/components/create/create-basic-info-form";

export default function CreateOnlineTestPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <h1 className="text-[40px] leading-[48px] text-[var(--text-primary)]">Manage Online Test</h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--button-primary)] text-[12px] font-medium text-[var(--button-white)]">
                1
              </span>
              <span className="text-[14px] font-medium text-[var(--button-primary)]">Basic Info</span>
              <span className="h-px w-14 bg-[var(--border-disabled)]" />
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--border-disabled)] text-[12px] font-medium text-[var(--test-subtext)]">
                2
              </span>
              <span className="text-[14px] font-normal text-[var(--test-subtext)]">Questions</span>
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

      <div className="mx-auto w-full max-w-[954px]">
        <CreateBasicInfoForm />
      </div>
    </section>
  );
}
