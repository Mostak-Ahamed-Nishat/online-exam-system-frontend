"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { QuestionsDraftLoader } from "@/features/exams/components/questions/questions-draft-loader";
import { QuestionSummaryCard } from "@/features/exams/components/questions/question-summary-card";
import { SubmitExamButton } from "@/features/exams/components/questions/submit-exam-button";
import { useCreateExamSubmit } from "@/features/exams/hooks/use-create-exam-submit";
import { useQuestionBuilder } from "@/features/exams/hooks/use-question-builder";
import { selectDraftBasicInfo } from "@/store/slices/examDraftSlice";
import { cn } from "@/lib/utils";

const QuestionModalShell = dynamic(
  () =>
    import("@/features/exams/components/questions/question-modal-shell").then(
      (module) => module.QuestionModalShell,
    ),
  { ssr: false },
);

function getSubmitStatusText(phase) {
  if (phase === "creating_exam") return "Creating exam...";
  if (phase === "adding_questions") return "Saving questions...";
  return "Submitting...";
}

export default function CreateQuestionSetsPage() {
  const basicInfo = useSelector(selectDraftBasicInfo);
  const { isSubmittingExam, submitPhase, submitError, clearSubmitError, submitExam } = useCreateExamSubmit();

  const {
    hydrated,
    isModalOpen,
    questions,
    editingQuestion,
    nextQuestionNumber,
    forcedQuestionType,
    modalResetSignal,
    openAddQuestion,
    openEditQuestion,
    removeQuestion,
    closeModal,
    saveQuestion,
  } = useQuestionBuilder();

  if (!hydrated) {
    return <QuestionsDraftLoader />;
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] space-y-6">
      <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <h1 className="text-[20px] font-semibold leading-[30px] text-[var(--text-primary)]">
              Manage Online Test
            </h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--button-primary)] text-[var(--button-white)]">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-[14px] font-normal text-[var(--text-primary)]">Basic Info</span>
              <span className="h-px w-14 bg-[var(--text-primary)]" />
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--button-primary)] text-[var(--button-white)]">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-[14px] font-normal text-[var(--text-primary)]">Questions Sets</span>
            </div>
          </div>

          <Link
            href="/admin/dashboard"
            aria-disabled={isSubmittingExam}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 rounded-[12px] border-[var(--border-disabled)] px-6 text-[14px] font-semibold text-[var(--text-primary)] hover:border-[var(--border-primary)] hover:text-[var(--button-primary)]",
              isSubmittingExam ? "pointer-events-none opacity-50" : "",
            )}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {questions.length > 0 ? (
        <div className="mx-auto w-full max-w-[1280px] rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-4 sm:p-6">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <QuestionSummaryCard
                key={question.id}
                id={question.id}
                index={index + 1}
                title={question.title}
                type={question.type}
                score={question.score}
                options={question.options}
                textAnswer={question.textAnswer}
                onEdit={openEditQuestion}
                onRemove={removeQuestion}
              />
            ))}

            <button
              type="button"
              onClick={() => {
                clearSubmitError();
                openAddQuestion();
              }}
              disabled={isSubmittingExam}
              className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[14px] bg-[var(--button-primary)] text-[20px] font-medium leading-[30px] text-[var(--button-white)] transition-colors duration-300 ease-out hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled)]"
            >
              Add Question
            </button>

            {submitError ? (
              <div className="rounded-[10px] border border-[var(--button-warning)]/30 bg-[var(--button-warning)]/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-[var(--button-warning)]">{submitError}</p>
                  <button
                    type="button"
                    onClick={clearSubmitError}
                    className="text-[12px] font-semibold text-[var(--button-warning)] underline underline-offset-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : null}

            <SubmitExamButton
              isSubmitting={isSubmittingExam}
              statusText={getSubmitStatusText(submitPhase)}
              disabled={!basicInfo || questions.length === 0}
              onClick={() => submitExam({ basicInfo, questions })}
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1280px] rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
          <button
            type="button"
            onClick={() => {
              clearSubmitError();
              openAddQuestion();
            }}
            disabled={isSubmittingExam}
            className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[14px] bg-[var(--button-primary)] text-[36px] font-normal leading-[44px] text-[var(--button-white)] transition-colors duration-300 ease-out hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled)]"
          >
            Add Question
          </button>
        </div>
      )}

      <QuestionModalShell
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveQuestion}
        questionNumber={nextQuestionNumber}
        initialQuestion={editingQuestion}
        forcedType={forcedQuestionType}
        onDeleteQuestion={editingQuestion ? () => removeQuestion(editingQuestion.id) : null}
        resetSignal={modalResetSignal}
      />
    </section>
  );
}
