"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useAddExamQuestionMutation, useCreateExamBasicInfoMutation, useDeleteExamMutation } from "@/store/api/examApi";
import { clearExamDraft } from "@/store/slices/examDraftSlice";
import { clearExamDraftFromStorage } from "../utils/exam-draft-storage";
import { getApiErrorMessage, mapBasicInfoPayload, mapQuestionPayload } from "../utils/exam-submit-mappers";

export function useCreateExamSubmit() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [submitPhase, setSubmitPhase] = useState("idle");
  const [submitError, setSubmitError] = useState(null);
  const [createExamBasicInfo] = useCreateExamBasicInfoMutation();
  const [addExamQuestion] = useAddExamQuestionMutation();
  const [deleteExam] = useDeleteExamMutation();

  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const submitExam = useCallback(async ({ basicInfo, questions }) => {
    setSubmitError(null);
    setSubmitPhase("validating");

    if (!basicInfo) {
      const message = "Please complete Basic Information first.";
      setSubmitError(message);
      setSubmitPhase("idle");
      toast.error(message);
      router.push("/admin/exams/create");
      return false;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      const message = "Please add at least one question.";
      setSubmitError(message);
      setSubmitPhase("idle");
      toast.error(message);
      return false;
    }

    let createdExamId = null;
    setIsSubmittingExam(true);

    try {
      setSubmitPhase("creating_exam");
      const created = await createExamBasicInfo(mapBasicInfoPayload(basicInfo)).unwrap();
      createdExamId = created?.data?.id;

      if (!createdExamId) {
        throw new Error("Exam ID not found in create response.");
      }

      setSubmitPhase("adding_questions");
      for (const question of questions) {
        await addExamQuestion({
          examId: createdExamId,
          payload: mapQuestionPayload(question),
        }).unwrap();
      }

      dispatch(clearExamDraft());
      clearExamDraftFromStorage();
      toast.success("Exam created successfully.");
      router.push("/admin/dashboard");
      return true;
    } catch (error) {
      if (createdExamId) {
        try {
          await deleteExam(createdExamId).unwrap();
        } catch (_rollbackError) {
          // Keep silent; main error toast is enough for user-facing flow.
        }
      }

      const message = getApiErrorMessage(error, "Failed to create exam.");
      setSubmitError(message);
      setSubmitPhase("error");
      toast.error(message);
      return false;
    } finally {
      setIsSubmittingExam(false);
      setSubmitPhase("idle");
    }
  }, [addExamQuestion, createExamBasicInfo, deleteExam, dispatch, router]);

  return {
    isSubmittingExam,
    submitPhase,
    submitError,
    clearSubmitError,
    submitExam,
  };
}
