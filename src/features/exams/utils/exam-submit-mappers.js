function combineTimeToIso(timeValue) {
  const [hours, minutes] = String(timeValue || "")
    .split(":")
    .map((value) => Number(value));

  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number.isNaN(hours) ? 0 : hours,
    Number.isNaN(minutes) ? 0 : minutes,
    0,
    0,
  );

  return date.toISOString();
}

function stripHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function mapQuestionTypeToApi(typeValue) {
  const normalized = String(typeValue || "").toLowerCase();
  if (normalized === "radio") return "RADIO";
  if (normalized === "text") return "TEXT";
  return "CHECKBOX";
}

export function mapBasicInfoPayload(basicInfo) {
  return {
    title: basicInfo.title,
    totalCandidates: Number(basicInfo.totalCandidates),
    totalSlots: Number(basicInfo.totalSlots),
    totalQuestionSet: Number(basicInfo.totalQuestionSet),
    questionType: String(basicInfo.questionType || "").toUpperCase(),
    startTime: combineTimeToIso(basicInfo.startTime),
    endTime: combineTimeToIso(basicInfo.endTime),
    durationMinutes: Number(basicInfo.duration),
    attemptLimit: 1,
    immediateResultPublish: false,
    maxViolationLimit: 3,
    passThreshold: 40,
  };
}

export function mapQuestionPayload(question) {
  return {
    prompt: stripHtml(question.title),
    type: mapQuestionTypeToApi(question.type),
    marks: Number(question.score),
    negativeMarks: 0,
    options:
      question.type === "Text"
        ? []
        : (question.options || []).map((option) => ({
            text: stripHtml(option.content || option.label),
            isCorrect: Boolean(option.correct),
          })),
  };
}

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.data?.message || error?.error || error?.message || fallback;
}
