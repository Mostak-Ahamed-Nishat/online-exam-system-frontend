import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function StudentExamMetaItem({ icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Image src={icon} alt="" width={16} height={16} />
      <span className="text-[14px] font-normal text-[var(--test-subtext)]">{label}: </span>
      <span className="text-[14px] font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

export function StudentExamCard({ exam, onStart, isStarting }) {
  return (
    <article className="w-full max-h-[208px] rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-8">
      <h3 className="line-clamp-2 text-[20px] font-normal leading-[30px] text-[var(--text-primary)]">
        {exam.title}
      </h3>

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <StudentExamMetaItem icon="/assets/clock.png" label="Duration" value={exam.duration} />
        <StudentExamMetaItem icon="/assets/file.png" label="Question" value={exam.questions} />
        <StudentExamMetaItem icon="/assets/timeline.png" label="Negative Marking" value={exam.negativeMarking} />
      </div>

      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          disabled={isStarting}
          onClick={onStart}
          className="h-auto rounded-[12px] border-[var(--border-primary)] bg-[var(--button-white)] px-[14px] py-[10px] text-[14px] font-semibold text-[var(--button-primary)] transition-colors duration-300 ease-out hover:border-[var(--button-primary)] hover:bg-[var(--button-primary)] hover:text-[var(--button-white)] disabled:border-[var(--border-disabled)] disabled:bg-[var(--background-white)] disabled:text-[var(--test-subtext)]"
        >
          <span className="inline-flex items-center gap-2">
            {isStarting ? <Spinner className="h-4 w-4" /> : null}
            {isStarting ? "Starting..." : "Start"}
          </span>
        </Button>
      </div>
    </article>
  );
}

