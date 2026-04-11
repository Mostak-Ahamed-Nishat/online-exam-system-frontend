const OFFLINE_QUEUE_PREFIX = "exam_attempt_offline_queue_v1_";

function getQueueKey(examId) {
  return `${OFFLINE_QUEUE_PREFIX}${examId}`;
}

export function loadOfflineQueue(examId) {
  if (typeof window === "undefined" || !examId) {
    return [];
  }

  try {
    const raw = localStorage.getItem(getQueueKey(examId));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && typeof item === "object");
  } catch (_error) {
    return [];
  }
}

export function saveOfflineQueue(examId, items) {
  if (typeof window === "undefined" || !examId) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    localStorage.removeItem(getQueueKey(examId));
    return;
  }

  localStorage.setItem(getQueueKey(examId), JSON.stringify(items));
}

export function clearOfflineQueue(examId) {
  if (typeof window === "undefined" || !examId) {
    return;
  }

  localStorage.removeItem(getQueueKey(examId));
}

