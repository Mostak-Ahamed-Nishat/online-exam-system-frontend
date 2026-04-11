"use client";

import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { AttemptOfflineNotice } from "@/features/exams/components/attempt/attempt-offline-notice";
import { AttemptQuestionCard } from "@/features/exams/components/attempt/attempt-question-card";
import { AttemptSessionHeader } from "@/features/exams/components/attempt/attempt-session-header";
import { AttemptStatusPanel } from "@/features/exams/components/attempt/attempt-status-panel";
import { useStudentExamAttempt } from "@/features/exams/hooks/use-student-exam-attempt";

export default function StudentExamAttemptPage() {
  const {
    attemptState,
    answerText,
    candidateName,
    currentOrder,
    currentQuestion,
    isInitializing,
    isLastQuestion,
    isOnline,
    isRadioType,
    isSaving,
    isSubmitting,
    isTextType,
    loadCurrentQuestion,
    loadError,
    navigateDashboard,
    remainingLabel,
    resultView,
    selectedOptionIndexes,
    setAnswerText,
    setSelectedOptionIndexes,
    totalQuestions,
    updateAndMove,
  } = useStudentExamAttempt();

  if (isInitializing) {
    return (
      <section className="mx-auto w-full max-w-7xl">
        <LoadingState message="Preparing exam session..." />
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="mx-auto w-full max-w-7xl">
        <ErrorState message={loadError} retryLabel="Try again" onRetry={() => window.location.reload()} />
      </section>
    );
  }

  if (!attemptState || !currentQuestion) {
    return (
      <section className="mx-auto w-full max-w-7xl">
        <ErrorState message="Question could not be loaded." onRetry={() => void loadCurrentQuestion()} />
      </section>
    );
  }

  if (resultView === "completed") {
    return (
      <section className="mx-auto w-full max-w-7xl">
        <AttemptStatusPanel mode="completed" candidateName={candidateName} onBack={navigateDashboard} />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl pb-20">
      <AttemptOfflineNotice isOnline={isOnline} />

      <AttemptSessionHeader
        currentOrder={currentOrder}
        totalQuestions={totalQuestions}
        remainingLabel={remainingLabel}
      />

      <AttemptQuestionCard
        currentQuestion={currentQuestion}
        currentOrder={currentOrder}
        isTextType={isTextType}
        isRadioType={isRadioType}
        answerText={answerText}
        setAnswerText={setAnswerText}
        selectedOptionIndexes={selectedOptionIndexes}
        setSelectedOptionIndexes={setSelectedOptionIndexes}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        hasResultView={Boolean(resultView)}
        isLastQuestion={isLastQuestion}
        onSkip={() => void updateAndMove("SKIP", isLastQuestion)}
        onSave={() => void updateAndMove("SAVE", isLastQuestion)}
      />

      {resultView === "timeout" ? (
        <AttemptStatusPanel mode="timeout" candidateName={candidateName} onBack={navigateDashboard} />
      ) : null}
    </section>
  );
}
