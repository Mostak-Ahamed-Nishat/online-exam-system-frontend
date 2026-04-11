"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Keep a lightweight log for debugging in dev.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-[960px] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-[24px] font-semibold text-[var(--text-primary)]">Something went wrong</h2>
      <p className="text-[14px] text-[var(--test-subtext)]">
        Please try again. If the problem continues, refresh the page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="h-11 rounded-[12px] bg-[var(--button-primary)] px-6 text-[14px] font-semibold text-[var(--button-white)] transition-opacity hover:opacity-95"
      >
        Try again
      </button>
    </div>
  );
}
