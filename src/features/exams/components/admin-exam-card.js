import Image from "next/image";
import { Button } from "@/components/ui/button";

function ExamMetaItem({ icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Image src={icon} alt="" width={16} height={16} />
      <span className="text-[14px] font-normal text-[var(--test-subtext)]">
        {label}:{" "}
      </span>
      <span className="text-[14px] font-medium text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}

export function AdminExamCard({ exam }) {
  return (
    <article className="h-[208px] w-full max-w-[632px] rounded-[14px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-6 py-6">
      <h3 className="line-clamp-2 text-[20px] font-normal leading-[30px] text-[var(--text-primary)]">
        {exam.title}
      </h3>

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <ExamMetaItem icon="/assets/user-group.png" label="Candidates" value={exam.candidates} />
        <ExamMetaItem icon="/assets/file.png" label="Question Set" value={exam.questionSet} />
        <ExamMetaItem icon="/assets/timeline.png" label="Exam Slots" value={exam.examSlots} />
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="h-auto rounded-[12px] border-[var(--border-primary)] px-[14px] py-[10px] text-[14px] font-semibold text-[var(--button-primary)] hover:bg-[var(--button-lightblue)]"
        >
          View Candidates
        </Button>
      </div>
    </article>
  );
}

