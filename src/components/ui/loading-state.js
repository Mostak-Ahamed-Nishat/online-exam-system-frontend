import { cn } from "@/lib/utils";
import { LumaSpin } from "./luma-spin";

export function LoadingState({
  message = "Loading...",
  inline = false,
  className,
  spinnerClassName,
  textClassName,
}) {
  if (inline) {
    return (
      <div className={cn("flex items-center gap-2", className)} role="status" aria-live="polite">
        <LumaSpin className={cn("h-5 w-5", spinnerClassName)} />
        <p className={cn("sr-only", textClassName)}>{message}</p>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "w-full rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 py-10 md:px-8 md:py-14",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center">
        <LumaSpin className={cn("h-10 w-10", spinnerClassName)} />
        <p className={cn("sr-only", textClassName)}>{message}</p>
      </div>
    </section>
  );
}

