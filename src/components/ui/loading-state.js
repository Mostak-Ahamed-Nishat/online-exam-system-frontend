import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

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
        <Spinner className={cn("h-4 w-4 text-[var(--text-primary)]", spinnerClassName)} />
        <p className={cn("text-[14px] font-normal text-[var(--test-subtext)]", textClassName)}>{message}</p>
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
      <div className="flex items-center justify-center gap-2">
        <Spinner className={cn("h-4 w-4 text-[var(--text-primary)]", spinnerClassName)} />
        <p className={cn("text-center text-[14px] font-normal text-[var(--test-subtext)]", textClassName)}>
          {message}
        </p>
      </div>
    </section>
  );
}
