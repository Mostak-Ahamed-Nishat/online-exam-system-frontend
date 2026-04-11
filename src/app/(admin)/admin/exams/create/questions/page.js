"use client";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { QuestionsDraftLoader } from "@/features/exams/components/questions/questions-draft-loader";
import { QuestionSummaryCard } from "@/features/exams/components/questions/question-summary-card";
import { SubmitExamButton } from "@/features/exams/components/questions/submit-exam-button";
import { useCreateExamSubmit } from "@/features/exams/hooks/use-create-exam-submit";
import { useQuestionBuilder } from "@/features/exams/hooks/use-question-builder";
import { ManageOnlineTestHeader } from "@/features/exams/components/create/manage-online-test-header";
import { selectDraftBasicInfo } from "@/store/slices/examDraftSlice";

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
  const {
    isSubmittingExam,
    submitPhase,
    submitError,
    clearSubmitError,
    submitExam,
  } = useCreateExamSubmit();

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
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <ManageOnlineTestHeader
        step="questions"
        backDisabled={isSubmittingExam}
      />

      {questions.length > 0 ? (
        <div className="mx-auto w-full max-w-7xl rounded-[14px]">
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

            <div className="mx-auto w-full max-w-[954px] bg-[var(--background-white)] p-6">
              <button
                type="button"
                onClick={() => {
                  clearSubmitError();
                  openAddQuestion();
                }}
                disabled={isSubmittingExam}
                className="mx-auto flex h-14 w-full max-w-[906px] cursor-pointer items-center justify-center rounded-[14px] bg-[var(--button-primary)] text-xl font-medium leading-normal text-[var(--button-white)] transition-colors duration-300 ease-out hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled)]"
              >
                Add Question
              </button>
            </div>

            {submitError ? (
              <div className="rounded-[10px] border border-[var(--button-warning)]/30 bg-[var(--button-warning)]/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-[var(--button-warning)]">
                    {submitError}
                  </p>
                  <button
                    type="button"
                    onClick={clearSubmitError}
                    className="text-xs font-semibold text-[var(--button-warning)] underline underline-offset-2"
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
        <div className="mx-auto w-full max-w-[954px] rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
          <button
            type="button"
            onClick={() => {
              clearSubmitError();
              openAddQuestion();
            }}
            disabled={isSubmittingExam}
            className="mx-auto flex h-14 w-full max-w-[906px] cursor-pointer items-center justify-center rounded-[14px] bg-[var(--button-primary)] text-4xl font-normal leading-11 text-[var(--button-white)] transition-colors duration-300 ease-out hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[var(--button-disabled)]"
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
        onDeleteQuestion={
          editingQuestion ? () => removeQuestion(editingQuestion.id) : null
        }
        resetSignal={modalResetSignal}
      />
    </section>
  );
}
