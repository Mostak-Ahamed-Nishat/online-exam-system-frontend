import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorState({ message, className, onRetry, retryLabel = "Try again" }) {
  return (
    <section
      className={cn(
        "w-full rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 py-10 md:px-8 md:py-14",
        className,
      )}
      role="alert"
    >
      <div className="mx-auto flex max-w-[480px] flex-col items-center gap-3 text-center">
        <p className="text-sm font-normal text-[var(--button-warning)]">
          {message || "Something went wrong. Please try again."}
        </p>
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            className="h-10 rounded-[10px] border-[var(--border-primary)] px-5 text-sm font-semibold text-[var(--button-primary)] hover:bg-[var(--button-lightblue)]"
          >
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}


