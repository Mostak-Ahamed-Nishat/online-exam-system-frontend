"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { questionModalSchema, toPlainText } from "../../validation/question-modal.schema";
import { OPTION_LETTERS } from "./question-modal-constants";
import {
  createDefaultForm,
  createDefaultOption,
  normalizeForcedType,
  toFormState,
} from "./question-modal-form-helpers";
import { QuestionModalAnswerFields } from "./question-modal-answer-fields";
import { QuestionModalFooterActions } from "./question-modal-footer-actions";
import { QuestionModalHeader } from "./question-modal-header";

const RichTextEditor = dynamic(
  () => import("./rich-text-editor").then((module) => module.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[120px] w-full rounded-[10px] border border-[var(--border-disabled)] bg-[var(--background-white)]" />
    ),
  },
);

export function QuestionModalShell({
  isOpen,
  onClose,
  onSave,
  onDeleteQuestion,
  questionNumber = 1,
  initialQuestion = null,
  forcedType = null,
  resetSignal = 0,
}) {
  const fixedType = normalizeForcedType(forcedType);
  const [portalReady, setPortalReady] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(questionModalSchema),
    defaultValues: createDefaultForm(fixedType || "Checkbox"),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const selectedType = watch("type");
  const isTextType = selectedType === "Text";

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    reset(toFormState(initialQuestion, fixedType));

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, initialQuestion, fixedType, resetSignal, reset]);

  useEffect(() => {
    if (!isOpen || !portalReady) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, portalReady]);

  const canAddOption = useMemo(() => fields.length < OPTION_LETTERS.length, [fields.length]);

  if (!isOpen || !portalReady) return null;

  const toggleCorrect = (targetIndex) => {
    const current = getValues("options") || [];

    if (selectedType === "Radio") {
      const next = current.map((option, index) => ({
        ...option,
        correct: index === targetIndex,
      }));
      setValue("options", next, { shouldDirty: true, shouldValidate: true });
      return;
    }

    const next = current.map((option, index) =>
      index === targetIndex ? { ...option, correct: !option.correct } : option,
    );
    setValue("options", next, { shouldDirty: true, shouldValidate: true });
  };

  const onQuestionTypeChange = (nextType) => {
    if (fixedType) return;

    setValue("type", nextType, { shouldDirty: true, shouldValidate: true });
    if (nextType !== "Text" && (getValues("options") || []).length === 0) {
      append(createDefaultOption(0));
    }
  };

  const saveByMode = (keepOpen) =>
    handleSubmit(async (values) => {
      const payload = {
        title: values.title,
        score: Number(values.score),
        type: values.type,
        textAnswer: values.type === "Text" ? values.textAnswer : "",
        options:
          values.type === "Text"
            ? []
            : values.options
                .filter((option) => toPlainText(option.content))
                .map((option, index) => ({
                  id: option.id,
                  content: option.content,
                  label: `${OPTION_LETTERS[index]}. ${toPlainText(option.content)}`,
                  correct: option.correct,
                })),
      };

      await onSave?.(payload, { keepOpen });

      if (keepOpen) {
        reset(createDefaultForm(fixedType || values.type));
      } else {
        onClose();
      }
    });

  const optionErrorMessage =
    typeof errors.options?.message === "string"
      ? errors.options.message
      : typeof errors.options?.root?.message === "string"
        ? errors.options.root.message
        : Array.isArray(errors.options)
          ? errors.options.find((item) => typeof item?.content?.message === "string")?.content?.message || null
          : null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] h-dvh w-screen overflow-y-auto bg-black/45 p-3 sm:p-6">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="my-3 flex max-h-[94dvh] w-full max-w-[980px] flex-col rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-3 py-3 shadow-[0_18px_55px_rgba(15,23,42,0.2)] sm:my-0 sm:px-6 sm:py-6">
          <QuestionModalHeader
            questionNumber={questionNumber}
            control={control}
            selectedType={selectedType}
            fixedType={fixedType}
            onQuestionTypeChange={onQuestionTypeChange}
            onDeleteAndClose={() => {
              if (onDeleteQuestion) {
                onDeleteQuestion();
              }
              onClose();
            }}
            onClose={onClose}
          />

          {errors.score?.message ? (
            <p className="-mt-1 mb-2 text-xs text-[var(--button-warning)]">{errors.score.message}</p>
          ) : null}

          <QuestionModalAnswerFields
            control={control}
            errors={errors}
            fields={fields}
            selectedType={selectedType}
            isTextType={isTextType}
            watch={watch}
            toggleCorrect={toggleCorrect}
            remove={remove}
            append={append}
            canAddOption={canAddOption}
            optionErrorMessage={optionErrorMessage}
            RichTextEditor={RichTextEditor}
            createDefaultOption={createDefaultOption}
          />

          <QuestionModalFooterActions
            isSubmitting={isSubmitting}
            onSave={() => saveByMode(false)()}
            onSaveAndAddMore={() => saveByMode(true)()}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
