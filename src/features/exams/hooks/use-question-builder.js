"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeDraftQuestion,
  selectDraftBasicInfo,
  selectDraftQuestions,
  upsertDraftQuestion,
} from "@/store/slices/examDraftSlice";
import { useExamDraftHydration } from "./use-exam-draft-hydration";

function resolveDefaultQuestionType(examType) {
  const normalized = String(examType || "").toLowerCase();
  if (normalized === "mcq") return "Checkbox";
  if (normalized === "radio") return "Radio";
  if (normalized === "text") return "Text";
  return "Checkbox";
}

export function useQuestionBuilder() {
  const dispatch = useDispatch();
  const hydrated = useExamDraftHydration();
  const questions = useSelector(selectDraftQuestions);
  const basicInfo = useSelector(selectDraftBasicInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [modalResetSignal, setModalResetSignal] = useState(0);

  const editingQuestion = useMemo(
    () => questions.find((question) => question.id === editingQuestionId) ?? null,
    [editingQuestionId, questions],
  );

  const nextQuestionNumber = editingQuestion
    ? questions.findIndex((item) => item.id === editingQuestion.id) + 1
    : questions.length + 1;
  const forcedQuestionType =
    basicInfo?.questionType && String(basicInfo.questionType).toLowerCase() !== "mixed"
      ? resolveDefaultQuestionType(basicInfo.questionType)
      : null;

  const openAddQuestion = () => {
    setEditingQuestionId(null);
    setIsModalOpen(true);
  };

  const openEditQuestion = (questionId) => {
    setEditingQuestionId(questionId);
    setIsModalOpen(true);
  };

  const removeQuestion = (questionId) => {
    dispatch(removeDraftQuestion(questionId));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestionId(null);
  };

  const saveQuestion = async (payload, { keepOpen }) => {
    const questionId = editingQuestionId || `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    dispatch(
      upsertDraftQuestion({
        id: questionId,
        ...payload,
      }),
    );

    if (editingQuestionId) {
      if (keepOpen) {
        setEditingQuestionId(null);
        setModalResetSignal((prev) => prev + 1);
      }
      return;
    }

    if (keepOpen) {
      setModalResetSignal((prev) => prev + 1);
    }
  };

  return {
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
  };
}
