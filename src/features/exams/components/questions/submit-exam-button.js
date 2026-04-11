import { Spinner } from "@/components/ui/spinner";

export function SubmitExamButton({ isSubmitting, onClick, disabled, statusText }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[var(--button-primary)] text-[18px] font-semibold text-[var(--button-white)] transition-opacity duration-300 hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled)]"
      disabled={disabled || isSubmitting}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? <Spinner className="h-4 w-4" /> : null}
      <span>{isSubmitting ? statusText || "Submitting..." : "Submit"}</span>
    </button>
  );
}
