import { CheckCircle2 } from "lucide-react";

function normalizeTypeLabel(type) {
  const normalized = String(type || "").toLowerCase();
  if (normalized === "checkbox") return "MCQ";
  if (normalized === "radio") return "Radio";
  if (normalized === "text") return "Text";
  return type || "Question";
}

export function QuestionSummaryCard({
  index,
  id,
  title,
  type,
  score,
  options = [],
  textAnswer = "",
  onEdit,
  onRemove,
}) {
  const renderHtml = (content, className) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  );

  return (
    <article className="mx-auto w-full max-w-[954px] rounded-xl border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-normal leading-normal text-[var(--text-primary)]">Question {index}</h3>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[var(--border-disabled)] px-3 py-1 text-xs font-medium text-[var(--test-subtext)]">
              {normalizeTypeLabel(type)}
            </span>
            <span className="rounded-full border border-[var(--border-disabled)] px-3 py-1 text-xs font-medium text-[var(--test-subtext)]">
              {score} pt
            </span>
          </div>
        </div>

        {renderHtml(title, "text-base font-semibold leading-6 text-[var(--text-primary)]")}

        {String(type).toLowerCase() === "text" ? (
          <div className="rounded-lg bg-[var(--background-color)] px-3 py-2">
            {renderHtml(textAnswer, "text-sm leading-[22px] text-[var(--test-subtext)]")}
          </div>
        ) : (
          <div className="space-y-2">
            {options.map((option) => {
              const isCorrect = Boolean(option.correct);

              return (
                <div
                  key={option.id}
                  className={[
                    "flex min-h-10 items-center justify-between rounded-lg px-3 py-2",
                    isCorrect ? "bg-[var(--background-color)]" : "border border-transparent",
                  ].join(" ")}
                >
                  {renderHtml(
                    option.label,
                    "text-sm font-normal leading-[22px] text-[var(--text-primary)]",
                  )}
                  {isCorrect ? <CheckCircle2 className="h-4 w-4 text-[var(--button-success)]" /> : null}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => onEdit?.(id)}
            className="cursor-pointer text-[13px] font-semibold text-[var(--button-primary)] transition-opacity hover:opacity-80"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onRemove?.(id)}
            className="cursor-pointer text-[13px] font-semibold text-[var(--button-warning)] transition-opacity hover:opacity-80"
          >
            Remove From Exam
          </button>
        </div>
      </div>
    </article>
  );
}

