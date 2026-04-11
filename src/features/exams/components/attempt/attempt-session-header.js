"use client";

export function AttemptSessionHeader({ currentOrder, totalQuestions, remainingLabel }) {
  return (
    <div className="rounded-[18px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-5 py-4 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold leading-normal text-[var(--text-primary)]">
          Question ({currentOrder}/{totalQuestions})
        </h2>
        <div className="inline-flex min-w-[220px] items-center justify-center rounded-[14px] bg-[#f1f3f7] px-6 py-3 text-xl font-semibold leading-normal text-[var(--text-primary)]">
          {remainingLabel}
        </div>
      </div>
    </div>
  );
}
