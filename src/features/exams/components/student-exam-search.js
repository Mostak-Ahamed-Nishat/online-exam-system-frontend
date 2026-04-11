"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function StudentExamSearch({ value, onChange, className }) {
  return (
    <div className={cn("relative w-full max-w-[621px]", className)}>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by exam title"
        className="h-11 rounded-[10px] border-[var(--border-primary)] bg-[var(--background-white)] pr-12 text-[14px] font-normal placeholder:text-[var(--test-disable)] focus-visible:ring-1"
      />
      <button
        type="button"
        className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--button-lightblue)]"
        aria-label="Search"
      >
        <Image src="/assets/aiSearchIcon.png" alt="Search" width={16} height={16} />
      </button>
    </div>
  );
}

