"use client";

export function AttemptOfflineNotice({ isOnline }) {
  if (isOnline) return null;

  return (
    <div className="mb-4 rounded-[10px] border border-[var(--button-warning)] bg-[#fff4f4] px-4 py-3 text-sm text-[var(--button-warning)]">
      Offline mode: answers are stored locally and will sync once your connection is back.
    </div>
  );
}
