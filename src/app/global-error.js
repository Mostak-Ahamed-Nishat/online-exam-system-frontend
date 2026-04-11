"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[var(--background-color)] text-[var(--text-primary)]">
        <div className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-[24px] font-semibold">A critical error occurred</h2>
          <p className="text-[14px] text-[var(--test-subtext)]">
            {error?.message || "Please reload and try again."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="h-11 rounded-[12px] bg-[var(--button-primary)] px-6 text-[14px] font-semibold text-[var(--button-white)] transition-opacity hover:opacity-95"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
