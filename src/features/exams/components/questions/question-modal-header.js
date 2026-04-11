"use client";

import { Controller } from "react-hook-form";
import { ChevronDown, Trash2, X } from "lucide-react";
import { QUESTION_TYPES } from "./question-modal-constants";

export function QuestionModalHeader({
  questionNumber,
  control,
  selectedType,
  fixedType,
  onQuestionTypeChange,
  onDeleteAndClose,
  onClose,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-disabled)] text-xs font-medium text-[var(--test-subtext)]">
          {questionNumber}
        </span>
        <h2 className="text-[22px] font-medium leading-[30px] text-[var(--text-primary)] sm:text-[28px] sm:leading-9">
          Question {questionNumber}
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        <span className="text-sm font-semibold text-[var(--text-primary)]">Score:</span>
        <Controller
          control={control}
          name="score"
          render={({ field }) => (
            <input
              type="number"
              min={1}
              value={field.value}
              onChange={(event) => field.onChange(Math.max(1, Number(event.target.value || 1)))}
              className="h-8 w-12 rounded-lg border border-[var(--border-inputfield)] bg-[var(--background-white)] px-2 text-center text-sm text-[var(--text-primary)]"
            />
          )}
        />

        <div className="relative">
          <select
            value={selectedType}
            onChange={(event) => onQuestionTypeChange(event.target.value)}
            disabled={Boolean(fixedType)}
            className="h-8 min-w-[110px] cursor-pointer appearance-none rounded-lg border border-[var(--border-inputfield)] bg-[var(--background-white)] pl-3 pr-8 text-sm font-medium text-[var(--text-primary)] disabled:cursor-not-allowed disabled:bg-[var(--background-color)]"
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
          onClick={onDeleteAndClose}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--icon-gray)] transition-colors hover:bg-[var(--background-color)] hover:text-[var(--button-warning)]"
          aria-label="Delete question"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--icon-gray)] transition-colors hover:bg-[var(--background-color)] hover:text-[var(--text-primary)]"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
