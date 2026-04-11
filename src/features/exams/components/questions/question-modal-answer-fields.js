"use client";

import { Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { OPTION_LETTERS } from "./question-modal-constants";

export function QuestionModalAnswerFields({
  control,
  errors,
  fields,
  selectedType,
  isTextType,
  watch,
  toggleCorrect,
  remove,
  append,
  canAddOption,
  optionErrorMessage,
  RichTextEditor,
  createDefaultOption,
}) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto pr-0 sm:pr-1">
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Write question title..." />
        )}
      />
      {errors.title?.message ? <p className="text-xs text-[var(--button-warning)]">{errors.title.message}</p> : null}

      {isTextType ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm text-[var(--test-subtext)]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-inputfield)] text-xs font-semibold">
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
            <p className="text-xs text-[var(--button-warning)]">{errors.textAnswer.message}</p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const checked = Boolean(watch(`options.${index}.correct`));

            return (
              <div key={field.id} className="space-y-2">
                <div className="flex flex-col gap-2 text-sm text-[var(--test-subtext)] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-inputfield)] text-xs font-semibold">
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
                    className="inline-flex h-7 w-7 cursor-pointer items-center justify-center self-end rounded-lg text-[var(--icon-gray)] transition-colors hover:bg-[var(--background-color)] hover:text-[var(--button-warning)] sm:self-auto"
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
              className="inline-flex cursor-pointer items-center gap-2 text-xl font-normal leading-normal text-[var(--button-primary)] transition-opacity hover:opacity-80"
            >
              <Plus className="h-4 w-4" /> Another options
            </button>
          ) : null}

          {optionErrorMessage ? <p className="text-xs text-[var(--button-warning)]">{optionErrorMessage}</p> : null}
        </div>
      )}
    </div>
  );
}
