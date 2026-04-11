import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function CreateActionBar({
  cancelHref = "/admin/dashboard",
  cancelLabel = "Cancel",
  cancelDisabled = false,
  primaryType = "button",
  primaryLabel,
  loadingLabel,
  primaryDisabled = false,
  isLoading = false,
  onPrimaryClick,
}) {
  return (
    <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row">
        <Link
          href={cancelHref}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 min-w-[124px] rounded-[10px] border-[var(--border-disabled)] text-sm font-semibold",
            cancelDisabled ? "pointer-events-none opacity-50" : "",
          )}
          aria-disabled={cancelDisabled}
        >
          {cancelLabel}
        </Link>

        <Button
          type={primaryType}
          className="h-12 min-w-[172px] rounded-[10px] text-sm font-semibold"
          disabled={primaryDisabled}
          onClick={onPrimaryClick}
        >
          <span className="inline-flex items-center gap-2">
            {isLoading ? <Spinner className="h-4 w-4" /> : null}
            {isLoading ? loadingLabel : primaryLabel}
          </span>
        </Button>
      </div>
    </div>
  );
}

