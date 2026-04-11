"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  clearOfflineQueue,
  saveOfflineQueue,
} from "@/features/exams/utils/exam-attempt-offline-storage";
import {
  formatCountdown,
  getAttemptAnswerValidationError,
  getErrorMessage,
  mapQueueUpsert,
  normalizeExamId,
} from "@/features/exams/utils/student-exam-attempt-helpers";
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
import { selectAuthUser } from "@/store/slices/authSlice";
import {
  useAttemptInitializationEffect,
  useAttemptIntegrityEffect,
  useAttemptNetworkEffect,
  useAttemptTimerEffect,
} from "./use-student-exam-attempt-effects";

export function useStudentExamAttempt() {
  const router = useRouter();
  const params = useParams();
  const examId = useMemo(() => normalizeExamId(params?.examId), [params]);
  const authUser = useSelector(selectAuthUser);

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
  const [resultView, setResultView] = useState(null);

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

  const navigateDashboard = useCallback(() => {
    router.replace("/student/dashboard");
  }, [router]);

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
    if (!examId || resultView) return;

    if (!isOnline) {
      toast.error("You are offline. Reconnect to submit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const synced = await flushOfflineQueue();
      if (!synced) return;

      await submitStudentExam(examId).unwrap();
      setResultView("completed");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to submit exam."));

      if (error?.status === 409) {
        setResultView("timeout");
        return;
      }

      if (error?.status === 404) {
        navigateDashboard();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [examId, flushOfflineQueue, isOnline, navigateDashboard, resultView, submitStudentExam]);

  const handleAutoTimeoutSubmit = useCallback(async () => {
    if (!examId || autoSubmitRef.current) return;
    autoSubmitRef.current = true;
    setIsSubmitting(true);

    try {
      if (isOnline) {
        await flushOfflineQueue();
      }
      await timeoutSubmitStudentExam(examId).unwrap();
      setResultView("timeout");
    } catch (error) {
      toast.error(getErrorMessage(error, "Session expired."));
      setResultView("timeout");
    } finally {
      setIsSubmitting(false);
    }
  }, [examId, flushOfflineQueue, isOnline, timeoutSubmitStudentExam]);

  useAttemptInitializationEffect({
    examId,
    loadCurrentQuestion,
    setIsInitializing,
    setLoadError,
    setOfflineQueue,
    setIsOnline,
    startStudentExam,
    triggerGetSession,
  });

  useAttemptTimerEffect({
    deadlineTs,
    handleAutoTimeoutSubmit,
    isInitializing,
    isSubmitting,
    resultView,
    setAttemptState,
  });

  useAttemptNetworkEffect({
    flushOfflineQueue,
    loadCurrentQuestion,
    setIsOnline,
  });

  useAttemptIntegrityEffect({
    examId,
    integrityCooldownRef,
    isInitializing,
    isOnline,
    navigateDashboard,
    reportStudentIntegrityEvent,
    resultView,
    setResultView,
  });

  const currentQuestion = attemptState?.question;
  const currentOrder = attemptState?.currentOrder ?? 1;
  const totalQuestions = attemptState?.totalQuestions ?? 1;
  const remainingLabel = formatCountdown(attemptState?.remainingSeconds ?? 0);
  const isLastQuestion = currentOrder >= totalQuestions;
  const isTextType = currentQuestion?.type === "TEXT";
  const isRadioType = currentQuestion?.type === "RADIO";
  const candidateName = authUser?.fullName || authUser?.name || "Candidate";

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
      if (!examId || !currentQuestion || resultView) return;
      const validationError = getAttemptAnswerValidationError({
        action,
        answerText,
        currentQuestion,
        selectedOptionIndexes,
      });
      if (validationError) {
        toast.error(validationError);
        return;
      }

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
        toast.error(getErrorMessage(error, "Unable to save answer."));

        if (error?.status === 409) {
          setResultView("timeout");
          return;
        }

        if (error?.status === 404) {
          navigateDashboard();
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
      navigateDashboard,
      resultView,
      selectedOptionIndexes,
      updateCurrentQuestion,
    ],
  );

  return {
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
  };
}
