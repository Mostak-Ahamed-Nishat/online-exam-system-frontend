export function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.error || error?.message || fallback;
}

export function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds} left`;
}

export function stripHtml(value) {
  const raw = String(value || "");
  if (typeof window === "undefined") {
    return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function normalizeExamId(paramValue) {
  if (Array.isArray(paramValue)) {
    return paramValue[0] || "";
  }
  return paramValue || "";
}

export function mapQueueUpsert(items, incoming) {
  const base = Array.isArray(items) ? [...items] : [];
  const foundIndex = base.findIndex((item) => item.questionOrder === incoming.questionOrder);

  if (foundIndex === -1) {
    base.push(incoming);
    return base;
  }

  base[foundIndex] = incoming;
  return base;
}

export function getAttemptAnswerValidationError({
  action,
  answerText,
  currentQuestion,
  selectedOptionIndexes,
}) {
  if (!currentQuestion) {
    return "Question is not ready yet.";
  }

  if (action !== "SAVE") {
    return null;
  }

  if (currentQuestion.type === "TEXT") {
    return stripHtml(answerText) ? null : "Please write your answer before saving.";
  }

  if (!Array.isArray(selectedOptionIndexes) || selectedOptionIndexes.length < 1) {
    return "Please select at least one option.";
  }

  if (currentQuestion.type === "RADIO" && selectedOptionIndexes.length !== 1) {
    return "Please select exactly one option.";
  }

  return null;
}
