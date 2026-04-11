"use client";

import { Button } from "@/components/ui/button";
import { AttemptRichTextEditor } from "./attempt-rich-text-editor";
import { AttemptOptionRow } from "./attempt-option-row";

export function AttemptQuestionCard({
  currentQuestion,
  currentOrder,
  isTextType,
  isRadioType,
  answerText,
  setAnswerText,
  selectedOptionIndexes,
  setSelectedOptionIndexes,
  isSaving,
  isSubmitting,
  hasResultView,
  isLastQuestion,
  onSkip,
  onSave,
}) {
  const isDisabled = isSaving || isSubmitting || hasResultView;

  return (
    <div className="mt-6 rounded-[18px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-5 py-5 md:px-8 md:py-7">
      <h3 className="text-xl font-semibold leading-normal text-[var(--text-primary)]">
        Q{currentOrder}. {currentQuestion.prompt}
      </h3>

      <div className="mt-6 space-y-3">
        {isTextType ? (
          <AttemptRichTextEditor value={answerText} onChange={setAnswerText} placeholder="Type questions here.." />
        ) : (
          (currentQuestion.options || []).map((option) => {
            const checked = selectedOptionIndexes.includes(option.index);
            return (
              <AttemptOptionRow
                key={`${currentQuestion.id}-${option.index}`}
                option={option}
                type={currentQuestion.type}
                checked={checked}
                disabled={isDisabled}
                onToggle={() => {
                  setSelectedOptionIndexes((previous) => {
                    if (isRadioType) {
                      return checked ? [] : [option.index];
                    }

                    if (checked) {
                      return previous.filter((value) => value !== option.index);
                    }

                    return [...previous, option.index].sort((a, b) => a - b);
                  });
                }}
              />
            );
          })
        )}
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={isDisabled}
          onClick={onSkip}
          className="h-12 min-w-40 rounded-[14px] border-[var(--border-inputfield)] px-5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[#f8fafc]"
        >
          {isLastQuestion ? "Skip & Submit" : "Skip this Question"}
        </Button>

        <Button
          type="button"
          disabled={isDisabled}
          onClick={onSave}
          className="h-12 min-w-40 rounded-[14px] bg-[var(--button-primary)] px-5 text-sm font-semibold text-[var(--button-white)] hover:opacity-95 disabled:bg-[var(--button-disabled)]"
        >
          {isSaving || isSubmitting ? "Please wait..." : isLastQuestion ? "Save & Submit" : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
