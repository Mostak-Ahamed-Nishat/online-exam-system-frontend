import { cn } from "@/lib/utils";

export function LumaSpin({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex h-10 w-10 items-center justify-center", className)}
    >
      <span className="absolute inset-0 rounded-full border border-[var(--border-primary)] opacity-30" />
      <span className="absolute inset-1 rounded-full border-2 border-[var(--button-primary)] border-t-transparent animate-spin [animation-duration:0.95s]" />
      <span className="absolute inset-[9px] rounded-full border border-[var(--button-secondary)] opacity-80 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--button-primary)] shadow-[0_0_12px_var(--button-primary)]" />
    </span>
  );
}
