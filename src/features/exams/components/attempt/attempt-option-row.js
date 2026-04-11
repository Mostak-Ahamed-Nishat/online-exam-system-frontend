"use client";

export function AttemptOptionRow({ option, type, checked, disabled, onToggle }) {
  const isRadio = type === "RADIO";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className="flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 text-left transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        className={[
          "inline-flex h-6 w-6 items-center justify-center border-2 border-[#aeb7c4] bg-[var(--background-white)]",
          isRadio ? "rounded-full" : "rounded-md",
          checked ? "border-[var(--button-primary)] bg-[var(--button-lightblue)]" : "",
        ].join(" ")}
      >
        {checked ? (
          <span
            className={[
              "bg-[var(--button-primary)]",
              isRadio ? "h-3 w-3 rounded-full" : "h-3.5 w-3.5 rounded-[3px]",
            ].join(" ")}
          />
        ) : null}
      </span>
      <span className="text-sm font-normal leading-6 text-[var(--text-primary)]">{option.text}</span>
    </button>
  );
}
