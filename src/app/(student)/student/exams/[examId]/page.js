"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { AttemptRichTextEditor } from "@/features/exams/components/attempt/attempt-rich-text-editor";
import {
  clearOfflineQueue,
  loadOfflineQueue,
  saveOfflineQueue,
} from "@/features/exams/utils/exam-attempt-offline-storage";
import {
  useLazyGetStudentCurrentQuestionQuery,
  useLazyGetStudentExamSessionQuery,
  useReportStudentIntegrityEventMutation,
  useStartStudentExamMutation,
  useSubmitStudentExamMutation,
  useSyncStudentOfflineAnswersMutation,
  useTimeoutSubmitStudentExamMutation,
  useUpdateStudentCurrentQuestionMutation,
} from "@/store/api/examApi";

function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.error || error?.message || fallback;
}

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds} left`;
}

function stripHtml(value) {
  const raw = String(value || "");
  if (typeof window === "undefined") {
    return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

function normalizeExamId(paramValue) {
  if (Array.isArray(paramValue)) {
    return paramValue[0] || "";
  }
  return paramValue || "";
}

function mapQueueUpsert(items, incoming) {
  const base = Array.isArray(items) ? [...items] : [];
  const foundIndex = base.findIndex((item) => item.questionOrder === incoming.questionOrder);

  if (foundIndex === -1) {
    base.push(incoming);
    return base;
  }

  base[foundIndex] = incoming;
  return base;
}

function OptionRow({
  option,
  type,
  checked,
  disabled,
  onToggle,
}) {
  const isRadio = type === "RADIO";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className="flex min-h-[64px] w-full cursor-pointer items-center gap-3 rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 text-left transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        className={[
          "inline-flex h-6 w-6 items-center justify-center border-2 border-[#aeb7c4] bg-[var(--background-white)]",
          isRadio ? "rounded-full" : "rounded-[6px]",
          checked ? "border-[var(--button-primary)] bg-[var(--button-lightblue)]" : "",
        ].join(" ")}
      >
        {checked ? (
          <span
            className={[
              "bg-[var(--button-primary)]",
              isRadio ? "h-3 w-3 rounded-full" : "h-3.5 w-3.5 rounded-[3px]",
            ].join(" ")}
          />
        ) : null}
      </span>
      <span className="text-[14px] font-normal leading-6 text-[var(--text-primary)]">{option.text}</span>
    </button>
  );
}

export default function StudentExamAttemptPage() {
  const router = useRouter();
  const params = useParams();
  const examId = useMemo(() => normalizeExamId(params?.examId), [params]);

  const [attemptState, setAttemptState] = useState(null);
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [deadlineTs, setDeadlineTs] = useState(null);

  const autoSubmitRef = useRef(false);
  const integrityCooldownRef = useRef(0);

  const [triggerGetSession] = useLazyGetStudentExamSessionQuery();
  const [triggerGetCurrentQuestion] = useLazyGetStudentCurrentQuestionQuery();
  const [startStudentExam] = useStartStudentExamMutation();
  const [updateCurrentQuestion] = useUpdateStudentCurrentQuestionMutation();
  const [submitStudentExam] = useSubmitStudentExamMutation();
  const [timeoutSubmitStudentExam] = useTimeoutSubmitStudentExamMutation();
  const [syncStudentOfflineAnswers] = useSyncStudentOfflineAnswersMutation();
  const [reportStudentIntegrityEvent] = useReportStudentIntegrityEventMutation();

  const applyQuestionState = useCallback((payload) => {
    if (!payload) return;

    setAttemptState(payload);
    const nextRemaining = Math.max(0, Number(payload.remainingSeconds) || 0);
    setDeadlineTs(Date.now() + nextRemaining * 1000);

    if (payload.currentAnswer?.status === "ANSWERED") {
      setSelectedOptionIndexes(payload.currentAnswer.selectedOptionIndexes ?? []);
      setAnswerText(payload.currentAnswer.answerText ?? "");
      return;
    }

    setSelectedOptionIndexes([]);
    setAnswerText("");
  }, []);

  const loadCurrentQuestion = useCallback(async () => {
    if (!examId) return null;
    const payload = await triggerGetCurrentQuestion(examId).unwrap();
    applyQuestionState(payload);
    return payload;
  }, [applyQuestionState, examId, triggerGetCurrentQuestion]);

  const flushOfflineQueue = useCallback(async () => {
    if (!examId || !isOnline || offlineQueue.length === 0) {
      return true;
    }

    const payload = {
      currentQuestionOrder: attemptState?.currentOrder,
      items: offlineQueue.map((item) => ({
        questionOrder: item.questionOrder,
        action: item.action,
        selectedOptionIndexes: item.selectedOptionIndexes ?? [],
        answerText: item.answerText ?? "",
      })),
    };

    try {
      await syncStudentOfflineAnswers({ examId, payload }).unwrap();
      setOfflineQueue([]);
      clearOfflineQueue(examId);
      toast.success("Offline answers synced.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Offline answer sync failed."));
      return false;
    }
  }, [attemptState?.currentOrder, examId, isOnline, offlineQueue, syncStudentOfflineAnswers]);

  const handleManualSubmit = useCallback(async () => {
    if (!examId) return;
    if (!isOnline) {
      toast.error("You are offline. Reconnect to submit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const synced = await flushOfflineQueue();
      if (!synced) return;

      await submitStudentExam(examId).unwrap();
      toast.success("Exam submitted successfully.");
      router.replace("/student/dashboard");
    } catch (error) {
      const message = getErrorMessage(error, "Failed to submit exam.");
      toast.error(message);
      if (error?.status === 404 || error?.status === 409) {
        router.replace("/student/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [examId, flushOfflineQueue, isOnline, router, submitStudentExam]);

  const handleAutoTimeoutSubmit = useCallback(async () => {
    if (!examId || autoSubmitRef.current) return;
    autoSubmitRef.current = true;
    setIsSubmitting(true);

    try {
      if (isOnline) {
        await flushOfflineQueue();
      }
      await timeoutSubmitStudentExam(examId).unwrap();
      toast.error("Time is over. Exam auto-submitted.");
      router.replace("/student/dashboard");
    } catch (error) {
      const message = getErrorMessage(error, "Session expired. Redirecting to dashboard.");
      toast.error(message);
      router.replace("/student/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  }, [examId, flushOfflineQueue, isOnline, router, timeoutSubmitStudentExam]);

  useEffect(() => {
    if (!examId) return;

    setIsInitializing(true);
    setLoadError("");
    setOfflineQueue(loadOfflineQueue(examId));
    setIsOnline(typeof navigator === "undefined" ? true : navigator.onLine);

    const initialize = async () => {
      try {
        try {
          await triggerGetSession(examId).unwrap();
        } catch (sessionError) {
          if (sessionError?.status === 404) {
            await startStudentExam(examId).unwrap();
          } else {
            throw sessionError;
          }
        }

        await loadCurrentQuestion();
      } catch (error) {
        setLoadError(getErrorMessage(error, "Unable to start exam session."));
      } finally {
        setIsInitializing(false);
      }
    };

    void initialize();
  }, [examId, loadCurrentQuestion, startStudentExam, triggerGetSession]);

  useEffect(() => {
    if (isInitializing || !deadlineTs || isSubmitting) return undefined;

    const timerId = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadlineTs - Date.now()) / 1000));

      setAttemptState((previous) =>
        previous
          ? {
              ...previous,
              remainingSeconds: remaining,
            }
          : previous,
      );

      if (remaining <= 0) {
        window.clearInterval(timerId);
        void handleAutoTimeoutSubmit();
      }
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [deadlineTs, handleAutoTimeoutSubmit, isInitializing, isSubmitting]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onOnline = () => {
      setIsOnline(true);
      void flushOfflineQueue();
      void loadCurrentQuestion();
      toast.success("Back online.");
    };

    const onOffline = () => {
      setIsOnline(false);
      toast.warning("You are offline. Answers will be queued locally.");
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [flushOfflineQueue, loadCurrentQuestion]);

  useEffect(() => {
    if (!examId || isInitializing) return undefined;

    const handleVisibility = () => {
      if (document.visibilityState !== "hidden") return;
      if (!isOnline) return;

      const now = Date.now();
      if (now - integrityCooldownRef.current < 1500) return;
      integrityCooldownRef.current = now;

      void (async () => {
        try {
          const result = await reportStudentIntegrityEvent({
            examId,
            payload: {
              eventType: "TAB_SWITCH",
              metadata: {
                occurredAt: new Date().toISOString(),
              },
            },
          }).unwrap();

          if (result?.autoSubmitted) {
            toast.error("Exam auto-submitted due to integrity violations.");
            router.replace("/student/dashboard");
            return;
          }

          if (typeof result?.remainingViolations === "number") {
            toast.warning(`Tab switch detected. Remaining chances: ${result.remainingViolations}`);
          }
        } catch (error) {
          if (error?.status === 404 || error?.status === 409) {
            toast.error("Session expired. Redirecting.");
            router.replace("/student/dashboard");
          }
        }
      })();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [examId, isInitializing, isOnline, reportStudentIntegrityEvent, router]);

  const currentQuestion = attemptState?.question;
  const currentOrder = attemptState?.currentOrder ?? 1;
  const totalQuestions = attemptState?.totalQuestions ?? 1;
  const remainingLabel = formatCountdown(attemptState?.remainingSeconds ?? 0);
  const isLastQuestion = currentOrder >= totalQuestions;
  const isTextType = currentQuestion?.type === "TEXT";
  const isRadioType = currentQuestion?.type === "RADIO";

  const validateCurrentAnswer = useCallback(
    (action) => {
      if (!currentQuestion) {
        toast.error("Question is not ready yet.");
        return false;
      }

      if (action !== "SAVE") {
        return true;
      }

      if (currentQuestion.type === "TEXT") {
        const plain = stripHtml(answerText);
        if (!plain) {
          toast.error("Please write your answer before saving.");
          return false;
        }
        return true;
      }

      if (!Array.isArray(selectedOptionIndexes) || selectedOptionIndexes.length < 1) {
        toast.error("Please select at least one option.");
        return false;
      }

      if (currentQuestion.type === "RADIO" && selectedOptionIndexes.length !== 1) {
        toast.error("Please select exactly one option.");
        return false;
      }

      return true;
    },
    [answerText, currentQuestion, selectedOptionIndexes],
  );

  const enqueueOfflineAction = useCallback(
    (action) => {
      if (!examId || !currentQuestion) return;

      const item = {
        questionOrder: currentQuestion.order,
        action,
        selectedOptionIndexes:
          action === "SAVE" && currentQuestion.type !== "TEXT" ? selectedOptionIndexes : [],
        answerText: action === "SAVE" && currentQuestion.type === "TEXT" ? answerText : "",
        queuedAt: new Date().toISOString(),
      };

      setOfflineQueue((previous) => {
        const next = mapQueueUpsert(previous, item);
        saveOfflineQueue(examId, next);
        return next;
      });
    },
    [answerText, currentQuestion, examId, selectedOptionIndexes],
  );

  const updateAndMove = useCallback(
    async (action, submitAfter = false) => {
      if (!examId || !currentQuestion) return;
      if (!validateCurrentAnswer(action)) return;

      if (!isOnline) {
        enqueueOfflineAction(action);
        toast.warning("Answer queued locally. Reconnect to continue.");
        return;
      }

      setIsSaving(true);
      try {
        const synced = await flushOfflineQueue();
        if (!synced) return;

        await updateCurrentQuestion({
          examId,
          payload: {
            action,
            selectedOptionIndexes:
              action === "SAVE" && currentQuestion.type !== "TEXT" ? selectedOptionIndexes : [],
            answerText: action === "SAVE" && currentQuestion.type === "TEXT" ? answerText : "",
          },
        }).unwrap();

        if (submitAfter) {
          await handleManualSubmit();
          return;
        }

        await loadCurrentQuestion();
      } catch (error) {
        const message = getErrorMessage(error, "Unable to save answer.");
        toast.error(message);
        if (error?.status === 404 || error?.status === 409) {
          router.replace("/student/dashboard");
        }
      } finally {
        setIsSaving(false);
      }
    },
    [
      answerText,
      currentQuestion,
      enqueueOfflineAction,
      examId,
      flushOfflineQueue,
      handleManualSubmit,
      isOnline,
      loadCurrentQuestion,
      router,
      selectedOptionIndexes,
      updateCurrentQuestion,
      validateCurrentAnswer,
    ],
  );

  if (isInitializing) {
    return (
      <section className="mx-auto w-full max-w-[1280px]">
        <LoadingState message="Preparing exam session..." />
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="mx-auto w-full max-w-[1280px]">
        <ErrorState
          message={loadError}
          retryLabel="Try again"
          onRetry={() => window.location.reload()}
        />
      </section>
    );
  }

  if (!attemptState || !currentQuestion) {
    return (
      <section className="mx-auto w-full max-w-[1280px]">
        <ErrorState message="Question could not be loaded." onRetry={() => void loadCurrentQuestion()} />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] pb-20">
      {!isOnline ? (
        <div className="mb-4 rounded-[10px] border border-[var(--button-warning)] bg-[#fff4f4] px-4 py-3 text-[14px] text-[var(--button-warning)]">
          Offline mode: answers are stored locally and will sync once your connection is back.
        </div>
      ) : null}

      <div className="rounded-[18px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-5 py-4 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[20px] font-semibold leading-[30px] text-[var(--text-primary)]">
            Question ({currentOrder}/{totalQuestions})
          </h2>
          <div className="inline-flex min-w-[220px] items-center justify-center rounded-[14px] bg-[#f1f3f7] px-6 py-3 text-[20px] font-semibold leading-[30px] text-[var(--text-primary)]">
            {remainingLabel}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[18px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-5 py-5 md:px-8 md:py-7">
        <h3 className="text-[20px] font-semibold leading-[30px] text-[var(--text-primary)]">
          Q{currentOrder}. {currentQuestion.prompt}
        </h3>

        <div className="mt-6 space-y-3">
          {isTextType ? (
            <AttemptRichTextEditor
              value={answerText}
              onChange={setAnswerText}
              placeholder="Type questions here.."
            />
          ) : (
            (currentQuestion.options || []).map((option) => {
              const checked = selectedOptionIndexes.includes(option.index);
              return (
                <OptionRow
                  key={`${currentQuestion.id}-${option.index}`}
                  option={option}
                  type={currentQuestion.type}
                  checked={checked}
                  disabled={isSaving || isSubmitting}
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
            disabled={isSaving || isSubmitting}
            onClick={() => void updateAndMove("SKIP", isLastQuestion)}
            className="h-12 min-w-[160px] rounded-[14px] border-[var(--border-inputfield)] px-5 text-[14px] font-semibold text-[var(--text-primary)] hover:bg-[#f8fafc]"
          >
            {isLastQuestion ? "Skip & Submit" : "Skip this Question"}
          </Button>

          <Button
            type="button"
            disabled={isSaving || isSubmitting}
            onClick={() => void updateAndMove("SAVE", isLastQuestion)}
            className="h-12 min-w-[160px] rounded-[14px] bg-[var(--button-primary)] px-5 text-[14px] font-semibold text-[var(--button-white)] hover:opacity-95 disabled:bg-[var(--button-disabled)]"
          >
            {isSaving || isSubmitting ? "Please wait..." : isLastQuestion ? "Save & Submit" : "Save & Continue"}
          </Button>
        </div>
      </div>
    </section>
  );
}
