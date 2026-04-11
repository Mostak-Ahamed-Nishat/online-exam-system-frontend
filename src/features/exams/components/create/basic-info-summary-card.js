import { PencilLine } from "lucide-react";

function displayValue(value) {
  const raw = String(value ?? "").trim();
  return raw ? raw : "-";
}

function formatBdTime(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";

  const match = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) return raw;

  const hours = Number(match[1]);
  const minutes = match[2];
  const normalizedHour = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  return `${normalizedHour}:${minutes} ${period} (BDT)`;
}

function SummaryField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-normal text-[var(--test-subtext)]">{label}</p>
      <p className="mt-1 text-md  font-medium leading-6 text-[var(--text-primary)]">
        {displayValue(value)}
      </p>
    </div>
  );
}

export function BasicInfoSummaryCard({ info, onEdit }) {
  return (
    <div className="rounded-[14px] border border-[var(--border-disabled)] bg-[var(--background-white)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold leading-none text-[var(--text-primary)]">
          Basic Information
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex cursor-pointer items-center gap-2 text-xl font-medium text-[var(--button-primary)] transition-opacity hover:opacity-80"
        >
          <PencilLine className="h-4 w-4" /> Edit
        </button>
      </div>

      <div className="mt-5 space-y-6">
        <SummaryField label="Online Test Title" value={info.title} />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryField label="Total Candidates" value={info.totalCandidates} />
          <SummaryField label="Total Slots" value={info.totalSlots} />
          <SummaryField
            label="Total Question Set"
            value={info.totalQuestionSet}
          />
          <SummaryField
            label="Duration Per Slots (Minutes)"
            value={info.duration}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <SummaryField label="Question Type" value={info.questionType} />
          <SummaryField label="Start Time" value={formatBdTime(info.startTime)} />
          <SummaryField label="End Time" value={formatBdTime(info.endTime)} />
        </div>
      </div>
    </div>
  );
}
