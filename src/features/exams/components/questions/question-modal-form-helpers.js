import { QUESTION_TYPES } from "./question-modal-constants";

let optionIdCounter = 0;

export function createDefaultOption(index = 0) {
  optionIdCounter += 1;
  return {
    id: `opt-${index}-${optionIdCounter}`,
    content: "",
    correct: false,
  };
}

export function createDefaultForm(questionType = "Checkbox") {
  return {
    title: "",
    score: 1,
    type: questionType,
    textAnswer: "",
    options: [createDefaultOption(0)],
  };
}

export function toFormState(question, forcedType) {
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

export function normalizeForcedType(forcedType) {
  return QUESTION_TYPES.includes(forcedType) ? forcedType : null;
}
