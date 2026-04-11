import { LoadingState } from "@/components/ui/loading-state";

export default function CreateExamLoading() {
  return (
    <div className="mx-auto w-full max-w-[954px]">
      <LoadingState
        message="Loading exam builder..."
        className="rounded-[14px] border-[var(--border-disabled)]"
      />
    </div>
  );
}

