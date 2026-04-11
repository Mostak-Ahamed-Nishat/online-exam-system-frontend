"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "./rich-text-editor";
import { questionModalSchema, toPlainText } from "../../validation/question-modal.schema";

const QUESTION_TYPES = ["Checkbox", "Radio", "Text"];
const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function createDefaultOption(index = 0) {
  return {
    id: `opt-${Date.now()}-${index}`,
    content: "",
    correct: false,
  };
}

function createDefaultForm(questionType = "Checkbox") {
  return {
    title: "",
    score: 1,
    type: questionType,
    textAnswer: "",
    options: [createDefaultOption(0)],
  };
}

function toFormState(question, forcedType) {
  if (!question) {
    return createDefaultForm(forcedType || "Checkbox");
  }

  return {
    title: question.title ?? "",
    score: question.score ?? 1,
    type: forcedType || question.type || "Checkbox",
    textAnswer: question.textAnswer ?? "",
    options:
      question.options?.map((option, index) => ({
        id: option.id ?? `opt-${index}`,
        content: option.content ?? option.text ?? option.label ?? "",
        correct: Boolean(option.correct),
      })) ?? [createDefaultOption(0)],
  };
}

function normalizeForcedType(forcedType) {
  return QUESTION_TYPES.includes(forcedType) ? forcedType : null;
}

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
    typeof errors.options?.message === "string" ? errors.options.message : null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] h-dvh w-screen overflow-y-auto bg-black/45 p-3 sm:p-6">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="my-3 flex max-h-[94dvh] w-full max-w-[980px] flex-col rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-3 py-3 shadow-[0_18px_55px_rgba(15,23,42,0.2)] sm:my-0 sm:px-6 sm:py-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-disabled)] text-[12px] font-medium text-[var(--test-subtext)]">
                {questionNumber}
              </span>
              <h2 className="text-[22px] font-medium leading-[30px] text-[var(--text-primary)] sm:text-[28px] sm:leading-[36px]">
                Question {questionNumber}
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">Score:</span>
              <Controller
                control={control}
                name="score"
                render={({ field }) => (
                  <input
                    type="number"
                    min={1}
                    value={field.value}
                    onChange={(event) => field.onChange(Math.max(1, Number(event.target.value || 1)))}
                    className="h-8 w-12 rounded-[8px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-2 text-center text-[14px] text-[var(--text-primary)]"
                  />
                )}
              />

              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(event) => onQuestionTypeChange(event.target.value)}
                  disabled={Boolean(fixedType)}
                  className="h-8 min-w-[110px] cursor-pointer appearance-none rounded-[8px] border border-[var(--border-inputfield)] bg-[var(--background-white)] pl-3 pr-8 text-[14px] font-medium text-[var(--text-primary)] disabled:cursor-not-allowed disabled:bg-[var(--background-color)]"
                >
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon-gray)]" />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onDeleteQuestion) {
                    onDeleteQuestion();
                  }
                  onClose();
                }}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] text-[var(--icon-gray)] transition-colors hover:bg-[var(--background-color)] hover:text-[var(--button-warning)]"
                aria-label="Delete question"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] text-[var(--icon-gray)] transition-colors hover:bg-[var(--background-color)] hover:text-[var(--text-primary)]"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {errors.score?.message ? (
            <p className="-mt-1 mb-2 text-[12px] text-[var(--button-warning)]">{errors.score.message}</p>
          ) : null}

          <div className="flex-1 space-y-4 overflow-y-auto pr-0 sm:pr-1">
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write question title..."
                />
              )}
            />
            {errors.title?.message ? (
              <p className="text-[12px] text-[var(--button-warning)]">{errors.title.message}</p>
            ) : null}

          {isTextType ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-[14px] text-[var(--test-subtext)]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-inputfield)] text-[12px] font-semibold">
                  A
                </span>
              </div>
              <Controller
                control={control}
                name="textAnswer"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write text answer..."
                    compact
                  />
                )}
              />
              {errors.textAnswer?.message ? (
                <p className="text-[12px] text-[var(--button-warning)]">{errors.textAnswer.message}</p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => {
                const checked = Boolean(watch(`options.${index}.correct`));

                return (
                  <div key={field.id} className="space-y-2">
                    <div className="flex flex-col gap-2 text-[14px] text-[var(--test-subtext)] sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-inputfield)] text-[12px] font-semibold">
                          {OPTION_LETTERS[index]}
                        </span>
                        <input
                          type={selectedType === "Radio" ? "radio" : "checkbox"}
                          checked={checked}
                          onChange={() => toggleCorrect(index)}
                          className="h-4 w-4 cursor-pointer rounded border-[var(--border-inputfield)]"
                        />
                        <span className="font-medium">Set as correct answer</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center self-end rounded-[8px] text-[var(--icon-gray)] transition-colors hover:bg-[var(--background-color)] hover:text-[var(--button-warning)] sm:self-auto"
                        aria-label="Remove option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Controller
                      control={control}
                      name={`options.${index}.content`}
                      render={({ field: optionField }) => (
                        <RichTextEditor
                          value={optionField.value}
                          onChange={optionField.onChange}
                          placeholder="Write option..."
                          compact
                        />
                      )}
                    />
                  </div>
                );
              })}

              {canAddOption ? (
                <button
                  type="button"
                  onClick={() => append(createDefaultOption(fields.length))}
                  className="inline-flex cursor-pointer items-center gap-2 text-[20px] font-normal leading-[30px] text-[var(--button-primary)] transition-opacity hover:opacity-80"
                >
                  <Plus className="h-4 w-4" /> Another options
                </button>
              ) : null}

              {optionErrorMessage ? (
                <p className="text-[12px] text-[var(--button-warning)]">{optionErrorMessage}</p>
              ) : null}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-3 border-t border-[var(--border-disabled)] pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-end sm:pt-5">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => saveByMode(false)()}
            className={cn(
              "h-12 w-full rounded-[12px] border-[var(--border-primary)] bg-[var(--background-white)] px-6 text-[18px] font-normal text-[var(--button-primary)] hover:bg-[var(--button-lightblue)] sm:min-w-[124px] sm:w-auto sm:text-[20px]",
            )}
          >
            <span className="inline-flex items-center gap-2">
              {isSubmitting ? <Spinner className="h-4 w-4" /> : null}
              {isSubmitting ? "Saving..." : "Save"}
            </span>
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => saveByMode(true)()}
            className="h-12 w-full rounded-[12px] bg-[var(--button-primary)] px-6 text-[18px] font-normal text-[var(--button-white)] hover:opacity-95 sm:min-w-[180px] sm:w-auto sm:text-[20px]"
          >
            <span className="inline-flex items-center gap-2">
              {isSubmitting ? <Spinner className="h-4 w-4" /> : null}
              {isSubmitting ? "Saving..." : "Save & Add More"}
            </span>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
