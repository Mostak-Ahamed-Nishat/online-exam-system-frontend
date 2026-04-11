"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimpleSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
  panelClassName,
  error,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const activeLabel = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [options, value],
  );

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-12 w-full cursor-pointer items-center justify-between rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 text-left text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-primary)]",
          error ? "border-[var(--button-warning)]" : "",
          triggerClassName,
        )}
      >
        <span className={cn(activeLabel ? "text-[var(--text-primary)]" : "text-[var(--test-disable)]")}>
          {activeLabel ?? placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-[var(--icon-gray)] transition-transform", open ? "rotate-180" : "")} />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] p-1 shadow-[0_10px_25px_rgba(15,23,42,0.10)]",
            panelClassName,
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                value === option.value
                  ? "bg-[var(--button-lightblue)] text-[var(--button-primary)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--background-color)]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}


