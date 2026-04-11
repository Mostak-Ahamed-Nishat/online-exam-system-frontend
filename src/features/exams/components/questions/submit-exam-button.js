import { Spinner } from "@/components/ui/spinner";

export function SubmitExamButton({ isSubmitting, onClick, disabled, statusText }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex h-14 w-full max-w-[906px] cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[var(--border-primary)] bg-[var(--button-white)] text-lg font-semibold text-[var(--button-primary)] transition-colors duration-300 hover:bg-[var(--button-lightblue)] disabled:cursor-not-allowed disabled:border-[var(--border-disabled)] disabled:bg-[var(--background-white)] disabled:text-[var(--test-subtext)]"
      disabled={disabled || isSubmitting}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? <Spinner className="h-4 w-4" /> : null}
      <span>{isSubmitting ? statusText || "Submitting..." : "Submit"}</span>
    </button>
  );
}

