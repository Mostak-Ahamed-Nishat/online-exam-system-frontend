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
    <article className="w-full max-h-[208px] rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-8">
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
          className="h-auto rounded-[12px] border-[var(--border-primary)] bg-[var(--button-white)] px-[14px] py-[10px] text-[14px] font-semibold text-[var(--button-primary)] transition-colors duration-300 ease-out hover:border-[var(--button-primary)] hover:bg-[var(--button-primary)] hover:text-[var(--button-white)]"
        >
          View Candidates
        </Button>
      </div>
    </article>
  );
}
