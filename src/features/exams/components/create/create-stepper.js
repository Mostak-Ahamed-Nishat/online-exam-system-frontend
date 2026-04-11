import { Check } from "lucide-react";

function Step({ number, label, active, done }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-medium ${
          active || done
            ? "bg-[var(--button-primary)] text-[var(--button-white)]"
            : "bg-[var(--border-disabled)] text-[var(--test-subtext)]"
        }`}
      >
        {done ? <Check className="h-3 w-3" /> : number}
      </span>
      <span
        className={`text-[14px] ${
          active ? "font-medium text-[var(--button-primary)]" : "font-normal text-[var(--test-subtext)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function CreateStepHeader() {
  return (
    <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-4 sm:p-6">
      <h1 className="text-[36px] leading-[44px] text-[var(--text-primary)]">Manage Online Test</h1>
      <div className="mt-5 flex items-center gap-3">
        <Step number={1} label="Basic Info" active />
        <span className="h-px w-14 bg-[var(--border-disabled)]" />
        <Step number={2} label="Questions" />
      </div>
    </div>
  );
}

