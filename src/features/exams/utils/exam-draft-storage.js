export const EXAM_DRAFT_STORAGE_KEY = "exam_create_draft_v1";

export function loadExamDraftFromStorage() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(EXAM_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      basicInfo: parsed?.basicInfo ?? null,
      questions: Array.isArray(parsed?.questions) ? parsed.questions : [],
    };
  } catch (_error) {
    return null;
  }
}

export function saveExamDraftToStorage(examDraftState) {
  if (typeof window === "undefined") return;
  if (!examDraftState?.hydrated) return;

  const payload = {
    basicInfo: examDraftState.basicInfo ?? null,
    questions: Array.isArray(examDraftState.questions) ? examDraftState.questions : [],
  };

  try {
    window.localStorage.setItem(EXAM_DRAFT_STORAGE_KEY, JSON.stringify(payload));
  } catch (_error) {
    // Intentionally ignore storage quota and serialization errors.
  }
}

export function clearExamDraftFromStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(EXAM_DRAFT_STORAGE_KEY);
  } catch (_error) {
    // Ignore storage errors.
  }
}
