"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  completed: {
    title: "Test Completed",
    imageSrc: "/assets/Complete.png",
    imageAlt: "Test completed",
    containerClass:
      "rounded-[18px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-6 py-12 text-center md:px-10 md:py-16",
    description: (candidateName) =>
      `Congratulations! ${candidateName}, You have completed your exam. Thank you for participating.`,
  },
  timeout: {
    title: "Timeout!",
    imageSrc: "/assets/Timeout.png",
    imageAlt: "Timeout",
    containerClass:
      "w-full max-w-[694px] rounded-[18px] border border-[var(--border-disabled)] bg-[var(--background-white)] px-6 py-8 text-center md:px-10 md:py-10",
    description: (candidateName) =>
      `Dear ${candidateName}, Your exam time has been finished. Thank you for participating.`,
  },
};

function StatusInner({ mode, candidateName, onBack }) {
  const config = STATUS_CONFIG[mode];

  if (!config) return null;

  return (
    <div className={config.containerClass}>
      <div className="mx-auto max-w-[980px]">
        <Image src={config.imageSrc} alt={config.imageAlt} width={64} height={64} className="mx-auto h-16 w-16" />
        <h2 className="mt-4 text-[38px] font-semibold leading-[46px] text-[var(--text-primary)]">{config.title}</h2>
        <p className="mx-auto mt-3 max-w-[920px] text-sm font-normal leading-7 text-[var(--test-subtext)]">
          {config.description(candidateName)}
        </p>
        <div className="mt-7">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 min-w-[180px] rounded-xl border-[var(--border-inputfield)] px-6 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--background-color)]"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AttemptStatusPanel({ mode, candidateName, onBack }) {
  if (mode === "timeout") {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
        <StatusInner mode={mode} candidateName={candidateName} onBack={onBack} />
      </div>
    );
  }

  return <StatusInner mode={mode} candidateName={candidateName} onBack={onBack} />;
}
