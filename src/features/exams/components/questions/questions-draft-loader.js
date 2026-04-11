import { LoadingState } from "@/components/ui/loading-state";

export function QuestionsDraftLoader() {
  return (
    <section className="space-y-6">
      <LoadingState message="Loading draft..." className="rounded-[14px] border-[var(--border-disabled)]" />
    </section>
  );
}
