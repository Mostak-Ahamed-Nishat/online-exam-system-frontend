"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { loadOfflineQueue } from "@/features/exams/utils/exam-attempt-offline-storage";
import { getErrorMessage } from "@/features/exams/utils/student-exam-attempt-helpers";

export function useAttemptInitializationEffect({
  examId,
  loadCurrentQuestion,
  setIsInitializing,
  setLoadError,
  setOfflineQueue,
  setIsOnline,
  startStudentExam,
  triggerGetSession,
}) {
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
  }, [
    examId,
    loadCurrentQuestion,
    setIsInitializing,
    setLoadError,
    setOfflineQueue,
    setIsOnline,
    startStudentExam,
    triggerGetSession,
  ]);
}

export function useAttemptTimerEffect({
  deadlineTs,
  handleAutoTimeoutSubmit,
  isInitializing,
  isSubmitting,
  resultView,
  setAttemptState,
}) {
  useEffect(() => {
    if (isInitializing || !deadlineTs || isSubmitting || resultView) return undefined;

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
  }, [deadlineTs, handleAutoTimeoutSubmit, isInitializing, isSubmitting, resultView, setAttemptState]);
}

export function useAttemptNetworkEffect({
  flushOfflineQueue,
  loadCurrentQuestion,
  setIsOnline,
}) {
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
  }, [flushOfflineQueue, loadCurrentQuestion, setIsOnline]);
}

export function useAttemptIntegrityEffect({
  examId,
  integrityCooldownRef,
  isInitializing,
  isOnline,
  navigateDashboard,
  reportStudentIntegrityEvent,
  resultView,
  setResultView,
}) {
  useEffect(() => {
    if (!examId || isInitializing || resultView) return undefined;

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
            setResultView("timeout");
            return;
          }

          if (typeof result?.remainingViolations === "number") {
            toast.warning(`Tab switch detected. Remaining chances: ${result.remainingViolations}`);
          }
        } catch (error) {
          if (error?.status === 409) {
            setResultView("timeout");
            return;
          }

          if (error?.status === 404) {
            toast.error("Session expired. Redirecting.");
            navigateDashboard();
          }
        }
      })();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [
    examId,
    integrityCooldownRef,
    isInitializing,
    isOnline,
    navigateDashboard,
    reportStudentIntegrityEvent,
    resultView,
    setResultView,
  ]);
}
